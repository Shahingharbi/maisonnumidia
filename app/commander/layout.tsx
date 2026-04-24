import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commander — Finaliser votre commande",
  description:
    "Finalisez votre commande de parfums originaux. Livraison Yalidine 58 wilayas, paiement à la réception en cash.",
  robots: { index: false, follow: false },
};

export default function CommanderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
