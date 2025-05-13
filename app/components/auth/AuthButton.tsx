import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import HeadingText from "../extras/HeadingText";

interface AuthButtonProps {
  isLoading: boolean;
  onPress: () => void;
  text: string;
}

const AuthButton = ({ isLoading, onPress, text }: AuthButtonProps) => {
  return (
    <>
      {isLoading ? (
        <ActivityIndicator color={"black"} />
      ) : (
        <TouchableOpacity
          className="bg-primary rounded-full border border-border py-3 mt-4 items-center mb-4"
          disabled={isLoading}
          onPress={onPress}>
          <HeadingText className="text-white" style={{ fontSize: 17 }}>
            {text}
          </HeadingText>
        </TouchableOpacity>
      )}
    </>
  );
};

export default AuthButton;
