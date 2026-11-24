#!/usr/bin/env node
// Mesures de la charte (CHARTE-finale.md §2) pour chaque page d'un lot, pour que tous les
// rédacteurs décident sur les mêmes chiffres.
//   node scripts/_seo/titres/mesures.mjs lot-001          (ou speciaux)
// Une ligne par page : base (impressions latines des requêtes), parts de « parfum », genre,
// « original », contenance, ordre (nom seul / marque d'abord / nom d'abord / marque seule),
// sœurs « … Parfum », maison « nom d'abord ».
import fs from "fs";

const lot = process.argv[2];
if (!lot) { console.error("usage : mesures.mjs lot-001"); process.exit(2); }
const pages = JSON.parse(fs.readFileSync(`scripts/_seo/titres/dossiers/${lot}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const latin = (q) => !/[؀-ۿ]/.test(q);
const GENERIQUES = new Set("parfum parfums perfume eau de du la le les pour homme femme men women man woman for her him edp edt intense prix algerie dz original 100ml ml".split(" "));
const MAISONS_NOM_DABORD = new Set(["Ajmal", "Armaf", "By Kilian", "Carolina Herrera", "Escada", "Evaflor", "Giorgio Armani", "Guy Laroche", "Lattafa", "Maison Crivelli", "Michael Kors", "Nikos", "Paco Rabanne", "Ralph Lauren", "Rasasi", "Van Cleef & Arpels", "Victoria's Secret", "Viktor & Rolf", "Yves Rocher", "Yves Saint Laurent"]);
const MAISONS_QUI_PRENNENT = new Set(["Kayali", "Mauboussin", "Zara", "Guess", "Mont Blanc", "Narciso Rodriguez"]);
const ALIAS = { "giorgio armani": ["armani"], "paco rabanne": ["rabanne", "paco"], "yves saint laurent": ["ysl", "saint laurent"], "jean paul gaultier": ["gaultier", "jpg"], "carolina herrera": ["herrera"], "lattafa": ["latafa", "lattafah"], "franck olivier": ["frank olivier"], "kayali": ["kay ali"], "dolce gabbana": ["dolce", "d g"], "mont blanc": ["montblanc"] };
const pct = (x, b) => (b ? Math.round((x / b) * 100) : 0);

for (const d of pages) {
  const qs = (d.requetes || []).filter((r) => latin(r.q));
  const base = qs.reduce((s, r) => s + r.imp, 0);
  const part = (re) => pct(qs.filter((r) => re.test(norm(r.q))).reduce((s, r) => s + r.imp, 0), base);
  const ligne = [`${d.chemin}  [${d.type}${d.enStock === false ? ", RUPTURE" : ""}]  base ${base}${base < 30 ? " (sans données)" : ""}`];
  if (d.type === "produit") {
    const b = norm(d.marque);
    const formes = [b, ...(ALIAS[b] || [])];
    const nomTok = norm(d.nom.replace(/^Eau de \S+\s+/i, "")).split(" ").filter((w) => w.length > 1 && !GENERIQUES.has(w) && !formes.some((f) => f.split(" ").includes(w)));
    const premierNom = nomTok[0];
    let nomSeul = 0, marqueDabord = 0, nomDabord = 0, marqueSeule = 0, lesDeux = 0;
    for (const r of qs) {
      const q = ` ${norm(r.q)} `;
      const iB = Math.min(...formes.map((f) => { const i = q.indexOf(` ${f} `); return i < 0 ? Infinity : i; }));
      const iN = premierNom ? q.indexOf(` ${premierNom} `) : -1;
      const aB = iB !== Infinity, aN = iN >= 0;
      if (aN && !aB) nomSeul += r.imp;
      else if (aB && !aN) marqueSeule += r.imp;
      else if (aB && aN) { lesDeux += r.imp; if (iB < iN) marqueDabord += r.imp; else nomDabord += r.imp; }
    }
    const vols = {};
    for (const r of qs) { const m = norm(r.q).replace(/(\d+) ml/g, "$1ml").match(/(\d+)ml/); if (m) vols[m[1]] = (vols[m[1]] || 0) + r.imp; }
    const volTop = Object.entries(vols).sort((a, b) => b[1] - a[1])[0];
    const volCat = (d.volume || "").replace(/\D/g, "");
    const soeurParfum = (d.variantes || []).filter((v) => /\b(le )?parfum$/i.test(v.nom.trim())).map((v) => v.nom);
    ligne.push(
      `  parfum ${part(/\b(parfum|parfums|perfume|parfume)\b/)} %  genre ${part(/\b(homme|femme|men|women|man|woman|for her|pour elle|pour lui)\b/)} %  original ${part(/\boriginal/)} %  prix ${part(/\b(prix|price|combien)\b/)} %  contenance ${part(/\d+ ?ml\b/)} %${volTop ? ` (la plus tapée ${volTop[0]} ml, catalogue ${volCat} ml)` : ""}`,
      `  ordre : nom seul ${pct(nomSeul, base)} %, marque d'abord ${pct(marqueDabord, base)} %, nom d'abord ${pct(nomDabord, base)} % (= ${pct(nomDabord, lesDeux)} % des requêtes à deux), marque seule ${pct(marqueSeule, base)} %  [mot du nom testé : « ${premierNom || "?"} »]`,
      `  maison ${MAISONS_NOM_DABORD.has(d.marque) ? "« nom d'abord »" : "« marque d'abord »"}${MAISONS_QUI_PRENNENT.has(d.marque) ? ", maison qui prend ses fiches" : ""}${soeurParfum.length ? `  ; sœur(s) « Parfum » : ${soeurParfum.join(", ")}` : ""}${d.variantes?.length ? `  ; variantes : ${d.variantes.map((v) => `${v.nom} (${v.conc} ${v.vol})`).join(" ; ")}` : ""}`,
    );
  } else {
    ligne.push(`  parfum ${part(/\b(parfum|parfums|perfume)\b/)} %  prix ${part(/\b(prix|price)\b/)} %  femme ${part(/\b(femme|women|woman)\b/)} %  homme ${part(/\b(homme|men|man)\b/)} %  original ${part(/\boriginal/)} %  numidia ${part(/numidia/)} %`);
    if (d.marque) {
      const b = norm(d.marque), formes = [b, ...(ALIAS[b] || [])];
      let pd = 0, md = 0;
      for (const r of qs) { const q = ` ${norm(r.q)} `; const iP = q.search(/ parfums? /); const iB = Math.min(...formes.map((f) => { const i = q.indexOf(` ${f} `); return i < 0 ? Infinity : i; })); if (iP >= 0 && iB !== Infinity) { if (iP < iB) pd += r.imp; else md += r.imp; } }
      ligne.push(`  requêtes avec « parfum » et la marque : ${pd + md} imp, « parfum » d'abord ${pct(pd, pd + md)} %, marque d'abord ${pct(md, pd + md)} %`);
    }
  }
  console.log(ligne.join("\n"));
}
