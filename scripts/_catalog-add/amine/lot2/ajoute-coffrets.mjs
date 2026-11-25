#!/usr/bin/env node
// Stock Amine, lot 2 (25/11/2026) : les deux coffrets reçus, ajoutés à lot2/fiches.json.
// À lancer après corrige-lot2.mjs (qui réécrit fiches.json). Idempotent.
//   node scripts/_catalog-add/amine/lot2/ajoute-coffrets.mjs
//
// Un coffret n'a pas de page Fragrantica : son existence et sa composition sont prouvées par des
// fiches revendeurs (lot2/recherche/*.json, relues par un contre-vérificateur). Le parfum est celui
// de la fiche flacon déjà en ligne : notes, famille, saisons et occasions en sont reprises telles
// quelles, rien n'est inventé.
//
// - Cerruti 1881 pour Femme : eau de toilette 50 ml + lotion parfumée pour le corps 75 ml.
//   Boîte reçue = emballage « patchwork » (photo de Shahin du 25/11, comparée aux packshots) ;
//   photo : my-origines 18011181_P.jpg, même emballage. Prix : médiane 13 000 DA (Briki 12 500,
//   Parfum Deluxe 13 500, relus le 25/11) passée dans prixDeVente() = 16 000 DA.
// - Lolita Lempicka Au Masculin : eau de toilette 100 ml + gel douche tonique 75 ml
//   (CosmoStore SKU 145469, Notino LOL0026). Deux boîtes existent pour ce même contenu : la photo
//   montre le flacon et le tube sans la boîte (Notino), juste dans les deux cas. Aucun prix de
//   marché actuel (coffret arrêté) : prix provisoire juste au-dessus du prix fournisseur (15 000 DA),
//   à confirmer par Shahin.
import fs from "fs";
import { prixDeVente } from "../../../_price-research/regle-prix.mjs";

const D = "./scripts/_catalog-add/amine/lot2/";
const fiches = JSON.parse(fs.readFileSync(D + "fiches.json", "utf8"));
const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const P = new Map(cat.products.map((p) => [p.slug, p]));

function coffret(slug, flacon, champs, source) {
  const f = P.get(flacon);
  if (!f) throw new Error("fiche flacon absente : " + flacon);
  const base = {
    id: slug, slug, brand: f.brand, brandSlug: f.brandSlug, gender: f.gender, category: f.category,
    family: f.family, concentration: f.concentration, notes: f.notes, occasions: f.occasions, seasons: f.seasons,
    longevity: f.longevity, sillage: f.sillage, image: `/images/products/${slug}.jpg`, originalPrice: null,
    shortDescription: null, description: null, inStock: true, featured: false, badge: null,
    isOriental: f.category === "parfums-orientaux",
    _source: { ...source, ficheFlacon: flacon, slugCandidat: slug },
  };
  const i = fiches.findIndex((x) => x.slug === slug);
  const fiche = { ...base, ...champs };
  if (i >= 0) fiches[i] = { ...fiche, shortDescription: fiches[i].shortDescription, description: fiches[i].description };
  else fiches.push(fiche);
}

coffret("coffret-cerruti-1881-femme", "cerruti-1881-femme", {
  name: "1881 pour Femme Coffret",
  h1: "Coffret Cerruti 1881 pour Femme Algérie",
  volume: "50ml",
  price: prixDeVente(13000),
  related: ["cerruti-1881-femme", "cerruti-1881-homme", "cacharel-anais-anais"],
  composition: "eau de toilette 1881 pour Femme 50 ml (vaporisateur) + lotion parfumée pour le corps 1881 pour Femme 75 ml",
}, {
  photo: "https://www.my-origines.com/dw/image/v2/BJRD_PRD/on/demandware.static/-/Sites-base-master/default/dwa946f951/images/18011181_P.jpg",
  composition: ["https://briki-parfums.com/coffrets/coffrets-femmes/coffret-cerruti-1881-pour-femme/", "https://parfumdeluxedz.com/products/cerruti-1881-coffret-eau-de-toilette-pour-femme-50ml-lait-corps-75ml"],
  prix: "médiane 13 000 DA (Briki 12 500, Parfum Deluxe 13 500)",
  prixAmine: 11000,
});

coffret("coffret-lolita-lempicka-au-masculin", "lolita-lempicka-au-masculin", {
  name: "Au Masculin Coffret",
  h1: "Coffret Lolita Lempicka Au Masculin Algérie",
  volume: "100ml",
  price: 16500,
  related: ["lolita-lempicka-au-masculin", "lolita-lempicka", "joop-homme"],
  composition: "eau de toilette Au Masculin 100 ml (vaporisateur) + gel douche tonique Au Masculin 75 ml",
}, {
  photo: "https://cdn.notinoimg.com/detail_main_hq/lolita-lempicka/lolmasm_cset20_04/au-masculin___150505.jpg",
  composition: ["https://www.cosmostore.org/catalog/product/o_maskulin_nabor_tualetnaya_voda_sprey_100ml_34unts___toniziruy", "https://www.notino.fr/lolita-lempicka/au-masculin-coffret-cadeau-ii/"],
  prix: "provisoire : aucun prix de marché actuel, juste au-dessus du prix fournisseur (15 000 DA), à confirmer",
  prixAmine: 15000,
});

for (const f of fiches) {
  const t = D + "texts/" + f.slug + ".json";
  if (!f.description && fs.existsSync(t)) {
    const x = JSON.parse(fs.readFileSync(t, "utf8"));
    f.shortDescription = x.shortDescription;
    f.description = x.description;
  }
}
fs.writeFileSync(D + "fiches.json", JSON.stringify(fiches, null, 1));
console.log(fiches.map((f) => `${f.slug} | ${f.h1} | ${f.concentration} ${f.volume} | ${f.price} DA | texte ${f.description ? "oui" : "non"}`).join("\n"));
