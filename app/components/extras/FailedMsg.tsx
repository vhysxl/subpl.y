import { TouchableOpacity } from "react-native";
import React from "react";
import BodyText from "./BodyText";

interface FailedLoadProps {
  onPress: () => void;
  error: string;
}

const FailedMsg = ({ onPress, error }: FailedLoadProps) => {
  return (
    <>
      <BodyText className="text-red-400 text-center mb-2">{error}</BodyText>
      <TouchableOpacity
        className="mt-2 bg-primary px-6 py-2 rounded-lg"
        onPress={onPress}>
        <BodyText className="text-white">Retry</BodyText>
      </TouchableOpacity>
    </>
  );
};

export default FailedMsg;
