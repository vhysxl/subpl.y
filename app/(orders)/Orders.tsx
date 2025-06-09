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
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderItem from "../components/orders/RenderItem";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { fetchOrders } from "@/lib/fetcher/ordersFetch";
import { Orders } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import HeadingText from "../components/extras/HeadingText";
import { STATUS_CONFIG } from "@/constants/ordersConfig";
import Indicator from "../components/orders/Indicator";

const OrdersPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { status } = useLocalSearchParams();

  const validStatuses = ["pending", "processing", "completed"];
  const orderStatus = validStatuses.includes(status as string)
    ? (status as "pending" | "processing" | "completed")
    : "pending";

  const currentConfig = STATUS_CONFIG[orderStatus];

  const fetchOrdersByStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = user?.userId;

      if (!userId) {
        setError("Invalid user, please login with valid user");
        return;
      }

      let ordersData;

      if (orderStatus === "processing") {
        ordersData = await fetchOrders(userId, "processed");
      } else {
        ordersData = await fetchOrders(userId, orderStatus);
      }

      setOrders(ordersData);
    } catch (error) {
      console.error(`Error fetching ${orderStatus} orders:`, error);
      setError(`Failed to load your ${orderStatus} orders. Please try again.`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useAuthGuard();

  if (!user) {
    return null;
  }

  useEffect(() => {
    fetchOrdersByStatus();
  }, [orderStatus]);

  useEffect(() => {
    //back to home handler
    const backAction = () => {
      router.replace("/(tabs)/profile");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const navigateToStatus = (
    newStatus: "pending" | "processing" | "completed",
  ) => {
    router.push({
      pathname: "/(orders)/Orders",
      params: { status: newStatus },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-8">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <HeadingText className="text-2xl font-bold text-text">
          {currentConfig.title}
        </HeadingText>
      </View>

      <View className="flex-row justify-between items-center mb-6 bg-secondary/20 rounded-xl p-4 border border-border/20">
        <Indicator
          label="Pending"
          icon="hourglass-outline"
          value="pending"
          currentStatus={orderStatus}
          activeColor="#ffc107"
          onPress={() => navigateToStatus("pending")}
        />

        <View className="flex-1 h-[1px] bg-border/30 mx-2" />

        <Indicator
          label="Processing"
          icon="reload-circle-outline"
          value="processing"
          currentStatus={orderStatus}
          activeColor="#00bfff"
          onPress={() => navigateToStatus("processing")}
        />

        <View className="flex-1 h-[1px] bg-border/30 mx-2" />

        <Indicator
          label="Completed"
          icon="checkmark-outline"
          value="completed"
          currentStatus={orderStatus}
          activeColor="#32cd32"
          onPress={() => navigateToStatus("completed")}
        />
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
            onPress={fetchOrdersByStatus}
            className="mt-4 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-background font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons
            name={currentConfig.icon as any}
            size={70}
            color="#cccccc"
          />
          <Text className="text-text/70 text-center mt-4 font-medium text-lg">
            {currentConfig.emptyMessage}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/games")}
            className="mt-6 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-background font-bold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-secondary font-bold text-base">
              {orders.length}{" "}
              {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)} Order
              {orders.length > 1 ? "s" : ""}
            </Text>
            <TouchableOpacity onPress={fetchOrdersByStatus}>
              <Ionicons name="refresh-outline" size={20} color="#17d171" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[...orders] 
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              ) // sort by date descending
              .map((item) => (
                <RenderItem key={item.orderId} {...item} />
              ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrdersPage;
