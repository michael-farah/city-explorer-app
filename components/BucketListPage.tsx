import { Text, StyleSheet, View, Platform, Dimensions } from "react-native";
import CityDropdown from "./CityDropdown";
import AttractionsList from "./AttractionsList";
import { Suspense, useContext } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppContext } from "@/app/AppContext";
import LoginForm from "./LoginForm";
import Account from "./Account";
import { useState, useEffect } from "react";

export default function BucketListPage({ navigation }) {
  const { user, cityName, bucketListMemo, isBucketListLoading } =
    useContext(AppContext);
    const [styles, setStyles] = useState(calculateStyles());
  const { username } = user;


    if (!user.username) {
      return <LoginForm />;
    }
    useEffect(() => {
      const onChange = ({window}) => {
        setStyles(calculateStyles(window.width));
      };
      const subscription = Dimensions.addEventListener('change', onChange);
  
      return () => {
        subscription?.remove();
      };
    }, []);
    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="star" style={styles.headerImage} />
        }
      >
         <ThemedView style={styles.user}>
        <Account />
      </ThemedView>
        <View >
          <ThemedView style={styles.borderBox}>

          <ThemedView style={styles.top}>
            <ThemedText type="title">Bucket List</ThemedText>
            <ThemedText>
              Use the dropdown below to see the places in your bucket list for
              that city.
            </ThemedText>

            <CityDropdown navigation={navigation} />
          </ThemedView>

          {isBucketListLoading ? (
            <ThemedText><p><br></br>Loading...</p></ThemedText>
          ) : (
            <Suspense fallback={<ThemedText><p><br></br>Loading...</p></ThemedText>}>
              {bucketListMemo.length ? (
                <AttractionsList
                  cityName={cityName}
                  attractions={bucketListMemo}
                  navigation={navigation}
                />
              ) : (
                <ThemedText>
                  <p><br></br>No attractions in your bucket list for {cityName}, go to the
                  home page to add some or choose another city!</p>
                </ThemedText>
              )}
            </Suspense>
          )}
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}
const calculateStyles = (screenWidth = Dimensions.get("window").width) => {
  const isSmallScreen = screenWidth < 550;
  const isLargeScreen = screenWidth >= 550;
  return StyleSheet.create({
  headerImage: {
    color: "#D580FF",
    bottom: -90,
    left: -35,
    position: "absolute",
  },  
  user: {
    ...(isSmallScreen? {
      marginTop: 20
    } : {
      marginTop: -10
    }),
  
    borderRadius: 30,
    borderWidth: 8,
    borderColor: "#D580FF",
    padding: 15,
  },
  borderBox: {
    ...(isLargeScreen && {
      borderRadius: 30,
          borderWidth: 8,
          borderColor: "#89CFF0",
        
    }),
   
    padding: "5%",
  },

  top: {
    gap: 30,
  },
});
}