import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import RenderItem from "../../components/ui/OrderItem";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { fetchOrders } from "@/lib/fetcher/ordersFetch";
import { Orders } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import HeadingText from "@/app/components/ui/HeadingText";

const OrdersPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useAuthGuard();

  useEffect(() => {
    if (user) {
      fetchAllOrders();
    }
  }, [user]);

  useEffect(() => {
    //back to home handler
    const backAction = () => {
      router.replace("/(main)/(tabs)/profile");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = user?.userId;

      if (!userId) {
        setError("Invalid user, please login with valid user");
        return;
      }
      const ordersData = await fetchOrders(userId);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-8">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.replace("/(main)/(tabs)/profile")}
          className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <HeadingText className="text-2xl font-bold text-text">
          My Orders
        </HeadingText>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#17d171" />
          <Text className="text-secondary mt-4">Loading your orders...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center bg-red-50 rounded-xl p-6">
          <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
          <Text className="text-red-500 text-center mt-4 font-medium">
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchAllOrders}
            className="mt-4 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-background font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="receipt-outline" size={70} color="#cccccc" />
          <Text className="text-text/70 text-center mt-4 font-medium text-lg">
            No orders found
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(main)/(tabs)/games")}
            className="mt-6 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-background font-bold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-secondary font-bold text-base">
              {orders.length} Order{orders.length > 1 ? "s" : ""}
            </Text>
            <TouchableOpacity onPress={fetchAllOrders}>
              <Ionicons name="refresh-outline" size={20} color="#17d171" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[...orders].map((item) => (
              <RenderItem key={item.orderId} {...item} />
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrdersPage;
