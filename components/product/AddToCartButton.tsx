"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.inStock}
      className="w-full bg-[#111111] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors text-base"
    >
      {!product.inStock
        ? "Rupture de stock"
        : added
        ? "✓ Ajouté !"
        : "Ajouter au panier"}
    </button>
  );
}
