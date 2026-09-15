// Sonde rapide : détecte la plateforme (Woo Store API / Shopify) + robots.txt, séquentiel.
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const domains = process.argv.slice(2);
for (const d of domains) {
  const base = d.startsWith("http") ? d : `https://${d}`;
  const res = { d };
  try {
    const r = await fetch(`${base}/robots.txt`, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    const t = await r.text();
    res.robots = r.status + " " + t.split("\n").filter((l) => /disallow|crawl-delay/i.test(l)).slice(0, 8).join(" | ").slice(0, 300);
  } catch (e) { res.robots = "ERR " + e.message; }
  await sleep(1500);
  try {
    const r = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=1`, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    const t = await r.text();
    let j = null; try { j = JSON.parse(t.replace(/^﻿/, "")); } catch {}
    res.woo = r.status + (Array.isArray(j) ? ` total=${r.headers.get("x-wp-total")} cur=${j[0]?.prices?.currency_code} mu=${j[0]?.prices?.currency_minor_unit} ex="${j[0]?.name}" ${j[0]?.prices?.price}` : " notjson");
  } catch (e) { res.woo = "ERR " + e.message; }
  await sleep(1500);
  try {
    const r = await fetch(`${base}/products.json?limit=1`, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    const t = await r.text();
    let j = null; try { j = JSON.parse(t); } catch {}
    res.shopify = r.status + (j?.products ? ` ex="${j.products[0]?.title}" ${j.products[0]?.variants?.[0]?.price}` : " notjson");
  } catch (e) { res.shopify = "ERR " + e.message; }
  await sleep(1500);
  try {
    const r = await fetch(base, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    const t = await r.text();
    const gen = (t.match(/<meta name="generator" content="([^"]+)"/i) || [])[1];
    const hints = ["woocommerce", "shopify", "youcan", "prestashop", "wix", "magento", "opencart", "salla", "zid"].filter((k) => t.toLowerCase().includes(k));
    const title = (t.match(/<title[^>]*>([^<]{0,120})/i) || [])[1];
    res.home = `${r.status} final=${r.url} gen=${gen} hints=${hints.join(",")} DA=${/\bDA\b|DZD|د\.ج/.test(t)} title="${title?.trim()}"`;
  } catch (e) { res.home = "ERR " + e.message; }
  console.log(JSON.stringify(res));
  await sleep(1500);
}
