import { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  authLoading: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  authLoading: true,

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const res = await fetch(`${process.env.API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          if (data?.user) {
            set({ user: data.user });
          } else {
            // Jika tidak ada user, hapus token
            console.error("User data missing in response");
            await AsyncStorage.removeItem("token");
            set({ user: null });
          }
        } else {
          console.error("Failed to fetch user data:", res.statusText);
          await AsyncStorage.removeItem("token"); // hapus token yang invalid
          set({ user: null });
        }
      }
    } catch (error) {
      console.error("Failed to load user data: ", error);
    } finally {
      set({ authLoading: false });
    }
  },

  login: async (userData: User, token: string) => {
    await AsyncStorage.setItem("token", token);
    set({ user: userData });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ user: null });
  },
}));
