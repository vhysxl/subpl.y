import { Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useProductStore } from "@/lib/stores/useProductStores";

// Keep splash screen visible while resources are loading
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function RootLayout() {
  const fetchProducts = useProductStore((state) => state.fetchProducts); // Global fetch

  const [fontsLoaded, fontError] = useFonts({
    "Fredoka Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
    "Fredoka Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
    "Nunito Regular": require("../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Render null if fonts aren't loaded and there's no error
  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "light",
        statusBarBackgroundColor: "#000000",
      }}>
      <Stack.Screen
        name="OrderModal"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(orders)" />
    </Stack>
  );
}
