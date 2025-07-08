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
import { useRouter } from "expo-router";
import { GameGroup, Products } from "@/type";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useProductStore } from "@/lib/stores/useProductStores";
import { colors } from "@/constants/colors";
import FailedMsg from "../ui/FailedMsg";
import BodyText from "../ui/BodyText";

const QuickTopup = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [target, setTarget] = useState("");
  const [amountOptions, setAmountOptions] = useState<Products[]>([]);
  const [popularGames, setPopularGames] = useState<GameGroup[]>([]);
  const [status, setStatus] = useState<string | null>("");
  const { user } = useAuthStore();
  const { products, loading, error, fetchProducts } = useProductStore(); //zustand
  const router = useRouter();

  //error
  useEffect(() => {
    setStatus(error);
  }, [error]);

  //data awal
  useEffect(() => {
    if (!products || products.length === 0) return;

    const filtered = products.filter((game) => game.isPopular === true);

    if (filtered.length > 0) {
      setPopularGames(filtered);
      setSelectedGame(filtered[0].gameId);

      const selectedGameProducts =
        filtered.find((game) => game.gameId === filtered[0].gameId)?.products ||
        [];
      setAmountOptions(selectedGameProducts);
    }
  }, [products]);

  //update tergantung options
  useEffect(() => {
    if (!popularGames.length) return;

    const gameProducts =
      popularGames.find((game) => game.gameId === selectedGame)?.products || [];
    setAmountOptions(gameProducts);
  }, [selectedGame, popularGames]);

  //handler order
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
      currency: option.currency,
    };

    router.push({
      pathname: "/(main)/checkout/OrderModal",
      params: payload,
    });
  };

  return (
    <View className="p-4 gap-4">
      {/* Game Picker */}
      <View>
        <BodyText className="text-text text-lg font-medium mb-2">
          Select Game
        </BodyText>
        <View className="bg-primary border border-border rounded-xl overflow-hidden">
          {popularGames.length > 0 ? (
            <Picker
              style={{ color: colors.text, fontFamily: "Nunito Regular" }}
              selectedValue={selectedGame}
              onValueChange={(value) => setSelectedGame(value)}>
              {popularGames.map((game) => (
                <Picker.Item
                  key={game.gameId}
                  label={game.gameName}
                  value={game.gameId}
                />
              ))}
            </Picker>
          ) : (
            <BodyText className="text-background p-4">
              Games failed to load
            </BodyText>
          )}
        </View>
      </View>

      {/* Game ID Input */}
      {amountOptions.length > 0 && amountOptions[0]?.type === "topup" && (
        <View>
          <BodyText className="text-text text-lg font-medium mb-2">
            Game ID
          </BodyText>
          <TextInput
            className="bg-secondary border text-text border-border py-4 px-3 rounded-lg"
            placeholder="Enter your Game ID"
            placeholderTextColor={colors.text + 50}
            value={target}
            onChangeText={setTarget}
          />
        </View>
      )}

      {/* Quick Topup Title */}
      <BodyText className="text-text text-base font-medium">
        Quick Topup Options:
      </BodyText>

      {/* Content */}
      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color="#ffffff" size="large" />
          <Text className="text-text mt-3">{status}</Text>
        </View>
      ) : error?.includes("Failed") ? (
        <View className="items-center py-8 bg-backgroundSecondary border border-border rounded-lg">
          <FailedMsg error={error} onPress={fetchProducts} />
        </View>
      ) : amountOptions.length === 0 ? (
        <View className="items-center py-8 border border-border bg-backgroundSecondary rounded-lg">
          <Text className="text-red-500 text-center">
            No vouchers available for this game.
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-4 mt-2">
          {amountOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="w-[48%] bg-neutral-100 border border-border rounded-xl p-4"
              onPress={() => handleQuickOrder(option)}>
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mb-3">
                <View className="w-5 h-5 bg-primary rounded-full" />
              </View>
              <BodyText className="text-text text-lg font-bold">
                {option.value.toLocaleString()} {option.currency}
              </BodyText>
              <BodyText className="text-zinc-700">
                Rp{option.price.toLocaleString()}
              </BodyText>
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
