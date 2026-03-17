import Link from "next/link";

interface Brand {
  label: string;
  href: string;
}

interface BrandPillsProps {
  brands: Brand[];
  title?: string;
}

export default function BrandPills({ brands, title = "Filtrer par marque" }: BrandPillsProps) {
  return (
    <div className="border-b border-gray-100 bg-[#FAFAF8] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium mr-1 shrink-0">{title} :</span>
          {brands.map((brand) => (
            <Link
              key={brand.href}
              href={brand.href}
              className="inline-block text-xs font-semibold text-[#111111] border border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C] px-4 py-2 transition-colors bg-white"
            >
              {brand.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
