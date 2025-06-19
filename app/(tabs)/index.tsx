import {
  SafeAreaView,
  Image,
  View,
  Text,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import Header from "../components/Header";
import QuickTopup from "../components/home/QuickTopup";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import GameCarousel from "../components/home/GameCarousel";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import HeadingText from "../components/extras/HeadingText";
import { useProductStore } from "@/lib/stores/useProductStores";
import BodyText from "../components/extras/BodyText";
import { GameGroup } from "@/type";
import FailedMsg from "../components/extras/FailedMsg";
import { fetchConfig } from "@/lib/fetcher/configFetch";

export default function Index() {
  const { user, isAdmin, isSuperAdmin } = useAuthStore();
  const router = useRouter();
  const { products, loading, error, fetchProducts } = useProductStore(); //zustand
  const [popularGames, setPopularGames] = useState<GameGroup[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchConfig();
      await fetchProducts();
    } catch (error) {
      console.error("Failed refresh config:", error);
      return;
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Back Handler
  useEffect(() => {
    //back to home handler
    const backAction = () => {
      router.replace("/");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //productsFilter
  useEffect(() => {
    const popularGames = products.filter((game) => game.isPopular === true);
    setPopularGames(popularGames);
  }, [products]);

  //searchHandler
  const handleSearchGames = () => {
    router.push({
      pathname: "/games",
      params: { query },
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    if (isAdmin || isSuperAdmin) {
      router.replace("/admin/home");
    }
  }, [isAdmin, isSuperAdmin, isMounted]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {/* Welcome Message */}
        <View className="px-4 py-3">
          {user ? (
            <HeadingText className="text-xl text-text">
              Welcome back,{" "}
              <HeadingText className="text-secondary">
                {user.name.split(" ")[0] || "Gamer"}
              </HeadingText>
            </HeadingText>
          ) : (
            <View className="flex-row justify-between items-center">
              <HeadingText
                className="text-xl font-semibold"
                style={{ color: colors.text }}>
                Welcome to SUBPL.Y
              </HeadingText>
            </View>
          )}
        </View>

        {/* Hero Section update jadi flatlist */}
        <View className="px-4 mt-4 pb-4">
          <View
            className="rounded-xl overflow-hidden"
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
            }}>
            <Image
              source={require("../../assets/images/HomePageIllust.jpg")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
              <Text className="text-white text-xl font-bold">
                Game Credits Instantly
              </Text>
              <Text className="text-white text-sm mt-1">
                Fast, secure topups for your favorite games
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-6 py-4">
          <SearchBar
            setValue={setQuery}
            value={query}
            onSubmit={handleSearchGames}
          />
        </View>

        {/* Featured Games */}
        <View className="space-y-2 border-border border-y border-dashed bg-backgroundSecondary py-4">
          {loading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color={colors.accent} />
              <BodyText className="text-text mt-3 text-center">
                Loading popular games...
              </BodyText>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-8">
              <FailedMsg error={error} onPress={fetchProducts} />
            </View>
          ) : (
            <GameCarousel
              title="Popular Games"
              icon={
                <Ionicons
                  name="trending-up-outline"
                  size={18}
                  color={colors.accent}
                />
              }
              data={popularGames}
            />
          )}
          {/* New Games */}
          {/* <GameCarousel
    title="New Games"
    icon={<Clock size={18} color={colors.secondary} />}
    data={newGames}
  /> */}
        </View>

        {/* Quick Topup Section */}
        <View className="px-4 mb-6 py-10 bg-primary">
          <View className="bg-backgroundSecondary rounded-lg p-4 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="flash-outline"
                  size={22}
                  color={colors.border}
                />
                <HeadingText className="text-text text-2xl pl-2">
                  Quick Topup
                </HeadingText>
              </View>
            </View>
            <QuickTopup />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
