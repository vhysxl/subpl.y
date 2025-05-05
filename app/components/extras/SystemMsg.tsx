import { View, Text } from "react-native";
import React from "react";

type MessageType = "normal" | "error" | "success";

interface Props {
  message: string;
  type?: MessageType;
}

const typeStyles: Record<MessageType, { container: string; text: string }> = {
  normal: {
    container: "bg-gray-100 border border-gray-300",
    text: "text-gray-700 font-bold",
  },
  error: {
    container: "bg-red-100 border border-red-400",
    text: "text-red-700 font-bold",
  },
  success: {
    container: "bg-green-100 border border-green-400",
    text: "text-green-700 font-bold",
  },
};

const SystemMsg = ({ message, type = "normal" }: Props) => {
  if (!message) return null;

  const style = typeStyles[type];

  return (
    <View className="flex-row justify-center -mt-2 mb-2">
      <View
        className={`rounded-md px-3 py-3 mb-2 my-2 shadow-sm ${style.container}`}>
        <Text className={`text-center  text-sm ${style.text}`}>{message}</Text>
      </View>
    </View>
  );
};

export default SystemMsg;
