const DEFAULT_TIMEOUT_MS = 15_000;

/** @typedef {{eventName?: string, formType?: string, pagePath?: string, location?: string, timeoutMs?: number, formData?: FormData, subjectPrefix?: string}} SubmitWeb3FormOptions */

/** Submit a Web3Forms form with bounded waiting and privacy-safe conversion tracking. */
/** @param {HTMLFormElement} form @param {SubmitWeb3FormOptions} [options] */
export async function submitWeb3Form(form, { eventName = "contact_form_submit", formType = "general_contact", pagePath = "", location = "contact-form", timeoutMs = DEFAULT_TIMEOUT_MS, formData, subjectPrefix = "Website enquiry" } = {}) {
  const data = formData || new FormData(form);
  if (!formData) {
    const submitterName = String(data.get("name") || "").trim();
    data.set("from_name", submitterName ? `${submitterName} via aether` : "aether art space");
    data.set("subject", submitterName ? `${subjectPrefix} — ${submitterName}` : `New ${subjectPrefix.toLowerCase()}`);
    data.set("replyto", String(data.get("email") || "").trim());
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let result;
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    try { result = await response.json(); }
    catch { throw new Error("The submission service returned an invalid response. Please try again or email us."); }
    if (!response.ok || result?.success !== true) {
      throw new Error(typeof result?.message === "string" && result.message ? result.message : "Submission failed. Please try again or email us.");
    }
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Submission timed out. Please try again or email us.");
    throw error;
  } finally {
    clearTimeout(timer);
  }

  // Keep form conversion events limited to fixed, non-identifying labels.
  /** @type {Window & {aetherCookieConsent?: {analytics?: boolean, adMeasurement?: boolean}, dataLayer?: Array<Record<string, unknown>>}} */
  const trackingWindow = window;
  if (trackingWindow.aetherCookieConsent?.analytics === true || trackingWindow.aetherCookieConsent?.adMeasurement === true) {
    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.dataLayer.push({ event: eventName, form_type: formType, page_path: pagePath, location });
  }
  return result;
}
