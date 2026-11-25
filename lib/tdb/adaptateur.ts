// Passerelle entre la commande telle qu'elle est stockée en base et l'ancien
// modèle à une ligne utilisé par les écrans Chiffres, Clients et Caisse.
// Évite de réécrire ces écrans : ils lisent désormais les vraies commandes.

import type { CommandeServeur } from "./commandes-serveur";
import { resumeArticles } from "./calculs-commande";
import type { Commande, ModeLivraison, Statut } from "./types";
import { STATUTS } from "./types";

function statutValide(s: string): Statut {
  return (STATUTS as readonly string[]).includes(s) ? (s as Statut) : "Nouvelle";
}

function modeValide(m: string): ModeLivraison {
  if (m === "À domicile") return "À domicile";
  if (m === "Bureau Yalidine" || m === "Stop desk") return "Stop desk";
  return "";
}

export function versAncienModele(c: CommandeServeur): Commande {
  return {
    id: c.id,
    date: (c.creeLe || "").slice(0, 10),
    statut: statutValide(c.statut),
    client: c.client,
    telephone: c.telephone,
    quiGere: c.quiGere,
    wilaya: c.wilaya,
    commune: c.commune || c.adresse,
    livraison: modeValide(c.modeLivraison),
    parfum: resumeArticles(c),
    // Le panier est regroupé en une seule ligne de vente : le total des parfums.
    // Le calcul du total client reste identique (parfums - remise + livraison).
    quantite: 1,
    prixVente: c.totalProduits,
    remise: c.remise,
    livraisonFacturee: c.fraisLivraison,
    achatFournisseur: c.achatFournisseur,
    fournisseur: c.fournisseur,
    fraisLivraisonPayes: c.fraisLivraisonPayes,
    autresFrais: c.autresFrais,
    suivi: c.suivi,
    dateEnvoi: c.dateEnvoi,
    dateLivraison: c.dateLivraison,
    dateArgentRecu: c.dateArgentRecu,
    source: c.source,
    relances: c.relances,
    motif: c.motif,
    note: c.noteInterne,
  };
}
