import { createServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".xml": "application/xml", ".txt": "text/plain" };
const server = createServer(async (request, response) => {
  const clean = decodeURIComponent((request.url || "/").split("?")[0]);
  const candidate = clean.endsWith("/") ? `${clean}index.html` : clean.includes(".") ? clean : `${clean}/index.html`;
  const file = path.resolve(root, `.${candidate}`);
  if (!file.startsWith(root)) { response.writeHead(400); response.end("Bad request"); return; }
  try { const body = await fs.readFile(file); response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "text/html; charset=utf-8" }); response.end(body); }
  catch { response.writeHead(404, { "Content-Type": "text/plain" }); response.end("Not found"); }
});
server.listen(4173, () => console.log("studioaether.com V2 at http://localhost:4173"));
