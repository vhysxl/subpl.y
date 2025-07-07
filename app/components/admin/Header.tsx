import { View, Text, Pressable } from "react-native";
import React from "react";
import HeadingText from "../extras/HeadingText";
import BodyText from "../extras/BodyText";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  Heading: string;
  Body: string;
}

const Header = ({ Heading, Body }: HeaderProps) => {
  const { logout } = useAuthStore();

  return (
    <View className="px-4 pt-4 pb-2 flex-row">
      <View>
        <HeadingText className="text-text">{Heading}</HeadingText>
        <BodyText className="text-gray-500 mt-1">{Body}</BodyText>
      </View>
      <View className="ml-auto justify-end">
        <Pressable
          onPress={() => {
            logout();
            router.replace("/auth/login");
          }}
          className="mt-auto py-3 rounded-xl items-center">
          <View className="flex-row gap-x-2 items-center">
            <Text className="text-red-600 font-bold text-base">Sign Out</Text>
            <Ionicons name="log-out-outline" size={28} color="red" />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
