#!/usr/bin/env node
// Applique à data/products.json les corrections validées des fiches auditées
// (scripts/_catalog-audit/results/<slug>.json). SIMULATION par défaut, --apply pour écrire.
// Règles de sécurité :
//   - seules les corrections de confiance "high" ou "medium" sont appliquées (--low pour inclure low)
//   - familles normalisées sur le vocabulaire déjà utilisé dans le catalogue
//   - notes : refusées si une des 3 listes est vide alors qu'elle était remplie
//   - textes réécrits : refusés s'ils contiennent une formule interdite (CLAUDE.md) ou une
//     affirmation commerciale non autorisée (certificat, entrepôt, coffret d'origine…)
//   - produit "exists: false" (fantôme) : jamais supprimé automatiquement -> listé pour décision
//   - jamais de changement de slug ici (règle n°7 : redirection 301 obligatoire, à faire à la main)
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const WITH_LOW = process.argv.includes("--low");
const RES = "./scripts/_catalog-audit/results";
const catalog = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

// Vocabulaire des familles déjà utilisé (le plus fréquent gagne en cas de synonyme inversé)
const famCount = new Map();
catalog.products.forEach((p) => famCount.set(p.family, (famCount.get(p.family) || 0) + 1));
const famKey = (f) => String(f).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/\s+/).sort().join(" ");
const famByKey = new Map();
for (const [f, n] of famCount) {
  const k = famKey(f);
  if (!famByKey.has(k) || famCount.get(famByKey.get(k)) < n) famByKey.set(k, f);
}
const normalizeFamily = (f) => famByKey.get(famKey(f)) || f;

const FORBIDDEN_TEXT = [/il est important de noter/i, /en conclusion/i, /n['’]h[ée]sitez/i, /---/, /\b\d[.,]\d\s*\/\s*5\b/, /★/];
const FORBIDDEN_CLAIMS = [/certificat/i, /entrep[ôo]t/i, /coffret d['’]origine/i, /scell[ée]/i, /douane/i, /garantie\s+\d+\s*(ans?|mois)/i];
const textOk = (t) => !FORBIDDEN_TEXT.some((re) => re.test(t)) && !FORBIDDEN_CLAIMS.some((re) => re.test(t));

const applied = [], skipped = [], decisions = [];
for (const f of fs.readdirSync(RES).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(`${RES}/${f}`, "utf8"));
  const p = bySlug.get(r.slug);
  if (!p) { skipped.push({ slug: r.slug, why: "slug absent du catalogue" }); continue; }
  if (r.confidence === "low" && !WITH_LOW) { skipped.push({ slug: r.slug, why: "confiance low" }); continue; }

  const changes = [];
  const c = r.corrections || {};
  // champs simples
  for (const field of ["name", "h1", "gender", "category", "concentration", "volume", "inStock"]) {
    if (c[field] === null || c[field] === undefined) continue;
    if (p[field] === c[field]) continue;
    changes.push({ field, from: p[field], to: c[field] });
  }
  // famille normalisée
  if (c.family) {
    const fam = normalizeFamily(c.family);
    if (fam !== p.family) changes.push({ field: "family", from: p.family, to: fam, normalized: fam !== c.family ? c.family : undefined });
  }
  // notes
  if (c.notes) {
    const n = c.notes;
    const bad = ["top", "heart", "base"].some((k) => (p.notes[k] || []).length > 0 && (!n[k] || n[k].length === 0));
    if (bad) skipped.push({ slug: r.slug, why: "notes proposées incomplètes (une section vidée)" });
    else if (JSON.stringify(n) !== JSON.stringify(p.notes)) changes.push({ field: "notes", from: p.notes, to: { top: n.top || [], heart: n.heart || [], base: n.base || [] } });
  }
  // textes réécrits
  const d = r.description || {};
  if (d.needsRewrite && d.description) {
    const both = `${d.description} ${d.shortDescription || ""}`;
    if (!textOk(both)) skipped.push({ slug: r.slug, why: "texte réécrit refusé (formule interdite ou affirmation commerciale)" });
    else {
      if (d.description !== p.description) changes.push({ field: "description", from: `${p.description.length} car.`, to: `${d.description.length} car.`, value: d.description });
      if (d.shortDescription && d.shortDescription !== p.shortDescription) changes.push({ field: "shortDescription", from: p.shortDescription, to: d.shortDescription, value: d.shortDescription });
    }
  }
  // décisions humaines
  // changement de marque : touche brandSlug, la page /marques/<slug>, le fil d'ariane et h1 -> jamais automatique
  if (c.brand && c.brand !== p.brand) decisions.push({ slug: r.slug, sujet: "marque à changer", detail: `${p.brand} -> ${c.brand} (source ${r.fragrantica?.url || "?"})` });
  if (r.textIssue) decisions.push({ slug: r.slug, sujet: "texte à réécrire", detail: String(r.textIssue).slice(0, 200) });
  if (r.exists === false) decisions.push({ slug: r.slug, sujet: "produit fantôme", detail: (r.issues || []).map((i) => i.correct).join(" | ") });
  if (r.idStatus === "wrong") decisions.push({ slug: r.slug, sujet: "image probablement fausse", detail: `ID utilisé ${r.fragranticaIdHint ?? "?"} -> ID correct ${r.fragrantica?.id ?? "inconnu"}` });
  if (r.discontinued === "yes" && p.inStock && !changes.some((x) => x.field === "inStock")) changes.push({ field: "inStock", from: true, to: false });

  if (!changes.length) continue;
  applied.push({ slug: r.slug, brand: p.brand, name: p.name, confidence: r.confidence, changes });
  if (APPLY) for (const ch of changes) p[ch.field] = ch.value !== undefined ? ch.value : ch.to;
}

if (APPLY) fs.writeFileSync("./data/products.json", JSON.stringify(catalog, null, 2) + "\n");
fs.writeFileSync("./scripts/_catalog-audit/apply-report.json", JSON.stringify({ applied, skipped, decisions }, null, 1));

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${applied.length} fiches modifiées, ${skipped.length} ignorées, ${decisions.length} décisions à prendre`);
const byField = {};
applied.flatMap((a) => a.changes).forEach((ch) => { byField[ch.field] = (byField[ch.field] || 0) + 1; });
console.log("champs corrigés:", byField);
applied.forEach((a) => console.log(`  ${a.slug} [${a.confidence}] : ${a.changes.map((c) => c.field).join(", ")}`));
skipped.forEach((s) => console.log(`  ignoré ${s.slug} : ${s.why}`));
decisions.forEach((d) => console.log(`  DÉCISION ${d.slug} (${d.sujet}) : ${String(d.detail).slice(0, 120)}`));
