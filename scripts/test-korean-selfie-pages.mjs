import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { pages } from '../src/data/routes.mjs';

const landing = '/ko/selfie-studio-budapest';
const booking = '/ko/selfie-booking';
const confirmation = '/ko/selfie-post-booking';
const html = new Map(await Promise.all([landing, booking, confirmation].map(async p => [p, await fs.readFile(`dist${p}.html`, 'utf8')])));
for (const [path, source] of html) {
  assert.match(source, /<html lang="ko"/);
  assert.match(source, /data-experiment="korean-selfie-v1"/);
  assert.equal((source.match(/<main\b/g) || []).length, 1);
  assert.doesNotMatch(source, /class="site-header"|class="site-footer"/);
  assert.match(source, /"experimentGa4Id":"G-NFVD8Z3MN2"/);
  assert.match(source, new RegExp(`rel="canonical" href="https://www.studioaether.com${path}"`));
}
assert.doesNotMatch(html.get(landing), /noindex/);
assert.match(html.get(booking), /noindex,follow/);
assert.match(html.get(confirmation), /noindex,follow/);
assert.match(html.get(landing), /Lónyay/);
assert.doesNotMatch(html.get(landing), /Tátra/);
assert.match(html.get(booking), /aether-studio\/selfie-shoot/);
assert.match(html.get(booking), /data-selfie-confirmation-path="\/ko\/selfie-post-booking"/);
const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8');
assert(sitemap.includes(landing));
assert(!sitemap.includes(booking));
assert(!sitemap.includes(confirmation));
for (const path of [landing, booking, confirmation]) {
  const page = pages.find(p => p.path === path);
  for (const alternate of Object.values(page.alternatePaths)) {
    assert.equal(pages.find(p => p.path === alternate).alternatePaths.ko, path);
  }
}

// Exercise the real embed adapter without creating an appointment or sending
// customer data. Receiving both Cal success variants must dispatch only once.
const embed = await fs.readFile('src/components/SelfieBookingEmbed.astro', 'utf8');
const script = embed.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const callbacks = new Map();
const container = { dataset: { selfieConfirmationPath: confirmation }, querySelector: () => null };
let received = 0;
const redirects = [];
const document = {
  body: { dataset: { experiment: 'korean-selfie-v1' } },
  querySelector: () => container,
  dispatchEvent: event => { assert.equal(event.type, 'selfie:booking-received'); received++; }
};
const window = {
  Cal(action, options) { if (action === 'on') callbacks.set(options.action, options.callback); },
  setTimeout(callback) { callback(); },
  location: { assign(path) { redirects.push(path); } }
};
vm.runInNewContext(script, { window, document, CustomEvent: class { constructor(type) { this.type = type; } } });
assert.equal(received, 0);
assert.equal(redirects.length, 0);
callbacks.get('bookingSuccessfulV2')({ detail: { email: 'never-forward-this@example.test' } });
callbacks.get('bookingSuccessful')();
assert.equal(received, 1);
assert.deepEqual(redirects, [confirmation]);
console.log('Korean page, SEO, booking adapter and callback checks passed.');
