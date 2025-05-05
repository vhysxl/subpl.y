import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";

const Header = () => {
  return (
    <View className="px-4 py-5 border-b border-zinc-800 flex-row justify-between items-center">
      <Text className="text-white font-bold text-2xl">SUBPL.Y</Text>
      <View className="flex-row">
        <TouchableOpacity>
          <Bell className="pr-4" size={24} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
