import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import "./global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MyDarkTheme } from "@/theme"; // import custom theme
import { ReactNode } from "react";
import { View } from "react-native";

function DarkThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: MyDarkTheme.colors.background }}>
      {children}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DarkThemeWrapper>
        <ThemeProvider value={MyDarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              statusBarStyle: "light",
              statusBarBackgroundColor: "#000000",
            }}>
            <Stack.Screen
              name="quickOrderModal"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
        </ThemeProvider>
      </DarkThemeWrapper>
    </AuthProvider>
  );
}
