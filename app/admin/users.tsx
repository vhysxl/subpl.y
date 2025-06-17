import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { searchUser, userFetch } from "@/lib/fetcher/usersFetch";
import { User } from "@/type";
import BodyText from "../components/extras/BodyText";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { formatDate } from "@/lib/common/formatDate";
import Header from "../components/admin/Header";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import FailedMsg from "../components/extras/FailedMsg";
import AdminButton from "../components/admin/AdminButton";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSuperAdmin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setCurrentPage(1);
      fetchUsers(1);
    }
  }, [searchQuery]);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const data = await userFetch(page);

      if (data && data.length > 0) {
        setUsers(data);

        setHasNextPage(data.length >= 5);
      } else {
        setUsers([]);
        setHasNextPage(false);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();

    if (trimmed === "") {
      setCurrentPage(1);
      fetchUsers(1);
      return;
    }

    try {
      setLoading(true);
      const data = await searchUser(trimmed);
      setUsers(data);
      setHasNextPage(false);
    } catch (error: any) {
      setError(error.message || "Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: string) => {
    console.log(userId);
    router.push(`/edit-user/${userId}`);
  };

  if (loading && currentPage === 1)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading...</BodyText>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <FailedMsg error={error} onPress={() => fetchUsers(currentPage)} />
      </View>
    );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <Header Heading="Users Management" Body="Manage your users here" />

      {/* Search Bar */}
      <AdminSearchBar
        placeholder="Search by Name"
        onPress={handleSearch}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Users List */}
      <View className="flex-1 px-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <BodyText>Loading page {currentPage}...</BodyText>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item: User) => item.userId}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => fetchUsers(currentPage)}
              />
            }
            renderItem={({ item }) => (
              <View className="bg-white border border-gray-100 p-4 mb-3 rounded-xl shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <BodyText className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </BodyText>
                    <BodyText className="text-gray-600 text-sm mb-1">
                      {item.email}
                    </BodyText>
                    <BodyText className="text-gray-500 text-xs">
                      {formatDate(String(item.createdAt))}
                    </BodyText>
                  </View>

                  <View className="bg-gray-100 px-2 py-1 rounded-lg">
                    <BodyText className="text-xs text-gray-600">
                      {item.roles.join(", ")}
                    </BodyText>
                  </View>
                </View>
                {isSuperAdmin && (
                  <AdminButton
                    onPress={() => handleEdit(item.userId)}
                    title="Manage"
                  />
                )}
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center py-20">
                <BodyText className="text-gray-500">No users found</BodyText>
              </View>
            )}
          />
        )}
      </View>

      {/* Pagination Controls */}
      <View className="px-4 py-3 bg-background border-t border-gray-100">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex-row items-center px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-100" : "bg-gray-800"
            }`}>
            <BodyText
              className={`text-sm ${
                currentPage === 1 ? "text-gray-400" : "text-white"
              }`}>
              ← Previous
            </BodyText>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-2">
            <BodyText className="text-sm text-gray-600">
              Page {currentPage}
            </BodyText>
          </View>

          <TouchableOpacity
            onPress={handleNextPage}
            disabled={!hasNextPage}
            className={`flex-row items-center px-4 py-2 rounded-lg ${
              !hasNextPage ? "bg-gray-100" : "bg-gray-800"
            }`}>
            <BodyText
              className={`text-sm ${
                !hasNextPage ? "text-gray-400" : "text-white"
              }`}>
              Next →
            </BodyText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UsersPage;
