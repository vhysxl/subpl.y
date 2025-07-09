import { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { handleGameRedirect } from "@/lib/common/gameRedirect";
import { GameGroup } from "@/type";
import BodyText from "../ui/BodyText";

const GameGridItem = ({ game }: { game: GameGroup }) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleGamePress = () => {
    handleGameRedirect(game.gameId, router, setIsRedirecting);
  };

  return (
    <TouchableOpacity
      key={game.gameId}
      disabled={isRedirecting}
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
export default GameGridItem;
