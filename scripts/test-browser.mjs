import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist');
const outputDir = resolve('tmp/health-check');
const baseOverride = process.env.TEST_BASE_URL;
const expectedPages = ['/booking', '/hu/booking', '/de/booking', '/ko/selfie-studio-budapest'];
const screenshots = [
  ['/wedding-photography', 'wedding-desktop', { width: 1440, height: 1000 }],
  ['/wedding-photography', 'wedding-mobile', { width: 390, height: 844 }],
  ['/hu/wedding-photography', 'wedding-hu-mobile', { width: 390, height: 844 }],
  ['/booking', 'en-desktop', { width: 1440, height: 1000 }],
  ['/booking', 'en-mobile', { width: 390, height: 844 }],
  ['/hu/booking', 'hu-mobile', { width: 390, height: 844 }],
  ['/de/booking', 'de-desktop', { width: 1440, height: 1000 }],
  ['/ko/selfie-studio-budapest', 'ko-mobile', { width: 390, height: 844 }],
  ['/ko/selfie-studio-budapest', 'ko-desktop', { width: 1440, height: 1000 }]
];
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

async function startStaticServer() {
  assert.ok(existsSync(root), 'dist/ is missing; build the site before running browser tests');
  const headerText = await readFile(join(root, '_headers'), 'utf8').catch(() => '');
  const globalHeaders = {};
  let activeRule = null;
  for (const line of headerText.split(/\r?\n/)) {
    if (/^\S/.test(line) && line.trim()) activeRule = line.trim();
    else if (activeRule === '/*' && /^\s+[^:]+:/.test(line)) {
      const [name, ...value] = line.trim().split(':'); globalHeaders[name] = value.join(':').trim();
    }
  }
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const safePath = normalize(pathname).replace(/^([/\\]|\.\.(?:[/\\]|$))+/, '');
    let file = join(root, safePath || 'index.html');
    try {
      try {
        if ((await stat(file)).isDirectory()) file = existsSync(`${file}.html`) ? `${file}.html` : join(file, 'index.html');
      } catch {
        if (!extname(file) && existsSync(`${file}.html`)) file = `${file}.html`;
        else throw new Error(`No static file for ${pathname}`);
      }
      const body = await readFile(file);
      response.writeHead(200, { ...globalHeaders, 'Content-Type': mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404, { ...globalHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}

async function main() {
  let server;
  let baseURL = baseOverride;
  if (!baseURL) ({ server, url: baseURL } = await startStaticServer());
  const browserOptions = {};
  if (process.env.CHROME_EXECUTABLE_PATH) browserOptions.executablePath = process.env.CHROME_EXECUTABLE_PATH;
  else if (process.platform === 'darwin') {
    const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (existsSync(chrome)) browserOptions.executablePath = chrome;
  }
  const browser = await chromium.launch({ headless: true, ...browserOptions });
  const pageErrors = [];
  const missingAssets = [];
  try {
    await mkdir(outputDir, { recursive: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      const url = response.url();
      if (url.startsWith(baseURL) && response.status() >= 400 && !new URL(url).pathname.endsWith('.html')) missingAssets.push(`${response.status()} ${new URL(url).pathname}`);
    });
    let web3Outcome = 'success';
    await page.route('https://api.web3forms.com/submit', (route) => route.fulfill({ status: web3Outcome === 'success' ? 200 : 400, contentType: 'application/json', body: JSON.stringify({ success: web3Outcome === 'success', message: web3Outcome === 'success' ? 'Sent' : 'Test failure' }) }));
    await page.route('**://{app.,}cal.com/**', (route) => route.abort());
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (/cal\.com/i.test(url)) return route.fallback();
      if (/google|googletagmanager|google-analytics|doubleclick/i.test(url)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
      if (/api\.web3forms\.com/i.test(url)) return route.fallback();
      return route.continue();
    });

    for (const path of expectedPages) {
      const response = await page.goto(new URL(path, baseURL).href, { waitUntil: 'domcontentloaded' });
      assert.equal(response?.status(), 200, `Expected ${path} to load`);
      await page.locator('h1').first().waitFor();
      assert.equal(await page.locator('h1').count(), 1, `${path} should have one h1`);
      assert.ok(await page.locator('link[rel=canonical]').getAttribute('href'), `${path} should have canonical URL`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${path} document overflow`);
    }
    for (const [path, name, viewport] of screenshots) {
      await page.setViewportSize(viewport);
      await page.goto(new URL(path, baseURL).href, { waitUntil: 'domcontentloaded' });
      await page.screenshot({ path: join(outputDir, `${name}.png`), fullPage: true, animations: 'disabled' });
    }

    if (!baseOverride) {
      await page.goto(new URL('/booking', baseURL).href);
      const localMissing = await page.evaluate(async () => {
        const urls = [...document.querySelectorAll('img[src],script[src],link[rel=stylesheet][href]')].map((el) => el.src || el.href).filter((url) => url.startsWith(location.origin));
        const results = await Promise.all(urls.map(async (url) => ({ url, status: (await fetch(url, { method: 'HEAD' })).status })));
        return results.filter((item) => item.status >= 400);
      });
      assert.deepEqual(localMissing, [], 'Local page assets should resolve');

      // Semantic heading order in the booking and wedding package sections.
      for (const [path, sectionSelector, expectedTitleLevel] of [['/booking', '.booking-price-section', 'H2'], ['/wedding-photography', '.wedding-packages', 'H3']]) {
        await page.goto(new URL(path, baseURL).href, { waitUntil: 'domcontentloaded' });
        const section = page.locator(sectionSelector);
        assert.equal(await section.count(), 1, `${path} should contain ${sectionSelector}`);
        const hasExpectedHeading = await section.locator('.price-card__title').evaluateAll((nodes, tagName) => nodes.some((node) => node.tagName === tagName), expectedTitleLevel);
        assert.ok(hasExpectedHeading, `${path} card heading should be ${expectedTitleLevel}`);
      }

      // Gallery open, next, Escape close, and focus restoration.
      await page.goto(new URL('/props', baseURL).href);
      const galleryImage = page.locator('[data-gallery-image]').first();
      assert.ok(await galleryImage.count(), 'Props page should contain gallery images');
      {
        await galleryImage.scrollIntoViewIfNeeded(); await galleryImage.focus(); await page.keyboard.press('Enter');
        const lightbox = page.locator('[data-studio-lightbox]');
        await lightbox.waitFor({ state: 'visible' });
        await lightbox.locator('[data-lightbox-next]').click();
        await lightbox.locator('[data-lightbox-close]').click();
        await lightbox.waitFor({ state: 'hidden' });
        assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-gallery-image')), true, 'Gallery close should restore focus');
        await galleryImage.focus(); await page.keyboard.press('Enter');
        await lightbox.waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await lightbox.waitFor({ state: 'hidden' });
        assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-gallery-image')), true, 'Gallery should restore focus');
      }

      // Mobile navigation disclosure opens and closes.
      await page.setViewportSize({ width: 390, height: 844 }); await page.goto(new URL('/booking', baseURL).href);
      const menu = page.locator('.mobile-menu');
      await menu.locator('.mobile-nav-trigger').click(); assert.equal(await menu.evaluate((el) => el.open), true);
      await menu.locator('.mobile-nav-trigger').click(); assert.equal(await menu.evaluate((el) => el.open), false);

      // Cookie choices should save the chosen level and dismiss the banner.
      for (const [selector, expected] of [['[data-cookie-consent-necessary]', 'necessary'], ['[data-cookie-consent-measurement]', 'measurement'], ['[data-cookie-consent-all]', 'all']]) {
        await page.evaluate(() => { document.cookie = 'aether_cookie_consent=;Max-Age=0;path=/'; });
        await page.goto(new URL('/booking', baseURL).href);
        const banner = page.locator('[data-cookie-consent]');
        assert.equal(await banner.count(), 1, 'Production page should render cookie choices');
        await banner.locator(selector).click();
        assert.equal(await banner.isHidden(), true, 'Cookie prompt should dismiss after a choice');
        const consent = await page.evaluate(() => {
          const raw = document.cookie.split('; ').find((part) => part.startsWith('aether_cookie_consent='))?.split('=').slice(1).join('=');
          return raw ? JSON.parse(decodeURIComponent(raw)) : null;
        });
        assert.ok(consent, `Cookie choice ${expected} should persist`);
        assert.equal(consent.analytics, expected === 'all', `Cookie choice ${expected} analytics value`);
        assert.equal(consent.adMeasurement, expected !== 'necessary', `Cookie choice ${expected} measurement value`);
        assert.equal(consent.adPersonalization, expected === 'all', `Cookie choice ${expected} personalization value`);
      }

      // Contact submission uses an intercepted Web3Forms response only. Email must not enter dataLayer.
      await page.goto(new URL('/booking', baseURL).href);
      await page.evaluate(() => { document.cookie = 'aether_cookie_consent=;Max-Age=0;path=/'; window.dataLayer = []; });
      const consentBanner = page.locator('[data-cookie-consent]');
      if (await consentBanner.count() && !(await consentBanner.isHidden())) await consentBanner.locator('[data-cookie-consent-necessary]').click();
      const contactTrigger = page.locator('[data-site-contact-open]:visible').first();
      if (await contactTrigger.count()) {
        await contactTrigger.click();
        const form = page.locator('[data-site-web3forms]');
        await form.locator('[name=name]').fill('Browser Check');
        await form.locator('[name=email]').fill('private-test@example.invalid');
        await form.locator('[name=message]').fill('Automated browser test');
        await form.locator('[type=submit]').click();
        await page.locator('[data-site-contact-status]').filter({ hasText: /thank you|köszönjük|danke/i }).waitFor({ timeout: 5000 });
        assert.equal(await page.evaluate(() => JSON.stringify(window.dataLayer || []).includes('private-test@example.invalid')), false, 'Raw email must not enter dataLayer');
        assert.equal(await page.evaluate(() => (window.dataLayer || []).some((item) => item.event === 'contact_form_submit')), false, 'Rejected consent must not record form events');
        await page.locator('[data-site-contact-close]').click();
        await page.locator('[data-cookie-settings]').first().click().catch(() => {});
        if (await consentBanner.count() && await consentBanner.isVisible()) await consentBanner.locator('[data-cookie-consent-all]').click();
        await contactTrigger.click();
        await form.locator('[name=name]').fill('Browser Check');
        await form.locator('[name=email]').fill('private-test@example.invalid');
        await form.locator('[name=message]').fill('Automated browser test');
        await form.locator('[type=submit]').click();
        await page.locator('[data-site-contact-status]').filter({ hasText: /thank you|köszönjük|danke/i }).waitFor({ timeout: 5000 });
        assert.equal(await page.evaluate(() => JSON.stringify(window.dataLayer || []).includes('private-test@example.invalid')), false, 'Raw email must not enter dataLayer after consent');
        assert.ok(await page.evaluate(() => (window.dataLayer || []).some((item) => item.event === 'contact_form_submit' && item.form_type === 'general_contact')), 'Allowed consent should record a privacy-safe form event');
        await form.locator('[name=name]').fill('Browser Check');
        await form.locator('[name=email]').fill('private-test@example.invalid');
        await form.locator('[name=message]').fill('Automated browser test');
        web3Outcome = 'error';
        await form.locator('[type=submit]').click();
        await page.locator('[data-site-contact-status][data-error="true"]').waitFor({ timeout: 5000 });
        assert.equal(await page.evaluate(() => JSON.stringify(window.dataLayer || []).includes('private-test@example.invalid')), false, 'Failed submission must not expose raw email in dataLayer');
      }

      // External Cal embed stays blocked; fallback links and noscript guidance remain available.
      await page.goto(new URL('/ko/selfie-booking', baseURL).href);
      await page.locator('[data-cal-inline="aether-studio/selfie-shoot"]').waitFor();
      await page.locator('.selfie-booking-embed__calendar--failed').waitFor({ timeout: 20000 });
      assert.ok(await page.locator('.selfie-booking-embed__fallback-links a').count() > 0);
      assert.ok(await page.locator('noscript').count() > 0);
    }
    assert.deepEqual(pageErrors, [], `Browser page errors: ${pageErrors.join('; ')}`);
    assert.deepEqual(missingAssets, [], `Missing local assets: ${missingAssets.join('; ')}`);
    console.log(`Browser smoke checks passed at ${baseURL}; screenshots: ${outputDir}`);
  } finally {
    await browser.close();
    if (server) await new Promise((resolveClose) => server.close(resolveClose));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
