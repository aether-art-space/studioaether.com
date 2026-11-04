import assert from "node:assert/strict";

const origin = (process.env.HEALTH_CHECK_URL || "https://www.studioaether.com").replace(/\/$/, "");
const get = async (pathname) => {
  const response = await fetch(new URL(pathname, origin), { signal: AbortSignal.timeout(30_000) });
  return { response, body: await response.text() };
};
const { response: sitemapResponse, body: sitemap } = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "sitemap unavailable");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => {
  assert.equal(new URL(url).origin, origin, "sitemap contains unexpected hostname");
  return new URL(url).pathname;
});
assert.ok(paths.length >= 80, "sitemap unexpectedly shrank");
for (let offset = 0; offset < paths.length; offset += 5) {
  await Promise.all(paths.slice(offset, offset + 5).map(async (pathname) => {
    const { response, body } = await get(pathname);
    assert.equal(response.status, 200, `${pathname}: failed to load`);
    assert.equal(new URL(response.url).pathname, pathname, `${pathname}: unexpected redirect`);
    const canonical = body.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    assert.equal(canonical, `${origin}${pathname}`, `${pathname}: canonical mismatch`);
    assert.equal([...body.matchAll(/<h1\b/g)].length, 1, `${pathname}: H1 count`);
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="noindex/.test(body), `${pathname}: unexpected noindex`);
    assert.ok(/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(body), `${pathname}: missing description`);
    const csp = response.headers.get("content-security-policy") || "";
    assert.ok(csp.includes("frame-ancestors 'none'"), `${pathname}: missing security policy`);
    assert.ok(!csp.match(/script-src[^;]*'unsafe-inline'/), `${pathname}: scripts permit unsafe-inline`);
  }));
}
for (const pathname of ["/selfie-booking", "/hu/selfie-booking", "/de/selfie-booking", "/ko/selfie-booking"]) {
  const { response, body } = await get(pathname);
  assert.equal(response.status, 200, `${pathname}: booking page unavailable`);
  assert.ok(body.includes('href="https://cal.com/aether-studio/selfie-shoot"'), `${pathname}: missing direct booking fallback`);
  assert.ok(body.includes("noindex,follow"), `${pathname}: booking page should remain noindexed`);
}
const { response: notFound } = await get("/health-check-intentionally-missing");
assert.equal(notFound.status, 404, "unknown URL should return a genuine 404");
const { response: prototype } = await get("/ui-library-prototype");
assert.equal(prototype.status, 404, "internal prototype is publicly accessible");
const { body: robots } = await get("/robots.txt");
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots sitemap missing");
console.log(`Production health checks passed: ${paths.length} indexable routes, four booking routes, robots, security headers and 404s.`);
