import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Button } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapComponent from "@/components/Map";
import { getBucketListItemsByUser } from "../app/api";
import { useEffect, useState, useContext } from "react";

import { AppContext } from "../app/AppContext";
import { getRoutes } from "../app/api";
import { decodeRoutesPolyline } from "@/utils/decoder";
import { LatLng } from "react-native-maps";
import CityDropdown from "./CityDropdown";

export default function ItineraryPage({navigation}){
    const [bucketList, setBucketList] = useState<Location[]>([]);
    const [origin, setOrigin] = useState<LatLng | null>(null);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  
    const { user, cityName, bucketListMemo } = useContext(AppContext);
    const { username } = user;
 
    useEffect(() => {
            const locations = bucketListMemo.map(({location, displayName}) => {
              return {
                position: { lat: location.latitude, lng: location.longitude },
                name: displayName.text,
              };
            });
            setBucketList(locations);
            setOrigin(null);
            setDestination(null);
      }, [cityName, username, bucketListMemo]);
    
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
        headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
          headerImage={
            <Ionicons size={310} name="calendar" style={styles.headerImage} />
          }
        >
          <View style={styles.overallContainer}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Itinerary</ThemedText>
          </View>
          <View>
          <ThemedText>How to use the itinerary page:{"\n\n"}1. Use the dropdown to choose your city. {"\n\n"}2. See your bucket list places for that city on the map. {"\n\n"}3. Select your preferred start and end points by clicking on the places and selecting 'Set as start' or 'Set as end'.{"\n\n"}4. Hit 'Show me the route' to see your route!{"\n\n"}5. Go and hve fun seeing everything on your bucket list!</ThemedText></View>
          <View style= {styles.buttons}><CityDropdown navigation={navigation}/> <Button title="Show me the route" onPress={renderRoute} /></View>
      
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
    overallContainer: {backgroundColor: "white",
      padding: "5%",
      borderRadius:10,
      gap: 15
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row"
    },
    buttons: {
      flex: 1,
      flexDirection: "row", 
      justifyContent: "space-evenly"
    }
  });
  