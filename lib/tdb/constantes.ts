import type { Statut } from "./types";

export const OR = "#C9A84C";
export const OR_FONCE = "#8B6914";
export const NOIR = "#111111";
export const FOND = "#FAFAF8";

/** Couleur de pastille par statut : [fond, texte] */
export const COULEUR_STATUT: Record<Statut, [string, string]> = {
  Nouvelle: ["#E5EDF6", "#1F4E79"],
  "À rappeler": ["#FDF1DC", "#9A5B00"],
  Injoignable: ["#FBE7E5", "#B3261E"],
  Confirmée: ["#F6EFDD", "#8B6914"],
  Achetée: ["#F6EFDD", "#8B6914"],
  Expédiée: ["#E5EDF6", "#1F4E79"],
  Livrée: ["#E4F4EA", "#1E7A45"],
  Encaissée: ["#D7EFE0", "#146034"],
  Retour: ["#FBE7E5", "#B3261E"],
  Annulée: ["#EFEFEC", "#6B6B6B"],
  "Rupture fournisseur": ["#FDF1DC", "#9A5B00"],
};

/** Statuts qui veulent dire « le client a payé le livreur ». */
export const STATUTS_VENDUS: Statut[] = ["Livrée", "Encaissée"];

/** Statuts qui sortent du tunnel sans vente. */
export const STATUTS_PERDUS: Statut[] = ["Annulée", "Rupture fournisseur"];

export const SOURCES_DEFAUT = [
  "Site (Google)",
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Bouche à oreille",
  "Boutique Blida",
  "Ancien client",
  "Autre",
];

export const MOTIFS = [
  "Injoignable 3 fois",
  "Faux numéro",
  "A changé d'avis",
  "Trop cher",
  "Parfum indisponible",
  "Délai trop long",
  "Refus à la livraison",
  "Colis perdu / cassé",
  "Doublon",
  "Autre",
];

export const POSTES_CHARGES = [
  "Abonnement Yalidine",
  "Domaine + hébergement du site",
  "Téléphone / internet",
  "Boutique de Blida",
  "Transferts d'argent France - Algérie",
  "Emballage / fournitures",
];

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Menia",
];

/** Repères marché 2026, à remplacer par les vrais tarifs du compte Yalidine. */
export const REPERES_YALIDINE = {
  retour: 350,
  commissionPct: 0.01,
  assurancePct: 0.01,
  plafondSansAssurance: 5000,
  versementJours: 15,
};

export const MOIS_COURTS = [
  "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.",
];
