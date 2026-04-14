"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 20" width="18" height="20">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="1" y="6" width="16" height="13" rx="1" />
        <path d="M5 6V4a4 4 0 018 0v2" />
      </g>
    </svg>
  );
}

export default function CartButton() {
  const { itemCount } = useCart();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/panier")}
      aria-label="Voir mon panier"
      className="relative flex items-center justify-center p-2 text-[#535359] hover:opacity-70 transition-opacity"
    >
      <CartIcon className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-[#AC9270] text-white text-[9px] font-medium rounded-full px-1 leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
