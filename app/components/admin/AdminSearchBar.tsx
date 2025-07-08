import { View, TextInput, TouchableOpacity } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import BodyText from "../ui/BodyText";

interface AdminSearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  onPress?: () => void;
}

const AdminSearchBar = ({
  placeholder,
  value,
  onChangeText,
  onPress,
}: AdminSearchBarProps) => {
  return (
    <View className="bg-white border flex-row mb-2 mx-4 border-gray-200 rounded-xl px-4 py-3 shadow-sm items-center">
      <View className="flex-1 mr-2">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="text-gray-900 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-primary px-4 py-2 rounded-xl">
        <BodyText className="text-text font-semibold">Search</BodyText>
      </TouchableOpacity>
    </View>
  );
};

export default AdminSearchBar;
