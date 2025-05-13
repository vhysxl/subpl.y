import { ProductStore } from "@/type";
import { create } from "zustand";
import { fetchProducts } from "../fetcher/productFetch";
import { groupProductsByGame } from "../common/productsGrouping";

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

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
}));
