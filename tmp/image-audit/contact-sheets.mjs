import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'tmp/image-audit');
await fs.mkdir(outDir, { recursive: true });

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

async function dimensions(file) {
  const meta = await sharp(file).metadata();
  return `${meta.width}×${meta.height}`;
}

async function makeSheet(name, title, files, columns = 5) {
  const tileW = 240;
  const imageW = 220;
  const imageH = 190;
  const labelH = 48;
  const tileH = imageH + labelH + 18;
  const headerH = 54;
  const rows = Math.ceil(files.length / columns);
  const width = columns * tileW;
  const height = headerH + rows * tileH;
  const cells = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const [buffer, size] = await Promise.all([
      sharp(file).resize(imageW, imageH, { fit: 'contain', background: '#e9e6e1' }).png().toBuffer(),
      dimensions(file),
    ]);
    const x = (i % columns) * tileW + 10;
    const y = headerH + Math.floor(i / columns) * tileH;
    const label = path.basename(file).replace(/--full--[^.]+\./, '.');
    cells.push(`<rect x="${x}" y="${y}" width="${imageW}" height="${imageH}" rx="3" fill="#e9e6e1"/>`);
    cells.push(`<image x="${x}" y="${y}" width="${imageW}" height="${imageH}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${buffer.toString('base64')}"/>`);
    cells.push(`<text x="${x}" y="${y + imageH + 17}" font-family="Arial, sans-serif" font-size="11" fill="#26231f">${esc(label)}</text>`);
    cells.push(`<text x="${x}" y="${y + imageH + 34}" font-family="Arial, sans-serif" font-size="11" fill="#6d665f">${esc(size)}</text>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#fbfaf8"/><text x="14" y="31" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#26231f">${esc(title)}</text>${cells.join('')}</svg>`;
  const output = path.join(outDir, `${name}.png`);
  await sharp(Buffer.from(svg)).png().toFile(output);
  return output;
}

async function imageFiles(dir) {
  return (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).map((f) => path.join(dir, f));
}

const priority = [
  'content/galleries/corporate/02-external-02.jpg',
  'content/galleries/corporate/03-external-03.jpg',
  'content/galleries/corporate/05-external-05.jpg',
  'content/galleries/corporate/06-external-06.png',
  'content/galleries/glamour/01-glamour-01.jpg',
  'content/galleries/glamour/02-glamour-02.jpg',
  'content/galleries/portrait/08-portrait-08.jpg',
  'content/galleries/mentoring-digital/13-digital-13.jpg',
].map((f) => path.join(root, f));

const outputs = [];
outputs.push(await makeSheet('01-priority-gallery-images', 'Priority gallery images', priority));

for (const dirName of ['props-collection', 'props-furniture', 'props-wardrobe', 'props-wardrobe-free']) {
  const files = (await imageFiles(path.join(root, 'content/galleries', dirName))).sort();
  outputs.push(await makeSheet(`02-${dirName}`, dirName, files));
}

async function fullVariants(dirName) {
  const files = await imageFiles(path.join(root, 'public/images/generated', dirName));
  const grouped = new Map();
  for (const file of files) {
    const base = path.basename(file);
    if (!base.includes('--full--')) continue;
    const stem = base.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '').replace(/--full--[a-f0-9]+$/, '');
    const preferred = /\.jpg$/i.test(base) ? 0 : /\.webp$/i.test(base) ? 1 : 2;
    const current = grouped.get(stem);
    if (!current || preferred < current.rank) grouped.set(stem, { file, rank: preferred });
  }
  return [...grouped.values()].map((x) => x.file).sort();
}

for (const dirName of ['equipment', 'models']) {
  const files = await fullVariants(dirName);
  for (let i = 0; i < files.length; i += 40) {
    const part = files.slice(i, i + 40);
    const suffix = files.length > 40 ? `-${Math.floor(i / 40) + 1}` : '';
    outputs.push(await makeSheet(`03-${dirName}${suffix}`, `${dirName} (current full-size files)`, part));
  }
}

console.log(outputs.join('\n'));
