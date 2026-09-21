"use client";

// Onglet RÉGLAGES : les listes qui alimentent les menus déroulants du reste de
// l'espace interne (associés, fournisseurs, sources), les tarifs Yalidine par
// wilaya, la sauvegarde des données et un rappel sur l'accès à la page.
// Aucune règle de calcul métier ici : ce fichier ne fait que lire et écrire des
// réglages, tout le reste vient de lib/tdb/calculs.ts.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  Info,
  Lock,
  Plus,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import type { TarifWilaya } from "@/lib/tdb/types";
import { REPERES_YALIDINE, WILAYAS } from "@/lib/tdb/constantes";
import { formatDA, formatDate, formatPct } from "@/lib/tdb/calculs";
import { useTdb } from "./TdbProvider";
import { BORDURE, Bouton, Carte, Champ, TitreBloc, Vide } from "./ui";

// Mêmes jetons visuels que le champ de components/tdb/ui.tsx, pour les cases
// alignées en colonnes où une étiquette au-dessus de chacune serait illisible.
// Hauteur minimale de 40 px : deux des trois associés saisissent au téléphone.
const CHAMP_NU =
  "w-full min-h-[40px] border border-[#DCDCD5] rounded-lg px-3 py-2 text-[13px] text-[#111111] " +
  "bg-white focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition";

const AMBRE_FOND = "#FDF1DC";
const AMBRE_TEXTE = "#9A5B00";
const ROUGE = "#B3261E";
const ROUGE_FOND = "#FBE7E5";
const VERT = "#1E7A45";
const VERT_FOND = "#E4F4EA";

const MOT_EFFACEMENT = "EFFACER";

/** Lit un nombre saisi au clavier, case vide comprise. */
function nombreOuNull(saisie: string): number | null {
  const propre = saisie.replace(/\s/g, "").replace(",", ".");
  if (!propre) return null;
  const n = Number(propre);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Comparaison de recherche sans accent ni majuscule. */
function sansAccent(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Nettoie une liste saisie à la main : espaces, cases vides et doublons retirés. */
function listePropre(lignes: string[]): string[] {
  const vues = new Set<string>();
  const sortie: string[] = [];
  for (const brut of lignes) {
    const valeur = brut.trim();
    if (!valeur) continue;
    const cle = sansAccent(valeur);
    if (vues.has(cle)) continue;
    vues.add(cle);
    sortie.push(valeur);
  }
  return sortie;
}

function memesListes(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Petit message vert qui disparaît tout seul après un enregistrement. */
function useConfirmation(): [boolean, () => void] {
  const [vu, setVu] = useState(false);
  useEffect(() => {
    if (!vu) return;
    const t = setTimeout(() => setVu(false), 2500);
    return () => clearTimeout(t);
  }, [vu]);
  return [vu, () => setVu(true)];
}

function Enregistre() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold"
      style={{ color: VERT }}
    >
      <Check size={13} strokeWidth={2.2} />
      Enregistré
    </span>
  );
}

function AEnregistrer() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold"
      style={{ color: AMBRE_TEXTE }}
    >
      <TriangleAlert size={13} strokeWidth={2} />
      Modifications pas encore enregistrées
    </span>
  );
}

// ───────────────────────────────────────────────── listes de noms éditables

/** Une ligne de brouillon garde sa propre clé, pour que le champ en cours de
 *  saisie ne se déplace pas quand on supprime la ligne du dessus. */
interface LigneNom {
  cle: string;
  valeur: string;
}

let compteurCle = 0;
function nouvelleCle(): string {
  compteurCle += 1;
  return `l${compteurCle}`;
}

function versLignes(valeurs: string[]): LigneNom[] {
  return valeurs.map((valeur) => ({ cle: nouvelleCle(), valeur }));
}

function BlocListe({
  titre,
  explication,
  placeholder,
  libelleAjout,
  valeurs,
  onEnregistrer,
}: {
  titre: string;
  explication: string;
  placeholder: string;
  libelleAjout: string;
  valeurs: string[];
  onEnregistrer: (v: string[]) => void;
}) {
  const [lignes, setLignes] = useState<LigneNom[]>(() => versLignes(valeurs));
  const [confirme, montrerConfirme] = useConfirmation();

  // La liste enregistrée reste la référence : si elle change ailleurs, on la reprend.
  useEffect(() => {
    setLignes(versLignes(valeurs));
  }, [valeurs]);

  const propres = useMemo(() => listePropre(lignes.map((l) => l.valeur)), [lignes]);
  const modifie = !memesListes(propres, valeurs);

  function modifierLigne(cle: string, valeur: string) {
    setLignes((l) => l.map((x) => (x.cle === cle ? { ...x, valeur } : x)));
  }

  function retirerLigne(cle: string) {
    setLignes((l) => l.filter((x) => x.cle !== cle));
  }

  function enregistrer() {
    setLignes(versLignes(propres));
    onEnregistrer(propres);
    montrerConfirme();
  }

  return (
    <Carte titre={titre}>
      <div className="px-4 sm:px-5 py-4">
        <p className="text-[12px] text-[#6B6B6B] leading-relaxed">{explication}</p>

        <div className="space-y-2 mt-3">
          {lignes.length === 0 && (
            <p className="text-[12px] text-[#9A9A94] py-2">
              Liste vide. Ajoutez au moins une entrée, sinon le menu déroulant
              correspondant restera vide dans les autres onglets.
            </p>
          )}
          {lignes.map((l) => (
            <div key={l.cle} className="flex items-center gap-2">
              <input
                value={l.valeur}
                onChange={(e) => modifierLigne(l.cle, e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={CHAMP_NU}
              />
              <button
                type="button"
                onClick={() => retirerLigne(l.cle)}
                aria-label={`Retirer ${l.valeur || "cette ligne"}`}
                className="shrink-0 w-10 h-10 grid place-items-center rounded-lg border border-[#E8C9C6] text-[#B3261E] hover:bg-[#FBE7E5] transition-colors"
              >
                <Trash2 size={15} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Bouton
            variante="secondaire"
            onClick={() => setLignes((l) => [...l, { cle: nouvelleCle(), valeur: "" }])}
            className="min-h-[40px]"
          >
            <span className="inline-flex items-center gap-1.5">
              <Plus size={14} strokeWidth={2} />
              {libelleAjout}
            </span>
          </Bouton>
          <Bouton onClick={enregistrer} disabled={!modifie} className="min-h-[40px]">
            Enregistrer
          </Bouton>
          {modifie && <AEnregistrer />}
          {!modifie && confirme && <Enregistre />}
        </div>

        <p className="text-[11px] text-[#9A9A94] leading-relaxed mt-3">
          Les cases vides et les doublons sont retirés à l&apos;enregistrement.
          Renommer une entrée ici ne renomme pas les lignes déjà saisies dans les
          autres onglets : corrigez-les à la main si besoin.
        </p>
      </div>
    </Carte>
  );
}

// ─────────────────────────────────────────────────────────── tarifs Yalidine

interface LigneTarif {
  wilaya: string;
  stopDesk: string;
  domicile: string;
  delai: string;
}

/** Les 58 wilayas sont toujours listées, même si la base en contient moins. */
function versBrouillon(tarifs: TarifWilaya[]): LigneTarif[] {
  const connus = new Map(tarifs.map((t) => [t.wilaya, t]));
  return WILAYAS.map((w) => {
    const t = connus.get(w);
    return {
      wilaya: w,
      stopDesk: t && t.stopDesk !== null ? String(t.stopDesk) : "",
      domicile: t && t.domicile !== null ? String(t.domicile) : "",
      delai: t && t.delai !== null ? String(t.delai) : "",
    };
  });
}

function versTarifs(lignes: LigneTarif[]): TarifWilaya[] {
  return lignes.map((l) => ({
    wilaya: l.wilaya,
    stopDesk: nombreOuNull(l.stopDesk),
    domicile: nombreOuNull(l.domicile),
    delai: nombreOuNull(l.delai),
  }));
}

function memesTarifs(a: LigneTarif[], b: LigneTarif[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (l, i) =>
        l.wilaya === b[i].wilaya &&
        nombreOuNull(l.stopDesk) === nombreOuNull(b[i].stopDesk) &&
        nombreOuNull(l.domicile) === nombreOuNull(b[i].domicile) &&
        nombreOuNull(l.delai) === nombreOuNull(b[i].delai),
    )
  );
}

function BlocTarifs({
  tarifs,
  onEnregistrer,
}: {
  tarifs: TarifWilaya[];
  onEnregistrer: (t: TarifWilaya[]) => void;
}) {
  const reference = useMemo(() => versBrouillon(tarifs), [tarifs]);
  const [lignes, setLignes] = useState<LigneTarif[]>(reference);
  const [recherche, setRecherche] = useState("");
  const [confirme, montrerConfirme] = useConfirmation();

  useEffect(() => {
    setLignes(reference);
  }, [reference]);

  const modifie = !memesTarifs(lignes, reference);

  const visibles = useMemo(() => {
    const q = sansAccent(recherche.trim());
    if (!q) return lignes;
    return lignes.filter((l) => sansAccent(l.wilaya).includes(q));
  }, [lignes, recherche]);

  const remplies = lignes.filter((l) => l.stopDesk.trim() || l.domicile.trim()).length;

  function modifierLigne(wilaya: string, champ: "stopDesk" | "domicile" | "delai", valeur: string) {
    setLignes((l) => l.map((x) => (x.wilaya === wilaya ? { ...x, [champ]: valeur } : x)));
  }

  function enregistrer() {
    onEnregistrer(versTarifs(lignes));
    montrerConfirme();
  }

  return (
    <Carte titre="Tarifs Yalidine">
      <div className="px-4 sm:px-5 py-4 space-y-3">
        <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
          Recopiez-les une fois depuis votre espace vendeur Yalidine, puis on ne
          les retouche qu&apos;au changement de grille. Ces montants servent à
          proposer le bon frais de livraison au moment de la saisie d&apos;une
          commande, ils ne modifient aucune commande déjà enregistrée.
        </p>

        <div
          className="rounded-lg px-3 py-3 text-[11.5px] leading-relaxed"
          style={{ backgroundColor: AMBRE_FOND, color: AMBRE_TEXTE }}
        >
          <p className="font-semibold flex items-center gap-1.5">
            <Info size={13} strokeWidth={2} />
            Repères marché 2026, à vérifier sur votre compte
          </p>
          <ul className="mt-1.5 space-y-0.5">
            <li>
              Retour d&apos;un colis refusé : {formatDA(REPERES_YALIDINE.retour)} par
              colis.
            </li>
            <li>
              Commission de recouvrement : {formatPct(REPERES_YALIDINE.commissionPct, 0)}{" "}
              de la somme encaissée chez le client.
            </li>
            <li>
              Assurance facultative : {formatPct(REPERES_YALIDINE.assurancePct, 0)} de la
              valeur déclarée.
            </li>
            <li>
              Sans assurance, un colis perdu est remboursé{" "}
              {formatDA(REPERES_YALIDINE.plafondSansAssurance)} au maximum.
            </li>
            <li>
              Versement de l&apos;argent sous {REPERES_YALIDINE.versementJours} jours
              environ après la livraison.
            </li>
          </ul>
          <p className="mt-1.5 opacity-90">
            Ce sont des repères, pas vos tarifs contractuels : confirmez-les dans
            votre espace vendeur avant de vous en servir pour fixer un prix.
          </p>
        </div>

        <div className="sm:max-w-[320px]">
          <Champ
            label="Chercher une wilaya"
            value={recherche}
            onChange={setRecherche}
            placeholder="Blida, Oran, Tizi..."
            aide={`${remplies} wilaya${remplies > 1 ? "s" : ""} renseignée${
              remplies > 1 ? "s" : ""
            } sur ${lignes.length}`}
          />
        </div>
      </div>

      <div
        className={`hidden sm:grid grid-cols-[1fr_108px_108px_92px] gap-3 px-5 py-2 ${BORDURE} border-x-0 bg-[#F6F6F3]`}
      >
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B]">
          Wilaya
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] text-right">
          Stop desk
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] text-right">
          À domicile
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] text-right">
          Délai (j)
        </span>
      </div>

      <div className="max-h-[520px] overflow-y-auto divide-y divide-[#F0F0EA]">
        {visibles.length === 0 && (
          <Vide texte="Aucune wilaya ne correspond à cette recherche." />
        )}
        {visibles.map((l) => (
          <div
            key={l.wilaya}
            className="px-4 sm:px-5 py-3 sm:grid sm:grid-cols-[1fr_108px_108px_92px] sm:gap-3 sm:items-center"
          >
            <p className="text-[12.5px] font-medium text-[#111111]">{l.wilaya}</p>
            <div className="grid grid-cols-3 gap-2 mt-2 sm:contents sm:mt-0">
              <label className="block">
                <span className="block sm:hidden text-[10px] text-[#8A8A84] mb-1">
                  Stop desk
                </span>
                <input
                  value={l.stopDesk}
                  onChange={(e) => modifierLigne(l.wilaya, "stopDesk", e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  aria-label={`Stop desk, ${l.wilaya}`}
                  className={`${CHAMP_NU} text-right tabular-nums`}
                />
              </label>
              <label className="block">
                <span className="block sm:hidden text-[10px] text-[#8A8A84] mb-1">
                  À domicile
                </span>
                <input
                  value={l.domicile}
                  onChange={(e) => modifierLigne(l.wilaya, "domicile", e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  aria-label={`À domicile, ${l.wilaya}`}
                  className={`${CHAMP_NU} text-right tabular-nums`}
                />
              </label>
              <label className="block">
                <span className="block sm:hidden text-[10px] text-[#8A8A84] mb-1">
                  Délai (j)
                </span>
                <input
                  value={l.delai}
                  onChange={(e) => modifierLigne(l.wilaya, "delai", e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  aria-label={`Délai en jours, ${l.wilaya}`}
                  className={`${CHAMP_NU} text-right tabular-nums`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-[#E9E9E4] flex flex-wrap items-center gap-2">
        <Bouton onClick={enregistrer} disabled={!modifie} className="min-h-[40px]">
          Enregistrer les tarifs
        </Bouton>
        <Bouton
          variante="secondaire"
          onClick={() => setLignes(reference)}
          disabled={!modifie}
          className="min-h-[40px]"
        >
          Annuler mes changements
        </Bouton>
        {modifie && <AEnregistrer />}
        {!modifie && confirme && <Enregistre />}
      </div>
    </Carte>
  );
}

// ──────────────────────────────────────────────────────────────────── vue

export default function VueReglages() {
  const {
    base,
    majReglages,
    supprimerExemples,
    exporterJson,
    importerJson,
    toutEffacer,
  } = useTdb();

  const fichierRef = useRef<HTMLInputElement>(null);
  const [erreurImport, setErreurImport] = useState("");
  const [importOk, setImportOk] = useState(false);
  const [demandeEffacement, setDemandeEffacement] = useState(false);
  const [motSaisi, setMotSaisi] = useState("");

  const resteDesExemples = base.commandes.some((c) => c.client.startsWith("EXEMPLE"));

  async function choisirFichier(fichier: File | undefined) {
    if (!fichier) return;
    setErreurImport("");
    setImportOk(false);
    try {
      await importerJson(fichier);
      setImportOk(true);
    } catch {
      setErreurImport(
        "Ce fichier n'a pas pu être lu. Reprenez un fichier issu du bouton d'export de cette page.",
      );
    }
  }

  function effacerPourDeVrai() {
    toutEffacer();
    setDemandeEffacement(false);
    setMotSaisi("");
  }

  return (
    <div className="space-y-6">
      <TitreBloc aide="Les listes saisies ici alimentent les menus déroulants des autres onglets. Rien n'est calculé sur cette page.">
        Réglages
      </TitreBloc>

      <div className="grid gap-4 lg:grid-cols-3 items-start">
        <BlocListe
          titre="Les associés"
          explication="Les prénoms des personnes qui travaillent sur la boutique. Ils alimentent partout les listes déroulantes : « qui gère » dans les commandes, « qui a payé » dans la caisse, et ce sont eux qui apparaissent dans les soldes entre associés."
          placeholder="Prénom"
          libelleAjout="Ajouter un associé"
          valeurs={base.reglages.associes}
          onEnregistrer={(associes) => majReglages({ associes })}
        />
        <BlocListe
          titre="Les fournisseurs"
          explication="Chez qui vous achetez les flacons. La liste se retrouve dans le champ fournisseur d'une commande et sert ensuite à comparer les marges obtenues chez les uns et chez les autres."
          placeholder="Nom du fournisseur"
          libelleAjout="Ajouter un fournisseur"
          valeurs={base.reglages.fournisseurs}
          onEnregistrer={(fournisseurs) => majReglages({ fournisseurs })}
        />
        <BlocListe
          titre="D'où viennent les commandes"
          explication="Site, Instagram, bouche à oreille, boutique de Blida... Cette liste alimente le champ source d'une commande, qui sert à voir quel canal rapporte vraiment."
          placeholder="Nom du canal"
          libelleAjout="Ajouter une source"
          valeurs={base.reglages.sources}
          onEnregistrer={(sources) => majReglages({ sources })}
        />
      </div>

      <BlocTarifs
        tarifs={base.reglages.tarifs}
        onEnregistrer={(tarifs) => majReglages({ tarifs })}
      />

      <Carte titre="Vos données">
        <div className="px-4 sm:px-5 py-4 space-y-4">
          <div
            className="rounded-lg px-3 py-3 text-[12px] leading-relaxed"
            style={{ backgroundColor: AMBRE_FOND, color: AMBRE_TEXTE }}
          >
            <p className="font-semibold flex items-center gap-1.5">
              <TriangleAlert size={13} strokeWidth={2} />
              À lire avant de saisir beaucoup de commandes
            </p>
            <p className="mt-1.5">
              Pour l&apos;instant, tout ce que vous tapez ici est enregistré dans
              le navigateur de la personne qui saisit, sur son propre appareil.
              Chacun voit donc ses propres données : elles ne sont pas encore
              partagées entre les trois associés, et elles disparaissent si on
              vide le cache du navigateur ou si on change de téléphone.
            </p>
            <p className="mt-1.5">
              Pour travailler vraiment à trois sur les mêmes données, il faut
              brancher une base de données : c&apos;est la prochaine étape. En
              attendant, exportez régulièrement, au moins une fois par semaine.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Bouton variante="secondaire" onClick={exporterJson} className="min-h-[40px]">
              <span className="inline-flex items-center gap-1.5">
                <Download size={14} strokeWidth={1.9} />
                Exporter mes données
              </span>
            </Bouton>

            <Bouton
              variante="secondaire"
              onClick={() => fichierRef.current?.click()}
              className="min-h-[40px]"
            >
              <span className="inline-flex items-center gap-1.5">
                <Upload size={14} strokeWidth={1.9} />
                Importer un fichier
              </span>
            </Bouton>
            <input
              ref={fichierRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const fichier = e.target.files?.[0];
                e.target.value = "";
                void choisirFichier(fichier);
              }}
            />

            {resteDesExemples && (
              <Bouton
                variante="secondaire"
                onClick={supprimerExemples}
                className="min-h-[40px]"
              >
                Supprimer les lignes d&apos;exemple
              </Bouton>
            )}
          </div>

          {erreurImport && (
            <p
              className="rounded-lg px-3 py-2 text-[12px]"
              style={{ backgroundColor: ROUGE_FOND, color: ROUGE }}
            >
              {erreurImport}
            </p>
          )}
          {importOk && (
            <p
              className="rounded-lg px-3 py-2 text-[12px] font-medium"
              style={{ backgroundColor: VERT_FOND, color: VERT }}
            >
              Fichier importé. Les données affichées sont maintenant celles du
              fichier choisi, elles remplacent ce qu&apos;il y avait sur cet
              appareil.
            </p>
          )}

          <ul className="text-[12px] text-[#6B6B6B] space-y-1 pt-1">
            <li>
              Sur cet appareil : {base.commandes.length} commande
              {base.commandes.length > 1 ? "s" : ""}, {base.operations.length} opération
              {base.operations.length > 1 ? "s" : ""} de caisse, {base.blacklist.length}{" "}
              numéro{base.blacklist.length > 1 ? "s" : ""} en liste noire.
            </li>
            <li>Dernière écriture : {formatDate(base.majLe.slice(0, 10))}.</li>
          </ul>

          <div className="pt-2 border-t border-[#E9E9E4]">
            {!demandeEffacement ? (
              <Bouton
                variante="danger"
                onClick={() => setDemandeEffacement(true)}
                className="min-h-[40px]"
              >
                Tout effacer
              </Bouton>
            ) : (
              <div
                className="rounded-lg px-3 py-3 space-y-3"
                style={{ backgroundColor: ROUGE_FOND }}
              >
                <p className="text-[12px] leading-relaxed" style={{ color: ROUGE }}>
                  Cette action vide les commandes, la caisse et la liste noire de
                  cet appareil, et remet aussi les réglages ci-dessus dans leur
                  état de départ : associés, fournisseurs, sources et tarifs
                  Yalidine seront à ressaisir. Elle ne peut pas être annulée.
                  Exportez vos données avant, si ce n&apos;est pas déjà fait.
                  Pour confirmer, écrivez {MOT_EFFACEMENT} ci-dessous.
                </p>
                <div className="sm:max-w-[260px]">
                  <Champ
                    label={`Écrivez ${MOT_EFFACEMENT} pour confirmer`}
                    value={motSaisi}
                    onChange={setMotSaisi}
                    placeholder={MOT_EFFACEMENT}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Bouton
                    variante="danger"
                    onClick={effacerPourDeVrai}
                    disabled={motSaisi.trim().toUpperCase() !== MOT_EFFACEMENT}
                    className="min-h-[40px]"
                  >
                    Oui, tout effacer définitivement
                  </Bouton>
                  <Bouton
                    variante="secondaire"
                    onClick={() => {
                      setDemandeEffacement(false);
                      setMotSaisi("");
                    }}
                    className="min-h-[40px]"
                  >
                    Annuler
                  </Bouton>
                </div>
              </div>
            )}
          </div>
        </div>
      </Carte>

      <Carte titre="Accès">
        <div className="px-4 sm:px-5 py-4">
          <p className="text-[12px] text-[#6B6B6B] leading-relaxed flex items-start gap-2">
            <Lock size={14} strokeWidth={1.9} className="mt-[2px] shrink-0 text-[#8B6914]" />
            <span>
              Cette page est protégée par un identifiant et un mot de passe
              vérifiés sur le serveur : sans eux, l&apos;adresse renvoie vers
              l&apos;écran de connexion. Ne partagez pas l&apos;adresse de
              l&apos;espace interne, et gardez les identifiants entre vous trois.
            </span>
          </p>
          <ul className="text-[12px] text-[#6B6B6B] space-y-1.5 mt-3 pl-6">
            <li>
              Pour changer les identifiants : dans Vercel, Settings puis
              Environment Variables, définissez <strong>TDB_USER</strong> et{" "}
              <strong>TDB_PASS</strong>, puis redéployez le site.
            </li>
            <li>
              Le mot de passe ne s&apos;affiche jamais sur cette page et
              n&apos;est jamais envoyé au navigateur.
            </li>
            <li>
              Si quelqu&apos;un quitte le projet, changez{" "}
              <strong>TDB_PASS</strong> le jour même : c&apos;est le seul verrou.
            </li>
            <li>
              Le bouton de déconnexion, en haut à droite, efface le cookie
              d&apos;accès de cet appareil mais ne touche pas aux données
              enregistrées dessus.
            </li>
          </ul>
        </div>
      </Carte>
    </div>
  );
}
