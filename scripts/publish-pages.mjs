import { execFileSync } from "node:child_process";

const run = (command, args) => execFileSync(command, args, { stdio: "inherit" });
const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const commitHash = git(["rev-parse", "HEAD"]);
const commitMessage = git(["log", "-1", "--pretty=%s"]);

run("npx", [
  "wrangler",
  "pages",
  "deploy",
  "dist",
  "--project-name=studioaether-com",
  "--branch=main",
  `--commit-hash=${commitHash}`,
  `--commit-message=${commitMessage}`,
  "--commit-dirty=false"
]);
