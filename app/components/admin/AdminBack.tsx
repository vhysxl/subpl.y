import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import BodyText from "../extras/BodyText";
import HeadingText from "../extras/HeadingText";
import { useRouter } from "expo-router";

interface AdminBackProps {
  heading: string;
}

const AdminBack = ({ heading }: AdminBackProps) => {
  const router = useRouter();

  return (
    <View className="px-4 pt-12 pb-4 bg-background border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 p-2 rounded-lg">
          <BodyText>← Back</BodyText>
        </TouchableOpacity>
        <HeadingText className="text-lg">{heading}</HeadingText>
        <View className="w-16" />
      </View>
    </View>
  );
};

export default AdminBack;
