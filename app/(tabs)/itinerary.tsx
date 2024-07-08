import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Button } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapComponent from "@/components/Map";
import { getBucketListItemsByUser } from "../api";
import BucketCityDropdown from "@/components/BucketCityDropdown";
import { useEffect, useState, useContext } from "react";

import { AppContext } from "../AppContext";
import { getRoutes } from "../api";
import { decodeRoutesPolyline } from "@/utils/decoder";
import { LatLng } from "react-native-maps";


export default function ItineraryScreen() {
  const [bucketList, setBucketList] = useState<Location[]>([]);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

  const { user, cityName, setCityName } = useContext(AppContext);
  const { username } = user;

  useEffect(() => {
    getBucketListItemsByUser(username, cityName)
      .then(({ bucketList }) => {
        const locations = bucketList.map(({ place_json: place }) => {
          const { location, displayName } = place;
          return {
            position: { lat: location.latitude, lng: location.longitude },
            name: displayName.text,
          };
        });
        setBucketList(locations);
        setOrigin(null);
        setDestination(null);
      })
      .catch((error) => console.error("Error fetching bucket list:", error));
  }, [cityName, username]);

  const handleMarkerPress = (coordinate: LatLng) => {
    if (!origin) {
      setOrigin(coordinate);
    } else if (!destination) {
      setDestination(coordinate);
    }
  };

  const setOriginMarker = (coordinate: LatLng) => {
    setOrigin(coordinate);
  };

  const setDestinationMarker = (coordinate: LatLng) => {
    setDestination(coordinate);
  };

  const renderRoute = async () => {
    try {
      const coordinates = bucketList.map((location) => ({
        latitude: location.position.lat,
        longitude: location.position.lng,
      }));

      if (origin) coordinates.unshift(origin);
      if (destination) coordinates.push(destination);

      const [start, ...rest] = coordinates;
      const end = rest.pop();

      const route = await getRoutes(start, end, rest, "DRIVE");
      const decodedCoordinates = decodeRoutesPolyline(
        route.routes[0].polyline.encodedPolyline,
      );
      setRouteCoordinates(decodedCoordinates);
    } catch (error) {
      console.error("Error fetching route", error);
    }
  };

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
      <BucketCityDropdown username={username} setCity={setCityName} city={cityName} />
      <View style={{ height: 500 }}>
        <MapComponent
          city={cityName}
          locations={bucketList}
          onMarkerPress={handleMarkerPress}
          routeCoordinates={routeCoordinates}
          origin={origin}
          destination={destination}
          setOriginMarker={setOriginMarker}
          setDestinationMarker={setDestinationMarker}
        />

      </View>
      <Button title="Render Route" onPress={renderRoute} />
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
