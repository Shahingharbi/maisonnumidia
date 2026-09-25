#!/usr/bin/env node
// Crée dans brands[] les maisons documentées par la recherche (scripts/_catalog-add/marques/).
// SIMULATION par défaut, --apply pour écrire.
//
// Une description de marque s'affiche sur /marques/<slug> : une date inventée serait une
// erreur factuelle publiée. Les fiches de confiance basse sont donc acceptées, mais leur
// description ne doit contenir ni année ni pays — l'agent avait consigne de les omettre.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR = "./scripts/_catalog-add/marques";
const chemin = "./data/products.json";

const d = JSON.parse(fs.readFileSync(chemin, "utf8"));
const existants = new Set(d.brands.map((b) => b.slug));

const ajoutees = [], refusees = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(`${DIR}/${f}`, "utf8"));
  if (existants.has(r.slug)) continue;
  if (!r.nom || !r.description) { refusees.push([r.slug, "nom ou description manquant"]); continue; }

  const mots = r.description.split(/\s+/).filter(Boolean).length;
  if (mots < 25 || mots > 90) { refusees.push([r.slug, `description ${mots} mots`]); continue; }

  // Une fiche incertaine ne doit pas avancer de date : c'est ce qui la rendrait fausse.
  if (r.confiance === "basse" && /\b(19|20)\d{2}\b/.test(r.description)) {
    refusees.push([r.slug, "confiance basse mais une année est affirmée"]);
    continue;
  }
  // Superlatifs publicitaires : la page marque n'est pas un argumentaire.
  if (/\b(incontournable|legendaire|légendaire|mythique|le meilleur|la meilleure|numero un|numéro un)\b/i.test(r.description)) {
    refusees.push([r.slug, "superlatif publicitaire"]);
    continue;
  }

  ajoutees.push({
    slug: r.slug,
    name: r.nom,
    origin: r.origine && r.origine !== "Non documenté" ? r.origine : "Non documenté",
    featured: false,
    description: r.description.trim(),
    confiance: r.confiance,
  });
}

if (APPLY && ajoutees.length) {
  ajoutees.forEach((b) => {
    const { confiance, ...entree } = b;
    d.brands.push(entree);
  });
  d.brands.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  fs.writeFileSync(chemin, JSON.stringify(d, null, 2) + "\n");
}

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${ajoutees.length} marques créées, ${refusees.length} refusées`);
ajoutees.forEach((b) => console.log(`  ${b.slug.padEnd(24)} ${b.origin.padEnd(22)} [${b.confiance}] ${b.description.slice(0, 80)}…`));
refusees.forEach(([s, w]) => console.log(`  refusé ${s} : ${w}`));
