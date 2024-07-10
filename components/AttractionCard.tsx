import { View, Text, Button, StyleSheet, Image, Platform } from "react-native";
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
    ...Platform.select({android: {
      marginVertical: 20,
      flex: 1,
      borderRadius: 30,
      padding: 20,
      gap:10,
      borderWidth: 8,
      borderColor: "#FBAED2"
    }, web: {
      marginVertical: 20,
      flex: 1,
      borderRadius: 30,
      padding: 20,
      gap:10,
      borderWidth: 8,
      borderColor: "#FBAED2"
    }}),
  },
  image: {
    ...Platform.select({android: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 4,
      borderColor:"#89CFF0",
    }, web: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 4,
      borderColor:"#89CFF0",
    }}),
  },
  textBody: {
    ...Platform.select({android: {
      display: "flex",
      gap: 30
    }, web: {
      display: "flex",
      gap: 30
  }}),
  },
  titleText: {
    ...Platform.select({android: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
    }, web: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
  }}),
  },
  mainBody: {
    ...Platform.select({android: {
      flexWrap: "wrap",
      flex: 1,
      gap: 30
    }, web: {
      flexDirection: "row",
      flexWrap: "wrap",
      flex: 1,
      gap: 30
  }}),
  },
  textAndButtonsBody: {
    ...Platform.select({android: {
      flex: 1,
      flexWrap: "wrap",
      height: "auto",
      justifyContent: "space-between"
    }, web: {
      flex: 5,
      flexWrap: "wrap",
      flexBasis: 300,
      height: "auto",
      justifyContent: "space-between"
  }}),
  },
  details: {
    ...Platform.select({android: {
      display: "flex",
      gap: 10
    }, web: {
      display: "flex",
      gap: 10
  }}),
  },
  buttonContainer: {
    ...Platform.select({android: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
      justifyContent: "center",
      gap: 15,
    }, web: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
      justifyContent: "flex-start",
      gap: 15,
  }}),
  },
  editorialSummary: {
    ...Platform.select({android: {
      fontWeight: "bold",
    }, web: {
      flex: 1,
      width: "100%",
      fontWeight: "bold",
  }}),
  },
  imageBox: {
    ...Platform.select({android: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      height: "auto",
      flexBasis: 200,
    }, web: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      height: "auto",
      flexBasis: 200,
  }}),
  },
  rating: {
    ...Platform.select({android: {}, web: {
      flex: 1,
      width: "100%",
  }}),
  },
  category: {
    ...Platform.select({android: {}, web: {
    flex: 1,
    width: "100%",
  }}),
  },
  button: {
    ...Platform.select({android: {}, web: {
    justifyContent: "center",
  }}),
  }});
