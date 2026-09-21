// Modèle de données du tableau de bord interne (/tableau-de-bord).
// Reprend exactement les colonnes du classeur Maison-Numidia-Gestion.xlsx.

export const STATUTS = [
  "Nouvelle",
  "À rappeler",
  "Injoignable",
  "Confirmée",
  "Achetée",
  "Expédiée",
  "Livrée",
  "Encaissée",
  "Retour",
  "Annulée",
  "Rupture fournisseur",
] as const;

export type Statut = (typeof STATUTS)[number];

export const MODES_LIVRAISON = ["Stop desk", "À domicile"] as const;
export type ModeLivraison = (typeof MODES_LIVRAISON)[number] | "";

export const TYPES_OPERATION = [
  "Apport d'argent",
  "Achat fournisseur",
  "Frais de livraison",
  "Frais de retour",
  "Encaissement Yalidine",
  "Retrait / part",
  "Charge fixe",
  "Autre dépense",
] as const;
export type TypeOperation = (typeof TYPES_OPERATION)[number];

/** Une ligne de l'onglet COMMANDES. */
export interface Commande {
  id: string;
  /** Saisi à la réception */
  date: string; // AAAA-MM-JJ
  statut: Statut;
  client: string;
  telephone: string;
  quiGere: string;
  wilaya: string;
  commune: string;
  livraison: ModeLivraison;
  parfum: string;
  quantite: number;
  prixVente: number;
  remise: number;
  livraisonFacturee: number;
  /** Saisi au moment de l'achat */
  achatFournisseur: number | null;
  fournisseur: string;
  fraisLivraisonPayes: number | null;
  autresFrais: number;
  /** Saisi au moment de l'expédition puis du suivi */
  suivi: string;
  dateEnvoi: string;
  dateLivraison: string;
  dateArgentRecu: string;
  /** Infos */
  source: string;
  relances: number;
  motif: string;
  note: string;
}

/** Une ligne de l'onglet CAISSE. */
export interface Operation {
  id: string;
  date: string;
  qui: string;
  type: TypeOperation;
  montant: number;
  commande: string;
  preuve: boolean;
  note: string;
}

/** Une ligne de la liste noire. */
export interface LigneNoire {
  id: string;
  telephone: string;
  nom: string;
  wilaya: string;
  motif: string;
  date: string;
}

export interface TarifWilaya {
  wilaya: string;
  stopDesk: number | null;
  domicile: number | null;
  delai: number | null;
}

export interface ChargeFixe {
  id: string;
  poste: string;
  montant: number;
}

export interface Reglages {
  associes: string[];
  fournisseurs: string[];
  sources: string[];
  tarifs: TarifWilaya[];
  chargesFixes: ChargeFixe[];
}

export interface BaseTdb {
  version: number;
  commandes: Commande[];
  operations: Operation[];
  blacklist: LigneNoire[];
  reglages: Reglages;
  /** Horodatage ISO de la dernière écriture, pour l'export */
  majLe: string;
}

/** Nature de l'action à mener, pour compter sans dépendre du texte affiché. */
export type Categorie =
  | "aucune"
  | "appeler"
  | "relancer"
  | "acheter"
  | "expedier"
  | "retard"
  | "argent"
  | "cloturer"
  | "risque"
  | "prixManquant";

/** Les six compteurs du bloc « ce qu'il faut faire maintenant ». */
export const ACTIONS_DU_JOUR: { categorie: Categorie; label: string }[] = [
  { categorie: "appeler", label: "À appeler aujourd'hui" },
  { categorie: "relancer", label: "Clients à relancer" },
  { categorie: "acheter", label: "Parfums à acheter" },
  { categorie: "expedier", label: "Colis à expédier" },
  { categorie: "retard", label: "Colis en retard" },
  { categorie: "argent", label: "Argent à récupérer" },
  { categorie: "cloturer", label: "Commandes à clôturer" },
];

/** Colonnes calculées, jamais saisies. */
export interface CalculsCommande {
  numero: string;
  totalClient: number;
  encaisse: number;
  marge: number;
  margePct: number | null;
  aFaire: string;
  categorie: Categorie;
  /** "risque" colore l'alerte en rouge */
  gravite: "aucune" | "info" | "risque";
  fidele: boolean;
}
