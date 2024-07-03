import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useState, useEffect } from "react";
import { getAttractions, getCity } from "../api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchPage from "@/components/SearchPage";

const Stack = createNativeStackNavigator()

export default function HomeScreen() {
  return (
    <SearchPage/>
      )
 
}

