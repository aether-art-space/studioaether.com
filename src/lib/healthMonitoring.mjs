// Only aggregate numeric performance values and fixed error categories leave
// the page. Never forward error messages, stacks, DOM attribution or form data.
export function reportVital({ name, value, delta, id, rating }) {
  if (window.aetherCookieConsent?.analytics !== true || !window.gtag) return;
  if (!["CLS", "INP", "LCP"].includes(name) || !Number.isFinite(value) || !Number.isFinite(delta)) return;
  window.gtag("event", name, {
    value: delta,
    metric_value: value,
    metric_delta: delta,
    metric_id: id,
    metric_rating: rating,
    page_location: `${window.location.origin}${window.location.pathname}`,
    non_interaction: true
  });
}

export function reportRuntimeError(source) {
  if (window.aetherCookieConsent?.analytics !== true || !window.gtag) return;
  if (!["script", "promise"].includes(source)) return;
  window.gtag("event", "site_runtime_error", {
    error_source: source,
    page_location: `${window.location.origin}${window.location.pathname}`,
    non_interaction: true
  });
}
