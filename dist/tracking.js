/* Opt-in measurement bridge. It is only included in builds with real IDs. */
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
let googleTagLoaded = false;

const readStoredConsent = () => {
  const entry = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${consentCookieName}=`));
  if (!entry) return null;

  try {
    const value = JSON.parse(decodeURIComponent(entry.slice(consentCookieName.length + 1)));
    return typeof value?.analytics === "boolean" ? value : null;
  } catch {
    return null;
  }
};

window.aetherCookieConsent = readStoredConsent() || { analytics: false };

const loadGoogleTag = () => {
  if (!primaryId || googleTagLoaded) return;
  googleTagLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", primaryId, { send_page_view: true });
  if (config.ga4Id && config.ga4Id !== primaryId) window.gtag("config", config.ga4Id, { send_page_view: false });
  if (config.googleAdsId && config.googleAdsId !== primaryId) window.gtag("config", config.googleAdsId, { send_page_view: false });
};

window.aetherApplyCookieConsent = (consent) => {
  const analyticsGranted = consent?.analytics === true;
  window.aetherCookieConsent = { analytics: analyticsGranted };
  window.gtag("consent", "update", {
    ad_storage: analyticsGranted ? "granted" : "denied",
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_user_data: analyticsGranted ? "granted" : "denied",
    ad_personalization: analyticsGranted ? "granted" : "denied"
  });
  if (analyticsGranted) loadGoogleTag();
};

if (window.aetherCookieConsent.analytics) window.aetherApplyCookieConsent(window.aetherCookieConsent);

document.addEventListener("click", (event) => {
  const target = event.target.closest?.("[data-gtag-event]");
  if (!target || !window.gtag || !window.aetherCookieConsent.analytics) return;
  window.gtag("event", target.dataset.gtagEvent, { link_url: target.href || undefined, location: target.dataset.gtagLocation || undefined });
});
