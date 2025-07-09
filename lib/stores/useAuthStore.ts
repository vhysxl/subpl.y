import { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { fetchConfig } from "../fetcher/configFetch";

interface AuthStore {
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  authLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  authLoading: true,
  isAdmin: false,
  isSuperAdmin: false,

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = await fetchConfig();

      if (token) {
        const res = await fetch(`${config.apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
          },
        });

        if (res.ok) {
          const data = await res.json();

          const userData: User = {
            userId: data.sub, // API return 'sub', tapi User type expect 'userId'
            name: data.name,
            email: data.email,
            createdAt: data.createdAt,
            roles: data.roles,
          };

          if (data) {
            const hasAdminRole = data.roles?.includes("admin") || false;
            const hasSuperAdminRole =
              data.roles?.includes("superadmin") || false;

            set({
              user: userData,
              isAdmin: hasAdminRole,
              isSuperAdmin: hasSuperAdminRole,
            });
          } else {
            // Jika tidak ada user, hapus token
            console.error("User data missing in response");
            await AsyncStorage.removeItem("token");
            set({
              user: null,
              isAdmin: false,
              isSuperAdmin: false,
            });
          }
        } else {
          console.error("Failed to fetch user data:", res.statusText);
          await AsyncStorage.removeItem("token"); // hapus token yang invalid
          set({
            user: null,
            isAdmin: false,
            isSuperAdmin: false,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load user data: ", error);
      set({
        user: null,
        isAdmin: false,
        isSuperAdmin: false,
      });
    } finally {
      set({ authLoading: false });
    }
  },

  login: async (userData: User, token: string) => {
    await AsyncStorage.setItem("token", token);
    const hasAdminRole = userData.roles?.includes("admin") || false;
    const hasSuperAdminRole = userData.roles?.includes("superadmin") || false;

    set({
      user: userData,
      isAdmin: hasAdminRole,
      isSuperAdmin: hasSuperAdminRole,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({
      user: null,
      isAdmin: false,
      isSuperAdmin: false,
      authLoading: false,
    });
  },
}));
