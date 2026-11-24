import { jours, somme } from "../../../_gsc/lib-analyse.mjs";
const t = [...jours("marque"), ...jours("fille")];
for (const [de, a] of [["2026-08-24", "2026-09-13"], ["2026-09-15", "2026-10-05"], ["2026-09-22", "2026-10-12"]]) {
  const s = somme(t.filter((l) => l.date >= de && l.date <= a));
  console.log(de, a, (s.ctr * 100).toFixed(2), s.pos.toFixed(2));
}
