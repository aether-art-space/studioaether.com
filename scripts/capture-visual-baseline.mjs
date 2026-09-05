import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = (process.env.VISUAL_BASELINE_URL || "https://www.studioaether.com").replace(/\/$/, "");
const outputDirectory = path.join(root, "docs", "baseline", "visual", new URL(origin).hostname);
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  { id: "home", path: "/" },
];

const viewports = [
  { id: "desktop-1440", width: 1440, height: 900, isMobile: false },
  { id: "mobile-390", width: 390, height: 844, isMobile: true },
];

const metrics = () => {
  const rectangle = (element) => {
    if (!element) return null;
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      x: Number(box.x.toFixed(2)), y: Number(box.y.toFixed(2)),
      width: Number(box.width.toFixed(2)), height: Number(box.height.toFixed(2)),
      fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
      lineHeight: style.lineHeight, letterSpacing: style.letterSpacing,
      color: style.color, backgroundColor: style.backgroundColor,
    };
  };
  const exactText = (text) => [...document.querySelectorAll("a, button, span")]
    .find((element) => element.children.length === 0 && element.textContent?.trim().toLowerCase() === text);
  const text = (selector) => [...document.querySelectorAll(selector)].map((element) => ({
    text: element.textContent?.replace(/\s+/g, " ").trim(),
    ...rectangle(element),
  })).filter((entry) => entry.text);

  return {
    capturedAt: new Date().toISOString(),
    location: location.href,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    page: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
    header: rectangle(document.querySelector("#SITE_HEADER, header")),
    controls: {
      logo: rectangle(document.querySelector("#SITE_HEADER img, header img")),
      studio: rectangle(exactText("the studio")),
      residentArtists: rectangle(exactText("resident artists")),
      photographyServices: rectangle(exactText("photography services")),
      mentoring: rectangle(exactText("mentoring")),
      booking: rectangle(exactText("prices & booking")),
      language: rectangle(exactText("en") || exactText("hu")),
    },
    headings: text("h1, h2, h3"),
    images: [...document.images].map((image) => ({
      alt: image.alt, src: image.currentSrc || image.src, ...rectangle(image),
    })).filter((image) => image.width > 0 && image.height > 0),
  };
};

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const manifest = { origin, generatedAt: new Date().toISOString(), pages: [] };

try {
  for (const sourcePage of pages) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        deviceScaleFactor: 1,
        colorScheme: "light",
      });
      const page = await context.newPage();
      const url = new URL(sourcePage.path, `${origin}/`).href;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForTimeout(2_000);

      // The consent banner is not part of the website design being migrated.
      const accept = page.getByRole("button", { name: /^accept$/i });
      if (await accept.count()) await accept.first().click({ timeout: 2_000 }).catch(() => {});

      const basename = `${sourcePage.id}-${viewport.id}`;
      const screenshot = path.join(outputDirectory, `${basename}.png`);
      const measurement = path.join(outputDirectory, `${basename}.json`);
      await page.screenshot({ path: screenshot, fullPage: true, animations: "disabled", timeout: 60_000 });
      const result = await page.evaluate(metrics);
      await writeFile(measurement, `${JSON.stringify(result, null, 2)}\n`);
      manifest.pages.push({ id: sourcePage.id, path: sourcePage.path, viewport: viewport.id, screenshot: path.relative(root, screenshot), measurement: path.relative(root, measurement) });
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(path.join(outputDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Visual baseline written to ${path.relative(root, outputDirectory)}`);
