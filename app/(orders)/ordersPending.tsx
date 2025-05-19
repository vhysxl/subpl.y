import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";

const OrdersPending = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/orders?userId=${user?.userId}&status=pending`,
        {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        if (data.data?.orders) {
          setPendingOrders(data.data.orders);
        } else {
          setPendingOrders([]);
        }
      } else {
        setPendingOrders([]);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setError("Failed to load your pending orders. Please try again.");
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useAuthGuard();

  if (!user) {
    return null;
  }

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format price to currency format
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const renderOrderItem = ({ item }: any) => (
    <TouchableOpacity
      className="bg-zinc-900 rounded-xl mb-4 overflow-hidden"
      onPress={() => console.log(`Order details for ${item.orderId}`)}>
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-base">
            {item.orderId.substring(0, 8)}...
          </Text>
          <View className="bg-yellow-700/30 rounded-full px-3 py-1">
            <Text className="text-yellow-400 text-xs font-medium">
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-zinc-700 my-3" />

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 font-medium">Date</Text>
          <Text className="text-white">{formatDate(item.createdAt)}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 font-medium">Game</Text>
          <Text className="text-white">{item.gameName}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 font-medium">Type</Text>
          <Text className="text-white">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 font-medium">Value</Text>
          <Text className="text-white">{item.value}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 font-medium">Quantity</Text>
          <Text className="text-white">{item.quantity}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 font-medium">Total</Text>
          <Text className="text-white font-bold">
            {formatPrice(item.priceTotal)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-zinc-800 py-3 items-center"
        onPress={() => router.push(`/`)}>
        <Text className="text-yellow-400 font-bold">PAY NOW</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 gap-y-6 bg-black px-6 py-8 justify-start">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white ml-4">
          Pending Orders
        </Text>
      </View>

      {/* Subtitle */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="hourglass-outline" size={20} color="gold" />
        <Text className="text-gray-300 ml-2">Orders awaiting payment</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFC107" />
          <Text className="text-gray-300 mt-4">Loading your orders...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle-outline" size={80} color="#555" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            {error}
          </Text>
          <TouchableOpacity
            className="mt-6 bg-zinc-800 py-3 px-6 rounded-xl"
            onPress={fetchPendingOrders}>
            <Text className="text-white font-semibold">TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : pendingOrders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="cart-outline" size={80} color="#555" />
          <Text className="text-gray-400 text-lg mt-4">No pending orders</Text>
          <TouchableOpacity
            className="mt-6 bg-zinc-800 py-3 px-6 rounded-xl"
            onPress={() => router.push("/")}>
            <Text className="text-white font-semibold">CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pendingOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId}
          showsVerticalScrollIndicator={false}
          className="flex-1 w-full"
        />
      )}

      {/* Navigation Footer */}
      <View className="flex-row justify-between bg-zinc-900 rounded-2xl overflow-hidden">
        <TouchableOpacity
          className="py-6 items-center flex-1"
          onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={24} color="white" />
          <Text className="text-gray-300 font-semibold text-xs mt-1">
            Profile
          </Text>
        </TouchableOpacity>

        <View className="w-[1px] bg-zinc-700" />

        <TouchableOpacity
          className="py-6 items-center flex-1 bg-zinc-800"
          onPress={() => {}}>
          <Ionicons name="hourglass-outline" size={24} color="gold" />
          <Text className="text-yellow-400 font-semibold text-xs mt-1">
            Pending
          </Text>
        </TouchableOpacity>

        <View className="w-[1px] bg-zinc-700" />

        <TouchableOpacity
          className="py-6 items-center flex-1"
          onPress={() => router.push("/")}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color="lightgreen"
          />
          <Text className="text-gray-300 font-semibold text-xs mt-1">
            Completed
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrdersPending;
