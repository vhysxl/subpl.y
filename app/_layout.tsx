import { Stack, useRouter } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/stores/useProductStores";
import { fetchConfig } from "@/lib/fetcher/configFetch";
import { useAuthStore } from "@/lib/stores/useAuthStore";

// Keep splash screen visible while resources are loading
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const fetchProducts = useProductStore((state) => state.fetchProducts); // Global fetch
  const { loadUser, authLoading } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Fredoka Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
    "Fredoka Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
    "Nunito Regular": require("../assets/fonts/Nunito-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    loadUser(); // panggil loadUser untuk check AsyncStorage + API
  }, []);

  // Set app ready ketika fonts loaded DAN auth selesai
  useEffect(() => {
    if ((fontsLoaded || fontError) && !authLoading) {
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  useEffect(() => {
    if (isAppReady) {
      fetchConfig();
      fetchProducts();
    }
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "light",
        statusBarBackgroundColor: "#000000",
      }}>
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
