import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Switch,
  FlatList,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProductStore } from "@/lib/stores/useProductStores";
import { Products, GameGroup } from "@/type";
import { colors } from "@/constants/colors";
import BodyText from "../components/extras/BodyText";
import AdminButton from "../components/admin/AdminButton";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import Header from "../components/admin/Header";
import FailedMsg from "../components/extras/FailedMsg";

interface NewProduct {
  type: string;
  value: number;
  price: number;
  gameId: string;
  gameName: string;
  isPopular: boolean;
  stock?: number;
  currency: string;
  imageUrl: string;
}

const AdminProducts = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");

  // Form states untuk add/edit product
  const [formData, setFormData] = useState<NewProduct>({
    type: "topup",
    value: 0,
    price: 0,
    gameId: "",
    gameName: "",
    isPopular: false,
    stock: 0,
    currency: "Diamonds",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Flatten all products dari semua games
  const allProducts: Products[] =
    products?.flatMap((gameGroup) =>
      gameGroup.products.map((product) => ({
        ...product,
        gameName: gameGroup.gameName,
        isPopular: gameGroup.isPopular,
        imageUrl: gameGroup.imageUrl,
      })),
    ) || [];

  // Get unique games untuk filter
  const uniqueGames =
    products?.map((gameGroup) => ({
      gameId: gameGroup.gameId,
      gameName: gameGroup.gameName,
    })) || [];

  // Filter products berdasarkan search, type, dan game
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.gameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.currency.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || product.type === filterType;
    const matchesGame =
      selectedGame === "all" || product.gameId === selectedGame;

    return matchesSearch && matchesType && matchesGame;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "topup",
      value: 0,
      price: 0,
      gameId: "",
      gameName: "",
      isPopular: false,
      stock: 0,
      currency: "Diamonds",
      imageUrl: "",
    });
    setEditMode(false);
    setSelectedProduct(null);
  };

  // Handle add product
  const handleAddProduct = () => {
    resetForm();
    setModalVisible(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Products) => {
    setFormData({
      type: product.type,
      value: product.value,
      price: product.price,
      gameId: product.gameId,
      gameName: product.gameName,
      isPopular: product.isPopular,
      stock: product.stock || 0,
      currency: product.currency,
      imageUrl: product.imageUrl,
    });
    setSelectedProduct(product);
    setEditMode(true);
    setModalVisible(true);
  };

  // Handle save product
  const handleSaveProduct = async () => {
    // Validasi form
    if (
      !formData.gameName ||
      !formData.gameId ||
      formData.value <= 0 ||
      formData.price <= 0
    ) {
      Alert.alert("Error", "Please fill all required fields with valid values");
      return;
    }

    try {
      if (editMode) {
        console.log("Updating product:", formData);
        Alert.alert("Success", "Product updated successfully");
      } else {
        console.log("Adding new product:", formData);
        Alert.alert("Success", "Product added successfully");
      }

      setModalVisible(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      Alert.alert("Error", "Failed to save product");
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product: Products) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete ${product.gameName} - ${product.value} ${product.currency}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Deleting product:", product);
              Alert.alert("Success", "Product deleted successfully");
              fetchProducts();
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ],
    );
  };

  // Product Form Modal
  const ProductFormModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        resetForm();
      }}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 max-h-5/6 rounded-xl p-6 shadow-lg">
          <ScrollView showsVerticalScrollIndicator={false}>
            <BodyText className="text-gray-900 text-xl font-bold mb-4">
              {editMode ? "Edit Product" : "Add New Product"}
            </BodyText>

            {/* Game Selection untuk new product */}
            {!editMode && (
              <View className="mb-4">
                <BodyText className="text-gray-700 font-medium mb-2">
                  Select Game
                </BodyText>
                <View className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                  <Picker
                    style={{ color: colors.text }}
                    selectedValue={formData.gameId}
                    onValueChange={(value) => {
                      const selectedGameData = uniqueGames.find(
                        (game) => game.gameId === value,
                      );
                      if (selectedGameData) {
                        setFormData({
                          ...formData,
                          gameId: value,
                          gameName: selectedGameData.gameName,
                        });
                      }
                    }}>
                    <Picker.Item label="Select a game..." value="" />
                    {uniqueGames.map((game) => (
                      <Picker.Item
                        key={game.gameId}
                        label={game.gameName}
                        value={game.gameId}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Game Name */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Game Name *
              </BodyText>
              <TextInput
                className={`bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900 ${
                  editMode ? "opacity-50" : ""
                }`}
                placeholder="Enter game name"
                placeholderTextColor="#9CA3AF"
                value={formData.gameName}
                onChangeText={(text) =>
                  setFormData({ ...formData, gameName: text })
                }
                editable={!editMode}
              />
            </View>

            {/* Game ID */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Game ID *
              </BodyText>
              <TextInput
                className={`bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900 ${
                  editMode ? "opacity-50" : ""
                }`}
                placeholder="Enter game ID"
                placeholderTextColor="#9CA3AF"
                value={formData.gameId}
                onChangeText={(text) =>
                  setFormData({ ...formData, gameId: text })
                }
                editable={!editMode}
              />
            </View>

            {/* Type */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Product Type *
              </BodyText>
              <View className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                <Picker
                  style={{ color: "#1F2937" }}
                  selectedValue={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }>
                  <Picker.Item label="Top Up" value="topup" />
                  <Picker.Item label="Voucher" value="voucher" />
                </Picker>
              </View>
            </View>

            {/* Value */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Value *
              </BodyText>
              <TextInput
                className="bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900"
                placeholder="Enter value"
                placeholderTextColor="#9CA3AF"
                value={formData.value.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, value: parseInt(text) || 0 })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Currency */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Currency *
              </BodyText>
              <TextInput
                className="bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900"
                placeholder="e.g., Diamonds, UC, Coins"
                placeholderTextColor="#9CA3AF"
                value={formData.currency}
                onChangeText={(text) =>
                  setFormData({ ...formData, currency: text })
                }
              />
            </View>

            {/* Price */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Price (IDR) *
              </BodyText>
              <TextInput
                className="bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900"
                placeholder="Enter price in IDR"
                placeholderTextColor="#9CA3AF"
                value={formData.price.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: parseInt(text) || 0 })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Stock (for vouchers) */}
            {formData.type === "voucher" && (
              <View className="mb-4">
                <BodyText className="text-gray-700 font-medium mb-2">
                  Stock
                </BodyText>
                <TextInput
                  className="bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900"
                  placeholder="Enter stock quantity"
                  placeholderTextColor="#9CA3AF"
                  value={formData.stock?.toString() || ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, stock: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Image URL */}
            <View className="mb-4">
              <BodyText className="text-gray-700 font-medium mb-2">
                Image URL
              </BodyText>
              <TextInput
                className="bg-gray-50 border border-gray-100 py-3 px-4 rounded-lg text-gray-900"
                placeholder="Enter image URL"
                placeholderTextColor="#9CA3AF"
                value={formData.imageUrl}
                onChangeText={(text) =>
                  setFormData({ ...formData, imageUrl: text })
                }
                multiline
              />
            </View>

            {/* Is Popular */}
            <View className="mb-6 flex-row items-center justify-between">
              <BodyText className="text-gray-700 font-medium">
                Mark as Popular Game
              </BodyText>
              <Switch
                value={formData.isPopular}
                onValueChange={(value) =>
                  setFormData({ ...formData, isPopular: value })
                }
                trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                thumbColor={formData.isPopular ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 py-3 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}>
                <BodyText className="text-gray-600 text-center font-medium">
                  Cancel
                </BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-gray-800 py-3 rounded-lg"
                onPress={handleSaveProduct}>
                <BodyText className="text-white text-center font-medium">
                  {editMode ? "Update" : "Add"} Product
                </BodyText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading...</BodyText>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <FailedMsg error={error} onPress={fetchProducts} />
      </View>
    );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <Header
        Heading="Product Management"
        Body="Manage your game products here"
      />

      {/* Search Bar */}
      <AdminSearchBar
        placeholder="Search by game name, ID, or currency"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Filters */}
      <View className="px-4 mb-4">
        <View className="flex-row gap-3">
          {/* Game Filter */}
          <View className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden">
            <Picker
              style={{ color: "#1F2937" }}
              selectedValue={selectedGame}
              onValueChange={(value) => setSelectedGame(value)}>
              <Picker.Item label="All Games" value="all" />
              {uniqueGames.map((game) => (
                <Picker.Item
                  key={game.gameId}
                  label={game.gameName}
                  value={game.gameId}
                />
              ))}
            </Picker>
          </View>

          {/* Type Filter */}
          <View className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden">
            <Picker
              style={{ color: "#1F2937" }}
              selectedValue={filterType}
              onValueChange={(value) => setFilterType(value)}>
              <Picker.Item label="All Types" value="all" />
              <Picker.Item label="Top Up" value="topup" />
              <Picker.Item label="Voucher" value="voucher" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Add Product Button */}
      <View className="px-4 mb-4">
        <TouchableOpacity
          className="bg-gray-800 py-3 rounded-lg"
          onPress={handleAddProduct}>
          <BodyText className="text-white text-center font-medium">
            Add New Product
          </BodyText>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <View className="flex-1 px-4">
        <BodyText className="text-gray-600 text-sm mb-3">
          Showing {filteredProducts.length} products
        </BodyText>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) =>
            `${item.gameId}-${item.value}-${index}`
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchProducts} />
          }
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-100 p-4 mb-3 rounded-xl shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <BodyText className="font-semibold text-gray-900 mr-2">
                      {item.gameName}
                    </BodyText>
                    {item.isPopular && (
                      <View className="bg-yellow-100 px-2 py-1 rounded">
                        <BodyText className="text-yellow-600 text-xs font-medium">
                          Popular
                        </BodyText>
                      </View>
                    )}
                  </View>
                  <BodyText className="text-blue-600 text-lg font-bold mb-1">
                    {item.value.toLocaleString()} {item.currency}
                  </BodyText>
                  <BodyText className="text-gray-600 text-sm mb-1">
                    Rp {item.price.toLocaleString()}
                  </BodyText>
                  <BodyText className="text-gray-500 text-xs">
                    ID: {item.gameId}
                  </BodyText>
                </View>

                <View className="items-end">
                  <View
                    className={`px-2 py-1 rounded mb-2 ${
                      item.type === "topup" ? "bg-blue-100" : "bg-green-100"
                    }`}>
                    <BodyText
                      className={`text-xs font-medium ${
                        item.type === "topup"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}>
                      {item.type.toUpperCase()}
                    </BodyText>
                  </View>

                  {item.type === "voucher" && item.stock !== undefined && (
                    <BodyText className="text-gray-500 text-xs">
                      Stock: {item.stock}
                    </BodyText>
                  )}
                </View>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1">
                  <AdminButton
                    onPress={() => handleEditProduct(item)}
                    title="Edit"
                  />
                  <AdminButton
                    title="Delete"
                    type="danger"
                    onPress={() => handleDeleteProduct(item)}
                  />
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-20">
              <BodyText className="text-gray-500">No products found</BodyText>
            </View>
          )}
        />
      </View>

      <ProductFormModal />
    </View>
  );
};

export default AdminProducts;
