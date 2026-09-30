// Abonnés à la newsletter : directement dans une liste Brevo.
//
// Brevo est l'outil d'envoi de Shahin (il l'utilise déjà pour son autre boutique) : les
// newsletters partiront de là, avec le lien de désinscription obligatoire. Inscrire les
// abonnés directement dans la liste évite tout export, et Brevo met à jour un contact
// existant au lieu de créer un doublon.
//
// LA CLÉ D'API DONNE UN ACCÈS COMPLET AU COMPTE BREVO : envoi d'emails, lecture de tous
// les contacts, y compris ceux de l'autre boutique. Elle ne doit JAMAIS être écrite dans
// ce dépôt, qui est public. Elle vit dans Vercel → Settings → Environment Variables :
//   BREVO_API_KEY   la clé (xkeysib-…)
//   BREVO_LIST_ID   le numéro de la liste Maison Numidia dans Brevo
// Sans ces deux valeurs, aucun champ d'inscription ne s'affiche sur le site.
//
// Fichier réservé au serveur : la clé ne doit jamais partir dans le JavaScript du navigateur.

import "server-only";

const API = process.env.BREVO_API_URL || "https://api.brevo.com/v3"; // surchargé seulement pour les tests locaux
const CLE = process.env.BREVO_API_KEY || "";
const LISTE = Number(process.env.BREVO_LIST_ID || "");

/** Vrai quand Brevo est branché. */
export function newsletterActive(): boolean {
  return Boolean(CLE) && Number.isInteger(LISTE) && LISTE > 0;
}

/** Numéro de la liste Brevo, pour l'onglet du tableau de bord. */
export function numeroListe(): number | null {
  return newsletterActive() ? LISTE : null;
}

// Assez strict pour écarter les fautes de frappe grossières, assez souple pour ne jamais
// refuser une adresse réelle.
const FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailValide(email: string): boolean {
  return email.length <= 254 && FORMAT.test(email);
}

/**
 * Ajoute l'email à la liste. `updateEnabled` : un contact déjà connu de Brevo (inscrit à la
 * boutique cosmétique, par exemple) est rattaché à cette liste au lieu de provoquer une erreur.
 * Brevo répond 201 (contact créé) ou 204 (contact existant mis à jour).
 */
export async function inscrire(email: string): Promise<void> {
  const r = await fetch(`${API}/contacts`, {
    method: "POST",
    headers: { "api-key": CLE, accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ email, listIds: [LISTE], updateEnabled: true }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (r.status !== 201 && r.status !== 204) {
    // Le message de Brevo aide au diagnostic dans les logs Vercel ; il ne contient pas la clé.
    const detail = await r.text().catch(() => "");
    throw new Error(`Brevo : HTTP ${r.status} ${detail.slice(0, 200)}`);
  }
}
