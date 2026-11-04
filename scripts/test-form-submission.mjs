import assert from "node:assert/strict";
import { submitWeb3Form } from "../public/form-submission.js";

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalFormData = globalThis.FormData;
class FakeFormData {
  values = new Map([["name", "Test Name"], ["email", "test@example.com"]]);
  constructor() {}
  get(key) { return this.values.get(key) ?? null; }
  set(key, value) { this.values.set(key, value); }
}
globalThis.FormData = FakeFormData;
const form = { action: "https://api.web3forms.com/submit" };

try {
  const events = [];
  globalThis.window = { aetherCookieConsent: { analytics: true, adMeasurement: false }, dataLayer: events };
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.method, "POST");
    assert.ok(options.signal);
    return { ok: true, json: async () => ({ success: true }) };
  };
  await submitWeb3Form(form, { formType: "wedding_enquiry", pagePath: "/wedding-photography", location: "wedding-page" });
  assert.deepEqual(events, [{ event: "contact_form_submit", form_type: "wedding_enquiry", page_path: "/wedding-photography", location: "wedding-page" }]);
  assert.equal(JSON.stringify(events).includes("test@example.com"), false);

  const weddingData = new FakeFormData();
  window.aetherCookieConsent = { analytics: false, adMeasurement: false };
  weddingData.set("subject", "Wedding enquiry — Test Name");
  weddingData.set("replyto", "test@example.com");
  globalThis.fetch = async (_url, { body }) => {
    assert.equal(body, weddingData);
    assert.equal(body.get("subject"), "Wedding enquiry — Test Name");
    assert.equal(body.get("replyto"), "test@example.com");
    return { ok: true, json: async () => ({ success: true }) };
  };
  await submitWeb3Form(form, { formData: weddingData, subjectPrefix: "Wedding enquiry", formType: "wedding_enquiry" });

  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
  await submitWeb3Form(form);
  assert.equal(events.length, 1, "no event is emitted without measurement consent");

  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError("bad json"); } });
  await assert.rejects(submitWeb3Form(form), /invalid response/i);
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ success: false, message: "Rejected" }) });
  await assert.rejects(submitWeb3Form(form), /Rejected/);

  globalThis.fetch = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError"))));
  await assert.rejects(submitWeb3Form(form, { timeoutMs: 10 }), /timed out/i);
} finally {
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
  globalThis.FormData = originalFormData;
}

console.log("Form submission checks passed.");
