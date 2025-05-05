const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Tambah dukungan ekstensi TypeScript + CJS (kalau kamu pakai)
config.resolver.sourceExts.push("cjs", "ts", "tsx");

module.exports = withNativeWind(config, {
  input: "./app/global.css",
});
