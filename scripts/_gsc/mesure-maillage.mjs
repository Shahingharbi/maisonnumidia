#!/usr/bin/env node
// Compte les liens internes sortants de chaque type de page, par destination.
// Sert à confronter le maillage réel au modèle voulu : collections mères reliées entre
// elles, collections filles rattachées à une seule mère et reliées entre elles, et
// des liens produits/articles mesurés plutôt qu'abondants.
//
// Lance le serveur de dev avant (port 3000).
const BASE = process.env.BASE || "http://localhost:3000";

const PAGES = [
  ["accueil", "/"],
  ["mère : parfums-femme", "/parfums-femme"],
  ["mère : parfums-homme", "/parfums-homme"],
  ["mère : parfums-orientaux", "/parfums-orientaux"],
  ["fille : parfums-femme/dior", "/parfums-femme/dior"],
  ["fille : parfums-homme/dior", "/parfums-homme/dior"],
  ["hub marque : /marques/dior", "/marques/dior"],
  ["liste marques : /marques", "/marques"],
  ["produit : black-opium-ysl", "/parfums/black-opium-ysl"],
  ["produit : kayali-eden", "/parfums/kayali-eden"],
  ["article : meilleur-parfum-femme", "/blog/meilleur-parfum-femme"],
  ["plan du site", "/plan-du-site"],
];

const TYPES = [
  ["catégorie (mère)", /^\/parfums-(homme|femme|orientaux)$/],
  ["marque filtrée (fille)", /^\/parfums-(homme|femme|orientaux)\/[a-z0-9-]+$/],
  ["hub marque", /^\/marques\/[a-z0-9-]+$/],
  ["produit", /^\/parfums\/[a-z0-9-]+$/],
  ["article", /^\/blog\/[a-z0-9-]+$/],
  ["autre", /.*/],
];

function classe(href) {
  for (const [nom, re] of TYPES) if (re.test(href)) return nom;
  return "autre";
}

console.log("liens internes sortants, par page\n");
console.log("page".padEnd(34) + "total" + "  mère" + " fille" + "   hub" + " prod." + "  art." + " autre");

for (const [nom, url] of PAGES) {
  let html;
  try {
    const res = await fetch(BASE + url, { signal: AbortSignal.timeout(120000) });
    if (!res.ok) { console.log(nom.padEnd(34) + " HTTP " + res.status); continue; }
    html = await res.text();
  } catch (e) {
    console.log(nom.padEnd(34) + " injoignable (" + e.message + ")");
    continue;
  }

  // Liens uniques : c'est le maillage qui compte, pas le nombre d'ancres.
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1].replace(/\/$/, "") || "/");
  const uniques = [...new Set(hrefs)].filter((h) => h !== url && !h.startsWith("/_next"));

  const parType = {};
  uniques.forEach((h) => { const c = classe(h); parType[c] = (parType[c] || 0) + 1; });

  console.log(
    nom.padEnd(34) +
    String(uniques.length).padStart(5) +
    String(parType["catégorie (mère)"] || 0).padStart(6) +
    String(parType["marque filtrée (fille)"] || 0).padStart(6) +
    String(parType["hub marque"] || 0).padStart(6) +
    String(parType["produit"] || 0).padStart(6) +
    String(parType["article"] || 0).padStart(6) +
    String(parType["autre"] || 0).padStart(6)
  );
}
