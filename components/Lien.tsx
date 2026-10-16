// `next/link` SANS préchargement par défaut. Tout le site importe ce composant à la place
// de `next/link` (même nom, même usage : `import Link from "@/components/Lien"`).
//
// Pourquoi : par défaut, Next.js précharge en arrière-plan chaque lien qui apparaît à
// l'écran — une requête par lien, servie depuis le cache ISR. Une page catégorie porte
// ~190 liens, une fiche produit ~63, le plan du site ~2 200. Et Googlebot affiche les pages
// sur toute leur hauteur : chaque passage du robot préchargeait donc TOUS les liens de la
// page. Sur 30 jours, le compte Vercel a compté 2,9 millions de requêtes CDN et 3,5 millions
// de lectures ISR pour ~1 000 visites Google par semaine — trois fois la limite de l'offre
// gratuite. Le 16/10/2026, Vercel a mis en pause tous les sites du compte.
//
// Sans préchargement, un clic charge la page à ce moment-là : quelques centaines de
// millisecondes de plus, le temps d'un aller-retour réseau. Un lien précis peut toujours
// réactiver le préchargement avec `prefetch` (ex. le bouton « Commander »), mais à
// l'unité, jamais sur une liste.
import NextLink from "next/link";
import type { ComponentProps } from "react";

export default function Lien({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
