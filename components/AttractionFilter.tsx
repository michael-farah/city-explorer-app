import { View, Text, StyleSheet, CheckBox, Platform } from "react-native";
import React from "react";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { ThemedView } from "./ThemedView";

export default function AttractionFilter({ setGobbledigook, type, setText, setSearchTerm, setType }) {
  const typesList = [
    { label: "All", value: "All" },
    { label: "Museums", value: "museum" },
    { label: "Galleries", value: "art_gallery" },
    { label: "Historical landmarks", value: "historical_landmark" },
    { label: "Restaurants", value: "restaurant" },
    { label: "Cafes", value: "cafe" },
    { label: "Parks", value: "park" },
    { label: "Theatres", value: "performing_arts_theater" },
    { label: "Cinemas", value: "movie_theater" },
    { label: "Shops", value: "store" },
    { label: "Malls", value: "shopping_mall" },
    { label: "Department stores", value: "department_store" },
    { label: "Spas", value: "spa" },
    { label: "Gyms", value: "gym" },
    { label: "Playgrounds", value: "playground" },
    { label: "Swimming pools", value: "swimming_pool" },
    { label: "Golf courses", value: "gold_course" },
    { label: "Nightclubs", value: "night_club" },
    { label: "Churches", value: "church" },
    { label: "Hindu temples", value: "hindu_temple" },
    { label: "Mosques", value: "mosque" },
    { label: "Synagogues", value: "synagogue" },
  ];

  const handleDropdownChange = (event) => {
    setType(event.value);
    setText("")
    setSearchTerm("")
    setGobbledigook(false)
  };


  return (
    <ThemedView style= {styles.overallContainer}>
      <ThemedText type="subtitle">OR.. not sure where to start?</ThemedText>
      <ThemedText type="default">
   Search by attraction type using the dropdown below.
      </ThemedText>

      <ThemedView>
        <Dropdown
          style={styles.dropdown}
          placeholder="Select attraction type"
          data={typesList}
          labelField="label"
          valueField="value"
          value={type}
          onChange={handleDropdownChange}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    ...Platform.select({android: {
    }, web: {
    flex: 1,
    gap: 10,
    justifyContent: "space-between",
    minWidth: 200
  }})
  },
  dropdown: {
    backgroundColor: "white",
    height: 40,
    maxWidth: 200,
    minWidth: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
}
});
