import { TouchableOpacity, View, Image } from "react-native";
import BodyText from "../extras/BodyText";
import { colors } from "@/constants/colors";
import { GameGroup } from "@/type";
import { useRouter } from "expo-router";

// Komponen Grid
export const GameGridItem = ({ game }: { game: GameGroup }) => {
  const router = useRouter();

  const handleGamePress = () => {
    router.push(`/game/${game.gameId}`);
  };

  return (
    <TouchableOpacity
      key={game.gameId}
      onPress={handleGamePress}
      className="mb-4 border border-secondary/30 rounded-lg"
      style={{ width: "48%" }}>
      <View className="rounded-lg overflow-hidden">
        <Image
          source={{ uri: game.imageUrl }}
          style={{ width: "100%", aspectRatio: 1, resizeMode: "cover" }}
        />
        {game.isPopular && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: colors.accent,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 4,
            }}>
            <BodyText style={{ color: "white", fontSize: 10 }}>
              Popular
            </BodyText>
          </View>
        )}
        <View className="p-2">
          <BodyText
            className="font-semibold"
            style={{ color: colors.text }}
            numberOfLines={1}>
            {game.gameName}
          </BodyText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Komponen List
export const GameListItem = ({ game }: { game: GameGroup }) => {
  const router = useRouter();

  const handleGamePress = () => {
    router.push(`/game/${game.gameId}`);
  };

  return (
    <TouchableOpacity
      key={game.gameId}
      onPress={handleGamePress}
      className="mb-3">
      <View
        className="flex-row rounded-lg overflow-hidden"
        style={{
          borderWidth: 1,
          borderColor: colors.secondary + "30",
        }}>
        <Image
          source={{ uri: game.imageUrl }}
          style={{ width: 80, height: 80, resizeMode: "cover" }}
        />
        <View className="p-3 flex-1 justify-center">
          <View className="flex-row justify-between items-start">
            <BodyText
              className="font-semibold"
              style={{ color: colors.text, flex: 1 }}
              numberOfLines={1}>
              {game.gameName}
            </BodyText>
            {game.isPopular && (
              <View
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 4,
                  marginLeft: 8,
                }}>
                <BodyText
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                  Popular
                </BodyText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
