import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Button, Platform } from "react-native";
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
import { Dropdown } from "react-native-element-dropdown";
import CityDropdown from "./CityDropdown";
import LoginForm from "./LoginForm";
import Account from "./Account";

export default function ItineraryPage({ navigation }) {
  const [bucketList, setBucketList] = useState<Location[]>([]);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [originName, setOriginName] = useState<string>("");
  const [destinationName, setDestinationName] = useState<string>("");
  const [transport, setTransport] = useState("WALK");
  const { user, cityName, bucketListMemo } = useContext(AppContext);
  const { username } = user;
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const locations = bucketListMemo.map(({ location, displayName }) => {
      return {
        position: { lat: location.latitude, lng: location.longitude },
        name: displayName.text,
      };
    });
    const placeDisplayNames = bucketListMemo.map(
      ({ location, displayName }) => {
        return {
          label: displayName.text,
          value: { name: displayName.text, position: location },
        };
      },
    );
    setPlaces(placeDisplayNames);
    setBucketList(locations);
    setOrigin(null);
    setDestination(null);
    setOriginName("");
    setDestinationName("");
  }, [cityName, username, bucketListMemo]);

  const handleMarkerPress = (coordinate: LatLng) => {
    if (!origin) {
      setOrigin(coordinate);
    } else if (!destination) {
      setDestination(coordinate);
    }
  };

  const handleDropdownChange = (event) => {
    setTransport(event.value);
  };

  const setOriginMarker = (coordinate: LatLng) => {
    setOrigin(coordinate);
  };

  const setDestinationMarker = (coordinate: LatLng) => {
    setDestination(coordinate);
  };

  const handleStartSelection = (event) => {
    setOriginName(event.value.name);
    setOriginMarker({
      latitude: event.value.position.latitude,
      longitude: event.value.position.longitude,
    });
  };

  const handleEndSelection = (event) => {
    setDestinationName(event.value.name);
    setDestinationMarker({
      latitude: event.value.position.latitude,
      longitude: event.value.position.longitude,
    });
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

      const route = await getRoutes(start, end, rest, transport);
      const decodedCoordinates = decodeRoutesPolyline(
        route.routes[0].polyline.encodedPolyline,
      );
      setRouteCoordinates(decodedCoordinates);
    } catch (error) {
      console.error("Error fetching route", error);
    }
  };

  const data = [
    { label: "Walking", value: "WALK" },
    { label: "Driving", value: "DRIVE" },
  ];

  if (!user.username) {
    return <LoginForm />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="calendar" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.borderBox}>
        <Account />
      </ThemedView>

      <ThemedView style={styles.borderBox}>
        <View style={styles.androidBorder}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Itinerary</ThemedText>
          </View>
          <View>
            <ThemedText>
              How to use the itinerary page:{"\n\n"}1. Use the dropdown to
              choose your city and see your bucket list places for that city on
              the map. {"\n\n"}2. Choose "Walking" or "Driving" from the
              dropdown menu to select your travel mode. {"\n\n"}3. Select your
              preferred start and end points by clicking on the places and
              selecting 'Set as start' or 'Set as end'. If you do not complete
              this a random route from the places you have selected will be
              provided.{"\n\n"}4. Hit 'Show me the route' to see your route!
              {"\n\n"}5. Go and have fun seeing everything on your bucket list!
            </ThemedText>
          </View>
          <View style={styles.buttons}>
            <View style={styles.dropdownContainer}>
              <CityDropdown navigation={navigation} />
            </View>
            <View style={styles.dropdownContainer}>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select mode of transport"
                data={data}
                labelField="label"
                valueField="value"
                value={transport}
                onChange={handleDropdownChange}
              />
            </View>
          </View>
          {Platform.OS === "web" ? (
            <ThemedView style={styles.routePointsContainer}>
              {originName ? (
                <ThemedText style={styles.startPointText}>
                  Start Point: {originName}
                </ThemedText>
              ) : null}
              {destinationName ? (
                <ThemedText style={styles.endPointText}>
                  End Point: {destinationName}
                </ThemedText>
              ) : null}
            </ThemedView>
          ) : (
            <View style={styles.startEndSetter}>
              <View style={styles.startEndDropdown}>
                <ThemedText>Route Start:</ThemedText>
                <Dropdown
                  style={styles.dropdown}
                  placeholder={
                    originName.length ? originName : "Select start point"
                  }
                  data={places}
                  labelField="label"
                  valueField="value"
                  value={originName}
                  onChange={handleStartSelection}
                />
              </View>
              <View style={styles.startEndDropdown}>
                <ThemedText>Route End:</ThemedText>
                <Dropdown
                  style={styles.dropdown}
                  placeholder={
                    destinationName.length
                      ? destinationName
                      : "Select end point"
                  }
                  data={places}
                  labelField="label"
                  valueField="value"
                  value={destinationName}
                  onChange={handleEndSelection}
                />
              </View>
            </View>
          )}
          <View>
            <Button title="Show me the route" onPress={renderRoute} />
          </View>
          <View style={{ height: 400 }}>
            <MapComponent
              city={cityName}
              locations={bucketList}
              onMarkerPress={handleMarkerPress}
              routeCoordinates={routeCoordinates}
              origin={origin}
              destination={destination}
              setOriginMarker={setOriginMarker}
              setDestinationMarker={setDestinationMarker}
              originName={originName}
              setOriginName={setOriginName}
              destinationName={destinationName}
              setDestinationName={setDestinationName}
            />
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#56bf52",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  borderBox: {
    ...Platform.select({
      android: {},
      web: {
        borderRadius: 30,
        borderWidth: 8,
        borderColor: "#56bf52",
      },
    }),
    padding: "5%",
    gap: 15,
  },
  androidBorder: {
    ...Platform.select({
      android: {
        padding: 20,
        borderRadius: 30,
        borderWidth: 8,
        borderColor: "#56bf52",
      },
    }),
    gap: 15,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
  },
  routePointsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  startPointText: {
    flex: 1,
  },
  endPointText: {
    flex: 1,
  },
  startEndSetter: {
    ...Platform.select({
      android: {
        flexDirection: "column",
        gap: 10,
        flexWrap: "wrap",
      },
      web: {
        flexDirection: "column",
        gap: 20,
        flexWrap: "wrap",
      },
    }),
  },
  startEndDropdown: {
    ...Platform.select({
      android: {
        flexDirection: "column",
        gap: 5,
      },
      web: {
        flexDirection: "column",
        gap: 20,
        flexWrap: "wrap",
      },
    }),
  },
  buttons: {
    ...Platform.select({
      android: {
        gap: 10,
      },
      web: {
        flexDirection: "row",
        flexWrap: "wrap",
        minWidth: 200,
        gap: 10,
      },
    }),
  },
  dropdownContainer: {
    flex: 1,
    flexWrap: "wrap",
  },
  dropdown: {
    ...Platform.select({
      android: {
        backgroundColor: "white",
        height: 40,
        width: 250,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
      },
      web: {
        backgroundColor: "white",
        height: 40,
        maxWidth: 200,
        minWidth: 100,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
      },
    }),
  },
});
