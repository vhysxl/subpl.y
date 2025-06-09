import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Orders } from "@/type";
import { fetchAllOrders } from "@/lib/fetcher/ordersFetch";
import BodyText from "../components/extras/BodyText";
import AdminButton from "../components/admin/AdminButton";
import Header from "../components/admin/Header";

const { width } = Dimensions.get("window");

const OrdersPage = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders(1);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Orders["status"],
  ) => {
    try {
      Alert.alert(
        "Confirm Status Change",
        `Change order status to ${newStatus.toUpperCase()}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              // Add your API call here
              Alert.alert("Success", `Order status updated to ${newStatus}`);
              fetchOrders();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      console.error("Update status error:", error);
    }
  };

  const getStatusConfig = (status: Orders["status"]) => {
    const configs = {
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      processed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
    };
    return configs[status];
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  const getAvailableActions = (currentStatus: Orders["status"]) => {
    const allStatuses = ["processed", "completed", "cancelled"];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOrderItem = ({ item }: { item: Orders }) => {
    const statusConfig = getStatusConfig(item.status);
    const availableActions = getAvailableActions(item.status);

    return (
      <View className="bg-white mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100">
        {/* Header with game name and status */}
        <View className="p-4 pb-3 border-b border-gray-50">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-3">
              <BodyText className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                {item.gameName}
              </BodyText>
              <BodyText className="text-gray-600 text-sm">
                {item.quantity}x {item.value.toLocaleString()} {item.type}
              </BodyText>
            </View>

            <View
              className={`px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
              <Text
                className={`text-xs font-semibold ${statusConfig.text} uppercase tracking-wide`}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Order details */}
        <View className="p-4 pt-3">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                Order ID
              </BodyText>
              <BodyText className="text-gray-800 font-mono text-sm">
                {item.orderId}
              </BodyText>
            </View>

            <View className="items-end">
              <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                Total
              </BodyText>
              <BodyText className="text-gray-900 font-bold text-lg">
                Rp {item.priceTotal.toLocaleString("id-ID")}
              </BodyText>
            </View>
          </View>

          <View className="mb-4">
            <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-1">
              Created
            </BodyText>
            <BodyText className="text-gray-700 text-sm">
              {formatDate(item.createdAt)}
            </BodyText>
          </View>

          {/* Action buttons */}
          {availableActions.length > 0 && (
            <View className="border-t border-gray-50 pt-3">
              <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-2">
                Update Status
              </BodyText>
              <View className="flex-row flex-wrap gap-2">
                {availableActions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() =>
                      handleStatusChange(
                        item.orderId,
                        status as Orders["status"],
                      )
                    }
                    className={`px-4 py-2 rounded-lg border-2 ${
                      status === "completed"
                        ? "bg-emerald-50 border-emerald-200"
                        : status === "cancelled"
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}>
                    <Text
                      className={`text-sm font-medium capitalize ${
                        status === "completed"
                          ? "text-emerald-700"
                          : status === "cancelled"
                          ? "text-red-700"
                          : "text-blue-700"
                      }`}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header Heading="Orders" Body="Manage user orders here" />

      {/* Filter section */}
      <View className="px-4 mb-4">
        <BodyText className="text-gray-700 font-medium mb-2">
          Filter by Status
        </BodyText>
        <View className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <Picker
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
            style={{
              color: "#1F2937",
              height: 50,
            }}>
            <Picker.Item label="🔍 All Status" value="all" />
            <Picker.Item label="⏳ Pending" value="pending" />
            <Picker.Item label="⚙️ Processed" value="processed" />
            <Picker.Item label="✅ Completed" value="completed" />
            <Picker.Item label="❌ Cancelled" value="cancelled" />
          </Picker>
        </View>
      </View>

      {/* Results summary */}
      <View className="px-4 mb-3">
        <BodyText className="text-gray-600 text-sm">
          {loading ? "Loading..." : `Showing ${filteredOrders.length} orders`}
        </BodyText>
      </View>

      {/* Order list */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-4">
              <Text className="text-6xl text-center mb-4">📦</Text>
              <BodyText className="text-gray-600 text-center text-lg font-medium mb-2">
                No orders found
              </BodyText>
              <BodyText className="text-gray-500 text-center text-sm">
                {selectedStatus === "all"
                  ? "Orders will appear here once customers make purchases"
                  : `No orders with "${selectedStatus}" status`}
              </BodyText>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default OrdersPage;
