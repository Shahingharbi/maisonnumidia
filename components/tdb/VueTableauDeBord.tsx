"use client";

// Écran d'accueil de l'espace interne.
// Lecture seule : aucune saisie ici, sauf le bouton qui efface les lignes d'exemple.
// Tous les nombres viennent de lib/tdb/calculs.ts, rien n'est recalculé à la main.

import { useMemo, useState } from "react";
import { useTdb } from "@/components/tdb/TdbProvider";
import {
  SEUIL_TAUX_WILAYA,
  calculer,
  calculerKpis,
  filtrerPeriode,
  formatDA,
  formatPct,
  parCle,
  parMois,
  parStatut,
  tauxRetourWilaya,
} from "@/lib/tdb/calculs";
import type { Kpis } from "@/lib/tdb/calculs";
import { COULEUR_STATUT, MOIS_COURTS } from "@/lib/tdb/constantes";
import {
  BORDURE,
  Bouton,
  Carte,
  GrapheAnneau,
  GrapheBarres,
  GrapheLignes,
  PALETTE,
  TitreBloc,
  Tuile,
  Vide,
} from "@/components/tdb/ui";

type Periode = "tout" | "mois";

const TONS = {
  rouge: { fond: "#FBE7E5", texte: "#B3261E" },
  ambre: { fond: "#FDF1DC", texte: "#9A5B00" },
  bleu: { fond: "#E5EDF6", texte: "#1F4E79" },
  vert: { fond: "#E4F4EA", texte: "#1E7A45" },
  or: { fond: "#F6EFDD", texte: "#8B6914" },
} as const;

type Ton = keyof typeof TONS;

/** Une durée moyenne en jours, ou un tiret quand aucune commande ne renseigne les deux dates. */
function formatJours(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  const arrondi = Math.round(n * 10) / 10;
  return `${String(arrondi).replace(".", ",")} j`;
}

interface LigneChiffre {
  label: string;
  tout: string;
  mois: string;
  aide?: string;
}

interface SectionChiffres {
  titre: string;
  lignes: LigneChiffre[];
}

/** Le grand tableau récapitulatif : mêmes lignes à gauche, deux périodes à droite. */
function sectionsChiffres(t: Kpis, m: Kpis): SectionChiffres[] {
  const n = (x: number) => String(x);
  return [
    {
      titre: "Les commandes",
      lignes: [
        { label: "Commandes reçues", tout: n(t.recues), mois: n(m.recues) },
        {
          label: "Commandes confirmées",
          tout: n(t.confirmees),
          mois: n(m.confirmees),
          aide: "tout ce qui a dépassé le stade du téléphone",
        },
        {
          label: "Commandes livrées",
          tout: n(t.livrees),
          mois: n(m.livrees),
          aide: "statut Livrée ou Encaissée",
        },
        { label: "Retours", tout: n(t.retours), mois: n(m.retours) },
        { label: "Clients injoignables", tout: n(t.injoignables), mois: n(m.injoignables) },
        { label: "Commandes annulées", tout: n(t.annulees), mois: n(m.annulees) },
        { label: "Ruptures fournisseur", tout: n(t.ruptures), mois: n(m.ruptures) },
      ],
    },
    {
      titre: "Les taux qui comptent",
      lignes: [
        {
          label: "Taux de confirmation",
          tout: formatPct(t.tauxConfirmation),
          mois: formatPct(m.tauxConfirmation),
          aide: "confirmées sur reçues",
        },
        {
          label: "Taux de livraison réussie",
          tout: formatPct(t.tauxLivraison),
          mois: formatPct(m.tauxLivraison),
          aide: "livrées sur colis partis",
        },
        {
          label: "Taux de retour",
          tout: formatPct(t.tauxRetour),
          mois: formatPct(m.tauxRetour),
          aide: "retours sur colis partis",
        },
        {
          label: "Taux d'injoignables",
          tout: formatPct(t.tauxInjoignables),
          mois: formatPct(m.tauxInjoignables),
        },
      ],
    },
    {
      titre: "L'argent",
      lignes: [
        {
          label: "Argent déjà reçu",
          tout: formatDA(t.argentRecu),
          mois: formatDA(m.argentRecu),
          aide: "versé par Yalidine, statut Encaissée",
        },
        {
          label: "En attente chez Yalidine",
          tout: formatDA(t.enAttente),
          mois: formatDA(m.enAttente),
          aide: "livré mais pas encore versé",
        },
        {
          label: "Marge encaissée",
          tout: formatDA(t.margeEncaissee),
          mois: formatDA(m.margeEncaissee),
          aide: "la seule marge partageable",
        },
        {
          label: "Marge en attente",
          tout: formatDA(t.margeEnAttente),
          mois: formatDA(m.margeEnAttente),
          aide: "acquise, à condition que le versement arrive",
        },
        {
          label: "Panier moyen",
          tout: formatDA(t.panierMoyen),
          mois: formatDA(m.panierMoyen),
        },
        {
          label: "Marge moyenne par commande livrée",
          tout: formatDA(t.margeMoyenne),
          mois: formatDA(m.margeMoyenne),
        },
        {
          label: "Marge moyenne en pourcentage",
          tout: formatPct(t.margePct),
          mois: formatPct(m.margePct),
        },
      ],
    },
    {
      titre: "Ce qui ronge la marge",
      lignes: [
        {
          label: "Remises accordées",
          tout: formatDA(t.remises),
          mois: formatDA(m.remises),
          aide: "sur les commandes livrées uniquement",
        },
        {
          label: "Frais de livraison payés",
          tout: formatDA(t.fraisLivraison),
          mois: formatDA(m.fraisLivraison),
        },
        { label: "Autres frais", tout: formatDA(t.autresFrais), mois: formatDA(m.autresFrais) },
        {
          label: "Coût des retours",
          tout: formatDA(t.coutRetours),
          mois: formatDA(m.coutRetours),
          aide: "le flacon revient, les frais aller et retour restent",
        },
      ],
    },
    {
      titre: "Le service",
      lignes: [
        {
          label: "Délai moyen envoi vers livraison",
          tout: formatJours(t.delaiEnvoiLivraison),
          mois: formatJours(m.delaiEnvoiLivraison),
        },
        {
          label: "Délai moyen livraison vers argent reçu",
          tout: formatJours(t.delaiLivraisonArgent),
          mois: formatJours(m.delaiLivraisonArgent),
          aide: "Yalidine verse jusqu'à 15 jours après",
        },
        {
          label: "Commandes de clients qui reviennent",
          tout: String(t.clientsFideles),
          mois: String(m.clientsFideles),
          aide: "au moins deux commandes sur le même numéro",
        },
      ],
    },
  ];
}

function Compteur({ label, valeur, ton }: { label: string; valeur: number; ton: Ton }) {
  const actif = valeur > 0;
  const { fond, texte } = TONS[ton];
  return (
    <div
      className={`rounded-lg px-3 py-3 min-h-[82px] flex flex-col justify-between ${
        actif ? "" : `bg-[#F7F7F4] ${BORDURE}`
      }`}
      style={actif ? { backgroundColor: fond } : undefined}
    >
      <p
        className="text-[20px] font-semibold leading-none tabular-nums"
        style={{ color: actif ? texte : "#BDBDB6" }}
      >
        {valeur}
      </p>
      <p
        className="text-[11px] leading-tight mt-2"
        style={{ color: actif ? texte : "#9A9A94" }}
      >
        {label}
      </p>
    </div>
  );
}

export default function VueTableauDeBord() {
  const { base, supprimerExemples } = useTdb();
  const [periode, setPeriode] = useState<Periode>("tout");

  const toutes = base.commandes;
  const commandes = useMemo(() => filtrerPeriode(toutes, periode), [toutes, periode]);

  // Les tuiles du haut restent sur le total depuis le début, les deux colonnes du
  // tableau récapitulatif montrent les deux périodes côte à côte.
  const kpisTout = useMemo(() => calculerKpis(toutes, toutes), [toutes]);
  const kpisMois = useMemo(
    () => calculerKpis(filtrerPeriode(toutes, "mois"), toutes),
    [toutes],
  );
  const sections = useMemo(() => sectionsChiffres(kpisTout, kpisMois), [kpisTout, kpisMois]);

  const nbExemples = useMemo(
    () => toutes.filter((c) => c.client.startsWith("EXEMPLE")).length,
    [toutes],
  );

  // Les choses à faire, comptées sur la catégorie d'action et non sur le texte
  // affiché : reformuler une alerte ne doit pas vider silencieusement un compteur.
  const aFaire = useMemo(() => {
    const compte: Record<string, number> = {};
    for (const c of commandes) {
      const cat = calculer(c, { blacklist: base.blacklist, commandes: toutes }).categorie;
      compte[cat] = (compte[cat] ?? 0) + 1;
    }
    return compte;
  }, [commandes, toutes, base.blacklist]);

  const wilayas = useMemo(
    () =>
      parCle(commandes, toutes, (c) => c.wilaya)
        .sort((a, b) => b.commandes - a.commandes)
        .slice(0, 8),
    [commandes, toutes],
  );

  const donneesStatuts = useMemo(
    () =>
      parStatut(commandes)
        .filter((s) => s.valeur > 0)
        .map((s) => ({
          label: s.cle,
          valeur: s.valeur,
          couleur: COULEUR_STATUT[s.cle][1],
        })),
    [commandes],
  );

  const donneesMois = useMemo(() => parMois(commandes, toutes), [commandes, toutes]);

  const donneesSources = useMemo(
    () =>
      parCle(commandes, toutes, (c) => c.source)
        .filter((s) => s.commandes > 0)
        .map((s, i) => ({
          label: s.cle,
          valeur: s.commandes,
          couleur: PALETTE[i % PALETTE.length],
        })),
    [commandes, toutes],
  );

  const donneesAssocies = useMemo(
    () =>
      parCle(commandes, toutes, (c) => c.quiGere, base.reglages.associes)
        .filter((a) => a.cle)
        .map((a) => ({ label: a.cle, valeur: a.marge })),
    [commandes, toutes, base.reglages.associes],
  );

  const libellePeriode = periode === "tout" ? "depuis le début" : "sur le mois en cours";

  return (
    <div className="space-y-4">
      {nbExemples > 0 && (
        <div className="rounded-lg border border-[#E8C9C6] bg-[#FBE7E5] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="flex-1 text-[12.5px] leading-snug text-[#B3261E]">
            Il reste {nbExemples} ligne{nbExemples > 1 ? "s" : ""} d&apos;exemple, les chiffres
            ci-dessous ne sont pas les vôtres.
          </p>
          <Bouton variante="danger" onClick={supprimerExemples}>
            Supprimer les lignes d&apos;exemple
          </Bouton>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <TitreBloc aide="Les cinq tuiles du haut restent sur le total depuis le début.">
          Tableau de bord
        </TitreBloc>
        <div className="flex gap-2 mb-3">
          <Bouton
            variante={periode === "tout" ? "principal" : "secondaire"}
            onClick={() => setPeriode("tout")}
          >
            Depuis le début
          </Bouton>
          <Bouton
            variante={periode === "mois" ? "principal" : "secondaire"}
            onClick={() => setPeriode("mois")}
          >
            Ce mois-ci
          </Bouton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Tuile
          label="Marge dans la poche"
          valeur={formatDA(kpisTout.margeEncaissee)}
          sous="bénéfice sur l'argent déjà versé"
          ton="vert"
        />
        <Tuile
          label="Argent déjà reçu"
          valeur={formatDA(kpisTout.argentRecu)}
          sous="versé par Yalidine"
          ton="or"
        />
        <Tuile
          label="En attente chez Yalidine"
          valeur={formatDA(kpisTout.enAttente)}
          sous="livré mais pas encore versé"
          ton="alerte"
        />
        <Tuile
          label="Taux de livraison"
          valeur={formatPct(kpisTout.tauxLivraison)}
          sous="livrées sur colis partis"
          ton="neutre"
        />
        <Tuile
          label="Taux de confirmation"
          valeur={formatPct(kpisTout.tauxConfirmation)}
          sous="confirmées sur reçues"
          ton="neutre"
        />
      </div>

      <Carte titre="Ce qu'il faut faire maintenant">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
          <Compteur label="à appeler aujourd'hui" valeur={aFaire.appeler ?? 0} ton="bleu" />
          <Compteur label="clients à relancer" valeur={aFaire.relancer ?? 0} ton="rouge" />
          <Compteur label="parfums à acheter" valeur={aFaire.acheter ?? 0} ton="or" />
          <Compteur label="colis à expédier" valeur={aFaire.expedier ?? 0} ton="bleu" />
          <Compteur label="colis en retard" valeur={aFaire.retard ?? 0} ton="rouge" />
          <Compteur label="argent à récupérer" valeur={aFaire.argent ?? 0} ton="ambre" />
          <Compteur label="commandes à clôturer" valeur={aFaire.cloturer ?? 0} ton="rouge" />
          <Compteur label="clients à risque" valeur={aFaire.risque ?? 0} ton="rouge" />
        </div>
        <p className="px-4 pb-4 text-[11px] leading-snug text-[#8A8A84]">
          Compté {libellePeriode}. Pour voir lesquelles, ouvrir l&apos;onglet Commandes et trier
          par la colonne des choses à faire.
        </p>
      </Carte>

      <Carte titre="Tous les chiffres">
        <div className="flex items-center gap-3 px-4 sm:px-5 py-2 bg-[#FAFAF8] border-b border-[#E9E9E4]">
          <span className="flex-1 min-w-0 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
            Indicateur
          </span>
          <span className="w-[96px] sm:w-[128px] shrink-0 text-right text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
            Depuis le début
          </span>
          <span className="w-[96px] sm:w-[128px] shrink-0 text-right text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
            Ce mois-ci
          </span>
        </div>

        {sections.map((s) => (
          <div key={s.titre}>
            <div className="bg-[#111111] px-4 sm:px-5 py-1.5">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#C9A84C]">
                {s.titre}
              </p>
            </div>
            {s.lignes.map((l) => (
              <div
                key={l.label}
                className="flex items-baseline gap-3 px-4 sm:px-5 py-2 border-b border-[#F0F0EA]"
              >
                <span className="flex-1 min-w-0 text-[12px] leading-snug text-[#4A4A4A]">
                  {l.label}
                  {l.aide && (
                    <span className="block text-[10px] text-[#9A9A94] leading-tight">
                      {l.aide}
                    </span>
                  )}
                </span>
                <span className="w-[96px] sm:w-[128px] shrink-0 text-right text-[12px] font-semibold text-[#111111] tabular-nums">
                  {l.tout}
                </span>
                <span className="w-[96px] sm:w-[128px] shrink-0 text-right text-[12px] text-[#6B6B6B] tabular-nums">
                  {l.mois}
                </span>
              </div>
            ))}
          </div>
        ))}
      </Carte>

      <Carte titre="Les 8 wilayas qui commandent le plus">
        {wilayas.length === 0 ? (
          <Vide texte="Aucune commande sur cette période" />
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-[#FAFAF8] border-b border-[#E9E9E4]">
              <span className="flex-1 min-w-0 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
                Wilaya
              </span>
              <span className="w-[84px] shrink-0 text-right text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
                Commandes
              </span>
              <span className="w-[96px] shrink-0 text-right text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
                Taux de retour
              </span>
              <span className="w-[120px] shrink-0 text-right text-[10px] font-semibold tracking-[0.12em] uppercase text-[#9A9A94]">
                Marge
              </span>
            </div>
            <ul>
              {wilayas.map((w) => {
                const taux = tauxRetourWilaya(w);
                const tauxTexte = taux === null ? "—" : formatPct(taux, 0);
                const tauxEleve = taux !== null && taux >= 0.2;
                return (
                  <li key={w.cle} className="px-4 sm:px-5 py-2.5 border-b border-[#F0F0EA]">
                    <div className="sm:hidden">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-medium text-[#111111] truncate">
                          {w.cle}
                        </span>
                        <span className="text-[12px] font-semibold text-[#111111] tabular-nums shrink-0">
                          {formatDA(w.marge)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8A8A84] mt-0.5 tabular-nums">
                        {w.commandes} commande{w.commandes > 1 ? "s" : ""}
                        {" · retours "}
                        <span style={tauxEleve ? { color: "#B3261E", fontWeight: 600 } : undefined}>
                          {tauxTexte}
                        </span>
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      <span className="flex-1 min-w-0 text-[12.5px] text-[#111111] truncate">
                        {w.cle}
                      </span>
                      <span className="w-[84px] shrink-0 text-right text-[12.5px] text-[#4A4A4A] tabular-nums">
                        {w.commandes}
                      </span>
                      <span
                        className="w-[96px] shrink-0 text-right text-[12.5px] tabular-nums"
                        style={{
                          color: tauxEleve ? "#B3261E" : "#4A4A4A",
                          fontWeight: tauxEleve ? 600 : 400,
                        }}
                      >
                        {tauxTexte}
                      </span>
                      <span className="w-[120px] shrink-0 text-right text-[12.5px] font-semibold text-[#111111] tabular-nums">
                        {formatDA(w.marge)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="px-4 sm:px-5 py-3 text-[11px] leading-snug text-[#8A8A84]">
              Le taux de retour ne s&apos;affiche qu&apos;à partir de {SEUIL_TAUX_WILAYA} colis
              partis. En dessous, il reste un tiret : trop peu de colis pour en tirer quoi que ce
              soit.
            </p>
          </>
        )}
      </Carte>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Carte titre="Où en sont les commandes">
          <GrapheBarres data={donneesStatuts} />
        </Carte>

        <Carte titre="Argent reçu et marge, mois par mois">
          <GrapheLignes
            labels={MOIS_COURTS}
            series={[
              {
                nom: "Argent reçu",
                couleur: "#1E7A45",
                points: donneesMois.map((m) => m.argent),
              },
              {
                nom: "Marge",
                couleur: "#C9A84C",
                points: donneesMois.map((m) => m.marge),
              },
            ]}
            format={formatDA}
          />
        </Carte>

        <Carte titre="D'où viennent les commandes">
          <GrapheAnneau data={donneesSources} />
        </Carte>

        <Carte titre="Marge rapportée par associé">
          <GrapheBarres data={donneesAssocies} format={formatDA} />
          <p className="px-4 pb-4 text-[11px] leading-snug text-[#8A8A84]">
            Marge de toutes les commandes suivies par chacun, {libellePeriode}. Seule la marge
            encaissée se partage.
          </p>
        </Carte>
      </div>
    </div>
  );
}
