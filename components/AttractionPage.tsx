import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useEffect } from "react";
import { getPhoto } from "@/app/api";
import { useState } from "react";
import { ThemedText } from "./ThemedText";

export default function AttractionPage({ route, navigation }) {
  const { attraction } = route.params;
  const [photo, setPhoto] = useState("");

  const [accessibilityFeatures, setAccessibilityFeatures] = useState([])

  //add in accessibility options
  //render photos (carousel?)
  //add in types??

  useEffect(() => {
    if(attraction.accessibilityOptions){
      setAccessibilityFeatures((features)=>{
     const accessibilityKeys = Object.keys(attraction.accessibilityOptions)
      const trueAccessibilityKeys = accessibilityKeys.filter((key)=>{
       return attraction.accessibilityOptions[key] === true
      })
      const spacedTrueAccessibilityKeys = trueAccessibilityKeys.map((key)=>{
        const result = key.replace(/([A-Z])/g, ' $1')
        return result.charAt(0).toUpperCase() + result. slice(1).toLowerCase()
      })
      const anglicisedSpacedTrueAccessibilityKeys = spacedTrueAccessibilityKeys.map((key)=>{
    if(key ==="Wheelchair accessible restroom"){
      return "Wheelchair accessible toilet"
    }
    else{ 
      return key
    }
      })
     return anglicisedSpacedTrueAccessibilityKeys
        }  )
      }
    if(attraction.photos){
    getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
      setPhoto(response)
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
        <ThemedText type="title" style={styles.boldText}>{attraction.displayName.text}</ThemedText>
        {photo ? (<Image style={styles.image} source={{ uri: photo }} />): null}
        <ThemedText type="default" style={styles.textBlock}>
          {attraction.editorialSummary && attraction.editorialSummary.text
            ? attraction.editorialSummary.text
            : null} </ThemedText>

          <ThemedText style={styles.address}>Address: {attraction.formattedAddress} {attraction.nationalPhoneNumber
            ? `\n\nPhone number: ${attraction.nationalPhoneNumber}`
            : ""}</ThemedText>
          {attraction.regularOpeningHours
            ? (<ThemedText>Opening hours:{'\n\n'}{attraction.regularOpeningHours.weekdayDescriptions.join("\n")}</ThemedText>): null}
       <View>
{accessibilityFeatures.length? (<ThemedText>{`\nWheelchair facilities: ${accessibilityFeatures.join(", ")}`}</ThemedText> ): null}
</View>
        {attraction.websiteUri ?(<ThemedText
          style={{ color: "blue", marginVertical:20 }}
          onPress={() => Linking.openURL(attraction.websiteUri)}
        >Visit official site
        </ThemedText>): null}
        </View>
        {attraction.rating? (<View style={styles.reviewBox}>
          <ThemedText type="subtitle" style={styles.boldThemedText}>Reviews:</ThemedText>
          <ThemedText style={styles.rating}>Average user rating: {attraction.rating} from{" "}
          {attraction.userRatingCount.toLocaleString('en-US')} users</ThemedText>
          {attraction.reviews
            ? attraction.reviews.map((review) => {
                return (
                  <View key={review.name} style={styles.review}>
                    <ThemedText style={styles.user}>
                      {review.authorAttribution.displayName} visited on{" "}
                      {review.publishTime.slice(0, 10)}
                    </ThemedText>
                    <ThemedText style={styles.reviewText}>{review.text.text}</ThemedText>
                    <ThemedText>Rating:{review.rating}/5 </ThemedText>
                  </View>
                );
              })
            :<ThemedText> "none available" </ThemedText>}
        </View>): null}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: "100%",    padding: 40
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
    marginTop: 20,
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