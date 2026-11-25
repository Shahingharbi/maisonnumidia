// Prévenir l'équipe qu'une commande vient d'arriver : notification sur les
// téléphones abonnés, et mail récapitulatif avec la photo du parfum et les
// boutons de contact.

import { base } from "./d1";
import { reveillerAbonnes } from "./push";
import { lienTel, lienWhatsapp, messageClient, type ResumeArticle } from "./contact";

const SITE = "https://maisonnumidia.store";

export interface CommandeNotifiee {
  numero: string;
  client: string;
  telephone: string;
  wilaya: string;
  commune: string;
  adresse: string;
  modeLivraison: string;
  noteClient: string;
  articles: { slug: string; nom: string; marque: string; image: string; prix: number; qte: number }[];
  totalProduits: number;
  fraisLivraison: number;
  total: number;
}

const prix = (n: number) =>
  `${Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ")} DA`;

const echapper = (s: string) =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function urlAbsolue(chemin: string): string {
  if (!chemin) return `${SITE}/logo-192.png`;
  return chemin.startsWith("http") ? chemin : `${SITE}${chemin}`;
}

function bouton(lien: string, texte: string, fond: string, couleurTexte = "#FFFFFF"): string {
  return `<a href="${lien}" style="display:block;background:${fond};color:${couleurTexte};text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;text-align:center;padding:14px 18px;border-radius:8px;">${texte}</a>`;
}

/** Mail en tableaux et styles en ligne : c'est la seule chose que Gmail affiche correctement. */
export function mailCommande(c: CommandeNotifiee): string {
  const resume: ResumeArticle[] = c.articles.map((a) => ({
    nom: a.nom,
    marque: a.marque,
    qte: a.qte,
    prix: a.prix,
  }));
  const waClient = lienWhatsapp(
    c.telephone,
    messageClient({ numero: c.numero, client: c.client, articles: resume, total: c.total }),
  );

  const articles = c.articles
    .map(
      (a) => `
      <tr>
        <td style="padding:0 0 18px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:#FFFFFF;border:1px solid #E9E9E4;border-radius:8px;padding:14px;">
                <img src="${urlAbsolue(a.image)}" width="260" alt="${echapper(a.marque)} ${echapper(a.nom)}"
                     style="display:block;width:100%;max-width:260px;height:auto;margin:0 auto 12px auto;border-radius:6px;background:#FFFFFF;" />
                <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#8A8A84;text-transform:uppercase;letter-spacing:1px;">${echapper(a.marque)}</p>
                <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:17px;color:#111111;font-weight:bold;">${echapper(a.nom)}</p>
                <p style="margin:8px 0 0 0;font-family:Arial,sans-serif;font-size:15px;color:#111111;">
                  ${a.qte > 1 ? `<strong>${a.qte} flacons</strong> &middot; ` : ""}${prix(a.prix)}${a.qte > 1 ? ` l'unité` : ""}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");

  const ligne = (label: string, valeur: string) =>
    valeur
      ? `<tr>
          <td style="padding:7px 0;font-family:Arial,sans-serif;font-size:13px;color:#8A8A84;width:130px;vertical-align:top;">${label}</td>
          <td style="padding:7px 0;font-family:Arial,sans-serif;font-size:15px;color:#111111;">${echapper(valeur)}</td>
        </tr>`
      : "";

  return `<!doctype html>
<html lang="fr"><body style="margin:0;padding:0;background:#FAFAF8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAF8;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

      <tr><td style="background:#111111;border-radius:8px 8px 0 0;padding:18px 20px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Nouvelle commande</p>
        <p style="margin:6px 0 0 0;font-family:Arial,sans-serif;font-size:24px;color:#FFFFFF;font-weight:bold;">${echapper(c.numero)}</p>
      </td></tr>

      <tr><td style="background:#FFFFFF;border-left:1px solid #E9E9E4;border-right:1px solid #E9E9E4;padding:20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${articles}</table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E9E9E4;padding-top:6px;">
          ${ligne("Client", c.client)}
          ${ligne("Téléphone", c.telephone)}
          ${ligne("Wilaya", c.wilaya)}
          ${ligne("Commune", c.commune)}
          ${ligne("Adresse", c.adresse)}
          ${ligne("Livraison", c.modeLivraison)}
          ${ligne("Message", c.noteClient)}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;background:#F6EFDD;border-radius:8px;">
          <tr>
            <td style="padding:14px 16px;font-family:Arial,sans-serif;font-size:14px;color:#8B6914;">Parfums</td>
            <td style="padding:14px 16px;font-family:Arial,sans-serif;font-size:14px;color:#111111;text-align:right;">${prix(c.totalProduits)}</td>
          </tr>
          <tr>
            <td style="padding:0 16px 14px 16px;font-family:Arial,sans-serif;font-size:14px;color:#8B6914;">Livraison</td>
            <td style="padding:0 16px 14px 16px;font-family:Arial,sans-serif;font-size:14px;color:#111111;text-align:right;">${prix(c.fraisLivraison)}</td>
          </tr>
          <tr>
            <td style="padding:0 16px 16px 16px;font-family:Arial,sans-serif;font-size:17px;color:#111111;font-weight:bold;border-top:1px solid #E6DCC2;">À encaisser</td>
            <td style="padding:0 16px 16px 16px;font-family:Arial,sans-serif;font-size:17px;color:#111111;font-weight:bold;text-align:right;border-top:1px solid #E6DCC2;">${prix(c.total)}</td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="background:#FFFFFF;border-left:1px solid #E9E9E4;border-right:1px solid #E9E9E4;border-bottom:1px solid #E9E9E4;border-radius:0 0 8px 8px;padding:0 20px 20px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding-bottom:10px;">${bouton(waClient, "Écrire au client sur WhatsApp", "#25D366")}</td></tr>
          <tr><td style="padding-bottom:10px;">${bouton(lienTel(c.telephone), `Appeler ${echapper(c.telephone)}`, "#111111")}</td></tr>
          <tr><td>${bouton(`${SITE}/tableau-de-bord?c=${encodeURIComponent(c.numero)}`, "Ouvrir la commande", "#FFFFFF", "#111111")}</td></tr>
        </table>
        <p style="margin:16px 0 0 0;font-family:Arial,sans-serif;font-size:12px;color:#A0A09A;text-align:center;">
          La commande est déjà enregistrée dans le tableau de bord. Ce mail n'est qu'un rappel.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

/**
 * L'expéditeur doit être une adresse validée dans Brevo, sinon l'envoi est
 * refusé. Par défaut on envoie depuis l'adresse qui reçoit les commandes :
 * c'est la seule validée sur le compte, et elle le restera tant que le domaine
 * maisonnumidia.store n'y est pas authentifié.
 */
async function envoyerMail(c: CommandeNotifiee): Promise<boolean> {
  const cle = process.env.BREVO_API_KEY;
  const destinataire = process.env.MAIL_COMMANDES;
  if (!cle || !destinataire) return false;
  const expediteur = process.env.MAIL_EXPEDITEUR || destinataire.split(",")[0].trim();

  try {
    const reponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": cle,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Maison Numidia", email: expediteur },
        to: destinataire.split(",").map((e) => ({ email: e.trim() })),
        subject: `Commande ${c.numero} — ${c.client} — ${prix(c.total)}`,
        htmlContent: mailCommande(c),
      }),
    });
    return reponse.ok;
  } catch {
    return false;
  }
}

/** Renvoie si le mail est bien parti : le site n'utilise EmailJS que sinon. */
export async function notifierNouvelleCommande(
  c: CommandeNotifiee,
): Promise<{ mailEnvoye: boolean }> {
  const db = await base();
  const [mail] = await Promise.allSettled([
    envoyerMail(c),
    db ? reveillerAbonnes(db) : Promise.resolve(),
  ]);
  return { mailEnvoye: mail.status === "fulfilled" && mail.value === true };
}
