# Tracking and measurement migration inventory

This is an investigation record for the Wix-to-V2 migration. It is deliberately conservative: an item is not copied into V2 just because it exists in a Google account.

## Status meanings

- **Keep**: supported by current-site evidence and needed for the new site.
- **Verify**: potentially relevant, but must be matched to an actual current-site behavior before implementation.
- **Exclude**: intentionally not part of V2.
- **Account artifact**: leave unchanged in Google; do not reproduce it in V2 unless later evidence requires it.

## Keep

| Item | Evidence | Migration treatment |
| --- | --- | --- |
| Production GA4 stream `studioaether.com` | GA4 property `aether art space` (`465575606`), stream ID `9890558925`, measurement ID `G-NFVD8Z3MN2`; receiving traffic | Preserve the same measurement destination. |
| Google Ads destination `AW-16760295216` | Present in the current `studioaether.com` Google tag | Preserve the destination, but verify the firing events before wiring them. |
| Consent experience | Wix Marketing Integrations shows **Advanced consent mode** enabled for GTM; GA4 reports active consent signals | Preserve advanced consent mode: load GTM with consent denied, then update consent from the V2 banner. |
| Booking and contact surfaces | Current V2 has Cal.com bookings, phone/email links and Web3Forms contact forms | Preserve the user journeys and verify their measurement separately. |

## Verify before copying

| Item | Why it is uncertain | Required evidence |
| --- | --- | --- |
| GTM container `GTM-P6G8NTP2` | The public Wix site was observed loading this container and its tags are now inventoried | Use the existing container; do not recreate or edit its tags during the site migration. |
| Google tag IDs `GT-55NS56M4` and `GT-5RML8THW` | They appear alongside the production GA4 and Ads IDs, but may be identifiers for the same Google tag setup rather than independent scripts | Inspect the Google tag destinations and installation details; do not add them as separate tags by assumption. |
| Booking events | V2 currently emits `booking_click` and `selfie_booking_click` on booking links | Match these events to the existing Ads/GA4 actions and check for duplicate firing. |
| Email and phone events | V2 emits `email_click`; Google Ads has an active `Clicks to call` action | Confirm whether the current Wix setup measures email clicks, phone clicks, or both. |
| Lead-form conversions | Google Ads contains active, misconfigured and Google-hosted lead-form actions; V2 uses Web3Forms | Determine which actual Wix form submission was measured and reproduce only that behavior. |
| Enhanced conversions | Google Ads currently reports an existing “Enhanced conversions not recording” warning | Preserve or intentionally replace only after the marketing owner confirms the intended setup; do not repair during migration. |
| GA4-to-Ads relationship | The production GA4 property has a disabled Ads link, while a separate `aczel.pictures` property has an active link to the Ads account | Treat this as an account configuration discrepancy, not as permission to enable or copy either link. |

## Exclude or leave as account artifacts

| Item | Treatment |
| --- | --- |
| Hotjar and TWIPLA | Exclude from V2 by decision. |
| Cancelled Google Ads account `634-842-5299` | Account artifact; do not use. |
| Disabled or awaiting Google Ads conversion actions | Leave unchanged unless the marketing owner explicitly identifies one as still required. |
| Existing Google Ads and Google tag warnings | Record only; do not fix as part of the site migration. |

## V2 implementation status

- The source now supports the existing GTM container through `PUBLIC_GTM_ID`; the production value is intentionally not configured yet.
- In production, the cookie banner is enabled when GTM or a direct Google tracking fallback is configured. Preview builds keep tracking disabled.
- [`public/tracking.js`](../public/tracking.js) now implements advanced consent mode: it establishes a default-denied state before loading Google measurement, then updates that state from the saved choice or consent banner.
- In GTM mode, V2 does not manufacture conversion events. The existing container remains the source of truth until each current Wix event source is observed and deliberately reproduced.
- The `/post-booking` route remains available for the confirmed Cal.com photo-studio redirect and its existing page-path triggers. The selfie event cannot use a custom redirect on its current Cal.com plan, so its outbound click remains the intentional proxy signal.

## Read-only GTM container result

The container `GTM-P6G8NTP2` is now visible under the `aether art space` account. The current workspace reports zero pending changes. It contains seven tags:

| Tag | Configuration | Trigger | Initial classification |
| --- | --- | --- | --- |
| `Google Tag G-NFVD8Z3MN2` | Base Google tag | Initialization - All Pages | **Keep** |
| `GA4 - Booking Submission` | GA4 event `Post-Booking Page View` | Page path contains `/post-booking` | **Verify flow** |
| `Google Ads Conversion Tracking` | Ads ID `16760295216`, label `RqzSCLLwy6QbELCe97c-` | Custom event `booking_event` | **Verify event source** |
| `Google Ads Conversion Tracking - Aether sikeres form beküldés - Fotóstúdió` | Ads ID from `Gads ID`, label `JLOECLS_-eYcELCe97c-`, once per page | Page path contains `/post-booking` | **Verify flow** |
| `Google Ads Conversion Tracking - Szelfi stúdió foglalás gomb katt` | Ads ID from `Gads ID`, label `kW2fCPfojOccELCe97c-`, once per page | Just Links where Click URL contains `cal.com/aether-studio/selfie-shoot` | **Keep** |
| `Google Analytics GA4 Event - Sikeres foglalás - fotóstúdió` | GA4 event `sikeres_foglalas_fotostudio` | Page path contains `/post-booking` | **Verify flow** |
| `Google Analytics GA4 Event - Szelfi studio foglalás kattintás` | GA4 event `szelfi_studio_foglalas_katt` | Just Links where Click URL contains `cal.com/aether-studio/selfie-shoot` | **Keep** |

The two user-defined constants are:

- `GA4 ID - Studio Aether` = `G-NFVD8Z3MN2`
- `Gads ID` = `16760295216`

### Parity checks to resolve before launch

- The current V2 click events are `booking_click` and `selfie_booking_click`; the old GTM booking Ads tag listens for the custom event `booking_event`. We must observe what creates `booking_event` on Wix before reproducing it in V2; it may be a click or a completion signal.
- GTM version 7, **Selfie booking trigger: match Cal.com URL**, was published on 8 Sep 2026. The shared selfie trigger now matches Click URL containing `cal.com/aether-studio/selfie-shoot`, replacing its fragile Hungarian click-text condition while preserving both referenced tags.
- The photo-studio Cal.com event (`/aether-studio/booking`) has **Redirect on booking** enabled with `https://www.studioaether.com/post-booking`; forwarding booking parameters is also enabled. This confirms that the three `/post-booking` tags represent successful photo-studio bookings and should remain unchanged through the domain cutover.
- The separate `aczel.pictures` container `GTM-TTB3D9ZQ` is visible in the same Google account list but is not part of the `studioaether.com` container. It is not included in this migration inventory.

### Live-page cross-check

On the live Wix page, the browser observed both `GTM-P6G8NTP2` and the Google tag `G-NFVD8Z3MN2`. The visible booking labels include:

- `Foglald le a fotóstúdiót` → `https://cal.com/aether-studio/booking`
- `Foglald le a szelfi studiót` → `https://cal.com/aether-studio/selfie-shoot`

The custom event name `booking_event` was not present in the rendered HTML or initial page state. A read-only search across the Wix/Velo site code returned no results for `booking_event`, and Wix Event Manager has no configured events (it only offers to scan the site). This makes the GTM tag listening for `booking_event` a likely unused artifact. Leave the tag unchanged in Google, but do not manufacture this event in V2 unless the marketing owner identifies its source or purpose.

Wix's GTM integration is connected with **Advanced consent mode** enabled. V2 now matches that loading model: Google measurement loads under denied consent and the banner updates the state after the visitor's choice.

The selfie tags are not ambiguous: both are explicitly triggered by the Cal.com selfie link click. Cal.com's **Redirect on booking** control for this event is locked behind a Teams upgrade, confirming that the outbound click is the intentional proxy signal rather than evidence of a completed booking.

## Next evidence required before DNS cutover

1. Preserve `/post-booking` and its three existing path-triggered tags; Cal.com's photo-studio event is confirmed to return there after successful booking.
2. Preserve the selfie click as a proxy conversion. Its shared GTM trigger now uses the durable Cal.com URL and works with both Wix and V2 labels.
3. Treat the `booking_event` tag as a likely artifact unless its current source or purpose is identified; do not create a new event merely to make that tag fire.
4. Compare Wix and a private V2 preview in Tag Assistant, then add `PUBLIC_GTM_ID=GTM-P6G8NTP2` to production. Keep direct Google IDs unset there so tags do not fire twice.

## Local production-mode verification

On 9 Sep 2026, V2 was run locally with `PUBLIC_DEPLOY_ENV=production` and `PUBLIC_GTM_ID=GTM-P6G8NTP2`:

- A fresh visit displayed the consent banner while loading exactly one GTM container and its GA4 Google tag, confirming the advanced-consent loading order.
- **Accept all** hid the banner and persisted across reload.
- **Only necessary** also hid the banner and persisted across reload while GTM continued to load exactly once under denied consent.
- The local selfie links resolve to `https://cal.com/aether-studio/selfie-shoot`, matching the published GTM Click URL trigger.
- `/post-booking` rendered the booking confirmation page and loaded GTM exactly once, matching the three existing page-path triggers.

Tag Assistant's popup handshake could not attach to the localhost tab in the controlled browser environment. Consent updates and tag firing should therefore receive one final Tag Assistant smoke test on an accessible preview or immediately after cutover; no real conversion was generated during this local check.

The only external tracking change made during this work was the documented GTM Version 7 selfie-trigger update. No Google Ads conversion settings, GA4 settings, Cal.com event settings, DNS records, or live-site code were changed.
