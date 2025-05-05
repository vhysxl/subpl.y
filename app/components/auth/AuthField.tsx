import {
  TextInput,
  Text,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";

interface AuthProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  name: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean
}

const AuthField = ({
  name,
  placeholder,
  value,
  setValue,
  keyboardType,
  autoCapitalize,
}: AuthProps) => {
  return (
    <>
      <Text className="text-white mb-2">{name}</Text>
      <TextInput
        value={value}
        className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-4"
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        keyboardType={keyboardType}
        onChangeText={setValue}
        autoCapitalize={autoCapitalize}
      />
    </>
  );
};

export default AuthField;
