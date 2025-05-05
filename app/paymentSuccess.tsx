// app/paymentSuccess.tsx
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-zinc-950 px-6 py-10 justify-between">
      <View className="items-center mb-8">
        <View className="bg-emerald-500/20 p-4 rounded-full mb-4">
          <Ionicons name="checkmark-circle-outline" size={40} color="#10b981" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">
          Payment Successful
        </Text>
        <Text className="text-zinc-400 text-center mt-1">
          Thank you! Your order has been processed successfully.
        </Text>
      </View>

      <View className="bg-zinc-900 rounded-xl p-5 mb-6">
        <Text className="text-white font-semibold text-lg mb-3">
          What’s Next?
        </Text>
        <Text className="text-zinc-400">
          You will receive your voucher or game credit shortly. If you encounter
          any issues, please contact the admin. You can also check the status of
          your order in the My Orders section on your profile.
        </Text>
      </View>

      <View className="space-y-3 mt-auto">
        <TouchableOpacity
          className="bg-emerald-500 py-4 rounded-xl active:opacity-80"
          onPress={() => router.push("/")}>
          <Text className="text-white text-center font-bold text-base">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccess;
