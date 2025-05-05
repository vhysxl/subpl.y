// theme.ts
import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#000000", // warna background app
    card: "#121212", // warna header/card
    text: "#FFFFFF", // warna teks
    border: "#222222", // warna border
    primary: "#1DB954", // contoh warna utama (bebas mau ganti)
  },
};
