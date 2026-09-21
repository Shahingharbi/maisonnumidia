"use client";

// Onglet CAISSE : qui a avancé quoi, ce qui reste à partager, le journal des
// opérations et les charges fixes du mois. Tous les calculs viennent de
// lib/tdb/calculs.ts, rien n'est recalculé à la main ici.

import { useMemo, useState } from "react";
import type { ChargeFixe, Operation, TypeOperation } from "@/lib/tdb/types";
import { TYPES_OPERATION } from "@/lib/tdb/types";
import { POSTES_CHARGES } from "@/lib/tdb/constantes";
import {
  calculerKpis,
  effetCaisse,
  formatDA,
  formatDate,
  soldesAssocies,
} from "@/lib/tdb/calculs";
import { operationVide, useTdb } from "./TdbProvider";
import {
  BORDURE,
  Bouton,
  Carte,
  Champ,
  Etiquette,
  Liste,
  TitreBloc,
  Tuile,
  Vide,
} from "./ui";

// Mêmes jetons que le champ de components/tdb/ui.tsx, pour les lignes éditables
// où une étiquette au-dessus de chaque case serait illisible.
const CHAMP_NU =
  "w-full min-h-[40px] border border-[#DCDCD5] rounded-lg px-3 py-2 text-[13px] text-[#111111] " +
  "bg-white focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition";

const VERT = "#1E7A45";
const ROUGE = "#B3261E";

/** Lit un montant saisi au clavier sans jamais renvoyer NaN. */
function nombre(saisie: string): number {
  const n = Number(saisie.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function estTypeOperation(v: string): v is TypeOperation {
  return (TYPES_OPERATION as readonly string[]).includes(v);
}

/** Brouillon du formulaire : les montants restent du texte tant qu'on tape. */
interface BrouillonOperation {
  date: string;
  qui: string;
  type: TypeOperation;
  montant: string;
  commande: string;
  preuve: boolean;
  note: string;
}

/** Un montant à zéro se saisit mieux dans une case vide qu'avec un 0 à effacer. */
function afficheMontant(n: number): string {
  return Number.isFinite(n) && n !== 0 ? String(n) : "";
}

function brouillonDepart(): BrouillonOperation {
  const modele = operationVide();
  return {
    date: modele.date,
    qui: "",
    type: modele.type,
    montant: "",
    commande: "",
    preuve: false,
    note: "",
  };
}

/** Deux boutons oui / non, assez hauts pour le pouce. */
function Bascule({
  label,
  actif,
  onChange,
}: {
  label: string;
  actif: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="block">
      <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1">{label}</span>
      <div className="flex gap-2">
        {[true, false].map((v) => {
          const choisi = actif === v;
          return (
            <button
              key={v ? "oui" : "non"}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={choisi}
              className={`flex-1 min-h-[40px] rounded-lg border text-[13px] font-medium transition-colors ${
                choisi
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#6B6B6B] border-[#DCDCD5] hover:border-[#C9A84C]"
              }`}
            >
              {v ? "Oui" : "Non"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Le montant d'une opération, signé et coloré selon son effet sur la caisse. */
function Effet({ montant }: { montant: number }) {
  const couleur = montant > 0 ? VERT : montant < 0 ? ROUGE : "#6B6B6B";
  return (
    <span className="text-[13px] font-semibold tabular-nums" style={{ color: couleur }}>
      {montant > 0 ? "+" : ""}
      {formatDA(montant)}
    </span>
  );
}

export default function VueCaisse() {
  const { base, ajouterOperation, supprimerOperation, majReglages, nouvelId } = useTdb();

  const [brouillon, setBrouillon] = useState<BrouillonOperation>(brouillonDepart);
  const [aSupprimer, setASupprimer] = useState<string | null>(null);

  const associes = useMemo(
    () => base.reglages.associes.filter(Boolean),
    [base.reglages.associes],
  );

  const soldes = useMemo(
    () => soldesAssocies(base.operations, base.reglages.associes),
    [base.operations, base.reglages.associes],
  );

  const kpis = useMemo(
    () => calculerKpis(base.commandes, base.commandes),
    [base.commandes],
  );

  const operations = useMemo(
    () =>
      [...base.operations].sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date < b.date ? 1 : -1;
      }),
    [base.operations],
  );

  const effetNet = useMemo(
    () => base.operations.reduce((t, o) => t + effetCaisse(o), 0),
    [base.operations],
  );

  const charges = base.reglages.chargesFixes;
  const totalCharges = charges.reduce(
    (t, c) => t + (Number.isFinite(c.montant) ? c.montant : 0),
    0,
  );

  const beneficeNet = kpis.margeEncaissee - totalCharges;
  const part = associes.length > 0 ? beneficeNet / associes.length : null;

  const montantSaisi = nombre(brouillon.montant);
  const peutAjouter = montantSaisi > 0 && brouillon.qui !== "" && brouillon.date !== "";

  function ajouter() {
    if (!peutAjouter) return;
    const operation: Operation = {
      ...operationVide(),
      date: brouillon.date,
      qui: brouillon.qui,
      type: brouillon.type,
      montant: montantSaisi,
      commande: brouillon.commande.trim(),
      preuve: brouillon.preuve,
      note: brouillon.note.trim(),
    };
    ajouterOperation(operation);
    setBrouillon({ ...brouillonDepart(), qui: brouillon.qui, type: brouillon.type });
  }

  // Les charges s'écrivent tout de suite dans les réglages : pas de bouton
  // « Enregistrer » à oublier, la base est sauvegardée à chaque frappe.
  function majCharge(id: string, retouche: Partial<Omit<ChargeFixe, "id">>) {
    majReglages({
      chargesFixes: charges.map((c) => (c.id === id ? { ...c, ...retouche } : c)),
    });
  }

  function ajouterCharge() {
    majReglages({
      chargesFixes: [...charges, { id: nouvelId(), poste: "", montant: 0 }],
    });
  }

  function retirerCharge(id: string) {
    majReglages({ chargesFixes: charges.filter((c) => c.id !== id) });
  }

  return (
    <div className="space-y-7">
      {/* ───────────────────────────────── 1. Où en est chacun */}
      <section>
        <TitreBloc aide="Ce que chacun a sorti de sa poche, et ce qui lui est déjà revenu.">
          Où en est chacun
        </TitreBloc>

        {soldes.length === 0 ? (
          <Carte>
            <Vide texte="Aucun associé dans les réglages. Ajoutez-les dans l'onglet Réglages." />
          </Carte>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {soldes.map((s) => {
              const negatif = s.solde < 0;
              return (
                <div
                  key={s.associe}
                  className={`bg-white ${BORDURE} rounded-lg px-4 py-4`}
                >
                  <p className="text-[13px] font-semibold text-[#111111]">{s.associe}</p>

                  <dl className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-[11px] text-[#6B6B6B]">Il a avancé</dt>
                      <dd className="text-[13px] tabular-nums text-[#111111]">
                        {formatDA(s.avance)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-[11px] text-[#6B6B6B]">Il a récupéré</dt>
                      <dd className="text-[13px] tabular-nums text-[#111111]">
                        {formatDA(s.recupere)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 pt-1.5 border-t border-[#E9E9E4]">
                      <dt className="text-[11px] font-semibold text-[#111111]">Solde</dt>
                      <dd
                        className="text-[16px] font-semibold tabular-nums"
                        style={{ color: negatif ? ROUGE : s.solde > 0 ? VERT : "#111111" }}
                      >
                        {formatDA(s.solde)}
                      </dd>
                    </div>
                  </dl>

                  {negatif && (
                    <p className="mt-2 text-[11px] leading-snug text-[#B3261E] bg-[#FBE7E5] rounded-lg px-2.5 py-2">
                      {"il a mis de l'argent de sa poche et ne l'a pas encore récupéré"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ───────────────────────────── 2. Ce qu'il reste à partager */}
      <section>
        <TitreBloc aide="Calculé sur les commandes encaissées uniquement.">
          Ce qu&apos;il reste à partager
        </TitreBloc>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Tuile
            label="Marge encaissée"
            valeur={formatDA(kpis.margeEncaissee)}
            sous="Depuis le début"
            ton="or"
          />
          <Tuile
            label="Charges fixes"
            valeur={formatDA(totalCharges)}
            sous="Par mois"
            ton="neutre"
          />
          <Tuile
            label="Bénéfice net"
            valeur={formatDA(beneficeNet)}
            sous="Marge encaissée moins charges"
            ton={beneficeNet >= 0 ? "vert" : "alerte"}
          />
          <Tuile
            label="Part par associé"
            valeur={part === null ? "—" : formatDA(part)}
            sous={
              associes.length > 0
                ? `Partagé en ${associes.length}`
                : "Aucun associé enregistré"
            }
            ton="or"
          />
        </div>

        <p className={`mt-3 bg-white ${BORDURE} rounded-lg px-4 py-3 text-[12px] leading-relaxed text-[#4A4A4A]`}>
          On ne partage que ce qui est encaissé. Une commande livrée mais pas encore versée
          par Yalidine ne se partage pas : l&apos;argent est toujours chez le transporteur,
          il peut mettre jusqu&apos;à quinze jours à arriver.{" "}
          <span className="font-semibold text-[#111111]">
            {formatDA(kpis.margeEnAttente)}
          </span>{" "}
          de marge sont dans ce cas aujourd&apos;hui.
        </p>
      </section>

      {/* ─────────────────────────────────────── 3. Opérations */}
      <section>
        <TitreBloc aide="Chaque mouvement d'argent, dans les deux sens.">
          Opérations
        </TitreBloc>

        <Carte titre="Ajouter une opération" className="mb-3">
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Champ
                label="Date"
                type="date"
                value={brouillon.date}
                onChange={(v) => setBrouillon((b) => ({ ...b, date: v }))}
              />
              <Liste
                label="Qui"
                value={brouillon.qui}
                onChange={(v) => setBrouillon((b) => ({ ...b, qui: v }))}
                options={base.reglages.associes}
                vide="Choisir un associé"
              />
              <Liste
                label="Type"
                value={brouillon.type}
                onChange={(v) =>
                  setBrouillon((b) => (estTypeOperation(v) ? { ...b, type: v } : b))
                }
                options={TYPES_OPERATION}
                vide="Choisir un type"
              />
              <Champ
                label="Montant"
                value={brouillon.montant}
                onChange={(v) => setBrouillon((b) => ({ ...b, montant: v }))}
                placeholder="0"
                inputMode="numeric"
                aide="En dinars, toujours positif. Le sens est donné par le type."
              />
              <Champ
                label="Commande liée"
                value={brouillon.commande}
                onChange={(v) => setBrouillon((b) => ({ ...b, commande: v }))}
                placeholder="MN-260912-567"
                aide="Facultatif, le numéro visible dans l'onglet Commandes."
              />
              <Bascule
                label="Preuve gardée"
                actif={brouillon.preuve}
                onChange={(v) => setBrouillon((b) => ({ ...b, preuve: v }))}
              />
              <div className="sm:col-span-2 lg:col-span-3">
                <Champ
                  label="Note"
                  value={brouillon.note}
                  onChange={(v) => setBrouillon((b) => ({ ...b, note: v }))}
                  placeholder="À quoi correspond ce mouvement"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Bouton onClick={ajouter} disabled={!peutAjouter} className="min-h-[44px]">
                Ajouter l&apos;opération
              </Bouton>
              {!peutAjouter && (
                <p className="text-[11px] text-[#9A9A94]">
                  Il faut au minimum un associé, une date et un montant supérieur à zéro.
                </p>
              )}
            </div>

            <p className="mt-4 text-[11px] leading-snug text-[#9A5B00] bg-[#FDF1DC] rounded-lg px-3 py-2.5">
              Règle de la maison : une avance qui n&apos;est pas écrite ici sous 48 heures
              n&apos;est pas due. On note au moment où l&apos;argent sort, pas en fin de mois.
            </p>
          </div>
        </Carte>

        <Carte
          titre={`Journal (${operations.length})`}
          action={
            <span className="text-[11px] text-[#6B6B6B]">
              Effet net sur la caisse{" "}
              <span
                className="font-semibold tabular-nums"
                style={{ color: effetNet > 0 ? VERT : effetNet < 0 ? ROUGE : "#111111" }}
              >
                {effetNet > 0 ? "+" : ""}
                {formatDA(effetNet)}
              </span>
            </span>
          }
        >
          {operations.length === 0 ? (
            <Vide texte="Aucune opération pour le moment. La première avance se note ici." />
          ) : (
            <>
              {/* En-têtes visibles seulement à partir de sm : en dessous, ce sont des cartes. */}
              <div className="hidden md:grid md:grid-cols-[90px_110px_minmax(0,1fr)_110px_124px_96px] gap-3 px-5 py-2 border-b border-[#E9E9E4] bg-[#FAFAF8]">
                {["Date", "Qui", "Type et note", "Commande", "Effet caisse", ""].map(
                  (t, i) => (
                    <span
                      key={t || `col-${i}`}
                      className={`text-[10px] font-semibold tracking-[0.1em] uppercase text-[#8A8A84] ${
                        i === 4 ? "text-right" : ""
                      }`}
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>

              <ul className="divide-y divide-[#E9E9E4]">
                {operations.map((o) => {
                  const effet = effetCaisse(o);
                  const enConfirmation = aSupprimer === o.id;
                  return (
                    <li
                      key={o.id}
                      className="px-4 sm:px-5 py-3 md:grid md:grid-cols-[90px_110px_minmax(0,1fr)_110px_124px_96px] md:gap-3 md:items-start"
                    >
                      {/* Téléphone : une carte en pile. À partir de md : une ligne. */}
                      <div className="flex items-center justify-between gap-3 md:block">
                        <span className="text-[12px] text-[#4A4A4A] tabular-nums">
                          {formatDate(o.date)}
                        </span>
                        <span className="md:hidden">
                          <Effet montant={effet} />
                        </span>
                      </div>

                      <p className="mt-1.5 md:mt-0 text-[12px] text-[#111111] font-medium truncate">
                        {o.qui || "—"}
                      </p>

                      <div className="mt-1.5 md:mt-0 min-w-0">
                        <p className="text-[12.5px] text-[#111111]">{o.type}</p>
                        {o.note && (
                          <p className="text-[11px] text-[#8A8A84] leading-snug mt-0.5 break-words">
                            {o.note}
                          </p>
                        )}
                        <span className="inline-block mt-1.5">
                          {o.preuve ? (
                            <Etiquette ton="ok">Preuve gardée</Etiquette>
                          ) : (
                            <Etiquette ton="risque">Sans preuve</Etiquette>
                          )}
                        </span>
                      </div>

                      {o.commande ? (
                        <p className="mt-1.5 md:mt-0 text-[11.5px] text-[#6B6B6B] tabular-nums truncate">
                          <span className="md:hidden text-[#9A9A94]">Commande </span>
                          {o.commande}
                        </p>
                      ) : (
                        <p className="hidden md:block text-[11.5px] text-[#9A9A94]">—</p>
                      )}

                      <p className="hidden md:block text-right">
                        <Effet montant={effet} />
                      </p>

                      <div className="mt-2.5 md:mt-0 md:text-right">
                        {enConfirmation ? (
                          <div className="flex md:flex-col gap-1.5 md:items-end">
                            <Bouton
                              variante="danger"
                              taille="petit"
                              onClick={() => {
                                supprimerOperation(o.id);
                                setASupprimer(null);
                              }}
                              className="flex-1 md:flex-none min-h-[40px] md:min-h-0"
                            >
                              Confirmer
                            </Bouton>
                            <Bouton
                              variante="secondaire"
                              taille="petit"
                              onClick={() => setASupprimer(null)}
                              className="flex-1 md:flex-none min-h-[40px] md:min-h-0"
                            >
                              Annuler
                            </Bouton>
                          </div>
                        ) : (
                          <Bouton
                            variante="secondaire"
                            taille="petit"
                            onClick={() => setASupprimer(o.id)}
                            className="min-h-[40px] md:min-h-0 w-full md:w-auto"
                          >
                            Supprimer
                          </Bouton>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Carte>
      </section>

      {/* ──────────────────────────── 4. Charges fixes du mois */}
      <section>
        <TitreBloc aide="Ce qui sort tous les mois, commande ou pas.">
          Charges fixes du mois
        </TitreBloc>

        <Carte>
          <div className="p-4 sm:p-5">
            <datalist id="postes-charges-caisse">
              {POSTES_CHARGES.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            {charges.length === 0 ? (
              <p className="text-[13px] text-[#9A9A94] py-6 text-center">
                Aucune charge enregistrée.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {charges.map((c) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px_auto] gap-2 sm:gap-3 sm:items-center"
                  >
                    <input
                      type="text"
                      list="postes-charges-caisse"
                      value={c.poste}
                      onChange={(e) => majCharge(c.id, { poste: e.target.value })}
                      placeholder="Poste de dépense"
                      aria-label="Poste de dépense"
                      className={CHAMP_NU}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={afficheMontant(c.montant)}
                      onChange={(e) => majCharge(c.id, { montant: nombre(e.target.value) })}
                      placeholder="0"
                      aria-label="Montant en dinars"
                      className={`${CHAMP_NU} tabular-nums sm:text-right`}
                    />
                    <Bouton
                      variante="secondaire"
                      taille="petit"
                      onClick={() => retirerCharge(c.id)}
                      className="min-h-[40px] w-full sm:w-auto"
                    >
                      Retirer
                    </Bouton>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 pt-3 border-t border-[#E9E9E4] flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-semibold text-[#111111]">
                Total des charges fixes
              </span>
              <span className="text-[16px] font-semibold text-[#111111] tabular-nums">
                {formatDA(totalCharges)}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Bouton
                variante="secondaire"
                onClick={ajouterCharge}
                className="min-h-[44px]"
              >
                Ajouter une ligne
              </Bouton>
              <p className="text-[11px] text-[#9A9A94]">
                Chaque modification est enregistrée aussitôt et se répercute sur le bénéfice
                net à partager.
              </p>
            </div>
          </div>
        </Carte>
      </section>
    </div>
  );
}
