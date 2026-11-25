// Liens de contact : appeler et écrire au client sans jamais retaper un numéro.
// Partagé entre le tableau de bord et le mail de commande.

/** 0661234567 → 213661234567 (format attendu par wa.me). */
export function numeroInternational(tel: string): string {
  const chiffres = (tel || "").replace(/\D/g, "");
  if (!chiffres) return "";
  if (chiffres.startsWith("213")) return chiffres;
  if (chiffres.startsWith("00213")) return chiffres.slice(2);
  if (chiffres.startsWith("0")) return `213${chiffres.slice(1)}`;
  return `213${chiffres}`;
}

export function lienTel(tel: string): string {
  const chiffres = (tel || "").replace(/[^\d+]/g, "");
  return `tel:${chiffres}`;
}

export function lienWhatsapp(tel: string, message: string): string {
  const num = numeroInternational(tel);
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export interface ResumeArticle {
  nom: string;
  marque: string;
  qte: number;
  prix: number;
}

function prix(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ")} DA`;
}

function listeArticles(articles: ResumeArticle[]): string {
  return articles
    .map((a) => `${a.marque} ${a.nom}${a.qte > 1 ? ` x${a.qte}` : ""}`)
    .join(", ");
}

/** Message de confirmation prêt à envoyer au client. */
export function messageClient(c: {
  numero: string;
  client: string;
  articles: ResumeArticle[];
  total: number;
}): string {
  const prenom = (c.client || "").split(" ")[0] || "";
  return (
    `Bonjour ${prenom}, c'est Maison Numidia.\n\n` +
    `On a bien reçu votre commande ${c.numero} :\n` +
    `${listeArticles(c.articles)}\n` +
    `Total à payer à la livraison : ${prix(c.total)}\n\n` +
    `On vous confirme l'adresse de livraison et on vous envoie le colis. ` +
    `Vous pouvez me répondre ici si besoin.`
  );
}

/** Message prêt à envoyer au fournisseur, sans prix de vente. */
export function messageFournisseur(c: {
  numero: string;
  articles: ResumeArticle[];
}): string {
  const lignes = c.articles
    .map((a) => `- ${a.marque} ${a.nom}${a.qte > 1 ? ` x${a.qte}` : ""}`)
    .join("\n");
  return `Salam, commande ${c.numero} :\n${lignes}\n\nDisponible ? Et à quel prix ?`;
}
