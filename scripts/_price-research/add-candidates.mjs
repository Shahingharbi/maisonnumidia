#!/usr/bin/env node
// Liste DÉDOUBLONNÉE des parfums vendus par les boutiques algériennes et absents de notre
// catalogue — base de travail pour les ajouts de produits.
// Clé d'un parfum = marque + mots distinctifs du nom + concentration (EDT/EDP/Parfum/Extrait/EDC)
//                   + genre écrit (homme/femme), avec rattachement des offres "sans concentration"
//                   ou "sans genre" à la variante connue quand il n'y en a qu'une.
// Doublons contrôlés : entre sites concurrents, et avec NOTRE catalogue (même marque + mêmes mots
// + même genre = existant ; autre concentration seulement = "variante" signalée à part).
// Lecture seule. Sorties : scripts/_price-research/add-candidates.json (+ résumé console)
import fs from "fs";
import { norm, FILLER, brandSignatures, TOKEN_ALIASES, volOf, NON_PERFUME } from "./lib-match.mjs";

const RAW = "./scripts/_price-research/raw2";
const EXCLUDED_SITES = new Set(["smellgood"]); // décants
const PREMIUM = 0.03;
const { products, brands } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const report = JSON.parse(fs.readFileSync("./scripts/_price-research/report-v3.json", "utf8"));
const matchedUrls = new Set(report.flatMap((r) => [...(r.sources || []), ...(r.weakSources || [])].map((s) => s.url)).filter(Boolean));

const COMMON_VOLUMES = new Set([5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 150, 160, 175, 180, 185, 200, 250, 300]);
// Accessoires vendus par certaines parfumeries (montres MK3377, sacs "Montaigne 30 8071I", packs promo)
const ACCESSORY = /\b[a-z]{1,4}\d{3,}[a-z]?\b|\b\d{4}[a-z]\b|\b\d{5,}\b|\b(sac|montre|watch|bag|portefeuille|wallet|lunettes|sunglasses|bracelet|ceinture|belt|porte[- ]?cl[ée]s?|keychain|pack|lot de)\b/i;
const KIDS = /\b(kids?|enfants?|b[ée]b[ée]|baby|junior|disney|barbie|spiderman|frozen|minions|paw patrol)\b/i;
const ORIENTAL_BRANDS = /lattafa|haramain|rasasi|armaf|afnan|ajmal|arabian oud|swiss arabian|rehab|orientica|nabil|alhambra|fragrance world|paris corner|khadlaj|zaafaran|french avenue|emir|ahmed al maghribi|asdaaf|maison asrar|nabeel|al wataniah|rayhaan|riiffs/i;

// ─── Marques ───────────────────────────────────────────────────────────────────
const EXTRA_BRAND_TOKENS = ["christian", "emporio", "giorgio", "parfums", "prives", "paris", "maison", "london", "perfumes", "fragrances"];
const GENERIC_VENDORS = new Set(["parfum algerie", "parfumalgerie", "default", ""]);
const ourBrandNames = [...new Set([...brands.map((b) => b.name), ...products.map((p) => p.brand)])];
const ourBrands = ourBrandNames.map((name) => ({ key: norm(name), name, sigs: brandSignatures(name) }))
  .sort((a, b) => Math.max(...b.sigs.map((s) => s.join(" ").length)) - Math.max(...a.sigs.map((s) => s.join(" ").length)));
const resolveOurBrand = (tokSet) => ourBrands.find((b) => b.sigs.some((sig) => sig.length && sig.every((t) => tokSet.has(t)))) || null;
const stripGeneric = (s) => norm(s).split(" ").filter((t) => t.length > 1 && !["parfums", "parfum", "paris", "prives", "perfumes", "fragrances", "maison", "london", "de", "the", "by"].includes(t)).join(" ");

const rawSites = fs.readdirSync(RAW).filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", "")).filter((s) => !EXCLUDED_SITES.has(s));
const raw = Object.fromEntries(rawSites.map((s) => [s, JSON.parse(fs.readFileSync(`${RAW}/${s}.json`, "utf8"))]));

const foreignCount = new Map();
const foreignLabel = new Map();
for (const items of Object.values(raw)) for (const it of items) {
  const bf = norm(it.brand || it.vendor || "");
  if (!bf || GENERIC_VENDORS.has(bf) || resolveOurBrand(new Set(bf.split(" ")))) continue;
  const k = stripGeneric(bf);
  if (k.length >= 3) { foreignCount.set(k, (foreignCount.get(k) || 0) + 1); if (!foreignLabel.has(k)) foreignLabel.set(k, (it.brand || it.vendor).trim()); }
}
const foreignList = [...foreignCount.entries()].filter(([, n]) => n >= 2).map(([k]) => ({ key: k, toks: k.split(" ") })).sort((a, b) => b.key.length - a.key.length);

// ─── Normalisation du nom ──────────────────────────────────────────────────────
function concFromText(t) {
  if (/\bextrait\b/.test(t)) return "Extrait";
  if (/eau de toilette|\bedt\b/.test(t)) return "EDT";
  if (/eau de cologne|\bedc\b/.test(t)) return "EDC";
  if (/eau de parfum|\bedp\b/.test(t)) return "EDP";
  if (/\b(le )?parfum\b/.test(t.replace(/parfums? de marly/g, "").replace(/^parfums?\s+(homme|femme|pour|mixte|unisexe)\b/, ""))) return "Parfum";
  return null;
}
function genderFromText(t) {
  if (/\b(femme|women|woman|her|elle|lady|donna|pour elle)\b/.test(t)) return "f";
  if (/\b(homme|men|man|him|lui|uomo|pour lui)\b/.test(t)) return "h";
  return null;
}
function analyse(name, brand) {
  let t = norm(String(name).replace(/\(\s*dupe[^)]*\)/gi, " ").replace(/\bdupe\b.*$/i, " ").replace(/\d+(?:[.,]\d+)?\s*(?:ml|oz|fl\.?\s*oz)\b/gi, " "));
  const conc = concFromText(t);
  const gender = genderFromText(t);
  t = t.replace(/eau de parfum|eau de toilette|eau de cologne|extrait de parfum/g, " ").replace(/\b(edp|edt|edc|extrait|le parfum|parfum|intense parfum)\b/g, (m) => (m === "le parfum" || m === "parfum" ? " " : " "));
  const b = ourBrands.find((x) => x.key === brand.key);
  const brandToks = new Set([...(b ? b.sigs.flat() : brand.key.split(" ")), ...EXTRA_BRAND_TOKENS]);
  const toks = t.split(" ").filter(Boolean).map((x) => TOKEN_ALIASES[x] || x)
    .filter((x) => x.length > 1 && !brandToks.has(x) && !FILLER.has(x) && !/^(19|20)\d{2}$/.test(x) && !(/^\d+$/.test(x) && COMMON_VOLUMES.has(parseInt(x, 10))) && x !== "spray" && x !== "vaporisateur");
  return { base: [...new Set(toks)].sort().join(" ") || "_", conc, gender };
}
function brandOf(it) {
  const bf = norm(it.brand || it.vendor || "");
  if (bf && !GENERIC_VENDORS.has(bf)) {
    const ob = resolveOurBrand(new Set(bf.split(" ")));
    if (ob) return { key: ob.key, label: ob.name, ours: true };
    const k = stripGeneric(bf);
    if (k) return { key: k, label: foreignLabel.get(k) || it.brand || it.vendor, ours: false };
  }
  const nameToks = new Set(norm(it.name).split(" "));
  const ob = resolveOurBrand(nameToks);
  if (ob) return { key: ob.key, label: ob.name, ours: true };
  const fb = foreignList.find((b) => b.toks.every((t) => nameToks.has(t)));
  return fb ? { key: fb.key, label: foreignLabel.get(fb.key) || fb.key, ours: false } : null;
}

// ─── Notre catalogue ───────────────────────────────────────────────────────────
const ourByBase = new Map(); // brand|base|gender -> [conc]
const ourSlugByBase = new Map();
for (const p of products) {
  const ob = resolveOurBrand(new Set(norm(p.brand).split(" "))) || { key: norm(p.brand), name: p.brand };
  const a = analyse(`${p.name} ${p.concentration}`, { key: ob.key });
  const g = genderFromText(norm(p.name)) || (p.gender === "homme" ? "h" : p.gender === "femme" ? "f" : null);
  for (const gg of [g, null]) {
    const k = `${ob.key}|${a.base}|${gg || "-"}`;
    if (!ourByBase.has(k)) { ourByBase.set(k, new Set()); ourSlugByBase.set(k, p.slug); }
    ourByBase.get(k).add(a.conc || (p.concentration.startsWith("EDT") ? "EDT" : p.concentration.startsWith("EDP") ? "EDP" : p.concentration === "Parfum" ? "Parfum" : /Extrait/.test(p.concentration) ? "Extrait" : "EDC"));
  }
}

// ─── Offres concurrentes ──────────────────────────────────────────────────────
const offers = [];
let skipFormat = 0, skipBrand = 0, skipKids = 0;
for (const [site, items] of Object.entries(raw)) {
  for (const it of items) {
    if (NON_PERFUME.test(it.name) || (it.cats || []).some((c) => /coffret|testeur|tester|d[ée]odorant|soin|bain|maquillage|makeup|bougie|accessoire|cosm/i.test(c))) { skipFormat++; continue; }
    if (KIDS.test(it.name)) { skipKids++; continue; }
    if (ACCESSORY.test(norm(it.name).replace(/\b(19|20)\d{2}\b/g, ""))) { skipFormat++; continue; }
    const brand = brandOf(it);
    if (!brand) { skipBrand++; continue; }
    const regularUplift = site === "leena" && it.regular && it.price && it.regular > it.price ? it.regular / it.price : 1;
    const variants = it.variants?.length ? it.variants.map((v) => ({ vol: volOf(v.label) || volOf(it.name), price: Math.round((v.price || 0) * regularUplift) })) : [{ vol: volOf(it.name) || volOf((it.attrs || []).flatMap((a) => a.terms || []).join(" ")), price: Math.round((it.price || 0) * regularUplift) }];
    const a = analyse(it.name, brand);
    for (const v of variants) {
      if (!v.price || v.price < 3000) { skipFormat++; continue; }
      if (v.vol && v.vol < 30) { skipFormat++; continue; }
      offers.push({ site, url: it.url, name: it.name, brand, ...a, vol: v.vol, price: v.price, inStock: it.inStock !== false, matched: matchedUrls.has(it.url) });
    }
  }
}

// ─── Regroupement : marque|base ; puis rattachement concentration / genre ─────
const groups = new Map();
for (const o of offers) {
  const k = `${o.brand.key}|${o.base}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(o);
}
const candidates = [];
for (const [gk, list] of groups) {
  // genres explicites présents
  const genders = [...new Set(list.map((o) => o.gender).filter(Boolean))];
  for (const o of list) if (!o.gender && genders.length === 1) o.gender = genders[0];
  const byGender = new Map();
  for (const o of list) { const g = o.gender || "-"; if (!byGender.has(g)) byGender.set(g, []); byGender.get(g).push(o); }
  // si un groupe "-" coexiste avec h ET f, on le rattache au plus gros des deux
  if (byGender.has("-") && byGender.has("h") && byGender.has("f")) {
    const target = byGender.get("h").length >= byGender.get("f").length ? "h" : "f";
    byGender.get(target).push(...byGender.get("-")); byGender.delete("-");
  }
  for (const [g, glist] of byGender) {
    const concs = [...new Set(glist.map((o) => o.conc).filter(Boolean))];
    for (const o of glist) if (!o.conc && concs.length === 1) o.conc = concs[0];
    const byConc = new Map();
    for (const o of glist) { const c = o.conc || "?"; if (!byConc.has(c)) byConc.set(c, []); byConc.get(c).push(o); }
    // concentration inconnue alors que plusieurs connues : rattachée à la plus vendue
    if (byConc.has("?") && byConc.size > 1) {
      const main = [...byConc.entries()].filter(([c]) => c !== "?").sort((a, b) => b[1].length - a[1].length)[0][0];
      byConc.get(main).push(...byConc.get("?")); byConc.delete("?");
    }
    for (const [c, clist] of byConc) {
      const [brandKey, base] = gk.split("|");
      const sites = [...new Set(clist.map((o) => o.site))];
      // contenance la plus fréquente et prix médian à cette contenance (sinon ramené à 100 ml)
      const volCount = {};
      clist.forEach((o) => { if (o.vol) volCount[o.vol] = (volCount[o.vol] || 0) + 1; });
      const mainVol = Object.entries(volCount).sort((a, b) => b[1] - a[1] || Math.abs(100 - a[0]) - Math.abs(100 - b[0]))[0]?.[0];
      const atVol = mainVol ? clist.filter((o) => String(o.vol) === mainVol).map((o) => o.price) : clist.map((o) => o.price);
      const med = [...atVol].sort((a, b) => a - b)[atVol.length >> 1];
      const target = med * (1 + PREMIUM);
      const proposed = Math.ceil(target / (target < 10000 ? 100 : 500)) * (target < 10000 ? 100 : 500);
      // statut vs notre catalogue
      const ourK = [`${brandKey}|${base}|${g}`, `${brandKey}|${base}|-`];
      const ourConcs = ourK.map((k) => ourByBase.get(k)).find(Boolean);
      const anyMatched = clist.some((o) => o.matched);
      let status = "nouveau";
      if (anyMatched || (ourConcs && (ourConcs.has(c) || c === "?"))) status = "deja-au-catalogue";
      else if (ourConcs) status = "variante-concentration";
      // nom affiché : le plus court des noms concurrents nettoyés
      const display = clist.map((o) => o.name.replace(/\(\s*dupe[^)]*\)/gi, "").replace(/\bdupe\b.*$/i, "").replace(/\d+(?:[.,]\d+)?\s*(?:ml|oz)\b/gi, "").replace(/[-–]+/g, " ").replace(/\s+/g, " ").trim())
        .sort((a, b) => a.length - b.length)[0];
      candidates.push({
        id: `${brandKey}|${base}|${g}|${c}`,
        brand: clist[0].brand.label, brandInCatalog: clist[0].brand.ours, name: display, base, concentration: c === "?" ? null : c,
        gender: g === "h" ? "homme" : g === "f" ? "femme" : null,
        category: ORIENTAL_BRANDS.test(`${clist[0].brand.label} ${display}`) ? "parfums-orientaux" : g === "h" ? "parfums-homme" : g === "f" ? "parfums-femme" : "a-determiner",
        volume: mainVol ? `${mainVol}ml` : null, marketPrice: med, proposedPrice: proposed,
        shopCount: sites.length, sites, inStock: clist.some((o) => o.inStock), offers: clist.length,
        urls: [...new Set(clist.map((o) => o.url))].slice(0, 3), status,
        ourSlug: status !== "nouveau" ? ourSlugByBase.get(ourK.find((k) => ourByBase.has(k))) || null : null,
      });
    }
  }
}

// ─── Fusion des doublons validés ───────────────────────────────────────────────
// dup-auto.json    : fautes d'orthographe/translittération sûres (audit-duplicates.mjs)
// dup-verdicts.json: paires "mot en plus" tranchées par les agents (sameProduct = true)
const mergePairs = [];
for (const f of ["dup-auto.json", "dup-verdicts.json"]) {
  const p = `./scripts/_price-research/${f}`;
  if (fs.existsSync(p)) for (const x of JSON.parse(fs.readFileSync(p, "utf8"))) if (x.sameProduct !== false) mergePairs.push([x.aId, x.bId]);
}
if (mergePairs.length) {
  const idx = new Map(candidates.map((c, i) => [c.id, i]));
  const parent = candidates.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (const [a, b] of mergePairs) { const i = idx.get(a), j = idx.get(b); if (i != null && j != null) parent[find(i)] = find(j); }
  const groupsById = new Map();
  candidates.forEach((c, i) => { const r = find(i); if (!groupsById.has(r)) groupsById.set(r, []); groupsById.get(r).push(c); });
  const merged = [];
  for (const members of groupsById.values()) {
    if (members.length === 1) { merged.push(members[0]); continue; }
    const primary = [...members].sort((a, b) => (a.status === "nouveau") - (b.status === "nouveau") || b.offers - a.offers)[0];
    const sites = [...new Set(members.flatMap((m) => m.sites))];
    merged.push({
      ...primary,
      sites, shopCount: sites.length,
      offers: members.reduce((s, m) => s + m.offers, 0),
      inStock: members.some((m) => m.inStock),
      urls: [...new Set(members.flatMap((m) => m.urls))].slice(0, 3),
      status: members.some((m) => m.status === "deja-au-catalogue") ? "deja-au-catalogue" : members.some((m) => m.status === "variante-concentration") ? "variante-concentration" : "nouveau",
      ourSlug: members.find((m) => m.ourSlug)?.ourSlug || null,
      concentration: primary.concentration || members.find((m) => m.concentration)?.concentration || null,
      gender: primary.gender || members.find((m) => m.gender)?.gender || null,
      mergedFrom: members.filter((m) => m !== primary).map((m) => m.name),
    });
  }
  console.log(`Fusion de doublons : ${candidates.length} -> ${merged.length} (${mergePairs.length} paires validées)`);
  candidates.length = 0;
  candidates.push(...merged);
}

candidates.sort((a, b) => b.shopCount - a.shopCount || b.offers - a.offers || a.brand.localeCompare(b.brand));
fs.writeFileSync("./scripts/_price-research/add-candidates.json", JSON.stringify(candidates, null, 1));

const n = (f) => candidates.filter(f).length;
const nouveaux = candidates.filter((c) => c.status === "nouveau");
console.log(`Offres analysées: ${offers.length} | ignorées: ${skipFormat} formats/minis/coffrets, ${skipKids} enfants, ${skipBrand} marque introuvable`);
console.log(`Parfums distincts chez les concurrents: ${candidates.length}`);
console.log(`  déjà au catalogue: ${n((c) => c.status === "deja-au-catalogue")}`);
console.log(`  variante d'un parfum qu'on a (autre concentration): ${n((c) => c.status === "variante-concentration")}`);
console.log(`  NOUVEAUX: ${nouveaux.length}`);
for (const [lbl, f] of [["4+ boutiques", (c) => c.shopCount >= 4], ["3 boutiques", (c) => c.shopCount === 3], ["2 boutiques", (c) => c.shopCount === 2], ["1 boutique", (c) => c.shopCount === 1]]) {
  console.log(`    ${lbl}: ${nouveaux.filter(f).length}`);
}
console.log(`  nouveaux — marque déjà vendue: ${nouveaux.filter((c) => c.brandInCatalog).length} | nouvelle marque: ${nouveaux.filter((c) => !c.brandInCatalog).length} | en stock: ${nouveaux.filter((c) => c.inStock).length}`);
console.log(`  nouveaux — homme ${nouveaux.filter((c) => c.category === "parfums-homme").length} | femme ${nouveaux.filter((c) => c.category === "parfums-femme").length} | oriental ${nouveaux.filter((c) => c.category === "parfums-orientaux").length} | genre à déterminer ${nouveaux.filter((c) => c.category === "a-determiner").length}`);
console.log(`  nouveaux — concentration connue: ${nouveaux.filter((c) => c.concentration).length} | volume connu: ${nouveaux.filter((c) => c.volume).length}`);
const brandsNew = {};
nouveaux.forEach((c) => { brandsNew[c.brand] = (brandsNew[c.brand] || 0) + 1; });
console.log(`  marques (nouveaux): ${Object.keys(brandsNew).length} — top: ${Object.entries(brandsNew).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([b, k]) => `${b} ${k}`).join(", ")}`);
