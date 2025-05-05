import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const quickOrderModal = () => {
  const params = useLocalSearchParams();
  const { gameId, target, value, type, gameName, price, quantity } = params;
  const { user } = useAuth();
  const router = useRouter();

  const properties = [
    { label: "Game ID", key: "gameId" },
    { label: "Target", key: "target" },
    { label: "Value", key: "value" },
    { label: "Type", key: "type" },
    { label: "Game Name", key: "gameName" },
    { label: "Price", key: "price" },
    { label: "Quantity", key: "quantity" },
  ];

  const handleQuickOrder = async () => {
    console.log(user);

    const userId = user?.userId;
    const name = user?.name;
    const email = user?.email;
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            email,
            gameId,
            target,
            value: Number(value),
            type,
            gameName,
            customerName: name,
            quantity: Number(quantity),
          }),
        },
      );

      console.log("value", typeof value, "quantity", typeof quantity);

      const result = await response.json();

      console.log(result);

      if (!result.data.payment.redirect_url) {
        console.error("failed to create payment intent");
        return;
      }

      router.push({
        pathname: "/paymentScreen",
        params: { paymentUrl: result.data.payment.redirect_url },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-zinc-950 px-6 py-10 justify-between">
      <View className="items-center mb-8">
        <View className="bg-emerald-500/20 p-3 rounded-full mb-4">
          <Ionicons name="cart-outline" size={32} color="#10b981" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">
          Quick Order Details
        </Text>
        <Text className="text-zinc-400 text-center mt-1">
          Please review your order details
        </Text>
      </View>

      <View className="bg-zinc-900 overflow-hidden mb-6">
        <View className="bg-zinc-800 py-3 px-4 border-l-4 border-emerald-500">
          <Text className="text-white font-semibold text-lg">{gameName}</Text>
        </View>

        <View className="p-5 gap-6">
          {properties.map(({ label, key }) => {
            //conditional rendering
            const value = params[key];
            if (
              value !== null &&
              value !== "" &&
              value !== undefined &&
              key !== "gameId"
            ) {
              return (
                <View className="flex-row items-center" key={key}>
                  <Text className="text-zinc-300 ml-3 font-semibold">
                    {label}
                  </Text>
                  <Text className="text-white font-medium ml-auto">
                    {value}
                  </Text>
                </View>
              );
            }
            return null;
          })}

          <View className="flex-row items-center">
            <Text className="text-zinc-300 ml-3 font-semibold">
              Voucher Value
            </Text>
            <Text className="text-white font-medium ml-auto">
              {value?.toLocaleString()}
            </Text>
          </View>

          <View className="h-[1px] bg-zinc-700" />

          <View className="flex-row items-center">
            <Text className="text-zinc-300 ml-3 font-semibold">
              Total Price
            </Text>
            <Text className="text-white font-bold ml-auto">
              Rp {price?.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-3 mt-auto">
        <TouchableOpacity
          className="bg-emerald-500 py-4 rounded-xl active:opacity-80"
          onPress={handleQuickOrder}>
          <Text className="text-white text-center font-bold text-base">
            Confirm & Pay Rp{price?.toLocaleString()}
          </Text>
        </TouchableOpacity>

        <TouchableWithoutFeedback
          onPress={() => router.back()}
          className="py-3 rounded-xl active:opacity-80">
          <Text className="text-zinc-400 text-center font-medium">Cancel</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default quickOrderModal;
