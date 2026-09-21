#!/usr/bin/env node
// Contrôle des fiches assemblées (scripts/_catalog-add/fiches.json) avant injection.
// Vérifie la structure, les règles de rédaction de CLAUDE.md, et surtout qu'aucune note
// olfactive citée dans le texte n'est absente du champ `notes` de la fiche.
import fs from "fs";

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "").replace(/['’]/g, " ").replace(/\s+/g, " ");
const mots = (s) => String(s || "").split(/\s+/).filter(Boolean).length;

const PHRASES = [
  ["il est important de noter", "formule IA"],
  ["en conclusion", "formule IA"],
  ["n hesitez", "formule IA"],
  ["pour conclure", "formule IA"],
  ["---", "tiret ---"],
  ["/5", "note sur 5"],
  ["certificat", "promesse invérifiable"],
  ["entrepot", "promesse invérifiable"],
  ["fournisseurs verifies", "promesse invérifiable"],
  ["coffret d origine", "promesse invérifiable"],
  ["scelle", "promesse invérifiable"],
  ["douane", "promesse invérifiable"],
  ["2025", "mauvaise année"],
];

// Vocabulaire d'accord / de famille : descriptif, pas une revendication de note précise.
const GENERIQUE = new Set(["agrumes", "citrus", "aquatique", "notes aquatiques", "notes marines", "marine", "marines",
  "sucre", "sucree", "poudre", "poudree", "fleurs", "fleurs blanches", "fruits", "fruits confits", "fruits rouges",
  "epices", "notes epicees", "notes florales", "notes vertes", "notes boisees", "notes aromatiques", "aromatiques",
  "fumee", "fraicheur", "notes fruitees", "notes sucrees", "notes poudrees", "notes ambrees", "notes lactees",
  "notes gourmandes", "notes animales", "notes minerales", "notes salines", "notes solaires", "notes terreuses",
  "resines", "balsamique", "chypre", "fougere", "cuir", "bois", "boisees"]);

const LETTRES = "abcdefghijklmnopqrstuvwxyz0123456789";
function contientMot(hay, needle) {
  let i = hay.indexOf(needle);
  while (i !== -1) {
    const avant = i === 0 ? " " : hay[i - 1];
    const apres = hay[i + needle.length] === undefined ? " " : hay[i + needle.length];
    if (!LETTRES.includes(avant) && !LETTRES.includes(apres)) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const fiches = JSON.parse(fs.readFileSync("./scripts/_catalog-add/fiches.json", "utf8"));
const slugsExistants = new Set(catalogue.products.map((p) => p.slug));
const marques = new Set(catalogue.brands.map((b) => b.slug));

// Vocabulaire des notes : celles du catalogue + celles des nouvelles fiches.
const vocab = new Set();
for (const p of catalogue.products.concat(fiches)) {
  for (const k of ["top", "heart", "base"]) for (const n of (p.notes && p.notes[k]) || []) {
    const v = norm(n).trim();
    if (v.length > 4) vocab.add(v);
  }
}

const ko = [];
const accroches = new Map();
for (const f of fiches) {
  const pb = [];
  if (slugsExistants.has(f.slug)) pb.push("slug déjà pris dans le catalogue");
  if (!marques.has(f.brandSlug)) pb.push("brandSlug absent de brands[] : " + f.brandSlug);
  if (!fs.existsSync("./public/images/products/" + f.slug + ".jpg")) pb.push("image manquante");
  if (!f.related || f.related.length < 3) pb.push("related < 3");
  if (f.related && f.related.some((r) => !slugsExistants.has(r) && !fiches.some((x) => x.slug === r))) pb.push("related cassé");
  if (f.isOriental !== (f.category === "parfums-orientaux")) pb.push("isOriental incohérent avec category");
  if (!f.h1 || !f.h1.includes("Algérie")) pb.push("h1 hors format");
  if (f.price < 6500) pb.push("prix sous le plancher de 6 500 DA");
  if (!f.description || !f.shortDescription) { pb.push("texte manquant"); ko.push({ slug: f.slug, pb }); continue; }

  const nd = mots(f.description), ns = mots(f.shortDescription);
  if (nd < 170 || nd > 380) pb.push("description " + nd + " mots");
  if (ns < 18 || ns > 75) pb.push("short " + ns + " mots");

  const plat = norm(f.shortDescription + " " + f.description);
  for (const [needle, label] of PHRASES) if (plat.includes(needle)) pb.push(label + " (" + needle + ")");
  const toks = plat.replace(/[.,;:!?()]/g, " ").split(" ").filter(Boolean);
  for (let i = 0; i < toks.length - 1; i++) {
    if (![...toks[i]].every((c) => "0123456789".includes(c))) continue;
    if (toks[i + 1].startsWith("heure")) pb.push("tenue chiffrée");
    if (toks[i + 1] === "da" || toks[i + 1].startsWith("dinar")) pb.push("prix cité");
  }

  const fiche = ["top", "heart", "base"].flatMap((k) => (f.notes[k] || []).map((n) => norm(n).trim()));
  const couvert = (v) => fiche.some((n) => n === v || n.includes(v) || v.includes(n));
  const intruses = [...vocab].filter((v) => !GENERIQUE.has(v) && !couvert(v) && contientMot(plat, v));
  if (intruses.length) pb.push("note hors fiche : " + intruses.slice(0, 4).join(", "));

  const acc = norm(f.shortDescription).split(".")[0].trim().slice(0, 40);
  if (acc) accroches.set(acc, (accroches.get(acc) || 0) + 1);
  if (pb.length) ko.push({ slug: f.slug, pb });
}

console.log("fiches : " + fiches.length + " | conformes : " + (fiches.length - ko.length) + " | à revoir : " + ko.length);
ko.forEach((x) => console.log("  ! " + x.slug + " -> " + x.pb.join(" | ")));
const repet = [...accroches.entries()].filter((e) => e[1] > 2);
console.log(repet.length ? "accroches répétées : " + repet.map((e) => e[0] + " x" + e[1]).join(" | ") : "accroches variées OK");
fs.writeFileSync("./scripts/_catalog-add/check-fiches.json", JSON.stringify(ko, null, 1));
