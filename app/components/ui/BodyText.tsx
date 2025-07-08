import { Text, TextProps, StyleSheet } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  base: {
    fontFamily: "Nunito Regular",
  },
});

const BodyText = ({ style, ...props }: TextProps) => {
  return <Text style={[styles.base, style]} {...props} />;
};

export default BodyText;
