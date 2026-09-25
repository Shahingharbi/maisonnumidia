import type { Product } from "@/lib/types";
import { formatPrice, getDistinctiveNotes } from "@/lib/products";

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

  const livraison = ` Les frais de livraison Yalidine s'ajoutent à ce montant et dépendent de votre wilaya. Le règlement se fait à la réception : vous ne payez rien avant d'avoir le flacon en main, et vous pouvez refuser le colis.`;

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

const climateByCategory: Record<string, string> = {
  "parfums-homme":
    "Le climat algérien, marqué par des étés chauds sur le littoral d'Alger et d'Oran et un hiver plus frais sur les Hauts Plateaux,",
  "parfums-femme":
    "L'Algérie offre une grande variété climatique, du littoral méditerranéen tempéré jusqu'au Sahara plus aride. Cette diversité",
  "parfums-orientaux":
    "Les parfums orientaux trouvent en Algérie un terrain idéal : la culture maghrébine valorise les notes profondes d'oud, de musc et d'ambre, et le climat sec",
};

const audienceByCategory: Record<string, string> = {
  "parfums-homme":
    "l'homme algérien à la recherche d'une signature olfactive masculine, élégante et durable",
  "parfums-femme":
    "la femme algérienne qui veut affirmer sa personnalité avec un parfum féminin et raffiné",
  "parfums-orientaux":
    "les amateurs de parfums orientaux et oud, qu'ils soient hommes ou femmes, attachés à la tradition parfumière maghrébine",
};

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
function concentrationContext(concentration: string): string {
  const c = concentration.toUpperCase();
  if (c.startsWith("PARFUM") || c.startsWith("EXTRAIT"))
    return "L'Extrait de Parfum (ou Parfum) est la concentration la plus élevée, généralement entre 20 et 30% d'essence parfumée. C'est le format le plus précieux, celui dont on attend la tenue la plus longue et un sillage maîtrisé.";
  if (c.startsWith("EDP"))
    return "L'Eau de Parfum (EDP) contient entre 12 et 18% d'essence. C'est la concentration de référence pour les parfums de luxe : elle équilibre tenue, sillage et richesse olfactive, et reste la plus polyvalente.";
  if (c.startsWith("EDT"))
    return "L'Eau de Toilette (EDT) titre entre 6 et 12% d'essence. Plus légère et plus aérienne que l'Eau de Parfum, elle est adaptée à la journée et aux climats chauds, quitte à être réappliquée en cours de journée.";
  if (c === "EDC" || c === "COLOGNE")
    return "L'Eau de Cologne titre entre 2 et 5% d'essence. Très fraîche, elle est conçue pour être appliquée généreusement et offre une sensation de fraîcheur immédiate, particulièrement appréciable en été.";
  return `La concentration ${concentration} détermine la tenue et l'intensité du parfum sur la peau, ainsi que la richesse de son sillage.`;
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
  const climat = `${climateByCategory[product.category] || "Le climat algérien, varié selon les régions,"} joue son rôle : à la chaleur, les notes de tête s'évaporent plus vite mais le fond gagne en intensité ; au froid, le parfum met plus de temps à se déployer.`;

  return `${familyContext(famille)} ${surPeau} ${climat}`;
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

  return `${cadre} ${conseil} Reste le bon réflexe avant d'acheter un parfum qu'on ne connaît pas : le tester sur soi plutôt que sur une touche de papier, et attendre le fond avant de se décider — c'est lui qu'on portera le reste de la journée.`;
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
    a: `${product.brand} ${product.name} ${product.concentration} ${product.volume} coûte ${formatPrice(product.price)} chez Maison Numidia.${dispo} Les frais de livraison Yalidine s'ajoutent à ce montant et varient selon la wilaya. Le paiement se fait à la réception, en espèces, sans carte bancaire ni avance.`,
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
    questions.push({
      q: `${product.name} existe-t-il en d'autres contenances ?`,
      a: `Nous le distribuons en un seul format : ${product.concentration} ${product.volume}, à ${formatPrice(product.price)}. C'est la contenance la plus courante sur le marché algérien, et celle pour laquelle l'approvisionnement est régulier. Si un autre format vous intéresse, l'équipe peut vous dire au téléphone s'il est trouvable.`,
    });
  }

  questions.push({
    q: `Comment être sûr de recevoir un ${product.name} original ?`,
    a: `Le paiement à la réception est votre garantie : le livreur vous remet le colis, vous examinez le flacon, et vous ne réglez que si vous le gardez. Vous pouvez refuser la livraison sans vous justifier et sans rien payer. Les points à vérifier sur place sont listés plus haut sur cette page : qualité du verre et du spray, numéro de lot identique sur le flacon et la boîte, odeur qui évolue au lieu de sentir l'alcool.`,
  });

  return questions;
}
