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
const [attractionType, setAttractionType] = useState()

  useEffect(() => {
    getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
      setPhoto(response);
      console.log(attraction, 'attraction')
if (attraction.primaryTypeDisplayName){
  console.log(attraction.primaryTypeDisplayName, 'attraction.primaryTypeDisplayName')
  setAttractionType(attraction.primaryTypeDisplayName.text)
}
else{
    const attractionType0 = attraction.types[0]
    console.log(attractionType0)
    setAttractionType(attractionType0)
}
    });
  }, []);


  const seeMoreClick = ({ attraction }) => {
    navigation.navigate("Attraction", { attraction });
  };
  const bucketListClick = ({ attraction }) => {
    postBucketListItem(attraction, user.username, cityName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.attractionTitle}>
        <View> <Text style={styles.titleText}>{attraction.displayName.text}</Text></View>
    
      </View>
      <View style={styles.mainBody}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: photo }} />
        </View>
        <View style={styles.textBody}>
        {attraction.editorialSummary ? (
            <Text style={styles.editorialSummary}>{attraction.editorialSummary.text}</Text>
          ) : null}
          <Text style={styles.rating}>
            Average rating of {attraction.rating} according to{" "}
            {attraction.userRatingCount} reviewers
          </Text>
          {/* <Text>Categories: {attraction.types.join(", ")}</Text>
           */}
<Text style={styles.category}>Category: {attractionType}</Text>
          <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="See more details"
            onPress={() => seeMoreClick({ attraction })}
            disabled={false}
          />
        </View>
        <View style={styles.button}>
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
    borderWidth: 5,
    padding: 10
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10
  },
 
  titleText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
 
  },
  mainBody: {
    flexDirection: "row",
    // borderWidth: 3,
    // borderColor: "red",
    flexWrap: "wrap",
    flex:1
  },
  textBody:{
    flex:3,
    flexWrap: "wrap",
    // borderWidth: 3,
    // borderColor: "purple",
    paddingHorizontal: 20, 
    minWidth: 200,
    height: "auto", 

  }
  ,
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "flex-start",
    alignContent: "flex-end"
  },
  editorialSummary: {
    flex:1,
    marginVertical: 10,
    width: "100%"
  },
  imageBox: {
    // padding: 10,
    justifyContent: "center",
    
    flex: 1,
    height: "auto"
  },
  rating: {
    marginBottom: 10,
    width: "100%"
  },
  category:{
    width: "100%"
  },
  button:{
    margin: 3,
    justifyContent: "center"
  }
});
