import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../public/tracking.js", import.meta.url), "utf8");

function runPage({ path, query = "", consent = false, storedConsent = null, storage = new Map(), experiment = "korean-selfie-v1", referrer = "", clickTarget = null }) {
  const listeners = {};
  const dataLayer = [];
  const gtagCalls = [];
  const window = {
    dataLayer,
    siteTracking: { gtmId: "GTM-TEST", experimentGa4Id: "G-TEST" },
    location: { pathname: path, search: query, hostname: "www.studioaether.com" },
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key)
    },
    gtag: (...args) => { gtagCalls.push(args); dataLayer.push(args); }
  };
  const document = {
    cookie: storedConsent ? `aether_cookie_consent=${encodeURIComponent(JSON.stringify(storedConsent))}` : "",
    referrer,
    body: { dataset: { experiment } },
    documentElement: { lang: "ko" },
    head: { appendChild() {} },
    createElement: () => ({}),
    addEventListener: (name, callback) => { listeners[name] = callback; }
  };
  vm.runInNewContext(source, {
    window, document, URL, URLSearchParams, encodeURIComponent,
    setTimeout, clearTimeout
  });
  if (consent) window.aetherApplyCookieConsent({ analytics: true });
  return { dataLayer, gtagCalls, listeners, window, storage, clickTarget };
}

const gaEvent = (page, eventName) => page.gtagCalls.find(([command, name]) => command === "event" && name === eventName);

const denied = runPage({ path: "/ko/selfie-studio-budapest", query: "?utm_source=naver" });
assert.equal(gaEvent(denied, "korean_selfie_landing_view"), undefined);
denied.window.aetherApplyCookieConsent({ analytics: true });
const delayedView = gaEvent(denied, "korean_selfie_landing_view")?.[2];
assert.equal(delayedView?.source_type, "utm_source");
assert.equal(delayedView?.source_value, "naver");
assert.equal(delayedView?.experiment_id, "korean-selfie-v1");
assert.equal(delayedView?.language, "ko");
assert.equal(delayedView?.send_to, "G-TEST");
assert.equal(delayedView?.transport_type, "beacon");

const saved = { analytics: true, adMeasurement: false, adPersonalization: false };
const sharedStorage = new Map();
const externalLanding = runPage({ path: "/ko/selfie-studio-budapest", storedConsent: saved, storage: sharedStorage, referrer: "https://search.naver.com/search.naver?query=private" });
const firstView = gaEvent(externalLanding, "korean_selfie_landing_view")?.[2];
assert.equal(firstView?.source_type, "referrer");
assert.equal(firstView?.source_value, "naver");
externalLanding.window.aetherApplyCookieConsent(saved);
assert.equal(externalLanding.gtagCalls.filter(([, name]) => name === "korean_selfie_landing_view").length, 1);
const internalBooking = runPage({ path: "/ko/selfie-booking", storedConsent: saved, storage: sharedStorage, referrer: "https://www.studioaether.com/ko/selfie-studio-budapest" });
const bookingView = gaEvent(internalBooking, "korean_selfie_booking_view")?.[2];
assert.equal(bookingView?.source_value, "naver");

const adOnly = runPage({ path: "/ko/selfie-booking", consent: false });
adOnly.window.aetherApplyCookieConsent({ analytics: false, adMeasurement: true, adPersonalization: false });
adOnly.listeners.click({ target: { closest: () => ({ dataset: { gtagEvent: "selfie_booking_click", gtagLocation: "korean_selfie_hero" } }) } });
assert.equal(gaEvent(adOnly, "korean_selfie_booking_click"), undefined);

const booking = runPage({ path: "/ko/selfie-booking", query: "?utm_campaign=hello%40example.com", consent: true });
assert.notEqual(gaEvent(booking, "korean_selfie_booking_view"), undefined);
assert.equal(booking.gtagCalls.some(([, , params]) => params?.source_value?.includes("example")), false);
booking.listeners["selfie:booking-received"]();
booking.listeners["selfie:booking-received"]();
assert.equal(booking.gtagCalls.filter(([, name]) => name === "korean_selfie_booking_received").length, 1);
booking.listeners.click({ target: { closest: () => ({ dataset: { gtagEvent: "selfie_booking_click", gtagLocation: "korean_selfie_hero" } }) } });
const clickEvent = gaEvent(booking, "korean_selfie_booking_click")?.[2];
assert.equal(clickEvent?.location, "korean_selfie_hero");
assert.equal(clickEvent?.experiment_id, "korean-selfie-v1");

const confirmation = runPage({ path: "/ko/selfie-post-booking", consent: true });
assert.equal(gaEvent(confirmation, "korean_selfie_booking_received"), undefined);

const noConsentBooking = runPage({ path: "/ko/selfie-booking", consent: false });
noConsentBooking.listeners["selfie:booking-received"]();
noConsentBooking.window.aetherApplyCookieConsent({ analytics: true });
assert.equal(gaEvent(noConsentBooking, "korean_selfie_booking_received"), undefined);

console.log("Korean selfie tracking checks passed.");
