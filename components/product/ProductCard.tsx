import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, getDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <Link
      href={`/parfums/${product.slug}`}
      className="group flex flex-col bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[#f5f0eb] overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name} ${product.volume}`}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <span className="text-xs font-medium uppercase tracking-wider text-white bg-[#535359]/90 backdrop-blur-sm px-5 py-2.5 transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
            Voir le parfum
          </span>
        </div>

        {/* Badge top-left */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 ${
              product.badge === "Promo"
                ? "bg-[#C45C5C] text-white"
                : product.badge === "Nouveau"
                ? "bg-[#535359] text-white"
                : "bg-[#AC9270] text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount top-right */}
        {discount && (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-1 bg-[#C45C5C] text-white">
            -{discount}%
          </span>
        )}

        {/* Concentration tag bottom-left */}
        <span className="absolute bottom-3 left-3 text-[9px] font-medium uppercase tracking-wider text-[#AC9270] bg-white/80 backdrop-blur-sm px-2 py-1">
          {product.concentration} · {product.volume}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#AC9270]">
          {product.brand}
        </span>
        <h3 className="text-sm text-[#535359] line-clamp-2 leading-snug" style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif" }}>
          {product.name}
        </h3>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-[#535359]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#C4C4C4] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium text-[#AC9270] tracking-wider uppercase border border-[#AC9270]/30 px-1.5 py-0.5">
            COD
          </span>
        </div>
      </div>
    </Link>
  );
}
