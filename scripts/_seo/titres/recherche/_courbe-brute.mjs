import { pages, somme } from "../../../_gsc/lib-analyse.mjs";
const m = new Map();
for (const l of pages("A")) if (l.type === "produit") (m.get(l.chemin) || m.set(l.chemin, []).get(l.chemin)).push(l);
const P = [...m.values()].map((ls) => somme(ls));
for (let k = 2; k <= 16; k += 0.5) {
  const g = P.filter((p) => p.pos >= k && p.pos < k + 0.5 && p.imp >= 30);
  const s = somme(g.map((p) => ({ clics: p.clics, imp: p.imp, pos: p.pos })));
  const med = g.map((p) => p.ctr).sort((a, b) => a - b)[Math.floor(g.length / 2)];
  console.log(k, g.length, s.imp, (s.ctr * 100).toFixed(1), med !== undefined ? (med * 100).toFixed(1) : "-");
}
