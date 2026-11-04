import assert from "node:assert/strict";
import { reportVital, reportRuntimeError } from "../src/lib/healthMonitoring.mjs";
const prior = globalThis.window;
const calls = [];
globalThis.window = { aetherCookieConsent: { analytics: false, adMeasurement: true }, gtag: (...args) => calls.push(args), location: { origin: "https://www.studioaether.com", pathname: "/booking", search: "?email=private@example.com" } };
try {
  const metric = { name: "LCP", value: 1500, delta: 1500, id: "navigation-only", rating: "good", entries: [{ name: "private@example.com" }] };
  reportVital(metric);
  reportRuntimeError("script");
  assert.equal(calls.length, 0, "ad consent alone must not enable health analytics");
  window.aetherCookieConsent.analytics = true;
  reportVital(metric);
  reportRuntimeError("promise");
  assert.equal(calls.length, 2);
  assert.equal(calls[0][1], "LCP");
  assert.equal(calls[0][2].page_location, "https://www.studioaether.com/booking");
  assert.ok(!JSON.stringify(calls).includes("private@example.com"));
  reportVital({ ...metric, name: "arbitrary_event" });
  reportRuntimeError("private@example.com");
  assert.equal(calls.length, 2, "only fixed health categories are allowed");
  window.aetherCookieConsent.analytics = false;
  reportVital(metric);
  assert.equal(calls.length, 2, "withdrawing consent stops reporting");
} finally { globalThis.window = prior; }
console.log("Health monitoring consent and payload checks passed.");
