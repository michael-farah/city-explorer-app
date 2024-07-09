import { Text, StyleSheet } from "react-native";
import CityDropdown from "./CityDropdown";
import AttractionsList from "./AttractionsList";
import { Suspense, useContext, useEffect, useState } from "react";
import { getBucketListItemsByUser } from "@/app/api";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppContext } from "@/app/AppContext";

export default function BucketListPage({navigation}){
    const { user, cityName, bucketListMemo, isBucketListLoading } = useContext(AppContext)
    const { username } = user;

    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="star" style={styles.headerImage} />
        }
      >
        <ThemedView>
          <ThemedView style={styles.top}>

          <ThemedText type="title">Bucket List</ThemedText>
          <ThemedText>Use the dropdown below to see the places in your bucket list for that city.</ThemedText>
   
        <CityDropdown navigation={navigation}/>
        </ThemedView>
      
        
        {isBucketListLoading? <Text>Loading...</Text> : 
        <Suspense fallback={<Text>Loading...</Text>}>
          {bucketListMemo.length ? <AttractionsList cityName={cityName} attractions={bucketListMemo} navigation={navigation}/> : <Text>No attractions in your bucket list for {cityName}, go to the home page to add some or choose another city!</Text>}
        </Suspense>}
        </ThemedView>
      </ParallaxScrollView>)
}

const styles = StyleSheet.create({
    headerImage: {
      color: "#89CFF0",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    top:{
      gap: 30
    }
  });