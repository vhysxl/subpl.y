import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface IndicatorProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: "pending" | "processing" | "completed";
  currentStatus: "pending" | "processing" | "completed";
  activeColor: string;
  onPress: () => void;
}

const Indicator = ({
  label,
  icon,
  value,
  currentStatus,
  activeColor,
  onPress,
}: IndicatorProps) => {
  const isActive = currentStatus === value; //(true / false)

  return (
    <TouchableOpacity className="items-center" onPress={onPress}>
      <Ionicons name={icon} size={32} color={isActive ? activeColor : "#ccc"} />
      <Text
        className={`font-semibold mt-1 ${
          isActive ? "text-text" : "text-text/60"
        }`}>
        {label}
      </Text>
      {isActive && <View className="h-1 w-16 bg-primary rounded-full mt-2" />}
    </TouchableOpacity>
  );
};

export default Indicator;
