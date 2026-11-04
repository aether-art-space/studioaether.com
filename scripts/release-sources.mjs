import { execFileSync } from "node:child_process";

export function relevantReleaseChanges(statusRows) {
  return statusRows.map((row) => row.slice(3)).filter((filename) =>
    /^(src|content|public|scripts)\//.test(filename) && !filename.startsWith("scripts/google-ads/") ||
    /^(astro\.config\.[^/]+|package\.json|package-lock\.json|tsconfig\.json|vite\.config\.[^/]+)$/.test(filename)
  );
}

export function verifyReleaseSources() {
  const changed = execFileSync("git", ["status", "--porcelain", "-z", "--untracked-files=all"], { encoding: "utf8" }).split("\0").filter(Boolean);
  const relevant = relevantReleaseChanges(changed);
  if (relevant.length) throw new Error(`Release source files must be committed before building:\n${relevant.join("\n")}`);
}
