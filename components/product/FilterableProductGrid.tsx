"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { ChevronDown } from "lucide-react";

interface FilterableProductGridProps {
  products: Product[];
  pageSize?: number;
}

export default function FilterableProductGrid({
  products,
  pageSize = 16,
}: FilterableProductGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Extract unique brands sorted by count
  const brands = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    products.forEach((p) => {
      if (!counts[p.brandSlug]) {
        counts[p.brandSlug] = { name: p.brand, count: 0 };
      }
      counts[p.brandSlug].count++;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([slug, { name, count }]) => ({ slug, name, count }));
  }, [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brandSlug === selectedBrand);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedBrand, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setVisibleCount(pageSize);
  };

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Brand filter */}
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="appearance-none bg-white border border-[#e5e5e5] text-[#535359] text-xs font-medium uppercase tracking-wider pl-4 pr-9 py-2.5 cursor-pointer hover:border-[#AC9270] transition-colors focus:outline-none focus:border-[#AC9270]"
          >
            <option value="all">Toutes les marques</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} ({b.count})
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A90] pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-[#e5e5e5] text-[#535359] text-xs font-medium uppercase tracking-wider pl-4 pr-9 py-2.5 cursor-pointer hover:border-[#AC9270] transition-colors focus:outline-none focus:border-[#AC9270]"
          >
            <option value="default">Tri par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A90] pointer-events-none" />
        </div>

        {/* Count */}
        <span className="text-xs text-[#8A8A90] ml-auto">
          {filtered.length} parfum{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Visible products grid */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-[#8A8A90]">
          Aucun produit trouvé avec ces filtres.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            className="inline-flex items-center gap-2 border border-[#535359] text-[#535359] hover:bg-[#535359] hover:text-white text-xs font-medium uppercase tracking-wider px-8 py-3 transition-colors duration-300 cursor-pointer"
          >
            Voir plus de parfums
            <span className="text-[#8A8A90] text-[10px] normal-case">
              ({filtered.length - visibleCount} restants)
            </span>
          </button>
        </div>
      )}

      {/*
        SEO: Hidden links for ALL products so Google can crawl every product page.
        These are visually hidden but present in the HTML for crawlers.
      */}
      <nav aria-label="Tous les parfums" className="sr-only">
        {products.map((p) => (
          <a key={p.id} href={`/parfums/${p.slug}`}>
            {p.brand} {p.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
