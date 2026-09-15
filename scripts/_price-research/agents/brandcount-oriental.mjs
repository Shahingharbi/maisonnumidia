// Compte les produits par marque orientale via la recherche Store API (Woo) ou search/suggest (Shopify). Séquentiel.
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [type, base, ...rest] = process.argv.slice(2);
const terms = rest.length ? rest : ["lattafa", "haramain", "rasasi", "swiss arabian", "ajmal", "montale", "afnan", "mancera", "armaf", "arabian oud", "rehab", "nabil", "orientica"];
const out = {};
for (const t of terms) {
  try {
    if (type === "woo") {
      const r = await fetch((base.includes("rest_route") ? `${base}/wc/store/v1/products&per_page=5&search=${encodeURIComponent(t)}` : `${base}/wp-json/wc/store/v1/products?per_page=5&search=${encodeURIComponent(t)}`), { headers: HEADERS, signal: AbortSignal.timeout(30000) });
      const j = JSON.parse((await r.text()).replace(/^﻿/, ""));
      const mu = j[0]?.prices?.currency_minor_unit ?? 0;
      out[t] = `${r.headers.get("x-wp-total")} ex: ${j.slice(0, 3).map((p) => p.name + "=" + Math.round(p.prices.price / 10 ** mu)).join("; ")}`;
    } else {
      const r = await fetch(`${base}/search/suggest.json?q=${encodeURIComponent(t)}&resources[type]=product&resources[limit]=10`, { headers: HEADERS, signal: AbortSignal.timeout(30000) });
      const j = await r.json();
      const ps = j.resources?.results?.products || [];
      out[t] = `${ps.length}(max10) ex: ${ps.slice(0, 3).map((p) => p.title + "=" + p.price).join("; ")}`;
    }
  } catch (e) { out[t] = "ERR " + e.message; }
  await sleep(1600);
}
console.log(base);
for (const [k, v] of Object.entries(out)) console.log(`  ${k}: ${v.slice(0, 220)}`);
