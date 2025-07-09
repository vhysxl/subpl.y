import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useConfigStore } from "@/lib/stores/useConfigStore";
import BodyText from "@/app/components/ui/BodyText";
import HeadingText from "@/app/components/ui/HeadingText";
import SystemMsg from "@/app/components/ui/SystemMsg";

const OrderModal = () => {
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();
  const { gameId, target, value, type, gameName, price, quantity, currency } =
    params;
  const { apiUrl } = useConfigStore();
  const router = useRouter();

  const totalPrice = Number(price) * Number(quantity);

  const properties = [
    { label: "Game ID", key: "gameId" },
    { label: "Target", key: "target" },
    { label: "Value", key: "value" },
    { label: "Type", key: "type" },
    { label: "Game Name", key: "gameName" },
    { label: "Price", key: "price" },
    { label: "Quantity", key: "quantity" },
  ];

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStatus("");
      };
    }, []),
  );

  const handleOrder = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/orders/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": process.env.EXPO_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          gameId,
          target,
          value: Number(value),
          type,
          gameName,
          quantity: Number(quantity),
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        setStatus("You're doing that too often. Please wait a moment.");
        return;
      }

      if (!result?.data?.payment?.redirect_url) {
        setStatus("Failed to create order. Please try again.");
        return;
      }

      router.push({
        pathname: "/(main)/checkout/PaymentScreen",
        params: { paymentUrl: result.data.payment.redirect_url },
      });
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-10 justify-between">
      <View className="items-center mb-8">
        <View className="bg-primary/20 p-3 rounded-full mb-4">
          <Ionicons name="cart-outline" size={32} color="#10b981" />
        </View>
        <HeadingText className="text-2xl text-text text-center">
          Order Details
        </HeadingText>
        <BodyText className="text-zinc-400 text-center mt-1">
          Please review your order details
        </BodyText>
      </View>

      <View className="bg-backgroundSecondary rounded-lg border border-border overflow-hidden mb-6">
        <View className="bg-backgroundSecondary px-4 border-l-4 border-primary">
          <Text className="text-text font-semibold text-lg">{gameName}</Text>
        </View>

        <View className="p-5 gap-6">
          {properties.map(({ label, key }) => {
            const val = params[key];
            if (
              val !== null &&
              val !== "" &&
              val !== undefined &&
              key !== "gameId"
            ) {
              return (
                <View className="flex-row items-center" key={key}>
                  <Text className="text-text/70 ml-3 font-semibold">
                    {label}
                  </Text>
                  <BodyText className="text-green-800 font-medium ml-auto">
                    {key === "value" && currency ? `${value} ${currency}` : val}
                  </BodyText>
                </View>
              );
            }
            return null;
          })}

          <View className="h-[1px] bg-zinc-700" />

          <View className="flex-row items-center">
            <Text className="text-text ml-3 font-semibold">Total Price</Text>
            <Text className="text-text font-bold ml-auto">
              Rp {totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-3 mt-auto mb-4">
        <TouchableOpacity
          className={`border py-4 rounded-xl ${
            isLoading
              ? "bg-primary/50 active:opacity-50"
              : "bg-primary active:opacity-80"
          }`}
          onPress={handleOrder}
          disabled={isLoading}>
          <Text className="text-white text-center font-bold text-base">
            {isLoading
              ? "Processing..."
              : `Confirm & Pay Rp${totalPrice.toLocaleString()}`}
          </Text>
        </TouchableOpacity>

        {status ? <SystemMsg message={status} type="error" /> : null}

        <TouchableWithoutFeedback
          onPress={() => router.back()}
          className="py-3 rounded-xl active:opacity-80 mt-4">
          <Text className="text-zinc-400 text-center font-medium mt-4 pt-4">
            Cancel
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default OrderModal;
