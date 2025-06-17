import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Alert, FlatList, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProductStore } from "@/lib/stores/useProductStores";
import { DetailedProducts, Products } from "@/type";
import BodyText from "../components/extras/BodyText";
import AdminButton from "../components/admin/AdminButton";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import Header from "../components/admin/Header";
import FailedMsg from "../components/extras/FailedMsg";
import { useRouter } from "expo-router";
import { getUniqueGames } from "@/lib/common/getUnique";
import { deleteProduct } from "@/lib/fetcher/productFetch";

//update: pakai memoisasi
const ProductItem = React.memo(
  ({
    item,
    onEdit,
    onDelete,
  }: {
    item: DetailedProducts;
    onEdit: (id: string) => void;
    onDelete: (product: Products) => void;
  }) => (
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
            {item.value?.toLocaleString()} {item.currency}
          </BodyText>
          <BodyText className="text-gray-600 text-sm mb-1">
            Rp {item.price?.toLocaleString()}
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
                item.type === "topup" ? "text-blue-600" : "text-green-600"
              }`}>
              {item.type?.toUpperCase()}
            </BodyText>
          </View>
          {item.status && (
            <View className="px-2 py-1 rounded mb-2 bg-gray-200">
              <BodyText
                className={`text-xs font-medium ${
                  item.status === "available" ? "text-gray-700" : "text-red-500"
                }`}>
                {item.status.toUpperCase()}
              </BodyText>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row flex-1 gap-2">
        <AdminButton
          onPress={() => onEdit(item.productId || "")}
          title="Edit"
        />
        <AdminButton
          title="Delete"
          type="danger"
          onPress={() => onDelete(item)}
        />
      </View>
    </View>
  ),
);

const AdminProducts = () => {
  const { adminProducts, loading, error, fetchAdminProducts } =
    useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");
  const [visibleData, setVisibleData] = useState<DetailedProducts[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 15;
  const router = useRouter();

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const uniqueGames = useMemo(
    () => getUniqueGames(adminProducts),
    [adminProducts],
  );

  const filteredProducts = useMemo(() => {
    return adminProducts.filter((product) => {
      const matchesSearch =
        product.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.gameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.currency.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || product.type === filterType;
      const matchesGame =
        selectedGame === "all" || product.gameId === selectedGame;

      return matchesSearch && matchesType && matchesGame;
    });
  }, [adminProducts, searchQuery, filterType, selectedGame]);

  useEffect(() => {
    const initialData = filteredProducts.slice(0, itemsPerPage);
    setVisibleData(initialData);
  }, [filteredProducts, itemsPerPage]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || visibleData.length >= filteredProducts.length) {
      return;
    }

    setIsLoadingMore(true);
    setTimeout(() => {
      const currentLength = visibleData.length;
      const nextData = filteredProducts.slice(0, currentLength + itemsPerPage);
      setVisibleData(nextData);
      setIsLoadingMore(false);
    }, 300);
  }, [filteredProducts, visibleData.length, itemsPerPage, isLoadingMore]);

  const handleAddProduct = useCallback(() => {
    router.push("/manage-products/add-products/AddProducts");
  }, [router]);

  const handleEditProduct = useCallback(
    (productId: string) => {
      router.push(`/manage-products/edit-products/${productId}`);
    },
    [router],
  );

  const handleDeleteProduct = useCallback(
    (product: Products) => {
      Alert.alert(
        "Delete Product",
        `Are you sure you want to delete ${product.gameName} - ${product.value} ${product.currency}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteProduct(product.productId);
              fetchAdminProducts(true);
            },
          },
        ],
      );
    },
    [fetchAdminProducts],
  );

  const handleRefresh = useCallback(() => {
    fetchAdminProducts(true);
  }, [fetchAdminProducts]);

  const keyExtractor = useCallback(
    (item: DetailedProducts, index: number) =>
      `${item.productId || item.gameId}-${item.value}-${index}`,
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: DetailedProducts }) => (
      <ProductItem
        item={item}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    ),
    [handleEditProduct, handleDeleteProduct],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="flex-1 justify-center items-center py-20">
        <BodyText className="text-gray-500">No products found</BodyText>
      </View>
    ),
    [],
  );

  // Loading footer untuk lazy loading
  const ListFooterComponent = useCallback(() => {
    if (!isLoadingMore || visibleData.length >= filteredProducts.length) {
      return null;
    }
    return (
      <View className="py-4 items-center">
        <BodyText className="text-gray-500">Loading more...</BodyText>
      </View>
    );
  }, [isLoadingMore, visibleData.length, filteredProducts.length]);

  if (loading && adminProducts.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading...</BodyText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <FailedMsg error={error} onPress={fetchAdminProducts} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Header Heading="Product Management" Body="Manage your products here" />

      <AdminSearchBar
        placeholder="Search by game name, ID, or currency"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <View className="px-4 mb-4">
        <View className="flex-row gap-3">
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

      <View className="px-4 mb-4 gap-2 flex-row">
        <AdminButton onPress={handleAddProduct} title="Add new Product" />
      </View>

      <View className="flex-1 px-4">
        <BodyText className="text-gray-600 text-sm mb-3">
          Showing {visibleData.length} of {filteredProducts.length} products
        </BodyText>

        <FlatList
          data={visibleData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true} 
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50} 
          windowSize={10} 
          initialNumToRender={itemsPerPage} 
          getItemLayout={undefined}
        />
      </View>
    </View>
  );
};

export default AdminProducts;
