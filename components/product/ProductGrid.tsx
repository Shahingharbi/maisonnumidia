import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        Aucun produit disponible pour le moment.
      </div>
    );
  }

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-2 text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
