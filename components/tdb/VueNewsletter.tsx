"use client";

// Onglet « Newsletter » du tableau de bord. Les abonnés ne sont pas ici : ils arrivent dans
// une liste Brevo (voir lib/newsletter.ts). L'onglet dit où les trouver et, tant que rien
// n'est branché, comment brancher.

import { useEffect, useState } from "react";
import { TitreBloc } from "./ui";

type Etat = { actif: boolean; liste: number | null } | null;

export default function VueNewsletter() {
  const [etat, setEtat] = useState<Etat>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    fetch("/api/newsletter", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEtat({ actif: Boolean(d.actif), liste: d.liste ?? null }))
      .catch(() => setErreur(true));
  }, []);

  if (erreur) return <p className="text-[13px] text-[#9A9A94] py-20 text-center">Connexion impossible. Rechargez la page.</p>;
  if (!etat) return <p className="text-[13px] text-[#9A9A94] py-20 text-center">Chargement...</p>;

  const carte = "bg-white border border-[#E9E9E4] rounded-lg px-5 py-4 text-[13px] text-[#4A4A4A] leading-relaxed";

  if (!etat.actif) {
    return (
      <div className="max-w-xl">
        <TitreBloc aide="Deux minutes, une seule fois.">Relier la newsletter à Brevo</TitreBloc>
        <div className={carte}>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Dans Brevo : <strong>Contacts → Listes → Créer une liste</strong>, nommée « Maison Numidia ».
              Notez son <strong>numéro</strong> (colonne ID).
            </li>
            <li>
              Dans Vercel : projet maisonnumidia → <strong>Settings → Environment Variables</strong>, ajoutez
              <strong> BREVO_API_KEY</strong> (votre clé Brevo) et <strong>BREVO_LIST_ID</strong> (le numéro de la liste).
            </li>
            <li>Onglet <strong>Deployments</strong> → sur le dernier : <strong>⋯ → Redeploy</strong>.</li>
          </ol>
          <p className="mt-3 text-[12px] text-[#8A8A84]">
            La clé ne doit jamais être écrite dans le code du site : le dépôt GitHub est public, et elle
            donne un accès complet au compte Brevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <TitreBloc aide="Chaque inscription du site ajoute le contact à votre liste Brevo.">
        Vos abonnés sont dans Brevo
      </TitreBloc>
      <div className={carte}>
        <a
          href="https://app.brevo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#111111] hover:bg-[#2C2C2C] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Ouvrir Brevo
        </a>
        <p className="mt-3">
          Puis <strong>Contacts → Listes</strong> → la liste n°<strong>{etat.liste}</strong>.
        </p>
        <ul className="mt-4 space-y-1.5 list-disc pl-5">
          <li>Pour envoyer une newsletter : <strong>Campagnes → Créer une campagne</strong>, destinataires : cette liste. Brevo ajoute lui-même le lien de désinscription.</li>
          <li>Quelqu&apos;un se désinscrit : Brevo le retire des envois automatiquement.</li>
        </ul>
      </div>
    </div>
  );
}
