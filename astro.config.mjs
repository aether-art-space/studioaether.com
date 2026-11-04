import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";
import { hardenStaticBuild } from "./scripts/harden-static-build.mjs";
import { restoreImageCache } from "./scripts/restore-image-cache.mjs";

await restoreImageCache();

export default defineConfig({
  site: "https://www.studioaether.com",
  output: "static",
  trailingSlash: "never",
  devToolbar: {
    enabled: false
  },
  build: {
    format: "file"
  },
  integrations: [mdx(), react(), {
    name: "static-script-csp",
    hooks: {
      "astro:build:done": async ({ dir }) => hardenStaticBuild(fileURLToPath(dir))
    }
  }]
});
