import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { refreshGoogleAdsAccessToken } from "./refresh-auth.mjs";

const customerId = "2557578033";
const campaignId = "24293927948";
const base = `https://googleads.googleapis.com/v25/customers/${customerId}`;
const groupName = "Wedding Photography | EN";
const imageDir = "/Users/aczel/My Drive (aczeldz@gmail.com)/aether/ADS/new ads";
const audience = `customers/${customerId}/audiences/359857248`;
const texts = [
  ["HEADLINE", "Wedding Photographer Budapest"],
  ["HEADLINE", "Wedding Photography Budapest"],
  ["HEADLINE", "Engagement Photos in Budapest"],
  ["HEADLINE", "Natural Wedding Photography"],
  ["HEADLINE", "Personal Couple Photoshoots"],
  ["HEADLINE", "Wedding & Engagement Photos"],
  ["HEADLINE", "Beautiful Wedding Portraits"],
  ["HEADLINE", "Book Your Wedding Photographer"],
  ["LONG_HEADLINE", "Natural and personal wedding and engagement photography in Budapest and across Hungary"],
  ["LONG_HEADLINE", "Wedding moments, couple portraits and engagement photos tailored to your story"],
  ["DESCRIPTION", "Capture your wedding day with natural, personal photos."],
  ["DESCRIPTION", "Wedding and engagement photography in Budapest and across Hungary."],
  ["DESCRIPTION", "Beautiful couple portraits and honest moments from your celebration."],
  ["DESCRIPTION", "Explore wedding photo coverage and contact us about your date."],
];
const images = [
  ["01", "PORTRAIT_MARKETING_IMAGE"], ["02", "PORTRAIT_MARKETING_IMAGE"],
  ["03", "SQUARE_MARKETING_IMAGE"], ["04", "SQUARE_MARKETING_IMAGE"],
  ["05", "MARKETING_IMAGE"], ["06", "MARKETING_IMAGE"],
];
const themes = ["wedding photographer Budapest", "wedding photography Budapest", "wedding photographer Hungary", "wedding photography Hungary", "engagement photoshoot Budapest", "couple photography Budapest", "natural wedding photography", "wedding portraits Budapest", "civil wedding photographer", "Budapest wedding photoshoot"];
for (const [type, value] of texts) {
  if (value.length > (type === "HEADLINE" ? 30 : 90)) throw new Error(`Text too long: ${value}`);
}
const credential = JSON.parse(execFileSync("security", ["find-generic-password", "-s", "StudioAetherGoogleAdsAPI", "-a", "oauth-refresh-credentials", "-w"], { encoding: "utf8" }));
const { accessToken } = await refreshGoogleAdsAccessToken();
async function request(path, body) {
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "developer-token": credential.developer_token, "content-type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(`${path} (${response.status}): ${JSON.stringify(result)}`);
  return result;
}
async function search(query) {
  const chunks = await request("/googleAds:searchStream", { query });
  return chunks.flatMap((chunk) => chunk.results ?? []);
}
async function mutate(path, operations) {
  await request(path, { operations, validateOnly: true });
  return (await request(path, { operations })).results ?? [];
}
const campaign = await search(`SELECT campaign.id, campaign.status FROM campaign WHERE campaign.id = ${campaignId}`);
if (campaign[0]?.campaign?.status !== "PAUSED") throw new Error("Campaign must be paused.");
const groups = await search(`SELECT asset_group.id, asset_group.name FROM asset_group WHERE campaign.id = ${campaignId}`);
if (groups.some((row) => row.assetGroup.name === groupName)) throw new Error(`${groupName} already exists; inspect before retrying.`);
const existingAssets = await search("SELECT asset.resource_name, asset.name, asset.type FROM asset WHERE asset.type IN ('TEXT', 'IMAGE')");
async function ensureAsset(name, create) {
  const matches = existingAssets.filter((row) => row.asset.name === name);
  if (matches.length > 1) throw new Error(`Ambiguous existing asset: ${name}`);
  if (matches.length) return matches[0].asset.resourceName;
  const result = await mutate("/assets:mutate", [{ create: { name, ...create } }]);
  const resourceName = result[0]?.resourceName;
  if (!resourceName) throw new Error(`No resource returned for ${name}`);
  console.log(`Uploaded ${name}: ${resourceName}`);
  existingAssets.push({ asset: { resourceName, name } });
  return resourceName;
}
const links = [];
for (const [index, [type, value]] of texts.entries()) {
  const name = type === "HEADLINE" ? `${groupName} | ${type} | ${value}` : `${groupName} | ${type} | ${index + 1}`;
  const asset = await ensureAsset(name, { textAsset: { text: value } });
  links.push({ asset, fieldType: type });
}
for (const [number, fieldType] of images) {
  const filename = `wedding - en - ${number}.jpg`;
  const asset = await ensureAsset(`${groupName} | ${filename}`, { imageAsset: { data: readFileSync(`${imageDir}/${filename}`).toString("base64") } });
  links.push({ asset, fieldType });
}
const tempGroup = `customers/${customerId}/assetGroups/-1`;
const operations = [
  { assetGroupOperation: { create: { resourceName: tempGroup, campaign: `customers/${customerId}/campaigns/${campaignId}`, name: groupName, finalUrls: ["https://www.studioaether.com/wedding-photography"], status: "ENABLED" } } },
  ...links.map(({ asset, fieldType }) => ({ assetGroupAssetOperation: { create: { assetGroup: tempGroup, asset, fieldType } } })),
];
await request("/googleAds:mutate", { mutateOperations: operations, validateOnly: true });
const created = await request("/googleAds:mutate", { mutateOperations: operations });
const group = created.mutateOperationResponses?.[0]?.assetGroupResult?.resourceName;
if (!group) throw new Error(`No group returned: ${JSON.stringify(created)}`);
console.log(`Created ${groupName}: ${group}`);
const signals = [{ create: { assetGroup: group, audience: { audience } } }, ...themes.map((text) => ({ create: { assetGroup: group, searchTheme: { text } } }))];
const signalResult = await mutate("/assetGroupSignals:mutate", signals);
console.log(`Added ${signalResult.length} signals`);
const id = group.split("/").at(-1);
const actualGroup = await search(`SELECT asset_group.id, asset_group.name, asset_group.status, asset_group.final_urls, asset_group.ad_strength FROM asset_group WHERE asset_group.id = ${id}`);
const actualLinks = await search(`SELECT asset_group_asset.field_type, asset.id, asset.name FROM asset_group_asset WHERE asset_group.id = ${id}`);
const actualSignals = await search(`SELECT asset_group_signal.audience.audience, asset_group_signal.search_theme.text FROM asset_group_signal WHERE asset_group.id = ${id}`);
console.log(JSON.stringify({ group: actualGroup[0]?.assetGroup, assetCounts: Object.fromEntries([...new Set(actualLinks.map((r) => r.assetGroupAsset.fieldType))].map((type) => [type, actualLinks.filter((r) => r.assetGroupAsset.fieldType === type).length])), audience: actualSignals.map((r) => r.assetGroupSignal.audience?.audience).filter(Boolean), searchThemes: actualSignals.map((r) => r.assetGroupSignal.searchTheme?.text).filter(Boolean), campaignStatus: (await search(`SELECT campaign.status FROM campaign WHERE campaign.id = ${campaignId}`))[0]?.campaign?.status }, null, 2));
