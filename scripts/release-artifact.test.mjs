import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { digestDirectory, validateArtifact } from "./release-artifact.mjs";
import { relevantReleaseChanges } from "./release-sources.mjs";

const commit = "a".repeat(40);
const productionManifest = (artifactDigest) => ({
  schemaVersion: 1,
  commit,
  environment: "production",
  siteUrl: "https://www.studioaether.com",
  gtmId: "GTM-P6G8NTP2",
  artifactDigest,
});

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "studioaether-release-"));
  const dist = path.join(root, "dist");
  const manifestFile = path.join(root, "release-manifest.json");
  await mkdir(path.join(dist, "nested"), { recursive: true });
  await writeFile(path.join(dist, "index.html"), "production home");
  await writeFile(path.join(dist, "nested", "booking.html"), "booking");
  const { digest } = await digestDirectory(dist);
  await writeFile(manifestFile, JSON.stringify(productionManifest(digest)));
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, dist, manifestFile };
}

test("artifact digest is stable, sorted, and changes when output changes", async (t) => {
  const { dist } = await fixture(t);
  const first = await digestDirectory(dist);
  const second = await digestDirectory(dist);
  assert.equal(first.digest, second.digest);
  assert.deepEqual(first.files.map(({ path: filename }) => filename), ["index.html", "nested/booking.html"]);
  await writeFile(path.join(dist, "index.html"), "modified production home");
  assert.notEqual((await digestDirectory(dist)).digest, first.digest);
});

test("valid production manifest matches commit and artifact and checks upstream", async (t) => {
  const { dist, manifestFile } = await fixture(t);
  let checkedCommit;
  const manifest = await validateArtifact({
    expectedCommit: commit,
    head: commit,
    directory: dist,
    manifestFile,
    checkUpstream: (head) => { checkedCommit = head; },
  });
  assert.equal(manifest.environment, "production");
  assert.equal(checkedCommit, commit);
});

test("validation rejects stale files and a mismatched commit", async (t) => {
  const { dist, manifestFile } = await fixture(t);
  await writeFile(path.join(dist, "index.html"), "changed after build");
  await assert.rejects(validateArtifact({ head: commit, directory: dist, manifestFile, requireUpstream: false }), /dist has changed/);
  await assert.rejects(validateArtifact({ head: "b".repeat(40), directory: dist, manifestFile, requireUpstream: false }), /commit does not match/);
});

test("source gate permits unrelated docs and Google Ads files but catches site code", () => {
  assert.deepEqual(relevantReleaseChanges([
    " M docs/DEPLOYMENT.md",
    "?? docs/research/notes.md",
    "?? scripts/google-ads/review.mjs",
  ]), []);
  assert.deepEqual(relevantReleaseChanges([" M src/pages/index.astro", "?? public/new-logo.svg"]), ["src/pages/index.astro", "public/new-logo.svg"]);
});
