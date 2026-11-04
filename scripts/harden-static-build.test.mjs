import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { hardenStaticBuild } from "./harden-static-build.mjs";

test("static CSP externalizes executable scripts and preserves inert structured data", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "aether-csp-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, "_headers"), "/*\n  Content-Security-Policy: script-src 'self' 'unsafe-inline' https://cal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com;\n");
  const source = 'window.siteTracking={gtmId:"test"};';
  await writeFile(path.join(directory, "index.html"), `<script>${source}</script><script type="application/ld+json">{"@type":"WebPage"}</script><script src="/tracking.js" defer></script>`);
  await hardenStaticBuild(directory);
  const html = await readFile(path.join(directory, "index.html"), "utf8");
  const scripts = await readdir(path.join(directory, "_astro"));
  assert.equal(scripts.length, 1);
  assert.equal(await readFile(path.join(directory, "_astro", scripts[0]), "utf8"), source);
  assert.ok(html.includes(`<script src="/_astro/${scripts[0]}"></script>`));
  assert.ok(html.includes('type="application/ld+json">{"@type":"WebPage"}'));
  assert.ok(html.includes('src="/tracking.js" defer'));
  const headers = await readFile(path.join(directory, "_headers"), "utf8");
  assert.ok(!/script-src[^;]*'unsafe-inline'/.test(headers));
  assert.ok(!headers.includes("fonts.googleapis.com"));
  assert.ok(headers.includes("https://cal.com"));
});
