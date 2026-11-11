// Tarifs de livraison Yalidine (départ Blida, express), tirés de l'API par
// scripts/yalidine/tarifs.mjs. Ce fichier ne contient aucune clé : seulement les prix publics.
import donnees from "@/data/livraison-formulaire.json";
import { WILAYAS } from "@/lib/tdb/constantes";

export type ModeLivraison = "domicile" | "bureau";

export interface TarifWilaya {
  domicile: number | null;
  bureau: number | null;
  bureaux: { nom: string; commune: string }[];
  /** Pour une wilaya de 2026 que Yalidine ne connaît pas encore : la wilaya dont elle est issue. */
  wilayaMere?: string;
}

/**
 * Les 11 wilayas créées par la loi 26-06 n'existent pas encore chez Yalidine, qui livre leurs
 * communes sous l'ancienne wilaya. On applique donc le tarif (et les bureaux) de celle-ci.
 */
const WILAYA_MERE: Record<string, number> = {
  "Aflou": 3, // Laghouat
  "Aïn Oussara": 17, // Djelfa
  "Barika": 5, // Batna
  "Bir El Ater": 12, // Tébessa
  "Bou Saâda": 28, // M'Sila
  "El Abiodh Sidi Cheikh": 32, // El Bayadh
  "El Aricha": 13, // Tlemcen
  "El Kantara": 7, // Biskra
  "Ksar Chellala": 14, // Tiaret
  "Ksar El Boukhari": 26, // Médéa
  "Messaad": 17, // Djelfa
};

type Brut = [number | null, number | null, [string, string][]];
const parId = donnees.w as unknown as Record<string, Brut>;

/** Numéro Yalidine d'une wilaya de la liste du site (les 58 premières suivent la numérotation officielle). */
function idYalidine(wilaya: string): number | null {
  if (WILAYA_MERE[wilaya]) return WILAYA_MERE[wilaya];
  const i = WILAYAS.indexOf(wilaya);
  return i >= 0 && i < 58 ? i + 1 : null;
}

/** Les 69 wilayas par ordre alphabétique, pour les listes déroulantes (on s'y perdait par numéro). */
export const WILAYAS_ALPHA = [...WILAYAS].sort((a, b) => a.localeCompare(b, "fr"));

/** "Alger (16)" ; les wilayas de 2026, sans numéro officiel stable, restent sans numéro. */
export function libelleWilaya(wilaya: string): string {
  const i = WILAYAS.indexOf(wilaya);
  return i >= 0 && i < 58 ? `${wilaya} (${String(i + 1).padStart(2, "0")})` : wilaya;
}

/**
 * Communes où Yalidine livre à domicile. Le fichier (20 Ko) part dans un morceau JS à part,
 * chargé seulement quand un client choisit sa wilaya : pas de poids en plus sur chaque fiche.
 * Pour une wilaya de 2026, ce sont les communes de sa wilaya d'origine chez Yalidine.
 */
let communesEnCache: Promise<Record<string, string[]>> | null = null;
export function communesDe(wilaya: string): Promise<string[]> {
  const id = idYalidine(wilaya);
  if (!id) return Promise.resolve([]);
  communesEnCache ??= import("@/data/livraison-communes.json")
    .then((m) => m.default as unknown as Record<string, string[]>)
    .catch((err) => {
      communesEnCache = null; // réseau coupé : on retentera au prochain choix de wilaya
      throw err;
    });
  return communesEnCache.then((c) => c[String(id)] ?? []);
}

/** null = wilaya inconnue ou que Yalidine ne livre pas (Bordj Badji Mokhtar, In Guezzam). */
export function tarifWilaya(wilaya: string): TarifWilaya | null {
  const id = idYalidine(wilaya);
  const brut = id ? parId[String(id)] : undefined;
  if (!id || !brut) return null;
  const [domicile, bureau, bureaux] = brut;
  return {
    domicile,
    bureau: bureaux.length ? bureau : null,
    bureaux: bureaux.map(([nom, commune]) => ({ nom, commune })),
    wilayaMere: WILAYA_MERE[wilaya] ? WILAYAS[id - 1] : undefined,
  };
}

export function fraisLivraison(wilaya: string, mode: ModeLivraison | ""): number | null {
  const t = tarifWilaya(wilaya);
  if (!t || !mode) return null;
  return mode === "domicile" ? t.domicile : t.bureau;
}

export const LIVRAISON_MAJ = donnees.maj;

/** Prix le plus bas (bureau) et le plus haut (domicile) parmi les wilayas desservies. */
export function fourchetteLivraison(): { min: number; max: number } {
  const tous = Object.values(parId).flatMap(([dom, bur]) => [dom, bur]).filter((x): x is number => x != null);
  return { min: Math.min(...tous), max: Math.max(...tous) };
}
