#!/usr/bin/env node
// Applique les pyramides olfactives re-cherchées (scripts/_catalog-audit/pyramides/).
// SIMULATION par défaut, --apply pour écrire.
//
// Garde-fous :
//   - confiance "basse" ou listes vides -> la fiche garde ses notes actuelles
//   - on refuse une proposition qui REDUIT le nombre total de notes : le but était de
//     compléter une pyramide, pas de l'amputer
//   - on refuse de vider une section qui était remplie
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR = "./scripts/_catalog-audit/pyramides";
const chemin = "./data/products.json";

if (!fs.existsSync(DIR)) { console.log("aucune pyramide à appliquer"); process.exit(0); }

const d = JSON.parse(fs.readFileSync(chemin, "utf8"));
const parSlug = new Map(d.products.map((p) => [p.slug, p]));
const total = (n) => (n.top || []).length + (n.heart || []).length + (n.base || []).length;

const appliques = [], refuses = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  let r;
  try { r = JSON.parse(fs.readFileSync(`${DIR}/${f}`, "utf8")); }
  catch { refuses.push([f, "JSON illisible"]); continue; }

  const p = parSlug.get(r.slug);
  if (!p) { refuses.push([r.slug, "slug absent du catalogue"]); continue; }
  if (r.confiance === "basse") { refuses.push([r.slug, "confiance basse, notes actuelles conservées"]); continue; }

  const n = r.notes || {};
  const propose = { top: n.top || [], heart: n.heart || [], base: n.base || [] };
  if (total(propose) === 0) { refuses.push([r.slug, "aucune note trouvée"]); continue; }
  if (total(propose) < total(p.notes)) { refuses.push([r.slug, `${total(propose)} notes proposées contre ${total(p.notes)} actuelles`]); continue; }

  const vide = ["top", "heart", "base"].find((k) => (p.notes[k] || []).length > 0 && propose[k].length === 0);
  if (vide) { refuses.push([r.slug, `section « ${vide} » vidée`]); continue; }

  if (JSON.stringify(propose) === JSON.stringify(p.notes)) continue;
  appliques.push({
    slug: r.slug,
    avant: `T${(p.notes.top || []).length}/C${(p.notes.heart || []).length}/F${(p.notes.base || []).length}`,
    apres: `T${propose.top.length}/C${propose.heart.length}/F${propose.base.length}`,
    source: r.source || "",
  });
  if (APPLY) p.notes = propose;
}

if (APPLY && appliques.length) fs.writeFileSync(chemin, JSON.stringify(d, null, 2) + "\n");

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${appliques.length} pyramides complétées, ${refuses.length} refusées`);
appliques.forEach((a) => console.log(`  ${a.slug.padEnd(40)} ${a.avant} -> ${a.apres}`));
refuses.forEach(([s, why]) => console.log(`  refusé ${s} : ${why}`));
