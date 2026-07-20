import { create } from "zustand";

type WishlistState = {
  productIds: string[];
  toggleProduct: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()((set) => ({
  productIds: [],
  toggleProduct: (productId) =>
    set((state) => ({
      productIds: state.productIds.includes(productId)
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId],
    })),
}));

export function useWishlistCount(): number {
  return useWishlistStore((state) => state.productIds.length);
}

export function useIsInWishlist(productId: string): boolean {
  return useWishlistStore((state) => state.productIds.includes(productId));
}

export function useToggleWishlist(): WishlistState["toggleProduct"] {
  return useWishlistStore((state) => state.toggleProduct);
}
