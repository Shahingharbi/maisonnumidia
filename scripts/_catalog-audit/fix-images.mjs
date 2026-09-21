#!/usr/bin/env node
// Retélécharge les images produit dont l'ID Fragrantica était faux (idStatus "wrong").
// Source : CDN Fragrantica https://fimgs.net/mdimg/perfume/375x500.{ID}.jpg
// SIMULATION par défaut, --apply pour écrire dans public/images/products/.
// L'ancienne image est conservée en .bak avant remplacement.
import fs from "fs";
const APPLY = process.argv.includes("--apply");
const RES = "./scripts/_catalog-audit/results";
const IMG = "./public/images/products";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", Referer: "https://www.fragrantica.com/" };

const cibles = [];
for (const f of fs.readdirSync(RES).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(`${RES}/${f}`, "utf8"));
  if (r.idStatus !== "wrong" || !r.fragrantica?.id || r.confidence === "low") continue;
  cibles.push({ slug: r.slug, id: r.fragrantica.id, url: r.fragrantica.url, conf: r.confidence });
}
console.log(`${cibles.length} images à corriger (ID faux, confiance >= medium)`);
let ok = 0, ko = 0;
for (const c of cibles) {
  const src = `https://fimgs.net/mdimg/perfume/375x500.${c.id}.jpg`;
  if (!APPLY) { console.log(`  [simulation] ${c.slug} <- ${src} (${c.conf})`); continue; }
  try {
    const res = await fetch(src, { headers: H, signal: AbortSignal.timeout(20000) });
    const buf = Buffer.from(await res.arrayBuffer());
    if (!res.ok || buf.length < 3000) { console.log(`  ✗ ${c.slug} : HTTP ${res.status}, ${buf.length} o`); ko++; }
    else {
      const dest = `${IMG}/${c.slug}.jpg`;
      if (fs.existsSync(dest)) fs.copyFileSync(dest, `${dest}.bak`);
      fs.writeFileSync(dest, buf);
      console.log(`  ✓ ${c.slug} (${Math.round(buf.length / 1024)} Ko) <- ID ${c.id}`);
      ok++;
    }
  } catch (e) { console.log(`  ✗ ${c.slug} : ${e.message}`); ko++; }
  await sleep(1200);
}
if (APPLY) console.log(`Terminé : ${ok} images remplacées, ${ko} échecs (anciennes en .bak)`);
