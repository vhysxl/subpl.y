import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { GameCarouselProps } from "@/type";
import SubHeadingText from "../extras/SubHeadingText";
import BodyText from "../extras/BodyText";

const GameCarousel = ({ title, icon, data }: GameCarouselProps) => {
  return (
    <View className="px-4 mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className={`p-2 rounded-lg`}>{icon}</View>
          <SubHeadingText className={`text-lg font-medium  text-text`}>
            {title}
          </SubHeadingText>
        </View>
        <TouchableOpacity
          className={`px-3 py-1 rounded-full bg-primary border border-text`}>
          <BodyText className={`text-text text-xs font-medium`}>
            View All
          </BodyText>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((game) => (
          <TouchableOpacity key={game.gameId} className="mr-4">
            <View
              className={`w-[120px] h-[160px] rounded-lg overflow-hidden border border-black`}>
              <Image
                source={{ uri: game.imageUrl }}
                className="w-full h-full"
              />
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <BodyText className="text-background text-sm font-medium">
                  {game.gameName}
                </BodyText>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity className="mr-4">
          <View
            className={`w-[80px] h-[160px] rounded-lg border border-dashed border-border bg-primary justify-center items-center`}>
            <BodyText className={`text-text font-medium`}>See All</BodyText>
            <BodyText className={`text-text`}>→</BodyText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default GameCarousel;
