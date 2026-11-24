// Q4 : effet du titre du 14/09/2026 (« Prix » ajouté) et de la hausse de prix du 18/10, sur les
// 3 semaines avant / après. Script jetable : node scripts/_seo/titres/recherche/04-avant-apres.mjs
import { execSync } from "child_process";
import { jours, charger, chemin, typePage, somme } from "../../../_gsc/lib-analyse.mjs";

const out = [];
const fmt = (s) => `${s.clics} clics, ${s.imp} imp, CTR ${(s.ctr * 100).toFixed(2)} %, pos ${s.pos.toFixed(2)}`;
const fen = (ls, de, a) => somme(ls.filter((l) => l.date >= de && l.date <= a));

// ---------- 1. Titre du 14/09 (commit 30ce453, 14/09 20:10) ----------
out.push("## 1. Titre du 14/09/2026 : « {h1} Original » → « {Marque} {Nom} Prix Algérie Original »");
out.push("Base : jours-<type>.json (courbes quotidiennes complètes). Avant = 24/08 → 13/09 ; après = 15/09 → 05/10 ; après décalé (temps de recrawl) = 22/09 → 12/10.");
out.push("Le 15/09, les prix ont aussi été recalés (médiane + 3 %) ; du 17 au 30/09 le catalogue passe de 735 à 1 048 fiches et la fiche est restructurée (25/09) : tout cela tombe dans « après ».");
out.push("");
out.push("| type | avant | après | après décalé | ΔCTR après (pts) | Δpos |");
out.push("|---|---|---|---|---|---|");
const T = ["produit", "marque", "fille", "accueil", "mere"];
const res14 = {};
for (const t of T) {
  const j = jours(t);
  const av = fen(j, "2026-08-24", "2026-09-13"), ap = fen(j, "2026-09-15", "2026-10-05"), ad = fen(j, "2026-09-22", "2026-10-12");
  res14[t] = { av, ap, ad };
  out.push(`| ${t} | ${fmt(av)} | ${fmt(ap)} | ${fmt(ad)} | ${((ap.ctr - av.ctr) * 100).toFixed(2)} | ${(ap.pos - av.pos).toFixed(2)} |`);
}
// Différence de différences : ratio CTR produit / CTR témoin (marque + fille)
const temoin = (k) => somme([res14.marque[k], res14.fille[k]].map((s) => ({ clics: s.clics, imp: s.imp, pos: s.pos })));
const r = (k) => res14.produit[k].ctr / temoin(k).ctr;
out.push("");
out.push(`Ratio CTR fiches / CTR témoin (marque + fille, titres inchangés le 14/09) : avant ${r("av").toFixed(3)}, après ${r("ap").toFixed(3)}, après décalé ${r("ad").toFixed(3)} (${(((r("ap") / r("av")) - 1) * 100).toFixed(0)} % puis ${(((r("ad") / r("av")) - 1) * 100).toFixed(0)} %).`);

// Semaine par semaine autour du 14/09
out.push("");
out.push("Semaine par semaine (fiches produit / témoin marque+fille) :");
out.push("| semaine du | fiches CTR | fiches pos | fiches imp | témoin CTR | témoin pos |");
out.push("|---|---|---|---|---|---|");
const jp = jours("produit"), jm = jours("marque"), jf = jours("fille");
const ajoute = (d, n) => { const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
for (let d = "2026-08-10"; d <= "2026-10-19"; d = ajoute(d, 7)) {
  const f = ajoute(d, 6);
  const p = fen(jp, d, f), t = fen([...jm, ...jf], d, f);
  out.push(`| ${d} | ${(p.ctr * 100).toFixed(2)} % | ${p.pos.toFixed(2)} | ${p.imp} | ${(t.ctr * 100).toFixed(2)} % | ${t.pos.toFixed(2)} |`);
}

// ---------- 2. Hausse de prix du 18/10 (commit ee0647e) ----------
out.push("");
out.push("## 2. Hausse de prix du 18/10/2026 (médiane + 20 % / + 10 %)");
const avant = JSON.parse(execSync("git show ee0647e~1:data/products.json", { maxBuffer: 1 << 28 }).toString());
const apres = JSON.parse(execSync("git show ee0647e:data/products.json", { maxBuffer: 1 << 28 }).toString());
const pAv = new Map(avant.products.map((p) => [p.slug, p.price]));
const pAp = new Map(apres.products.map((p) => [p.slug, p.price]));
const variation = (slug) => (pAv.has(slug) && pAp.has(slug) ? pAp.get(slug) / pAv.get(slug) - 1 : null);

// page × jour (pages-jours-60 : 21/09 → 20/11) : fiches produit, et pages marque + filles comme témoin
const pjTout = charger("pages-jours-60").map((r) => ({ date: r.keys[0], url: r.keys[1], type: typePage(r.keys[1]), chemin: chemin(r.keys[1]), clics: r.clicks, imp: r.impressions, pos: r.position }));
const AV = ["2026-09-27", "2026-10-17"], AP = ["2026-10-19", "2026-11-08"];
const NOMS = ["témoin : pages marque + filles", "hausse < 8 %", "hausse 8 à 12 %", "hausse 12 à 18 %", "hausse ≥ 18 %"];
const classe = (l) => {
  if (l.type === "marque" || l.type === "fille") return NOMS[0];
  if (l.type !== "produit") return null;
  const v = variation(l.chemin.split("/")[2]);
  if (v === null) return null;
  return v < 0.08 ? NOMS[1] : v < 0.12 ? NOMS[2] : v < 0.18 ? NOMS[3] : NOMS[4];
};
const parPage = new Map();
for (const l of pjTout) {
  const g = classe(l);
  if (!g) continue;
  const e = parPage.get(l.chemin) || parPage.set(l.chemin, { g, chemin: l.chemin, v: l.type === "produit" ? variation(l.chemin.split("/")[2]) : 0, av: [], ap: [], tout: [] }).get(l.chemin);
  e.tout.push(l);
  if (l.date >= AV[0] && l.date <= AV[1]) e.av.push(l);
  else if (l.date >= AP[0] && l.date <= AP[1]) e.ap.push(l);
}
const groupes = Object.fromEntries(NOMS.map((n) => [n, []]));
for (const e of parPage.values()) if (somme(e.av).imp >= 20 && somme(e.ap).imp >= 20) groupes[e.g].push(e);
const nbHausse = apres.products.filter((p) => pAv.has(p.slug) && p.price > pAv.get(p.slug)).length;
out.push(`Base : pages-jours-60 (page × jour, complet). Avant = ${AV.join(" → ")} ; après = ${AP.join(" → ")}. Pages présentes des deux côtés (≥ 20 imp de chaque côté). Variation de prix = data/products.json avant / après le commit ee0647e (${nbHausse} fiches montées sur ${apres.products.length} : presque aucune fiche n'est restée stable, d'où le témoin pris hors fiches).`);
out.push("Le même jour (936a365) : « 58 → 69 wilayas » et fin de « COD » dans les textes de toutes les pages : touche fiches et témoin pareil.");
out.push("Les hausses ≥ 18 % sont surtout les parfums ≤ 15 000 DA (règle + 20 %) : groupe différent par nature (orientaux, prix bas).");
out.push("");
const BANDES = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 10], [10, 15], [15, 101]];
const parBande = (ls) => BANDES.map(([a, b]) => somme(ls.filter((l) => l.pos >= a && l.pos < b)));
out.push("| groupe | pages | hausse médiane | avant | après | ΔCTR brut | Δ CTR à positions égales |");
out.push("|---|---|---|---|---|---|---|");
const ajust = {};
for (const [g, ls] of Object.entries(groupes)) {
  const av = ls.flatMap((x) => x.av), ap = ls.flatMap((x) => x.ap);
  const sAv = somme(av), sAp = somme(ap);
  const bAv = parBande(av), bAp = parBande(ap);
  // CTR d'après et d'avant pondérés par la répartition d'impressions par bande d'avant
  let num = 0, num0 = 0, den = 0;
  BANDES.forEach((_, i) => { if (bAv[i].imp && bAp[i].imp) { num += bAv[i].imp * bAp[i].ctr; num0 += bAv[i].imp * bAv[i].ctr; den += bAv[i].imp; } });
  ajust[g] = num / num0 - 1;
  const vs = ls.map((x) => x.v).sort((a, b) => a - b);
  out.push(`| ${g} | ${ls.length} | ${(vs[Math.floor(vs.length / 2)] * 100).toFixed(0)} % | ${fmt(sAv)} | ${fmt(sAp)} | ${((sAp.ctr / sAv.ctr - 1) * 100).toFixed(0)} % | ${(ajust[g] * 100).toFixed(0)} % |`);
}
{
  // toutes les fiches ensemble
  const ls = NOMS.slice(1).flatMap((n) => groupes[n]);
  const av = ls.flatMap((x) => x.av), ap = ls.flatMap((x) => x.ap);
  const bAv = parBande(av), bAp = parBande(ap);
  let num = 0, num0 = 0;
  BANDES.forEach((_, i) => { if (bAv[i].imp && bAp[i].imp) { num += bAv[i].imp * bAp[i].ctr; num0 += bAv[i].imp * bAv[i].ctr; } });
  ajust.toutes = num / num0 - 1;
  out.push(`| toutes les fiches | ${ls.length} | – | ${fmt(somme(av))} | ${fmt(somme(ap))} | ${((somme(ap).ctr / somme(av).ctr - 1) * 100).toFixed(0)} % | ${(ajust.toutes * 100).toFixed(0)} % |`);
}
out.push("");
out.push("Différence de différences (à positions égales, contre le témoin) : " + [...NOMS.slice(1), "toutes"].map((n) => `${n} ${((ajust[n] - ajust[NOMS[0]]) * 100).toFixed(0)} pts`).join(" ; ") + ".");

out.push("");
out.push("Robustesse, page par page (≥ 100 imp de chaque côté, ≥ 5 clics au total) : médiane de (CTR après / CTR avant − 1) ; puis seulement les pages dont la position a bougé de moins d'une place.");
for (const [g, ls] of Object.entries(groupes)) {
  const xs = ls.filter((x) => somme(x.av).imp >= 100 && somme(x.ap).imp >= 100 && somme(x.av).clics + somme(x.ap).clics >= 5);
  const d = xs.map((x) => (somme(x.ap).ctr + 1e-9) / (somme(x.av).ctr + 1e-9) - 1).sort((a, b) => a - b);
  const stable = xs.filter((x) => Math.abs(somme(x.ap).pos - somme(x.av).pos) < 1);
  const ds = stable.map((x) => (somme(x.ap).ctr + 1e-9) / (somme(x.av).ctr + 1e-9) - 1).sort((a, b) => a - b);
  out.push(`- ${g} : ${xs.length} pages, médiane ${d.length ? (d[Math.floor(d.length / 2)] * 100).toFixed(0) : "–"} % ; position stable : ${stable.length} pages, médiane ${ds.length ? (ds[Math.floor(ds.length / 2)] * 100).toFixed(0) : "–"} %`);
}

out.push("");
out.push("Semaine par semaine (CTR / position), pages des groupes ci-dessus :");
out.push("| semaine du | " + NOMS.join(" | ") + " |");
out.push("|---|" + NOMS.map(() => "---").join("|") + "|");
for (let d = "2026-09-21"; d <= "2026-11-09"; d = ajoute(d, 7)) {
  const f = ajoute(d, 6);
  const cells = NOMS.map((n) => {
    const s = somme(groupes[n].flatMap((x) => x.tout.filter((l) => l.date >= d && l.date <= f)));
    return `${(s.ctr * 100).toFixed(2)} % / ${s.pos.toFixed(2)}`;
  });
  out.push(`| ${d} | ${cells.join(" | ")} |`);
}
console.log(out.join("\n"));
