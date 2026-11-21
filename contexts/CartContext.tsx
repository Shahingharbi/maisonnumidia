"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "CHARGER"; payload: CartState };

interface CartContextValue {
  items: CartItem[];
  /** false tant que le panier enregistré dans le navigateur n'a pas été relu (premier affichage). */
  pret: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "maison-numidia-cart";

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const lu = JSON.parse(raw) as CartState;
    return Array.isArray(lu?.items) ? lu : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    case "CHARGER":
      return action.payload;

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Le panier vit dans le localStorage, que le serveur ne voit pas. Lu dès le premier rendu, il
  // donnait au navigateur un HTML différent de celui du serveur (la pastille du compteur) et
  // React signalait une erreur d'hydratation sur toutes les pages dès que le panier n'était pas
  // vide. On part donc d'un panier vide, comme le HTML servi, et on relit le vrai juste après.
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [pret, setPret] = useState(false);

  useEffect(() => {
    dispatch({ type: "CHARGER", payload: loadFromStorage() });
    setPret(true);
  }, []);

  // Jamais d'écriture avant la relecture : le panier vide de départ effacerait le vrai.
  useEffect(() => {
    if (pret) saveToStorage(state);
  }, [state, pret]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const addItem = (item: CartItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });

  const removeItem = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id } });

  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        pret,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
