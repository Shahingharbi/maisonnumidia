#!/usr/bin/env node
// Télécharge l'image de chaque nouvelle fiche depuis le CDN Fragrantica, à partir de l'ID
// **vérifié** par la recherche (jamais déduit — cf. CLAUDE.md, section Fragrantica).
// SIMULATION par défaut, --apply pour écrire dans public/images/products/.
// Une fiche dont l'image échoue est inutilisable : elle est listée pour être retirée du lot.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const IMG = "./public/images/products";
const fiches = JSON.parse(fs.readFileSync("./scripts/_catalog-add/fiches.json", "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Referer: "https://www.fragrantica.com/",
};

let ok = 0;
const echecs = [];
for (const f of fiches) {
  const dest = `${IMG}/${f.slug}.jpg`;
  if (fs.existsSync(dest)) { ok++; continue; }
  const id = f._source && f._source.fragranticaId;
  if (!id) { echecs.push({ slug: f.slug, why: "pas d'ID vérifié" }); continue; }
  const src = `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
  if (!APPLY) { console.log(`  [simulation] ${f.slug} <- ${src}`); continue; }
  try {
    const res = await fetch(src, { headers: H, signal: AbortSignal.timeout(20000) });
    const buf = Buffer.from(await res.arrayBuffer());
    if (!res.ok || buf.length < 3000) {
      echecs.push({ slug: f.slug, why: `HTTP ${res.status}, ${buf.length} octets` });
      console.log(`  x ${f.slug} : HTTP ${res.status}, ${buf.length} o`);
    } else {
      fs.writeFileSync(dest, buf);
      console.log(`  ok ${f.slug} (${Math.round(buf.length / 1024)} Ko) <- ID ${id}`);
      ok++;
    }
  } catch (e) {
    echecs.push({ slug: f.slug, why: e.message });
    console.log(`  x ${f.slug} : ${e.message}`);
  }
  await sleep(1200);
}

fs.writeFileSync("./scripts/_catalog-add/images-echecs.json", JSON.stringify(echecs, null, 1));
console.log(`${APPLY ? "TÉLÉCHARGÉ" : "SIMULATION"} — ${ok} images en place, ${echecs.length} échecs`);
if (echecs.length) console.log("fiches à retirer du lot (pas d'image) : " + echecs.map((e) => e.slug).join(", "));
