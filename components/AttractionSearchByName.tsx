import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { useEffect, useContext, useState } from "react";
import React from "react";
import { getCity, getSearchPlaces } from "@/app/api";
import { AppContext } from "@/app/AppContext";
import { ThemedText } from "./ThemedText";
import { getAttractions } from "@/app/api";
import { ThemedView } from "./ThemedView";
import ThemedTextInput from "./ThemedTextInput";

export default function AttractionSearchByName({
  setAttractions,
  text,
  setText,
  searchTerm,
  setSearchTerm,
  gobbledigook,
  setGobbledigook,
}) {
  const { cityName, setCityName } = useContext(AppContext);

  useEffect(() => {
    if (text === "") {
      setSearchTerm("");
    }
  }, [text]);

  useEffect(() => {
    if (gobbledigook) {
      setText("");
    }
  }, [gobbledigook]);

  return (
    <ThemedView style={styles.overallContainer}>
      <View style={styles.question}>
        <ThemedText type="subtitle">
          Already know where you're going?
        </ThemedText>
      </View>
      <View>
        <ThemedText type="default">
          Search for it below and hit enter!
        </ThemedText>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={(value) => setText(value)}
        onSubmitEditing={(value) => setSearchTerm(value.nativeEvent.text)}
        value={text}
        placeholder="Search here..."
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    ...Platform.select({android: {
    }, web: {
        flex: 1,
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "space-between",
        minWidth: 200,
  }
  })},
  input: {
      borderColor: "gray",
      backgroundColor: "white",
      maxWidth: 400,
      minWidth: 100,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
},
  question: {
    ...Platform.select({android: {},
      web: {
        flexWrap: "wrap",
  },
})},
});
