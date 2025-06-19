import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
  Clipboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
import HeadingText from "../../components/extras/HeadingText";
import { OrderDetail } from "@/type";
import { cancelOrder, getOrderDetail } from "@/lib/fetcher/ordersFetch";
import { formatDate } from "@/lib/common/formatDate";

const OrderDetailPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useAuthGuard();

  useEffect(() => {
    console.log(orderId);
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.userId || !orderId) {
        setError("Invalid order or user");
        return;
      }

      const data = await getOrderDetail(orderId);

      if (data) {
        setOrderDetail(data);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetail();
    }
  }, [orderId, user]);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", `${type} copied to clipboard`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "hourglass-outline";
      case "processing":
        return "reload-circle-outline";
      case "completed":
        return "checkmark-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#17d171" />
        <Text className="text-secondary mt-4">Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !orderDetail) {
    return (
      <SafeAreaView className="flex-1 bg-background px-6 pt-8">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <HeadingText className="text-2xl font-bold text-text">
            Order Details
          </HeadingText>
        </View>

        <View className="flex-1 justify-center items-center bg-red-50 rounded-xl p-6">
          <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
          <Text className="text-red-500 text-center mt-4 font-medium">
            {error || "Order not found"}
          </Text>
          <TouchableOpacity
            onPress={fetchOrderDetail}
            className="mt-4 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-background font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-8">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <HeadingText className="text-2xl font-bold text-text">
          Order Details
        </HeadingText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-border/20">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons
                name={getStatusIcon(orderDetail.status) as any}
                size={24}
                color={
                  orderDetail.status === "completed"
                    ? "#32cd32"
                    : orderDetail.status === "processing"
                    ? "#00bfff"
                    : "#ffc107"
                }
              />
              <Text className="text-lg font-bold text-text ml-2">
                Order #{orderDetail.orderId.slice(-8).toUpperCase()}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusColor(
                orderDetail.status,
              )}`}>
              <Text className="text-sm font-medium capitalize">
                {orderDetail.status}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => copyToClipboard(orderDetail.orderId, "Order ID")}
            className="flex-row items-center">
            <Text className="text-secondary text-sm flex-1">
              {orderDetail.orderId}
            </Text>
            <Ionicons name="copy-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-border/20">
          <Text className="text-lg font-bold text-text mb-4">
            Product Information
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-secondary">Game</Text>
              <Text className="text-text font-medium">
                {orderDetail.gameName}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-secondary">Type</Text>
              <Text className="text-text font-medium capitalize">
                {orderDetail.type}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-secondary">Value</Text>
              <Text className="text-text font-medium">
                {formatCurrency(orderDetail.value)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-secondary">Quantity</Text>
              <Text className="text-text font-medium">
                {orderDetail.quantity}
              </Text>
            </View>

            {orderDetail.type === "topup" && orderDetail.target && (
              <View className="flex-row justify-between">
                <Text className="text-secondary">Target Account</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(orderDetail.target, "Target Account")
                  }
                  className="flex-row items-center">
                  <Text className="text-text font-medium mr-2">
                    {orderDetail.target}
                  </Text>
                  <Ionicons name="copy-outline" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {orderDetail.type === "voucher" &&
          orderDetail.status === "completed" &&
          orderDetail.voucherCodes &&
          orderDetail.voucherCodes.length > 0 && (
            <View className="bg-green-50 rounded-xl p-6 mb-4 border border-green-200">
              <View className="flex-row items-center mb-4">
                <Ionicons name="gift-outline" size={24} color="#32cd32" />
                <Text className="text-lg font-bold text-green-800 ml-2">
                  Voucher Code{orderDetail.voucherCodes.length > 1 ? "s" : ""}
                </Text>
              </View>

              {orderDetail.voucherCodes.map((code, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => copyToClipboard(code, "Voucher Code")}
                  className="bg-white rounded-lg p-4 mb-2 border border-green-300 flex-row items-center justify-between">
                  <Text className="text-green-800 font-mono font-bold text-lg">
                    {code}
                  </Text>
                  <Ionicons name="copy-outline" size={20} color="#32cd32" />
                </TouchableOpacity>
              ))}

              <Text className="text-green-600 text-sm text-center mt-2">
                Tap to copy voucher code
              </Text>
            </View>
          )}

        {/* Payment Link Card - Only show if status is not completed and paymentLink exists */}
        {orderDetail.status !== "completed" && orderDetail.paymentLink && (
          <View className="bg-blue-50 rounded-xl p-6 mb-4 border border-blue-200">
            <View className="flex-row items-center mb-4">
              <Ionicons name="card-outline" size={24} color="#00bfff" />
              <Text className="text-lg font-bold text-blue-800 ml-2">
                Payment
              </Text>
            </View>

            <Text className="text-blue-600 mb-4">
              Complete your payment to process this order
            </Text>

            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/paymentScreen",
                  params: { paymentUrl: orderDetail.paymentLink },
                });
              }}
              className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center">
              <Ionicons name="open-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-border/20">
          <Text className="text-lg font-bold text-text mb-4">
            Order Summary
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-secondary">Order Date</Text>
              <Text className="text-text font-medium">
                {formatDate(orderDetail.createdAt)}
              </Text>
            </View>

            <View className="h-px bg-border/30" />

            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-text">Total</Text>
              <Text className="text-lg font-bold text-primary">
                {formatCurrency(orderDetail.priceTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-8">
          {orderDetail.status === "pending" && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Cancel Order",
                  "Are you sure you want to cancel this order?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      onPress: () => cancelOrder(orderId),
                    },
                  ],
                );
              }}
              className="bg-red-500 rounded-xl p-4 mb-3">
              <Text className="text-white font-bold text-center">
                Cancel Order
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              // Handle contact support
            }}
            className="bg-gray-200 rounded-xl p-4">
            <Text className="text-gray-700 font-bold text-center">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailPage;
