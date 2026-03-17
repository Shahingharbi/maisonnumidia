"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartButton() {
  const { itemCount } = useCart();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/panier")}
      aria-label="Voir mon panier"
      className="relative flex items-center justify-center p-2 text-gray-700 hover:text-[#111111] transition-colors"
    >
      <ShoppingBag size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#C9A84C] text-[#111111] text-[10px] font-bold rounded-full px-1 leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
