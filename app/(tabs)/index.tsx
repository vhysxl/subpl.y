import { SafeAreaView, View, Text, ScrollView } from "react-native";
import Header from "../components/Header";
import Hero from "../components/home/Hero";
import SerachBar from "../components/home/SerachBar";
import FeaturedGames from "../components/home/FeaturedGames";
import QuickTopup from "../components/home/QuickTopup";
import { Zap } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <Header />

      <ScrollView className="flex-1">
        <View className="px-4 pt-6 pb-8">
          {/* Hero Section */}
          <Hero />

          {/* Search Bar */}
          <SerachBar />
        </View>

        {/* Featured Games */}
        {/* Topup Options */}
        <View className="px-4 mb-6">
          <View className="bg-black rounded-xl p-4 border border-zinc-700">
            <View className="flex-row items-center mb-4">
              <View className="mt-1">
                <Zap color="yellow" fill={"yellow"} size={18} />
              </View>
              <Text className="text-white text-lg font-medium pl-2">
                Quick Topup
              </Text>
            </View>

            <QuickTopup />
          </View>
        </View>

        {/* Promo Banner */}
        {/* <View className="px-4 mb-6">
          <View className="bg-zinc-800 rounded-xl p-5 border border-white/10">
            <Text className="text-white font-bold text-lg mb-1">
              Weekend Special
            </Text>
            <Text className="text-zinc-300 mb-3">
              Get 25% extra credits on all purchases
            </Text>
            <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-lg">
              <Text className="text-black font-medium">Get Now</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>

      {/* Bottom Navigation */}
    </SafeAreaView>
  );
}
