import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbSchema } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: item.href || "/",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema(schemaItems)),
        }}
      />
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
