import React, { useEffect, useState, useMemo } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProductStore } from "@/lib/stores/useProductStores";
import { DetailedProducts } from "@/type";
import { useRouter } from "expo-router";
import { getUniqueGames } from "@/lib/common/getUnique";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import PaginationControls from "@/app/components/admin/PaginationControls";
import BodyText from "@/app/components/ui/BodyText";
import AdminButton from "@/app/components/admin/AdminButton";
import AdminSearchBar from "@/app/components/admin/AdminSearchBar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import FailedMsg from "@/app/components/ui/FailedMsg";

const ProductItem = React.memo(
  ({
    item,
    isRedirecting,
    onEdit,
  }: {
    item: DetailedProducts;
    isRedirecting: boolean; // ✅ Tambah semicolon
    onEdit: (id: string) => void;
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
          disabled={isRedirecting}
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
  const [currentPage, setCurrentPage] = useState(1);
  const { isSuperAdmin } = useAuthStore();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const router = useRouter();

  const itemsPerPage = 15;

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const uniqueGames = useMemo(
    () => getUniqueGames(adminProducts),
    [adminProducts],
  );

  const filteredProducts = useMemo(() => {
    return adminProducts.filter((product) => {
      const matchesSearch = product.gameName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || product.type === filterType;
      const matchesGame =
        selectedGame === "all" || product.gameId === selectedGame;

      return matchesSearch && matchesType && matchesGame;
    });
  }, [adminProducts, searchQuery, filterType, selectedGame]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, selectedGame]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddProduct = () => {
    setIsRedirecting(true);
    router.push("/admin/manage/products/add/AddProducts");
    setTimeout(() => setIsRedirecting(false), 1000);
  };

  const handleEditProduct = (productId: string) => {
    setIsRedirecting(true);
    router.push(`/admin/manage/products/edit/${productId}`);
    setTimeout(() => setIsRedirecting(false), 1000);
  };

  const handleRefresh = () => {
    fetchAdminProducts(true);
  };

  const renderItem = ({ item }: { item: DetailedProducts }) => (
    <ProductItem
      isRedirecting={isRedirecting}
      item={item}
      onEdit={handleEditProduct}
    />
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 justify-center items-center py-20">
      <BodyText className="text-gray-500">No products found</BodyText>
    </View>
  );

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
      <AdminHeader Heading="Product Management" Body="Manage your products here" />

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

      {isSuperAdmin && (
        <View className="px-4 mb-4 gap-2 flex-row">
          <AdminButton
            onPress={handleAddProduct}
            disabled={isRedirecting}
            title="Add new Product"
          />
        </View>
      )}

      <View className="flex-1 px-4">
        <BodyText className="text-gray-600 text-sm mb-3">
          Showing {currentProducts.length} of {filteredProducts.length} products
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </BodyText>

        <FlatList
          data={currentProducts}
          keyExtractor={(item, index) => `${item.productId}-${index}`}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        />
      </View>

      {totalPages > 1 && (
        <PaginationControls
          onPressNext={handleNextPage}
          onPressPrevious={handlePrevPage}
          disabled={currentPage >= totalPages}
          currentPage={currentPage}
        />
      )}
    </View>
  );
};

export default AdminProducts;
