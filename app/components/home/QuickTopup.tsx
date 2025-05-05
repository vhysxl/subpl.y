import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Products } from "@/type";

const QuickTopup = () => {
  const [selectedGameSlug, setSelectedGameSlug] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Products[]>([]);
  const [voucherOptions, setVoucherOptions] = useState<Products[]>([]);
  const [popularGames, setPopularGames] = useState<
    { gameId: string; gameName: string }[]
  >([]);
  const [status, setStatus] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setStatus("Loading voucher options...");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products`,
      );
      const result = await response.json();

      if (!result.success) throw new Error("Failed to fetch");

      const productsData: Products[] = result.data.products;

      // Game populer unik
      // Buat Map untuk menyimpan game populer tanpa duplikat berdasarkan gameId
      const gameMap = new Map();
      for (const product of productsData) {
        // Jika produk populer dan gameId-nya belum dimasukkan ke Map
        if (product.isPopular && !gameMap.has(product.gameId)) {
          // Simpan info game (hanya sekali per gameId)
          gameMap.set(product.gameId, {
            gameId: product.gameId,
            gameName: product.gameName,
          });
        }
      }

      // Ubah isi Map menjadi array of game objects
      const gamesArray = Array.from(gameMap.values());

      // Validasi: lempar error jika tidak ada game populer ditemukan
      if (gamesArray.length === 0) {
        throw new Error("No popular games found");
      }

      setPopularGames(gamesArray);
      setProducts(productsData);

      const firstGame = gamesArray[0];
      setSelectedGameSlug(firstGame.gameId);
      filterVoucherOptions(firstGame.gameId, productsData);

      setStatus("");
    } catch (error) {
      setStatus(
        "Failed to load data. Please check your connection or try again later.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterVoucherOptions = (gameSlug: string, data: Products[]) => {
    const filtered = data.filter((product) => product.gameId === gameSlug);
    setVoucherOptions(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterVoucherOptions(selectedGameSlug, products);
  }, [selectedGameSlug]);

  const handleQuickOrder = async (option: Products) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (option.type === "topup" && !target) {
      Alert.alert("Missing Game ID", "Please enter your Game ID first.");
      return;
    }

    const payload = {
      gameId: option.gameId,
      target: target || "",
      value: option.value,
      type: option.type,
      gameName: option.gameName,
      price: option.price,
      quantity: 1,
    };

    router.push({
      pathname: "/quickOrderModal",
      params: payload,
    });
  };

  return (
    <View className="p-4">
      <Text className="text-white text-lg font-medium mb-2">Select Game</Text>
      <Picker
        selectedValue={selectedGameSlug}
        onValueChange={(itemValue) => setSelectedGameSlug(itemValue)}
        style={{
          color: "white",
          backgroundColor: "#27272a",
          borderRadius: 10,
          paddingHorizontal: 10,
        }}>
        {popularGames.map((game) => (
          <Picker.Item
            key={game.gameId}
            label={game.gameName}
            value={game.gameId}
          />
        ))}
      </Picker>

      {voucherOptions[0]?.type === "topup" && (
        <>
          <Text className="text-white text-lg font-medium mt-4 mb-2">
            Game ID
          </Text>
          <TextInput
            className="bg-zinc-800 text-white p-3 rounded-lg mb-4"
            placeholder="Enter your Game ID"
            placeholderTextColor="#aaa"
            value={target}
            onChangeText={setTarget}
          />
        </>
      )}

      <Text className="text-white text-lg font-medium mb-4">
        Quick Topup Options
      </Text>

      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color="#ffffff" size="large" />
          <Text className="text-zinc-400 mt-3">{status}</Text>
        </View>
      ) : status.includes("Failed") ? (
        <View className="items-center py-8 bg-zinc-900 rounded-lg">
          <Text className="text-red-400 text-center">{status}</Text>
          <TouchableOpacity
            className="mt-4 bg-zinc-700 px-6 py-2 rounded-lg"
            onPress={fetchProducts}>
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : voucherOptions.length === 0 ? (
        <View className="items-center py-8 bg-zinc-900 rounded-lg">
          <Text className="text-zinc-400 text-center">
            No vouchers available for this game.
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {voucherOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="w-[48%] bg-zinc-900 rounded-lg p-4 mb-3"
              onPress={() => handleQuickOrder(option)}>
              <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mb-3">
                <View className="w-5 h-5 bg-white rounded-full" />
              </View>
              <Text className="text-white text-lg font-bold">
                {option.value.toLocaleString()} {option.currency}
              </Text>
              <Text className="text-zinc-400">
                Rp{option.price.toLocaleString()}
              </Text>

              {option.type === "voucher" && (
                <Text className="text-emerald-400 text-xs mt-1">
                  Stock: {option.stock}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default QuickTopup;
