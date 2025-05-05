import { ScrollView, TouchableOpacity, View, Text } from "react-native";

interface Game {
  id: number;
  name: string;
  popular: boolean;
}

interface FeaturedGamesProps {
  games: Game[];
}

//tamabahin image nanti
const FeaturedGames = ({ games }: FeaturedGamesProps) => {
  return (
    <>
      <Text className="text-white text-lg font-medium mb-4">
        Featured Games
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2">
        {games.map((game) => (
          <TouchableOpacity key={game.id} className="mr-3">
            <View className="w-[110px] rounded-md overflow-hidden">
              <View className="w-full h-[110px] bg-zinc-800" />
              <View className="bg-zinc-900 p-2">
                <Text className="text-white">{game.name}</Text>
                {game.popular && (
                  <View className="bg-white/10 rounded-full px-2 py-0.5 mt-1 self-start">
                    <Text className="text-white text-xs">Popular</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default FeaturedGames;
