import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useState, useEffect } from "react";
import { getAttractions, getCity } from "../api";

export default function HomeScreen() {
  const [city, setCity] = useState("London")
  const [attractions, setAttractions] = useState([])
  useEffect(()=>{
          getCity(city).then((response)=>{
          getAttractions(response.city.city_longitude, response.city.city_latitude, response.city.city_radius)
          .then((response)=>{setAttractions(response.data.places)})
      }).catch((err) => {console.log(err)})
  },[city])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Welcome! This is where the map and search feature will be:
        </ThemedText>
      </ThemedView>
      <CityDropdown setCity={setCity} city={city}/>
      <AttractionsList city={city} attractions={attractions}/>
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
