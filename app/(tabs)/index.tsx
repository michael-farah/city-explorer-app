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
import AttractionPage from "@/components/AttractionPage";

const Stack = createNativeStackNavigator()

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={SearchPage} options={{title: "Home"}}/>
      <Stack.Screen name="Attraction" component={AttractionPage} options={{title: "Attraction"}}/>
    </Stack.Navigator>
      )
 
}

