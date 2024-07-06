import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import { useContext, useState, useEffect } from "react";
import { deleteBucketListItem } from "@/app/api";
import { getPhoto } from "@/app/api";
import { RotateInDownLeft } from "react-native-reanimated";
import { AppContext } from "@/app/AppContext";
import { ThemedText } from "./ThemedText";
import AddToBucketListButton from "./AddToBucketListButton";

export default function AttractionCard({ navigation, attraction }) {
  const { cityName, user, setBucketListAttractions } = useContext(AppContext);
  const [photo, setPhoto] = useState("");
  const [attractionType, setAttractionType] = useState();
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [seeMoreClicked, setSeeMoreClicked] = useState(false)

  useEffect(() => {
    setIsDeleting(false)
    setSeeMoreClicked(false)
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
    if (attraction.photos) {
      getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
        setPhoto(response);
        if (attraction.primaryTypeDisplayName) {
          setAttractionType(attraction.primaryTypeDisplayName.text);
        } else {
          const attractionType0 = attraction.types[0];
          const capitalisedAttractionType =
            attractionType0.charAt(0).toUpperCase() + attractionType0.slice(1);
          const spacedAttractionType = capitalisedAttractionType
            .split("_")
            .join(" ");
          setAttractionType(spacedAttractionType);
        }
      });
    } else {
      if (attraction.primaryTypeDisplayName) {
        setAttractionType(attraction.primaryTypeDisplayName.text);
      } else {
        const attractionType0 = attraction.types[0];
        const capitalisedAttractionType =
          attractionType0.charAt(0).toUpperCase() + attractionType0.slice(1);
        const spacedAttractionType = capitalisedAttractionType
          .split("_")
          .join(" ");
        setAttractionType(spacedAttractionType);
      }
    }
  }, [cityName]);

  const seeMoreClick = ({ attraction }) => {
    setSeeMoreClicked(true)
    navigation.navigate("Attraction", { attraction });
    setSeeMoreClicked(false)
  };
  const removeFromBucketListClick = ({ attraction }) => {
    setIsDeleting(true)
    deleteBucketListItem(attraction, user.username, cityName)
    setBucketListAttractions((currAttractions)=> currAttractions.filter((item)=> item.id !== attraction.id))
    setIsDeleting(false)
  };

  const { routes, index } = navigation.getState();
  const currentRoute = routes[index].name;

  return (
    <View style={styles.container}>
      <View style={styles.attractionTitle}>
        <View>
          {" "}
          <ThemedText style={styles.titleText}>{attraction.displayName.text}</ThemedText>
        </View>
      </View>
      <View style={styles.mainBody}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: photo }} />
        </View>
        <View style={styles.textAndButtonsBody}>
          <View style={styles.textBody}> 
          {attraction.editorialSummary ? (
            <View><ThemedText style={styles.editorialSummary}>
              {attraction.editorialSummary.text}
            </ThemedText></View>
          ) : null}
           <View><ThemedText>Address: {attraction.formattedAddress}</ThemedText></View>
           <View><ThemedText style={styles.category}>Primary category: {attractionType}</ThemedText></View>
<View>
<ThemedText>{accessibilityFeatures.length? (<ThemedText>Wheelchair facilities: {accessibilityFeatures.join(", ")}</ThemedText> ): null}</ThemedText>
</View>

          {attraction.rating ? (
            <View><ThemedText style={styles.rating}>
              Average rating of {attraction.rating} according to{" "}
{attraction.userRatingCount>1? ( `${attraction.userRatingCount.toLocaleString('en-US')} reviewers`): (`${attraction.userRatingCount.toLocaleString('en-US')} reviewer`)}

              
            </ThemedText></View>
          ) : null}

              </View>
          <View style={styles.buttonContainer}>
            </View>
            <View style={styles.button}>
              <Button
                title="See more details"
                onPress={() => seeMoreClick({ attraction })}
                disabled={seeMoreClicked?true:false}
              />
            </View>
            <View style={styles.button}>
              {currentRoute === "BucketList" ? (
                <Button
                  title="Delete from Bucket List"
                  onPress={() => removeFromBucketListClick({ attraction })}
                  disabled={isDeleting?true:false}
                />
              ) : (
                <AddToBucketListButton attraction={attraction}/>
              )}
            </View>
    
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  titleText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  mainBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  textAndButtonsBody: {
    flex: 3,
    flexWrap: "wrap",
    paddingHorizontal: 20,
    minWidth: 200,
    height: "auto",
    justifyContent: "space-between",
  }
  ,
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "flex-start",
    alignContent: "flex-end",
  },
  editorialSummary: {
    flex: 1,
    width: "100%",
   fontWeight: "bold"
  },
  imageBox: {
    justifyContent: "center",
    flex: 1,
    height: "auto",
  },
  rating: {
    flex: 1,
    width: "100%",
  },
  category: {
    flex: 1,
    width: "100%",
  },
  button: {
    margin: 3,
    justifyContent: "center",
  },
});
