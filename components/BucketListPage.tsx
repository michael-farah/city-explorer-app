import { Text, StyleSheet } from "react-native";
import CityDropdown from "./CityDropdown";
import AttractionsList from "./AttractionsList";
import { useContext, useEffect, useState } from "react";
import { getBucketListItemsByUser, getCity } from "@/app/api";
import { UserContext } from '../app/UserContext';
import { CityContext } from "@/app/CityContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BucketListPage({navigation}){
    const { user } = useContext(UserContext)
    const { username } = user;
    const { cityName } = useContext(CityContext);
    const [bucketListAttractions, setBucketListAttractions] = useState([])
    useEffect(()=>{
        getBucketListItemsByUser(username, cityName)
        .then(({bucketList})=>{
            if(!bucketList.length){
                setBucketListAttractions([])
            } else {
                setBucketListAttractions(bucketList.map((item)=> {return item.place_json}))
            }
    }).catch((err) => {console.log(err)})
    },[cityName, username])

    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="star" style={styles.headerImage} />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Bucket List</ThemedText>
        </ThemedView>
        <ThemedText>Welcome to the Bucket List:</ThemedText>
        <CityDropdown navigation={navigation}/>
        {bucketListAttractions.length ? <AttractionsList cityName={cityName} attractions={bucketListAttractions} navigation={navigation}/> : <Text>No attractions in your bucket list for {cityName}, go to the home page to add some or choose another city!</Text>}
      </ParallaxScrollView>)
}

const styles = StyleSheet.create({
    headerImage: {
      color: "#FF4D4D",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 8,
    },
  });