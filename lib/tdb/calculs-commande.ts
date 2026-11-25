// Calculs sur une commande venue de la base. Mêmes règles que le classeur Excel.
//
//   TOTAL CLIENT = prix des parfums - remise + livraison facturée
//   ENCAISSÉ     = total client si Livrée ou Encaissée, sinon 0
//   MARGE        = encaissé - achat fournisseur (seulement si vendue)
//                           - frais de livraison payés - autres frais
//
// Sur un retour on ne déduit pas le prix d'achat : le flacon revient et sera
// revendu. En revanche les frais aller et retour restent à notre charge.

import type { CommandeServeur } from "./commandes-serveur";
import type { Categorie, LigneNoire } from "./types";
import { aujourdhui, joursEntre, num } from "./calculs";

export interface CalculsLigne {
  totalClient: number;
  encaisse: number;
  marge: number;
  margePct: number | null;
  aFaire: string;
  categorie: Categorie;
  gravite: "aucune" | "info" | "risque";
  fidele: boolean;
  resume: string;
}

const VENDUES = ["Livrée", "Encaissée"];

export function estVendue(statut: string): boolean {
  return VENDUES.includes(statut);
}

export function resumeArticles(c: CommandeServeur): string {
  return c.articles
    .map((a) => `${a.marque} ${a.nom}${a.qte > 1 ? ` x${a.qte}` : ""}`)
    .join(", ");
}

export function calculerLigne(
  c: CommandeServeur,
  contexte?: {
    blacklist?: LigneNoire[];
    commandes?: CommandeServeur[];
    dateDuJour?: string;
  },
): CalculsLigne {
  const totalClient = num(c.totalProduits) - num(c.remise) + num(c.fraisLivraison);
  const vendue = estVendue(c.statut);
  const encaisse = vendue ? totalClient : 0;
  const marge =
    encaisse -
    (vendue ? num(c.achatFournisseur) : 0) -
    num(c.fraisLivraisonPayes) -
    num(c.autresFrais);

  const { texte, gravite, categorie } = alerte(c, contexte);

  const tel = (c.telephone || "").replace(/\D/g, "");
  const fidele =
    Boolean(tel) &&
    (contexte?.commandes ?? []).filter(
      (x) => (x.telephone || "").replace(/\D/g, "") === tel,
    ).length > 1;

  return {
    totalClient,
    encaisse,
    marge,
    margePct: encaisse > 0 ? marge / encaisse : null,
    aFaire: texte,
    categorie,
    gravite,
    fidele,
    resume: resumeArticles(c),
  };
}

/** Date courte AAAA-MM-JJ tirée de l'horodatage ISO de création. */
export function jourDe(c: CommandeServeur): string {
  return (c.creeLe || "").slice(0, 10);
}

function alerte(
  c: CommandeServeur,
  contexte?: { blacklist?: LigneNoire[]; dateDuJour?: string },
): { texte: string; gravite: CalculsLigne["gravite"]; categorie: Categorie } {
  const jour = contexte?.dateDuJour ?? aujourdhui();
  const tel = (c.telephone || "").replace(/\D/g, "");
  const avantEnvoi =
    c.statut === "Nouvelle" || c.statut === "À rappeler" || c.statut === "Confirmée";

  const surListeNoire =
    Boolean(tel) &&
    (contexte?.blacklist ?? []).some(
      (b) => (b.telephone || "").replace(/\D/g, "") === tel,
    );
  if (surListeNoire && avantEnvoi) {
    return {
      texte: "Client à risque, vérifier avant d'envoyer",
      gravite: "risque",
      categorie: "risque",
    };
  }

  if (c.statut === "Injoignable" && num(c.relances) >= 3) {
    return { texte: "Annuler, 3 relances faites", gravite: "risque", categorie: "cloturer" };
  }
  if (c.statut === "Injoignable") {
    return { texte: "Relancer, client injoignable", gravite: "risque", categorie: "relancer" };
  }
  if (c.statut === "Nouvelle" || c.statut === "À rappeler") {
    const j = joursEntre(jourDe(c), jour);
    if (j !== null && j >= 2) {
      return { texte: `Relancer, ${j} j sans réponse`, gravite: "risque", categorie: "relancer" };
    }
    return { texte: "Appeler le client", gravite: "info", categorie: "appeler" };
  }
  if (c.statut === "Confirmée" && c.achatFournisseur === null) {
    return { texte: "Acheter le parfum", gravite: "info", categorie: "acheter" };
  }
  if (c.statut === "Achetée" && !c.suivi) {
    return { texte: "À expédier", gravite: "info", categorie: "expedier" };
  }
  if (c.statut === "Expédiée" && c.dateEnvoi) {
    const j = joursEntre(c.dateEnvoi, jour);
    if (j !== null && j >= 7) {
      return { texte: `Retard, parti depuis ${j} j`, gravite: "risque", categorie: "retard" };
    }
  }
  if (c.statut === "Livrée" && !c.dateArgentRecu) {
    return { texte: "Argent pas encore reçu", gravite: "info", categorie: "argent" };
  }
  if (
    (c.statut === "Expédiée" || c.statut === "Livrée" || c.statut === "Encaissée") &&
    c.achatFournisseur === null
  ) {
    return { texte: "Prix d'achat manquant", gravite: "info", categorie: "prixManquant" };
  }
  return { texte: "", gravite: "aucune", categorie: "aucune" };
}
