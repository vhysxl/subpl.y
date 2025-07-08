import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  Image,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useProductStore } from "@/lib/stores/useProductStores";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useBackHandler } from "@/lib/hooks/useBackHandler";
import BodyText from "@/app/components/ui/BodyText";

export default function GameDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { products } = useProductStore();
  const { user } = useAuthStore();

  const [target, setTarget] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  const game = products.find((g) => g.gameId === id);
  if (!game) return <BodyText>Game not found</BodyText>;

  const options = game.products;

  useBackHandler("/(tabs)/games");

  const handleOrder = () => {
    if (!user) return router.push("/login");
    if (!selectedOption) return Alert.alert("Please select an option first");

    if (selectedOption.type === "topup" && !target.trim()) {
      return Alert.alert("Game ID is required");
    }

    const qty = parseInt(quantity || "1", 10);
    if (!qty || qty < 1)
      return Alert.alert("Invalid quantity", "Minimum quantity is 1");

    if (selectedOption.type === "voucher" && qty > selectedOption.stock) {
      return Alert.alert(
        "Stock exceeded",
        `Only ${selectedOption.stock} left.`,
      );
    }

    router.push({
      pathname: "/(main)/checkout/OrderModal",
      params: {
        ...selectedOption,
        quantity: qty,
        target: target || "",
      },
    });
  };

  const renderPriceTotal = () => {
    if (!selectedOption) return null;
    const total = selectedOption.price * parseInt(quantity || "1");
    return (
      <View className="mt-5 flex-row items-center justify-between bg-blue-50 p-3 rounded-xl">
        <Text className="text-gray-700 font-medium">Total Price:</Text>
        <Text className="text-primary text-lg font-bold">
          Rp{total.toLocaleString("id-ID")}
        </Text>
      </View>
    );
  };

  const OptionCard = ({ option }: { option: any }) => {
    const isSelected = selectedOption?.value === option.value;
    return (
      <TouchableOpacity
        key={option.value}
        className={`w-[48%] rounded-2xl p-5 shadow-md ${
          isSelected
            ? "bg-blue-50 border-2 border-primary"
            : "bg-white border-2 border-gray-200"
        }`}
        onPress={() => setSelectedOption(option)}
        activeOpacity={0.7}>
        <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-4">
          <View className="w-6 h-6 bg-primary rounded-full" />
        </View>
        <BodyText className="text-xl font-bold text-text">
          {option.value.toLocaleString()} {option.currency}
        </BodyText>
        <BodyText className="text-gray-500 mt-1 text-base">
          Rp{option.price.toLocaleString("id-ID")}
        </BodyText>
        {option.type === "voucher" && (
          <View className="flex-row items-center mt-3">
            <MaterialIcons name="inventory" size={14} color="#10B981" />
            <Text className="text-emerald-600 text-xs ml-1 font-medium">
              {option.stock} available
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="px-4 mt-4 pb-4">
          <View
            className="rounded-xl overflow-hidden shadow-md"
            style={{ aspectRatio: 16 / 9 }}>
            <Image
              source={{ uri: game.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
              <Text className="text-white text-xl font-bold">
                {game.gameName}
              </Text>
              <Text className="text-white text-sm mt-1">
                {options.some((opt) => opt.type === "topup")
                  ? "Top-up game credits instantly"
                  : "Vouchers available now"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(main)/(tabs)/games")}
          className="absolute top-6 left-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View className="px-5 pt-4">
          {options.some((opt) => opt.type === "topup") && (
            <View className="mb-6 bg-white p-5 rounded-2xl shadow-md border border-gray-200">
              <BodyText className="mb-3 text-base font-semibold text-text">
                Enter Game ID
              </BodyText>
              <TextInput
                value={target}
                onChangeText={setTarget}
                placeholder="e.g. 12345678"
                className="border-b-2 border-gray-200 py-3 text-text text-lg mb-6"
                placeholderTextColor="#9CA3AF"
              />

              <BodyText className="mb-3 text-base font-semibold text-text">
                Input Quantity
              </BodyText>
              <TextInput
                keyboardType="numeric"
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                className="border-b-2 border-gray-200 py-3 text-text text-lg"
                placeholderTextColor="#9CA3AF"
              />
              {renderPriceTotal()}
            </View>
          )}

          <View className="flex-row items-center justify-between mb-4">
            <BodyText className="text-lg font-bold text-text">
              Select Option
            </BodyText>
            <Text className="text-primary text-sm">
              {options.length} options available
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4">
            {options.map((opt) => (
              <OptionCard option={opt} key={opt.value} />
            ))}
          </View>

          {!options.some((opt) => opt.type === "topup") && (
            <View className="mt-8 bg-white p-5 rounded-2xl shadow-md border-2 border-gray-200">
              <BodyText className="mb-3 text-base font-semibold text-text">
                Input Quantity
              </BodyText>
              <TextInput
                keyboardType="numeric"
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                className="border-b-2 border-gray-200 py-3 text-text text-lg"
                placeholderTextColor="#9CA3AF"
              />
              {renderPriceTotal()}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 shadow-lg">
        <TouchableOpacity
          onPress={handleOrder}
          disabled={!selectedOption}
          className={`rounded-xl py-4 items-center shadow-sm ${
            selectedOption ? "bg-primary" : "bg-gray-300"
          }`}
          activeOpacity={0.9}>
          <Text className="text-white font-bold text-lg">
            {selectedOption ? "Complete Order" : "Select an Option"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
