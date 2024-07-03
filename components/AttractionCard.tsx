import { View, Text, Button, StyleSheet } from "react-native";
import { Linking } from 'react-native';
import { UserContext } from '../app/UserContext';
import { useContext, useState } from 'react';
import { postBucketListItem } from '@/app/api';

export default function AttractionCard({navigation, cityName, attraction}) {
    const {user, setUser} = useContext(UserContext)
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
      <Text>{attraction.displayName.text}</Text>
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
    attractionCard: {margin: 10},
})