"use client";

// Panneau de détail d'une commande : plein écran sur téléphone, panneau latéral
// sur grand écran. Tout ce dont on a besoin pour traiter la commande est là, et
// rien n'est à aller chercher ailleurs : la photo du parfum, le numéro du client
// cliquable, l'adresse prête à coller dans Yalidine.
//
// Ce qui se tape vraiment ne concerne qu'un seul bloc, « ce que ça nous coûte ».
// Les montants saisis restent dans un état local pour que le champ puisse être
// vide pendant la frappe ; l'enregistrement part à la sortie du champ, au clic
// sur Enregistrer, ou à la fermeture du panneau si quelque chose reste en attente.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Check, Copy, MessageCircle, Phone, X } from "lucide-react";
import type { CommandeServeur } from "@/lib/tdb/commandes-serveur";
import { calculerLigne, estVendue } from "@/lib/tdb/calculs-commande";
import { lienTel, lienWhatsapp, messageClient } from "@/lib/tdb/contact";
import { formatDA, formatDate, formatPct } from "@/lib/tdb/calculs";
import { COULEUR_STATUT, MOTIFS } from "@/lib/tdb/constantes";
import { STATUTS } from "@/lib/tdb/types";
import type { Statut } from "@/lib/tdb/types";
import type { useCommandes } from "./useCommandes";
import { Bouton, Carte, Etiquette, Pastille, TitreBloc, Vide } from "./ui";

// ───────────────────────────────────────────────────────── champs de saisie

interface Saisie {
  achatFournisseur: string;
  fournisseur: string;
  fraisLivraisonPayes: string;
  autresFrais: string;
  remise: string;
  suivi: string;
  dateEnvoi: string;
  dateLivraison: string;
  dateArgentRecu: string;
  quiGere: string;
  relances: string;
  motif: string;
  noteInterne: string;
}

type CleSaisie = keyof Saisie;

const CLES: CleSaisie[] = [
  "achatFournisseur",
  "fournisseur",
  "fraisLivraisonPayes",
  "autresFrais",
  "remise",
  "suivi",
  "dateEnvoi",
  "dateLivraison",
  "dateArgentRecu",
  "quiGere",
  "relances",
  "motif",
  "noteInterne",
];

/** Les statuts pour lesquels on veut savoir pourquoi la commande s'est arrêtée. */
const STATUTS_A_MOTIF = ["Annulée", "Retour", "Injoignable", "Rupture fournisseur"];

function texteNombre(n: number | null, zeroVide: boolean): string {
  if (n === null || !Number.isFinite(n)) return "";
  if (n === 0 && zeroVide) return "";
  return String(n);
}

function depuisCommande(c: CommandeServeur): Saisie {
  return {
    // Un achat à 0 n'est pas un achat inconnu : on garde le zéro affiché.
    achatFournisseur: texteNombre(c.achatFournisseur, false),
    fournisseur: c.fournisseur,
    fraisLivraisonPayes: texteNombre(c.fraisLivraisonPayes, false),
    autresFrais: texteNombre(c.autresFrais, true),
    remise: texteNombre(c.remise, true),
    suivi: c.suivi,
    dateEnvoi: c.dateEnvoi,
    dateLivraison: c.dateLivraison,
    dateArgentRecu: c.dateArgentRecu,
    quiGere: c.quiGere,
    relances: texteNombre(c.relances, true),
    motif: c.motif,
    noteInterne: c.noteInterne,
  };
}

/** Champ vide = on ne sait pas encore. */
function nombreOuNull(texte: string): number | null {
  const net = texte.replace(/\s/g, "").replace(",", ".");
  if (!net) return null;
  const n = Number(net);
  return Number.isFinite(n) ? n : null;
}

/** Champ vide = il n'y a rien eu. */
function nombreOuZero(texte: string): number {
  return nombreOuNull(texte) ?? 0;
}

function valeurSaisie(cle: CleSaisie, s: Saisie): unknown {
  switch (cle) {
    case "achatFournisseur":
      return nombreOuNull(s.achatFournisseur);
    case "fraisLivraisonPayes":
      return nombreOuNull(s.fraisLivraisonPayes);
    case "autresFrais":
      return nombreOuZero(s.autresFrais);
    case "remise":
      return nombreOuZero(s.remise);
    case "relances":
      return Math.max(0, Math.round(nombreOuZero(s.relances)));
    default:
      return s[cle].trim();
  }
}

function valeurEnBase(cle: CleSaisie, c: CommandeServeur): unknown {
  switch (cle) {
    case "achatFournisseur":
      return c.achatFournisseur;
    case "fraisLivraisonPayes":
      return c.fraisLivraisonPayes;
    case "autresFrais":
      return c.autresFrais;
    case "remise":
      return c.remise;
    case "relances":
      return c.relances;
    default:
      return c[cle];
  }
}

function changements(c: CommandeServeur, s: Saisie): Record<string, unknown> {
  const diff: Record<string, unknown> = {};
  for (const cle of CLES) {
    const apres = valeurSaisie(cle, s);
    if (apres !== valeurEnBase(cle, c)) diff[cle] = apres;
  }
  return diff;
}

// ──────────────────────────────────────────────────────────────── utilitaires

/** 25/11/2026 à 14:32, à l'heure d'Alger. */
function dateHeure(iso: string): string {
  if (!iso) return "Date inconnue";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return formatDate(iso.slice(0, 10));
  const options = { timeZone: "Africa/Algiers" } as const;
  const jour = d.toLocaleDateString("fr-FR", {
    ...options,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const heure = d.toLocaleTimeString("fr-FR", {
    ...options,
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${jour} à ${heure}`;
}

function jourISO(v: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

function couleurStatut(statut: string): [string, string] {
  const table = COULEUR_STATUT as Record<string, [string, string]>;
  return table[statut] ?? ["#EFEFEC", "#6B6B6B"];
}

async function copierTexte(texte: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texte);
      return true;
    }
  } catch {
    // Presse-papiers refusé : on tente la méthode de secours juste en dessous.
  }
  try {
    const zone = document.createElement("textarea");
    zone.value = texte;
    zone.setAttribute("readonly", "");
    zone.style.position = "fixed";
    zone.style.top = "-1000px";
    document.body.appendChild(zone);
    zone.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(zone);
    return ok;
  } catch {
    return false;
  }
}

/** Retour visuel qui s'éteint tout seul au bout de deux secondes. */
function useRetourCourt(): [boolean, () => void] {
  const [actif, setActif] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    },
    [],
  );
  const declencher = useCallback(() => {
    setActif(true);
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setActif(false), 2000);
  }, []);
  return [actif, declencher];
}

// ────────────────────────────────────────────────────────── briques locales
// Les champs de ui.tsx font 34 px de haut et n'ont pas de onBlur : ici on a
// besoin de zones tactiles de 44 px et d'un enregistrement à la sortie du champ.

const SAISIE =
  "w-full min-h-[48px] rounded-lg border border-[#DCDCD5] bg-white px-3 text-[16px] " +
  "text-[#111111] transition focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/25";

function ChampCadre({
  label,
  aide,
  children,
}: {
  label: string;
  aide?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[#6B6B6B]">{label}</span>
      {children}
      {aide && <span className="mt-1 block text-[11px] text-[#9A9A94]">{aide}</span>}
    </label>
  );
}

function Montant({
  label,
  valeur,
  aide,
  surSaisie,
  surSortie,
}: {
  label: string;
  valeur: string;
  aide?: string;
  surSaisie: (v: string) => void;
  surSortie: () => void;
}) {
  return (
    <ChampCadre label={label} aide={aide}>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={valeur}
          placeholder="0"
          onChange={(e) => surSaisie(e.target.value)}
          onBlur={surSortie}
          className={`${SAISIE} pr-11 tabular-nums`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#9A9A94]">
          DA
        </span>
      </div>
    </ChampCadre>
  );
}

function Texte({
  label,
  valeur,
  aide,
  placeholder,
  surSaisie,
  surSortie,
}: {
  label: string;
  valeur: string;
  aide?: string;
  placeholder?: string;
  surSaisie: (v: string) => void;
  surSortie: () => void;
}) {
  return (
    <ChampCadre label={label} aide={aide}>
      <input
        type="text"
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => surSaisie(e.target.value)}
        onBlur={surSortie}
        className={SAISIE}
      />
    </ChampCadre>
  );
}

function Jour({
  label,
  valeur,
  surSaisie,
  surSortie,
}: {
  label: string;
  valeur: string;
  surSaisie: (v: string) => void;
  surSortie: () => void;
}) {
  return (
    <ChampCadre label={label}>
      <input
        type="date"
        value={jourISO(valeur)}
        onChange={(e) => surSaisie(e.target.value)}
        onBlur={surSortie}
        className={SAISIE}
      />
    </ChampCadre>
  );
}

function Choix({
  label,
  valeur,
  options,
  vide,
  aide,
  surChoix,
}: {
  label: string;
  valeur: string;
  options: readonly string[];
  vide: string;
  aide?: string;
  surChoix: (v: string) => void;
}) {
  return (
    <ChampCadre label={label} aide={aide}>
      <select
        value={valeur}
        onChange={(e) => surChoix(e.target.value)}
        className={SAISIE}
      >
        <option value="">{vide}</option>
        {options.filter(Boolean).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </ChampCadre>
  );
}

function Note({
  label,
  valeur,
  aide,
  surSaisie,
  surSortie,
}: {
  label: string;
  valeur: string;
  aide?: string;
  surSaisie: (v: string) => void;
  surSortie: () => void;
}) {
  return (
    <ChampCadre label={label} aide={aide}>
      <textarea
        value={valeur}
        rows={3}
        onChange={(e) => surSaisie(e.target.value)}
        onBlur={surSortie}
        className={`${SAISIE} resize-y py-2.5 leading-relaxed`}
      />
    </ChampCadre>
  );
}

function LigneLecture({ label, valeur }: { label: string; valeur: string }) {
  if (!valeur) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className="w-[108px] shrink-0 text-[12px] text-[#8A8A84]">{label}</span>
      <span className="flex-1 text-[15px] leading-snug text-[#111111]">{valeur}</span>
    </div>
  );
}

/** Les trois chiffres calculés, en vert clair, jamais saisis. */
function LigneCalculee({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] font-medium text-[#1E7A45]">{label}</span>
      <span className="text-[20px] font-semibold tabular-nums text-[#111111]">
        {valeur}
      </span>
    </div>
  );
}

function LigneArgent({
  label,
  valeur,
  fort,
}: {
  label: string;
  valeur: string;
  fort?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 ${
        fort ? "mt-1 border-t border-[#E9E9E4] pt-3" : ""
      }`}
    >
      <span
        className={
          fort
            ? "text-[14px] font-semibold text-[#111111]"
            : "text-[13px] text-[#6B6B6B]"
        }
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          fort
            ? "text-[22px] font-semibold text-[#111111]"
            : "text-[14px] text-[#111111]"
        }`}
      >
        {valeur}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────── le panneau

export default function FicheCommande({
  commande,
  etat,
  fermer,
}: {
  commande: CommandeServeur;
  etat: ReturnType<typeof useCommandes>;
  fermer: () => void;
}) {
  const [brouillon, setBrouillon] = useState<Saisie>(() => depuisCommande(commande));
  const [copie, signalerCopie] = useRetourCourt();
  const [echecCopie, signalerEchecCopie] = useRetourCourt();
  const [enregistre, signalerEnregistre] = useRetourCourt();
  const idAffiche = useRef(commande.id);

  // La liste se rafraîchit toute seule toutes les 25 secondes : on ne remplace
  // la saisie en cours que si le panneau change de commande.
  useEffect(() => {
    if (idAffiche.current !== commande.id) {
      idAffiche.current = commande.id;
      setBrouillon(depuisCommande(commande));
    }
  }, [commande]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [fermer]);

  // Pas de défilement de la page derrière le panneau, et on remet exactement
  // la valeur qui était en place avant de l'ouvrir.
  useEffect(() => {
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, []);

  const calculs = calculerLigne(commande, { commandes: etat.commandes });
  const diff = changements(commande, brouillon);
  const aDesChangements = Object.keys(diff).length > 0;
  const tel = commande.telephone.trim();
  const [fondStatut, texteStatut] = couleurStatut(commande.statut);
  const motifAttendu = STATUTS_A_MOTIF.includes(commande.statut);

  function majChamp(cle: CleSaisie, valeur: string) {
    setBrouillon((v) => ({ ...v, [cle]: valeur }));
  }

  function enregistrerChamp(cle: CleSaisie) {
    const apres = valeurSaisie(cle, brouillon);
    if (apres === valeurEnBase(cle, commande)) return;
    void etat.modifier(commande.id, { [cle]: apres });
  }

  /** Une liste déroulante n'a pas de frappe en cours : on enregistre tout de suite. */
  function choisir(cle: CleSaisie, valeur: string) {
    const suivant: Saisie = { ...brouillon, [cle]: valeur };
    setBrouillon(suivant);
    const apres = valeurSaisie(cle, suivant);
    if (apres !== valeurEnBase(cle, commande)) {
      void etat.modifier(commande.id, { [cle]: apres });
    }
  }

  function pousser(avecRetour: boolean) {
    const aEnvoyer = changements(commande, brouillon);
    if (Object.keys(aEnvoyer).length) void etat.modifier(commande.id, aEnvoyer);
    if (avecRetour) signalerEnregistre();
  }

  // Filet de sécurité : ce qui a été tapé sans sortir du champ part quand même
  // à la fermeture du panneau.
  const refPousser = useRef<(avecRetour: boolean) => void>(pousser);
  useEffect(() => {
    refPousser.current = pousser;
  });
  useEffect(
    () => () => {
      refPousser.current(false);
    },
    [],
  );

  function changerStatut(statut: string) {
    if (statut === commande.statut) return;
    void etat.modifier(commande.id, { statut });
  }

  const adresseComplete = [commande.adresse, commande.commune]
    .map((x) => x.trim())
    .filter(Boolean)
    .join(", ");

  const blocYalidine = [commande.client, tel, adresseComplete, commande.wilaya]
    .map((x) => (x || "").trim())
    .filter(Boolean)
    .join("\n");

  async function copierAdresse() {
    const ok = await copierTexte(blocYalidine);
    if (ok) signalerCopie();
    else signalerEchecCopie();
  }

  const lienClient = lienWhatsapp(
    tel,
    messageClient({
      numero: commande.numero,
      client: commande.client,
      articles: commande.articles,
      total: calculs.totalClient,
    }),
  );

  const styleContact =
    "flex min-h-[52px] items-center justify-center gap-2 rounded-lg px-3 text-[14px] font-semibold transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fermer le détail"
        onClick={fermer}
        className="absolute inset-0 bg-[#111111]/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Commande ${commande.numero}`}
        className="relative z-10 flex h-full max-h-full w-full flex-col bg-[#FAFAF8] shadow-2xl lg:w-[560px] lg:border-l lg:border-[#E9E9E4]"
      >
        {/* ─────────── en-tête */}
        <header className="shrink-0 border-b border-[#E9E9E4] bg-white px-4 py-3 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-libre-bodoni)] text-[21px] leading-tight text-[#111111]">
                {commande.numero || "Commande"}
              </p>
              <p className="mt-0.5 text-[12px] text-[#8A8A84]">
                {dateHeure(commande.creeLe)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Pastille statut={commande.statut as Statut} />
              <button
                type="button"
                onClick={fermer}
                aria-label="Fermer"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F2F2EF] hover:text-[#111111]"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>
          </div>
          {calculs.aFaire && (
            <div className="mt-2.5">
              <Etiquette ton={calculs.gravite === "risque" ? "risque" : "info"}>
                {calculs.aFaire}
              </Etiquette>
            </div>
          )}
        </header>

        {/* ─────────── contenu */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
          {/* 1. le client */}
          <section>
            <TitreBloc aide="Appelez ou écrivez sans retaper le numéro.">
              Le client
            </TitreBloc>
            <Carte className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[19px] font-semibold leading-tight text-[#111111]">
                  {commande.client || "Nom non renseigné"}
                </p>
                {calculs.fidele && <Etiquette ton="ok">Client fidèle</Etiquette>}
              </div>
              <p className="mt-1 text-[17px] tabular-nums text-[#111111]">
                {tel || "Pas de numéro"}
              </p>

              <div className="mt-4 space-y-2">
                <LigneLecture label="Wilaya" valeur={commande.wilaya} />
                <LigneLecture label="Commune" valeur={commande.commune} />
                <LigneLecture label="Adresse" valeur={commande.adresse} />
                <LigneLecture label="Livraison" valeur={commande.modeLivraison} />
                <LigneLecture label="Source" valeur={commande.source} />
              </div>

              {commande.noteClient && (
                <div className="mt-4 rounded-lg bg-[#F6EFDD] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B6914]">
                    Message du client
                  </p>
                  <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-[#111111]">
                    {commande.noteClient}
                  </p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                {tel ? (
                  <>
                    <a
                      href={lienTel(tel)}
                      className={`${styleContact} bg-[#111111] text-white hover:bg-[#2C2C2C]`}
                    >
                      <Phone size={17} strokeWidth={2} />
                      Appeler
                    </a>
                    <a
                      href={lienClient}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styleContact} bg-[#25D366] text-[#111111] hover:brightness-95`}
                    >
                      <MessageCircle size={17} strokeWidth={2} />
                      WhatsApp
                    </a>
                  </>
                ) : (
                  <p className="col-span-2 rounded-lg bg-[#FBE7E5] px-3 py-3 text-[13px] text-[#B3261E]">
                    {"Aucun numéro sur cette commande : impossible d'appeler le client."}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void copierAdresse()}
                  className={`${styleContact} col-span-2 border ${
                    copie
                      ? "border-[#BFE3CC] bg-[#E4F4EA] text-[#1E7A45]"
                      : echecCopie
                        ? "border-[#E8C9C6] bg-[#FBE7E5] text-[#B3261E]"
                        : "border-[#D9D9D2] bg-white text-[#111111] hover:border-[#C9A84C] hover:text-[#8B6914]"
                  }`}
                >
                  {copie ? (
                    <Check size={17} strokeWidth={2} />
                  ) : (
                    <Copy size={17} strokeWidth={2} />
                  )}
                  {copie
                    ? "Adresse copiée"
                    : echecCopie
                      ? "Copie impossible"
                      : "Copier l'adresse pour Yalidine"}
                </button>
              </div>
            </Carte>
          </section>

          {/* 2. la commande */}
          <section className="mt-7">
            <TitreBloc aide="Ce que le client a choisi et ce qu'il doit payer.">
              La commande
            </TitreBloc>
            <Carte>
              {commande.articles.length ? (
                <ul className="divide-y divide-[#E9E9E4]">
                  {commande.articles.map((a, i) => (
                    <li
                      key={`${a.slug}-${i}`}
                      className="flex items-center gap-3 px-4 py-3 sm:px-5"
                    >
                      <div className="relative h-[96px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-[#E9E9E4] bg-white">
                        {a.image && (
                          <Image
                            src={a.image}
                            alt=""
                            fill
                            sizes="72px"
                            className="object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B6914]">
                          {a.marque}
                        </p>
                        <p className="mt-0.5 text-[15px] leading-snug text-[#111111]">
                          {a.nom}
                        </p>
                        <p className="mt-1 text-[13px] tabular-nums text-[#6B6B6B]">
                          {a.qte} x {formatDA(a.prix)}
                        </p>
                      </div>
                      <p className="shrink-0 text-[15px] font-semibold tabular-nums text-[#111111]">
                        {formatDA(a.prix * a.qte)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Vide texte="Aucun parfum enregistré sur cette commande." />
              )}

              <div className="space-y-2 border-t border-[#E9E9E4] px-4 py-4 sm:px-5">
                <LigneArgent label="Parfums" valeur={formatDA(commande.totalProduits)} />
                {commande.remise > 0 && (
                  <LigneArgent label="Remise" valeur={`- ${formatDA(commande.remise)}`} />
                )}
                <LigneArgent
                  label="Livraison facturée"
                  valeur={
                    commande.fraisLivraison > 0
                      ? formatDA(commande.fraisLivraison)
                      : "Offerte"
                  }
                />
                <LigneArgent
                  label="Total à encaisser"
                  valeur={formatDA(calculs.totalClient)}
                  fort
                />
              </div>
            </Carte>
          </section>

          {/* 3. ce que ça nous coûte */}
          <section className="mt-7">
            <TitreBloc aide="La seule partie à remplir à la main.">
              Ce que ça nous coûte
            </TitreBloc>
            <Carte className="p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Montant
                  label="Achat fournisseur"
                  valeur={brouillon.achatFournisseur}
                  aide="Laisser vide tant que le parfum n'est pas acheté."
                  surSaisie={(v) => majChamp("achatFournisseur", v)}
                  surSortie={() => enregistrerChamp("achatFournisseur")}
                />
                <Texte
                  label="Fournisseur"
                  valeur={brouillon.fournisseur}
                  placeholder="Chez qui"
                  surSaisie={(v) => majChamp("fournisseur", v)}
                  surSortie={() => enregistrerChamp("fournisseur")}
                />
                <Montant
                  label="Frais de livraison payés"
                  valeur={brouillon.fraisLivraisonPayes}
                  aide="Ce que Yalidine nous prend, retour compris."
                  surSaisie={(v) => majChamp("fraisLivraisonPayes", v)}
                  surSortie={() => enregistrerChamp("fraisLivraisonPayes")}
                />
                <Montant
                  label="Autres frais"
                  valeur={brouillon.autresFrais}
                  aide="Emballage, transfert, essence."
                  surSaisie={(v) => majChamp("autresFrais", v)}
                  surSortie={() => enregistrerChamp("autresFrais")}
                />
                <Montant
                  label="Remise accordée"
                  valeur={brouillon.remise}
                  aide="Elle baisse le total que le client paie."
                  surSaisie={(v) => majChamp("remise", v)}
                  surSortie={() => enregistrerChamp("remise")}
                />
              </div>

              <div className="mt-5 space-y-2.5 rounded-lg bg-[#E4F4EA] px-4 py-4">
                <LigneCalculee label="Encaissé" valeur={formatDA(calculs.encaisse)} />
                <LigneCalculee label="Marge" valeur={formatDA(calculs.marge)} />
                <LigneCalculee label="Marge %" valeur={formatPct(calculs.margePct)} />
              </div>

              <p className="mt-3 text-[12px] leading-relaxed text-[#6B6B6B]">
                {estVendue(commande.statut)
                  ? "Encaissé, c'est ce que le client a payé au livreur. Marge, c'est l'encaissé moins l'achat du parfum, les frais de livraison payés et les autres frais."
                  : "Rien n'est compté comme encaissé tant que le statut n'est pas Livrée ou Encaissée."}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B6B6B]">
                {"Sur un retour, l'achat du parfum n'est pas déduit : le flacon revient et sera revendu. En revanche les frais aller et retour restent à notre charge."}
              </p>
            </Carte>
          </section>

          {/* 4. le colis */}
          <section className="mt-7">
            <TitreBloc aide="Suivi Yalidine, dates et notes internes.">
              Le colis
            </TitreBloc>
            <Carte className="p-4 sm:p-5">
              {motifAttendu && (
                <div className="mb-4 rounded-lg bg-[#FDF1DC] px-3 py-3">
                  <p className="text-[12px] leading-relaxed text-[#9A5B00]">
                    {"Cette commande s'est arrêtée. Dites pourquoi juste en dessous : c'est ce qui permet de voir d'où viennent les pertes."}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Texte
                    label="Numéro de suivi Yalidine"
                    valeur={brouillon.suivi}
                    placeholder="Collez le numéro du bordereau"
                    surSaisie={(v) => majChamp("suivi", v)}
                    surSortie={() => enregistrerChamp("suivi")}
                  />
                </div>
                <Jour
                  label="Envoyé le"
                  valeur={brouillon.dateEnvoi}
                  surSaisie={(v) => majChamp("dateEnvoi", v)}
                  surSortie={() => enregistrerChamp("dateEnvoi")}
                />
                <Jour
                  label="Livré le"
                  valeur={brouillon.dateLivraison}
                  surSaisie={(v) => majChamp("dateLivraison", v)}
                  surSortie={() => enregistrerChamp("dateLivraison")}
                />
                <Jour
                  label="Argent reçu le"
                  valeur={brouillon.dateArgentRecu}
                  surSaisie={(v) => majChamp("dateArgentRecu", v)}
                  surSortie={() => enregistrerChamp("dateArgentRecu")}
                />
                <Texte
                  label="Qui gère"
                  valeur={brouillon.quiGere}
                  placeholder="Prénom"
                  surSaisie={(v) => majChamp("quiGere", v)}
                  surSortie={() => enregistrerChamp("quiGere")}
                />
                <Montant
                  label="Relances faites"
                  valeur={brouillon.relances}
                  aide="Nombre d'appels sans réponse."
                  surSaisie={(v) => majChamp("relances", v)}
                  surSortie={() => enregistrerChamp("relances")}
                />
                <Choix
                  label="Motif"
                  valeur={brouillon.motif}
                  options={MOTIFS}
                  vide="Pas de motif"
                  surChoix={(v) => choisir("motif", v)}
                />
                <div className="sm:col-span-2">
                  <Note
                    label="Note interne"
                    valeur={brouillon.noteInterne}
                    aide="Visible par les trois associés, jamais par le client."
                    surSaisie={(v) => majChamp("noteInterne", v)}
                    surSortie={() => enregistrerChamp("noteInterne")}
                  />
                </div>
              </div>
            </Carte>
          </section>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-[#9A9A94]">
            {"Une commande annulée n'est jamais supprimée : on lui met son statut et son motif, et elle reste dans les comptes."}
          </p>
        </div>

        {/* ─────────── barre du bas */}
        <footer className="shrink-0 space-y-2.5 border-t border-[#E9E9E4] bg-white px-4 py-3 sm:px-5">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-[#6B6B6B]">
              Où en est cette commande
            </span>
            <select
              value={commande.statut}
              onChange={(e) => changerStatut(e.target.value)}
              style={{ backgroundColor: fondStatut, color: texteStatut }}
              className="w-full min-h-[48px] rounded-lg border border-transparent px-3 text-[16px] font-semibold transition focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/25"
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <Bouton
            onClick={() => pousser(true)}
            disabled={!aDesChangements && !enregistre}
            className="w-full min-h-[48px] text-[15px]"
          >
            {enregistre
              ? "Enregistré"
              : aDesChangements
                ? "Enregistrer"
                : "Tout est enregistré"}
          </Bouton>
        </footer>
      </aside>
    </div>
  );
}
