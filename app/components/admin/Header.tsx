import { View, Text } from "react-native";
import React from "react";
import HeadingText from "../extras/HeadingText";
import BodyText from "../extras/BodyText";

interface HeaderProps {
  Heading: string;
  Body: string;
}

const Header = ({ Heading, Body }: HeaderProps) => {
  return (
    <View className="px-4 pt-4 pb-2">
      <HeadingText className="text-text">{Heading}</HeadingText>
      <BodyText className="text-gray-500 mt-1">{Body}</BodyText>
    </View>
  );
};

export default Header;
