"use client";

// Onglet « Newsletter » du tableau de bord. Les abonnés ne sont pas ici : ils arrivent dans
// la Google Sheet de Shahin (voir lib/newsletter.ts). L'onglet dit où les trouver et, tant
// que rien n'est branché, comment brancher.

import { useEffect, useState } from "react";
import { TitreBloc } from "./ui";

type Etat = { actif: boolean; lienFeuille: string | null } | null;

export default function VueNewsletter() {
  const [etat, setEtat] = useState<Etat>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    fetch("/api/newsletter", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEtat({ actif: Boolean(d.actif), lienFeuille: d.lienFeuille ?? null }))
      .catch(() => setErreur(true));
  }, []);

  if (erreur) return <p className="text-[13px] text-[#9A9A94] py-20 text-center">Connexion impossible. Rechargez la page.</p>;
  if (!etat) return <p className="text-[13px] text-[#9A9A94] py-20 text-center">Chargement...</p>;

  const carte = "bg-white border border-[#E9E9E4] rounded-lg px-5 py-4 text-[13px] text-[#4A4A4A] leading-relaxed";

  if (!etat.actif) {
    return (
      <div className="max-w-xl">
        <TitreBloc aide="Cinq minutes, une seule fois. Aucun réglage dans Vercel.">
          Relier la newsletter à une Google Sheet
        </TitreBloc>
        <div className={carte}>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ouvrez <strong>forms.new</strong> (connecté à votre compte Google).</li>
            <li>Titre : « Newsletter Maison Numidia ». Une seule question : <strong>Réponse courte</strong>, intitulée <strong>Email</strong>.</li>
            <li>Onglet <strong>Réponses</strong> → <strong>Associer à Sheets</strong> → Créer une feuille de calcul.</li>
            <li>Bouton <strong>Publier</strong> en haut à droite.</li>
            <li>Bouton <strong>Envoyer</strong> → icône lien → copiez le lien. Transmettez-le avec celui de la Sheet : ce sont les deux adresses à brancher dans le site.</li>
          </ol>
          <p className="mt-3 text-[12px] text-[#8A8A84]">
            Les formulaires d&apos;inscription du site apparaissent dès que le lien est branché.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <TitreBloc aide="Chaque inscription du site ajoute une ligne, avec sa date.">
        Vos abonnés sont dans Google Sheets
      </TitreBloc>
      <div className={carte}>
        {etat.lienFeuille ? (
          <a
            href={etat.lienFeuille}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#111111] hover:bg-[#2C2C2C] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Ouvrir la liste des abonnés
          </a>
        ) : (
          <p>Ouvrez la feuille « Newsletter Maison Numidia » depuis votre Google Drive.</p>
        )}
        <ul className="mt-4 space-y-1.5 list-disc pl-5">
          <li>Pour envoyer une newsletter : dans la Sheet, <strong>Fichier → Télécharger → CSV</strong>, puis importez-le dans Brevo ou Mailchimp. Ils ajoutent le lien de désinscription, obligatoire, et suppriment les doublons.</li>
          <li>Quelqu&apos;un demande à ne plus recevoir vos emails : supprimez sa ligne dans la Sheet.</li>
        </ul>
      </div>
    </div>
  );
}
