import { readFile, access, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

// Gallery variants are intentionally ignored in public/ but committed in dist/.
// Restore missing cached bytes before Astro clears dist on a clean checkout.
// This copies existing assets only; it never generates images or edits manifests.
export async function restoreImageCache(root = process.cwd()) {
  const manifest = JSON.parse(await readFile(path.join(root, "public/images/generated/manifest.json"), "utf8"));
  let restored = 0;
  for (const entry of Object.values(manifest.images || {})) {
    const variants = [...Object.values(entry.regular || {}).flat(), ...Object.values(entry.thumb || {}).flat(), ...Object.values(entry.full || {})];
    for (const variant of variants) {
      if (!variant?.src?.startsWith("/images/generated/")) continue;
      const relative = variant.src.slice(1);
      if (relative.split("/").includes("..")) throw new Error("Invalid generated image manifest path");
      const destination = path.join(root, "public", relative);
      try { await access(destination); continue; } catch { /* restore archived variant */ }
      try {
        await mkdir(path.dirname(destination), { recursive: true });
        await copyFile(path.join(root, "dist", relative), destination);
        restored++;
      } catch {
        throw new Error(`Missing generated image ${variant.src}; restore the committed dist archive or run the intentional gallery update before building.`);
      }
    }
  }
  if (restored) console.log(`Restored ${restored} archived image variants to the local public cache.`);
}
