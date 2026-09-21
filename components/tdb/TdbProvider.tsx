"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  BaseTdb,
  ChargeFixe,
  Commande,
  LigneNoire,
  Operation,
  Reglages,
} from "@/lib/tdb/types";
import { POSTES_CHARGES, SOURCES_DEFAUT, WILAYAS } from "@/lib/tdb/constantes";

const CLE = "mn-tdb-v1";
const VERSION = 1;

function id(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function commandeVide(): Commande {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    id: id(),
    date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    statut: "Nouvelle",
    client: "",
    telephone: "",
    quiGere: "",
    wilaya: "",
    commune: "",
    livraison: "",
    parfum: "",
    quantite: 1,
    prixVente: 0,
    remise: 0,
    livraisonFacturee: 0,
    achatFournisseur: null,
    fournisseur: "",
    fraisLivraisonPayes: null,
    autresFrais: 0,
    suivi: "",
    dateEnvoi: "",
    dateLivraison: "",
    dateArgentRecu: "",
    source: "",
    relances: 0,
    motif: "",
    note: "",
  };
}

export function operationVide(): Operation {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    id: id(),
    date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    qui: "",
    type: "Achat fournisseur",
    montant: 0,
    commande: "",
    preuve: false,
    note: "",
  };
}

function reglagesDefaut(): Reglages {
  return {
    associes: ["Shahin", "Associé 2", "Associé 3"],
    fournisseurs: ["Fournisseur 1", "Fournisseur 2", "Boutique Blida"],
    sources: [...SOURCES_DEFAUT],
    tarifs: WILAYAS.map((w) => ({ wilaya: w, stopDesk: null, domicile: null, delai: null })),
    chargesFixes: POSTES_CHARGES.map<ChargeFixe>((p) => ({ id: id(), poste: p, montant: 0 })),
  };
}

/** Six commandes d'exemple, reprises du classeur, pour que rien ne soit vide au départ. */
function exemples(): Commande[] {
  const base = commandeVide();
  const faire = (o: Partial<Commande>): Commande => ({ ...base, ...o, id: id() });
  return [
    faire({
      date: "2026-09-12", statut: "Encaissée", client: "EXEMPLE - Mohamed B.",
      telephone: "0661234567", quiGere: "Shahin", wilaya: "Alger", commune: "Bab Ezzouar",
      livraison: "Stop desk", parfum: "Dior Sauvage EDT 100ml", quantite: 1,
      prixVente: 26500, remise: 0, livraisonFacturee: 500, achatFournisseur: 17000,
      fournisseur: "Fournisseur 1", fraisLivraisonPayes: 450, autresFrais: 265,
      suivi: "YAL-000123", dateEnvoi: "2026-09-13", dateLivraison: "2026-09-15",
      dateArgentRecu: "2026-09-24", source: "Site (Google)", relances: 0,
      note: "Ligne d'exemple, à supprimer",
    }),
    faire({
      date: "2026-09-14", statut: "Encaissée", client: "EXEMPLE - Amina K.",
      telephone: "0555987654", quiGere: "Associé 2", wilaya: "Blida", commune: "Boufarik",
      livraison: "À domicile", parfum: "Lattafa Khamrah 100ml", quantite: 2,
      prixVente: 8500, remise: 1000, livraisonFacturee: 800, achatFournisseur: 10400,
      fournisseur: "Fournisseur 2", fraisLivraisonPayes: 700, autresFrais: 160,
      suivi: "YAL-000124", dateEnvoi: "2026-09-15", dateLivraison: "2026-09-17",
      dateArgentRecu: "2026-09-26", source: "Instagram", relances: 1,
      note: "Remise de 1 000 DA accordée au téléphone",
    }),
    faire({
      date: "2026-09-15", statut: "Retour", client: "EXEMPLE - Yacine M.",
      telephone: "0770112233", quiGere: "Associé 3", wilaya: "Oran", commune: "Es Senia",
      livraison: "À domicile", parfum: "Bleu de Chanel EDP 100ml", quantite: 1,
      prixVente: 31000, remise: 0, livraisonFacturee: 0, achatFournisseur: 21000,
      fournisseur: "Fournisseur 1", fraisLivraisonPayes: 900, autresFrais: 350,
      suivi: "YAL-000125", dateEnvoi: "2026-09-16", source: "Facebook", relances: 2,
      motif: "Refus à la livraison",
      note: "Flacon récupéré et remis en stock, on perd l'aller et le retour",
    }),
    faire({
      date: "2026-09-18", statut: "Injoignable", client: "EXEMPLE - Sofiane T.",
      telephone: "0699887766", quiGere: "Shahin", wilaya: "Constantine", commune: "El Khroub",
      livraison: "Stop desk", parfum: "Paco Rabanne Invictus 100ml", quantite: 1,
      prixVente: 19500, livraisonFacturee: 500, source: "Site (Google)", relances: 3,
      note: "3 appels sans réponse, à passer en Annulée",
    }),
    faire({
      date: "2026-09-19", statut: "Confirmée", client: "EXEMPLE - Nadia R.",
      telephone: "0540223344", quiGere: "Associé 2", wilaya: "Sétif", commune: "Ain Arnat",
      livraison: "Stop desk", parfum: "Lattafa Yara 100ml", quantite: 1,
      prixVente: 7900, livraisonFacturee: 500, source: "WhatsApp",
      note: "Confirmée au téléphone, à acheter demain",
    }),
    faire({
      date: "2026-09-20", statut: "Nouvelle", client: "EXEMPLE - Mohamed B.",
      telephone: "0661234567", quiGere: "Shahin", wilaya: "Alger", commune: "Kouba",
      livraison: "Stop desk", parfum: "Dior Sauvage Elixir 60ml", quantite: 1,
      prixVente: 34000, livraisonFacturee: 500, source: "Ancien client",
      note: "Deuxième commande du même numéro, c'est un client fidèle",
    }),
  ];
}

export function baseDefaut(): BaseTdb {
  return {
    version: VERSION,
    commandes: exemples(),
    operations: [],
    blacklist: [],
    reglages: reglagesDefaut(),
    majLe: new Date().toISOString(),
  };
}

function lire(): BaseTdb | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const o = JSON.parse(brut) as BaseTdb;
    if (!o || !Array.isArray(o.commandes)) return null;
    // Complète les champs ajoutés après coup sans casser une base existante.
    return {
      ...baseDefaut(),
      ...o,
      reglages: { ...reglagesDefaut(), ...(o.reglages ?? {}) },
    };
  } catch {
    return null;
  }
}

interface Api {
  base: BaseTdb;
  pret: boolean;
  ajouterCommande: (c: Commande) => void;
  modifierCommande: (c: Commande) => void;
  supprimerCommande: (id: string) => void;
  ajouterOperation: (o: Operation) => void;
  modifierOperation: (o: Operation) => void;
  supprimerOperation: (id: string) => void;
  ajouterNoire: (l: LigneNoire) => void;
  supprimerNoire: (id: string) => void;
  majReglages: (r: Partial<Reglages>) => void;
  supprimerExemples: () => void;
  exporterJson: () => void;
  importerJson: (fichier: File) => Promise<void>;
  toutEffacer: () => void;
  nouvelId: () => string;
}

const Ctx = createContext<Api | null>(null);

export function TdbProvider({ children }: { children: React.ReactNode }) {
  const [base, setBase] = useState<BaseTdb>(() => baseDefaut());
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const trouve = lire();
    if (trouve) setBase(trouve);
    setPret(true);
  }, []);

  useEffect(() => {
    if (!pret) return;
    try {
      localStorage.setItem(CLE, JSON.stringify(base));
    } catch {
      // quota plein ou navigation privée : on ne casse pas l'affichage
    }
  }, [base, pret]);

  const ecrire = useCallback((f: (b: BaseTdb) => BaseTdb) => {
    setBase((b) => ({ ...f(b), majLe: new Date().toISOString() }));
  }, []);

  const api = useMemo<Api>(
    () => ({
      base,
      pret,
      nouvelId: id,
      ajouterCommande: (c) => ecrire((b) => ({ ...b, commandes: [c, ...b.commandes] })),
      modifierCommande: (c) =>
        ecrire((b) => ({ ...b, commandes: b.commandes.map((x) => (x.id === c.id ? c : x)) })),
      supprimerCommande: (i) =>
        ecrire((b) => ({ ...b, commandes: b.commandes.filter((x) => x.id !== i) })),
      ajouterOperation: (o) => ecrire((b) => ({ ...b, operations: [o, ...b.operations] })),
      modifierOperation: (o) =>
        ecrire((b) => ({ ...b, operations: b.operations.map((x) => (x.id === o.id ? o : x)) })),
      supprimerOperation: (i) =>
        ecrire((b) => ({ ...b, operations: b.operations.filter((x) => x.id !== i) })),
      ajouterNoire: (l) => ecrire((b) => ({ ...b, blacklist: [l, ...b.blacklist] })),
      supprimerNoire: (i) =>
        ecrire((b) => ({ ...b, blacklist: b.blacklist.filter((x) => x.id !== i) })),
      majReglages: (r) => ecrire((b) => ({ ...b, reglages: { ...b.reglages, ...r } })),
      supprimerExemples: () =>
        ecrire((b) => ({
          ...b,
          commandes: b.commandes.filter((c) => !c.client.startsWith("EXEMPLE")),
        })),
      exporterJson: () => {
        const blob = new Blob([JSON.stringify(base, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `maison-numidia-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
      importerJson: async (fichier) => {
        const texte = await fichier.text();
        const o = JSON.parse(texte) as BaseTdb;
        if (!o || !Array.isArray(o.commandes)) throw new Error("Fichier illisible");
        ecrire(() => ({ ...baseDefaut(), ...o }));
      },
      toutEffacer: () =>
        ecrire(() => ({ ...baseDefaut(), commandes: [], operations: [], blacklist: [] })),
    }),
    [base, pret, ecrire],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useTdb(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTdb doit être utilisé dans <TdbProvider>");
  return v;
}
