#!/usr/bin/env node
// Contrôle des textes de page marque (scripts/_seo/marques/textes/<slug>.json).
//   node scripts/_seo/marques/valider.mjs dior            (un texte)
//   node scripts/_seo/marques/valider.mjs --tout          (tous)
//   node scripts/_seo/marques/valider.mjs --tout --ecrire (tous, puis data/marques-textes.json)
// Vérifie : longueur, titres ### seulement, liens vers des pages qui existent, jetons de prix
// valides, formules interdites (CLAUDE.md, règles de rédaction), pas de chiffre de tenue inventé.
import fs from "fs";

const D = "scripts/_seo/marques/textes";
const cat = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const slugs = new Set(cat.products.map((p) => p.slug));
const marques = new Set(cat.brands.map((b) => b.slug));
const dansSection = {
  "parfums-homme": (p) => p.gender === "homme" || p.gender === "unisexe",
  "parfums-femme": (p) => p.gender === "femme" || p.gender === "unisexe",
  "parfums-orientaux": (p) => p.category === "parfums-orientaux",
};
const blog = fs.readFileSync("data/blog.ts", "utf8");
const articles = new Set([...blog.matchAll(/slug:\s*"([^"]+)",\s*\n\s*title:/g)].map((m) => m[1]));

function lienValide(url, slugMarque) {
  const [, a, b] = url.split("/");
  if (a === "parfums" && b) return slugs.has(b) || `fiche inconnue ${b}`;
  if (a === "marques") return !b || marques.has(b) || `marque inconnue ${b}`;
  if (dansSection[a]) {
    if (!b) return true;
    const ps = cat.products.filter((p) => p.brandSlug === b);
    if (!ps.some(dansSection[a])) return `page ${url} inexistante`;
    if (ps.every(dansSection[a])) return `${url} double la page marque : lier /marques/${b}`;
    return true;
  }
  if (a === "blog") return !b || articles.has(b) || `article inconnu ${b}`;
  if (["livraison", "contact", "parfum-algerie", "plan-du-site"].includes(a)) return true;
  return `lien inattendu ${url}`;
}

const INTERDITS = [
  [/il est important de noter/i, "formule IA"], [/en conclusion/i, "formule IA"], [/n['’]h[ée]sitez pas/i, "formule IA"],
  [/\bplongez\b|\bembarquez\b|\bvéritable invitation\b|\bun voyage olfactif\b/i, "formule IA"],
  [/\bCOD\b/, "sigle COD"], [/★|☆|\d[.,]\d\s*\/\s*5/, "note ou étoiles"], [/—/, "tiret long"], [/\b2025\b/, "année 2025"],
  [/\b\d+\s*(?:à\s*\d+\s*)?heures?\b.*\b(tenue|tient)\b|\b(tenue|tient)\b.*\b\d+\s*(?:à\s*\d+\s*)?heures?\b/i, "durée de tenue chiffrée"],
  [/^## /m, "titre ## (le texte est sous un h2 : utiliser ###)"], [/^# /m, "titre #"],
];

function verifier(slug) {
  const f = `${D}/${slug}.json`;
  if (!fs.existsSync(f)) return { err: ["fichier absent"], avert: [] };
  const o = JSON.parse(fs.readFileSync(f, "utf8"));
  const t = o.texte || "";
  const err = [], avert = [];
  const mots = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").split(/\s+/).filter(Boolean).length;
  if (mots < 250) err.push(`${mots} mots (min 250)`);
  if (mots > 600) avert.push(`${mots} mots (long)`);
  if (!/^### /m.test(t)) err.push("aucun titre ###");
  for (const [re, quoi] of INTERDITS) if (re.test(t)) err.push(`${quoi} : ${t.match(re)[0].slice(0, 40)}`);
  for (const m of t.matchAll(/\]\(([^)]+)\)/g)) {
    const v = m[1].startsWith("/") ? lienValide(m[1], slug) : "lien externe";
    if (v !== true) err.push(v);
  }
  for (const m of t.matchAll(/\{\{prix:([a-z0-9-]+)\}\}/g)) if (!slugs.has(m[1])) err.push(`jeton de prix inconnu ${m[1]}`);
  if (!(o.sources || []).length) err.push("aucune source pour l'histoire de la maison");
  const liens = [...t.matchAll(/\]\(\/parfums\/([^)]+)\)/g)].length;
  if (liens < 3) avert.push(`${liens} liens vers des fiches`);
  return { err, avert, texte: t };
}

const argv = process.argv.slice(2);
const liste = argv.includes("--tout")
  ? fs.readdirSync(D).filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""))
  : argv.filter((a) => !a.startsWith("--"));
let nErr = 0;
const ok = {};
for (const s of liste) {
  const { err, avert, texte } = verifier(s);
  nErr += err.length;
  if (err.length || avert.length) console.log(`${err.length ? "✗" : "·"} ${s}\n${[...err.map((e) => "    erreur : " + e), ...avert.map((a) => "    avert. : " + a)].join("\n")}`);
  if (!err.length && texte) ok[s] = texte;
}
console.log(`${liste.length} textes, ${nErr} erreurs`);
if (argv.includes("--ecrire")) {
  if (nErr) { console.log("Rien écrit : corriger les erreurs d'abord."); process.exitCode = 1; }
  else { fs.writeFileSync("data/marques-textes.json", JSON.stringify(ok, null, 1) + "\n"); console.log(`data/marques-textes.json : ${Object.keys(ok).length} marques`); }
}
process.exitCode = nErr ? 1 : 0;
