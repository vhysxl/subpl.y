import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Orders } from "@/type";
import { formatDate } from "@/lib/common/formatDate";
import { formatPrice } from "@/lib/common/formatPrice";
import { useRouter } from "expo-router";

const RenderItem = (item: Orders) => {
  const router = useRouter();

  //DRY
  return (
    <TouchableOpacity
      className="bg-backgroundSecondary border-border/20 border rounded-xl mb-4 overflow-hidden"
      onPress={() => console.log(`Order details for ${item.orderId}`)}>
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-primary font-bold text-base">
            {item.orderId.substring(0, 8)}...
          </Text>
          <View className="bg-primary/10 rounded-full px-3 py-1">
            <Text className="text-primary text-xs font-medium">
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-border my-3" />

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary font-medium">Date</Text>
          <Text className="text-text">{formatDate(item.createdAt)}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary font-medium">Game</Text>
          <Text className="text-text">{item.gameName}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary font-medium">Type</Text>
          <Text className="text-text">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary font-medium">Value</Text>
          <Text className="text-text">{item.value}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary font-medium">Quantity</Text>
          <Text className="text-text">{item.quantity}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-secondary font-medium">Total</Text>
          <Text className="text-text font-bold">
            {formatPrice(item.priceTotal)}
          </Text>
        </View>
      </View>

      {item.status === "pending" && (
        <TouchableOpacity
          className="bg-primary py-3 items-center border-t border-border"
          onPress={() =>
            router.push({
              pathname: "/paymentScreen",
              params: { paymentUrl: item.redirectLink },
            })
          }>
          <Text className="text-white font-bold">PAY NOW</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default RenderItem;
