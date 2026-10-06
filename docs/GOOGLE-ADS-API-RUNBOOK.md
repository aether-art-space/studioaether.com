# Google Ads API runbook

Operational notes for working with the Studio Aether Google Ads account through the Google Ads API.

## Account and campaign

- Customer ID: `2557578033`
- Studio Rental + Selfie + Mentoring PMax campaign: `24219266321`
- Professional Photography PMax campaign: `24293927948` (keep paused unless explicitly instructed otherwise)
- Current successful API version observed: `v25`

## Authentication

The durable OAuth refresh helper is now in the project:

```text
scripts/google-ads/refresh-auth.mjs
scripts/google-ads/upsert-keychain.swift
```

It reads a JSON credential record from the macOS login Keychain using:

- Service: `StudioAetherGoogleAdsAPI`
- Account: `oauth-refresh-credentials`
- Expected fields: OAuth `client_id`, `client_secret`, and `refresh_token`

The helper returns a short-lived access token. Use it in memory for Google Ads API requests; never print it, put it in shell history, commit it, or paste it into chat. It handles OAuth refresh-token rotation by updating the Keychain through the companion Swift helper, without placing credential values in command-line arguments. Preserve all three stored fields when updating the Keychain record.

Older copies of these helpers and the customer-list JSON were kept under `/private/tmp`; do not rely on those temporary copies. The helper source is now tracked in the project, while OAuth secrets remain only in the login Keychain. `node scripts/google-ads/refresh-auth.mjs` is a safe health check: it confirms refresh access and reports expiry without displaying the access token.

## Recovery checks

Before concluding that authorization has been revoked or asking the account owner to reauthorize:

1. Run `node scripts/google-ads/refresh-auth.mjs` on the Mac from the same privileged local execution context used for Google Ads API calls. A sandboxed Keychain lookup can fail even when the item is present; that failure alone does not justify reauthorization.
2. Check the exact Keychain service/account above from that same context. If the refresh health check succeeds, proceed with the API—do not reauthorize.
3. Only if refresh fails from the correct context, inspect the safe error and decide whether consent is actually needed. The recovery script reads the existing `client_secret` from Keychain, includes it in the authorization-code exchange, preserves it when storing a new refresh token, uses PKCE with a numeric `127.0.0.1` loopback redirect, and requests only the existing AdWords scope. Never print credentials, ask the owner to paste them into chat, or store them in the repository.
4. Verify access with a read-only Google Ads API search before making changes. After mutations, verify the affected resource state through the API.

## Incident note — 2026-09-27

Google Ads API reads and writes succeeded earlier in this task. A sandboxed Keychain lookup then reported no item, but the same exact lookup from the privileged local context found all three fields (`client_id`, `client_secret`, and `refresh_token`), and the refresh health check succeeded. The apparent missing credential was a context/permission mismatch, not revoked consent. A subsequent recovery attempt also exposed that the authorization-code exchange must include this client's stored `client_secret` (Google returned `invalid_request: client_secret is missing`); the script now reads it from Keychain and preserves it on update. Do not ask for another sign-in if the refresh check succeeds. General Google native-app documentation describes the secret as optional, but this project's observed client endpoint requires it. No credential was intentionally deleted or rotated.

## PMax sitelinks and language groups

PMax sitelinks are associated with the campaign, not an individual asset group. When one campaign contains Hungarian and English asset groups, the campaign can have links to both localized pages. Keep destinations localized and review the live sitelinks through the API after changes. The English routes verified in `src/data/routes.mjs` include `/studio`, `/equipment`, `/props`, `/photographer-mentoring-budapest`, `/selfie-studio-budapest`, and `/booking`. As of 2026-09-27, the active campaign has six enabled Hungarian sitelinks and six enabled English sitelinks (12 total); API read-back confirmed all are enabled.

## Tag Manager read-only access — 1 October 2026

`node scripts/google-ads/authorize.mjs --with-tag-manager` requests the existing AdWords permission plus `tagmanager.readonly`, and preserves all existing Keychain fields. The consent flow succeeded and stored the new refresh credential. The subsequent live-version GET reached the Tag Manager API but returned `SERVICE_DISABLED` for Google Cloud project `391779592493`; enable `tagmanager.googleapis.com` in that project, then retry. No Tag Manager edit or publish OAuth scopes were granted.

The Tag Manager API was subsequently enabled in `studioaether-google-ads` (`second-pursuit-509912-s6`, project number `391779592493`). Read-only verification succeeded with HTTP 200 at `GET https://tagmanager.googleapis.com/tagmanager/v2/accounts/6292147560/containers/218384234/versions:live`. It returned live Version 13, “Add Conversion Linker on all pages”, containing `Conversion Linker - All Pages` (`gclidw`) with All Pages trigger ID `2147479553`. Use `versions:live`, not `versions/live`.
