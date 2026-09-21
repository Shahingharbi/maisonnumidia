"use client";

import { usePathname } from "next/navigation";

/**
 * Masque l'habillage boutique (header, footer, rail social) sur l'espace
 * interne /tableau-de-bord, qui a sa propre barre de navigation.
 */
export default function ChromeBoutique({ children }: { children: React.ReactNode }) {
  const chemin = usePathname();
  if (chemin?.startsWith("/tableau-de-bord")) return null;
  return <>{children}</>;
}
