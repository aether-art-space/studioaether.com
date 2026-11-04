/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_DEPLOY_ENV?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_GOOGLE_TAG_ID?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_ID?: string;
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  readonly PUBLIC_WEDDING_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer: unknown[];
  siteTracking?: Record<string, string>;
  aetherApplyCookieConsent: (consent?: { analytics?: boolean; adMeasurement?: boolean; adPersonalization?: boolean }) => void;
  aetherCookieConsent?: { analytics: boolean; adMeasurement?: boolean; adPersonalization?: boolean };
  gtag?: (...args: unknown[]) => void;
}
