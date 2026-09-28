import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { refreshGoogleAdsAccessToken } from "./refresh-auth.mjs";

const customerId = "2557578033";
const campaignId = "24293927948";
const base = `https://googleads.googleapis.com/v25/customers/${customerId}`;
const dir = "/Users/aczel/My Drive (aczeldz@gmail.com)/aether/ADS/new ads";
const groups = [
  { id: "6752438004", name: "Model Digitals | EN", images: [["modeldigitals - en - 04.jpg", "SQUARE_MARKETING_IMAGE"], ["modeldigitals - en - 05.jpg", "PORTRAIT_MARKETING_IMAGE"], ["modeldigitals - en - 06.jpg", "MARKETING_IMAGE"]] },
  { id: "6752299193", name: "Modell Digitálok | HU", images: [["modeldigital - hu - 4.jpg", "PORTRAIT_MARKETING_IMAGE"], ["modeldigital - hu - 5.jpg", "MARKETING_IMAGE"], ["modeldigital - hu - 6.jpg", "SQUARE_MARKETING_IMAGE"]] },
];
const credential = JSON.parse(execFileSync("security", ["find-generic-password", "-s", "StudioAetherGoogleAdsAPI", "-a", "oauth-refresh-credentials", "-w"], { encoding: "utf8" }));
const { accessToken } = await refreshGoogleAdsAccessToken();
async function request(path, body) {
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "developer-token": credential.developer_token, "content-type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(`${path} (${response.status}): ${JSON.stringify(result)}`);
  return result;
}
async function search(query) {
  return (await request("/googleAds:searchStream", { query })).flatMap((chunk) => chunk.results ?? []);
}
async function mutate(path, operations) {
  await request(path, { operations, validateOnly: true });
  return (await request(path, { operations })).results ?? [];
}
const campaign = await search(`SELECT campaign.id, campaign.status FROM campaign WHERE campaign.id = ${campaignId}`);
if (campaign[0]?.campaign?.status !== "PAUSED") throw new Error("Campaign is not paused; refusing to modify assets.");
const foundGroups = await search(`SELECT asset_group.id, asset_group.name, asset_group.status FROM asset_group WHERE campaign.id = ${campaignId}`);
for (const group of groups) {
  const found = foundGroups.find((row) => row.assetGroup.id === group.id)?.assetGroup;
  if (!found || found.name !== group.name || found.status !== "ENABLED") throw new Error(`Unexpected asset group state for ${group.id}.`);
}
const links = await search(`SELECT asset_group.id, asset_group_asset.asset, asset_group_asset.field_type FROM asset_group_asset WHERE campaign.id = ${campaignId}`);
const assets = await search("SELECT asset.resource_name, asset.name, asset.type FROM asset WHERE asset.type = 'IMAGE'");
const toLink = [];
for (const group of groups) {
  const groupResource = `customers/${customerId}/assetGroups/${group.id}`;
  const current = links.filter((row) => row.assetGroup.id === group.id).map((row) => row.assetGroupAsset);
  for (const [filename, fieldType] of group.images) {
    const name = `${group.name} | ${filename}`;
    let assetResource = assets.find((row) => row.asset.name === name)?.asset.resourceName;
    if (!assetResource) {
      const result = await mutate("/assets:mutate", [{ create: { name, imageAsset: { data: readFileSync(`${dir}/${filename}`).toString("base64") } } }]);
      assetResource = result[0]?.resourceName;
      if (!assetResource) throw new Error(`No asset resource returned for ${filename}`);
      assets.push({ asset: { resourceName: assetResource, name, type: "IMAGE" } });
      console.log(`Uploaded ${name}`);
    }
    if (current.some((item) => item.asset === assetResource)) {
      console.log(`Already linked: ${name}`);
      continue;
    }
    toLink.push({ create: { assetGroup: groupResource, asset: assetResource, fieldType } });
  }
}
const results = await mutate("/assetGroupAssets:mutate", toLink);
console.log(`Linked ${results.length} images.`);
for (const group of groups) {
  const current = await search(`SELECT asset_group_asset.field_type, asset.name, asset.resource_name FROM asset_group_asset WHERE asset_group.id = ${group.id} AND asset.type = 'IMAGE'`);
  const counts = Object.fromEntries([...new Set(current.map((row) => row.assetGroupAsset.fieldType))].map((type) => [type, current.filter((row) => row.assetGroupAsset.fieldType === type).length]));
  console.log(JSON.stringify({ group: group.name, imageCount: current.length, formats: counts, assets: current.map((row) => row.asset.name) }, null, 2));
}
