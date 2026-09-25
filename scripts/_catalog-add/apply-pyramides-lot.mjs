#!/usr/bin/env node
// Reporte les pyramides re-cherchées (scripts/_catalog-audit/pyramides/) dans les fichiers
// de RECHERCHE du lot en attente, pour que build-fiches les reprenne.
// SIMULATION par défaut, --apply pour écrire.
//
// Les fichiers de pyramide sont nommés d'après le slug FINAL de la fiche, alors que les
// fichiers de recherche portent le slug CANDIDAT. La correspondance passe par fiches.json,
// qui garde les deux dans `_source.slugCandidat`.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR_P = "./scripts/_catalog-audit/pyramides";
const DIR_R = "./scripts/_catalog-add/research";

const fiches = JSON.parse(fs.readFileSync("./scripts/_catalog-add/fiches.json", "utf8"));
const versCandidat = new Map(fiches.map((f) => [f.slug, f._source && f._source.slugCandidat]));
const produits = new Set(JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products.map((p) => p.slug));

const total = (n) => (n.top || []).length + (n.heart || []).length + (n.base || []).length;

const appliques = [], ignores = [];
for (const f of fs.readdirSync(DIR_P).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(`${DIR_P}/${f}`, "utf8"));
  if (produits.has(r.slug)) continue;            // déjà traité côté catalogue
  const candidat = versCandidat.get(r.slug);
  if (!candidat) { ignores.push([r.slug, "pas dans le lot en attente"]); continue; }
  const fichier = `${DIR_R}/${candidat}.json`;
  if (!fs.existsSync(fichier)) { ignores.push([r.slug, "fichier de recherche introuvable"]); continue; }
  if (r.confiance === "basse") { ignores.push([r.slug, "confiance basse"]); continue; }

  const propose = { top: r.notes?.top || [], heart: r.notes?.heart || [], base: r.notes?.base || [] };
  if (total(propose) === 0) { ignores.push([r.slug, "aucune note trouvée"]); continue; }

  const recherche = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const avant = recherche.notes || { top: [], heart: [], base: [] };
  if (total(propose) < total(avant)) { ignores.push([r.slug, `${total(propose)} notes contre ${total(avant)} actuelles`]); continue; }
  if (JSON.stringify(propose) === JSON.stringify(avant)) continue;

  appliques.push([r.slug, `T${(avant.top || []).length}/C${(avant.heart || []).length}/F${(avant.base || []).length}`,
    `T${propose.top.length}/C${propose.heart.length}/F${propose.base.length}`]);
  if (APPLY) {
    recherche.notes = propose;
    recherche.remarquePyramide = "pyramide complétée par re-recherche le 2026-09-25";
    fs.writeFileSync(fichier, JSON.stringify(recherche));
  }
}

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${appliques.length} pyramides reportées, ${ignores.length} ignorées`);
appliques.forEach(([s, a, b]) => console.log(`  ${s.padEnd(42)} ${a} -> ${b}`));
ignores.forEach(([s, w]) => console.log(`  ignoré ${s} : ${w}`));
