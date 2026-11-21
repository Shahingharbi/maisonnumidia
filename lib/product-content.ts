import type { Product } from "@/lib/types";
import { formatPrice, getDistinctiveNotes } from "@/lib/products";
import { fourchetteLivraison } from "@/lib/livraison";

/**
 * Section prix. C'est la première chose que cherche l'internaute : « prix » apparaît dans
 * 28 793 impressions sur les fiches produit en 16 mois, plus que n'importe quel autre mot
 * ajouté au nom du parfum. Le texte doit donc donner le prix, la contenance, ce que le prix
 * inclut et ce qu'il n'inclut pas — pas tourner autour.
 */
export function generatePriceSection(
  product: Product,
  stats: { min: number; max: number; mediane: number; nombre: number } | null,
  versions: Product[]
): string {
  const base = `${product.brand} ${product.name} est proposé à ${formatPrice(product.price)} chez Maison Numidia, en ${product.concentration} ${product.volume}.`;

  let situation = "";
  if (stats && stats.nombre >= 5) {
    const cote = product.price < stats.mediane ? "en dessous" : product.price > stats.mediane ? "au-dessus" : "au niveau";
    situation = ` Sur les ${stats.nombre} parfums ${product.brand} du catalogue, qui vont de ${formatPrice(stats.min)} à ${formatPrice(stats.max)}, il se situe ${cote} du milieu de gamme de la maison.`;
  }

  let echelle = "";
  if (versions.length > 1) {
    const moinsCher = versions[0];
    const plusCher = versions[versions.length - 1];
    echelle = moinsCher.slug === plusCher.slug
      ? ""
      : ` La ligne complète s'étale de ${formatPrice(moinsCher.price)} pour ${moinsCher.name} à ${formatPrice(plusCher.price)} pour ${plusCher.name} : le tableau plus bas détaille ce qui sépare chaque version.`;
  }

  // Une phrase courte : ce paragraphe se répétait mot pour mot sur les 2 328 fiches (mesure du
  // 21/11/2026 : 46 à 63 % du texte d'une fiche était identique aux autres fiches). Le détail
  // des frais vit sur /livraison et dans la FAQ.
  const livraison = ` Livraison Yalidine en plus, selon la wilaya ; paiement à la livraison.`;

  return base + situation + echelle + livraison;
}

/**
 * Section « quelle version choisir ». Les requêtes qui citent une déclinaison (Intense,
 * Elixir, Extrême, Neon…) totalisent 38 588 impressions et c'est la position la plus
 * faible du site (9,2 en moyenne) : personne n'explique la différence, nous non plus.
 * Le texte s'appuie sur les notes réellement enregistrées, jamais sur une impression.
 */
export function generateVersionsSection(product: Product, versions: Product[]): string {
  if (versions.length < 2) return "";

  const autres = versions.filter((v) => v.slug !== product.slug);
  const racine = versions.reduce((a, b) => (a.name.length <= b.name.length ? a : b));
  const intro = `Maison Numidia distribue ${versions.length} versions de cette ligne. Elles partagent la même signature — celle de ${racine.name} — mais aucune ne sent tout à fait comme les autres : la concentration change, et surtout les notes ajoutées à la formule d'origine.`;

  // Le tableau juste en dessous donne deja les notes qui separent chaque version :
  // ce paragraphe explique comment le lire, il ne le recopie pas.
  const propre = getDistinctiveNotes(product, versions);
  const laVotre = propre.length
    ? ` Celle que vous consultez est la seule de notre catalogue à porter ${propre.slice(0, 3).join(", ").toLowerCase()} : c'est ce qui la sépare de ses voisines.`
    : ` Celle que vous consultez est la formule de référence, celle dont les autres sont des variations.`;

  const concentrations = [...new Set(versions.map((v) => v.concentration))];
  const lecture = concentrations.length > 1
    ? ` La ligne existe en ${concentrations.join(", ")} : plus la concentration est élevée, plus le parfum se fait dense et proche de la peau, là où une eau de toilette s'ouvre plus franchement et se réapplique sans y penser.`
    : ` Toutes les versions sont proposées dans la même concentration : la différence se joue uniquement sur les notes ajoutées à la formule.`;

  const volumes = [...new Set(versions.map((v) => v.volume))];
  const contenance = volumes.length === 1
    ? ` Toutes sont vendues en ${volumes[0]}, donc les prix du tableau se comparent directement.`
    : ` Les contenances diffèrent d'une version à l'autre : c'est à regarder avant de comparer les prix.`;

  return intro + laVotre + lecture + contenance;
}

function familyContext(family: string): string {
  const f = family.toLowerCase();
  if (f.includes("boisé") && f.includes("aromatique"))
    return "Les parfums boisés aromatiques mêlent la fraîcheur des herbes aromatiques (lavande, romarin, sauge) à la profondeur des bois nobles. Cette construction donne un parfum à la fois énergique en ouverture et chaleureux en fond.";
  if (f.includes("boisé") && f.includes("épicé"))
    return "La famille boisée épicée combine la noblesse des bois (cèdre, vétiver, santal) avec des épices chaudes (poivre noir, cardamome, cannelle). Le résultat est un parfum riche et complexe, parfait pour le caractère.";
  if (f.includes("gourmand"))
    return "Les gourmands jouent sur des matières comestibles — café, vanille, caramel, praliné, cacao. C'est une famille récente, née dans les années 1990, qui assume le sucré sans tomber dans le dessert quand un fond boisé ou résineux vient la tenir.";
  if (f.includes("oriental") && f.includes("épicé"))
    return "Les orientaux épicés sont une signature emblématique de la parfumerie arabe et indienne. Ils marient des épices chaudes à des résines précieuses (encens, myrrhe), pour une fragrance profonde et envoûtante.";
  if (f.includes("oriental") && f.includes("vanillé"))
    return "Les orientaux vanillés mélangent la douceur réconfortante de la vanille aux notes orientales chaudes (ambre, benjoin, fève tonka). Une famille gourmande et sensuelle, particulièrement appréciée le soir.";
  if (f.includes("oriental"))
    return "La famille orientale est l'une des plus anciennes et des plus prestigieuses de la parfumerie. Elle se caractérise par des notes profondes d'ambre, de musc, de résines et d'épices, héritées des routes parfumées de l'Arabie et de l'Inde.";
  if (f.includes("floral") && f.includes("fruit"))
    return "Les floraux fruités combinent la délicatesse des fleurs (rose, jasmin, pivoine) à la gourmandise des fruits (cassis, poire, pêche). C'est l'une des familles les plus populaires en parfumerie féminine moderne.";
  if (f.includes("floral") && f.includes("poudré"))
    return "Les floraux poudrés enveloppent les fleurs dans une texture douce et veloutée (iris, héliotrope, violette). Cette famille évoque l'élégance discrète des grandes parfumeries françaises.";
  if (f.includes("floral"))
    return "Les parfums floraux sont la grande famille de la parfumerie féminine. Ils déclinent toutes les facettes des fleurs, de la rose puissante au jasmin solaire, en passant par le muguet ou la fleur d'oranger.";
  if (f.includes("aquatique") || f.includes("frais"))
    return "Les parfums aquatiques et frais évoquent l'air marin, les notes d'agrumes et la fraîcheur d'une rosée matinale. Une famille moderne, particulièrement adaptée aux climats chauds comme l'été algérien.";
  if (f.includes("chypré"))
    return "La famille chyprée est un classique intemporel : son accord bergamote, mousse de chêne, ciste et patchouli construit un parfum élégant, sophistiqué et à la signature reconnaissable.";
  if (f.includes("fougère"))
    return "La famille fougère, structurée autour de la lavande, du géranium, de la mousse et de la coumarine, est l'une des plus utilisées en parfumerie masculine pour son caractère raffiné et propre.";
  if (f.includes("musc") || f.includes("ambré"))
    return "Les parfums musqués et ambrés sont parmi les plus addictifs de la parfumerie. Le musc apporte une douceur peau, l'ambre une chaleur dorée — deux ingrédients piliers de la parfumerie orientale.";
  if (f.includes("cuir"))
    return "Les parfums cuirés sont une famille noble et virile, longtemps réservée aux signatures masculines. Le cuir donne un caractère brut et élégant, souvent allié à des notes fumées ou tabac.";
  return `La famille ${family.toLowerCase()} se distingue par une signature olfactive unique, construite autour de matières premières soigneusement sélectionnées et équilibrées par le parfumeur.`;
}

// Ces repères décrivent la CLASSE de concentration (norme du métier), pas une mesure faite
// sur ce flacon : la formulation doit rester générale, sinon on affirme au client une tenue
// qu'on n'a jamais vérifiée (CLAUDE.md : ne jamais inventer de longévité).
// Une phrase, pas un paragraphe : l'explication complète des concentrations est dans l'article
// /blog/eau-de-parfum-vs-eau-de-toilette (lié depuis la fiche). Le paragraphe long se répétait
// sur 62 % des fiches (toutes les EDP) au 21/11/2026.
function concentrationContext(concentration: string): string {
  const c = concentration.toUpperCase();
  if (c.startsWith("PARFUM") || c.startsWith("EXTRAIT"))
    return "Concentration la plus élevée de la parfumerie : un format dense, qu'on dose à une vaporisation.";
  if (c.startsWith("EDP"))
    return "En eau de parfum, la formule est plus concentrée qu'en eau de toilette : elle se pose plus près de la peau et dure davantage.";
  if (c.startsWith("EDT"))
    return "En eau de toilette, la formule est plus légère qu'en eau de parfum : plus aérienne, faite pour la journée et la chaleur.";
  if (c === "EDC" || c === "COLOGNE")
    return "Une eau de Cologne : la concentration la plus légère, qui s'applique généreusement pour un effet de fraîcheur immédiat.";
  return `La concentration ${concentration} règle la tenue et l'intensité du parfum sur la peau.`;
}

// Échelle interne 1-5 de products.json : elle sert à qualifier, jamais à annoncer un nombre
// d'heures — aucune de ces valeurs ne vient d'une mesure.
function longevityLabelOf(longevity: number): string {
  if (longevity >= 5) return "très longue";
  if (longevity === 4) return "longue";
  if (longevity === 3) return "bonne";
  return "modérée";
}

/**
 * Famille olfactive et comportement sur la peau.
 *
 * Cette fonction n'enumere PAS les notes : la pyramide est affichee en haut de la fiche et
 * la description redigee les commente deja. Les repeter une troisieme fois gonflait le nombre
 * de mots sans rien apprendre au lecteur.
 */
export function generateFamilyAndFeel(product: Product): string {
  const famille = product.family || "";
  const sillage = product.sillage ?? 3;
  const sillageLabel =
    sillage >= 5
      ? "capable de marquer une pièce"
      : sillage === 4
      ? "généreux, bien perceptible autour de soi"
      : sillage === 3
      ? "présent sans être envahissant"
      : "discret, proche de la peau";

  const surPeau = `Sur la peau, la tenue est ${longevityLabelOf(product.longevity ?? 3)} et le sillage ${sillageLabel}.`;
  // Le paragraphe sur le climat algérien (identique sur toutes les fiches d'une catégorie) est
  // retiré le 21/11/2026 : il n'apprenait rien sur CE parfum et gonflait le texte commun.
  return `${familyContext(famille)} ${surPeau}`;
}

export function generateConcentrationSection(product: Product, versions: Product[]): string {
  const ml = parseInt(String(product.volume).replace(/[^0-9]/g, ""), 10);
  const intro = concentrationContext(product.concentration);
  const auMl = Number.isFinite(ml) && ml > 0
    ? ` Ce flacon de ${product.volume} revient à ${Math.round(product.price / ml)} DA le millilitre.`
    : "";

  // Le prix au millilitre ne dit quelque chose que si les contenances different.
  // Quand toute la ligne est en 90 ml, comparer le prix au ml revient a comparer les prix :
  // autant le dire simplement.
  const autres = versions
    .filter((v) => v.slug !== product.slug)
    .map((v) => ({ v, ml: parseInt(String(v.volume).replace(/[^0-9]/g, ""), 10) }))
    .filter((x) => Number.isFinite(x.ml) && x.ml > 0);
  const volumesDifferents = autres.some((x) => x.ml !== ml);

  let comparaison = "";
  if (volumesDifferents && Number.isFinite(ml) && ml > 0) {
    const meilleur = autres
      .map((x) => ({ ...x, parMl: x.v.price / x.ml }))
      .sort((a, b) => a.parMl - b.parMl)[0];
    comparaison = meilleur.parMl < product.price / ml
      ? ` Dans la même ligne, ${meilleur.v.name} revient à ${Math.round(meilleur.parMl)} DA le millilitre dans son format ${meilleur.v.volume} : le flacon coûte plus cher à l'achat, mais chaque vaporisation revient moins cher.`
      : ` C'est le format le plus avantageux de la ligne au millilitre.`;
  }

  return intro + auMl + comparaison;
}

export function generatePersona(product: Product): string {
  const occasions = product.occasions?.length ? product.occasions.join(", ").toLowerCase() : "le quotidien";
  const saisons = product.seasons?.length ? product.seasons.join(" et ").toLowerCase() : "toute l'année";
  const t = `${product.family} ${[...product.notes.top, ...product.notes.heart, ...product.notes.base].join(" ")}`.toLowerCase();

  const chaud = /oud|vanille|ambre|gourmand|épice|cuir|tabac|résine|encens|café|caramel/.test(t);
  const frais = /agrume|aquatique|marin|citron|bergamote|menthe|vert|thé/.test(t);

  const conseil = chaud && !frais
    ? "Une vaporisation suffit le plus souvent : ces compositions gagnent à être dosées court, et elles tiennent mieux sur un vêtement que sur une peau sèche."
    : frais && !chaud
    ? "Ce type de composition s'évapore vite à la chaleur : appliquez le matin sur une peau hydratée, et gardez le flacon à portée pour une seconde vaporisation en cours de journée."
    : "Deux vaporisations au creux du cou suffisent : la zone est chaude, elle diffuse sans que le parfum devienne envahissant.";

  // Les occasions viennent d'une liste de libelles ("Soirée", "Occasions spéciales") :
  // les couler dans une phrase demanderait un article par item. On les presente telles quelles.
  const cadre = `Les moments où il est le plus à sa place : ${occasions}. Côté saison, il donne le meilleur en ${saisons}.`;

  return `${cadre} ${conseil}`;
}

/**
 * FAQ. Trois questions, pas huit : sur 16 mois, les requetes qui atterrissent sur une fiche
 * portent sur le prix (28 793 impressions), la declinaison (38 588) et l'authenticite (697).
 * Celles sur la tenue ou les avis n'existent quasiment pas — les poser ici ne sert personne.
 */
export function generateFAQ(product: Product, versions: Product[] = []): { q: string; a: string }[] {
  const autres = versions.filter((v) => v.slug !== product.slug);
  const questions: { q: string; a: string }[] = [];

  // La reponse doit contenir le chiffre, pas renvoyer vers « le prix affiche en haut de page » :
  // c'est la condition pour etre repris en position zero ou dans les « Autres questions posees ».
  // Le montant n'est pas ecrit en dur : il vient de products.json et se regenere a chaque build,
  // donc il ne peut pas se perimer dans le code. Le meme texte alimente le balisage FAQPage.
  const dispo = product.inStock
    ? ""
    : ` Ce parfum est actuellement en rupture : la marque ne le produit plus ou il n'est plus approvisionnable en Algérie.`;
  questions.push({
    q: `Combien coûte ${product.brand} ${product.name} en Algérie ?`,
    a: `${product.brand} ${product.name} ${product.concentration} ${product.volume} coûte ${formatPrice(product.price)} chez Maison Numidia.${dispo} Livraison Yalidine en plus : de ${formatPrice(fourchetteLivraison().min)} à ${formatPrice(fourchetteLivraison().max)} selon la wilaya, à domicile ou au bureau, et paiement à la livraison.`,
  });

  if (autres.length) {
    const comparee = autres[0];
    const d = getDistinctiveNotes(comparee, versions);
    const ecart = d.length
      ? `pousse la formule vers ${d.slice(0, 2).join(" et ").toLowerCase()}`
      : `reprend la même construction dans une autre concentration`;
    questions.push({
      q: `Quelle différence entre ${product.name} et ${comparee.name} ?`,
      a: `${product.name} est une ${product.concentration} ${product.volume} à ${formatPrice(product.price)} ; ${comparee.name} est une ${comparee.concentration} ${comparee.volume} à ${formatPrice(comparee.price)} et ${ecart}. Une concentration plus élevée ne rend pas le parfum « meilleur » : elle le rend plus dense et plus proche de la peau, là où une eau de toilette s'ouvre plus franchement. Le tableau plus haut sur cette page compare les ${versions.length} déclinaisons que nous distribuons.`,
    });
  } else {
    // Sans autre version, la question des contenances recevait la même réponse générique sur
    // 67 % des fiches. Les notes, elles, sont propres à chaque parfum et cherchées telles quelles.
    const liste = (n: string[]) => n.slice(0, 4).join(", ").toLowerCase();
    const { top, heart, base } = product.notes;
    const parties = [
      top.length ? `en tête, ${liste(top)}` : "",
      heart.length ? `en cœur, ${liste(heart)}` : "",
      base.length ? `en fond, ${liste(base)}` : "",
    ].filter(Boolean);
    if (parties.length >= 2) {
      questions.push({
        q: `Quelles sont les notes de ${product.brand} ${product.name} ?`,
        a: `${product.name} est un parfum ${(product.family || "").toLowerCase()} : ${parties.join(" ; ")}.`,
      });
    }
  }

  questions.push({
    q: `Comment être sûr de recevoir un ${product.name} original ?`,
    a: `Vous payez à la livraison, après avoir examiné le flacon devant le livreur, et vous pouvez refuser le colis sans rien payer. Le numéro de lot doit être identique sur la boîte et sur le flacon.`,
  });

  return questions;
}
