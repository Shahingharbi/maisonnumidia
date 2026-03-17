"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
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
  | { type: "CLEAR_CART" };

interface CartContextValue {
  items: CartItem[];
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
    return JSON.parse(raw) as CartState;
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

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

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
