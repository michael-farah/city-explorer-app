import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
  LatLng,
  Region,
} from "react-native-maps";
import {
  GoogleMap,
  LoadScript,
  Marker as WebMarker,
  InfoWindow,
  Polyline as WebPolyline,
} from "@react-google-maps/api";
import { ThemedText } from "./ThemedText";
import Constants from "expo-constants";
import { getCity } from "../app/api";

interface Location {
  position: { lat: number; lng: number };
  name: string;
}

interface MapComponentProps {
  city: string;
  locations: Location[];
  onMarkerPress: (coordinate: LatLng) => void;
  routeCoordinates: LatLng[];
  origin: LatLng | null;
  destination: LatLng | null;
  setOriginMarker: (coordinate: LatLng) => void;
  setDestinationMarker: (coordinate: LatLng) => void;
  originName: string;
  setOriginName: (name: string) => void;
  destinationName: string;
  setDestinationName: (name: string) => void;
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

const MapComponent = ({
  city,
  locations,
  onMarkerPress,
  routeCoordinates,
  origin,
  destination,
  setOriginMarker,
  setDestinationMarker,
  originName,
  setOriginName,
  destinationName,
  setDestinationName
}: MapComponentProps) => {
  const googleMapsApiKey = Constants.expoConfig.extra.googleMapsApiKey;
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>(defaultRegion);
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
          const newRegion = {
            latitude: cityData.city_latitude,
            longitude: cityData.city_longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          };
          setRegion(newRegion);
          if (Platform.OS !== "web" && mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
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

  const setMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(
        locations.map((_, index) => index.toString()),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        },
      );
    }
  };

  useEffect(() => {
    if (Platform.OS !== "web" && mapRef.current && locations.length > 0) {
      setMapReady();
    }
  }, [locations]);

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onMarkerClick = (location: Location) => {
    setSelectedPlace(location);
    onMarkerPress({
      latitude: location.position.lat,
      longitude: location.position.lng,
    });
  };

  const handleSetOriginMarker = (location) => {
    setOriginMarker({
      latitude: location.position.lat,
      longitude: location.position.lng,
    });
    setOriginName(location.name)
  };

  const handleSetDestinationMarker = (location) => {
    setDestinationMarker({
      latitude: location.position.lat,
      longitude: location.position.lng,
    });
    setDestinationName(location.name)
  };

  if (Platform.OS === "web") {
    return (
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: region.latitude, lng: region.longitude }}
          zoom={12}
        >
          {locations.map((location, index) => (
            <WebMarker
              key={index}
              position={location.position}
              onClick={() => onMarkerClick(location)}
            >
              {selectedPlace === location && (
                <InfoWindow onCloseClick={() => setSelectedPlace(null)}>
                  <View style={styles.buttonsAndName}>
                    <View>
                      <Text style={{fontWeight: "bold"}}>{location.name}</Text>
                    </View>
                    {originName === location.name ? null : <Button
                    title="Set as Start"
                      onPress={() =>
                        handleSetOriginMarker(location)
                      }
                     disabled={originName === location.name ? true : false}
                    />}
                    {destinationName === location.name ? null :
                    <Button
                      title="Set as End"
                      onPress={() =>
                        handleSetDestinationMarker(location)
                      }
                    disabled={destinationName === location.name ? true : false}
                      />}
                  </View>
                </InfoWindow>
              )}
            </WebMarker>
          ))}
          {routeCoordinates.length > 0 && (
            <WebPolyline
              path={routeCoordinates.map((coord) => ({
                lat: coord.latitude,
                lng: coord.longitude,
              }))}
              options={{ strokeColor: "#000", strokeWeight: 4 }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onMapReady={setMapReady}
        onRegionChangeComplete={setRegion}
      >
        {locations.map((location, index) => (
          <Marker
            title={location.name}
            key={index}
            coordinate={{
              latitude: location.position.lat,
              longitude: location.position.lng,
            }}
            identifier={index.toString()}
            onPress={() => onMarkerClick(location)}
          >
          </Marker>
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  callout: {
    flex: 1, 
    maxHeight: "auto",
    position: "relative"
  },
  calloutText: {
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonsAndName: {
    gap: 5
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const webStyles = {
  button: {
    backgroundColor: "#2196F3",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    color: "#fff",
    textAlign: "center",
    cursor: "pointer",
  },
};

export default MapComponent;