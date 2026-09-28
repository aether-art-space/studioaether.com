import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const keychainService = "StudioAetherGoogleAdsAPI";
const keychainAccount = "oauth-refresh-credentials";
const keychainUpdater = join(dirname(fileURLToPath(import.meta.url)), "upsert-keychain.swift");

export async function refreshGoogleAdsAccessToken() {
  let raw;
  try {
    raw = execFileSync("security", [
      "find-generic-password", "-s", keychainService, "-a", keychainAccount, "-w"
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    throw new Error(
      `Google Ads OAuth credentials were not found in the login Keychain ` +
      `(service: ${keychainService}, account: ${keychainAccount}). ` +
      "Confirm this process is running on the Mac and in the login-keychain context used for Ads API access."
    );
  }

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error("The Google Ads Keychain item is not valid JSON; no credential values were printed.");
  }

  const tokenRequest = {
    client_id: credentials.client_id,
    refresh_token: credentials.refresh_token,
    grant_type: "refresh_token"
  };
  if (credentials.client_secret) tokenRequest.client_secret = credentials.client_secret;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(tokenRequest)
  });
  const result = await response.json();
  if (!response.ok || !result.access_token) {
    throw new Error(
      `Google Ads token refresh failed (${response.status}): ` +
      `${result.error ?? "unknown error"}${result.error_description ? ` — ${result.error_description}` : ""}`
    );
  }

  if (result.refresh_token && result.refresh_token !== credentials.refresh_token) {
    credentials.refresh_token = result.refresh_token;
    const update = spawnSync("swift", [keychainUpdater], {
      input: JSON.stringify(credentials),
      encoding: "utf8",
      stdio: ["pipe", "ignore", "pipe"]
    });
    if (update.status !== 0) {
      throw new Error("Google rotated the refresh token, but its Keychain update failed.");
    }
  }

  return { accessToken: result.access_token, expiresIn: result.expires_in ?? 3600 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const token = await refreshGoogleAdsAccessToken();
  console.log(`Google Ads token refresh succeeded; token not displayed; valid for ${token.expiresIn} seconds.`);
}
