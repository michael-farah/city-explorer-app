import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Linking } from 'react-native';
import { UserContext } from '../app/UserContext';
import { useContext, useState , useEffect } from 'react';
import { postBucketListItem } from '@/app/api';
import { getPhoto } from "@/app/api";

export default function AttractionCard({navigation, cityName, attraction}) {
    const {user, setUser} = useContext(UserContext)
    const [photo, setPhoto] = useState("");

    useEffect(() => {
      getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
        setPhoto(response);
      });
    }, []);
    const seeMoreClick=({attraction})=>{
        navigation.navigate("Attraction", {attraction})
    }
    const bucketListClick=({attraction})=>{
        postBucketListItem(attraction, user.username, cityName)
        // add a way to show the user that they have clicked the button and its working/complete/failed
        console.log("item added to bucket list")
    }

    return (
    <View>
      <Text style={styles.attractionTitle}>{attraction.displayName.text}</Text>
      <Image style={styles.image} source={{ uri: photo }} />
      <Text>
        Average rating {attraction.rating} according to{" "}
        {attraction.userRatingCount} reviewers
      </Text>
      {/* put photo here */}
      {attraction.editorialSummary ? (
        <Text>{attraction.editorialSummary.text}</Text>
      ) : null}
      <Text
        style={{ color: "blue" }}
        onPress={() => Linking.openURL(attraction.websiteUri)}
      >
        Visit official site
      </Text>
      <Text>Categories: {attraction.types.join(", ")}</Text>
      <Button
        title="See more details"
        onPress={() => seeMoreClick({ attraction })}
        disabled={false}
      />
      <Button
        title="Add to Bucket List"
        onPress={() => bucketListClick({ attraction })}
        disabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    attractionCard: {margin: 10},    image: {
      width: 150,
      height:150,
      margin: 20,
      alignSelf: "center"
    },
    attractionTitle: {
      fontWeight: "bold"
    }
})