#!/usr/bin/env node
// TEST de faisabilité (lecture seule) : peut-on lire une page parfum Fragrantica à partir de
// l'ID seul, et quelles données sont extractibles ? 1 requête toutes les 6 s, 6 pages max.
import fs from "fs";

const ids = JSON.parse(fs.readFileSync("./scripts/_price-research/fragrantica-ids-from-scripts.json", "utf8"));
const { products } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const sample = ["dior-sauvage", "lattafa-khamrah", "carolina-herrera-212-vip-black", "whisky-silver-evaflor", "hermes-eau-intense-vetiver", "franck-olivier-club-night"].filter((s) => ids[s]);
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const txt = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#039;|&rsquo;/g, "'").replace(/\s+/g, " ").trim();

for (const slug of sample) {
  const p = products.find((x) => x.slug === slug);
  const url = `https://www.fragrantica.com/perfume/x/x-${ids[slug].id}.html`;
  const t0 = Date.now();
  const res = await fetch(url, { headers: H, redirect: "follow" });
  const html = await res.text();
  const title = txt((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]);
  const gender = (title.match(/for (women and men|women|men)/) || [])[1] || null;
  const desc = txt((html.match(/<meta name="description" content="([^"]+)"/) || [])[1]);
  const year = (desc.match(/launched in (\d{4})/) || [])[1] || null;
  const accords = [...html.matchAll(/class="accord-bar"[^>]*>([^<]+)</g)].map((m) => txt(m[1])).slice(0, 6);
  const pyramid = {};
  for (const level of ["Top Notes", "Middle Notes", "Base Notes"]) {
    const i = html.indexOf(`>${level}<`);
    if (i < 0) continue;
    const chunk = html.slice(i, i + 6000).split(/>(Top|Middle|Base) Notes</)[0];
    pyramid[level] = [...new Set([...chunk.matchAll(/<a[^>]*href="[^"]*\/notes\/[^"]*"[^>]*>[\s\S]*?<\/a>/g)].map((m) => txt(m[0])).filter(Boolean))].slice(0, 12);
  }
  const noNotesInPyramid = !Object.keys(pyramid).length;
  const flatNotes = noNotesInPyramid ? (desc.match(/notes? (?:are|is) ([^.]+)\./i) || [])[1] || null : null;
  console.log(`\n[${res.status}] ${slug} -> ${res.url.replace("https://www.fragrantica.com", "")} (${Date.now() - t0} ms, ${Math.round(html.length / 1024)} Ko)`);
  console.log(`  notre fiche : ${p.brand} ${p.name} ${p.concentration} ${p.volume} | notes: ${p.notes.top.join(", ")} / ${p.notes.heart.join(", ")} / ${p.notes.base.join(", ")}`);
  console.log(`  fragrantica : "${title}" | genre: ${gender} | année: ${year} | accords: ${accords.join(", ")}`);
  if (noNotesInPyramid) console.log(`  notes (description): ${flatNotes}`);
  else Object.entries(pyramid).forEach(([k, v]) => console.log(`  ${k}: ${v.join(", ")}`));
  if (/cf-chl|challenge-platform|Just a moment/i.test(html)) console.log("  ⚠ page de challenge Cloudflare détectée");
  await sleep(6000);
}
