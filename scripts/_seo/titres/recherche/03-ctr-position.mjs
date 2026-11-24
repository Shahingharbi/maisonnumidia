// Q3 : CTR par tranche de position et par type de page (pages-A, données complètes), puis les 30
// fiches dont le CTR est le plus en dessous de la courbe pour leur position.
// Script jetable : node scripts/_seo/titres/recherche/03-ctr-position.mjs
import fs from "fs";
import { pages, rp, produits, somme } from "../../../_gsc/lib-analyse.mjs";
// produit par 05-mauvaise-page.mjs (le lancer avant)
const PF = JSON.parse(fs.readFileSync(new URL("./05-par-fiche.json", import.meta.url), "utf8"));

// Fusion www + apex par chemin (le www redirige en 301)
const parChemin = new Map();
for (const l of pages("A")) {
  const e = parChemin.get(l.chemin) || parChemin.set(l.chemin, { chemin: l.chemin, type: l.type, ls: [] }).get(l.chemin);
  e.ls.push(l);
}
const P = [...parChemin.values()].map((e) => ({ chemin: e.chemin, type: e.type, ...somme(e.ls) }));

const BANDES = [[1, 3], [3, 5], [5, 8], [8, 12], [12, 20]];
const TYPES = ["produit", "marque", "fille", "mere", "accueil", "blog"];
const out = [];
out.push("Base : pages-A (90 jours, données complètes), www fusionné. Une page est rangée dans la tranche de sa position moyenne (pondérée par les impressions).");
out.push("CTR = clics / impressions de toutes les pages de la tranche ; entre parenthèses : nombre de pages, impressions.");
out.push("");
out.push("| type | " + BANDES.map(([a, b]) => `pos ${a}-${b}`).join(" | ") + " | toutes |");
out.push("|---|" + BANDES.map(() => "---").join("|") + "|---|");
for (const t of TYPES) {
  const ls = P.filter((p) => p.type === t);
  const cells = BANDES.map(([a, b]) => {
    const g = ls.filter((p) => p.pos >= a && p.pos < b);
    const s = somme(g.map((p) => ({ clics: p.clics, imp: p.imp, pos: p.pos })));
    return s.imp ? `${(s.ctr * 100).toFixed(1)} % (${g.length} p., ${s.imp})` : "–";
  });
  const s = somme(ls.map((p) => ({ clics: p.clics, imp: p.imp, pos: p.pos })));
  out.push(`| ${t} | ${cells.join(" | ")} | ${(s.ctr * 100).toFixed(1)} % |`);
}

// Même chose en médiane des pages (≥ 100 imp) : moins dominée par les grosses pages
out.push("");
out.push("Médiane du CTR des pages à ≥ 100 imp, par tranche :");
out.push("| type | " + BANDES.map(([a, b]) => `pos ${a}-${b}`).join(" | ") + " |");
out.push("|---|" + BANDES.map(() => "---").join("|") + "|");
const med = (xs) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
for (const t of TYPES) {
  const ls = P.filter((p) => p.type === t && p.imp >= 100);
  out.push(`| ${t} | ` + BANDES.map(([a, b]) => {
    const g = ls.filter((p) => p.pos >= a && p.pos < b);
    const m = med(g.map((p) => p.ctr));
    return m === null ? "–" : `${(m * 100).toFixed(1)} % (${g.length})`;
  }).join(" | ") + " |");
}

// Courbe de référence des fiches : CTR par demi-position (somme des pages ≥ 30 imp), tranches de
// moins de 10 pages fusionnées avec la suivante, puis régression isotone décroissante (pondérée par
// les impressions). Avant 3,5 : pas assez de pages, on prend la première tranche.
const fiches = P.filter((p) => p.type === "produit");
let tr = [];
for (let k = 3.5; k < 16; k += 0.5) {
  const g = fiches.filter((p) => p.pos >= k && p.pos < k + 0.5 && p.imp >= 30);
  const s = somme(g.map((p) => ({ clics: p.clics, imp: p.imp, pos: p.pos })));
  tr.push({ de: k, a: k + 0.5, n: g.length, imp: s.imp, clics: s.clics });
}
const fus = [];
for (const t of tr) {
  const d = fus[fus.length - 1];
  if (d && d.n < 10) { d.a = t.a; d.n += t.n; d.imp += t.imp; d.clics += t.clics; } else fus.push({ ...t });
}
if (fus.length > 1 && fus[fus.length - 1].n < 10) { const z = fus.pop(); const d = fus[fus.length - 1]; d.a = z.a; d.n += z.n; d.imp += z.imp; d.clics += z.clics; }
// PAV
let blocs = fus.map((t) => ({ ...t, ctr: t.clics / t.imp, membres: [t] }));
let change = true;
while (change) {
  change = false;
  for (let i = 0; i < blocs.length - 1; i++) {
    if (blocs[i].ctr < blocs[i + 1].ctr) {
      const x = blocs[i], y = blocs[i + 1];
      const m = { de: x.de, a: y.a, n: x.n + y.n, imp: x.imp + y.imp, clics: x.clics + y.clics, membres: [...x.membres, ...y.membres] };
      m.ctr = m.clics / m.imp;
      blocs.splice(i, 2, m); change = true; break;
    }
  }
}
out.push("");
out.push("Courbe de référence des fiches produit (pages ≥ 30 imp ; tranches brutes puis lissage isotone) :");
out.push("brut : " + fus.map((t) => `${t.de}-${t.a} : ${((t.clics / t.imp) * 100).toFixed(1)} % (${t.n} p.)`).join(" · "));
out.push("lissé : " + blocs.map((b) => `${b.de}-${b.a} : ${(b.ctr * 100).toFixed(1)} %`).join(" · "));
const attendu = (pos) => {
  const b = blocs.find((b) => pos < b.a) || blocs[blocs.length - 1];
  return b.ctr;
};

// Requêtes de chaque fiche (rp-A)
const req = new Map();
for (const l of rp("A")) if (l.type === "produit") (req.get(l.chemin) || req.set(l.chemin, []).get(l.chemin)).push(l);

const titreActuel = (p) => `${p.brand.trim().toLowerCase() === p.name.trim().toLowerCase() ? p.brand : `${p.brand} ${p.name}`} Prix Algérie Original | Maison Numidia`;
const cand = [];
for (const f of fiches) {
  if (f.imp < 400 || f.pos > 15) continue;
  const p = produits.get(f.chemin.split("/")[2]);
  if (!p) continue;
  const att = attendu(f.pos);
  const manque = att * f.imp - f.clics;
  cand.push({ f, p, att, manque, ratio: f.ctr / att });
}
cand.sort((a, b) => b.manque - a.manque);
out.push("");
out.push(`Fiches à ≥ 400 imp et position ≤ 15 : ${cand.length}. Clics manquants = imp × CTR attendu à sa position − clics réels (90 jours).`);
const sousCourbe = cand.filter((c) => c.ratio < 1);
out.push(`Sous la courbe : ${sousCourbe.length} fiches, ${Math.round(sousCourbe.reduce((s, c) => s + c.manque, 0))} clics manquants en 90 jours (≈ ${Math.round(sousCourbe.reduce((s, c) => s + c.manque, 0) / 3)} par mois).`);
out.push("");
out.push("### Les 30 fiches les plus en dessous de la courbe (en clics manquants)");
out.push("| # | fiche | imp | pos | CTR | CTR attendu | clics manquants | titre actuel | requêtes n°1 à 3 (imp, pos) | part requêtes de marque / d'une autre fiche (échantillon) | prix DA |");
out.push("|---|---|---|---|---|---|---|---|---|---|---|");
cand.slice(0, 30).forEach((c, i) => {
  const qs = (req.get(c.f.chemin) || []).sort((a, b) => b.imp - a.imp).slice(0, 3).map((l) => `${l.requete} (${l.imp}, ${l.pos.toFixed(1)})`).join(" ; ");
  out.push(`| ${i + 1} | ${c.f.chemin} | ${c.f.imp} | ${c.f.pos.toFixed(1)} | ${(c.f.ctr * 100).toFixed(1)} % | ${(c.att * 100).toFixed(1)} % | ${Math.round(c.manque)} | ${titreActuel(c.p)} | ${qs} | ${PF[c.f.chemin] && PF[c.f.chemin].total ? `${Math.round((PF[c.f.chemin].marque / PF[c.f.chemin].total) * 100)} % / ${Math.round((PF[c.f.chemin].autre / PF[c.f.chemin].total) * 100)} %` : "0 % / 0 %"} | ${c.p.price} |`);
});
// Profil : qu'ont-elles en commun ?
const top = cand.slice(0, 30);
const avecMarqueDansReq = top.filter((c) => {
  const qs = (req.get(c.f.chemin) || []).sort((a, b) => b.imp - a.imp).slice(0, 5);
  const b = c.p.brand.toLowerCase().split(" ")[0];
  return qs.filter((l) => l.requete.toLowerCase().includes(b)).length >= 3;
}).length;
out.push("");
out.push(`Parmi ces 30 : ${avecMarqueDansReq} ont la marque dans au moins 3 de leurs 5 premières requêtes ; prix médian ${med(top.map((c) => c.p.price))} DA (catalogue : ${med([...produits.values()].map((p) => p.price))} DA) ; longueur médiane du titre actuel ${med(top.map((c) => titreActuel(c.p).length))} caractères.`);

// Longueur des titres actuels, tout le catalogue
const L = [...produits.values()].map((p) => titreActuel(p).length);
out.push(`Titres actuels des ${L.length} fiches : longueur médiane ${med(L)} caractères ; > 60 : ${L.filter((x) => x > 60).length} ; > 70 : ${L.filter((x) => x > 70).length}.`);
console.log(out.join("\n"));
