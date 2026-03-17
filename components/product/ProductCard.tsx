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
      className="group flex flex-col bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200"
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

        {/* Badges top-left */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
              product.badge === "Promo"
                ? "bg-red-500 text-white"
                : product.badge === "Nouveau"
                ? "bg-[#111111] text-white"
                : "bg-[#C9A84C] text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount top-right */}
        {discount && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C]">
          {product.brand}
        </span>
        <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{product.family}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#111111]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-300 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-[#C9A84C] tracking-wide">
            COD
          </span>
        </div>
      </div>
    </Link>
  );
}
