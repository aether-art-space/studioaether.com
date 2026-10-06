import http from "node:http";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const clientId = "391779592493-990j4c9lh29sn63b5kavk7pancr477ga.apps.googleusercontent.com";
const keychainService = "StudioAetherGoogleAdsAPI";
const keychainAccount = "oauth-refresh-credentials";
const port = 8787;
// Google recommends a numeric loopback address for desktop OAuth. Keep the
// same exact URI in the authorization request and token exchange.
const redirectUri = `http://127.0.0.1:${port}`;
const keychainUpdater = join(dirname(fileURLToPath(import.meta.url)), "upsert-keychain.swift");
const withTagManager = process.argv.includes("--with-tag-manager");
const requestedScopes = [
  "https://www.googleapis.com/auth/adwords",
  ...(withTagManager ? [
    "https://www.googleapis.com/auth/tagmanager.readonly"
  ] : [])
];
let storedCredentials;
try {
  const raw = execFileSync("security", [
    "find-generic-password", "-s", keychainService, "-a", keychainAccount, "-w"
  ], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  storedCredentials = JSON.parse(raw);
} catch {
  throw new Error("The existing Google Ads Keychain credential record is unavailable in this process context.");
}
if (storedCredentials.client_id !== clientId || !storedCredentials.client_secret) {
  throw new Error("The existing Keychain record is missing the expected OAuth client ID or client secret; no secret was printed.");
}
const verifier = randomBytes(48).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(32).toString("base64url");

const params = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: requestedScopes.join(" "),
  include_granted_scopes: "true",
  access_type: "offline",
  prompt: "consent",
  code_challenge: challenge,
  code_challenge_method: "S256",
  state
});

const expectedState = Buffer.from(state);
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  if (url.pathname !== "/") {
    res.writeHead(404).end("Not found");
    return;
  }

  const returnedState = Buffer.from(url.searchParams.get("state") ?? "");
  if (returnedState.length !== expectedState.length || !timingSafeEqual(returnedState, expectedState)) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("OAuth state check failed. Return to Codex.");
    server.close();
    console.error("Google OAuth callback rejected: state mismatch.");
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (error || !code) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Google Ads authorization was not completed. Return to Codex.");
    server.close();
    console.error(`Google OAuth authorization did not complete: ${error ?? "no authorization code"}`);
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: storedCredentials.client_secret,
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.refresh_token) {
      const detail = [token.error, token.error_description].filter(Boolean).join(" — ");
      throw new Error(`OAuth code exchange failed (${tokenResponse.status}): ${detail || "no refresh token returned"}`);
    }

    const grantedScopes = new Set((token.scope ?? "").split(" "));
    if (requestedScopes.some(scope => !grantedScopes.has(scope))) {
      throw new Error("Google did not grant every requested permission; existing Keychain credentials were preserved.");
    }
    const credentials = JSON.stringify({
      ...storedCredentials,
      client_id: clientId,
      client_secret: storedCredentials.client_secret,
      refresh_token: token.refresh_token,
      scopes: [...grantedScopes]
    });
    const update = spawnSync("swift", [keychainUpdater], {
      input: credentials,
      encoding: "utf8",
      stdio: ["pipe", "ignore", "pipe"]
    });
    if (update.status !== 0) throw new Error("OAuth succeeded, but the refresh token could not be saved to Keychain.");

    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end("<h2>Google API authorization saved.</h2>You can return to Codex.");
    console.log("Google API authorization saved; refresh credentials stored only in the login Keychain.");
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Google Ads authorization could not be saved. Return to Codex for help.");
    console.error(e.message);
  } finally {
    server.close();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open this Google OAuth URL to authorize the requested API permissions:");
  console.log(`AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});
