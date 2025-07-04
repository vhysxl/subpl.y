import { View, TextInput } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface SearchProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit?: () => void;
}

const SearchBar = ({ value, setValue, onSubmit }: SearchProps) => {
  return (
    <View className="bg-background border border-border rounded-full flex-row items-center px-4 py-3">
      <Ionicons name="search-outline" size={20} color={colors.primary} />
      <TextInput
        className="pl-2 flex-1"
        placeholder="Search games..."
        placeholderTextColor="#9CA3AF"
        style={{ fontFamily: "Nunito Regular" }}
        value={value}
        onChangeText={setValue}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

export default SearchBar;
