import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbSchema } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Émettre le JSON-LD BreadcrumbList. À passer à false sur une page qui publie déjà
   * son propre BreadcrumbList (la fiche produit) : deux listes sur la même page,
   * c'est du balisage contradictoire pour Google.
   */
  schema?: boolean;
}

export default function Breadcrumb({ items, schema = true }: BreadcrumbProps) {
  // Le dernier maillon est rendu sans lien, mais un ListItem sans URL réelle pointait
  // jusqu'ici vers l'accueil : on ne garde dans le balisage que les maillons dont on
  // connaît vraiment l'URL, précédés de l'accueil.
  const schemaItems = [
    { name: "Accueil", url: "/" },
    ...items.filter((item) => item.href).map((item) => ({ name: item.label, url: item.href as string })),
  ];

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema(schemaItems)),
          }}
        />
      )}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-[#C9A84C] transition-colors">
          Accueil
        </Link>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-gray-300" />
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-[#C9A84C] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
