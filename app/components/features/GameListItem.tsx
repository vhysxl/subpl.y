import { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { handleGameRedirect } from "@/lib/common/gameRedirect";
import { GameGroup } from "@/type";
import BodyText from "../ui/BodyText";

const GameListItem = ({ game }: { game: GameGroup }) => {
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

export default GameListItem;
