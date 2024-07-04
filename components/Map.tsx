import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import {
  GoogleMap,
  LoadScript,
  Marker as WebMarker,
  InfoWindow,
} from "@react-google-maps/api";
import Constants from "expo-constants";
import { getCity } from "../app/api";

interface Location {
  position: { lat: number; lng: number };
  name: string;
}

interface MapComponentProps {
  city: string;
  locations: Location[];
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultRegion = {
  latitude: 51.50986,
  longitude: -0.11809,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MapComponent = ({ city, locations }: MapComponentProps) => {
  const googleMapsApiKey = Constants.expoConfig.extra.googleMapsApiKey;
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(defaultRegion);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCity(city);
        const cityData = response.city;
        if (
          cityData &&
          typeof cityData.city_latitude === "number" &&
          typeof cityData.city_longitude === "number"
        ) {
          setRegion({
            latitude: cityData.city_latitude,
            longitude: cityData.city_longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          });
        } else {
          console.error("Invalid city data:", response);
          setRegion(defaultRegion);
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
        setRegion(defaultRegion);
      }
    })();
  }, [city]);

  useEffect(() => {
    if (Platform.OS !== "web" && mapRef.current && locations.length > 0) {
      mapRef.current.fitToSuppliedMarkers(
        locations.map((_, index) => index.toString()),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        },
      );
    }
  }, [locations]);

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        loadingElement={
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: region.latitude, lng: region.longitude }}
          zoom={13}
        >
          {locations.map((place, index) => (
            <WebMarker
              key={index}
              position={place.position}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.position}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <h4>{selectedPlace.name}</h4>
                <button onClick={() => console.log("Remove from bucket list")}>
                  Remove
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      apikey={googleMapsApiKey}
    >
      {locations.map((place, index) => {
        const isValidCoordinate =
          typeof place.position.lat === "number" &&
          typeof place.position.lng === "number" &&
          !isNaN(place.position.lat) &&
          !isNaN(place.position.lng);

        if (!isValidCoordinate) {
          console.error(
            `Invalid coordinates for marker: ${place.name}`,
            place.position,
          );
          return null;
        }

        return (
          <Marker
            key={index}
            identifier={index.toString()}
            coordinate={{
              latitude: place.position.lat,
              longitude: place.position.lng,
            }}
          >
            <Callout>
              <View>
                <Text>{place.name}</Text>
                <Text onPress={() => console.log("Remove from bucket list")}>
                  Remove
                </Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapComponent;