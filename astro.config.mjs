import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://www.studioaether.com",
  output: "static",
  trailingSlash: "never",
  integrations: [mdx(), react()]
});
