"use client";

// Écran d'accueil du tableau de bord : la journée de travail, et rien d'autre.
//
// Pensé pour trois personnes dont deux ne travaillent que sur téléphone, et dont
// l'une n'est pas à l'aise avec l'informatique. D'où les règles suivies ici :
//   - une seule colonne, de grosses cartes, aucun tableau à faire défiler ;
//   - la photo du parfum en grand, pour ne plus jamais aller la chercher sur le site ;
//   - trois boutons seulement : appeler, écrire au client, envoyer au fournisseur ;
//   - le statut avance en un seul tap, tout le reste est dans la fiche détaillée.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Phone, RefreshCw, Send } from "lucide-react";
import type { useCommandes } from "./useCommandes";
import type { ArticleCommande, CommandeServeur } from "@/lib/tdb/commandes-serveur";
import type { CalculsLigne } from "@/lib/tdb/calculs-commande";
import { calculerLigne, jourDe, resumeArticles } from "@/lib/tdb/calculs-commande";
import {
  lienTel,
  lienWhatsapp,
  messageClient,
  messageFournisseur,
} from "@/lib/tdb/contact";
import { aujourdhui, formatDA, formatDate, joursEntre } from "@/lib/tdb/calculs";
import { STATUTS } from "@/lib/tdb/types";
import type { Statut } from "@/lib/tdb/types";
import { Carte, Etiquette, Pastille } from "./ui";

// ───────────────────────────────────────────────────────────────── réglages

/** Statuts qui ne demandent plus rien à personne. */
const CLOSES: string[] = ["Encaissée", "Annulée", "Rupture fournisseur"];

/** L'étape suivante proposée en un tap, par statut courant. */
const ETAPE_SUIVANTE: Partial<Record<Statut, { vers: Statut; label: string }>> = {
  Nouvelle: { vers: "Confirmée", label: "Confirmer" },
  "À rappeler": { vers: "Confirmée", label: "Confirmer" },
  Confirmée: { vers: "Achetée", label: "Marquer achetée" },
  Achetée: { vers: "Expédiée", label: "Marquer expédiée" },
  Expédiée: { vers: "Livrée", label: "Marquer livrée" },
  Livrée: { vers: "Encaissée", label: "Argent reçu" },
};

type ChampDate = "dateEnvoi" | "dateLivraison" | "dateArgentRecu";

/** Passer à ce statut remplit aussi la date du jour dans cette colonne. */
const DATE_DU_STATUT: Partial<Record<Statut, ChampDate>> = {
  Expédiée: "dateEnvoi",
  Livrée: "dateLivraison",
  Encaissée: "dateArgentRecu",
};

const FILTRES = [
  { cle: "aTraiter", label: "À traiter" },
  { cle: "tout", label: "Tout" },
  { cle: "terminees", label: "Terminées" },
] as const;

type Filtre = (typeof FILTRES)[number]["cle"];

const SEUIL_RECHERCHE = 12;

// ──────────────────────────────────────────────────────────────── utilitaires

function statutValide(s: string): Statut {
  return (STATUTS as readonly string[]).includes(s) ? (s as Statut) : "Nouvelle";
}

function estClose(c: CommandeServeur): boolean {
  return CLOSES.includes(c.statut);
}

/** 2026-11-25T08:14:32.000Z → 08h14, à l'heure du téléphone qui regarde. */
function heureDe(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}h${p(d.getMinutes())}`;
}

function libelleJour(jour: string, jourCourant: string): string {
  if (!jour) return "Date inconnue";
  const ecart = joursEntre(jour, jourCourant);
  if (ecart === 0) return "Aujourd'hui";
  if (ecart === 1) return "Hier";
  return formatDate(jour);
}

/** Petit bip à l'arrivée d'une commande. Le navigateur a le droit de refuser. */
function bip(): void {
  try {
    const fenetre = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Constructeur = window.AudioContext ?? fenetre.webkitAudioContext;
    if (!Constructeur) return;
    const contexte = new Constructeur();
    const oscillateur = contexte.createOscillator();
    const volume = contexte.createGain();
    const t = contexte.currentTime;
    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(880, t);
    volume.gain.setValueAtTime(0.0001, t);
    volume.gain.linearRampToValueAtTime(0.06, t + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    oscillateur.connect(volume);
    volume.connect(contexte.destination);
    oscillateur.start(t);
    oscillateur.stop(t + 0.16);
    oscillateur.onended = () => {
      void contexte.close();
    };
  } catch {
    // Son interdit tant que l'utilisateur n'a pas touché l'écran : ce n'est pas grave.
  }
}

function estAnnulation(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (e as { name?: unknown }).name === "AbortError"
  );
}

/** Récupère les photos du site et les transforme en fichiers partageables. */
async function photosEnFichiers(articles: ArticleCommande[]): Promise<File[]> {
  const fichiers: File[] = [];
  for (const a of articles.slice(0, 4)) {
    if (!a.image) continue;
    try {
      const reponse = await fetch(a.image);
      if (!reponse.ok) continue;
      const blob = await reponse.blob();
      if (!blob.type.startsWith("image/")) continue;
      const extension = blob.type === "image/png" ? "png" : "jpg";
      fichiers.push(
        new File([blob], `${a.slug || "parfum"}.${extension}`, { type: blob.type }),
      );
    } catch {
      // Photo indisponible : on partagera le texte, et les autres photos.
    }
  }
  return fichiers;
}

// ─────────────────────────────────────────────────────────────────── écran

export default function VueJour({
  etat,
  ouvrirFiche,
}: {
  etat: ReturnType<typeof useCommandes>;
  ouvrirFiche: (id: string) => void;
}) {
  const [filtre, setFiltre] = useState<Filtre>("aTraiter");
  const [recherche, setRecherche] = useState("");
  const dernierSignal = useRef(0);

  // Bip uniquement quand de nouvelles commandes viennent d'arriver.
  const nombreNouvelles = etat.nouvelles.length;
  useEffect(() => {
    if (nombreNouvelles > dernierSignal.current) bip();
    dernierSignal.current = nombreNouvelles;
  }, [nombreNouvelles]);

  const jourCourant = aujourdhui();
  const commandes = etat.commandes;

  const aTraiter = useMemo(
    () => commandes.filter((c) => !estClose(c)).length,
    [commandes],
  );

  const selonFiltre = useMemo(() => {
    if (filtre === "tout") return commandes;
    if (filtre === "terminees") return commandes.filter(estClose);
    return commandes.filter((c) => !estClose(c));
  }, [commandes, filtre]);

  const chercheur = recherche.trim().toLowerCase();
  const affichees = useMemo(() => {
    if (!chercheur) return selonFiltre;
    return selonFiltre.filter((c) =>
      [c.numero, c.client, c.telephone, c.wilaya, c.commune, resumeArticles(c)]
        .join(" ")
        .toLowerCase()
        .includes(chercheur),
    );
  }, [selonFiltre, chercheur]);

  const groupes = useMemo(() => {
    const paquets = new Map<string, CommandeServeur[]>();
    for (const c of affichees) {
      const jour = jourDe(c);
      const existant = paquets.get(jour);
      if (existant) existant.push(c);
      else paquets.set(jour, [c]);
    }
    return Array.from(paquets.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([jour, lignes]) => ({ jour, lignes }));
  }, [affichees]);

  const calculsDe = useCallback(
    (c: CommandeServeur) =>
      calculerLigne(c, { commandes, dateDuJour: jourCourant }),
    [commandes, jourCourant],
  );

  // Premier chargement : des silhouettes, pas un mot « chargement » tout seul.
  if (etat.chargement && commandes.length === 0) return <Silhouettes />;

  if (etat.erreur && commandes.length === 0) {
    return (
      <Carte className="p-6 sm:p-8 text-center">
        <p className="text-[15px] text-[#111111]">{etat.erreur}</p>
        <p className="text-[13px] text-[#8A8A84] mt-1">
          Les commandes sont bien enregistrées, c&apos;est seulement l&apos;affichage qui
          n&apos;a pas pu les lire.
        </p>
        <button
          type="button"
          onClick={() => void etat.recharger()}
          className="mt-5 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-[#111111] text-white text-[14px] font-medium"
        >
          <RefreshCw size={16} strokeWidth={2} />
          Réessayer
        </button>
      </Carte>
    );
  }

  const phrase =
    aTraiter === 0
      ? "Rien à faire pour l'instant"
      : `${aTraiter} commande${aTraiter > 1 ? "s" : ""} à traiter`;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-[family-name:var(--font-libre-bodoni)] text-[27px] sm:text-[34px] leading-tight text-[#111111]">
          {phrase}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#8A8A84] mt-1.5">
          {aTraiter === 0
            ? "Les nouvelles commandes arrivent ici toutes seules."
            : "Appeler, acheter, expédier, encaisser : tout part de cette page."}
        </p>
      </header>

      {nombreNouvelles > 0 && (
        <button
          type="button"
          onClick={etat.marquerVues}
          className="w-full min-h-[48px] flex items-center justify-between gap-3 px-4 rounded-lg bg-[#E4F4EA] text-[#1E7A45] text-left"
        >
          <span className="text-[14px] font-semibold">
            {nombreNouvelles} nouvelle{nombreNouvelles > 1 ? "s" : ""} commande
            {nombreNouvelles > 1 ? "s" : ""}
          </span>
          <span className="text-[12px] opacity-80">J&apos;ai vu</span>
        </button>
      )}

      {etat.erreur && commandes.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#FDF1DC] text-[#9A5B00]">
          <span className="text-[13px]">{etat.erreur}</span>
          <button
            type="button"
            onClick={() => void etat.recharger()}
            className="text-[13px] font-semibold underline underline-offset-2 min-h-[44px] px-2"
          >
            Réessayer
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTRES.map(({ cle, label }) => {
          const actif = filtre === cle;
          return (
            <button
              key={cle}
              type="button"
              onClick={() => setFiltre(cle)}
              aria-pressed={actif}
              className={`min-h-[44px] px-5 rounded-lg text-[14px] font-medium transition-colors ${
                actif
                  ? "bg-[#111111] text-white"
                  : "bg-white text-[#4A4A4A] border border-[#E9E9E4]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {selonFiltre.length > SEUIL_RECHERCHE && (
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Chercher un nom, un numéro, un parfum"
          aria-label="Chercher une commande"
          className="w-full min-h-[48px] px-4 rounded-lg bg-white border border-[#E9E9E4] text-[15px] text-[#111111] placeholder:text-[#9A9A94] focus:outline-none focus:border-[#C9A84C]"
        />
      )}

      {affichees.length === 0 ? (
        <Carte className="p-8 text-center">
          <p className="text-[15px] text-[#4A4A4A]">
            {chercheur
              ? "Aucune commande ne correspond à cette recherche."
              : filtre === "terminees"
                ? "Aucune commande terminée pour le moment."
                : filtre === "tout"
                  ? "Aucune commande encore. La première s'affichera ici toute seule."
                  : "Tout est à jour, rien n'attend d'être traité."}
          </p>
        </Carte>
      ) : (
        groupes.map(({ jour, lignes }) => (
          <section key={jour || "inconnu"} className="space-y-3">
            <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#9A9A94] pt-1">
              {libelleJour(jour, jourCourant)}
            </h2>
            {lignes.map((c) => (
              <CarteCommande
                key={c.id}
                commande={c}
                calculs={calculsDe(c)}
                modifier={etat.modifier}
                ouvrirFiche={ouvrirFiche}
              />
            ))}
          </section>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────── carte commande

function CarteCommande({
  commande,
  calculs,
  modifier,
  ouvrirFiche,
}: {
  commande: CommandeServeur;
  calculs: CalculsLigne;
  modifier: (id: string, champs: Record<string, unknown>) => Promise<void>;
  ouvrirFiche: (id: string) => void;
}) {
  const [info, setInfo] = useState("");
  const [texteSecours, setTexteSecours] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 3000);
    return () => clearTimeout(t);
  }, [info]);

  const statut = statutValide(commande.statut);
  const suivant = ETAPE_SUIVANTE[statut];
  const articles = commande.articles;
  const visibles = articles.slice(0, 3);
  const reste = articles.length - visibles.length;

  function changerStatut(vers: Statut) {
    const champs: Record<string, unknown> = { statut: vers };
    const champDate = DATE_DU_STATUT[vers];
    if (champDate && !commande[champDate]) champs[champDate] = aujourdhui();
    void modifier(commande.id, champs);
  }

  async function envoyerAuFournisseur() {
    const texte = messageFournisseur({
      numero: commande.numero,
      articles,
    });
    setTexteSecours("");
    setEnvoiEnCours(true);
    try {
      // 1. Le geste unique : texte + photos dans WhatsApp depuis le téléphone.
      const fichiers = await photosEnFichiers(articles);
      if (
        fichiers.length > 0 &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: fichiers })
      ) {
        try {
          await navigator.share({ files: fichiers, text: texte });
          setInfo("Envoyé au fournisseur");
          return;
        } catch (e) {
          if (estAnnulation(e)) return;
        }
      }
      // 2. Ordinateur ou téléphone sans partage de fichiers.
      try {
        if (!navigator.clipboard) throw new Error("presse-papier indisponible");
        await navigator.clipboard.writeText(texte);
        const premiere = articles.find((a) => a.image)?.image;
        if (premiere) window.open(premiere, "_blank", "noopener,noreferrer");
        setInfo("Texte copié, la photo s'ouvre à côté");
      } catch {
        // 3. Dernier recours : le texte à l'écran, à sélectionner à la main.
        setTexteSecours(texte);
      }
    } finally {
      setEnvoiEnCours(false);
    }
  }

  const detail = [
    `Parfums ${formatDA(commande.totalProduits)}`,
    commande.remise > 0 ? `remise ${formatDA(commande.remise)}` : "",
    `livraison ${formatDA(commande.fraisLivraison)}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const lieu = [commande.wilaya, commande.commune].filter(Boolean).join(" · ");

  return (
    <Carte className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-[#9A9A94] tabular-nums">
          {commande.numero}
          {heureDe(commande.creeLe) && (
            <span className="ml-2 text-[#BDBDB6]">{heureDe(commande.creeLe)}</span>
          )}
        </p>
        <Pastille statut={statut} />
      </div>

      <div className="flex gap-2 mt-3">
        {visibles.map((a, i) => (
          <div key={`${a.slug}-${i}`} className="flex-1 min-w-0">
            <div className="relative h-[150px] sm:h-[180px] bg-white border border-[#E9E9E4] rounded-lg overflow-hidden">
              {a.image ? (
                <Image
                  src={a.image}
                  alt={`${a.marque} ${a.nom}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 33vw, 220px"
                  className="object-contain p-2"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                  <span className="text-[11px] text-[#9A9A94]">Pas de photo</span>
                </div>
              )}
              {a.qte > 1 && (
                <span className="absolute top-2 right-2 min-w-[28px] h-7 px-2 rounded-lg bg-[#111111] text-white text-[13px] font-semibold flex items-center justify-center tabular-nums">
                  x{a.qte}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94] truncate">
              {a.marque}
            </p>
            <p className="text-[14px] font-semibold text-[#111111] leading-snug">
              {a.nom}
            </p>
          </div>
        ))}
      </div>
      {reste > 0 && (
        <p className="text-[12px] text-[#8A8A84] mt-2">
          et {reste} autre{reste > 1 ? "s" : ""} parfum{reste > 1 ? "s" : ""} dans cette
          commande
        </p>
      )}

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-[#111111]">
            {commande.client || "Client sans nom"}
          </p>
          {lieu && <p className="text-[13px] text-[#8A8A84] mt-0.5">{lieu}</p>}
        </div>
        {calculs.fidele && <Etiquette ton="ok">Fidèle</Etiquette>}
      </div>

      <div className="mt-3 pt-3 border-t border-[#E9E9E4]">
        <p className="text-[12px] text-[#8A8A84]">À encaisser à la livraison</p>
        <p className="text-[24px] sm:text-[27px] font-semibold text-[#111111] tabular-nums leading-tight">
          {formatDA(calculs.totalClient)}
        </p>
        <p className="text-[11px] text-[#9A9A94] mt-0.5">{detail}</p>
      </div>

      {calculs.aFaire && (
        <p
          className={`mt-3 px-3 py-2.5 rounded-lg text-[13px] font-medium ${
            calculs.gravite === "risque"
              ? "bg-[#FBE7E5] text-[#B3261E]"
              : "bg-[#FDF1DC] text-[#9A5B00]"
          }`}
        >
          {calculs.aFaire}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href={lienTel(commande.telephone)}
          className="min-h-[52px] rounded-lg bg-[#111111] text-white flex flex-col items-center justify-center gap-1 text-[12px] font-semibold"
        >
          <Phone size={18} strokeWidth={2} />
          Appeler
        </a>
        <a
          href={lienWhatsapp(
            commande.telephone,
            messageClient({
              numero: commande.numero,
              client: commande.client,
              articles,
              total: calculs.totalClient,
            }),
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[52px] rounded-lg bg-[#25D366] text-white flex flex-col items-center justify-center gap-1 text-[12px] font-semibold"
        >
          <MessageCircle size={18} strokeWidth={2} />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => void envoyerAuFournisseur()}
          disabled={envoiEnCours}
          className="min-h-[52px] rounded-lg bg-white border border-[#D9D9D2] text-[#111111] flex flex-col items-center justify-center gap-1 text-[12px] font-semibold disabled:opacity-50"
        >
          <Send size={18} strokeWidth={2} />
          Fournisseur
        </button>
      </div>

      {info && (
        <p className="mt-2 text-[12px] text-[#1E7A45] bg-[#E4F4EA] rounded-lg px-3 py-2">
          {info}
        </p>
      )}

      {texteSecours && (
        <div className="mt-2">
          <p className="text-[12px] text-[#8A8A84] mb-1">
            Copiez ce texte et envoyez-le au fournisseur :
          </p>
          <textarea
            readOnly
            value={texteSecours}
            rows={5}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-[#E9E9E4] px-3 py-2 text-[13px] text-[#111111] bg-[#FAFAF8]"
          />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#E9E9E4] flex flex-wrap items-center gap-2">
        {suivant ? (
          <button
            type="button"
            onClick={() => changerStatut(suivant.vers)}
            className="flex-1 min-w-[140px] min-h-[44px] px-3 rounded-lg bg-[#F6EFDD] text-[#8B6914] text-[13px] font-semibold"
          >
            {suivant.label}
          </button>
        ) : (
          <span className="flex-1 min-w-[140px] text-[12px] text-[#9A9A94]">
            Dossier terminé
          </span>
        )}
        <select
          value={statut}
          onChange={(e) => changerStatut(statutValide(e.target.value))}
          aria-label="Changer le statut de la commande"
          className="w-[104px] shrink-0 min-h-[44px] px-2 rounded-lg bg-white border border-[#E9E9E4] text-[13px] text-[#4A4A4A] truncate"
        >
          {STATUTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => ouvrirFiche(commande.id)}
          className="shrink-0 min-h-[44px] px-3 text-[13px] font-medium text-[#6B6B6B] underline underline-offset-2"
        >
          Détails
        </button>
      </div>
    </Carte>
  );
}

// ─────────────────────────────────────────────────────────────── silhouettes

function Silhouettes() {
  return (
    <div className="space-y-5">
      <div className="h-9 w-2/3 rounded-lg bg-[#EFEFEC] animate-pulse" />
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-11 w-28 rounded-lg bg-[#EFEFEC] animate-pulse" />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white border border-[#E9E9E4] rounded-lg p-4 sm:p-5 space-y-3"
        >
          <div className="h-4 w-32 rounded bg-[#F2F2EF] animate-pulse" />
          <div className="h-[150px] sm:h-[180px] rounded-lg bg-[#F2F2EF] animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-[#F2F2EF] animate-pulse" />
          <div className="h-7 w-40 rounded bg-[#F2F2EF] animate-pulse" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-[52px] rounded-lg bg-[#F2F2EF] animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
