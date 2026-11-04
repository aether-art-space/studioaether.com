import { execFileSync } from "node:child_process";
import { validateArtifact } from "./release-artifact.mjs";
import { verifyReleaseSources } from "./release-sources.mjs";

verifyReleaseSources();
const branch = execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim();
if (branch !== "main") throw new Error(`Refusing to publish from ${branch || "a detached HEAD"}; check out main at the reviewed release commit.`);
execFileSync("git", ["fetch", "origin", "main"], { stdio: "inherit" });

const manifest = await validateArtifact();
const commitMessage = execFileSync("git", ["log", "-1", "--pretty=%s"], { encoding: "utf8" }).trim();
execFileSync("node_modules/.bin/wrangler", [
  "pages", "deploy", "dist",
  "--project-name=studioaether-com",
  "--branch=main",
  `--commit-hash=${manifest.commit}`,
  `--commit-message=${commitMessage}`,
  "--commit-dirty=false",
], { stdio: "inherit" });
