import {
  TextInput,
  KeyboardTypeOptions,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import BodyText from "../extras/BodyText";
import { Ionicons } from "@expo/vector-icons"; // atau icon library lain

interface AuthProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  name: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
}

const AuthField = ({
  name,
  placeholder,
  value,
  setValue,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
}: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <BodyText className="text-text mb-2">{name}</BodyText>
      <View className="relative">
        <TextInput
          value={value}
          className="bg-backgroundSecondary text-neutral-500 px-4 py-3 mb-4 border border-border shadow-sm"
          placeholder={placeholder}
          placeholderTextColor="#747574"
          keyboardType={keyboardType}
          onChangeText={setValue}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !showPassword}
          style={{ fontFamily: "Nunito Regular" }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-3 top-3"
            style={{ padding: 4 }}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#747574"
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default AuthField;
