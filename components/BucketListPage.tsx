import { Text, StyleSheet, View, Platform } from "react-native";
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

export default function BucketListPage({ navigation }) {
  const { user, cityName, bucketListMemo, isBucketListLoading } =
    useContext(AppContext);
  const { username } = user;


    if (!user.username) {
      return <LoginForm />;
    }

    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="star" style={styles.headerImage} />
        }
      >
         <ThemedView style={styles.borderBox}>
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
            <ThemedText>Loading...</ThemedText>
          ) : (
            <Suspense fallback={<ThemedText>Loading...</ThemedText>}>
              {bucketListMemo.length ? (
                <AttractionsList
                  cityName={cityName}
                  attractions={bucketListMemo}
                  navigation={navigation}
                />
              ) : (
                <ThemedText>
                  No attractions in your bucket list for {cityName}, go to the
                  home page to add some or choose another city!
                </ThemedText>
              )}
            </Suspense>
          )}
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#D580FF",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  borderBox: {
    // borderWidth: 8,
    // borderColor: 	"#D580FF",
    // borderRadius: 30,
    // padding: "5%"
    ...Platform.select({
      web: {
        borderRadius: 30,
        borderWidth: 8,
        borderColor: "#D580FF",
      },
    }),
    padding: "5%",
  },

  top: {
    gap: 30,
  },
});
