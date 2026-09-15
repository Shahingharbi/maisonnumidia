#!/usr/bin/env node
// Matching v3 : catalogue Maison Numidia <-> catalogues concurrents (raw2/*.json)
// Améliorations vs v2 : alias de marques (YSL, Rabanne, Emporio Armani, MFK...), marque lue
// aussi dans le champ `brand` des API, volume comparé (variantes 50/100 ml + ajustement),
// concentration contrôlée (EDT / EDP / Parfum), déclinaisons rejetées, mots en trop rejetés.
// NE MODIFIE PAS data/products.json — produit scripts/_price-research/report-v3.json
// Usage: node scripts/_price-research/match-v3.mjs [--premium=0.03]
import fs from "fs";

const RAW = "./scripts/_price-research/raw2";
const OUT = "./scripts/_price-research/report-v3.json";
const PREMIUM = parseFloat((process.argv.find((a) => a.startsWith("--premium=")) || "--premium=0.03").split("=")[1]);
const FLOOR = 6500; // plancher catalogue (CLAUDE.md, règles prix)

const { products } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));

// ─── Normalisation ────────────────────────────────────────────────────────────
const norm = (s) => String(s || "")
  .toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/n[°º]\s?(\d)/g, "n$1")
  .replace(/&/g, " ")
  .replace(/['’`]/g, " ")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

// Mots sans valeur distinctive (format, marketing, genre générique, liaisons)
const FILLER = new Set([
  "eau", "de", "du", "des", "la", "le", "les", "l", "d", "et", "and", "by", "the", "of", "a", "un", "une",
  "for", "pour", "with", "you", "sur", "avec", "en", "in",
  "edp", "edt", "edc", "toilette", "cologne_conc",
  "ml", "oz", "fl", "cl",
  "vaporisateur", "vapo", "spray", "natural", "naturel", "flacon", "bottle",
  "new", "nouveau", "nouvelle", "nouveaute", "promo", "offre", "original", "originaux", "authentique",
  "algerie", "dz", "prix", "parfums", "perfume", "fragrance",
  "men", "women", "man", "woman", "homme", "femme", "him", "her", "lui", "elle", "unisex", "unisexe", "mixte",
]);
// Mots de déclinaison : présents chez le concurrent mais pas chez nous = autre parfum
const FLANKER = new Set([
  "elixir", "intense", "intensely", "absolu", "absolute", "absolutely", "extreme", "noir", "nuit", "night",
  "bleu", "blue", "black", "dark", "powerfully", "freezing", "energy", "flame", "essence", "essenza",
  "profumo", "profondo", "eclat", "passione", "ultra", "gold", "platinum", "royal", "prestige", "collector",
  "legend", "azure", "sport", "leather", "musc", "vetiver", "exclusif", "day", "soir", "supreme", "reserve",
  "privee", "infrared", "fresh", "fraiche", "tendre", "cologne", "sheer", "florale", "floral", "blossom",
  "rouge", "red", "white", "blanc", "pink", "rose", "silver", "electrique", "electric", "summer", "winter",
  "limited", "edition", "lumiere", "velvet", "oud", "tobacco", "vanille", "vanilla", "amber", "ambre",
  "aqua", "acqua", "marine", "ocean", "wild", "savage", "absolue", "lady", "girl", "boy", "parfum_flanker",
  "extrait", "concentree", "concentrate", "forte", "deep", "hot", "sexy", "golden", "crystal", "glow",
  "star", "stars", "eros", "x", "ii", "iii", "iv",
]);

// Alias de marques : chaque entrée = liste de signatures (tous les mots d'une signature requis)
const BRAND_ALIASES = {
  "yves saint laurent": ["ysl", "saint laurent", "yves saint laurent"],
  "giorgio armani": ["armani"],
  "paco rabanne": ["rabanne"],
  "dolce gabbana": ["dolce gabbana", "d g", "dolce"],
  "carolina herrera": ["herrera"],
  "jean paul gaultier": ["gaultier", "jpg"],
  "calvin klein": ["calvin klein", "ck"],
  "hugo boss": ["boss", "hugo boss"],
  "maison francis kurkdjian": ["kurkdjian", "mfk"],
  "parfums de marly": ["marly", "pdm"],
  "viktor rolf": ["viktor rolf", "viktor"],
  "van cleef arpels": ["van cleef", "cleef"],
  "zadig voltaire": ["zadig"],
  "mont blanc": ["montblanc", "mont blanc"],
  "narciso rodriguez": ["narciso"],
  "al haramain": ["haramain", "alharamain"],
  "al rehab": ["rehab", "alrehab"],
  "arabian oud": ["arabian oud"],
  "swiss arabian": ["swiss arabian"],
  "jo malone london": ["malone"],
  "victoria s secret": ["victoria secret", "victorias secret", "victoria s secret"],
  "antonio banderas": ["banderas"],
  "elizabeth arden": ["arden"],
  "elizabeth taylor": ["elizabeth taylor"],
  "maison margiela": ["margiela", "replica"],
  "roberto cavalli": ["cavalli"],
  "salvatore ferragamo": ["ferragamo"],
  "donna karan": ["dkny", "donna karan"],
  "s t dupont": ["dupont"],
  "jennifer lopez": ["jlo", "j lo", "jennifer lopez"],
  "frederic malle": ["frederic malle", "malle"],
  "penhaligon s": ["penhaligon", "penhaligons"],
  "juliette has a gun": ["juliette has a gun", "juliette"],
  "adopt mon parfum": ["adopt"],
  "issey miyake": ["miyake"],
  "lolita lempicka": ["lempicka"],
  "karl lagerfeld": ["lagerfeld"],
  "emanuel ungaro": ["ungaro"],
  "acqua di parma": ["acqua di parma"],
  "ex nihilo": ["nihilo"],
  "serge lutens": ["lutens"],
  "memo paris": ["memo"],
  "roja dove": ["roja"],
  "louis vuitton": ["vuitton"],
  "guy laroche": ["laroche"],
  "ralph lauren": ["ralph lauren", "polo ralph"],
  "michael kors": ["kors"],
  "marc jacobs": ["marc jacobs"],
  "jimmy choo": ["jimmy choo", "choo"],
  "tom ford": ["tom ford"],
  "pierre cardin": ["cardin"],
  "nina ricci": ["nina ricci", "ricci"],
  "kate spade": ["kate spade"],
  "britney spears": ["britney"],
  "paris hilton": ["paris hilton"],
  "ariana grande": ["ariana grande", "ariana"],
  "mariah carey": ["mariah carey"],
  "anna sui": ["anna sui"],
  "jean patou": ["patou"],
  "yves rocher": ["yves rocher"],
  "elie saab": ["elie saab", "saab"],
  "issey": ["miyake"],
  "joop": ["joop"],
  "guess": ["guess"],
  "coach": ["coach"],
  "kilian": ["kilian"],
  "initio": ["initio"],
  "lancome": ["lancome"],
  "hermes": ["hermes"],
  "chloe": ["chloe"],
  "beyonce": ["beyonce"],
  "franck olivier": ["franck olivier"],
  "el nabil": ["el nabil", "elnabil"],
  "bvlgari": ["bvlgari", "bulgari"],
  "miu miu": ["miu miu"],
  "acqua": [],
};
const BRAND_GENERIC = new Set(["maison", "parfums", "parfum", "paris", "london", "de", "the", "by", "perfumes", "fragrances", "al", "house", "prives"]);

function brandSignatures(brand) {
  const key = norm(brand);
  const sigs = [];
  const base = key.split(" ").filter((t) => t.length > 1 && !BRAND_GENERIC.has(t));
  if (base.length) sigs.push(base);
  for (const a of BRAND_ALIASES[key] || []) sigs.push(norm(a).split(" ").filter(Boolean));
  return sigs;
}
// Orthographes alternatives vues chez les concurrents (translittérations de l'arabe surtout)
const TOKEN_ALIASES = { khamra: "khamrah", assad: "asad", oudh: "oud", oudhs: "oud", bulgari: "bvlgari", aoud: "oud" };
// Retire les contenances ("100 ml", "3.4 oz") et les accroches "(DUPE Delina)" avant découpage,
// sinon elles comptent comme mots en trop
const cleanName = (s) => String(s || "")
  .replace(/\(\s*dupe[^)]*\)/gi, " ")
  .replace(/\bdupe\b.*$/i, " ")
  .replace(/\d+(?:[.,]\d+)?\s*(?:ml|oz|fl\.?\s*oz)\b/gi, " ");
const tokensOf = (s) => norm(cleanName(s)).split(" ").filter(Boolean).map((t) => TOKEN_ALIASES[t] || t);

// ─── Détection concentration / "Parfum" comme déclinaison ─────────────────────
function concOf(text) {
  const t = norm(text);
  if (/\bextrait\b/.test(t)) return "EXTRAIT";
  if (/eau de toilette|\bedt\b/.test(t)) return "EDT";
  if (/eau de cologne|\bedc\b/.test(t)) return "EDC";
  if (/eau de parfum|\bedp\b/.test(t)) return "EDP";
  // on n'efface que "Parfum Homme ..." en tête de libellé (formule générique), pas "Dior Homme Parfum"
  const stripped = t.replace(/parfums? de marly/g, "").replace(/^parfums?\s+(homme|femme|pour|mixte|unisexe|niche|oriental)\b/g, "").replace(/\bparfums?\s+(niche|oriental|arabe)\b/g, "");
  if (/\bparfum\b/.test(stripped)) return "PARFUM";
  return null;
}
// strict = le mot "Parfum"/"Extrait" est dans NOTRE nom (déclinaison, ex. "Sauvage Parfum") ;
// sinon c'est juste la concentration d'un niche, souvent absente du nom chez les concurrents.
function ourConc(p) {
  const n = norm(p.name);
  if (/\bextrait\b/.test(n)) return { code: "EXTRAIT", strict: true };
  if (/\bparfum\b/.test(n.replace(/eau de parfum/g, ""))) return { code: "PARFUM", strict: true };
  if (/extrait/i.test(p.concentration)) return { code: "EXTRAIT", strict: false };
  if (p.concentration === "Parfum") return { code: "PARFUM", strict: false };
  if (/^EDT/.test(p.concentration)) return { code: "EDT", strict: false };
  if (/Cologne|EDC/.test(p.concentration)) return { code: "EDC", strict: false };
  return { code: "EDP", strict: false };
}
function concCompatible(theirs, ours) {
  if (!theirs) return !ours.strict;
  if (theirs === ours.code) return true;
  const rich = (c) => c === "PARFUM" || c === "EXTRAIT";
  return !ours.strict && rich(ours.code) && rich(theirs);
}

// ─── Genre écrit dans le nom ───────────────────────────────────────────────────
function genderWord(s) {
  const t = norm(s);
  if (/\b(femme|women|woman|her|elle|lady|donna|pour elle)\b/.test(t)) return "f";
  if (/\b(homme|men|man|him|lui|uomo|pour lui)\b/.test(t)) return "h";
  return null;
}

// ─── Volume ────────────────────────────────────────────────────────────────────
const volOf = (s) => { const m = String(s || "").toLowerCase().match(/(\d{2,3})(?:[.,]\d)?\s*-?\s*ml/); return m ? parseInt(m[1], 10) : null; };

// ─── Formats à exclure ─────────────────────────────────────────────────────────
const NON_PERFUME = /d[ée]odorant|deo\b|gel douche|shower|savon|soap|lait corporel|body lotion|body milk|cr[èe]me|\bstick\b|roll-?on|brume|body mist|mist\b|huile|oil\b|miniature|\bmini\b|testeur|\btester\b|shampo|bougie|candle|diffuseur|coffret|\bset\b|gift|recharge|refill|travel|vial|[ée]chantillon|sample|d[ée]cant|pochette|trousse|lotion|after ?shave|apr[eè]s[- ]rasage|baume|gel moussant|hair|cheveux|musc intime|poudre/i;

// ─── Chargement concurrents ────────────────────────────────────────────────────
// Sites écartés : smellgood = vente de DÉCANTS (prix linéaire au ml : 10 ml 3 300 DA, 50 ml 16 500 DA),
// pas des flacons neufs — fausserait le prix marché (constaté le 15/09/2026)
const EXCLUDED_SITES = new Set(["smellgood"]);
const REGULAR_PRICE_SITES = new Set(["leena"]);
const sites = {};
for (const f of fs.readdirSync(RAW).filter((f) => f.endsWith(".json"))) {
  const key = f.replace(".json", "");
  if (EXCLUDED_SITES.has(key)) continue;
  let items;
  try { items = JSON.parse(fs.readFileSync(`${RAW}/${f}`, "utf8")); } catch { console.log(`! ${f} illisible`); continue; }
  const offers = [];
  for (const it of items) {
    const label = `${it.name} ${(it.cats || []).join(" ")}`;
    if (NON_PERFUME.test(it.name) || (it.cats || []).some((c) => /coffret|testeur|tester|d[ée]odorant|soin|bain|maquillage|makeup|bougie|accessoire/i.test(c))) continue;
    const nameVol = volOf(it.name) || volOf((it.attrs || []).flatMap((a) => a.terms || []).join(" "));
    const variants = Array.isArray(it.variants) && it.variants.length ? it.variants : null;
    const base = { site: key, name: it.name, brand: it.brand || it.vendor || "", url: it.url, cats: it.cats || [] };
    // Sites de ventes privées/flash : le prix remisé n'est pas le prix du marché -> prix normal
    const saleUplift = REGULAR_PRICE_SITES.has(key) && it.regular && it.price && it.regular > it.price ? it.regular / it.price : 1;
    if (variants) {
      for (const v of variants) {
        if (!v.price) continue;
        offers.push({ ...base, price: Math.round(v.price * saleUplift), vol: volOf(v.label) || nameVol, label: v.label });
      }
    } else if (it.price) {
      offers.push({ ...base, price: Math.round(it.price * saleUplift), vol: nameVol });
    }
  }
  for (const o of offers) {
    o.hay = new Set(tokensOf(`${o.name} ${o.brand}`));
    o.nameToks = tokensOf(o.name);
    o.conc = concOf(o.name);
    o.gender = genderWord(o.name);
  }
  sites[key] = offers.filter((o) => o.price >= 2000 && o.price <= 600000 && !(o.vol && o.vol <= 20));
}
console.log("Offres exploitables par site:", Object.fromEntries(Object.entries(sites).map(([k, v]) => [k, v.length])));

// ─── Matching ──────────────────────────────────────────────────────────────────
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };

function matchProduct(p) {
  const sigs = brandSignatures(p.brand);
  const brandToks = new Set(sigs.flat().concat(["christian", "emporio", "giorgio", "parfums", "prives", "paris", "london", "maison"]));
  const nameAll = tokensOf(p.name).filter((t) => !brandToks.has(t));
  const distinctive = nameAll.filter((t) => !FILLER.has(t) && t !== "parfum");
  // Nom sans mot distinctif ("Dior Homme", "Jimmy Choo", "Franck Olivier") : on accepte
  // uniquement un concurrent au nom STRICTEMENT équivalent (zéro mot en plus), même genre écrit.
  const genericMode = distinctive.length === 0;
  const ourGender = p.gender === "homme" ? "h" : p.gender === "femme" ? "f" : null;
  const ourNameGender = genderWord(p.name);
  const oc = ourConc(p);
  const ourVol = parseInt(p.volume, 10) || null;
  const ourSet = new Set(nameAll);

  const perSite = {};
  for (const [site, offers] of Object.entries(sites)) {
    const cands = [];
    for (const o of offers) {
      if (!sigs.some((sig) => sig.every((t) => o.hay.has(t)))) continue;
      // tous nos mots distinctifs (tolérance 1 mot si nom long) doivent être là
      // la tolérance "1 mot manquant" ne s'applique jamais à un mot de déclinaison
      // (sinon "212 VIP Black" matcherait "212 VIP Men")
      // Tous nos mots distinctifs doivent être présents ; seul un code numérique peut manquer
      // ("Eden Juicy Apple 01" = "Eden Juicy Apple"), jamais un vrai mot ("Black Opium Neon"
      // n'est pas "Black Opium", "Light Blue Forever" n'est pas "Light Blue").
      const missing = distinctive.filter((t) => !o.hay.has(t));
      if (missing.length > 1 || (missing.length === 1 && !(/^\d+$/.test(missing[0]) && distinctive.length >= 3))) continue;
      // mots en plus chez le concurrent
      const extras = o.nameToks.filter((t) => !ourSet.has(t) && !brandToks.has(t) && !FILLER.has(t) && t !== "parfum" && !/^\d{2,3}$/.test(t) && !/^\d{2,3}ml$/.test(t) && !/^(19|20)\d{2}$/.test(t));
      if (extras.some((t) => FLANKER.has(t))) continue;
      if (extras.length >= 2) continue;
      if (genericMode && extras.length > 0) continue;
      // concentration : EDT / EDP / Parfum / Extrait explicites et différentes = autre produit
      if (!concCompatible(o.conc, oc)) continue;
      // genre explicite contradictoire
      if (ourGender && o.gender && o.gender !== ourGender) continue;
      // si NOTRE nom précise le genre ("Allure Homme", "Code Femme"), le concurrent doit le
      // préciser aussi : "Allure" tout court est le parfum femme, "Armani Code" tout court l'homme
      if (ourNameGender && o.gender !== ourNameGender) continue;
      // volume
      let adj = o.price, volStatus = "inconnu";
      if (o.vol && ourVol) {
        const r = ourVol / o.vol;
        if (r < 0.45 || r > 2.2) continue;
        if (o.vol === ourVol) volStatus = "identique";
        else { adj = Math.round(o.price * Math.pow(r, 0.72)); volStatus = `ajusté ${o.vol}→${ourVol}ml`; }
      }
      cands.push({ site, name: o.name + (o.label ? ` [${o.label}]` : ""), url: o.url, price: o.price, adj, vol: o.vol, volStatus, extras: extras.length, extraWords: extras });
    }
    if (!cands.length) continue;
    cands.sort((a, b) => a.extras - b.extras
      || (a.volStatus === "identique" ? 0 : a.volStatus === "inconnu" ? 2 : 1) - (b.volStatus === "identique" ? 0 : b.volStatus === "inconnu" ? 2 : 1));
    perSite[site] = cands[0];
  }

  const strong = Object.values(perSite).filter((c) => c.extras === 0);
  const weak = Object.values(perSite).filter((c) => c.extras === 1);
  if (!strong.length && !weak.length) return { status: "aucun-match" };

  let used = strong.length ? strong : weak;
  let med = median(used.map((c) => c.adj));
  if (used.length >= 3) {
    const kept = used.filter((c) => c.adj >= med * 0.65 && c.adj <= med * 1.55);
    if (kept.length >= 2) { used = kept; med = median(used.map((c) => c.adj)); }
  }
  const vals = used.map((c) => c.adj);
  const spread = Math.max(...vals) / Math.min(...vals);
  const volKnown = used.some((c) => c.volStatus !== "inconnu");

  let tier;
  if (!strong.length) tier = "C";
  else if (used.length >= 2 && spread <= 1.4) tier = "A";
  else if (used.length >= 2 && spread <= 1.7) tier = "B";
  else if (used.length === 1 && volKnown) tier = "B";
  else tier = "C";

  return { status: "match", tier, market: med, spread: Math.round(spread * 100) / 100, sources: used, weakSources: strong.length ? weak : [] };
}

function priceFromMarket(m) {
  const target = m * (1 + PREMIUM);
  const step = target < 10000 ? 100 : 500;
  return Math.ceil(target / step) * step;
}

const report = products.map((p) => {
  const r = matchProduct(p);
  const row = { slug: p.slug, brand: p.brand, name: p.name, category: p.category, gender: p.gender, conc: p.concentration, volume: p.volume, ourPrice: p.price, ...r };
  if (r.status === "match") {
    row.proposed = priceFromMarket(r.market);
    row.proposedFloored = Math.max(row.proposed, FLOOR);
    row.changePct = Math.round(((row.proposedFloored - p.price) / p.price) * 1000) / 10;
  }
  return row;
});
fs.writeFileSync(OUT, JSON.stringify(report, null, 1));

// ─── Résumé ────────────────────────────────────────────────────────────────────
const cnt = (f) => report.filter(f).length;
console.log(`\nCatalogue: ${products.length}`);
console.log(`A (2+ sources cohérentes): ${cnt((r) => r.tier === "A")}`);
console.log(`B (1 source au bon volume, ou 2+ un peu dispersées): ${cnt((r) => r.tier === "B")}`);
console.log(`C (à vérifier): ${cnt((r) => r.tier === "C")}`);
console.log(`Aucun match: ${cnt((r) => r.status === "aucun-match")} | Nom trop générique: ${cnt((r) => r.status === "nom-generique")}`);
for (const cat of ["parfums-homme", "parfums-femme", "parfums-orientaux"]) {
  const inCat = report.filter((r) => r.category === cat);
  console.log(`  ${cat}: A+B ${inCat.filter((r) => r.tier === "A" || r.tier === "B").length} | C ${inCat.filter((r) => r.tier === "C").length} | total ${inCat.length}`);
}
const ab = report.filter((r) => r.tier === "A" || r.tier === "B");
if (ab.length) {
  console.log(`\nSur A+B : baisse ${ab.filter((r) => r.changePct < -2).length} | stable ±2% ${ab.filter((r) => Math.abs(r.changePct) <= 2).length} | hausse ${ab.filter((r) => r.changePct > 2).length}`);
  console.log(`Bloqués par le plancher ${FLOOR} DA: ${ab.filter((r) => r.proposed < FLOOR).length}`);
}
