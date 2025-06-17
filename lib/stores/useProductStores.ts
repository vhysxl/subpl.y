import { ProductStore } from "@/type";
import { create } from "zustand";
import { fetchAdminProducts, fetchProducts } from "../fetcher/productFetch";
import { groupProductsByGame } from "../common/productsGrouping";

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  adminProducts: [],
  loading: false,
  error: null,
  hasFetchedAdminProducts: false,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fetchProducts();

      if (!data) {
        set({ error: "Failed to fetch products" });
        return;
      }

      const cleanedData = groupProductsByGame(data);

      set({ products: cleanedData, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.error(error);
    }
  },

  fetchAdminProducts: async (force = false) => {
    set((state) => {
      if (state.hasFetchedAdminProducts && !force) return {};
      return { loading: true, error: null };
    });

    try {
      const data = await fetchAdminProducts();

      if (!data) {
        set({ error: "Failed to fetch products" });
        return;
      }

      set({
        adminProducts: data,
        loading: false,
        hasFetchedAdminProducts: true,
      });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.error(error);
    }
  },
}));
