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

## Remaining pre-cutover verification

- Determine the exact Cloudflare custom-domain onboarding path before accepting any DNS prompt.
- Include `en.studioaether.com` and `hu.studioaether.com` in the hostname cutover/redirect design; testing only apex and `www` is insufficient.
- Do not attach the domains or change DNS until the production environment variables and a coordinated live-test window are ready.
