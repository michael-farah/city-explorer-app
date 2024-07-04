import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapComponent from "@/components/Map";
import { View } from "react-native";
import { getBucketListItemsByUser } from "../api";
import BucketCityDropdown from "@/components/BucketCityDropdown";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function ItineraryScreen() {
  const [city, setCity] = useState("Liverpool");
  const [bucketList, setBucketList] = useState<Location[]>([]);
  const { user } = useContext(UserContext);
  const { username } = user;

  useEffect(() => {
    getBucketListItemsByUser(username, city)
      .then(({ bucketList }) => {
        const locations = bucketList.map(({ place_json: place }) => {
          const { location, displayName } = place;
          return {
            position: { lat: location.latitude, lng: location.longitude },
            name: displayName.text,
          };
        });
        setBucketList(locations);
      })
      .catch((error) => console.error("Error fetching bucket list:", error));
  }, [city, username]);

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
      <BucketCityDropdown username={username} setCity={setCity} city={city} />
      <View style={{ height: 500 }}>
        <MapComponent city={city} locations={bucketList} />
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
