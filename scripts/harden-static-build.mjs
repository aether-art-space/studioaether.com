import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Give executable inline scripts content-addressed URLs so production CSP can
// reject injected inline JavaScript without requiring a runtime nonce server.
export async function hardenStaticBuild(directory) {
  const assets = path.join(directory, "_astro");
  await mkdir(assets, { recursive: true });
  const files = [];
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) await visit(filename);
      else if (entry.name.endsWith(".html")) files.push(filename);
    }
  }
  await visit(directory);
  const scripts = new Map();
  for (const filename of files) {
    const html = await readFile(filename, "utf8");
    const hardened = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attributes, source) => {
      const type = attributes.match(/\btype=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (/\bsrc\s*=/i.test(attributes) || !source.trim() || (type && !["module", "text/javascript", "application/javascript"].includes(type))) return tag;
      const hash = createHash("sha256").update(source).digest("hex").slice(0, 20);
      const name = `inline-${hash}.js`;
      scripts.set(name, source);
      return `<script${attributes} src="/_astro/${name}"></script>`;
    });
    await writeFile(filename, hardened);
  }
  for (const [name, source] of scripts) await writeFile(path.join(assets, name), source);
  const headerPath = path.join(directory, "_headers");
  let headers = await readFile(headerPath, "utf8");
  headers = headers.replace(/script-src ([^;]+)/, (_, sources) => `script-src ${sources.replace(/'unsafe-inline'\s*/g, "")}`);
  headers = headers.replace("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "style-src 'self' 'unsafe-inline'")
    .replace("font-src 'self' data: https://fonts.gstatic.com", "font-src 'self' data:");
  if (process.env.CSP_REPORT_URI) {
    const endpoint = new URL(process.env.CSP_REPORT_URI);
    if (endpoint.protocol !== "https:") throw new Error("CSP_REPORT_URI must use HTTPS");
    headers = headers.replace(/(Content-Security-Policy: [^\n]+)/, `$1 report-uri ${endpoint.href};`);
  }
  headers += "\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/fonts/*.woff2\n  Cache-Control: public, max-age=86400, must-revalidate\n";
  await writeFile(headerPath, headers);
  console.log(`Hardened ${files.length} HTML files; externalized ${scripts.size} executable inline scripts.`);
}
