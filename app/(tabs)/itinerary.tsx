import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Platform } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapComponent from "@/components/Map";
import WebMapComponent from "@/components/WebMap";
import { View } from "react-native";

export default function ItineraryScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="calendar" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Itinerary</ThemedText>
      </ThemedView>
      <ThemedText>Welcome to the Itinerary planner:</ThemedText>
      <Collapsible title="Filtering">
        <ThemedText>Users can filter through the list here!</ThemedText>
      </Collapsible>
      <View style={{ height: 500 }}>
        {Platform.OS === "web" ? <WebMapComponent /> : <MapComponent />}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#FF4D4D",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
