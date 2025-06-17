import { View, FlatList, RefreshControl, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { fetchGames } from "@/lib/fetcher/gamesFetch";
import { Games } from "@/type";
import BodyText from "../components/extras/BodyText";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import Header from "../components/admin/Header";
import FailedMsg from "../components/extras/FailedMsg";
import AdminButton from "../components/admin/AdminButton";

const GamesPage = () => {
  const [games, setGames] = useState<Games[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSuperAdmin } = useAuthStore();
  const router = useRouter();

  const fetchGamesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGames();

      if (data && data.length > 0) {
        setGames(data);
      } else {
        setGames([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesData();
  }, []);

  const handleEdit = useCallback(
    (gameId: string) => {
      const gameData = games.find((g) => g.gameId === gameId);
      router.push({
        pathname: `/manage-games/edit-games/${gameId}`,
        params: {
          gameData: JSON.stringify(gameData),
        },
      });
    },
    [router, games],
  );

  const handleAddGame = () => {
    router.push("/manage-games/add-games/AddGames");
  };

  if (loading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <BodyText>Loading games...</BodyText>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <FailedMsg error={error} onPress={fetchGamesData} />
      </View>
    );

  return (
    <View className="flex-1 bg-background">
      <Header Heading="Games Management" Body="Manage your games here" />

      {isSuperAdmin && (
        <View className="px-4 mb-3">
          <AdminButton
            onPress={handleAddGame}
            title="+ Add New Game"
            type="normal"
            fullWidth={true}
          />
        </View>
      )}

      <View className="flex-1 px-4">
        <FlatList
          data={games}
          keyExtractor={(item: Games) => item.gameId}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchGamesData} />
          }
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-100 p-4 mb-3 rounded-xl shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="w-16 h-16 rounded-lg overflow-hidden mr-3 bg-gray-200 justify-center items-center">
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <BodyText className="text-gray-400 text-xs text-center">
                      No Image
                    </BodyText>
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <BodyText className="font-semibold text-gray-900 flex-1">
                      {item.name}
                    </BodyText>
                    {item.isPopular && (
                      <View className="bg-orange-100 px-2 py-1 rounded-lg ml-2">
                        <BodyText className="text-xs text-orange-600">
                          Popular
                        </BodyText>
                      </View>
                    )}
                  </View>

                  <BodyText className="text-gray-600 text-sm mb-1">
                    Currency: {item.currency}
                  </BodyText>

                  <BodyText className="text-gray-500 text-xs">
                    Game ID: {item.gameId}
                  </BodyText>
                </View>
              </View>

              {isSuperAdmin && (
                <AdminButton
                  onPress={() => handleEdit(item.gameId)}
                  title="Manage"
                />
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-20">
              <BodyText className="text-gray-500">No games found</BodyText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default GamesPage;
