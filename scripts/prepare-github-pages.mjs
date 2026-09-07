import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const basePath = (process.env.PUBLIC_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
const prefix = basePath ? `/${basePath}` : "";

if (!prefix || !fs.existsSync(dist)) process.exit(0);

const escapedPrefix = prefix.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const prefixRootRelative = (value) => value.replace(new RegExp(`(^|,\\s*)/(?!/)(?!${escapedPrefix}(?:/|$))`, "g"), `$1${prefix}/`);
const rewriteHtml = (source) => source.replace(
  /\b(?:href|src|srcset|poster|action|component-url|renderer-url|before-hydration-url|data-[\w-]+)="([^"]*)"/g,
  (match, value) => {
    const rewritten = prefixRootRelative(value);
    return rewritten === value ? match : match.replace(value, rewritten);
  }
);
const rewriteCss = (source) => source.replace(/url\((\s*["']?)\/(?!\/)/g, `url($1${prefix}/`);

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (/\.html?$/.test(entry.name)) {
      const source = fs.readFileSync(filePath, "utf8");
      fs.writeFileSync(filePath, rewriteHtml(source));
    } else if (/\.css$/.test(entry.name)) {
      const source = fs.readFileSync(filePath, "utf8");
      fs.writeFileSync(filePath, rewriteCss(source));
    }
  }
};

walk(dist);
