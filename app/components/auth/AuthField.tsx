import {
  TextInput,
  Text,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import BodyText from "../extras/BodyText";

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
  return (
    <>
      <BodyText className="text-text mb-2">{name}</BodyText>
      <TextInput
        value={value}
        className="bg-backgroundSecondary text-neutral-500 px-4 py-3 mb-4 border border-border shadow-sm"
        placeholder={placeholder}
        placeholderTextColor="#747574"
        keyboardType={keyboardType}
        onChangeText={setValue}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={{ fontFamily: "Nunito Regular" }}
      />
    </>
  );
};

export default AuthField;
