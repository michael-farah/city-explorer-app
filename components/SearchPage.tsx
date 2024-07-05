import { StyleSheet, Text, CheckBox, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useContext, useState, useEffect } from "react";
import { getAttractions, getCities, getCity } from "@/app/api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CityContext } from "@/app/CityContext";
import { checkIfConfigIsValid } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
import AttractionSearchByName from "./AttractionSearchByName";

export default function SearchPage({ navigation }) {
  const { cityName, setCityName } = useContext(CityContext);
  const [attractions, setAttractions] = useState([]);
  const [attractionsListIsLoading, setAttractionsListIsLoading] =
    useState(true);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [fullCityList, setFullCityList] = useState([]);

  useEffect(() => {
    setAttractionsListIsLoading(true);
    setAccessibleOnly(false);
    getCity(cityName)
      .then((response) => {
        getAttractions(
          response.city.city_longitude,
          response.city.city_latitude,
          response.city.city_radius
        ).then((response) => {
          setAttractionsListIsLoading(false);
          setAttractions(response.data.places);
          setFullCityList(response.data.places);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cityName]);

  useEffect(() => {
    if (accessibleOnly) {
      setAttractions((attractions) => {
        const copyAttractions = [...attractions];
        const filteredAttractions = copyAttractions.filter((attraction) => {
          return (
            attraction.accessibilityOptions &&
            attraction.accessibilityOptions.wheelchairAccessibleEntrance ===
              true &&
            attraction.accessibilityOptions.wheelchairAccessibleRestroom ===
              true
          );
        });
        return filteredAttractions;
      });
    } else {
      setAttractions(fullCityList);
    }
  }, [accessibleOnly]);
  
return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
         Welcome!</ThemedText>
         <ThemedText type="subtitle">
        Select your city from the dropdown menu and get ready to start planning your next adventure.
        </ThemedText>
      </ThemedView>
      <CityDropdown navigation={navigation} />
     <AttractionSearchByName setAttractions={setAttractions}/>
      <View style={styles.accessibilityCheckboxContainer}>
        <CheckBox
          value={accessibleOnly}
          onValueChange={setAccessibleOnly}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          Wheelchair-accessible attractions only (has a wheelchair-accessible
          entrance and toilet)
        </Text>
      </View>
      {attractionsListIsLoading ? (
        <Text>Attractions list is loading ...</Text>
      ) : (
        <AttractionsList
          cityName={cityName}
          attractions={attractions}
          navigation={navigation}
        />
      )}
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
    flexDirection: "column",
    gap: 8,
  },
  accessibilityCheckboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  checkbox: {
    alignSelf: "center",
  },
});
