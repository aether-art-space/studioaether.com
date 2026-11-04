import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const manifestPath = path.resolve("output/release-manifest.json");

export async function digestDirectory(directory = "dist") {
  const files = [];
  async function visit(folder) {
    for (const entry of (await readdir(folder, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) await visit(filename);
      else if (entry.isFile()) {
        const contents = await readFile(filename);
        files.push({ path: path.relative(directory, filename).split(path.sep).join("/"), sha256: createHash("sha256").update(contents).digest("hex") });
      }
    }
  }
  await visit(directory);
  if (!files.length) throw new Error(`${directory} is empty; build the production site first.`);
  const digest = createHash("sha256").update(JSON.stringify(files)).digest("hex");
  return { digest, files };
}

export async function readManifest(filename = manifestPath) {
  try {
    return JSON.parse(await readFile(filename, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("Release manifest is missing. Run npm run release:build to create a fresh production artifact.");
    throw error;
  }
}

export async function validateArtifact({ expectedCommit, requireUpstream = true, directory = "dist", manifestFile = manifestPath, head: providedHead, checkUpstream } = {}) {
  const manifest = await readManifest(manifestFile);
  const { execFileSync } = await import("node:child_process");
  const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
  const head = providedHead ?? git(["rev-parse", "HEAD"]);
  if (manifest.commit !== head || (expectedCommit && manifest.commit !== expectedCommit)) throw new Error("Release artifact commit does not match current HEAD. Rebuild after checking out the intended release commit.");
  if (manifest.environment !== "production" || manifest.siteUrl !== "https://www.studioaether.com" || manifest.gtmId !== "GTM-P6G8NTP2") throw new Error("Release artifact manifest does not describe the required production environment.");
  const current = await digestDirectory(directory);
  if (manifest.artifactDigest !== current.digest) throw new Error("dist has changed since the release manifest was created; rebuild and validate before publishing.");
  if (requireUpstream) {
    try {
      if (checkUpstream) await checkUpstream(head);
      else git(["merge-base", "--is-ancestor", "HEAD", "origin/main"]);
    }
    catch { throw new Error("Current HEAD is not present on origin/main. Push the reviewed release commit, fetch origin, then rebuild and publish."); }
  }
  return manifest;
}
