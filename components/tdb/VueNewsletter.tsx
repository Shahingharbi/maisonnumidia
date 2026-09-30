"use client";

// Onglet « Newsletter » du tableau de bord : la liste des abonnés, lue sur le serveur.
// Contrairement aux autres onglets, ces données ne viennent pas du navigateur : ce sont
// les visiteurs du site qui les ont saisies.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Carte, Tuile, Bouton, Vide, TitreBloc } from "./ui";

type Abonne = { email: string; date: string; source: "footer" | "page" | "commande" };
type Raison = "auth" | "mdp" | "config" | "serveur" | "reseau";

const LIBELLE_SOURCE: Record<Abonne["source"], string> = {
  footer: "Pied de page",
  page: "Page newsletter",
  commande: "Après commande",
};

const dateFr = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function VueNewsletter() {
  const [abonnes, setAbonnes] = useState<Abonne[] | null>(null);
  const [raison, setRaison] = useState<Raison | null>(null);
  const [recherche, setRecherche] = useState("");
  const [copie, setCopie] = useState(false);

  const charger = useCallback(async () => {
    try {
      const r = await fetch("/api/tableau-de-bord/newsletter", { cache: "no-store" });
      const d = await r.json();
      if (d.ok) { setAbonnes(d.abonnes); setRaison(null); }
      else setRaison(d.raison || "serveur");
    } catch {
      setRaison("reseau");
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return (abonnes || []).filter((a) => !q || a.email.includes(q));
  }, [abonnes, recherche]);

  const stats = useMemo(() => {
    const liste = abonnes || [];
    const il30j = Date.now() - 30 * 24 * 3600 * 1000;
    const parSource = { footer: 0, page: 0, commande: 0 } as Record<Abonne["source"], number>;
    liste.forEach((a) => { parSource[a.source] += 1; });
    return {
      total: liste.length,
      recents: liste.filter((a) => a.date && new Date(a.date).getTime() > il30j).length,
      parSource,
    };
  }, [abonnes]);

  async function retirer(email: string) {
    if (!window.confirm(`Retirer ${email} de la liste ?`)) return;
    const r = await fetch(`/api/tableau-de-bord/newsletter?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    if (r.ok) setAbonnes((l) => (l || []).filter((a) => a.email !== email));
  }

  async function copierTout() {
    try {
      await navigator.clipboard.writeText(filtres.map((a) => a.email).join("\n"));
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch { /* presse-papiers refusé : l'export CSV reste disponible */ }
  }

  // CSV lisible par Brevo, Mailchimp ou Excel. Le BOM fait afficher correctement les
  // accents quand le fichier est ouvert dans Excel.
  function exporterCsv() {
    const lignes = ["email,date,source", ...filtres.map((a) => `${a.email},${a.date.slice(0, 10)},${a.source}`)];
    const blob = new Blob(["﻿" + lignes.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `abonnes-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  }

  if (raison) return <Configuration raison={raison} />;
  if (!abonnes) return <p className="text-[13px] text-[#9A9A94] py-20 text-center">Chargement...</p>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tuile label="Abonnés" valeur={String(stats.total)} ton="or" />
        <Tuile label="30 derniers jours" valeur={String(stats.recents)} ton="vert" />
        <Tuile label="Après commande" valeur={String(stats.parSource.commande)} ton="neutre" />
        <Tuile label="Pied de page / page" valeur={String(stats.parSource.footer + stats.parSource.page)} ton="neutre" />
      </div>

      <Carte
        titre="Abonnés"
        action={
          <div className="flex gap-2">
            <Bouton variante="secondaire" taille="petit" onClick={copierTout} disabled={!filtres.length}>
              {copie ? "Copié" : "Copier les emails"}
            </Bouton>
            <Bouton variante="secondaire" taille="petit" onClick={exporterCsv} disabled={!filtres.length}>
              Exporter CSV
            </Bouton>
          </div>
        }
      >
        <div className="px-4 sm:px-5 py-3 border-b border-[#E9E9E4]">
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une adresse"
            aria-label="Rechercher une adresse"
            className="w-full sm:max-w-xs border border-[#DCDCD5] rounded-lg px-3 py-2 text-[13px] text-[#111111] bg-white focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
          />
        </div>

        {filtres.length === 0 ? (
          <Vide texte={abonnes.length ? "Aucune adresse ne correspond." : "Pas encore d'abonné. Les inscriptions apparaîtront ici."} />
        ) : (
          <ul className="divide-y divide-[#F0F0EB]">
            {filtres.map((a) => (
              <li key={a.email} className="flex items-center gap-3 px-4 sm:px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-[#111111] truncate">{a.email}</p>
                  <p className="text-[11px] text-[#9A9A94]">
                    {dateFr(a.date)} · {LIBELLE_SOURCE[a.source]}
                  </p>
                </div>
                <Bouton variante="discret" taille="petit" onClick={() => retirer(a.email)}>
                  Retirer
                </Bouton>
              </li>
            ))}
          </ul>
        )}
      </Carte>

      <p className="text-[12px] text-[#8A8A84] leading-relaxed">
        Pour envoyer une newsletter, exportez le CSV et importez-le dans un outil d&apos;emailing
        (Brevo, Mailchimp…) : il gère la désinscription en un clic, obligatoire pour tout envoi.
        Si quelqu&apos;un demande à ne plus recevoir vos emails, retirez aussi son adresse ici.
      </p>
    </div>
  );
}

function Configuration({ raison }: { raison: Raison }) {
  const contenu: Record<Raison, { titre: string; texte: React.ReactNode }> = {
    config: {
      titre: "Branchez le stockage des abonnés",
      texte: (
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Vercel → projet <strong>maisonnumidia</strong> → onglet <strong>Storage</strong>.</li>
          <li><strong>Create Database</strong> → <strong>Upstash for Redis</strong> → offre gratuite → région la plus proche (Europe).</li>
          <li>Connectez-la au projet, pour Production, Preview et Development.</li>
          <li>Redéployez le site. Les formulaires d&apos;inscription apparaissent alors d&apos;eux-mêmes.</li>
        </ol>
      ),
    },
    mdp: {
      titre: "Changez d'abord le mot de passe du tableau de bord",
      texte: (
        <>
          <p>
            Le dépôt GitHub du site est public, et le mot de passe par défaut de ce tableau de bord y
            est écrit en clair. Tant qu&apos;il est actif, n&apos;importe qui pourrait lire la liste de vos
            abonnés : elle ne s&apos;affiche donc pas.
          </p>
          <p className="mt-2">
            Vercel → Settings → Environment Variables → ajoutez <strong>TDB_PASS</strong> (un nouveau
            mot de passe) et, idéalement, <strong>TDB_USER</strong>, puis redéployez et reconnectez-vous.
          </p>
        </>
      ),
    },
    auth: { titre: "Session expirée", texte: <p>Déconnectez-vous puis reconnectez-vous.</p> },
    serveur: { titre: "Liste momentanément indisponible", texte: <p>Le stockage n&apos;a pas répondu. Réessayez dans un instant.</p> },
    reseau: { titre: "Connexion impossible", texte: <p>Vérifiez votre connexion internet et rechargez la page.</p> },
  };
  const { titre, texte } = contenu[raison];
  return (
    <div className="max-w-xl">
      <TitreBloc>{titre}</TitreBloc>
      <div className="bg-white border border-[#E9E9E4] rounded-lg px-5 py-4 text-[13px] text-[#4A4A4A] leading-relaxed">
        {texte}
      </div>
    </div>
  );
}
