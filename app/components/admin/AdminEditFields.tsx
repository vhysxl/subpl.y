import {
  View,
  TextInput,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import BodyText from "../ui/BodyText";

interface AdminEditFieldsProps {
  title: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
}

const AdminEditFields = ({
  title,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: AdminEditFieldsProps) => {
  return (
    <View className="mb-4">
      <BodyText className="text-gray-700 mb-2 font-medium">{title}</BodyText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
};

export default AdminEditFields;
