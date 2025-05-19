import { View, Text } from "react-native";
import React from "react";
import BodyText from "../extras/BodyText";

interface UserDetailsProps {
  data?: string;
  label: string;
  createdAt?: Date | null;
}

const UserDetails = ({ label, data, createdAt }: UserDetailsProps) => {
  return (
    <View className="flex-row justify-between p-2">
      <BodyText className=" text-text">{label}</BodyText>
      {createdAt ? (
        <Text className="text-base text-text font-semibold">
          {createdAt.toLocaleDateString("id-ID")}
        </Text>
      ) : (
        <Text className="text-base text-text font-semibold">
          {data || "Not set"}
        </Text>
      )}
    </View>
  );
};

export default UserDetails;
