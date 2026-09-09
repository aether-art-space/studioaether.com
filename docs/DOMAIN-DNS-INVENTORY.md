# Domain and DNS cutover inventory

Read-only snapshot taken on 9 September 2026 before the Wix-to-Cloudflare Pages cutover. The public DNS results were compared with the complete record tables in the authenticated Wix domain dashboard. No domain, DNS, Pages, registrar, or tracking settings were changed while collecting this inventory.

## Domain registration

| Field | Current value |
| --- | --- |
| Domain | `studioaether.com` |
| Registrar | Wix.com Ltd. |
| Created | 18 October 2024, 06:29:04 UTC |
| Registry expiry | 18 October 2026, 06:29:04 UTC |
| Last registry update | 18 September 2025, 07:44:19 UTC |
| Status | `clientTransferProhibited`, `clientUpdateProhibited` |
| Authoritative nameservers | `ns12.wixdns.net`, `ns13.wixdns.net` |

A registrar transfer is not required for launch. The domain can remain registered at Wix while its web DNS records are directed to Cloudflare Pages. The registrar locks must not be changed merely for the hosting cutover.

## Public authoritative DNS snapshot

| Name | Type | TTL | Value |
| --- | --- | ---: | --- |
| `studioaether.com` | `A` | 3600 | `185.230.63.107` |
| `studioaether.com` | `A` | 3600 | `185.230.63.171` |
| `studioaether.com` | `A` | 3600 | `185.230.63.186` |
| `studioaether.com` | `TXT` | 3600 | `apple-domain-verification=R1ns2vMQhmFp1O6ir11mKrNL23l1KQSAHSc-s-ApAWU` |
| `www.studioaether.com` | `CNAME` | observed 316 | `cdn1.wixdns.net` (which resolves through `td-ccm-neg-87-45.wixdns.net`) |
| `en.studioaether.com` | `CNAME` | observed dynamically | `cdn1.wixdns.net` |
| `hu.studioaether.com` | `CNAME` | observed dynamically | `cdn1.wixdns.net` |
| `ervin.studioaether.com` | `TXT` | 3600 | `google-site-verification=ZERaZy3EVTl9u8wXgqsOV7y8wIC2tyHnKfunodaWgxY` |
| `studioaether.com` | `NS` | 86400 | `ns12.wixdns.net` |
| `studioaether.com` | `NS` | 86400 | `ns13.wixdns.net` |

Also observed:

- No apex `AAAA`, `CNAME`, `MX`, or `CAA` answer.
- No public answer for `mail`, `autodiscover`, or `_dmarc` under the domain.
- Passive DNS discovery found the additional Wix-backed hostnames `en.studioaether.com` and `hu.studioaether.com`.
- Email addresses used by the site are `gmail.com` addresses, not mailboxes hosted at `studioaether.com`.
- Wix refused an `AXFR` zone transfer. The subsequent authenticated dashboard comparison found one additional record that could not be discovered by querying the known public names: the `ervin` Google verification TXT record above.
- The Wix dashboard contains exactly three A records, three CNAME records, two TXT records, and two authoritative NS records. It shows no MX, SRV, CAA, AAAA, SPF, DKIM, or DMARC records.

### Records that must survive the cutover

- Preserve the Apple domain-verification TXT record unless the owner intentionally retires the associated Apple service.
- Preserve the `ervin.studioaether.com` Google site-verification TXT record unless the owner intentionally retires that verified property.
- Preserve the legacy `en` and `hu` hostname behavior. They must not be left pointing at a retired Wix site after cutover.
- There are currently no domain MX/SPF/DKIM/DMARC records visible at the known public names. Reconfirm this against Wix's DNS screen before changing nameservers or replacing the apex/`www` records.

## Current web and TLS behavior

| Request | Current result |
| --- | --- |
| `http://studioaether.com` | `301` to `https://studioaether.com/` |
| `https://studioaether.com` | `301` to `https://www.studioaether.com/` |
| `http://www.studioaether.com` | `301` to `https://www.studioaether.com/` |
| `https://www.studioaether.com` | `200` from Wix (`Pepyaka`) |
| `https://en.studioaether.com` | `301` to `https://www.studioaether.com/` |
| `https://hu.studioaether.com` | `301` to `https://www.studioaether.com/hu` |

The current canonical host behavior is therefore HTTPS plus `www`. The replacement must preserve this behavior without a redirect chain where Cloudflare permits it. The `en` and `hu` legacy host redirects must also be reproduced on Cloudflare or another retained redirect layer.

The observed certificate covers both `studioaether.com` and `www.studioaether.com`; it was issued by Let's Encrypt and is valid from 16 July 2026 through 14 October 2026. Cloudflare must issue and activate its own certificate for both hostnames during cutover.

## Cloudflare Pages destination

| Field | Current value |
| --- | --- |
| Cloudflare account | `Photostudio.aether@gmail.com's Account` |
| Pages project | `studioaether-com` |
| Pages hostname | `studioaether-com.pages.dev` |
| Source | GitHub `aether-art-space/studioaether.com` |
| Production branch | `main` |
| Build | `npm run build` → `dist` |
| Node | `22` |
| Attached custom domains | None |
| Latest checked deployment | Successful |

The current production-branch environment is deliberately still configured as a preview:

- `PUBLIC_DEPLOY_ENV=preview`
- `PUBLIC_SITE_URL=https://studioaether-com.pages.dev`
- no `PUBLIC_GTM_ID`

This means the Pages deployment remains `noindex` and does not send production analytics. Before cutover, change only the production environment to:

- `PUBLIC_DEPLOY_ENV=production`
- `PUBLIC_SITE_URL=https://www.studioaether.com`
- `PUBLIC_GTM_ID=GTM-P6G8NTP2`

Keep `PUBLIC_GOOGLE_TAG_ID`, `PUBLIC_GA4_ID`, and `PUBLIC_GOOGLE_ADS_ID` unset to avoid duplicate Google tags.

## Wix account verification

- Wix identifies `studioaether.com` as the primary domain for Aether Art Space.
- The Wix account identifies the signed-in user as the owner.
- Wix shows the domain renewing on 18 October 2026.
- The authenticated DNS tables match this document after adding the previously undiscovered `ervin` TXT record.

## Inactive Cloudflare DNS staging

On 9 September 2026, a full Cloudflare zone was created as a pre-cutover staging step. Its status remains `pending`, so it is not authoritative and does not affect the live Wix site.

| Field | Staged value |
| --- | --- |
| Zone | `studioaether.com` |
| Zone ID | `ab99bcd14186115782d171e385832563` |
| Status | `pending` |
| Assigned nameservers | `clara.ns.cloudflare.com`, `theo.ns.cloudflare.com` |
| Current/original nameservers | `ns12.wixdns.net`, `ns13.wixdns.net` |

Cloudflare's automatic DNS scan imported no records, so all eight functional Wix records were added manually with a 3600-second TTL and DNS-only status: three apex A records, the `www`, `en`, and `hu` CNAMEs, and both TXT verification records. A subsequent API read verified that all eight staged values exactly match the authenticated Wix inventory above.

A zone-level Single Redirect ruleset (`ebbc17fb8cb342a09d2394cdd92cdf7b`) is also staged for the cutover. It contains four enabled 301 rules:

- `studioaether.com/*` → the same path on `https://www.studioaether.com`, preserving the query string.
- `en.studioaether.com/*` → the same path on `https://www.studioaether.com`, preserving the query string.
- `hu.studioaether.com/` → `https://www.studioaether.com/hu`, preserving the query string.
- Other `hu.studioaether.com/*` paths → the same path beneath `https://www.studioaether.com/hu`, preserving the query string.

These rules require proxied Cloudflare DNS records. They therefore remain inert while the zone is pending and the copied Wix records are DNS-only.

No Wix nameserver, DNS, domain, or site setting was changed. Do not switch the nameservers yet: the staged web records still deliberately point to Wix and the Pages custom domains and production environment are not ready for activation.

## Production-mode build rehearsal

The exact planned production values were exercised locally without changing the hosted Pages environment:

- `PUBLIC_DEPLOY_ENV=production`
- `PUBLIC_SITE_URL=https://www.studioaether.com`
- `PUBLIC_GTM_ID=GTM-P6G8NTP2`

The rehearsal built all 57 pages successfully, produced zero Astro diagnostics, and passed validation for 56 generated routes plus the direct `/mentoring` redirect. The output used indexable robots directives and `www` canonical URLs, loaded the GTM container configuration, and left the direct Google tag, GA4, and Google Ads IDs empty. The checked-out output was then rebuilt with the preview values so no local generated artifact was left launch-configured.

## Remaining pre-cutover verification

- Include `en.studioaether.com` and `hu.studioaether.com` in the hostname cutover/redirect design; testing only apex and `www` is insufficient.
- Apply the rehearsed production environment values and redeploy at the start of the coordinated cutover window; doing this earlier would make the public `pages.dev` deployment indexable and enable production GTM there.
- Attach and validate the apex and `www` Pages custom domains at the coordinated cutover window.
- Replace the staged Wix web records with the final Pages records and reproduce the apex, `en`, and `hu` redirect behavior.
- Change the Wix nameservers only after the final Cloudflare zone has been rechecked in full.
