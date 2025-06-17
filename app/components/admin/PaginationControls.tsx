import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import BodyText from "../extras/BodyText";

interface PaginationControlsProps {
  onPressNext: () => void;
  onPressPrevious: () => void;
  disabled: boolean;
  currentPage: number;
}

const PaginationControls = ({
  onPressNext,
  onPressPrevious,
  disabled,
  currentPage,
}: PaginationControlsProps) => {
  return (
    <View className="px-4 py-3 bg-background border-t border-gray-100">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={onPressPrevious}
          disabled={currentPage === 1}
          className={`flex-row items-center px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-100" : "bg-gray-800"
          }`}>
          <BodyText
            className={`text-sm ${
              currentPage === 1 ? "text-gray-400" : "text-white"
            }`}>
            ← Previous
          </BodyText>
        </TouchableOpacity>

        <View className="flex-row items-center space-x-2">
          <BodyText className="text-sm text-gray-600">
            Page {currentPage}
          </BodyText>
        </View>

        <TouchableOpacity
          onPress={onPressNext}
          disabled={disabled}
          className={`flex-row items-center px-4 py-2 rounded-lg ${
            disabled ? "bg-gray-100" : "bg-gray-800"
          }`}>
          <BodyText
            className={`text-sm ${disabled ? "text-gray-400" : "text-white"}`}>
            Next →
          </BodyText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaginationControls;
