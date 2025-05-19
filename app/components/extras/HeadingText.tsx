import { Text, TextProps, StyleSheet } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  base: {
    fontFamily: "Fredoka SemiBold",
  },
});

const HeadingText = ({ style, ...props }: TextProps) => {
  return <Text style={[styles.base, style]} {...props} />;
};

export default HeadingText;
