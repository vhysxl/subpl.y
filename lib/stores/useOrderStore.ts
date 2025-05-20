// useOrderStore.ts
import { OrderStore } from "@/type";
import { create } from "zustand";
import { fetchOrders } from "../fetcher/ordersFetch";
import { useAuthStore } from "./useAuthStore";

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async (status?: string) => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.userId;
      if (!userId) {
        set({ loading: false, error: "Invalid user, please login" });
        return;
      }

      const data = await fetchOrders(userId, status || "");
      set({ orders: data || [], loading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Failed to fetch orders",
        loading: false,
      });
    }
  },
}));
