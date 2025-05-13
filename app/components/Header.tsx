import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import { colors } from "@/constants/colors";

const Header = () => {
  return (
    <View className="bg-background border-b border-white px-4 py-5 flex-row justify-between items-center">
      <Text
        className="text-primary text-2xl"
        style={{ fontFamily: "Fredoka SemiBold", fontSize: 25 }}>
        SUBPL.Y
      </Text>
      <View className="flex-row">
        <TouchableOpacity>
          <Bell size={24} color={colors.secondary} className="pr-4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
