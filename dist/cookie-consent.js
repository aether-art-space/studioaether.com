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
      return value;
    } catch {
      return null;
    }
  };

  const saveConsent = (analytics) => {
    const consent = {
      analytics,
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

  banner.querySelector("[data-cookie-consent-necessary]")?.addEventListener("click", () => saveConsent(false));
  banner.querySelector("[data-cookie-consent-all]")?.addEventListener("click", () => saveConsent(true));

  document.querySelectorAll("[data-cookie-settings]").forEach((control) => {
    control.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector("[data-cookie-consent-necessary]")?.focus();
    });
  });
})();
