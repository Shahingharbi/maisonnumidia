#!/usr/bin/env node
// Remet les dossiers à jour avec le catalogue actuel SANS changer la composition des lots
// (dossiers.mjs, relancé, redistribuerait toutes les pages et rendrait les sorties caduques).
//
//   node scripts/_seo/titres/rafraichir-dossiers.mjs            (simulation : ce qui changerait)
//   node scripts/_seo/titres/rafraichir-dossiers.mjs --ecrire
//   BRUT=<dossier> pour lire les extractions Search Console ailleurs que dans scripts/_gsc/brut
//
// 1. Fiches déjà en dossier : nom, concentration, contenance, genre, rupture, h1, notes et variantes
//    repris du catalogue (une fiche neuve peut devenir la sœur d'une ancienne : Cool Water Parfum).
// 2. Pages du site sans dossier (fiches ajoutées depuis, page marque d'une maison neuve, page fille
//    qui n'est plus un doublon de sa page marque) : dossiers neufs, au même format, dans un lot
//    final (lot-070, puis lot-071 au-delà de 40 pages).
// Les fiches retirées du catalogue restent dans leur lot : valider.mjs et publier.mjs les écartent.
import fs from "fs";

const ECRIRE = process.argv.includes("--ecrire");
const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const OUT = "scripts/_seo/titres/dossiers";
const BRUT = process.env.BRUT || "scripts/_gsc/brut";

const cat = R("data/products.json");
const produits = cat.products;
const parSlug = new Map(produits.map((p) => [p.slug, p]));

const sansAccent = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const racine = (nom) => sansAccent(nom).split(/[^a-z0-9]+/).filter(Boolean).slice(0, 2).join(" ");
const premierMot = (nom) => sansAccent(nom).split(/[^a-z0-9]+/).filter(Boolean)[0] || "";
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();
const chemin = (u) => { const x = new URL(u); return x.pathname.replace(/\/+$/, "") || "/"; };

// Même calcul que dossiers.mjs
function variantesDe(p) {
  const pm = premierMot(p.name);
  return produits
    .filter((x) => x.slug !== p.slug && x.brandSlug === p.brandSlug && (racine(x.name) === racine(p.name) || (pm.length > 2 && premierMot(x.name) === pm)))
    .slice(0, 8)
    .map((x) => ({ slug: x.slug, nom: x.name, conc: x.concentration, vol: x.volume }));
}
const champsFiche = (p) => ({
  marque: p.brand, nom: p.name, conc: p.concentration, volume: p.volume, genre: p.gender,
  categorie: p.category, enStock: p.inStock, h1: p.h1,
  notes: [...(p.notes?.top || []).slice(0, 2), ...(p.notes?.heart || []).slice(0, 1), ...(p.notes?.base || []).slice(0, 1)],
  variantes: variantesDe(p),
});

// Données Search Console et DataForSEO, si elles sont là (dépôt public : extractions hors git)
let gscDe = () => ({ clics: 0, imp: 0, pos: null, ctr: null }), requetesDe = () => [], partageesDe = () => [];
const brutOk = fs.existsSync(`${BRUT}/pages-A.json`) && fs.existsSync(`${BRUT}/rp-A.json`);
if (brutOk) {
  const gsc = new Map();
  for (const r of R(`${BRUT}/pages-A.json`)) {
    const c = chemin(r.keys[0]);
    const g = gsc.get(c) || { clics: 0, imp: 0, posImp: 0 };
    g.clics += r.clicks; g.imp += r.impressions; g.posImp += r.position * r.impressions;
    gsc.set(c, g);
  }
  gscDe = (c) => {
    const g = gsc.get(c);
    if (!g || !g.imp) return { clics: 0, imp: 0, pos: null, ctr: null };
    return { clics: g.clics, imp: g.imp, pos: +(g.posImp / g.imp).toFixed(1), ctr: +((g.clics / g.imp) * 100).toFixed(1) };
  };
  const parPage = new Map(), parRequete = new Map();
  for (const r of R(`${BRUT}/rp-A.json`)) {
    const q = r.keys[0], c = chemin(r.keys[1]);
    (parPage.get(c) || parPage.set(c, []).get(c)).push({ q, imp: r.impressions, clics: r.clicks, pos: +r.position.toFixed(1) });
    const m = parRequete.get(q) || parRequete.set(q, new Map()).get(q);
    m.set(c, (m.get(c) || 0) + r.impressions);
  }
  requetesDe = (c, n = 12) => (parPage.get(c) || []).sort((a, b) => b.imp - a.imp).slice(0, n);
  partageesDe = (c) => {
    const out = [];
    for (const l of parPage.get(c) || []) {
      const m = parRequete.get(l.q);
      if (!m || m.size < 2) continue;
      const tot = [...m.values()].reduce((s, x) => s + x, 0);
      if (tot < 30 || l.imp / tot < 0.15) continue;
      for (const [autre, imp] of m) if (autre !== c && imp / tot >= 0.15) out.push({ q: l.q, impIci: l.imp, autre, impAutre: imp });
    }
    return out.sort((a, b) => b.impIci + b.impAutre - (a.impIci + a.impAutre)).slice(0, 6);
  };
}
const volumes = R("scripts/_seo/donnees/volumes-catalogue.json");
const volParSlug = new Map(volumes.map((v) => [v.slug, v]));
const ecart = R("scripts/_seo/donnees/ecart-must.json");
const motsClesDe = (c, slug, filtre) => {
  const vu = new Set();
  return ecart
    .filter((e) => e.notreUrl === c || (slug && e.classe === `produit:${slug}`) || (filtre && filtre(e.k)))
    .map((e) => ({ k: e.k, vol: e.v, posMust: e.must, notrePos: e.nous }))
    .filter((x) => !vu.has(x.k) && vu.add(x.k)).sort((x, y) => y.vol - x.vol).slice(0, 8);
};

// 1. Fiches déjà en dossier
const fichiers = fs.readdirSync(OUT).filter((f) => /^lot-\d+\.json$/.test(f)).sort();
const connus = new Set();
const changes = [];
for (const f of fichiers) {
  const lot = R(`${OUT}/${f}`);
  let touche = false;
  for (const d of lot) {
    connus.add(d.chemin);
    if (d.type !== "produit") continue;
    const p = parSlug.get(d.chemin.split("/")[2]);
    if (!p) continue; // fiche fusionnée depuis : écartée par valider.mjs et publier.mjs
    const neuf = champsFiche(p);
    const diff = Object.keys(neuf).filter((k) => JSON.stringify(d[k]) !== JSON.stringify(neuf[k]));
    if (!diff.length) continue;
    changes.push({ lot: f.replace(".json", ""), chemin: d.chemin, champs: diff.map((k) => k === "variantes" ? `variantes (${(d.variantes || []).map((v) => v.slug).join(",")} -> ${neuf.variantes.map((v) => v.slug).join(",")})` : `${k} (${JSON.stringify(d[k])} -> ${JSON.stringify(neuf[k])})`) });
    Object.assign(d, neuf);
    touche = true;
  }
  if (touche && ECRIRE) fs.writeFileSync(`${OUT}/${f}`, JSON.stringify(lot, null, 1));
}

// 2. Pages du site sans dossier
const dansSection = {
  "parfums-homme": (p) => p.gender === "homme" || p.gender === "unisexe",
  "parfums-femme": (p) => p.gender === "femme" || p.gender === "unisexe",
  "parfums-orientaux": (p) => p.category === "parfums-orientaux",
};
const neufs = [];
for (const p of produits) {
  const c = `/parfums/${p.slug}`;
  if (connus.has(c)) continue;
  const v = volParSlug.get(p.slug);
  const { variantes, ...fiche } = champsFiche(p);
  neufs.push({ chemin: c, type: "produit", ...fiche, gsc: gscDe(c), requetes: requetesDe(c), volumeNom: v ? { k: v.requete, vol: v.volume } : null, motsCles: motsClesDe(c, p.slug), variantes, partagees: partageesDe(c) });
}
for (const b of cat.brands) {
  const ps = produits.filter((p) => p.brandSlug === b.slug);
  if (!ps.length) continue;
  const nb = norm(b.name);
  const c = `/marques/${b.slug}`;
  if (!connus.has(c)) {
    const genres = { homme: 0, femme: 0, unisexe: 0 };
    ps.forEach((p) => genres[p.gender]++);
    neufs.push({
      chemin: c, type: "marque", marque: b.name, nbProduits: ps.length, genres,
      oriental: ps.filter((p) => p.category === "parfums-orientaux").length,
      phares: ps.filter((p) => volParSlug.get(p.slug)).sort((x, y) => volParSlug.get(y.slug).volume - volParSlug.get(x.slug).volume).slice(0, 4).map((p) => p.name),
      gsc: gscDe(c), requetes: requetesDe(c),
      motsCles: motsClesDe(c, null, (k) => norm(k).includes(nb) && norm(k).split(" ").length <= nb.split(" ").length + 2),
      partagees: partageesDe(c),
    });
  }
  for (const section of Object.keys(dansSection)) {
    const dans = ps.filter(dansSection[section]);
    if (!dans.length || ps.every(dansSection[section])) continue; // absente ou doublon de la page marque
    const cf = `/${section}/${b.slug}`;
    if (connus.has(cf)) continue;
    neufs.push({
      chemin: cf, type: "fille", section, marque: b.name, nbProduits: dans.length, nbMarque: ps.length,
      phares: dans.filter((p) => volParSlug.get(p.slug)).sort((x, y) => volParSlug.get(y.slug).volume - volParSlug.get(x.slug).volume).slice(0, 3).map((p) => p.name),
      gsc: gscDe(cf), requetes: requetesDe(cf, 8),
      motsCles: motsClesDe(cf, null, (k) => norm(k).includes(nb) && /(homme|femme|oriental|men|women)/.test(k)),
      partagees: partageesDe(cf),
    });
  }
}

console.log(`${changes.length} fiches en dossier mises à jour :`);
for (const c of changes) console.log(`  ${c.lot} ${c.chemin} : ${c.champs.join(" ; ")}`);
console.log(`${neufs.length} pages sans dossier${brutOk ? "" : " (Search Console introuvable : dossiers sans requêtes)"} :`);
for (const d of neufs) console.log(`  ${d.chemin} [${d.type}] ${d.gsc.imp} imp`);

if (ECRIRE && neufs.length) {
  const index = R(`${OUT}/index.json`);
  const dernier = Math.max(...fichiers.map((f) => +f.match(/\d+/)[0]));
  // on n'ajoute jamais une page à un lot existant : nouveaux lots à la suite
  neufs.sort((a, b) => (b.gsc.imp || 0) - (a.gsc.imp || 0));
  for (let i = 0; i * 40 < neufs.length; i++) {
    const lot = neufs.slice(i * 40, (i + 1) * 40);
    const nom = `lot-${String(dernier + 1 + i).padStart(3, "0")}`;
    fs.writeFileSync(`${OUT}/${nom}.json`, JSON.stringify(lot, null, 1));
    index.push({ lot: nom, pages: lot.length, imp: lot.reduce((s, d) => s + (d.gsc.imp || 0), 0), types: [...new Set(lot.map((d) => d.type))] });
    console.log(`écrit ${OUT}/${nom}.json (${lot.length} pages)`);
  }
  fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 1));
}
if (!ECRIRE) console.log("simulation : --ecrire pour mettre les dossiers à jour");
