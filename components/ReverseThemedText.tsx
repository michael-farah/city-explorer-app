import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const ReverseLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'black',
    background: 'white',
    placeholder: 'gray',
  },
};

export const ReverseDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: 'white',
    background: 'black',
    placeholder: 'lightgray',
  },
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 20,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
