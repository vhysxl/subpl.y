import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import BodyText from "../extras/BodyText";

type MessageType = "normal" | "danger" | "secondary";

interface AdminButtonProps {
  onPress: () => void;
  title: string;
  type?: MessageType;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const typeStyles: Record<MessageType, { container: string; text: string }> = {
  normal: {
    container: "bg-primary border border-blue-600",
    text: "text-white font-medium",
  },
  danger: {
    container: "bg-red-600 border border-red-700",
    text: "text-white font-medium",
  },
  secondary: {
    container: "bg-gray-500 border border-gray-600",
    text: "text-white font-medium",
  },
};

const AdminButton = ({
  onPress,
  title,
  type = "normal",
  fullWidth = false,
  disabled = false,
  loading = false,
}: AdminButtonProps) => {
  const { container, text } = typeStyles[type];

  const baseStyles = `${container} px-4 py-3 rounded-lg flex-1 ${
    disabled ? "opacity-50" : ""
  }`;

  return (
    <View className={`flex-row ${fullWidth ? "w-full" : "w-2/4"} self-end`}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={baseStyles}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <BodyText className={`text-center text-sm ${text}`}>{title}</BodyText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AdminButton;
