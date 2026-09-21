import type {
  BaseTdb,
  CalculsCommande,
  Categorie,
  Commande,
  LigneNoire,
  Operation,
  Statut,
} from "./types";
import { STATUTS } from "./types";
import { STATUTS_VENDUS } from "./constantes";

// ───────────────────────────────────────────────────────────── formatage

export function formatDA(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const signe = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  return `${signe}${abs.toLocaleString("fr-FR").replace(/ | /g, " ")} DA`;
}

export function formatPct(p: number | null | undefined, decimales = 1): string {
  if (p === null || p === undefined || !Number.isFinite(p)) return "—";
  return `${(p * 100).toFixed(decimales).replace(".", ",")} %`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [a, m, j] = iso.split("-");
  if (!a || !m || !j) return iso;
  return `${j}/${m}/${a}`;
}

export function aujourdhui(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Nombre de jours pleins entre deux dates ISO (b - a). */
export function joursEntre(a: string, b: string): number | null {
  if (!a || !b) return null;
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return null;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function num(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

// ───────────────────────────────────────────────────── calculs par ligne

/**
 * Numéro lisible et dictable au téléphone, unique par construction.
 * Le suffixe vient de l'identifiant interne de la ligne, pas des chiffres du
 * téléphone : deux clients différents commandant le même jour avec des numéros
 * qui finissent pareil auraient reçu le même numéro de commande.
 */
function numeroCommande(c: Commande): string {
  if (!c.client || !c.date) return "—";
  const [a, m, j] = c.date.split("-");
  let h = 0;
  for (let i = 0; i < c.id.length; i++) h = (h * 31 + c.id.charCodeAt(i)) >>> 0;
  const suffixe = h.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  return `MN-${(a || "").slice(2)}${m || ""}${j || ""}-${suffixe}`;
}

/** Tarif Yalidine à proposer pour une wilaya et un mode de livraison. */
export function tarifSuggere(
  wilaya: string,
  mode: string,
  tarifs: { wilaya: string; stopDesk: number | null; domicile: number | null }[],
): number | null {
  const t = tarifs.find((x) => x.wilaya === wilaya);
  if (!t) return null;
  if (mode === "Stop desk") return t.stopDesk;
  if (mode === "À domicile") return t.domicile;
  return null;
}

export function estVendue(statut: Statut): boolean {
  return STATUTS_VENDUS.includes(statut);
}

/**
 * Règles identiques au classeur Excel :
 *   TOTAL CLIENT = prix de vente x quantité - remise + livraison facturée
 *   ENCAISSÉ     = TOTAL CLIENT si Livrée ou Encaissée, sinon 0
 *   MARGE        = ENCAISSÉ - achat fournisseur (uniquement si vendue) - frais livraison - autres frais
 * Sur un retour on ne déduit donc pas le prix d'achat : le flacon revient et sera revendu,
 * mais les frais aller et retour restent à notre charge.
 */
export function calculer(
  c: Commande,
  contexte?: { blacklist?: LigneNoire[]; commandes?: Commande[]; dateDuJour?: string },
): CalculsCommande {
  const qte = c.quantite && c.quantite > 0 ? c.quantite : 1;
  const totalClient = num(c.prixVente) * qte - num(c.remise) + num(c.livraisonFacturee);
  const vendue = estVendue(c.statut);
  const encaisse = vendue ? totalClient : 0;
  const marge =
    encaisse -
    (vendue ? num(c.achatFournisseur) : 0) -
    num(c.fraisLivraisonPayes) -
    num(c.autresFrais);
  const margePct = encaisse > 0 ? marge / encaisse : null;

  const { texte, gravite, categorie } = alerte(c, contexte);

  return {
    numero: numeroCommande(c),
    totalClient,
    encaisse,
    marge,
    margePct,
    aFaire: texte,
    categorie,
    gravite,
    fidele: estFidele(c, contexte?.commandes ?? []),
  };
}

/** Un client est « fidèle » dès sa deuxième commande sur le même numéro. */
export function estFidele(c: Commande, toutes: Commande[]): boolean {
  const tel = (c.telephone || "").replace(/\D/g, "");
  if (!tel) return false;
  return (
    toutes.filter((x) => (x.telephone || "").replace(/\D/g, "") === tel).length > 1
  );
}

/**
 * Une seule action par commande, la plus urgente.
 * La liste noire n'écrase les autres alertes que TANT QUE le colis n'est pas parti :
 * sur une commande déjà livrée, ce qui compte c'est d'aller chercher l'argent.
 */
function alerte(
  c: Commande,
  contexte?: { blacklist?: LigneNoire[]; dateDuJour?: string },
): { texte: string; gravite: CalculsCommande["gravite"]; categorie: Categorie } {
  if (!c.client) return { texte: "", gravite: "aucune", categorie: "aucune" };
  const jour = contexte?.dateDuJour ?? aujourdhui();
  const tel = (c.telephone || "").replace(/\D/g, "");

  const avantEnvoi =
    c.statut === "Nouvelle" || c.statut === "À rappeler" || c.statut === "Confirmée";
  const surListeNoire =
    tel &&
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
    const j = joursEntre(c.date, jour);
    if (j !== null && j >= 2) {
      return { texte: `Relancer, ${j} j sans réponse`, gravite: "risque", categorie: "relancer" };
    }
    return { texte: "Appeler aujourd'hui", gravite: "info", categorie: "appeler" };
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

// ─────────────────────────────────────────────────────────────── filtres

export function dansLeMois(iso: string, annee: number, mois: number): boolean {
  if (!iso) return false;
  const [a, m] = iso.split("-").map(Number);
  return a === annee && m === mois + 1;
}

export function filtrerPeriode(
  commandes: Commande[],
  periode: "tout" | "mois",
): Commande[] {
  if (periode === "tout") return commandes;
  const d = new Date();
  return commandes.filter((c) => dansLeMois(c.date, d.getFullYear(), d.getMonth()));
}

// ────────────────────────────────────────────────────────────────── KPIs

export interface Kpis {
  recues: number;
  confirmees: number;
  livrees: number;
  retours: number;
  injoignables: number;
  annulees: number;
  ruptures: number;
  tauxConfirmation: number | null;
  tauxLivraison: number | null;
  tauxRetour: number | null;
  tauxInjoignables: number | null;
  argentRecu: number;
  enAttente: number;
  margeEncaissee: number;
  margeEnAttente: number;
  panierMoyen: number | null;
  margeMoyenne: number | null;
  margePct: number | null;
  remises: number;
  fraisLivraison: number;
  autresFrais: number;
  coutRetours: number;
  delaiEnvoiLivraison: number | null;
  delaiLivraisonArgent: number | null;
  clientsFideles: number;
}

export function calculerKpis(commandes: Commande[], toutes: Commande[]): Kpis {
  const par = (s: Statut) => commandes.filter((c) => c.statut === s).length;
  const somme = (f: (c: Commande) => number) =>
    commandes.reduce((t, c) => t + f(c), 0);

  const recues = commandes.length;
  const livrees = par("Livrée") + par("Encaissée");
  const retours = par("Retour");
  const injoignables = par("Injoignable");
  const annulees = par("Annulée");
  const ruptures = par("Rupture fournisseur");
  const confirmees = recues - par("Nouvelle") - par("À rappeler") - injoignables - annulees - ruptures;

  const calc = (c: Commande) => calculer(c, { commandes: toutes });

  const argentRecu = somme((c) => (c.statut === "Encaissée" ? calc(c).totalClient : 0));
  const enAttente = somme((c) => (c.statut === "Livrée" ? calc(c).totalClient : 0));
  const margeEncaissee = somme((c) => (c.statut === "Encaissée" ? calc(c).marge : 0));
  const margeEnAttente = somme((c) => (c.statut === "Livrée" ? calc(c).marge : 0));
  const caRealise = argentRecu + enAttente;
  const margeRealisee = margeEncaissee + margeEnAttente;

  const delais = (a: (c: Commande) => string, b: (c: Commande) => string) => {
    const v = commandes
      .map((c) => joursEntre(a(c), b(c)))
      .filter((x): x is number => x !== null && x >= 0);
    return v.length ? v.reduce((t, x) => t + x, 0) / v.length : null;
  };

  const ratio = (a: number, b: number) => (b > 0 ? a / b : null);

  return {
    recues,
    confirmees,
    livrees,
    retours,
    injoignables,
    annulees,
    ruptures,
    tauxConfirmation: ratio(confirmees, recues),
    tauxLivraison: ratio(livrees, livrees + retours),
    tauxRetour: ratio(retours, livrees + retours),
    tauxInjoignables: ratio(injoignables, recues),
    argentRecu,
    enAttente,
    margeEncaissee,
    margeEnAttente,
    panierMoyen: ratio(caRealise, livrees),
    margeMoyenne: ratio(margeRealisee, livrees),
    margePct: ratio(margeRealisee, caRealise),
    remises: somme((c) => (estVendue(c.statut) ? num(c.remise) : 0)),
    fraisLivraison: somme((c) => num(c.fraisLivraisonPayes)),
    autresFrais: somme((c) => num(c.autresFrais)),
    coutRetours: -somme((c) => (c.statut === "Retour" ? calc(c).marge : 0)),
    delaiEnvoiLivraison: delais((c) => c.dateEnvoi, (c) => c.dateLivraison),
    delaiLivraisonArgent: delais((c) => c.dateLivraison, (c) => c.dateArgentRecu),
    clientsFideles: commandes.filter((c) => estFidele(c, toutes)).length,
  };
}

// ─────────────────────────────────────────────────────────── répartitions

export function parStatut(commandes: Commande[]) {
  return STATUTS.map((s) => ({
    cle: s,
    valeur: commandes.filter((c) => c.statut === s).length,
  }));
}

export function parMois(commandes: Commande[], toutes: Commande[]) {
  const annee = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, m) => {
    const dedans = commandes.filter(
      (c) => c.statut === "Encaissée" && dansLeMois(c.date, annee, m),
    );
    return {
      mois: m,
      argent: dedans.reduce((t, c) => t + calculer(c, { commandes: toutes }).totalClient, 0),
      marge: dedans.reduce((t, c) => t + calculer(c, { commandes: toutes }).marge, 0),
    };
  });
}

export function parCle(
  commandes: Commande[],
  toutes: Commande[],
  cle: (c: Commande) => string,
  cles?: string[],
) {
  const noms = cles ?? Array.from(new Set(commandes.map(cle).filter(Boolean)));
  return noms.map((n) => {
    const dedans = commandes.filter((c) => cle(c) === n);
    return {
      cle: n,
      commandes: dedans.length,
      livrees: dedans.filter((c) => estVendue(c.statut)).length,
      retours: dedans.filter((c) => c.statut === "Retour").length,
      marge: dedans.reduce((t, c) => t + calculer(c, { commandes: toutes }).marge, 0),
    };
  });
}

/** Le taux de retour ne veut rien dire en dessous de 4 colis partis. */
export const SEUIL_TAUX_WILAYA = 4;

export function tauxRetourWilaya(l: { livrees: number; retours: number }): number | null {
  const partis = l.livrees + l.retours;
  return partis >= SEUIL_TAUX_WILAYA ? l.retours / partis : null;
}

// ────────────────────────────────────────────────────────────────── fiche client

export function ficheClient(telephone: string, base: BaseTdb) {
  const tel = (telephone || "").replace(/\D/g, "");
  if (!tel) return null;
  const siennes = base.commandes.filter(
    (c) => (c.telephone || "").replace(/\D/g, "") === tel,
  );
  if (!siennes.length) {
    return {
      trouve: false as const,
      nom: "",
      wilaya: "",
      commandes: 0,
      livrees: 0,
      retours: 0,
      totalPaye: 0,
      marge: 0,
      derniere: "",
      surListeNoire: base.blacklist.some(
        (b) => (b.telephone || "").replace(/\D/g, "") === tel,
      ),
    };
  }
  const triees = [...siennes].sort((a, b) => (a.date < b.date ? 1 : -1));
  const c = (x: Commande) => calculer(x, { commandes: base.commandes });
  return {
    trouve: true as const,
    nom: triees[0].client,
    wilaya: triees[0].wilaya,
    commandes: siennes.length,
    livrees: siennes.filter((x) => estVendue(x.statut)).length,
    retours: siennes.filter((x) => x.statut === "Retour").length,
    totalPaye: siennes.reduce((t, x) => t + c(x).encaisse, 0),
    marge: siennes.reduce((t, x) => t + c(x).marge, 0),
    derniere: triees[0].date,
    surListeNoire: base.blacklist.some(
      (b) => (b.telephone || "").replace(/\D/g, "") === tel,
    ),
  };
}

// ───────────────────────────────────────────────────────────────── caisse

export function effetCaisse(o: Operation): number {
  const entrant = o.type === "Apport d'argent" || o.type === "Encaissement Yalidine";
  return entrant ? num(o.montant) : -num(o.montant);
}

export function soldesAssocies(operations: Operation[], associes: string[]) {
  return associes
    .filter(Boolean)
    .map((a) => {
      const siennes = operations.filter((o) => o.qui === a);
      const avance = -siennes.filter((o) => effetCaisse(o) < 0).reduce((t, o) => t + effetCaisse(o), 0);
      const recupere = siennes.filter((o) => effetCaisse(o) > 0).reduce((t, o) => t + effetCaisse(o), 0);
      return { associe: a, avance, recupere, solde: recupere - avance };
    });
}
