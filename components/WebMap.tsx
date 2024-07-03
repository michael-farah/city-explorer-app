import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Constants from "expo-constants";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default center coordinates (which is London currently)
const defaultCenter = {
  lat: 51.50986,
  lng: -0.11809,
};

const WebMapComponent = () => {
  const googleMapsApiKey = Constants.expoConfig.extra.googleMapsApiKey;

  const [location, setLocation] = useState(defaultCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Set the location state to the user's current position
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation(defaultCenter);
        },
        // Configuration options for the geolocation request
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocation(defaultCenter);
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        // Center the map at the user's current location
        center={location}
        // Set the initial zoom level of the map (larger numbers = more zoomed in)
        zoom={13}
      ></GoogleMap>
    </LoadScript>
  );
};

export default WebMapComponent;