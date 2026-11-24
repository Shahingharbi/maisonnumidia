// Q4 complément : le mot « prix » ajouté au titre le 14/09 a-t-il fait monter le CTR des requêtes
// « prix » PLUS que celui des autres requêtes ? Couples requête × page présents en B (23/05 → 20/08)
// et en D (24/09 → 21/10), ≥ 5 imp de chaque côté. Témoin : pages marque + filles (titres inchangés).
import { rp, somme } from "../../../_gsc/lib-analyse.mjs";
const n = (s) => " " + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC") + " ";
const reP = /\b(prix|price|combien)\b|(سعر|ثمن)/;
const cle = (l) => l.requete + "|" + l.chemin;
const B = new Map(rp("B").map((l) => [cle(l), l])), D = new Map(rp("D").map((l) => [cle(l), l]));
const g = {};
for (const [k, d] of D) {
  const b = B.get(k);
  if (!b || b.imp < 5 || d.imp < 5) continue;
  const t = d.type === "produit" ? "fiches" : d.type === "marque" || d.type === "fille" ? "témoin marque+fille" : null;
  if (!t) continue;
  const gk = `${t} | ${reP.test(n(d.requete)) ? "avec prix" : "sans prix"}`;
  (g[gk] ??= { b: [], d: [] }); g[gk].b.push(b); g[gk].d.push(d);
}
console.log("| groupe | couples | CTR B | pos B | CTR D | pos D | CTR D / CTR B |");
console.log("|---|---|---|---|---|---|---|");
for (const [k, v] of Object.entries(g).sort()) {
  const b = somme(v.b), d = somme(v.d);
  console.log(`| ${k} | ${v.b.length} | ${(b.ctr * 100).toFixed(2)} % | ${b.pos.toFixed(1)} | ${(d.ctr * 100).toFixed(2)} % | ${d.pos.toFixed(1)} | ×${(d.ctr / b.ctr).toFixed(2)} |`);
}
// Même chose en ne gardant que les couples dont la position a bougé de moins d'une place
console.log("\nCouples à position stable (|Δpos| < 1) :");
for (const [k, v] of Object.entries(g).sort()) {
  const idx = v.b.map((b, i) => i).filter((i) => Math.abs(v.b[i].pos - v.d[i].pos) < 1);
  const b = somme(idx.map((i) => v.b[i])), d = somme(idx.map((i) => v.d[i]));
  console.log(`- ${k} : ${idx.length} couples, CTR ${(b.ctr * 100).toFixed(2)} % → ${(d.ctr * 100).toFixed(2)} % (×${(d.ctr / b.ctr).toFixed(2)}), pos ${b.pos.toFixed(1)} → ${d.pos.toFixed(1)}`);
}

// Position : le 14/09 a ajouté « Prix » et retiré « Parfum {Genre} » du titre des fiches.
// Les requêtes qui contiennent ces mots ont-elles gagné / perdu des places plus que les autres ?
console.log("\nPosition B → D par mot présent dans la requête (couples ≥ 5 imp de chaque côté) :");
console.log("| groupe | couples | pos B | pos D | places gagnées | CTR B → D |");
console.log("|---|---|---|---|---|---|");
const motifs = {
  "prix": (q) => reP.test(q),
  "parfum sans prix": (q) => /\b(parfum|perfume)\b|عطر/.test(q) && !reP.test(q),
  "homme/femme sans prix": (q) => /\b(homme|femme|men|women)\b|(رجالي|نسائي)/.test(q) && !reP.test(q),
  "algérie sans prix": (q) => /\b(algerie|algeria|dz)\b|الجزائر/.test(q) && !reP.test(q),
  "nom seul (aucun de ces mots)": (q) => !reP.test(q) && !/\b(parfum|perfume|homme|femme|men|women|algerie|algeria|dz)\b|(عطر|رجالي|نسائي|الجزائر)/.test(q),
};
for (const t of ["fiches", "témoin"]) for (const [m, f] of Object.entries(motifs)) {
  const bs = [], ds = [];
  for (const [k, d] of D) {
    const b = B.get(k);
    if (!b || b.imp < 5 || d.imp < 5) continue;
    const tt = d.type === "produit" ? "fiches" : d.type === "marque" || d.type === "fille" ? "témoin" : null;
    if (tt !== t || !f(n(d.requete))) continue;
    bs.push(b); ds.push(d);
  }
  const b = somme(bs), d = somme(ds);
  console.log(`| ${t} · ${m} | ${bs.length} | ${b.pos.toFixed(1)} | ${d.pos.toFixed(1)} | ${(b.pos - d.pos).toFixed(1)} | ${(b.ctr * 100).toFixed(1)} → ${(d.ctr * 100).toFixed(1)} % |`);
}
