import { execFileSync } from "node:child_process";
import { refreshGoogleAdsAccessToken } from "./refresh-auth.mjs";

const customerId = "2557578033";
const campaignId = "24293927948";
const base = `https://googleads.googleapis.com/v25/customers/${customerId}`;
const visitors = `customers/${customerId}/userLists/9374091801`;
const modelIntent = `customers/${customerId}/customAudiences/1019180019`;
const apply = process.argv.includes("--apply");

const categories = {
  corporate: {
    name: "Pro Photo | Corporate prospects",
    segment: "Pro Photo Intent | Corporate",
    keywords: ["corporate photographer Budapest", "business headshots Budapest", "team photoshoot Budapest", "company event photography Budapest", "céges fotózás Budapest", "üzleti portréfotózás Budapest", "csapatfotózás Budapest", "rendezvényfotózás Budapest"],
  },
  commercial: {
    name: "Pro Photo | Commercial prospects",
    segment: "Pro Photo Intent | Commercial",
    keywords: ["commercial photographer Budapest", "product photography Budapest", "advertising photography Budapest", "ecommerce product photos Budapest", "termékfotózás Budapest", "reklámfotózás Budapest", "webshop termékfotózás", "márkafotózás Budapest"],
  },
  fitness: {
    name: "Pro Photo | Fitness and yoga prospects",
    segment: "Pro Photo Intent | Fitness and Yoga",
    keywords: ["fitness photoshoot Budapest", "yoga photography Budapest", "personal trainer photoshoot", "sports portrait photography Budapest", "fitness fotózás Budapest", "jóga fotózás Budapest", "edző fotózás Budapest", "sport portréfotózás"],
  },
  wedding: {
    name: "Pro Photo | Wedding prospects",
    segment: "Pro Photo Intent | Wedding",
    keywords: ["wedding photographer Budapest", "wedding photography Hungary", "Budapest wedding photoshoot", "wedding photographer Hungary", "esküvői fotós Budapest", "esküvői fotózás Budapest", "esküvői fotós árak", "esküvő fotós Magyarország"],
  },
  model: {
    name: "Pro Photo | Model portfolio prospects",
    existingSegment: modelIntent,
  },
};

const groups = [
  { id: "6752285134", name: "Corporate Photography | HU", category: "corporate", themes: [] },
  { id: "6752324668", name: "Corporate Photography | EN", category: "corporate", themes: ["corporate photography Budapest", "business headshots Budapest", "corporate headshots", "team photography Budapest", "company portraits", "professional LinkedIn headshots", "business portrait photographer Budapest", "corporate event photographer", "conference photography Budapest", "company branding photography"] },
  { id: "6752441745", name: "Commercial Photography | HU", category: "commercial", themes: ["termékfotózás Budapest", "reklámfotózás Budapest", "kereskedelmi fotózás", "webshop termékfotózás", "katalógus fotózás", "lifestyle márkafotózás", "márkafotózás Budapest", "kampányfotózás", "professzionális termékfotózás", "közösségi média kampányfotózás"] },
  { id: "6752324665", name: "Commercial Photography | EN", category: "commercial", themes: ["commercial photography Budapest", "product photography Budapest", "advertising photographer Budapest", "ecommerce product photography", "brand campaign photography", "catalogue photography Budapest", "lifestyle brand photography", "professional product photos", "social media campaign photography", "marketing photography Budapest"] },
  { id: "6752324704", name: "Fitness & Yoga | HU", category: "fitness", themes: ["fitness fotózás Budapest", "jóga fotózás Budapest", "sportfotózás Budapest", "edző fotózás", "fitnesz portréfotózás", "jóga oktató fotózás", "személyi edző portré", "sportoló fotózás stúdióban", "fitness portfólió fotózás", "dinamikus sport portré"] },
  { id: "6752437710", name: "Fitness & Yoga | EN", category: "fitness", themes: ["fitness photography Budapest", "yoga photoshoot Budapest", "fitness portrait photographer", "personal trainer photoshoot", "yoga teacher branding photos", "sports portrait photography", "fitness portfolio photos", "athlete studio photoshoot", "dynamic fitness portraits", "wellness photography Budapest"] },
  { id: "6752335369", name: "Wedding Photography | HU", category: "wedding", themes: ["esküvői fotós Budapest", "esküvői fotózás Budapest", "esküvő fotós árak", "esküvői fotós Magyarország", "kreatív esküvői fotózás", "páros esküvői fotózás", "esküvői portrék", "polgári esküvő fotózás", "esküvői fotós ajánlat", "természetes esküvői képek"] },
  { id: "6752299193", name: "Modell Digitálok | HU", category: "model", themes: ["modell portfólió fotózás", "modell digitálok Budapest", "modell polaroid fotózás", "modell tesztfotózás", "modell portfólió Budapest", "casting fotók készítése", "ügynökségi modell képek", "modell bemutatkozó fotók", "modellfotózás stúdióban", "profi modell portfólió"] },
  { id: "6752438004", name: "Model Digitals | EN", category: "model", themes: ["model digitals Budapest", "model portfolio photography Budapest", "model polaroids photoshoot", "model test shoot Budapest", "agency model digitals", "casting photos for models", "professional model portfolio", "model headshots Budapest", "fashion model portfolio shoot", "model comp card photos"] },
];

const credential = JSON.parse(execFileSync("security", ["find-generic-password", "-s", "StudioAetherGoogleAdsAPI", "-a", "oauth-refresh-credentials", "-w"], { encoding: "utf8" }));
const { accessToken } = await refreshGoogleAdsAccessToken();
async function request(path, body) {
  const response = await fetch(`${base}/${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "developer-token": credential.developer_token, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`${path} (${response.status}): ${JSON.stringify(result)}`);
  return result;
}
async function search(query) {
  const chunks = await request("googleAds:searchStream", { query });
  return chunks.flatMap((chunk) => chunk.results ?? []);
}
async function mutate(path, operations) {
  if (!operations.length) return [];
  await request(path, { operations, validateOnly: true });
  const result = await request(path, { operations });
  return result.results ?? [];
}

const campaign = await search(`SELECT campaign.id, campaign.status FROM campaign WHERE campaign.id = ${campaignId}`);
if (campaign[0]?.campaign?.status !== "PAUSED") throw new Error("Photography campaign is not paused; refusing to change signals.");
const actualGroups = await search(`SELECT asset_group.id, asset_group.name, asset_group.status FROM asset_group WHERE campaign.id = ${campaignId}`);
for (const group of groups) {
  const actual = actualGroups.find((row) => row.assetGroup.id === group.id)?.assetGroup;
  if (!actual || actual.name !== group.name || actual.status !== "ENABLED") throw new Error(`Unexpected asset group state for ${group.id}.`);
}

let existingAudiences = (await search("SELECT audience.resource_name, audience.name FROM audience")).map((row) => row.audience);
let existingSegments = (await search("SELECT custom_audience.resource_name, custom_audience.name FROM custom_audience")).map((row) => row.customAudience);
let existingSignals = await search(`SELECT asset_group.id, asset_group_signal.audience.audience, asset_group_signal.search_theme.text FROM asset_group_signal WHERE campaign.id = ${campaignId}`);
console.log(JSON.stringify({ campaign: campaignId, groups: groups.map((group) => ({ name: group.name, audience: categories[group.category].name, themesToAdd: group.themes.filter((text) => !existingSignals.some((row) => row.assetGroup.id === group.id && row.assetGroupSignal.searchTheme?.text?.toLocaleLowerCase() === text.toLocaleLowerCase())) })) }, null, 2));
if (!apply) {
  console.log("Dry run only. Pass --apply to validate and create the missing audiences and signals.");
  process.exit(0);
}

for (const category of Object.values(categories)) {
  let segment = category.existingSegment;
  if (!segment) {
    segment = existingSegments.find((item) => item.name === category.segment)?.resourceName;
    if (!segment) {
      const created = await mutate("customAudiences:mutate", [{ create: { name: category.segment, description: "Search intent for professional photography services in Budapest; HU and EN terms.", type: "SEARCH", status: "ENABLED", members: category.keywords.map((keyword) => ({ memberType: "KEYWORD", keyword })) } }]);
      segment = created[0]?.resourceName;
      if (!segment) throw new Error(`Custom segment creation returned no resource for ${category.segment}.`);
      console.log(`Created custom segment: ${category.segment} (${segment})`);
      existingSegments.push({ name: category.segment, resourceName: segment });
    }
  }
  let audience = existingAudiences.find((item) => item.name === category.name)?.resourceName;
  if (!audience) {
    const created = await mutate("audiences:mutate", [{ create: { name: category.name, description: "Website visitors and service-specific search intent; signal, not targeting restriction.", scope: "CUSTOMER", dimensions: [{ audienceSegments: { segments: [{ userList: { userList: visitors } }, { customAudience: { customAudience: segment } }] } }] } }]);
    audience = created[0]?.resourceName;
    if (!audience) throw new Error(`Audience creation returned no resource for ${category.name}.`);
    console.log(`Created audience: ${category.name} (${audience})`);
    existingAudiences.push({ name: category.name, resourceName: audience });
  }
  category.audience = audience;
}

for (const group of groups) {
  const assetGroup = `customers/${customerId}/assetGroups/${group.id}`;
  const audience = categories[group.category].audience;
  const current = existingSignals.filter((row) => row.assetGroup.id === group.id).map((row) => row.assetGroupSignal);
  const oldAudience = current.find((signal) => signal.audience);
  if (oldAudience && oldAudience.audience.audience !== audience) throw new Error(`${group.name} already has another audience signal; review it first.`);
  const creates = [];
  if (!oldAudience) creates.push({ create: { assetGroup, audience: { audience } } });
  for (const text of group.themes) {
    if (!current.some((signal) => signal.searchTheme?.text?.toLocaleLowerCase() === text.toLocaleLowerCase())) creates.push({ create: { assetGroup, searchTheme: { text } } });
  }
  const created = await mutate("assetGroupSignals:mutate", creates);
  console.log(`${group.name}: ${created.length} signal(s) added`);
}

existingSignals = await search(`SELECT asset_group.id, asset_group_signal.audience.audience, asset_group_signal.search_theme.text, asset_group_signal.approval_status FROM asset_group_signal WHERE campaign.id = ${campaignId}`);
for (const group of groups) {
  const signals = existingSignals.filter((row) => row.assetGroup.id === group.id).map((row) => row.assetGroupSignal);
  const audience = categories[group.category].audience;
  if (!signals.some((signal) => signal.audience?.audience === audience)) throw new Error(`${group.name}: audience verification failed.`);
  for (const theme of group.themes) if (!signals.some((signal) => signal.searchTheme?.text?.toLocaleLowerCase() === theme.toLocaleLowerCase())) throw new Error(`${group.name}: missing theme ${theme}.`);
  console.log(`${group.name}: verified 1 audience + ${signals.filter((signal) => signal.searchTheme).length} search themes`);
}
console.log("Campaign remains paused. Search theme policy approvals may update asynchronously.");
