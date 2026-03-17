"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";

export default function PanierPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={28} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-3">
            Votre panier est vide
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            Parcourez notre collection et ajoutez vos parfums préférés.
          </p>
          <Link
            href="/parfums-homme"
            className="inline-block bg-[#111111] hover:bg-[#333333] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Découvrir les parfums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase">
            Mon Panier
          </span>
          <h1 className="text-3xl font-bold text-[#111111] mt-2">
            {items.length === 1 ? "1 article" : `${items.length} articles`}
          </h1>
        </div>

        {/* Items list */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4"
            >
              {/* Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#C9A84C] font-medium tracking-wide uppercase mb-0.5">
                  {item.brand}
                </p>
                <p className="text-sm font-semibold text-[#111111] leading-snug truncate">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-[#111111] mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Quantity + remove */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                {/* Quantity selector */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label="Diminuer la quantité"
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold text-[#111111]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Augmenter la quantité"
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Supprimer l'article"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Sous-total</span>
            <span className="font-medium text-[#111111]">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Livraison</span>
            <span className="text-green-600 font-medium">Calculée à la confirmation</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="font-bold text-[#111111] text-base">Total estimé</span>
            <span className="font-bold text-[#111111] text-xl">{formatPrice(subtotal)}</span>
          </div>

          <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
            Paiement cash à la livraison — aucune carte requise. Livraison via Yalidine dans toutes les wilayas.
          </div>

          <Link
            href="/commander"
            className="block w-full bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0F0F0F] font-bold text-center py-4 rounded-xl transition-colors text-base"
          >
            Commander — {formatPrice(subtotal)}
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/parfums-homme"
            className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
          >
            ← Continuer mes achats
          </Link>
        </div>

      </div>
    </div>
  );
}
