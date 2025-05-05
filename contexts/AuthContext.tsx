import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/type";

type AuthContextType = {
  user: User | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  authLoading: boolean;
};

// inisialisasi AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Cek token dari AsyncStorage
        const token = await AsyncStorage.getItem("token");
        // Jika ada token, ambil data user dari API
        if (token) {
          const res = await fetch(`${process.env.API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          // Jika berhasil, ambil data user
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              setUser(data.user);
            } else {
              // Jika tidak ada user, hapus token
              console.error("User data missing in response");
              await AsyncStorage.removeItem("token");
              setUser(null);
            }
          } else {
            console.error("Failed to fetch user data:", res.statusText);
            await AsyncStorage.removeItem("token"); // hapus token yang invalid
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData: User, token: string) => {
    await AsyncStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
