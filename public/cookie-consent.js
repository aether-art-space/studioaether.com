(() => {
  const cookieName = "aether_cookie_consent";
  const cookieMaxAge = 60 * 60 * 24 * 180;
  const banner = document.querySelector("[data-cookie-consent]");

  if (!banner) return;

  const readConsent = () => {
    const entry = document.cookie
      .split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(`${cookieName}=`));

    if (!entry) return null;

    try {
      const value = JSON.parse(decodeURIComponent(entry.slice(cookieName.length + 1)));
      if (typeof value?.analytics !== "boolean" || typeof value?.consentedAt !== "string") return null;
      // Older consent cookies had one all-or-nothing choice. Preserve the
      // meaning of those choices when introducing separate ad measurement.
      if (typeof value.adMeasurement !== "boolean" || typeof value.adPersonalization !== "boolean") {
        return {
          ...value,
          adMeasurement: value.analytics,
          adPersonalization: value.analytics
        };
      }
      return value;
    } catch {
      return null;
    }
  };

  const saveConsent = ({ analytics, adMeasurement, adPersonalization }) => {
    const consent = {
      analytics,
      adMeasurement,
      adPersonalization,
      consentedAt: new Date().toISOString()
    };
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(consent))};path=/;max-age=${cookieMaxAge};SameSite=Lax${secure}`;
    window.aetherApplyCookieConsent?.(consent);
    banner.hidden = true;
  };

  const storedConsent = readConsent();
  if (storedConsent) {
    window.aetherApplyCookieConsent?.(storedConsent);
    banner.hidden = true;
  } else {
    banner.hidden = false;
  }

  banner.querySelector("[data-cookie-consent-necessary]")?.addEventListener("click", () => saveConsent({
    analytics: false,
    adMeasurement: false,
    adPersonalization: false
  }));
  banner.querySelector("[data-cookie-consent-measurement]")?.addEventListener("click", () => saveConsent({
    analytics: false,
    adMeasurement: true,
    adPersonalization: false
  }));
  banner.querySelector("[data-cookie-consent-all]")?.addEventListener("click", () => saveConsent({
    analytics: true,
    adMeasurement: true,
    adPersonalization: true
  }));

  document.querySelectorAll("[data-cookie-settings]").forEach((control) => {
    control.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector("[data-cookie-consent-necessary]")?.focus();
    });
  });
})();
