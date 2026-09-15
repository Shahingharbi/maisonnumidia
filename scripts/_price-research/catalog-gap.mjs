#!/usr/bin/env node
// Combien de parfums vendus par les boutiques algériennes concurrentes ne sont PAS dans
// notre catalogue ? Regroupe les offres des 12 sites en "parfums uniques" (marque + mots
// distinctifs du nom + Parfum/Extrait), retire ce qu'on a déjà, compte le nombre de
// boutiques qui vendent chaque parfum (= signal de demande locale) et le prix marché.
// Lecture seule. Sortie : scripts/_price-research/gap-list.json
// Usage (depuis la racine du repo) : node scripts/_price-research/catalog-gap.mjs
import fs from "fs";
import { norm, FILLER, brandSignatures, tokensOf, concOf, volOf, NON_PERFUME, genderWord } from "./lib-match.mjs";

const RAW = "./scripts/_price-research/raw2";
const EXCLUDED = new Set(["smellgood"]); // décants
const { products, brands } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const report = JSON.parse(fs.readFileSync("./scripts/_price-research/report-v3.json", "utf8"));
const matchedUrls = new Set(report.flatMap((r) => [...(r.sources || []), ...(r.weakSources || [])].map((s) => s.url)).filter(Boolean));

// ─── Dictionnaire de marques ───────────────────────────────────────────────────
const EXTRA_BRAND_TOKENS = new Set(["christian", "emporio", "giorgio", "parfums", "prives", "paris", "maison", "london", "perfumes"]);
const GENERIC_VENDORS = new Set(["parfum algerie", "parfumalgerie", "default", ""]);
const ourBrandNames = [...new Set([...brands.map((b) => b.name), ...products.map((p) => p.brand)])];
const ourBrands = ourBrandNames.map((name) => ({ key: norm(name), name, sigs: brandSignatures(name) }))
  .sort((a, b) => Math.max(...b.sigs.map((s) => s.join(" ").length)) - Math.max(...a.sigs.map((s) => s.join(" ").length)));
const OUR_BRAND_KEYS = new Set(ourBrands.map((b) => b.key));

function resolveOurBrand(tokSet) {
  for (const b of ourBrands) if (b.sigs.some((sig) => sig.length && sig.every((t) => tokSet.has(t)))) return b;
  return null;
}
const stripGeneric = (s) => norm(s).split(" ").filter((t) => t.length > 1 && !["parfums", "parfum", "paris", "prives", "perfumes", "fragrances", "maison", "london", "de", "the", "by"].includes(t)).join(" ");

// Marques vues chez les concurrents (hors nos marques) pour reconnaître les noms sans champ marque
const foreignBrands = new Map();
for (const f of fs.readdirSync(RAW).filter((f) => f.endsWith(".json"))) {
  if (EXCLUDED.has(f.replace(".json", ""))) continue;
  for (const it of JSON.parse(fs.readFileSync(`${RAW}/${f}`, "utf8"))) {
    const bf = norm(it.brand || it.vendor || "");
    if (!bf || GENERIC_VENDORS.has(bf)) continue;
    if (resolveOurBrand(new Set(bf.split(" ")))) continue;
    const k = stripGeneric(bf);
    if (k && k.length >= 3) foreignBrands.set(k, (foreignBrands.get(k) || 0) + 1);
  }
}
const foreignList = [...foreignBrands.entries()].filter(([, n]) => n >= 2).map(([k]) => ({ key: k, toks: k.split(" ") }))
  .sort((a, b) => b.key.length - a.key.length);

function brandOf(it) {
  const nameToks = new Set(tokensOf(it.name));
  const bf = norm(it.brand || it.vendor || "");
  if (bf && !GENERIC_VENDORS.has(bf)) {
    const ob = resolveOurBrand(new Set(bf.split(" ")));
    if (ob) return { key: ob.key, label: ob.name, ours: true };
    const k = stripGeneric(bf);
    if (k) return { key: k, label: it.brand || it.vendor, ours: false };
  }
  const ob = resolveOurBrand(nameToks);
  if (ob) return { key: ob.key, label: ob.name, ours: true };
  const fb = foreignList.find((b) => b.toks.every((t) => nameToks.has(t)));
  if (fb) return { key: fb.key, label: fb.key, ours: false };
  return null;
}

const CONC_WORDS = new Set(["parfum", "extrait", "eau", "toilette", "edp", "edt", "edc", "spray", "vaporisateur"]);
function productKey(brand, name) {
  const b = ourBrands.find((x) => x.key === brand.key);
  const brandToks = new Set([...(b ? b.sigs.flat() : brand.key.split(" ")), ...EXTRA_BRAND_TOKENS]);
  const toks = tokensOf(name).filter((t) => !brandToks.has(t) && !FILLER.has(t) && !CONC_WORDS.has(t) && !/^(19|20)\d{2}$/.test(t) && t.length > 1);
  const conc = concOf(name);
  const rich = conc === "PARFUM" || conc === "EXTRAIT";
  return `${brand.key}|${[...new Set(toks)].sort().join(" ") || "_"}${rich ? "|P" : ""}`;
}

// ─── Nos produits ──────────────────────────────────────────────────────────────
const ourKeys = new Set();
for (const p of products) {
  const b = resolveOurBrand(new Set(norm(p.brand).split(" "))) || { key: norm(p.brand), name: p.brand };
  ourKeys.add(productKey({ key: b.key }, `${p.name}${p.concentration === "Parfum" && !/parfum/i.test(p.name) ? "" : ""}`));
}

// ─── Regroupement des offres concurrentes ─────────────────────────────────────
const clusters = new Map();
let skippedNoBrand = 0, skippedFormat = 0;
for (const f of fs.readdirSync(RAW).filter((f) => f.endsWith(".json"))) {
  const site = f.replace(".json", "");
  if (EXCLUDED.has(site)) continue;
  for (const it of JSON.parse(fs.readFileSync(`${RAW}/${f}`, "utf8"))) {
    if (NON_PERFUME.test(it.name) || (it.cats || []).some((c) => /coffret|d[ée]odorant|soin|bain|maquillage|makeup|bougie|accessoire|cosm/i.test(c))) { skippedFormat++; continue; }
    const vol = volOf(it.name) || volOf((it.variants || []).map((v) => v.label).join(" "));
    if (vol && vol < 30) { skippedFormat++; continue; }
    const price = it.variants?.length ? Math.max(...it.variants.map((v) => v.price || 0)) : it.price;
    if (!price || price < 3000) { skippedFormat++; continue; }
    const brand = brandOf(it);
    if (!brand) { skippedNoBrand++; continue; }
    const key = productKey(brand, it.name);
    if (!clusters.has(key)) clusters.set(key, { key, brand: brand.label, brandIsOurs: brand.ours || OUR_BRAND_KEYS.has(brand.key), names: new Set(), sites: new Set(), prices100: [], inStock: false, matched: false, gender: {} });
    const c = clusters.get(key);
    c.names.add(it.name);
    c.sites.add(site);
    const v = vol || 100;
    c.prices100.push(Math.round(price * Math.pow(100 / v, 0.72)));
    if (it.inStock !== false) c.inStock = true;
    if (matchedUrls.has(it.url)) c.matched = true;
    const g = genderWord(`${it.name} ${(it.cats || []).join(" ")}`);
    if (g) c.gender[g] = (c.gender[g] || 0) + 1;
  }
}

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
const all = [...clusters.values()].map((c) => ({
  ...c,
  names: [...c.names].slice(0, 3),
  sites: [...c.sites],
  shopCount: c.sites.size,
  price100: median(c.prices100),
  gender: Object.entries(c.gender).sort((a, b) => b[1] - a[1])[0]?.[0] === "h" ? "homme" : Object.keys(c.gender).length ? "femme" : "?",
  ours: c.matched || ourKeys.has(c.key),
}));

const missing = all.filter((c) => !c.ours);
fs.writeFileSync("./scripts/_price-research/gap-list.json", JSON.stringify(missing.sort((a, b) => b.shopCount - a.shopCount || b.prices100.length - a.prices100.length).map(({ prices100, ...rest }) => rest), null, 1));

const cnt = (arr, f) => arr.filter(f).length;
console.log(`Parfums uniques chez les concurrents : ${all.length} (offres ignorées : ${skippedFormat} formats non-parfum/minis/coffrets, ${skippedNoBrand} marque introuvable)`);
console.log(`Déjà dans notre catalogue : ${cnt(all, (c) => c.ours)}`);
console.log(`ABSENTS de notre catalogue : ${missing.length}`);
console.log(`  vendus par 4+ boutiques : ${cnt(missing, (c) => c.shopCount >= 4)}`);
console.log(`  vendus par 3 boutiques  : ${cnt(missing, (c) => c.shopCount === 3)}`);
console.log(`  vendus par 2 boutiques  : ${cnt(missing, (c) => c.shopCount === 2)}`);
console.log(`  vendus par 1 boutique   : ${cnt(missing, (c) => c.shopCount === 1)}`);
const rel = missing.filter((c) => c.shopCount >= 2);
console.log(`\nPertinents (2+ boutiques) : ${rel.length} — dont marques qu'on vend déjà : ${cnt(rel, (c) => c.brandIsOurs)}, nouvelles marques : ${cnt(rel, (c) => !c.brandIsOurs)}, en stock quelque part : ${cnt(rel, (c) => c.inStock)}`);
console.log(`  genre : homme ${cnt(rel, (c) => c.gender === "homme")} | femme ${cnt(rel, (c) => c.gender === "femme")} | non précisé ${cnt(rel, (c) => c.gender === "?")}`);
const band = (lo, hi) => cnt(rel, (c) => c.price100 >= lo && c.price100 < hi);
console.log(`  prix marché (≈100 ml) : <10k ${band(0, 10000)} | 10-20k ${band(10000, 20000)} | 20-35k ${band(20000, 35000)} | 35-60k ${band(35000, 60000)} | 60k+ ${band(60000, 1e9)}`);
const brandCount = {};
rel.forEach((c) => { brandCount[c.brand] = (brandCount[c.brand] || 0) + 1; });
console.log(`\nMarques avec le plus de parfums manquants (2+ boutiques) : ${Object.entries(brandCount).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([b, n]) => `${b} ${n}`).join(", ")}`);
console.log(`\nTop 40 absents (le plus de boutiques) :`);
missing.sort((a, b) => b.shopCount - a.shopCount || a.price100 - b.price100).slice(0, 40)
  .forEach((c) => console.log(`  ${c.shopCount} boutiques | ~${c.price100} DA | ${c.brand} — ${c.names[0]}`));
