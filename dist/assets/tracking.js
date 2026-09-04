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
window.gtag("js", new Date());
const config = window.siteTracking || {};
const primaryId = config.googleTagId || config.ga4Id || config.googleAdsId;
if (primaryId) window.gtag("config", primaryId, { send_page_view: true });
if (config.ga4Id && config.ga4Id !== primaryId) window.gtag("config", config.ga4Id, { send_page_view: false });
if (config.googleAdsId && config.googleAdsId !== primaryId) window.gtag("config", config.googleAdsId, { send_page_view: false });
document.addEventListener("click", (event) => {
  const target = event.target.closest?.("[data-gtag-event]");
  if (!target || !window.gtag) return;
  window.gtag("event", target.dataset.gtagEvent, { link_url: target.href || undefined, location: target.dataset.gtagLocation || undefined });
});
