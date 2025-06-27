import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { Orders } from "@/type";
import { formatDate } from "@/lib/common/formatDate";
import { formatPrice } from "@/lib/common/formatPrice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getStatusConfig } from "@/constants/StatusConfig";

const RenderItem = (item: Orders) => {
  const router = useRouter();

  const handleRedirectDetailOrder = useCallback(
    (orderId: string) => {
      router.push(`/(orders)/order-details/${orderId}`);
    },
    [router],
  );

  const getTypeIcon = (type: string) => {
    return type === "voucher" ? "gift-outline" : "card-outline";
  };

  const statusConfig = getStatusConfig(item.status);

  return (
    <TouchableOpacity
      className="bg-backgroundSecondary border-border/20 border rounded-xl mb-4 overflow-hidden shadow-sm"
      onPress={() => handleRedirectDetailOrder(item.orderId)}
      activeOpacity={0.8}>
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-primary font-bold text-base">
              #{item.orderId.substring(0, 8).toUpperCase()}
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color="#17d171"
              style={{ marginLeft: 4 }}
            />
          </View>

          <View
            className={`${statusConfig.bgColor} rounded-full px-3 py-1 flex-row items-center`}>
            <Ionicons
              name={statusConfig.icon}
              size={12}
              color={statusConfig.iconColor}
              style={{ marginRight: 4 }}
            />
            <Text className={`${statusConfig.textColor} text-xs font-medium`}>
              {item.status.toUpperCase()}
            </Text>
            {item.status === "pending" && item.redirectLink === null && (
              <Text className={`${statusConfig.textColor} text-xs font-medium`}>
                {" "}
                PAID
              </Text>
            )}
          </View>
        </View>

        <View className="bg-white/50 rounded-lg p-3 mb-3">
          <View className="flex-row items-center mb-2">
            <Ionicons name="game-controller-outline" size={16} color="#666" />
            <Text className="text-text font-semibold text-base ml-2">
              {item.gameName}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name={getTypeIcon(item.type)} size={14} color="#666" />
            <Text className="text-secondary text-sm ml-2">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text className="text-secondary text-sm mx-2">•</Text>
            <Text className="text-secondary text-sm">
              {formatPrice(item.value)} x {item.quantity}
            </Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text className="text-secondary font-medium ml-2">Date</Text>
            </View>
            <Text className="text-text text-sm">
              {formatDate(item.createdAt)}
            </Text>
          </View>

          {item.type === "topup" && item.target && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={14} color="#666" />
                <Text className="text-secondary font-medium ml-2">Target</Text>
              </View>
              <Text className="text-text text-sm font-mono">{item.target}</Text>
            </View>
          )}

          <View className="h-[1px] bg-border/50 my-2" />

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="wallet-outline" size={14} color="#666" />
              <Text className="text-secondary font-medium ml-2">Total</Text>
            </View>
            <Text className="text-primary font-bold text-lg">
              {formatPrice(item.priceTotal)}
            </Text>
          </View>
        </View>
      </View>

      {item.status === "pending" && item.redirectLink !== null && (
        <TouchableOpacity
          className="bg-primary py-3 items-center border-t border-border flex-row justify-center"
          onPress={() =>
            router.push({
              pathname: "/paymentScreen",
              params: { paymentUrl: item.redirectLink },
            })
          }
          activeOpacity={0.8}>
          <Ionicons name="card-outline" size={18} color="white" />
          <Text className="text-white font-bold ml-2">PAY NOW</Text>
        </TouchableOpacity>
      )}

      {item.status === "completed" && (
        <View className="bg-green-50 py-2 items-center border-t border-green-200">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#32cd32" />
            <Text className="text-green-700 font-medium ml-2 text-sm">
              {item.type === "voucher" ? "Voucher Ready" : "Top-up Complete"}
            </Text>
          </View>
        </View>
      )}

      {item.status === "processed" && (
        <View className="bg-blue-50 py-2 items-center border-t border-blue-200">
          <View className="flex-row items-center">
            <Ionicons name="hourglass" size={16} color="#00bfff" />
            <Text className="text-blue-700 font-medium ml-2 text-sm">
              Processing your order...
            </Text>
          </View>
        </View>
      )}

      {(item.status === "failed" || item.status === "cancelled") && (
        <View className="bg-red-50 py-2 items-center border-t border-red-200">
          <View className="flex-row items-center">
            <Ionicons name="close-circle" size={16} color="#f44336" />
            <Text className="text-red-700 font-medium ml-2 text-sm">
              {item.status === "failed" ? "Order Failed" : "Order Cancelled"}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RenderItem;
