import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { digestDirectory, manifestPath } from "./release-artifact.mjs";
import { verifyReleaseSources } from "./release-sources.mjs";

const run = (command, args, env = {}) => execFileSync(command, args, { stdio: "inherit", env: { ...process.env, ...env } });
const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();

verifyReleaseSources();
const commit = git(["rev-parse", "HEAD"]);
run(path.resolve("node_modules/.bin/astro"), ["build"], {
  PUBLIC_DEPLOY_ENV: "production",
  PUBLIC_BASE_PATH: "",
  PUBLIC_GTM_ID: "GTM-P6G8NTP2",
  PUBLIC_GOOGLE_TAG_ID: "",
  PUBLIC_GA4_ID: "",
  PUBLIC_GOOGLE_ADS_ID: "",
  PUBLIC_SITE_URL: "https://www.studioaether.com",
  ASTRO_TELEMETRY_DISABLED: "1",
});
run("npm", ["run", "check"], {
  PUBLIC_DEPLOY_ENV: "production",
  PUBLIC_BASE_PATH: "",
  PUBLIC_GTM_ID: "GTM-P6G8NTP2",
  PUBLIC_GOOGLE_TAG_ID: "",
  PUBLIC_GA4_ID: "",
  PUBLIC_GOOGLE_ADS_ID: "",
  PUBLIC_SITE_URL: "https://www.studioaether.com",
});
run("npm", ["test"], { PUBLIC_DEPLOY_ENV: "production", PUBLIC_SITE_URL: "https://www.studioaether.com" });
run("npm", ["run", "test:browser"], { PUBLIC_DEPLOY_ENV: "production", PUBLIC_SITE_URL: "https://www.studioaether.com" });
const artifact = await digestDirectory();
const manifest = {
  schemaVersion: 1,
  commit,
  environment: "production",
  siteUrl: "https://www.studioaether.com",
  gtmId: "GTM-P6G8NTP2",
  artifactDigest: artifact.digest,
  files: artifact.files.length,
  builtAt: new Date().toISOString(),
};
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Validated production artifact ${artifact.digest} for ${commit}`);
