import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { restoreImageCache } from "./restore-image-cache.mjs";

test("fresh checkout restores archived variants before dist is rebuilt", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "aether-images-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public/images/generated"), { recursive: true });
  await mkdir(path.join(root, "dist/images/generated/galleries"), { recursive: true });
  const src = "/images/generated/galleries/example.webp";
  await writeFile(path.join(root, "public/images/generated/manifest.json"), JSON.stringify({ images: { original: { full: { webp: { src } } } } }));
  await writeFile(path.join(root, "dist", src.slice(1)), "archived bytes");
  await restoreImageCache(root);
  assert.equal(await readFile(path.join(root, "public", src.slice(1)), "utf8"), "archived bytes");
  await rm(path.join(root, "public", src.slice(1)));
  await rm(path.join(root, "dist", src.slice(1)));
  await assert.rejects(restoreImageCache(root), /Missing generated image/);
});
