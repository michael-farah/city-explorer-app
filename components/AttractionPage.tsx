import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useEffect } from "react";
import { getPhoto } from "@/app/api";
import { useState } from "react";

export default function AttractionPage({ route, navigation }) {
  const { attraction } = route.params;
  const [photo, setPhoto] = useState("");

  //add in accessibility options
  //render photos (carousel?)
  //add in types??

  useEffect(() => {
    if(attraction.photos){
    getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
      setPhoto(response);
    })}
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <View style={styles.container}>
        <View >
        <Text style={styles.boldText}>{attraction.displayName.text}</Text>
        {photo ? (<Image style={styles.image} source={{ uri: photo }} />): null}
        <Text style={styles.textBlock}>
          {attraction.editorialSummary && attraction.editorialSummary.text
            ? attraction.editorialSummary.text
            : ""} </Text>

          <Text style={styles.address}>Address: {attraction.formattedAddress} {attraction.nationalPhoneNumber
            ? `              Phone number: ${attraction.nationalPhoneNumber}`
            : ""}</Text>
        <Text>
          {attraction.regularOpeningHours
            ? `Opening hours: ${attraction.regularOpeningHours.weekdayDescriptions}`
            : ""}
        </Text>
        {attraction.websiteUri ?(<Text
          style={{ color: "blue", marginVertical:20 }}
          onPress={() => Linking.openURL(attraction.websiteUri)}
        >Visit official site
        </Text>): null}
        </View>
        {attraction.rating? (<View style={styles.reviewBox}>
          <Text style={styles.boldText}>Reviews:</Text>
          <Text style={styles.rating}>Average user rating: {attraction.rating} from{" "}
          {attraction.userRatingCount} users</Text>
          {attraction.reviews
            ? attraction.reviews.map((review) => {
                return (
                  <View key={review.name} style={styles.review}>
                    <Text style={styles.user}>
                      {review.authorAttribution.displayName} visited on{" "}
                      {review.publishTime.slice(0, 10)}
                    </Text>
                    <Text style={styles.reviewText}>{review.text.text}</Text>
                    <Text>Rating:{review.rating}/5 </Text>
                  </View>
                );
              })
            : "none available"}{" "}
        </View>): null}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    color: "#FF4D4D",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  boldText: {
    fontWeight: "bold",
  },
  textBlock:{
    marginVertical: 10
  },
  rating: {
    marginVertical: 20
  }, 
  address:{
    marginVertical: 20
  },
  reviewBox: {
    backgroundColor: "#FFFFF",
    paddingVertical: 10,
  },
  review: {
    margin: 20,
    padding: 10,
    backgroundColor: "#fbe3e8",
    borderRadius: 10,
  },

  image: {
    width: 350,
    height: 350,
    margin: 20,
    alignSelf: "center"
  },
  user: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewText: {
    marginBottom: 10,
  },
});