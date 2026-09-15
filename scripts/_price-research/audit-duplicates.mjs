#!/usr/bin/env node
// Audit des quasi-doublons dans add-candidates.json :
//   - fautes d'orthographe/translittération sûres  -> dup-auto.json (fusion automatique)
//   - paires ambiguës ("mot en plus", orthographe large) -> pairs-to-judge.json (à trancher par agents)
// Couvre : nouveau <> nouveau (même marque) et nouveau <> déjà au catalogue.
// Usage : node scripts/_price-research/audit-duplicates.mjs
import fs from "fs";
import { FLANKER } from "./lib-match.mjs";

const cands = JSON.parse(fs.readFileSync("./scripts/_price-research/add-candidates.json", "utf8"));
const nouveaux = cands.filter((c) => c.status === "nouveau");
const existing = cands.filter((c) => c.status !== "nouveau");

function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
const ROMAN = new Set(["i", "ii", "iii", "iv", "v", "vi", "vii", "x", "xx"]);
function relation(x, y) {
  if (x.gender && y.gender && x.gender !== y.gender) return null;
  if (x.concentration && y.concentration && x.concentration !== y.concentration) return null;
  if (x.base === y.base) return { kind: "meme-base", auto: false };
  const A = new Set(x.base.split(" ")), B = new Set(y.base.split(" "));
  const onlyA = [...A].filter((t) => !B.has(t)), onlyB = [...B].filter((t) => !A.has(t));
  if (onlyA.length === 1 && onlyB.length === 1) {
    const [a, b] = [onlyA[0], onlyB[0]];
    if (/\d/.test(a) || /\d/.test(b) || ROMAN.has(a) || ROMAN.has(b)) return null;
    const d = lev(a, b), maxL = Math.max(a.length, b.length), minL = Math.min(a.length, b.length);
    if ((maxL >= 5 && d <= 1) || (minL >= 7 && d <= 2)) return { kind: `orthographe ${a}/${b}`, auto: true };
    if (d <= 2 && minL >= 4) return { kind: `orthographe-large ${a}/${b}`, auto: false };
    return null;
  }
  const diff = [...onlyA, ...onlyB];
  if (diff.length === 1 && !/^\d+$/.test(diff[0]) && !ROMAN.has(diff[0])) {
    // un mot de déclinaison connu en plus = produit différent, pas besoin de juge
    if (FLANKER.has(diff[0])) return null;
    return { kind: `mot-en-plus ${diff[0]}`, auto: false };
  }
  return null;
}

const bucket = (list) => { const m = new Map(); for (const c of list) { const k = c.brand.toLowerCase(); if (!m.has(k)) m.set(k, []); m.get(k).push(c); } return m; };
const auto = [], judge = [];
const add = (r, a, b) => {
  const pair = { aId: a.id, bId: b.id, brand: a.brand, kind: r.kind, a: { name: a.name, conc: a.concentration, gender: a.gender, volume: a.volume, price: a.marketPrice, shops: a.shopCount, status: a.status }, b: { name: b.name, conc: b.concentration, gender: b.gender, volume: b.volume, price: b.marketPrice, shops: b.shopCount, status: b.status, ourSlug: b.ourSlug || null } };
  (r.auto ? auto : judge).push(pair);
};
const nb = bucket(nouveaux);
for (const list of nb.values()) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
  const r = relation(list[i], list[j]); if (r) add(r, list[i], list[j]);
}
const eb = bucket(existing);
for (const c of nouveaux) for (const e of eb.get(c.brand.toLowerCase()) || []) {
  const r = relation(c, e); if (r) add(r, c, e);
}
judge.forEach((p, i) => { p.pairId = i + 1; });
fs.writeFileSync("./scripts/_price-research/dup-auto.json", JSON.stringify(auto.map((p) => ({ aId: p.aId, bId: p.bId, sameProduct: true, reason: p.kind })), null, 1));
fs.writeFileSync("./scripts/_price-research/pairs-to-judge.json", JSON.stringify(judge, null, 1));
const kinds = (arr) => arr.reduce((m, x) => { const k = x.kind.split(" ")[0]; m[k] = (m[k] || 0) + 1; return m; }, {});
console.log(`Fusions automatiques (orthographe sûre) : ${auto.length}`, kinds(auto));
console.log(`Paires à trancher par agents : ${judge.length}`, kinds(judge), `| dont vs catalogue : ${judge.filter((p) => p.b.status !== "nouveau").length}`);
console.log("\nÉchantillon fusions auto :");
auto.filter((_, i) => i % Math.max(1, Math.floor(auto.length / 15)) === 0).slice(0, 15).forEach((p) => console.log(`  ${p.brand}: "${p.a.name}" = "${p.b.name}"  [${p.kind}]`));
