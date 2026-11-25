import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Espace interne Maison Numidia.",
  // Permet d'ajouter l'espace interne à l'écran d'accueil du téléphone,
  // et donc de recevoir les notifications de commande sans installer d'appli.
  manifest: "/tdb.webmanifest",
  appleWebApp: { capable: true, title: "Commandes", statusBarStyle: "black-translucent" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  alternates: {},
};

export default function LayoutTableauDeBord({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#FAFAF8]">{children}</div>;
}
