import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import { UserContext } from "../app/UserContext";
import { useContext, useState, useEffect } from "react";
import { postBucketListItem } from "@/app/api";
import { getPhoto } from "@/app/api";
import { RotateInDownLeft } from "react-native-reanimated";

export default function AttractionCard({ navigation, cityName, attraction }) {
  const { user, setUser } = useContext(UserContext);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
      setPhoto(response);
    });
  }, []);
  const seeMoreClick = ({ attraction }) => {
    navigation.navigate("Attraction", { attraction });
  };
  const bucketListClick = ({ attraction }) => {
    postBucketListItem(attraction, user.username, cityName);
    // add a way to show the user that they have clicked the button and its working/complete/failed
    console.log("item added to bucket list");
  };

  return (
    <View style={styles.container}>
      <View style={styles.attractionTitle}>
        <Text style={styles.titleText}>{attraction.displayName.text}</Text>
      </View>
      <View style={styles.mainBody}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: photo }} />
        </View>
        <View style={styles.textBody}>
          <Text style={styles.rating}>
            Average rating of {attraction.rating} according to{" "}
            {attraction.userRatingCount} reviewers
          </Text>
          {attraction.editorialSummary ? (
            <Text style={styles.editorialSummary}>{attraction.editorialSummary.text}</Text>
          ) : null}
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(attraction.websiteUri)}
          >
            Visit official site
          </Text>
          <Text>Categories: {attraction.types.join(", ")}</Text>
          <View style={styles.buttonContainer}>
        <View>
          <Button
            title="See more details"
            onPress={() => seeMoreClick({ attraction })}
            disabled={false}
          />
        </View>
        <View>
          <Button
            title="Add to Bucket List"
            onPress={() => bucketListClick({ attraction })}
            disabled={false}
          />
        </View>
      </View>
      </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    margin: 10,
     flex: 1 ,
    borderWidth: 5},
  image: {
    width: 150,
    height: 150,
    borderRadius: 10
  },
  attractionTitle: {
  },
  titleText: {
    fontWeight: "bold",
    borderWidth: 3,
    borderColor: "green",
    padding:10
  },
  mainBody: {
    flexDirection: "row",
    borderWidth: 3,
    borderColor: "red"
  },
  textBody:{
    flex:1,
    flexWrap: "wrap",
    borderWidth: 3,
    borderColor: "purple",
    padding: 10
  }
  ,
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  editorialSummary: {
    flex:1,
    marginVertical: 10
  },
  imageBox: {
    padding: 10,
   
  },
  rating: {
    marginBottom: 10
  }
});
