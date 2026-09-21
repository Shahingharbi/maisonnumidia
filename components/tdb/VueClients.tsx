"use client";

// Onglet CLIENTS : fiche d'un numéro, annuaire agrégé et liste noire.
// Aucun calcul métier n'est réécrit ici, tout passe par lib/tdb/calculs.ts.

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, ShieldAlert, Trash2 } from "lucide-react";
import { useTdb } from "@/components/tdb/TdbProvider";
import { MOTIFS, WILAYAS } from "@/lib/tdb/constantes";
import type { Commande } from "@/lib/tdb/types";
import {
  aujourdhui,
  calculer,
  estVendue,
  ficheClient,
  formatDA,
  formatDate,
} from "@/lib/tdb/calculs";
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
} from "@/components/tdb/ui";

// ───────────────────────────────────────────────────────────────── outils

/** Un numéro de téléphone réduit à ses chiffres, comme dans calculs.ts. */
function chiffresDe(t: string): string {
  return (t || "").replace(/\D/g, "");
}

const TONS = {
  risque: { fond: "#FBE7E5", texte: "#B3261E", bord: "#F0CFC9" },
  ok: { fond: "#E4F4EA", texte: "#1E7A45", bord: "#CBE7D6" },
  neutre: { fond: "#F2F2EF", texte: "#4A4A4A", bord: "#E9E9E4" },
} as const;

type Ton = keyof typeof TONS;

/** Le verdict affiché en haut de la fiche client. */
function verdict(livrees: number, retours: number, commandes: number): {
  titre: string;
  detail: string;
  ton: Ton;
} {
  if (retours >= 2) {
    return {
      titre: "Client à risque, faites-le payer d'avance ou refusez la commande",
      detail: `${retours} colis refusés ou retournés sur ${commandes} commandes. Chaque retour coûte l'aller et le retour.`,
      ton: "risque",
    };
  }
  if (livrees >= 2) {
    return {
      titre: "Bon client, à chouchouter",
      detail: `${livrees} commandes livrées sans incident. Un mot gentil au téléphone et une petite remise font revenir ce genre de client.`,
      ton: "ok",
    };
  }
  if (commandes === 0) {
    return {
      titre: "Numéro inconnu, c'est un nouveau client",
      detail: "Aucune commande enregistrée sur ce numéro. Confirmez bien l'adresse avant d'expédier.",
      ton: "neutre",
    };
  }
  return {
    titre: "Client normal",
    detail: "Rien de particulier à signaler sur ce numéro.",
    ton: "neutre",
  };
}

function Montant({ valeur, colore = false }: { valeur: number; colore?: boolean }) {
  const couleur = !colore
    ? "#111111"
    : valeur > 0
      ? "#1E7A45"
      : valeur < 0
        ? "#B3261E"
        : "#6B6B6B";
  return (
    <span className="tabular-nums font-medium" style={{ color: couleur }}>
      {formatDA(valeur)}
    </span>
  );
}

function Donnee({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className={`${BORDURE} rounded-lg px-3 py-2.5 bg-[#FAFAF8]`}>
      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#8A8A84]">
        {label}
      </p>
      <p className="text-[14px] text-[#111111] mt-1 tabular-nums break-words">{valeur}</p>
    </div>
  );
}

// ───────────────────────────────────────────────── annuaire agrégé

interface LigneClient {
  cle: string;
  nom: string;
  telephone: string;
  wilaya: string;
  commandes: number;
  livrees: number;
  retours: number;
  totalPaye: number;
  marge: number;
  derniere: string;
}

type CleTri =
  | "nom"
  | "telephone"
  | "wilaya"
  | "commandes"
  | "livrees"
  | "retours"
  | "totalPaye"
  | "marge";

const COLONNES: { cle: CleTri; label: string; numerique: boolean }[] = [
  { cle: "nom", label: "Client", numerique: false },
  { cle: "telephone", label: "Téléphone", numerique: false },
  { cle: "wilaya", label: "Wilaya", numerique: false },
  { cle: "commandes", label: "Cdes", numerique: true },
  { cle: "livrees", label: "Livrées", numerique: true },
  { cle: "retours", label: "Retours", numerique: true },
  { cle: "totalPaye", label: "Total payé", numerique: true },
  { cle: "marge", label: "Marge", numerique: true },
];

// ─────────────────────────────────────────────────────────────── la vue

export default function VueClients() {
  const { base, ajouterNoire, supprimerNoire, nouvelId } = useTdb();

  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState<{ cle: CleTri; sens: "asc" | "desc" }>({
    cle: "marge",
    sens: "desc",
  });
  const [noire, setNoire] = useState(() => ({
    telephone: "",
    nom: "",
    wilaya: "",
    motif: "",
    date: aujourdhui(),
  }));

  const refRecherche = useRef<HTMLDivElement | null>(null);
  const refNoire = useRef<HTMLDivElement | null>(null);

  // ── bloc 1 : recherche
  const chiffres = chiffresDe(recherche);
  const assezLong = chiffres.length >= 4;

  const correspondances = useMemo(() => {
    if (!assezLong) return [] as string[];
    const vus = new Set<string>();
    for (const c of base.commandes) {
      const t = chiffresDe(c.telephone);
      if (t && t.includes(chiffres)) vus.add(t);
    }
    return Array.from(vus).sort();
  }, [assezLong, chiffres, base.commandes]);

  // Un seul numéro possible : on ouvre la fiche. Plusieurs : on propose le choix.
  const telFiche = !assezLong
    ? ""
    : correspondances.includes(chiffres)
      ? chiffres
      : correspondances.length === 1
        ? correspondances[0]
        : correspondances.length === 0
          ? chiffres
          : "";

  const fiche = telFiche ? ficheClient(telFiche, base) : null;

  const commandesClient = useMemo<Commande[]>(() => {
    if (!telFiche) return [];
    return base.commandes
      .filter((c) => chiffresDe(c.telephone) === telFiche)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [telFiche, base.commandes]);

  // ── bloc 2 : annuaire
  const lignes = useMemo<LigneClient[]>(() => {
    const carte = new Map<string, LigneClient>();
    for (const c of base.commandes) {
      const cle = chiffresDe(c.telephone);
      if (!cle) continue;
      const calc = calculer(c, { commandes: base.commandes });
      const l: LigneClient = carte.get(cle) ?? {
        cle,
        nom: "",
        telephone: c.telephone,
        wilaya: "",
        commandes: 0,
        livrees: 0,
        retours: 0,
        totalPaye: 0,
        marge: 0,
        derniere: "",
      };
      l.commandes += 1;
      if (estVendue(c.statut)) l.livrees += 1;
      if (c.statut === "Retour") l.retours += 1;
      l.totalPaye += calc.encaisse;
      l.marge += calc.marge;
      if (c.date > l.derniere) {
        l.derniere = c.date;
        if (c.client) l.nom = c.client;
        if (c.wilaya) l.wilaya = c.wilaya;
        if (c.telephone) l.telephone = c.telephone;
      }
      if (!l.nom && c.client) l.nom = c.client;
      if (!l.wilaya && c.wilaya) l.wilaya = c.wilaya;
      carte.set(cle, l);
    }
    return Array.from(carte.values());
  }, [base.commandes]);

  const lignesTriees = useMemo<LigneClient[]>(() => {
    const copie = [...lignes];
    copie.sort((a, b) => {
      const va = a[tri.cle];
      const vb = b[tri.cle];
      const d =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "fr");
      return tri.sens === "asc" ? d : -d;
    });
    return copie;
  }, [lignes, tri]);

  const noirs = useMemo(
    () => new Set(base.blacklist.map((b) => chiffresDe(b.telephone)).filter(Boolean)),
    [base.blacklist],
  );

  function trierPar(cle: CleTri, numerique: boolean) {
    setTri((t) =>
      t.cle === cle
        ? { cle, sens: t.sens === "asc" ? "desc" : "asc" }
        : { cle, sens: numerique ? "desc" : "asc" },
    );
  }

  function ouvrirFiche(telephone: string) {
    setRecherche(telephone);
    refRecherche.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function preparerListeNoire() {
    setNoire({
      telephone: telFiche,
      nom: fiche?.nom ?? "",
      wilaya: fiche?.wilaya ?? "",
      motif: "",
      date: aujourdhui(),
    });
    refNoire.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function enregistrerNoire() {
    const tel = chiffresDe(noire.telephone);
    if (!tel || noirs.has(tel)) return;
    ajouterNoire({
      id: nouvelId(),
      telephone: noire.telephone.trim(),
      nom: noire.nom.trim(),
      wilaya: noire.wilaya,
      motif: noire.motif,
      date: noire.date || aujourdhui(),
    });
    setNoire({ telephone: "", nom: "", wilaya: "", motif: "", date: aujourdhui() });
  }

  const telNoireValide = chiffresDe(noire.telephone).length >= 4;
  const dejaNoire = telNoireValide && noirs.has(chiffresDe(noire.telephone));

  const v = fiche ? verdict(fiche.livrees, fiche.retours, fiche.commandes) : null;

  return (
    <div className="space-y-8">
      {/* ───────────────────────── 1. Chercher un client */}
      <section ref={refRecherche} className="scroll-mt-32">
        <TitreBloc aide="Tapez les 4 derniers chiffres ou le numéro complet, l'historique du client s'affiche tout seul.">
          Chercher un client
        </TitreBloc>

        <Carte className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                strokeWidth={1.8}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A94] pointer-events-none"
              />
              <input
                type="tel"
                inputMode="tel"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Numéro de téléphone du client"
                aria-label="Numéro de téléphone du client"
                className="w-full h-11 pl-9 pr-3 text-[14px] text-[#111111] bg-white border border-[#DCDCD5] rounded-lg focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition tabular-nums"
              />
            </div>
            {recherche && (
              <Bouton variante="secondaire" onClick={() => setRecherche("")}>
                Effacer
              </Bouton>
            )}
          </div>

          {!assezLong && (
            <p className="text-[12px] text-[#8A8A84]">
              {"Il faut au moins 4 chiffres pour lancer la recherche."}
            </p>
          )}

          {assezLong && !telFiche && correspondances.length > 1 && (
            <div className="space-y-2">
              <p className="text-[12px] text-[#6B6B6B]">
                {`${correspondances.length} numéros correspondent, choisissez :`}
              </p>
              <div className="flex flex-wrap gap-2">
                {correspondances.slice(0, 12).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRecherche(t)}
                    className={`${BORDURE} rounded-lg px-3 min-h-[40px] text-[13px] tabular-nums bg-white hover:border-[#C9A84C] hover:text-[#8B6914] transition-colors`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {fiche && (
            <div className="space-y-4">
              {fiche.surListeNoire && (
                <div
                  className="rounded-lg px-4 py-3 flex items-start gap-3"
                  style={{ backgroundColor: TONS.risque.fond, border: `1px solid ${TONS.risque.bord}` }}
                >
                  <ShieldAlert size={18} strokeWidth={1.9} style={{ color: TONS.risque.texte }} className="shrink-0 mt-[1px]" />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: TONS.risque.texte }}>
                      {"Ce numéro est sur la liste noire."}
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: TONS.risque.texte }}>
                      {base.blacklist.find((b) => chiffresDe(b.telephone) === telFiche)?.motif ||
                        "Motif non précisé"}
                      {" — "}
                      {"n'expédiez rien sans paiement d'avance."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Donnee label="Nom" valeur={fiche.nom || "Inconnu"} />
                <Donnee label="Wilaya" valeur={fiche.wilaya || "—"} />
                <Donnee label="Commandes" valeur={String(fiche.commandes)} />
                <Donnee label="Dernière" valeur={fiche.derniere ? formatDate(fiche.derniere) : "—"} />
                <Donnee label="Livrées" valeur={String(fiche.livrees)} />
                <Donnee label="Retours ou refus" valeur={String(fiche.retours)} />
                <Donnee label="Total payé" valeur={formatDA(fiche.totalPaye)} />
                <Donnee label="Marge rapportée" valeur={formatDA(fiche.marge)} />
              </div>

              {v && (
                <div
                  className="rounded-lg px-4 py-4"
                  style={{ backgroundColor: TONS[v.ton].fond, border: `1px solid ${TONS[v.ton].bord}` }}
                >
                  <p
                    className="font-[family-name:var(--font-libre-bodoni)] text-[17px] sm:text-[19px] leading-snug"
                    style={{ color: TONS[v.ton].texte }}
                  >
                    {v.titre}
                  </p>
                  <p className="text-[12px] mt-1.5 text-[#4A4A4A]">{v.detail}</p>
                </div>
              )}

              {!fiche.surListeNoire && chiffresDe(telFiche).length >= 6 && (
                <Bouton variante="danger" onClick={preparerListeNoire}>
                  Mettre sur la liste noire
                </Bouton>
              )}

              {/* Ses commandes : tableau sur écran large, cartes sur téléphone */}
              {commandesClient.length > 0 && (
                <div className={`${BORDURE} rounded-lg overflow-hidden`}>
                  <p className="px-3 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] bg-[#FAFAF8] border-b border-[#E9E9E4]">
                    Ses commandes
                  </p>

                  <table className="hidden sm:table w-full text-[12.5px]">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[#8A8A84] border-b border-[#E9E9E4]">
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Statut</th>
                        <th className="px-3 py-2 font-medium">Parfum</th>
                        <th className="px-3 py-2 font-medium text-right">Total</th>
                        <th className="px-3 py-2 font-medium text-right">Marge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandesClient.map((c) => {
                        const calc = calculer(c, { commandes: base.commandes });
                        return (
                          <tr key={c.id} className="border-b border-[#F1F1EC] last:border-0">
                            <td className="px-3 py-2 tabular-nums whitespace-nowrap">{formatDate(c.date)}</td>
                            <td className="px-3 py-2"><Pastille statut={c.statut} /></td>
                            <td className="px-3 py-2 text-[#4A4A4A]">{c.parfum || "—"}</td>
                            <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                              {formatDA(calc.totalClient)}
                            </td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">
                              <Montant valeur={calc.marge} colore />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <ul className="sm:hidden divide-y divide-[#F1F1EC]">
                    {commandesClient.map((c) => {
                      const calc = calculer(c, { commandes: base.commandes });
                      return (
                        <li key={c.id} className="px-3 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] tabular-nums text-[#6B6B6B]">
                              {formatDate(c.date)}
                            </span>
                            <Pastille statut={c.statut} />
                          </div>
                          <p className="text-[13px] text-[#111111] mt-1.5">{c.parfum || "—"}</p>
                          <div className="flex items-center justify-between gap-2 mt-1.5 text-[12px]">
                            <span className="text-[#6B6B6B] tabular-nums">
                              Total {formatDA(calc.totalClient)}
                            </span>
                            <Montant valeur={calc.marge} colore />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Carte>
      </section>

      {/* ───────────────────────── 2. Tous les clients */}
      <section>
        <TitreBloc aide="Un client par numéro de téléphone. Touchez une ligne pour ouvrir sa fiche en haut de page.">
          Tous les clients
        </TitreBloc>

        <Carte>
          {lignesTriees.length === 0 ? (
            <Vide texte="Aucune commande enregistrée pour le moment." />
          ) : (
            <>
              <div className="hidden sm:block">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-[#E9E9E4]">
                      {COLONNES.map((col) => {
                        const actif = tri.cle === col.cle;
                        return (
                          <th
                            key={col.cle}
                            className={`px-3 py-2 font-medium ${col.numerique ? "text-right" : "text-left"}`}
                          >
                            <button
                              onClick={() => trierPar(col.cle, col.numerique)}
                              className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] transition-colors ${
                                actif ? "text-[#8B6914]" : "text-[#8A8A84] hover:text-[#111111]"
                              }`}
                            >
                              {col.label}
                              {actif &&
                                (tri.sens === "asc" ? (
                                  <ChevronUp size={12} strokeWidth={2.2} />
                                ) : (
                                  <ChevronDown size={12} strokeWidth={2.2} />
                                ))}
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {lignesTriees.map((l) => (
                      <tr
                        key={l.cle}
                        onClick={() => ouvrirFiche(l.telephone)}
                        className="border-b border-[#F1F1EC] last:border-0 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
                      >
                        <td className="px-3 py-2.5">
                          <span className="text-[#111111]">{l.nom || "Client sans nom"}</span>
                          {noirs.has(l.cle) && (
                            <span className="ml-2 align-middle">
                              <Etiquette ton="risque">Liste noire</Etiquette>
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 tabular-nums text-[#4A4A4A] whitespace-nowrap">
                          {l.telephone}
                        </td>
                        <td className="px-3 py-2.5 text-[#4A4A4A]">{l.wilaya || "—"}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{l.commandes}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-[#1E7A45]">{l.livrees}</td>
                        <td
                          className={`px-3 py-2.5 text-right tabular-nums ${
                            l.retours > 0 ? "text-[#B3261E] font-semibold" : "text-[#9A9A94]"
                          }`}
                        >
                          {l.retours}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">
                          {formatDA(l.totalPaye)}
                        </td>
                        <td className="px-3 py-2.5 text-right whitespace-nowrap">
                          <Montant valeur={l.marge} colore />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Téléphone : cartes empilées, plus de tableau à faire glisser */}
              <div className="sm:hidden">
                <div className="flex flex-wrap gap-1.5 px-3 pt-3">
                  {COLONNES.filter((c) => c.numerique || c.cle === "nom").map((col) => {
                    const actif = tri.cle === col.cle;
                    return (
                      <button
                        key={col.cle}
                        onClick={() => trierPar(col.cle, col.numerique)}
                        className={`px-2.5 min-h-[40px] rounded-lg text-[12px] border transition-colors ${
                          actif
                            ? "border-[#C9A84C] bg-[#F6EFDD] text-[#8B6914] font-semibold"
                            : "border-[#E9E9E4] bg-white text-[#6B6B6B]"
                        }`}
                      >
                        {col.label}
                        {actif ? (tri.sens === "asc" ? " croissant" : " décroissant") : ""}
                      </button>
                    );
                  })}
                </div>
                <ul className="divide-y divide-[#F1F1EC] mt-2">
                  {lignesTriees.map((l) => (
                    <li key={l.cle}>
                      <button
                        onClick={() => ouvrirFiche(l.telephone)}
                        className="w-full text-left px-4 py-3 active:bg-[#FAFAF8]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13.5px] text-[#111111] truncate">
                              {l.nom || "Client sans nom"}
                            </p>
                            <p className="text-[12px] text-[#6B6B6B] tabular-nums">
                              {l.telephone}
                              {l.wilaya ? ` · ${l.wilaya}` : ""}
                            </p>
                          </div>
                          <Montant valeur={l.marge} colore />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11.5px] text-[#6B6B6B] tabular-nums">
                          <span>{l.commandes} commandes</span>
                          <span className="text-[#1E7A45]">{l.livrees} livrées</span>
                          <span className={l.retours > 0 ? "text-[#B3261E] font-semibold" : ""}>
                            {l.retours} retours
                          </span>
                          <span>{formatDA(l.totalPaye)} payés</span>
                        </div>
                        {noirs.has(l.cle) && (
                          <span className="inline-block mt-2">
                            <Etiquette ton="risque">Liste noire</Etiquette>
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Carte>
      </section>

      {/* ───────────────────────── 3. Liste noire */}
      <section ref={refNoire} className="scroll-mt-32">
        <TitreBloc aide="Dès qu'un de ces numéros réapparaît dans une commande, l'alerte rouge s'allume toute seule dans l'onglet Commandes.">
          Liste noire
        </TitreBloc>

        <div className="grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-4">
          <Carte titre="Ajouter un numéro" className="h-fit">
            <div className="p-4 sm:p-5 space-y-3">
              <Champ
                label="Téléphone"
                value={noire.telephone}
                onChange={(t) => setNoire((n) => ({ ...n, telephone: t }))}
                type="tel"
                inputMode="tel"
                placeholder="0661234567"
              />
              <Champ
                label="Nom"
                value={noire.nom}
                onChange={(t) => setNoire((n) => ({ ...n, nom: t }))}
                placeholder="Nom donné au téléphone"
              />
              <Liste
                label="Wilaya"
                value={noire.wilaya}
                onChange={(t) => setNoire((n) => ({ ...n, wilaya: t }))}
                options={WILAYAS}
              />
              <Liste
                label="Motif"
                value={noire.motif}
                onChange={(t) => setNoire((n) => ({ ...n, motif: t }))}
                options={MOTIFS}
                aide="Le motif reste visible à côté du numéro."
              />
              <Champ
                label="Date"
                value={noire.date}
                onChange={(t) => setNoire((n) => ({ ...n, date: t }))}
                type="date"
              />
              {dejaNoire && (
                <p className="text-[12px] text-[#B3261E]">
                  {"Ce numéro est déjà sur la liste noire."}
                </p>
              )}
              <Bouton
                onClick={enregistrerNoire}
                disabled={!telNoireValide || dejaNoire}
                className="w-full"
              >
                Ajouter à la liste noire
              </Bouton>
            </div>
          </Carte>

          <Carte titre={`Numéros bloqués (${base.blacklist.length})`}>
            {base.blacklist.length === 0 ? (
              <Vide texte="Personne sur la liste noire, tant mieux." />
            ) : (
              <ul className="divide-y divide-[#F1F1EC]">
                {base.blacklist.map((l) => (
                  <li key={l.id} className="px-4 py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => ouvrirFiche(l.telephone)}
                          className="text-[13.5px] text-[#111111] tabular-nums underline decoration-[#D9D9D2] underline-offset-2 hover:decoration-[#C9A84C]"
                        >
                          {l.telephone || "—"}
                        </button>
                        {l.motif && <Etiquette ton="risque">{l.motif}</Etiquette>}
                      </div>
                      <p className="text-[12px] text-[#6B6B6B] mt-1">
                        {l.nom || "Nom inconnu"}
                        {l.wilaya ? ` · ${l.wilaya}` : ""}
                        {l.date ? ` · ajouté le ${formatDate(l.date)}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => supprimerNoire(l.id)}
                      aria-label={`Retirer ${l.telephone} de la liste noire`}
                      title="Retirer de la liste noire"
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-[#E8C9C6] text-[#B3261E] hover:bg-[#FBE7E5] transition-colors"
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
        </div>
      </section>
    </div>
  );
}
