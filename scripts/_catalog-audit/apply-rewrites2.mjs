#!/usr/bin/env node
// Contrôle puis applique les descriptions réécrites (scripts/_catalog-audit/rewrites2/).
// SIMULATION par défaut, --apply pour écrire dans data/products.json.
//
// Une fiche qui échoue un contrôle n'est pas appliquée : elle reste dans le dossier et
// pourra être reprise. On ne dégrade jamais une fiche existante pour en publier une autre.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR = "./scripts/_catalog-audit/rewrites2";
const COMB = /[̀-ͯ]/g;
const LIGATURES = /[œæ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "").replace(LIGATURES, (c) => ({ "œ": "oe", "æ": "ae" })[c]).replace(/['’]/g, " ");
const mots = (s) => String(s || "").split(/\s+/).filter(Boolean).length;

const FORMULES = ["il est important de noter", "en conclusion", "n hesitez", "pour conclure",
  "certificat", "entrepot", "fournisseurs verifies", "coffret d origine", "scelle", "douane", "2025"];
const TOURNURES = ["positionnement tarifaire", "piece maitresse d une collection", "parfum d appoint",
  "reste parfaitement lisible", "periode de port privilegiee", "la construction olfactive revele toute sa richesse",
  "fonctionne dans des contextes tres varies", "sans jamais sembler decale", "plait naturellement a un public algerien",
  "il est grand temps de la decouvrir", "une fragrance qui dure"];

const GENERIQUE = new Set(["agrumes", "citrus", "aquatique", "notes aquatiques", "notes marines", "marine", "marines",
  "sucre", "sucree", "poudre", "poudree", "fleurs", "fleurs blanches", "fruits", "fruits confits", "fruits rouges",
  "epices", "notes epicees", "notes florales", "notes vertes", "notes boisees", "notes aromatiques", "aromatiques",
  "fumee", "fraicheur", "notes fruitees", "notes sucrees", "notes poudrees", "notes ambrees", "notes lactees",
  "notes gourmandes", "notes animales", "notes minerales", "notes salines", "notes solaires", "notes terreuses",
  "resines", "balsamique", "chypre", "fougere", "cuir", "bois", "boisees",
  // Vocabulaire d accord releve sur les lots suivants : ce sont des descriptions de
  // famille ou de texture, pas des revendications de note precise.
  "ambre", "ambre boise", "ambre chaud", "ambre sucre", "bois precieux", "bois sec",
  "bois secs", "bois blanc", "bouquet floral", "note fruitee", "note lactee",
  "accord gourmand", "accord aquatique", "accord marin", "accord boise", "mineral",
  "epices chaudes", "epices douces", "musc oriental", "notes vertes", "verdure",
  "notes musquees", "musc blanc", "notes cremeuses", "notes confites"]);

const LETTRES = "abcdefghijklmnopqrstuvwxyz0123456789";
function contientMot(hay, needle) {
  let i = hay.indexOf(needle);
  while (i !== -1) {
    const a = i === 0 ? " " : hay[i - 1];
    const b = hay[i + needle.length] === undefined ? " " : hay[i + needle.length];
    if (!LETTRES.includes(a) && !LETTRES.includes(b)) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const parSlug = new Map(catalogue.products.map((p) => [p.slug, p]));

const vocab = new Set();
for (const p of catalogue.products) {
  for (const k of ["top", "heart", "base"]) for (const n of p.notes[k] || []) {
    const v = norm(n).trim();
    if (v.length > 4) vocab.add(v);
  }
}

const ok = [], refuses = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  let r;
  try { r = JSON.parse(fs.readFileSync(`${DIR}/${f}`, "utf8")); }
  catch { refuses.push([f, "JSON illisible"]); continue; }
  const p = parSlug.get(r.slug);
  const pb = [];
  if (!p) { refuses.push([r.slug, "slug absent du catalogue"]); continue; }

  const sd = (r.shortDescription || "").trim(), ld = (r.description || "").trim();
  if (!sd || !ld) { refuses.push([r.slug, "texte vide"]); continue; }

  const nd = mots(ld), ns = mots(sd);
  if (nd < 200 || nd > 360) pb.push(`description ${nd} mots`);
  if (ns < 20 || ns > 70) pb.push(`short ${ns} mots`);

  const paragraphes = ld.split(/\n{2,}/).filter((x) => x.trim()).length;
  if (paragraphes < 3) pb.push(`${paragraphes} paragraphe(s), 3 minimum`);

  const plat = norm(`${sd} ${ld}`);
  for (const m of FORMULES) if (plat.includes(m)) pb.push(`formule interdite : ${m}`);
  for (const m of TOURNURES) if (plat.includes(m)) pb.push(`tournure type : ${m}`);

  // Le nom du produit ne doit pas revenir plus de 3 fois dans la description.
  const nom = norm(p.name);
  let reps = 0;
  if (nom.length > 2) {
    const pl = norm(ld);
    let i = pl.indexOf(nom);
    while (i !== -1) { reps++; i = pl.indexOf(nom, i + nom.length); }
  }
  if (reps > 3) pb.push(`nom répété ${reps} fois`);

  // Chiffres interdits : tenue en heures, prix.
  const toks = plat.replace(/[.,;:!?()]/g, " ").split(" ").filter(Boolean);
  for (let i = 0; i < toks.length - 1; i++) {
    if (![...toks[i]].every((c) => "0123456789".includes(c))) continue;
    if (toks[i + 1].startsWith("heure")) pb.push("tenue chiffrée");
    if (toks[i + 1] === "da" || toks[i + 1].startsWith("dinar")) pb.push("prix cité");
  }

  // Note citée mais absente de la pyramide de CETTE fiche.
  const fiche = ["top", "heart", "base"].flatMap((k) => (p.notes[k] || []).map((n) => norm(n).trim()));
  const couvert = (v) => fiche.some((n) => n === v || n.includes(v) || v.includes(n));
  const intruses = [...vocab].filter((v) => !GENERIQUE.has(v) && !couvert(v) && contientMot(plat, v));
  if (intruses.length > 1) pb.push(`notes hors fiche : ${intruses.slice(0, 4).join(", ")}`);

  // Une fiche en rupture ne doit pas promettre une livraison.
  if (!p.inStock && /(nous le livrons|livr[ée] (dans|partout)|commandez)/i.test(ld)) pb.push("promet la livraison alors que la fiche est en rupture");

  if (pb.length) { refuses.push([r.slug, pb.join(" | ")]); continue; }
  ok.push({ slug: r.slug, sd, ld, avant: mots(p.description), apres: nd });
}

if (APPLY) {
  for (const x of ok) {
    const p = parSlug.get(x.slug);
    p.shortDescription = x.sd;
    p.description = x.ld;
  }
  fs.writeFileSync("./data/products.json", JSON.stringify(catalogue, null, 2) + "\n");
}

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${ok.length} descriptions retenues, ${refuses.length} refusées`);
refuses.slice(0, 25).forEach(([s, why]) => console.log(`  refusé ${s} : ${why}`));
if (refuses.length > 25) console.log(`  ... ${refuses.length - 25} autres`);
fs.writeFileSync("./scripts/_catalog-audit/rewrites2-refuses.json", JSON.stringify(refuses, null, 1));
