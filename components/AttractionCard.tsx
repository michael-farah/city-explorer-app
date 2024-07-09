import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import { useContext, useState, useEffect } from "react";
import { deleteBucketListItem } from "@/app/api";
import { getPhoto } from "@/app/api";
import { RotateInDownLeft } from "react-native-reanimated";
import { AppContext } from "@/app/AppContext";
import { ThemedText } from "./ThemedText";
import AddToBucketListButton from "./AddToBucketListButton";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemedView } from "./ThemedView";

export default function AttractionCard({ navigation, attraction }) {
  const { cityName, user, setBucketListAttractions } = useContext(AppContext);
  const [photo, setPhoto] = useState("");
  const [attractionType, setAttractionType] = useState();
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seeMoreClicked, setSeeMoreClicked] = useState(false);

  useEffect(() => {
    setIsDeleting(false);
    setSeeMoreClicked(false);
    if (attraction.accessibilityOptions) {
      setAccessibilityFeatures((features) => {
        const accessibilityKeys = Object.keys(attraction.accessibilityOptions);
        const trueAccessibilityKeys = accessibilityKeys.filter((key) => {
          return attraction.accessibilityOptions[key] === true;
        });
        const spacedTrueAccessibilityKeys = trueAccessibilityKeys.map((key) => {
          const result = key.replace(/([A-Z])/g, " $1");
          return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
        });
        const anglicisedSpacedTrueAccessibilityKeys =
          spacedTrueAccessibilityKeys.map((key) => {
            if (key === "Wheelchair accessible restroom") {
              return "Wheelchair accessible toilet";
            } else {
              return key;
            }
          });
        return anglicisedSpacedTrueAccessibilityKeys;
      });
    }
    if (attraction.photos) {
      getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
console.log(response, 'photo')
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
    setSeeMoreClicked(true);
    navigation.navigate("Attraction", { attraction });
    setSeeMoreClicked(false);
  };
  const removeFromBucketListClick = ({ attraction }) => {
    setIsDeleting(true);
    deleteBucketListItem(attraction, user.username, cityName);
    setBucketListAttractions((currAttractions) =>
      currAttractions.filter((item) => item.id !== attraction.id)
    );
    setIsDeleting(false);
  };

  const { routes, index } = navigation.getState();
  const currentRoute = routes[index].name;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.attractionTitle}>
          <ThemedText style={styles.titleText}>
            {attraction.displayName.text}
          </ThemedText>
      </View>
      <View style={styles.mainBody}>
        <View style={styles.imageBox}>
          {photo?  <Image style={styles.image} source={{uri: photo }} alt={`photo of ${attraction.displayName.text}`}/> : <Icon name="photo" size={170} color="#B8E2F2"/>}
         
        </View>
        <View style={styles.textAndButtonsBody}>
          <View style={styles.textBody}>
            {attraction.editorialSummary ? (
              <View>
                <ThemedText style={styles.editorialSummary}>
                  {attraction.editorialSummary.text}
                </ThemedText>
              </View>
            ) : null}
            <View style={styles.details}>
            <View>
              <ThemedText><ThemedText type="defaultSemiBold">Address: </ThemedText>{attraction.formattedAddress}</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.category}>
                <ThemedText type="defaultSemiBold">Primary category: </ThemedText>{attractionType}
              </ThemedText>
            </View>
            <View>
              <ThemedText>
                {accessibilityFeatures.length ? (
                  <ThemedText>
                   <ThemedText type="defaultSemiBold">Wheelchair facilities:</ThemedText> {accessibilityFeatures.join(", ")}
                  </ThemedText>
                ) : null}
              </ThemedText>
            </View>
            {attraction.rating ? (
              <View>
                <ThemedText style={styles.rating}>
                  <ThemedText type="defaultSemiBold">Average rating:</ThemedText> {attraction.rating} according to{" "}
                  {attraction.userRatingCount > 1
                    ? `${attraction.userRatingCount.toLocaleString(
                        "en-US"
                      )} reviewers`
                    : `${attraction.userRatingCount.toLocaleString(
                        "en-US"
                      )} reviewer`}
                </ThemedText>
              </View>
            ) : null}
          </View>
          <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="See more details"
              onPress={() => seeMoreClick({ attraction })}
              disabled={seeMoreClicked ? true : false}
            />
          </View>
          <View style={styles.button}>
            {currentRoute === "BucketList" ? (
              <Button
                title="Delete from Bucket List"
                onPress={() => removeFromBucketListClick({ attraction })}
                disabled={isDeleting ? true : false}
              />
            ) : (
              <AddToBucketListButton attraction={attraction} />
            )}
          </View>
          </View>
        </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
 
  container: {
    marginVertical: 20,
    flex: 1,
    padding: "3%",
    // backgroundColor: "white",
    borderRadius: 15,
    gap:10,
    borderWidth: 5,
    borderColor: "#89CFF0",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  textBody: {
    display: "flex",
    gap: 30

  }
,
  titleText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  mainBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: 30
  },
  textAndButtonsBody: {
    flex: 5,
    flexWrap: "wrap",
    flexBasis: 300,
    height: "auto",
    justifyContent: "space-between"
  },
  details: {
    // marginHorizontal: 50,
    display: "flex",
    gap: 10

  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "flex-start",
    gap: 15,
    // marginHorizontal: 50
  },
  editorialSummary: {
    flex: 1,
    width: "100%",
    fontWeight: "bold",
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: "auto",
    flexBasis: 200,
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
    justifyContent: "center",
  }});
