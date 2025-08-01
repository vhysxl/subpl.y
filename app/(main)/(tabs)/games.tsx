import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/constants/colors";
import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/stores/useProductStores";
import { GameGroup } from "@/type";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/app/components/ui/SearchBar";
import Header from "@/app/components/ui/Header";
import GameListItem from "@/app/components/features/GameListItem";
import GameGridItem from "@/app/components/features/GameGridItem";
import BodyText from "@/app/components/ui/BodyText";
import FailedMsg from "@/app/components/ui/FailedMsg";

export default function Games() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<GameGroup[]>([]);
  const params = useLocalSearchParams();
  const { products, fetchProducts, loading, error } = useProductStore();
  const { query } = params;

  useEffect(() => {
    if (query) {
      setSearchQuery(String(query));
    }
  }, [query]);

  // Filter games berdasarkan pencarian
  useEffect(() => {
    const filteredGames = products.filter((product) =>
      product.gameName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setGames(filteredGames);
  }, [products, searchQuery]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      <Header />

      <View className="px-4 mb-4">
        <SearchBar value={searchQuery} setValue={setSearchQuery} />
      </View>

      <View className="px-4 py-3 flex-row justify-between border-t border-b bg-backgroundSecondary border-border items-center mb-2">
        <BodyText className="text-text">
          {games.length} {games.length === 1 ? "game" : "games"} found
        </BodyText>

        <View className="flex-row">
          <TouchableOpacity
            className="mr-3"
            onPress={() => setViewMode("grid")}>
            <Ionicons
              name="grid-outline"
              size={22}
              color={viewMode === "grid" ? colors.primary : colors.text + "70"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode("list")}>
            <Ionicons
              name="list-outline"
              size={22}
              color={viewMode === "list" ? colors.primary : colors.text + "70"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : games.length > 0 ? (
          viewMode === "grid" ? (
            <View className="flex-row flex-wrap justify-between">
              {games.map((game) => (
                <GameGridItem key={game.gameId} game={game} />
              ))}
            </View>
          ) : (
            <View>
              {games.map((game) => (
                <GameListItem key={game.gameId} game={game} />
              ))}
            </View>
          )
        ) : error ? (
          <View className="items-center py-8 bg-background">
            <FailedMsg error="Failed to load games" onPress={fetchProducts} />
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <BodyText className="text-center text-text/70">
              No games found matching {searchQuery}
            </BodyText>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
