#!/usr/bin/env node
// Prépare un dossier par page pour le choix des titres : ce que les gens tapent pour arriver
// sur la page (Search Console, 90 jours), les volumes de recherche (DataForSEO, Google Algérie),
// les versions voisines à ne pas confondre, et les requêtes partagées avec une autre page.
//
//   node scripts/_seo/titres/dossiers.mjs
//
// Sortie : scripts/_seo/titres/dossiers/lot-NNN.json (40 pages par lot) + index.json.
// Les pages marque filtrées en doublon (canonique vers /marques/x) n'y sont pas : leur titre est
// calculé directement (voir lib/titres.ts).
import fs from "fs";

const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const OUT = "scripts/_seo/titres/dossiers";
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(`${OUT}/${f}`);

const cat = R("data/products.json");
const produits = cat.products;
const marques = new Map(cat.brands.map((b) => [b.slug, b]));
const pagesA = R("scripts/_gsc/brut/pages-A.json");
const rpA = R("scripts/_gsc/brut/rp-A.json");
const volumes = R("scripts/_seo/donnees/volumes-catalogue.json");
const ecart = R("scripts/_seo/donnees/ecart-must.json");
const ranked = R("scripts/_gsc/brut/dfs/ranked-nous.json");

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();
const chemin = (u) => { const x = new URL(u); return x.pathname.replace(/\/+$/, "") || "/"; };

// Search Console, par chemin (www fusionné : il redirige vers l'apex)
const gsc = new Map();
for (const r of pagesA) {
  const c = chemin(r.keys[0]);
  const g = gsc.get(c) || { clics: 0, imp: 0, posImp: 0 };
  g.clics += r.clicks; g.imp += r.impressions; g.posImp += r.position * r.impressions;
  gsc.set(c, g);
}
const gscDe = (c) => {
  const g = gsc.get(c);
  if (!g || !g.imp) return { clics: 0, imp: 0, pos: null, ctr: null };
  return { clics: g.clics, imp: g.imp, pos: +(g.posImp / g.imp).toFixed(1), ctr: +((g.clics / g.imp) * 100).toFixed(1) };
};

// Requêtes par page, et répartition de chaque requête entre pages
const parPage = new Map();
const parRequete = new Map();
for (const r of rpA) {
  const q = r.keys[0], c = chemin(r.keys[1]);
  const l = { q, imp: r.impressions, clics: r.clicks, pos: +r.position.toFixed(1) };
  (parPage.get(c) || parPage.set(c, []).get(c)).push(l);
  const m = parRequete.get(q) || parRequete.set(q, new Map()).get(q);
  m.set(c, (m.get(c) || 0) + r.impressions);
}
const requetesDe = (c, n = 12) => (parPage.get(c) || []).sort((a, b) => b.imp - a.imp).slice(0, n);
function partageesDe(c) {
  const out = [];
  for (const l of parPage.get(c) || []) {
    const m = parRequete.get(l.q);
    if (!m || m.size < 2) continue;
    const tot = [...m.values()].reduce((s, x) => s + x, 0);
    if (tot < 30 || l.imp / tot < 0.15) continue;
    for (const [autre, imp] of m) if (autre !== c && imp / tot >= 0.15) out.push({ q: l.q, impIci: l.imp, autre, impAutre: imp });
  }
  return out.sort((a, b) => b.impIci + b.impAutre - (a.impIci + a.impAutre)).slice(0, 6);
}

const volParSlug = new Map(volumes.map((v) => [v.slug, v]));
const motsClesDe = (c, slug, filtre) => {
  const a = ecart
    .filter((e) => e.notreUrl === c || (slug && e.classe === `produit:${slug}`) || (filtre && filtre(e.k)))
    .map((e) => ({ k: e.k, vol: e.v, posMust: e.must, notrePos: e.nous }));
  const b = ranked.filter((r) => r.url === c).map((r) => ({ k: r.k, vol: r.v, notrePos: r.pos }));
  const vu = new Set();
  return [...a, ...b].filter((x) => !vu.has(x.k) && vu.add(x.k)).sort((x, y) => y.vol - x.vol).slice(0, 8);
};

const sansAccent = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const racine = (nom) => sansAccent(nom).split(/[^a-z0-9]+/).filter(Boolean).slice(0, 2).join(" ");
const premierMot = (nom) => sansAccent(nom).split(/[^a-z0-9]+/).filter(Boolean)[0] || "";

const dossiers = [];

// Fiches produit
for (const p of produits) {
  const c = `/parfums/${p.slug}`;
  const pm = premierMot(p.name);
  const variantes = produits
    .filter((x) => x.slug !== p.slug && x.brandSlug === p.brandSlug && (racine(x.name) === racine(p.name) || (pm.length > 2 && premierMot(x.name) === pm)))
    .slice(0, 8)
    .map((x) => ({ slug: x.slug, nom: x.name, conc: x.concentration, vol: x.volume }));
  const v = volParSlug.get(p.slug);
  dossiers.push({
    chemin: c, type: "produit",
    marque: p.brand, nom: p.name, conc: p.concentration, volume: p.volume, genre: p.gender,
    categorie: p.category, enStock: p.inStock, h1: p.h1,
    notes: [...(p.notes?.top || []).slice(0, 2), ...(p.notes?.heart || []).slice(0, 1), ...(p.notes?.base || []).slice(0, 1)],
    gsc: gscDe(c), requetes: requetesDe(c), volumeNom: v ? { k: v.requete, vol: v.volume } : null,
    motsCles: motsClesDe(c, p.slug), variantes, partagees: partageesDe(c),
  });
}

// Pages marque et pages filles (sauf doublons, canonisées vers la page marque)
const dansSection = {
  "parfums-homme": (p) => p.gender === "homme" || p.gender === "unisexe",
  "parfums-femme": (p) => p.gender === "femme" || p.gender === "unisexe",
  "parfums-orientaux": (p) => p.category === "parfums-orientaux",
};
for (const b of cat.brands) {
  const ps = produits.filter((p) => p.brandSlug === b.slug);
  if (!ps.length) continue;
  const nb = norm(b.name);
  const c = `/marques/${b.slug}`;
  const genres = { homme: 0, femme: 0, unisexe: 0 };
  ps.forEach((p) => genres[p.gender]++);
  dossiers.push({
    chemin: c, type: "marque", marque: b.name, nbProduits: ps.length, genres,
    oriental: ps.filter((p) => p.category === "parfums-orientaux").length,
    phares: ps.filter((p) => volParSlug.get(p.slug)).sort((x, y) => volParSlug.get(y.slug).volume - volParSlug.get(x.slug).volume).slice(0, 4).map((p) => p.name),
    gsc: gscDe(c), requetes: requetesDe(c),
    motsCles: motsClesDe(c, null, (k) => norm(k).includes(nb) && norm(k).split(" ").length <= nb.split(" ").length + 2),
    partagees: partageesDe(c),
  });
  for (const section of Object.keys(dansSection)) {
    const dans = ps.filter(dansSection[section]);
    if (!dans.length) continue;
    if (section !== "parfums-orientaux" && dans.length === 0) continue;
    if (ps.every(dansSection[section])) continue; // doublon de la page marque
    const cf = `/${section}/${b.slug}`;
    dossiers.push({
      chemin: cf, type: "fille", section, marque: b.name, nbProduits: dans.length, nbMarque: ps.length,
      phares: dans.filter((p) => volParSlug.get(p.slug)).sort((x, y) => volParSlug.get(y.slug).volume - volParSlug.get(x.slug).volume).slice(0, 3).map((p) => p.name),
      gsc: gscDe(cf), requetes: requetesDe(cf, 8),
      motsCles: motsClesDe(cf, null, (k) => norm(k).includes(nb) && /(homme|femme|oriental|men|women)/.test(k)),
      partagees: partageesDe(cf),
    });
  }
}

// Pages à part : accueil, catégories, index, articles, pages de service (lot « speciaux »)
const blog = fs.readFileSync("data/blog.ts", "utf8");
const articles = [...blog.matchAll(/slug:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",\s*\n\s*metaTitle:\s*"([^"]+)"/g)].map((m) => ({ slug: m[1], h1: m[2], titreActuel: m[3] }));
const speciaux = [
  { chemin: "/", type: "accueil" },
  { chemin: "/parfums-homme", type: "mere", section: "homme" },
  { chemin: "/parfums-femme", type: "mere", section: "femme" },
  { chemin: "/parfums-orientaux", type: "mere", section: "oriental" },
  { chemin: "/marques", type: "index" },
  { chemin: "/blog", type: "index" },
  { chemin: "/livraison", type: "service" },
  { chemin: "/parfum-algerie", type: "service" },
  { chemin: "/contact", type: "service" },
  { chemin: "/a-propos", type: "service" },
  ...articles.map((a) => ({ chemin: `/blog/${a.slug}`, type: "article", h1: a.h1, titreActuel: a.titreActuel })),
].map((d) => ({ ...d, gsc: gscDe(d.chemin), requetes: requetesDe(d.chemin, 15), motsCles: motsClesDe(d.chemin, null, null), partagees: partageesDe(d.chemin) }));
fs.writeFileSync(`${OUT}/speciaux.json`, JSON.stringify(speciaux, null, 1));
console.log(speciaux.length, "pages à part (speciaux.json),", articles.length, "articles");

// Lots de 40, triés par impressions décroissantes (les pages qui pèsent passent en premier)
dossiers.sort((a, b) => (b.gsc.imp || 0) - (a.gsc.imp || 0));
const TAILLE = 40;
const index = [];
for (let i = 0; i * TAILLE < dossiers.length; i++) {
  const lot = dossiers.slice(i * TAILLE, (i + 1) * TAILLE);
  const nom = `lot-${String(i + 1).padStart(3, "0")}`;
  fs.writeFileSync(`${OUT}/${nom}.json`, JSON.stringify(lot, null, 1));
  index.push({ lot: nom, pages: lot.length, imp: lot.reduce((s, d) => s + (d.gsc.imp || 0), 0), types: [...new Set(lot.map((d) => d.type))] });
}
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 1));
const t = {}; dossiers.forEach((d) => (t[d.type] = (t[d.type] || 0) + 1));
console.log(dossiers.length, "pages", t, index.length, "lots");
