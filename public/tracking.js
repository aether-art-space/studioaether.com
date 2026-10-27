/* Advanced consent mode bridge. It is only included in builds with real IDs. */
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
window.gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500
});
const config = window.siteTracking || {};
const primaryId = config.googleTagId || config.ga4Id || config.googleAdsId;
const consentCookieName = "aether_cookie_consent";
let measurementLoaded = false;
const experimentStorageKey = "aether_korean_selfie_source_v1";
let pendingExperimentView = null;

const readStoredConsent = () => {
  const entry = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${consentCookieName}=`));
  if (!entry) return null;

  try {
    const value = JSON.parse(decodeURIComponent(entry.slice(consentCookieName.length + 1)));
    if (typeof value?.analytics !== "boolean") return null;
    return {
      analytics: value.analytics,
      // Before granular choices, accepting analytics granted all optional
      // Google consent signals and rejecting denied all of them.
      adMeasurement: typeof value.adMeasurement === "boolean" ? value.adMeasurement : value.analytics,
      adPersonalization: typeof value.adPersonalization === "boolean" ? value.adPersonalization : value.analytics
    };
  } catch {
    return null;
  }
};

window.aetherCookieConsent = readStoredConsent() || {
  analytics: false,
  adMeasurement: false,
  adPersonalization: false
};

const loadGtm = () => {
  if (!config.gtmId || measurementLoaded) return;
  measurementLoaded = true;
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`;
  document.head.appendChild(script);
};

const loadGoogleTag = () => {
  if (config.gtmId || !primaryId || measurementLoaded) return;
  measurementLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", primaryId, { send_page_view: true });
  if (config.ga4Id && config.ga4Id !== primaryId) window.gtag("config", config.ga4Id, { send_page_view: false });
  if (config.googleAdsId && config.googleAdsId !== primaryId) window.gtag("config", config.googleAdsId, { send_page_view: false });
};

const loadMeasurement = () => {
  if (config.gtmId) loadGtm();
  else loadGoogleTag();
};

// Experiment events are analytics only: do not send them until analytics
// consent is granted. Source attribution uses fixed platform categories and
// never includes a URL query, fragment, or booking data.
function cleanSourceValue(value) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") : "";
}

function getExperimentSource() {
  const params = new URLSearchParams(window.location.search);
  const sourceAllowlist = new Set(["naver", "google", "instagram", "facebook", "tiktok", "youtube", "direct"]);
  const mediumAllowlist = new Set(["organic", "cpc", "paid_social", "social", "referral", "email"]);
  const source = cleanSourceValue(params.get("utm_source") || "");
  if (sourceAllowlist.has(source)) return { source_type: "utm_source", source_value: source };
  const medium = cleanSourceValue(params.get("utm_medium") || "");
  if (mediumAllowlist.has(medium)) return { source_type: "utm_medium", source_value: medium };
  try {
    const referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
    const currentHost = window.location.hostname?.toLowerCase() || "";
    if (referrerHost && referrerHost !== currentHost && !referrerHost.endsWith(`.${currentHost}`) && !referrerHost.endsWith("studioaether.com")) {
      const referrerCategories = [
        [/naver\.com$/, "naver"], [/google\.[a-z.]+$/, "google"], [/instagram\.com$/, "instagram"],
        [/facebook\.com$/, "facebook"], [/tiktok\.com$/, "tiktok"], [/youtube\.com$/, "youtube"]
      ];
      const category = referrerCategories.find(([pattern]) => pattern.test(referrerHost))?.[1];
      if (category) return { source_type: "referrer", source_value: category };
    }
  } catch { /* invalid referrer */ }
  return null;
}

function persistInitialExperimentSource() {
  if (document.body?.dataset.experiment !== "korean-selfie-v1") return;
  try {
    if (window.sessionStorage.getItem(experimentStorageKey)) return;
    const source = getExperimentSource();
    if (source) window.sessionStorage.setItem(experimentStorageKey, JSON.stringify(source));
  } catch { /* storage may be unavailable */ }
}

function clearExperimentSource() {
  try { window.sessionStorage.removeItem(experimentStorageKey); } catch { /* storage may be unavailable */ }
}

function readExperimentSource() {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(experimentStorageKey) || "null");
    if (stored && typeof stored.source_type === "string" && typeof stored.source_value === "string") return stored;
  } catch { /* storage may be unavailable */ }
  return {};
}

function sendExperimentEvent(eventName, extra = {}) {
  if (window.aetherCookieConsent?.analytics !== true) {
    if (eventName === "korean_selfie_landing_view" || eventName === "korean_selfie_booking_view") {
      pendingExperimentView = eventName;
    }
    return;
  }
  const experimentId = document.body?.dataset.experiment;
  if (!experimentId) return;
  const language = document.documentElement.lang || "unknown";
  const payload = { experiment_id: experimentId, language, ...readExperimentSource(), ...extra };
  if (config.experimentGa4Id && window.gtag) {
    window.gtag("event", eventName, {
      ...payload,
      send_to: config.experimentGa4Id,
      transport_type: "beacon"
    });
  } else if (config.gtmId) {
    window.dataLayer.push({ event: eventName, ...payload });
  } else if (window.gtag) {
    window.gtag("event", eventName, payload);
  }
}

const experimentId = document.body?.dataset.experiment;
const experimentPath = window.location.pathname.replace(/\/$/, "");
if (experimentId === "korean-selfie-v1") {
  let bookingReceivedSent = false;
  document.addEventListener("selfie:booking-received", () => {
    if (bookingReceivedSent) return;
    bookingReceivedSent = true;
    sendExperimentEvent("korean_selfie_booking_received");
  });
}

window.aetherApplyCookieConsent = (consent) => {
  const analyticsGranted = consent?.analytics === true;
  const adMeasurementGranted = consent?.adMeasurement === true;
  const adPersonalizationGranted = consent?.adPersonalization === true;
  window.aetherCookieConsent = {
    analytics: analyticsGranted,
    adMeasurement: adMeasurementGranted,
    adPersonalization: adPersonalizationGranted
  };
  if (analyticsGranted) persistInitialExperimentSource();
  else clearExperimentSource();
  window.gtag("consent", "update", {
    ad_storage: adMeasurementGranted ? "granted" : "denied",
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_user_data: adMeasurementGranted ? "granted" : "denied",
    ad_personalization: adPersonalizationGranted ? "granted" : "denied"
  });
  if (analyticsGranted && pendingExperimentView) {
    const eventName = pendingExperimentView;
    pendingExperimentView = null;
    sendExperimentEvent(eventName);
  }
};

document.addEventListener("click", (event) => {
  const target = event.target.closest?.("[data-gtag-event]");
  if (!target || !window.gtag || !(window.aetherCookieConsent.analytics || window.aetherCookieConsent.adMeasurement)) return;
  const eventName = target.dataset.gtagEvent;
  const location = target.dataset.gtagLocation || undefined;
  const linkUrl = target.href || undefined;

  if (experimentId === "korean-selfie-v1" && eventName === "selfie_booking_click") {
    sendExperimentEvent("korean_selfie_booking_click", { location });
    return;
  }

  // When GTM is configured, it remains the source of truth for events.
  // Do not manufacture a conversion event here: the current Wix event sources
  // must be observed in GTM Preview and reproduced deliberately before launch.
  if (config.gtmId) return;

  window.gtag("event", eventName, { link_url: linkUrl, location });
});

// Apply stored consent and capture attribution before recording this page view.
window.aetherApplyCookieConsent(window.aetherCookieConsent);
loadMeasurement();
if (experimentId === "korean-selfie-v1") {
  if (experimentPath.endsWith("/ko/selfie-studio-budapest")) sendExperimentEvent("korean_selfie_landing_view");
  if (experimentPath.endsWith("/ko/selfie-booking")) sendExperimentEvent("korean_selfie_booking_view");
}
