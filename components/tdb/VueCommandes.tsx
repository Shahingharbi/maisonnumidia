"use client";

// Onglet COMMANDES de l'espace interne.
// C'est l'écran le plus utilisé de la journée : on y saisit une commande reçue,
// on la suit jusqu'à l'encaissement, et surtout on change son statut très souvent.
// Aucune règle de calcul n'est réécrite ici : tout vient de lib/tdb/calculs.ts.

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Check, Copy, Plus, Search, Trash2, X } from "lucide-react";
import { commandeVide, useTdb } from "@/components/tdb/TdbProvider";
import { calculer, formatDA, formatDate, formatPct, num } from "@/lib/tdb/calculs";
import { COULEUR_STATUT, MOTIFS, WILAYAS } from "@/lib/tdb/constantes";
import { MODES_LIVRAISON, STATUTS } from "@/lib/tdb/types";
import type { CalculsCommande, Commande, ModeLivraison, Statut } from "@/lib/tdb/types";
import {
  BORDURE,
  Bouton,
  Carte,
  Champ,
  Etiquette,
  Liste,
  Pastille,
  TitreBloc,
  Vide,
  ZoneTexte,
} from "@/components/tdb/ui";

// ───────────────────────────────────────────────────────────── petits outils

const CHAMP_LOCAL =
  "w-full border border-[#DCDCD5] rounded-lg px-3 py-2 text-[13px] text-[#111111] bg-white " +
  "min-h-[42px] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition";

/** Statuts pour lesquels le motif d'arrêt a vraiment un sens. */
const STATUTS_A_MOTIF: Statut[] = [
  "Annulée",
  "Retour",
  "Injoignable",
  "Rupture fournisseur",
];

/** Champs saisis au clavier en chiffres : ils gardent leur texte brut pendant la frappe. */
type ChampNombre =
  | "quantite"
  | "prixVente"
  | "remise"
  | "livraisonFacturee"
  | "achatFournisseur"
  | "fraisLivraisonPayes"
  | "autresFrais"
  | "relances";

type Textes = Record<ChampNombre, string>;

function versNombre(saisie: string): number | null {
  const net = saisie.replace(/\s/g, "").replace(",", ".");
  if (net === "") return null;
  const n = Number(net);
  return Number.isFinite(n) ? n : null;
}

function textesDepuis(c: Commande): Textes {
  const t = (v: number | null): string => (v === null || v === 0 ? "" : String(v));
  return {
    quantite: c.quantite > 0 ? String(c.quantite) : "",
    prixVente: t(c.prixVente),
    remise: t(c.remise),
    livraisonFacturee: t(c.livraisonFacturee),
    achatFournisseur: t(c.achatFournisseur),
    fraisLivraisonPayes: t(c.fraisLivraisonPayes),
    autresFrais: t(c.autresFrais),
    relances: t(c.relances),
  };
}

function couleurAlerte(gravite: CalculsCommande["gravite"]): string {
  if (gravite === "risque") return "text-[#B3261E]";
  if (gravite === "info") return "text-[#9A5B00]";
  return "text-[#9A9A94]";
}

function couleurMarge(marge: number): string {
  if (marge < 0) return "text-[#B3261E]";
  if (marge > 0) return "text-[#1E7A45]";
  return "text-[#6B6B6B]";
}

function telPropre(t: string): string {
  return (t || "").replace(/[^\d+]/g, "");
}

/** Message à coller dans la discussion WhatsApp des associés. */
function messageWhatsApp(c: Commande, numero: string, totalClient: number): string {
  const qte = c.quantite > 0 ? c.quantite : 1;
  const prixLigne = totalClient - num(c.livraisonFacturee);
  return [
    `NOUVELLE COMMANDE  ${numero}`,
    `Client : ${c.client}  -  ${c.telephone}`,
    `Wilaya : ${c.wilaya} (${c.commune})  -  ${c.livraison}`,
    `Parfum : ${c.parfum} x${qte}  -  ${formatDA(prixLigne)} + ${formatDA(
      num(c.livraisonFacturee),
    )} de livraison`,
    `Qui gere : ${c.quiGere}`,
    "A faire : appeler avant ce soir",
  ].join("\n");
}

// ───────────────────────────────────────────────────── briques locales

function TitreSection({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8B6914] border-b border-[#E9E9E4] pb-1.5 mb-3">
      {children}
    </h3>
  );
}

/** Même dessin que Liste, mais sans option vide : sert aux champs qui ont toujours une valeur. */
function ListeObligatoire<T extends string>({
  label,
  value,
  onChange,
  options,
  aide,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  aide?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={CHAMP_LOCAL}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {aide && <span className="block text-[10px] text-[#9A9A94] mt-1">{aide}</span>}
    </label>
  );
}

/** Le geste le plus fréquent de la journée : changer le statut sans ouvrir la fiche. */
function SelectStatut({
  valeur,
  onChange,
  grand = false,
}: {
  valeur: Statut;
  onChange: (s: Statut) => void;
  grand?: boolean;
}) {
  const [fond, texte] = COULEUR_STATUT[valeur] ?? ["#EFEFEC", "#6B6B6B"];
  return (
    <select
      value={valeur}
      aria-label="Changer le statut"
      onChange={(e) => onChange(e.target.value as Statut)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      style={{ backgroundColor: fond, color: texte }}
      className={`rounded font-semibold border border-transparent focus:outline-none focus:border-[#C9A84C] ${
        grand ? "text-[12px] px-2 py-2 min-h-[40px]" : "text-[11px] px-1.5 py-1 max-w-[118px]"
      }`}
    >
      {STATUTS.map((s) => (
        <option key={s} value={s} style={{ backgroundColor: "#FFFFFF", color: "#111111" }}>
          {s}
        </option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────── la vue

export default function VueCommandes() {
  const { base, ajouterCommande, modifierCommande, supprimerCommande } = useTdb();

  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreQui, setFiltreQui] = useState("");
  const [seulementAFaire, setSeulementAFaire] = useState(false);

  const [brouillon, setBrouillon] = useState<Commande | null>(null);
  const [textes, setTextes] = useState<Textes>(() => textesDepuis(commandeVide()));
  const [mode, setMode] = useState<"creation" | "edition">("creation");
  const [erreur, setErreur] = useState("");
  const [confirmeSuppression, setConfirmeSuppression] = useState(false);
  const [copie, setCopie] = useState<"non" | "oui" | "echec">("non");

  const ouvert = brouillon !== null;

  const contexte = useMemo(
    () => ({ blacklist: base.blacklist, commandes: base.commandes }),
    [base.blacklist, base.commandes],
  );

  // Toutes les lignes avec leurs colonnes calculées, triées de la plus récente à la plus ancienne.
  const lignes = useMemo(() => {
    const avecCalculs = base.commandes.map((c) => ({ c, k: calculer(c, contexte) }));
    return avecCalculs.sort((a, b) => (a.c.date < b.c.date ? 1 : a.c.date > b.c.date ? -1 : 0));
  }, [base.commandes, contexte]);

  const gestionnaires = useMemo(() => {
    const vus = new Set<string>(base.reglages.associes.filter(Boolean));
    base.commandes.forEach((c) => {
      if (c.quiGere) vus.add(c.quiGere);
    });
    return Array.from(vus);
  }, [base.reglages.associes, base.commandes]);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const chiffres = q.replace(/\D/g, "");
    return lignes.filter(({ c, k }) => {
      if (filtreStatut && c.statut !== filtreStatut) return false;
      if (filtreQui && c.quiGere !== filtreQui) return false;
      if (seulementAFaire && !k.aFaire) return false;
      if (!q) return true;
      const texte = `${c.client} ${c.parfum} ${k.numero} ${c.wilaya} ${c.commune}`.toLowerCase();
      if (texte.includes(q)) return true;
      return chiffres.length > 0 && telPropre(c.telephone).includes(chiffres);
    });
  }, [lignes, recherche, filtreStatut, filtreQui, seulementAFaire]);

  const compteurs = useMemo(() => {
    return visibles.reduce(
      (t, { k }) => ({
        nombre: t.nombre + 1,
        total: t.total + k.totalClient,
        marge: t.marge + k.marge,
      }),
      { nombre: 0, total: 0, marge: 0 },
    );
  }, [visibles]);

  const calculsBrouillon = useMemo(
    () => (brouillon ? calculer(brouillon, contexte) : null),
    [brouillon, contexte],
  );

  const fermer = useCallback(() => {
    setBrouillon(null);
    setErreur("");
    setConfirmeSuppression(false);
    setCopie("non");
  }, []);

  const ouvrir = useCallback((c: Commande, type: "creation" | "edition") => {
    setBrouillon({ ...c });
    setTextes(textesDepuis(c));
    setMode(type);
    setErreur("");
    setConfirmeSuppression(false);
    setCopie("non");
  }, []);

  // Fermeture au clavier et blocage du défilement derrière le panneau.
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    window.addEventListener("keydown", surTouche);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", surTouche);
      document.body.style.overflow = avant;
    };
  }, [ouvert, fermer]);

  useEffect(() => {
    if (copie === "non") return;
    const t = setTimeout(() => setCopie("non"), 2500);
    return () => clearTimeout(t);
  }, [copie]);

  function majChamp(morceau: Partial<Commande>) {
    setBrouillon((b) => (b ? { ...b, ...morceau } : b));
    setErreur("");
  }

  function majNombre(champ: ChampNombre, saisie: string) {
    setTextes((t) => ({ ...t, [champ]: saisie }));
    const n = versNombre(saisie);
    setBrouillon((b) => {
      if (!b) return b;
      switch (champ) {
        // Vide veut dire « pas encore renseigné » : ces deux colonnes déclenchent une alerte.
        case "achatFournisseur":
          return { ...b, achatFournisseur: n };
        case "fraisLivraisonPayes":
          return { ...b, fraisLivraisonPayes: n };
        case "quantite":
          return { ...b, quantite: n ?? 0 };
        case "prixVente":
          return { ...b, prixVente: n ?? 0 };
        case "remise":
          return { ...b, remise: n ?? 0 };
        case "livraisonFacturee":
          return { ...b, livraisonFacturee: n ?? 0 };
        case "autresFrais":
          return { ...b, autresFrais: n ?? 0 };
        case "relances":
          return { ...b, relances: n ?? 0 };
        default:
          return b;
      }
    });
    setErreur("");
  }

  function changerStatutDansListe(c: Commande, statut: Statut) {
    modifierCommande({ ...c, statut });
  }

  function enregistrer() {
    if (!brouillon) return;
    if (!brouillon.client.trim()) {
      setErreur("Le nom du client est obligatoire.");
      return;
    }
    const propre: Commande = {
      ...brouillon,
      client: brouillon.client.trim(),
      telephone: brouillon.telephone.trim(),
      parfum: brouillon.parfum.trim(),
      commune: brouillon.commune.trim(),
      suivi: brouillon.suivi.trim(),
      quantite: brouillon.quantite > 0 ? brouillon.quantite : 1,
    };
    if (mode === "creation") ajouterCommande(propre);
    else modifierCommande(propre);
    fermer();
  }

  function supprimer() {
    if (!brouillon) return;
    supprimerCommande(brouillon.id);
    fermer();
  }

  async function copierMessage() {
    if (!brouillon || !calculsBrouillon) return;
    const texte = messageWhatsApp(brouillon, calculsBrouillon.numero, calculsBrouillon.totalClient);
    try {
      await navigator.clipboard.writeText(texte);
      setCopie("oui");
    } catch {
      setCopie("echec");
    }
  }

  const montrerMotif =
    brouillon !== null &&
    (STATUTS_A_MOTIF.includes(brouillon.statut) || brouillon.motif !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <TitreBloc aide="Une ligne par commande reçue, de l'appel jusqu'à l'argent encaissé.">
          Commandes
        </TitreBloc>
        <Bouton
          onClick={() => ouvrir(commandeVide(), "creation")}
          className="min-h-[44px] flex items-center gap-2"
        >
          <Plus size={15} strokeWidth={2} />
          Nouvelle commande
        </Bouton>
      </div>

      {/* ───────────────────────────────── barre d'outils */}
      <div className={`bg-white ${BORDURE} rounded-lg p-3 flex flex-col lg:flex-row lg:items-center gap-2`}>
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={15}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A94] pointer-events-none"
          />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Client, téléphone, parfum, numéro de commande"
            className={`${CHAMP_LOCAL} pl-9`}
            aria-label="Rechercher une commande"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            aria-label="Filtrer par statut"
            className={`${CHAMP_LOCAL} flex-1 lg:w-[160px]`}
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filtreQui}
            onChange={(e) => setFiltreQui(e.target.value)}
            aria-label="Filtrer par gestionnaire"
            className={`${CHAMP_LOCAL} flex-1 lg:w-[150px]`}
          >
            <option value="">Tout le monde</option>
            {gestionnaires.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <label
          className={`flex items-center gap-2 min-h-[42px] px-3 rounded-lg cursor-pointer text-[12px] shrink-0 ${
            seulementAFaire
              ? "bg-[#FDF1DC] text-[#9A5B00] border border-[#EBD6AE]"
              : "bg-white text-[#6B6B6B] border border-[#DCDCD5]"
          }`}
        >
          <input
            type="checkbox"
            checked={seulementAFaire}
            onChange={(e) => setSeulementAFaire(e.target.checked)}
            className="w-4 h-4 accent-[#C9A84C]"
          />
          Seulement ce qu&apos;il y a à faire
        </label>
      </div>

      {/* ───────────────────────────────── compteurs */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 px-1 text-[11px] text-[#8A8A84]">
        <span>
          Commandes affichées{" "}
          <strong className="text-[#111111] tabular-nums font-semibold">{compteurs.nombre}</strong>
        </span>
        <span>
          Total client cumulé{" "}
          <strong className="text-[#111111] tabular-nums font-semibold">
            {formatDA(compteurs.total)}
          </strong>
        </span>
        <span>
          Marge cumulée{" "}
          <strong className={`tabular-nums font-semibold ${couleurMarge(compteurs.marge)}`}>
            {formatDA(compteurs.marge)}
          </strong>
        </span>
      </div>

      {/* ───────────────────────────────── liste */}
      <Carte>
        {visibles.length === 0 ? (
          <Vide
            texte={
              base.commandes.length === 0
                ? "Aucune commande enregistrée. Utilisez le bouton Nouvelle commande."
                : "Aucune commande ne correspond à cette recherche. Videz le champ ou remettez les filtres sur tous les statuts."
            }
          />
        ) : (
          <>
            {/* Tableau dense, à partir du portable posé sur un bureau */}
            <div className="hidden lg:block">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-[#F6F6F2] text-[10px] uppercase tracking-[0.1em] text-[#6B6B6B]">
                    <th className="text-left font-semibold px-3 py-2">{"N°"}</th>
                    <th className="text-left font-semibold px-3 py-2">Date</th>
                    <th className="text-left font-semibold px-3 py-2">Statut</th>
                    <th className="text-left font-semibold px-3 py-2">Client</th>
                    <th className="text-left font-semibold px-3 py-2">Téléphone</th>
                    <th className="text-left font-semibold px-3 py-2">Wilaya</th>
                    <th className="text-left font-semibold px-3 py-2">Parfum</th>
                    <th className="text-right font-semibold px-3 py-2">Total client</th>
                    <th className="text-right font-semibold px-3 py-2">Marge</th>
                    <th className="text-left font-semibold px-3 py-2">À faire</th>
                    <th className="text-left font-semibold px-3 py-2">Qui gère</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map(({ c, k }) => (
                    <tr
                      key={c.id}
                      tabIndex={0}
                      onClick={() => ouvrir(c, "edition")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") ouvrir(c, "edition");
                      }}
                      className="border-t border-[#EFEFEA] cursor-pointer hover:bg-[#FAFAF8] focus:bg-[#FAFAF8] focus:outline-none"
                    >
                      <td className="px-3 py-2 text-[11px] text-[#8A8A84] tabular-nums whitespace-nowrap">
                        {k.numero}
                      </td>
                      <td className="px-3 py-2 tabular-nums whitespace-nowrap text-[#4A4A4A]">
                        {formatDate(c.date)}
                      </td>
                      <td className="px-3 py-2">
                        <SelectStatut
                          valeur={c.statut}
                          onChange={(s) => changerStatutDansListe(c, s)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1.5 max-w-[190px]">
                          <span className="font-medium text-[#111111] truncate min-w-0">
                            {c.client}
                          </span>
                          {k.fidele && <Etiquette ton="ok">Fidèle</Etiquette>}
                        </span>
                      </td>
                      <td className="px-3 py-2 tabular-nums whitespace-nowrap text-[#4A4A4A]">
                        {c.telephone || "—"}
                      </td>
                      <td className="px-3 py-2 text-[#4A4A4A] whitespace-nowrap">
                        {c.wilaya || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span className="block max-w-[200px] truncate text-[#4A4A4A]">
                          {c.parfum || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold text-[#111111] whitespace-nowrap">
                        {formatDA(k.totalClient)}
                      </td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums font-semibold whitespace-nowrap ${couleurMarge(
                          k.marge,
                        )}`}
                      >
                        {formatDA(k.marge)}
                      </td>
                      <td className={`px-3 py-2 ${couleurAlerte(k.gravite)}`}>
                        <span className="block max-w-[180px] truncate" title={k.aFaire}>
                          {k.aFaire || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[#4A4A4A] whitespace-nowrap">
                        {c.quiGere || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cartes empilées : c'est la vue de tous les jours sur téléphone */}
            <div className="lg:hidden divide-y divide-[#EFEFEA]">
              {visibles.map(({ c, k }) => (
                <article key={c.id}>
                  <button
                    type="button"
                    onClick={() => ouvrir(c, "edition")}
                    className="w-full text-left px-3 pt-3 pb-2"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-[#111111] truncate">
                          {c.client || "Sans nom"}
                        </span>
                        <span className="block text-[11px] text-[#8A8A84] tabular-nums">
                          {k.numero} · {formatDate(c.date)} · {c.wilaya || "wilaya à saisir"}
                        </span>
                      </span>
                      <Pastille statut={c.statut} />
                    </span>

                    <span className="block text-[12px] text-[#4A4A4A] mt-2 truncate">
                      {c.parfum || "Parfum à saisir"}
                    </span>

                    <span className="flex items-center gap-3 mt-1.5 text-[12px]">
                      <span className="tabular-nums font-semibold text-[#111111]">
                        {formatDA(k.totalClient)}
                      </span>
                      <span className={`tabular-nums font-semibold ${couleurMarge(k.marge)}`}>
                        Marge {formatDA(k.marge)}
                      </span>
                      {k.fidele && <Etiquette ton="ok">Fidèle</Etiquette>}
                    </span>

                    {k.aFaire && (
                      <span className={`block text-[12px] mt-2 font-medium ${couleurAlerte(k.gravite)}`}>
                        {k.aFaire}
                      </span>
                    )}
                  </button>

                  <div className="px-3 pb-3 flex items-center justify-between gap-2">
                    {c.telephone ? (
                      <a
                        href={`tel:${telPropre(c.telephone)}`}
                        className="min-h-[40px] flex items-center px-3 rounded-lg border border-[#DCDCD5] text-[12px] tabular-nums text-[#111111]"
                      >
                        {c.telephone}
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#9A9A94]">Téléphone à saisir</span>
                    )}
                    <SelectStatut
                      valeur={c.statut}
                      grand
                      onChange={(s) => changerStatutDansListe(c, s)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Carte>

      {/* ───────────────────────────────── panneau de saisie */}
      {brouillon && calculsBrouillon && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-[#111111]/40"
            onClick={fermer}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Fiche commande"
            className="absolute inset-y-0 right-0 w-full sm:w-[480px] bg-white flex flex-col shadow-[0_0_40px_rgba(17,17,17,0.18)]"
          >
            <header className="flex items-center justify-between gap-3 px-4 sm:px-5 h-14 border-b border-[#E9E9E4] shrink-0">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#111111] truncate">
                  {mode === "creation" ? "Nouvelle commande" : brouillon.client || "Commande"}
                </p>
                <p className="text-[10px] text-[#8A8A84] tabular-nums">{calculsBrouillon.numero}</p>
              </div>
              <button
                type="button"
                onClick={fermer}
                aria-label="Fermer la fiche"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F2F2EF]"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-6">
              <Bouton
                variante="secondaire"
                onClick={() => {
                  void copierMessage();
                }}
                className="w-full min-h-[42px] flex items-center justify-center gap-2"
              >
                {copie === "oui" ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={1.8} />}
                {copie === "oui"
                  ? "Message copié"
                  : copie === "echec"
                    ? "Copie refusée par le navigateur"
                    : "Copier le message WhatsApp"}
              </Bouton>

              <section>
                <TitreSection>Suivi</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <Champ
                    label="Date de la commande"
                    type="date"
                    value={brouillon.date}
                    onChange={(v) => majChamp({ date: v })}
                  />
                  <ListeObligatoire
                    label="Statut"
                    value={brouillon.statut}
                    options={STATUTS}
                    onChange={(v) => majChamp({ statut: v })}
                  />
                  <div className="col-span-2">
                    <Champ
                      label="Client"
                      value={brouillon.client}
                      onChange={(v) => majChamp({ client: v })}
                      placeholder="Nom et prénom"
                    />
                  </div>
                  <Champ
                    label="Téléphone"
                    value={brouillon.telephone}
                    inputMode="tel"
                    onChange={(v) => majChamp({ telephone: v })}
                    placeholder="07 00 00 00 00"
                  />
                  <Liste
                    label="Qui gère"
                    value={brouillon.quiGere}
                    options={gestionnaires}
                    vide="À attribuer"
                    onChange={(v) => majChamp({ quiGere: v })}
                  />
                </div>
              </section>

              <section>
                <TitreSection>Livraison client</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <Liste
                    label="Wilaya"
                    value={brouillon.wilaya}
                    options={WILAYAS}
                    vide="À choisir"
                    onChange={(v) => majChamp({ wilaya: v })}
                  />
                  <Champ
                    label="Commune ou adresse"
                    value={brouillon.commune}
                    onChange={(v) => majChamp({ commune: v })}
                  />
                  <div className="col-span-2">
                    <Liste
                      label="Mode de livraison"
                      value={brouillon.livraison}
                      options={MODES_LIVRAISON}
                      vide="À choisir"
                      onChange={(v) => majChamp({ livraison: v as ModeLivraison })}
                    />
                  </div>
                </div>
              </section>

              <section>
                <TitreSection>Ce que le client paie</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Champ
                      label="Parfum"
                      value={brouillon.parfum}
                      onChange={(v) => majChamp({ parfum: v })}
                      placeholder="Marque, nom, contenance"
                      aide="Texte libre : beaucoup de parfums vendus ne sont pas sur le site."
                    />
                  </div>
                  <Champ
                    label="Quantité"
                    value={textes.quantite}
                    inputMode="numeric"
                    onChange={(v) => majNombre("quantite", v)}
                    placeholder="1"
                  />
                  <Champ
                    label="Prix de vente unitaire"
                    value={textes.prixVente}
                    inputMode="numeric"
                    onChange={(v) => majNombre("prixVente", v)}
                    placeholder="0"
                  />
                  <Champ
                    label="Remise"
                    value={textes.remise}
                    inputMode="numeric"
                    onChange={(v) => majNombre("remise", v)}
                    placeholder="0"
                  />
                  <Champ
                    label="Livraison facturée"
                    value={textes.livraisonFacturee}
                    inputMode="numeric"
                    onChange={(v) => majNombre("livraisonFacturee", v)}
                    placeholder="0"
                  />
                  <div className="col-span-2">
                    <Champ
                      label="Total client"
                      value={formatDA(calculsBrouillon.totalClient)}
                      calcule
                      aide="Prix de vente fois la quantité, moins la remise, plus la livraison facturée."
                    />
                  </div>
                </div>
              </section>

              <section>
                <TitreSection>Ce que ça nous coûte</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <Champ
                    label="Achat fournisseur"
                    value={textes.achatFournisseur}
                    inputMode="numeric"
                    onChange={(v) => majNombre("achatFournisseur", v)}
                    placeholder="Non renseigné"
                    aide="Laisser vide tant que le parfum n'est pas acheté."
                  />
                  <Liste
                    label="Fournisseur"
                    value={brouillon.fournisseur}
                    options={base.reglages.fournisseurs}
                    vide="À choisir"
                    onChange={(v) => majChamp({ fournisseur: v })}
                  />
                  <Champ
                    label="Frais de livraison payés"
                    value={textes.fraisLivraisonPayes}
                    inputMode="numeric"
                    onChange={(v) => majNombre("fraisLivraisonPayes", v)}
                    placeholder="Non renseigné"
                    aide="Ce qui part chez Yalidine, aller et retour compris."
                  />
                  <Champ
                    label="Autres frais"
                    value={textes.autresFrais}
                    inputMode="numeric"
                    onChange={(v) => majNombre("autresFrais", v)}
                    placeholder="0"
                  />
                </div>
              </section>

              <section>
                <TitreSection>Colis Yalidine</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Champ
                      label="Numéro de suivi"
                      value={brouillon.suivi}
                      onChange={(v) => majChamp({ suivi: v })}
                    />
                  </div>
                  <Champ
                    label="Date d'envoi"
                    type="date"
                    value={brouillon.dateEnvoi}
                    onChange={(v) => majChamp({ dateEnvoi: v })}
                  />
                  <Champ
                    label="Date de livraison"
                    type="date"
                    value={brouillon.dateLivraison}
                    onChange={(v) => majChamp({ dateLivraison: v })}
                  />
                  <div className="col-span-2">
                    <Champ
                      label="Date d'argent reçu"
                      type="date"
                      value={brouillon.dateArgentRecu}
                      onChange={(v) => majChamp({ dateArgentRecu: v })}
                      aide="Livrée ne veut pas dire payée : l'argent reste chez Yalidine jusqu'à 15 jours."
                    />
                  </div>
                </div>
              </section>

              <section>
                <TitreSection>Infos</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <Liste
                    label="Source"
                    value={brouillon.source}
                    options={base.reglages.sources}
                    vide="À choisir"
                    onChange={(v) => majChamp({ source: v })}
                  />
                  <Champ
                    label="Relances"
                    value={textes.relances}
                    inputMode="numeric"
                    onChange={(v) => majNombre("relances", v)}
                    placeholder="0"
                  />
                  {montrerMotif && (
                    <div className="col-span-2">
                      <Liste
                        label="Motif d'arrêt"
                        value={brouillon.motif}
                        options={MOTIFS}
                        vide="À choisir"
                        onChange={(v) => majChamp({ motif: v })}
                        aide="Une commande qui n'aboutit pas garde son statut et son motif, elle ne se supprime pas."
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <ZoneTexte
                      label="Note"
                      value={brouillon.note}
                      onChange={(v) => majChamp({ note: v })}
                    />
                  </div>
                </div>
              </section>

              <section>
                <TitreSection>Calculé</TitreSection>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Champ
                      label="Encaissé"
                      value={formatDA(calculsBrouillon.encaisse)}
                      calcule
                    />
                  </div>
                  <Champ label="Marge" value={formatDA(calculsBrouillon.marge)} calcule />
                  <Champ label="Marge %" value={formatPct(calculsBrouillon.margePct)} calcule />
                </div>
                <div className="mt-3 rounded-lg bg-[#F6F6F2] px-3 py-2.5 space-y-1.5">
                  <p className="text-[11px] text-[#4A4A4A] leading-relaxed">
                    Encaissé = le total client, uniquement quand la commande est Livrée ou Encaissée.
                  </p>
                  <p className="text-[11px] text-[#4A4A4A] leading-relaxed">
                    Marge = encaissé, moins le prix d&apos;achat (seulement si Livrée ou Encaissée),
                    moins les frais de livraison payés, moins les autres frais.
                  </p>
                  <p className="text-[11px] text-[#4A4A4A] leading-relaxed">
                    Sur un retour le prix d&apos;achat n&apos;est pas déduit, le flacon revient et
                    sera revendu, mais les frais restent à notre charge.
                  </p>
                </div>
                {calculsBrouillon.aFaire && (
                  <p className={`text-[12px] mt-3 font-medium ${couleurAlerte(calculsBrouillon.gravite)}`}>
                    {calculsBrouillon.aFaire}
                  </p>
                )}
              </section>
            </div>

            <footer className="border-t border-[#E9E9E4] px-4 sm:px-5 py-3 shrink-0 space-y-2">
              {erreur && (
                <p className="text-[11px] text-[#B3261E] bg-[#FBE7E5] rounded-lg px-3 py-2">
                  {erreur}
                </p>
              )}

              {confirmeSuppression ? (
                <div className="bg-[#FBE7E5] rounded-lg px-3 py-2.5">
                  <p className="text-[11px] text-[#B3261E] leading-relaxed">
                    Supprimer définitivement cette commande ? Une commande qui n&apos;aboutit pas se
                    garde plutôt en statut Annulée avec son motif.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Bouton variante="danger" onClick={supprimer} className="min-h-[42px] flex-1">
                      Oui, supprimer
                    </Bouton>
                    <Bouton
                      variante="secondaire"
                      onClick={() => setConfirmeSuppression(false)}
                      className="min-h-[42px] flex-1"
                    >
                      Non, garder
                    </Bouton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Bouton onClick={enregistrer} className="min-h-[44px] flex-1 min-w-[130px]">
                    Enregistrer
                  </Bouton>
                  <Bouton variante="secondaire" onClick={fermer} className="min-h-[44px]">
                    Annuler
                  </Bouton>
                  {mode === "edition" && (
                    <Bouton
                      variante="danger"
                      onClick={() => setConfirmeSuppression(true)}
                      className="min-h-[44px] flex items-center gap-1.5"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                      Supprimer
                    </Bouton>
                  )}
                </div>
              )}
            </footer>
          </aside>
        </div>
      )}
    </div>
  );
}
