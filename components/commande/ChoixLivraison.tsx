"use client";

// Choix domicile / bureau Yalidine avec le vrai prix, partagé par la case « Commander
// directement » des fiches et par /commander. Le parent garde la wilaya, le mode, la commune
// (domicile) et le bureau ; ce composant affiche les bons champs selon le mode.
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";
import { communesDe, tarifWilaya, type ModeLivraison } from "@/lib/livraison";

interface Props {
  wilaya: string;
  mode: ModeLivraison | "";
  onMode: (m: ModeLivraison) => void;
  commune: string;
  onCommune: (c: string) => void;
  bureau: string;
  onBureau: (b: string) => void;
  /** Classe des champs du formulaire parent, pour garder son style. */
  classeChamp: string;
}

export default function ChoixLivraison({ wilaya, mode, onMode, commune, onCommune, bureau, onBureau, classeChamp }: Props) {
  // Communes livrables de la wilaya choisie, chargées à la demande. null = en cours de chargement.
  const [communes, setCommunes] = useState<{ wilaya: string; liste: string[] } | null>(null);
  useEffect(() => {
    if (!wilaya || !tarifWilaya(wilaya)) return;
    let actif = true;
    communesDe(wilaya)
      .then((liste) => actif && setCommunes({ wilaya, liste }))
      .catch(() => actif && setCommunes({ wilaya, liste: [] })); // échec : champ texte libre
    return () => {
      actif = false;
    };
  }, [wilaya]);
  const liste = communes?.wilaya === wilaya ? communes.liste : null;

  if (!wilaya) return null;
  const t = tarifWilaya(wilaya);

  const champCommuneLibre = (
    <input className={classeChamp} required placeholder="Commune"
      value={commune} onChange={(e) => onCommune(e.target.value)} />
  );

  if (!t) {
    return (
      <div className="col-span-full space-y-2.5">
        <p className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
          Yalidine ne dessert pas encore cette wilaya : envoyez votre commande, nous vous appelons pour
          organiser l&apos;envoi.
        </p>
        {champCommuneLibre}
      </div>
    );
  }

  const option = (m: ModeLivraison, titre: string, prix: number | null, detail: string) => {
    const dispo = prix != null;
    const actif = mode === m;
    return (
      <label
        className={`flex flex-col rounded-lg border px-3 py-2.5 text-sm transition-colors ${
          !dispo
            ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
            : actif
              ? "border-[#C9A84C] bg-white ring-1 ring-[#C9A84C] cursor-pointer"
              : "border-gray-200 bg-white hover:border-[#C9A84C] cursor-pointer"
        }`}
      >
        <input
          type="radio"
          name="mode-livraison"
          value={m}
          required
          disabled={!dispo}
          checked={actif}
          onChange={() => onMode(m)}
          className="sr-only"
        />
        <span className="font-medium text-[#111111]">{titre}</span>
        <span className={dispo ? "font-semibold text-[#8B6914]" : ""}>{dispo ? formatPrice(prix) : detail}</span>
      </label>
    );
  };

  return (
    <div className="col-span-full space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Mode de livraison">
        {option("domicile", "À domicile", t.domicile, "Indisponible")}
        {option("bureau", "Au bureau Yalidine", t.bureau, "Pas de bureau")}
      </div>
      {t.wilayaMere && (
        <p className="text-xs text-gray-500">
          Tarif Yalidine de la wilaya de {t.wilayaMere}, dont {wilaya} dépend encore pour la livraison.
        </p>
      )}

      {mode === "domicile" &&
        (liste === null ? (
          <select className={classeChamp} disabled>
            <option>Chargement des communes…</option>
          </select>
        ) : liste.length === 0 ? (
          champCommuneLibre
        ) : (
          <select className={classeChamp} required value={commune} onChange={(e) => onCommune(e.target.value)}>
            <option value="" disabled>
              Choisissez votre commune
            </option>
            {liste.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ))}

      {mode === "bureau" && t.bureau != null && (
        <select className={classeChamp} required value={bureau} onChange={(e) => onBureau(e.target.value)}>
          <option value="" disabled>
            Choisissez votre bureau Yalidine
          </option>
          {t.bureaux.map((b) => {
            const libelle = b.nom.includes(b.commune) ? b.nom : `${b.nom} · ${b.commune}`;
            return (
              <option key={libelle} value={libelle}>
                {libelle}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}
