import { StyleSheet, Text, View, Platform } from "react-native";
import CheckBox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useContext, useState, useEffect } from "react";
import {
  getAttractions,
  getAttractionsWithType,
  getCities,
  getCity,
} from "@/app/api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext } from "@/app/AppContext";
import { checkIfConfigIsValid } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
import AttractionSearchByName from "./AttractionSearchByName";
import AttractionFilter from "./AttractionFilter";
import { getSearchPlaces } from "@/app/api";
import LoginForm from "./LoginForm";
import Account from "./Account";

export default function SearchPage({ navigation }) {
  const { cityName, setCityName, user } = useContext(AppContext);
  const [gobbledigook, setGobbledigook] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [attractionsListIsLoading, setAttractionsListIsLoading] =
    useState(true);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [isSearchTerm, setIsSearchTerm] = useState(false);
  const [text, setText] = useState("");
  const [city, setCity] = useState({
    city_name: "London",
    city_latitude: 51.5072,
    city_longitude: -0.1275,
    city_radius: 12000,
    city_rectangle: {
      low: {
        latitude: "51.286760",
        longitude: "-0.510375",
      },
      high: {
        latitude: "51.691874",
        longitude: "0.334015",
      },
    },
  });
  const [type, setType] = useState("All");

  useEffect(() => {
    if (type !== "All") {
      setText("");
      setSearchTerm("");
    }
  }, [type]);

  useEffect(() => {
    setAttractionsListIsLoading(true);
    if (searchTerm === "") {
      setText("");
      getCity(cityName)
        .then((response) => {
          setCity(response.city);
          if (type === "All") {
            getAttractions(
              response.city.city_longitude,
              response.city.city_latitude,
              response.city.city_radius,
            )
              .then((response) => {
                setAttractionsListIsLoading(false);
                setAttractions(response.data.places);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            getAttractionsWithType(
              response.city.city_longitude,
              response.city.city_latitude,
              response.city.city_radius,
              [type],
            )
              .then((response) => {
                setAttractionsListIsLoading(false);
                setAttractions(response.data.places);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setGobbledigook(false);
      getCity(cityName)
        .then(({ city }) => {
          return getSearchPlaces(city.city_rectangle, searchTerm);
        })
        .then(({ data }) => {
          setAttractionsListIsLoading(false);
          if (data.places) {
            setAttractions(data.places);
          } else {
            setGobbledigook(true);
          }
        });
    }
  }, [cityName, type, searchTerm]);

  useEffect(() => {
    if (searchTerm !== "") {
      setType("All");
    }
  }, [searchTerm]);

  if (!user.username) {
    return <LoginForm />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.borderBox}>
        <Account />
      </ThemedView>
      <View style={styles.pageContainer}>
        <ThemedView style={styles.borderBox}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Welcome!</ThemedText>
            <ThemedText type="subtitle">
              Select your city from the dropdown menu and get ready to start
              planning your next adventure!
            </ThemedText>

            <CityDropdown navigation={navigation} />
            <View style={styles.searchAndFilterContainer}>
            <AttractionSearchByName
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              gobbledigook={gobbledigook}
              setGobbledigook={setGobbledigook}
              setAttractions={setAttractions}
              text={text}
              setText={setText}
            />
            <AttractionFilter
            setGobbledigook={setGobbledigook}
              type={type}
              setType={setType}
              setText={setText}
              setSearchTerm={setSearchTerm}
            />
            </View>   
             {gobbledigook ?
         <ThemedText>Sorry, we can't find a place matching that search, please try something else.</ThemedText>: null}
            <View style={styles.accessibilityCheckboxContainer}>
              <CheckBox
                value={accessibleOnly}
                onValueChange={setAccessibleOnly}
                style={styles.checkbox}
              />

              <ThemedText style={styles.label}>
                Wheelchair-accessible attractions only (has a
                wheelchair-accessible entrance and toilet)
              </ThemedText>
            </View>
          </View>
          {attractionsListIsLoading ? (
            <ThemedView>
              <ThemedText
                type="defaultSemiBold"
                style={styles.attractionsListLoading}
              >
                Attractions list is loading ...
              </ThemedText>
            </ThemedView>
          ) : (
            <AttractionsList
              cityName={cityName}
              attractions={attractions}
              navigation={navigation}
              accessibleOnly={accessibleOnly}
            />
          )}
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#89CFF0",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  borderBox: {
    ...Platform.select({
      web: {
        borderRadius: 30,
        borderWidth: 8,
        borderColor: "#89CFF0",
      },
    }),
    padding: "5%",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8
  },
  accessibilityCheckboxContainer: {
    flexDirection: "row",
  },
  label: {
    margin: 8,
  },
  checkbox: {
    alignSelf: "center",
  },
  attractionsListLoading: {
    padding: 20,
  },
  searchAndFilterContainer: {
    flexDirection: "row",
    gap: 20,
    flexWrap: "wrap",
    marginTop: 10
  }
});
