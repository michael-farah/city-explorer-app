import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native'; // Or your custom theme hook
import { useThemeColor } from "@/hooks/useThemeColor";

const ThemedTextInput = ({ style,  lightColor,
    darkColor, ...rest }) => {
    const color = useThemeColor({ light: darkColor, dark: darkColor }, "text");

  return (
    <TextInput
      style={[styles.input, { color }, style]}
    //   placeholderTextColor={colors.placeholder}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white"
  },
});

export default ThemedTextInput;
