// Stockage des abonnés : un Google Form relié à une Google Sheet.
//
// Le site n'a pas de base de données, et Shahin préfère ne pas en brancher une dans Vercel.
// Un Google Form fait l'affaire sans aucun compte à créer : le serveur du site envoie
// l'email au formulaire, Google l'ajoute comme une ligne dans la Sheet liée, avec la date.
// La liste vit dans le Google Drive de Shahin, privée, lisible depuis son téléphone.
//
// POUR BRANCHER (une fois) : créer le formulaire avec une question « Email », le relier à
// une Sheet, le publier, puis renseigner ci-dessous l'adresse d'envoi et l'identifiant du
// champ (tous deux lisibles dans le code source public du formulaire). Les variables
// d'environnement, si elles existent un jour, prennent le dessus.
//
// Publier ces valeurs dans un dépôt public ne montre aucun email : elles permettent
// seulement d'AJOUTER une ligne. La Sheet, elle, reste accessible au seul compte de Shahin.
//
// Fichier réservé au serveur.

import "server-only";

export const SOURCES = ["footer", "page", "commande", "popup"] as const;
export type Source = (typeof SOURCES)[number];

/** https://docs.google.com/forms/d/e/<identifiant>/formResponse */
const ACTION = process.env.NEWSLETTER_FORM_ACTION || "";
/** entry.<nombre> de la question « Email » */
const CHAMP_EMAIL = process.env.NEWSLETTER_FORM_EMAIL || "";
/** entry.<nombre> d'une question « Source », facultative : dit d'où vient l'inscription */
const CHAMP_SOURCE = process.env.NEWSLETTER_FORM_SOURCE || "";
/** Lien de la Google Sheet, pour le bouton du tableau de bord. Facultatif. */
export const LIEN_FEUILLE = process.env.NEWSLETTER_SHEET_URL || "";

/** Vrai quand le formulaire est branché. Sans lui, aucun champ d'inscription ne s'affiche. */
export function newsletterActive(): boolean {
  return Boolean(ACTION && CHAMP_EMAIL);
}

// Assez strict pour écarter les fautes de frappe grossières, assez souple pour ne jamais
// refuser une adresse réelle. On refuse aussi un premier caractère = + - @ : dans une
// Google Sheet, il ferait lire l'adresse comme une formule.
const FORMAT = /^[^\s@=+\-][^\s@]*@[^\s@]+\.[^\s@]{2,}$/;

export function emailValide(email: string): boolean {
  return email.length <= 254 && FORMAT.test(email);
}

export async function inscrire(email: string, source: Source): Promise<void> {
  const corps = new URLSearchParams({ [CHAMP_EMAIL]: email });
  if (CHAMP_SOURCE) corps.set(CHAMP_SOURCE, source);
  const r = await fetch(ACTION, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: corps.toString(),
    cache: "no-store",
    // Google répond 200 quand la réponse est enregistrée. Un formulaire non publié ou
    // réservé aux comptes connectés redirige vers la page de connexion : en suivant la
    // redirection, on lirait un 200 trompeur et l'email serait perdu en silence.
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  if (r.status !== 200) throw new Error(`Google Forms : HTTP ${r.status}`);
}
