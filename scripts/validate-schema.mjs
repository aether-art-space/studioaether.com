import fs from 'node:fs/promises';
import { pages, site } from '../src/data/routes.mjs';
import { studioPricing } from '../src/data/studioPricing.mjs';

const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const nodesIn = function* (value) {
  if (Array.isArray(value)) { for (const item of value) yield* nodesIn(item); }
  else if (value && typeof value === 'object') {
    yield value;
    for (const item of Object.values(value)) yield* nodesIn(item);
  }
};
const hasType = (node, type) => [].concat(node['@type'] || []).includes(type);
const pricedFamilies = new Set(['/booking', '/christmas-studio', '/selfie-studio-budapest', '/photographers-budapest', '/make-up-artists', '/stylists', '/models-budapest', '/packages', '/portrait-photography-budapest', '/fitness', '/glamour-boudoir-photography-budapest', '/model-polaroids-budapest', '/pet-photography-budapest', '/corporate-photography-budapest', '/id-photo', '/photographer-mentoring-budapest', '/christmas-photoshoot', '/photographer-daniel', '/photographer-alexandra', '/wedding-photography']);
let count = 0, offerCount = 0;
for (const page of pages.filter(p => p.disposition !== 'redirect')) {
  const html = await fs.readFile(`dist/${page.path === '/' ? 'index' : page.path.slice(1)}.html`, 'utf8');
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)].map(m => JSON.parse(m[1]));
  const nodes = [...nodesIn(schemas)];
  const canonical = site.domain + page.path;
  const base = page.path.replace(/^\/(hu|de)(?=\/|$)/, '') || '/';
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ');
  // Prefix and suffix scans are independent: a preceding time (22:00)
  // must not consume the HUF prefix of the following price card.
  const amountPattern = String.raw`\d+(?:[., \u00a0]\d{3})*\.?`;
  const rangePattern = `${amountPattern}(?:[–—-]${amountPattern})?`;
  const amounts = new Set();
  for (const pattern of [new RegExp(`HUF\\s*(${rangePattern})`, 'g'), new RegExp(`(${rangePattern})\\s*(?:HUF|Ft)`, 'g')]) {
    for (const match of visible.matchAll(pattern)) {
      for (const amount of match[1].split(/[–—-]/)) amounts.add(Number(amount.replace(/[^\d]/g, '')));
    }
  }
  const offers = nodes.filter(n => hasType(n, 'Offer'));
  check(!nodes.some(n => hasType(n, 'ProfessionalService')), `${page.path}: deprecated ProfessionalService`);
  const breadcrumbs = schemas.filter(n => hasType(n, 'BreadcrumbList'));
  check(page.section === 'home' ? breadcrumbs.length === 0 : breadcrumbs.length === 1 && breadcrumbs[0].itemListElement.length >= 2, `${page.path}: invalid breadcrumb coverage`);
  const business = schemas.find(n => hasType(n, 'LocalBusiness'));
  check(business?.['@id'] === `${site.domain}/#business`, `${page.path}: inconsistent business identity`);
  check(business?.geo?.latitude === 47.4815598 && business?.geo?.longitude === 19.066554, `${page.path}: missing studio coordinates`);
  for (const entity of schemas.filter(n => hasType(n, 'Service') || hasType(n, 'Person') || hasType(n, 'Article'))) {
    check(entity.mainEntityOfPage?.['@id'] === `${canonical}#webpage`, `${page.path}: inconsistent page reference`);
    if (hasType(entity, 'Person')) check(entity['@id'] === `${site.domain}${base}#person`, `${page.path}: translated person identity differs`);
  }
  if (pricedFamilies.has(base)) check(offers.length > 0, `${page.path}: published service prices missing offers`);
  if (base === '/commercial-photography-budapest') check(offers.length === 0, `${page.path}: fabricated custom-quote price`);
  for (const offer of offers) {
    const spec = offer.priceSpecification;
    if (spec?.minPrice !== undefined) {
      check(offer.price === undefined, `${page.path}: starting/range price presented as fixed: ${offer.name}`);
      check(spec.maxPrice === undefined || spec.maxPrice >= spec.minPrice, `${page.path}: inverted price range: ${offer.name}`);
    }
    check(!spec?.unitText || hasType(spec, 'UnitPriceSpecification'), `${page.path}: unitText on non-unit price specification: ${offer.name}`);
    const values = [offer.price, spec?.price, spec?.minPrice, spec?.maxPrice].filter(v => v !== undefined);
    check(values.length > 0 && values.every(v => typeof v === 'number' && Number.isFinite(v) && v > 0), `${page.path}: offer has invalid numeric price: ${offer.name}`);
    check((offer.priceCurrency || spec?.priceCurrency) === 'HUF', `${page.path}: offer currency missing: ${offer.name}`);
    check(values.every(v => amounts.has(v)), `${page.path}: offer amount absent from visible prices: ${offer.name} (${values})`);
    if (spec && hasType(spec, 'UnitPriceSpecification')) check(Boolean(spec.unitCode || spec.unitText || spec.referenceQuantity?.unitCode), `${page.path}: unit price missing unit: ${offer.name}`);
    if (offer.url?.includes('#')) {
      const anchor = offer.url.split('#')[1];
      check(html.includes(`id="${anchor}"`), `${page.path}: offer fragment missing: ${anchor}`);
    }
  }
  if (base === '/booking' || base === '/christmas-studio') {
    check([studioPricing.discounted, studioPricing.standard, studioPricing.pass].every(p => offers.some(o => o.price === p || o.priceSpecification?.price === p)), `${page.path}: studio offer tiers incomplete`);
    check(offers.filter(o => o.itemOffered?.name === 'Photography studio rental' || o.itemOffered?.name === 'Christmas studio rental').filter(o => [studioPricing.discounted, studioPricing.standard].includes(o.price || o.priceSpecification?.price)).every(o => hasType(o.priceSpecification || {}, 'UnitPriceSpecification')), `${page.path}: hourly rental unit missing`);
  }
  if (base === '/selfie-studio-budapest') {
    check(offers.some(o => o.price === 10990 && o.priceSpecification?.unitText === '30 minutes'), `${page.path}: mini selfie price/duration mismatch`);
    check(offers.some(o => o.price === 16990 && o.priceSpecification?.referenceQuantity?.unitCode === 'HUR'), `${page.path}: hourly selfie price/unit mismatch`);
  }
  if (base === '/photographer-mentoring-budapest') {
    check(offers.length === 2 && offers.every(o => o.price === 99000 && !o.priceSpecification), `${page.path}: mentoring total confused with lesson price`);
  }
  if (base === '/models-budapest') {
    check(offers.some(o => o.price === 15000 && o.priceSpecification?.referenceQuantity?.unitCode === 'HUR'), `${page.path}: basic hourly model fee missing`);
  }
  if (page.section === 'faq') {
    const faq = schemas.find(n => hasType(n, 'FAQPage'));
    const answerText = faq?.mainEntity.map(q => q.acceptedAnswer?.text || '').join(' ') || '';
    check(answerText.includes('22%') || answerText.includes('22 %'), `${page.path}: stale FAQ savings`);
    check(!/25\s?%/.test(answerText), `${page.path}: stale FAQ saving percentage`);
  }
  count++; offerCount += offers.length;
}
if (errors.length) throw new Error(`Schema validation failed:\n${errors.join('\n')}`);
console.log(`Validated structured data on ${count} pages and ${offerCount} offer occurrences: identities, breadcrumbs, visible price parity, currency, units and studio tiers.`);
