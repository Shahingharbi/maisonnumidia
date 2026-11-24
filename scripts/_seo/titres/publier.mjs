#!/usr/bin/env node
// Rassemble les titres rédigés (scripts/_seo/titres/sorties/*.json) dans data/titres.json.
//   node scripts/_seo/titres/publier.mjs                         (simulation : contrôle + résumé)
//   node scripts/_seo/titres/publier.mjs --corrections=<f.json>  (applique d'abord des corrections [{chemin, titre}])
//   node scripts/_seo/titres/publier.mjs --ecrire
// Refuse d'écrire si valider.mjs --tout trouve une erreur. Les pages qui n'existent plus au
// catalogue (fiches fusionnées depuis la rédaction) sont écartées. Les pages marque filtrées en
// doublon (canonique vers /marques/x) prennent le gabarit de la charte §5, calculé ici.
import fs from "fs";
import { execFileSync } from "child_process";

const D = "scripts/_seo/titres";
const argv = process.argv.slice(2);
const fCorr = argv.find((a) => a.startsWith("--corrections="))?.split("=")[1];

const cat = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const slugs = new Set(cat.products.map((p) => p.slug));

if (fCorr) {
  const corr = JSON.parse(fs.readFileSync(fCorr, "utf8"));
  const parChemin = new Map(corr.map((c) => [c.chemin, c.titre]));
  let n = 0;
  for (const f of fs.readdirSync(`${D}/sorties`).filter((f) => /^(lot-\d+|speciaux)\.json$/.test(f))) {
    const lot = JSON.parse(fs.readFileSync(`${D}/sorties/${f}`, "utf8"));
    let touche = false;
    for (const x of lot) if (parChemin.has(x.chemin) && parChemin.get(x.chemin) !== x.titre) { x.titre = parChemin.get(x.chemin); x.pourquoi = `${x.pourquoi || ""} [cohérence]`.trim(); touche = true; n++; }
    if (touche) fs.writeFileSync(`${D}/sorties/${f}`, JSON.stringify(lot, null, 1));
  }
  console.log(`${n} corrections appliquées sur ${corr.length} proposées`);
}

let ok = true;
try { execFileSync("node", [`${D}/valider.mjs`, "--tout"], { stdio: "pipe" }); }
catch (e) { ok = false; console.log(String(e.stdout).split("\n").slice(-40).join("\n")); }

const titres = {};
let ecartees = 0;
for (const f of fs.readdirSync(`${D}/sorties`).filter((f) => /^(lot-\d+|speciaux)\.json$/.test(f)).sort())
  for (const x of JSON.parse(fs.readFileSync(`${D}/sorties/${f}`, "utf8"))) {
    const [, a, b] = x.chemin.split("/");
    if (a === "parfums" && b && !slugs.has(b)) { ecartees++; continue; }
    titres[x.chemin] = x.titre;
  }

// Pages filles en doublon (hors dossiers) : gabarit de la charte §5, suffixe s'il tient
const dansSection = {
  "parfums-homme": [(p) => p.gender === "homme" || p.gender === "unisexe", "pour homme"],
  "parfums-femme": [(p) => p.gender === "femme" || p.gender === "unisexe", "pour femme"],
  "parfums-orientaux": [(p) => p.category === "parfums-orientaux", null],
};
let filles = 0;
for (const b of cat.brands) {
  const ps = cat.products.filter((p) => p.brandSlug === b.slug);
  if (!ps.length) continue;
  for (const [section, [dans, genre]] of Object.entries(dansSection)) {
    const c = `/${section}/${b.slug}`;
    if (titres[c] || !ps.every(dans)) continue;
    let t = genre ? `Parfum ${b.name} ${genre} : prix en Algérie` : `Parfum oriental ${b.name} : prix en Algérie`;
    if (t.length + 17 <= 60) t += " | Maison Numidia";
    titres[c] = t;
    filles++;
  }
}

const n = Object.keys(titres).length;
const L = Object.values(titres).map((t) => t.length).sort((a, b) => a - b);
console.log(`${n} titres (${ecartees} écartés : fiches fusionnées ; ${filles} pages filles en doublon calculées) ; longueur médiane ${L[L.length >> 1]}, max ${L[L.length - 1]}`);
if (!argv.includes("--ecrire")) console.log("simulation : --ecrire pour écrire data/titres.json");
else if (!ok) { console.log("Rien écrit : valider.mjs --tout signale des erreurs."); process.exitCode = 1; }
else { fs.writeFileSync("data/titres.json", JSON.stringify(titres, null, 1) + "\n"); console.log("écrit data/titres.json"); }
