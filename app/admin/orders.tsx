import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Orders } from "@/type";
import { fetchAllOrders, updateOrders } from "@/lib/fetcher/ordersFetch";
import BodyText from "../components/extras/BodyText";
import Header from "../components/admin/Header";
import { formatDate } from "@/lib/common/formatDate";
import PaginationControls from "../components/admin/PaginationControls";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusConfig = (status: Orders["status"]) => {
    const configs = {
      pending: {
        bg: "bg-yellow-100",
        cardBg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-300",
        icon: "time-outline" as keyof typeof Ionicons.glyphMap,
        color: "#D97706",
      },
      processed: {
        bg: "bg-blue-100",
        cardBg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-300",
        icon: "settings-outline" as keyof typeof Ionicons.glyphMap,
        color: "#2563EB",
      },
      completed: {
        bg: "bg-green-100",
        cardBg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-300",
        icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
        color: "#059669",
      },
      cancelled: {
        bg: "bg-red-100",
        cardBg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-300",
        icon: "close-circle-outline" as keyof typeof Ionicons.glyphMap,
        color: "#DC2626",
      },
      failed: {
        bg: "bg-gray-100",
        cardBg: "bg-gray-50",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: "alert-circle-outline" as keyof typeof Ionicons.glyphMap,
        color: "#6B7280",
      },
    };
    return configs[status];
  };

  const fetchOrders = async (page: number) => {
    try {
      setLoading(true);
      const data = await fetchAllOrders(page);

      if (data && data.length > 0) {
        setOrders(data);

        setHasNextPage(data.length >= 20);
      } else {
        setOrders([]);
        setHasNextPage(false);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Orders["status"],
  ) => {
    try {
      const response = await updateOrders(newStatus, orderId);
      if (response) {
        Alert.alert("Success", `Order status updated to ${newStatus}`);
      }
      setModalVisible(false);
      setSelectedOrder(null);
      fetchOrders(currentPage);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      console.error("Update status error:", error);
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const openStatusModal = (order: Orders) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const StatusUpdateModal = () => {
    if (!selectedOrder) return null;

    const allStatus = [
      { key: "pending", label: "Pending" },
      { key: "processed", label: "Processed" },
      { key: "completed", label: "Completed" },
      { key: "cancelled", label: "Cancelled" },
      { key: "failed", label: "Failed" },
    ];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <BodyText className="text-lg font-bold text-gray-900">
                Update Order Status
              </BodyText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <BodyText className="text-gray-600 mb-4">
              Order ID: {selectedOrder.orderId}
            </BodyText>

            <View className="space-y-3">
              {allStatus.map((status) => {
                const config = getStatusConfig(status.key as Orders["status"]);
                const isCurrentStatus = selectedOrder.status === status.key;

                return (
                  <TouchableOpacity
                    key={status.key}
                    onPress={() => {
                      if (!isCurrentStatus) {
                        Alert.alert(
                          "Confirm Status Change",
                          `Change order status to ${status.label.toUpperCase()}?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Confirm",
                              onPress: () =>
                                handleStatusChange(
                                  selectedOrder.orderId,
                                  status.key as Orders["status"],
                                ),
                            },
                          ],
                        );
                      }
                    }}
                    disabled={isCurrentStatus}
                    className={`flex-row items-center p-4 rounded-xl border ${
                      isCurrentStatus
                        ? `${config.cardBg} ${config.border} opacity-50`
                        : "bg-backgroundSecondary border-gray-200"
                    }`}>
                    <Ionicons
                      name={config.icon}
                      size={24}
                      color={config.color}
                      style={{ marginRight: 12 }}
                    />
                    <View className="flex-1">
                      <BodyText
                        className={`font-medium ${
                          isCurrentStatus ? config.text : "text-gray-900"
                        }`}>
                        {status.label}
                      </BodyText>
                      {isCurrentStatus && (
                        <BodyText className="text-xs text-gray-500 mt-1">
                          Current status
                        </BodyText>
                      )}
                    </View>
                    {isCurrentStatus && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={config.color}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderOrderItem = ({ item }: { item: Orders }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View
        className={`mx-4 mb-3 rounded-2xl shadow-sm border border-white/20 ${statusConfig.border} ${statusConfig.cardBg}`}>
        <View className="p-4 pb-3 border-b border-gray-200">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-3">
              <BodyText className="font-bold text-text text-lg mb-1 leading-tight">
                {item.gameName}
              </BodyText>
              <BodyText className="text-gray-600 text-sm">
                {item.quantity}x {item.value.toLocaleString()} {item.type}
              </BodyText>
            </View>

            <View
              className={`px-3 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border border-white/20`}>
              <View className="flex-row items-center">
                <Ionicons
                  name={statusConfig.icon}
                  size={16}
                  color={statusConfig.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  className={`text-xs font-bold ${statusConfig.text} uppercase tracking-wide`}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="p-4 pt-3">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                Order ID
              </BodyText>
              <BodyText className="text-text font-mono text-sm">
                {item.orderId}
              </BodyText>
            </View>

            <View className="items-end">
              <BodyText className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                Total
              </BodyText>
              <BodyText className="text-text font-bold text-lg">
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

          <View className="border-t border-gray-200 pt-3">
            <TouchableOpacity
              onPress={() => openStatusModal(item)}
              className="bg-primary/10 border border-white/20  rounded-xl p-3 flex-row items-center justify-center">
              <Ionicons
                name="create-outline"
                size={20}
                color="#17d171"
                style={{ marginRight: 8 }}
              />
              <BodyText className="text-primary font-medium">
                Update Status
              </BodyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-backgroundSecondary">
      <Header Heading="Orders" Body="Manage user orders here" />

      <View className="px-4 mb-4">
        <BodyText className="text-text font-medium mb-2">
          Filter by Status
        </BodyText>
        <View className="bg-background border border-white/20 rounded-xl overflow-hidden shadow-sm">
          <Picker
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
            style={{
              color: "#061e14",
              height: 50,
            }}>
            <Picker.Item label="🔍 All Status" value="all" />
            <Picker.Item label="⏳ Pending" value="pending" />
            <Picker.Item label="⚙️ Processed" value="processed" />
            <Picker.Item label="✅ Completed" value="completed" />
            <Picker.Item label="❌ Cancelled" value="cancelled" />
            <Picker.Item label="⚠️ Failed" value="failed" />
          </Picker>
        </View>
      </View>

      <View className="px-4 mb-3">
        <BodyText className="text-gray-600 text-sm mb-2">
          {loading ? "Loading..." : `Showing ${filteredOrders.length} orders`}
        </BodyText>

        {!loading && selectedStatus === "all" && (
          <View className="flex-row flex-wrap gap-2">
            {["pending", "processed", "completed", "cancelled", "failed"].map(
              (status) => {
                const count = orders.filter((o) => o.status === status).length;
                const config = getStatusConfig(status as Orders["status"]);
                return count > 0 ? (
                  <View
                    key={status}
                    className={`px-2 py-1 rounded-lg ${config.bg} ${config.border} border flex-row items-center`}>
                    <Ionicons
                      name={config.icon}
                      size={12}
                      color={config.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text className={`text-xs font-medium ${config.text}`}>
                      {status}: {count}
                    </Text>
                  </View>
                ) : null;
              },
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchOrders(currentPage)}
            colors={["#17d171"]}
            tintColor="#17d171"
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-background p-8 rounded-2xl shadow-sm border border-gray-100 mx-4">
              <Ionicons
                name="bag-outline"
                size={64}
                color="#6B7280"
                style={{ alignSelf: "center", marginBottom: 16 }}
              />
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
      <PaginationControls
        onPressNext={handleNextPage}
        onPressPrevious={handlePrevPage}
        disabled={!hasNextPage}
        currentPage={currentPage}
      />
      <StatusUpdateModal />
    </View>
  );
};

export default OrdersPage;
