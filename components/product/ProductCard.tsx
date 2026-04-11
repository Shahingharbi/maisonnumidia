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
      className="group flex flex-col bg-white overflow-hidden hover:shadow-sm transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name} ${product.volume}`}
          fill
          className="object-contain p-6 group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

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
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1 flex-1 border-t border-[#f0f0f0]">
        <span className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#AC9270]">
          {product.brand}
        </span>
        <h3 className="text-sm text-[#535359] line-clamp-2 leading-snug" style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif" }}>
          {product.name}
        </h3>
        <p className="text-xs text-[#8A8A90] mt-0.5">{product.family}</p>

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
          <span className="text-[10px] font-medium text-[#AC9270] tracking-wider uppercase">
            COD
          </span>
        </div>
      </div>
    </Link>
  );
}
