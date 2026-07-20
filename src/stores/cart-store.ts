import { create } from "zustand";

type CartState = {
  productIds: string[];
  toggleProduct: (productId: string) => void;
};

export const useCartStore = create<CartState>()((set) => ({
  productIds: [],
  toggleProduct: (productId) =>
    set((state) => ({
      productIds: state.productIds.includes(productId)
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId],
    })),
}));

export function useCartCount(): number {
  return useCartStore((state) => state.productIds.length);
}

export function useIsInCart(productId: string): boolean {
  return useCartStore((state) => state.productIds.includes(productId));
}

export function useToggleCart(): CartState["toggleProduct"] {
  return useCartStore((state) => state.toggleProduct);
}
