import { View, Text, StyleSheet, Image, Dimensions, Platform } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useEffect } from "react";
import { getPhoto } from "@/app/api";
import { useState } from "react";
import { ThemedText } from "./ThemedText";
import AddToBucketListButton from "./AddToBucketListButton";
import Icon from "react-native-vector-icons/FontAwesome";
import { ThemedView } from "./ThemedView";

export default function AttractionPage({ route, navigation }) {
  const { attraction } = route.params;
  const [photo, setPhoto] = useState("");

  const [styles, setStyles] = useState(calculateStyles());
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([]);
  useEffect(() => {
    const onChange = ({window}) => {
      setStyles(calculateStyles(window.width));
    };
    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription?.remove();
    };
  }, []);
  useEffect(() => {
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
      });
    }
  }, []);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#faf7f0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.container}>
        <View style={styles.mainBlock}>
          <View style={styles.mystery}>
            <ThemedText type="title" style={styles.boldText}>
              {attraction.displayName.text}
            </ThemedText>
            <View style={styles.imageAndText}>
            
                {photo ? (<View style={
                  styles.imageContainer
                }>
                  <Image style={styles.image} source={{ uri: photo }} alt={`photo of ${attraction.displayName.text}`} />
                </View>) : ( <View style= {styles.altImageContainer}> 
                  <Image style={styles.altImage} source={require=("../../assets/images/image-outline.svg")} alt={`placeholder for attraction image`} />
                  </View>)}
              {/* </View> */}
              <View style={styles.mainTextBody}>
                    {attraction.editorialSummary &&
                    attraction.editorialSummary.text
                      ? <View style={styles.summaryBlock}><ThemedText type="defaultSemiBold">
                   {attraction.editorialSummary.text}
                   </ThemedText>
                </View> : null}
                 
                <View style={styles.addressAndphone}>
                  <View style={styles.address}>
                    <ThemedText type="defaultSemiBold">
                      Address:
                      <ThemedText style={styles.regularText}>
                        {" "}
                        {attraction.formattedAddress}
                      </ThemedText>
                    </ThemedText>
                  </View>
                  <View style={styles.phone}>
                    {attraction.nationalPhoneNumber ? (
                      <ThemedText type="defaultSemiBold">
                        Phone number:
                        <ThemedText style={styles.regularText}>
                          {" "}
                          {attraction.nationalPhoneNumber}
                        </ThemedText>
                      </ThemedText>
                    ) : null}
                  </View>
                </View>
                {attraction.regularOpeningHours ? (
                  <View style={styles.openingHours}>
                    <ThemedText type="defaultSemiBold">
                      Opening hours:{"\n"}
                      <ThemedText style={styles.regularText}>
                        {attraction.regularOpeningHours.weekdayDescriptions.join(
                          "\n"
                        )}
                      </ThemedText>
                    </ThemedText>
                  </View>
                ) : null}
              
                  {accessibilityFeatures.length ? (  <View style={styles.accessibility}>
                    <ThemedText type="defaultSemiBold">
                      Wheelchair facilities:{" "}
                      <ThemedText style={styles.regularText}>
                        {accessibilityFeatures.join(", ")}
                      </ThemedText>
                    </ThemedText>
                    </View>) : null}
               
              </View>
              <View style={styles.websiteAndButton}>
                {attraction.websiteUri ? (
                  <View style={styles.website}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: "white" }}
                      onPress={() => Linking.openURL(attraction.websiteUri)}
                    >
                      Visit official site
                    </ThemedText>
                  </View>
                ) : null}
                <AddToBucketListButton attraction={attraction} />
              </View>
            </View>
          </View>
          {attraction.rating ? (
            <View style={styles.reviewBox}>
              <ThemedText type="title" style={styles.boldThemedText}>
                Reviews
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Average user rating: {attraction.rating}{" "}
                <ThemedText style={styles.regularText}>
                  from {attraction.userRatingCount.toLocaleString("en-US")}{" "}
                  users
                </ThemedText>
              </ThemedText>
              {attraction.reviews ? (
                attraction.reviews.map((review) => {
                  return (
                    <View key={review.name} style={styles.review}>
                      <ThemedText style={styles.user}>
                        {review.authorAttribution.displayName} visited on{" "}
                        {review.publishTime.slice(0, 10)}
                      </ThemedText>
                      {review.text ? (
                        <ThemedText style={styles.reviewText}>
                          {review.text.text}
                        </ThemedText>
                      ) : null}
                      <ThemedText type="defaultSemiBold">
                        Rating: {review.rating}/5{" "}
                      </ThemedText>
                    </View>
                  );
                })
              ) : (
                <ThemedText> "none available" </ThemedText>
              )}
            </View>
          ) : null}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const calculateStyles = (screenWidth = Dimensions.get("window").width) => {
  const isSmallScreen = screenWidth < 550;
  const isLargeScreen = screenWidth >= 550;
  return StyleSheet.create({
  headerImage: {
    color: "#89CFF0",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  container: {
    ...(isLargeScreen && {
      flexDirection: "column",
      height: "100%",
      minWidth: 310,
      borderWidth: 8,
      borderRadius: 30,
      borderColor: "yellow"
    })
   
  },
  mainBlock: {
    borderRadius: 10,
    padding: "5%",
  },

  imageAndText: {
    flexDirection: "column",
  },
  
  mainTextBody: {
    gap: 20,
  },
  
  boldText: {
    fontWeight: "bold",
    fontSize: 50,
    lineHeight: 50,
  },
  summaryBlock: {
  },
  addressAndphone: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    ...(isLargeScreen&& {flexDirection: "row",
      justifyContent: "space-between"})
  
   },
   openingHours: {
  },
  accessibility: {
  },
  address: {
    ...Platform.select({android: {}, web: {
      flex: 1,
      flexBasis: "auto",
      flexShrink: 1,
      flexWrap: "wrap",
  }}),
  },
  phone: {
    flex: 1,
    flexBasis: "auto",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  regularText: {
    fontWeight: "normal",
  },
  reviewBox: {
    borderWidth: 8,
      borderRadius: 30,
      padding: "5%",
      borderColor: "#89CFF0",
      backgroundColor: "#FFFFF",
      ...(isLargeScreen? {
        margin: "3%",
        marginTop: 30,
      }: {
        margin: "1%",
        marginTop: "5%",
      })
  },
  imageContainer: { 
    ...Platform.select({android: {
      alignSelf: "center",
      borderRadius: 5,
      height: 250,
      marginVertical: "8%",
    }, web: {
      alignSelf: "center",
      borderRadius: 5,
      minHeight: 150, 
      maxWidth: 400,
      width: "80%",
      marginVertical: 50,
    }}),
},
altImageContainer: {
  ...Platform.select({android: {
    alignSelf: "center",
    borderRadius: 5,
    height: 250,
    marginVertical: "8%",
  }, web:{
    alignSelf: "center",
    minHeight: 150, 
    maxWidth: 300,
    width: "80%",
    marginVertical: 10,
  }})
},
  image: {
    borderColor: "#89CFF0",
    borderWidth: 8,
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 5
  },
  altImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
  },
  user: {
    fontWeight: "bold",
  },
 
  websiteAndButton: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center"
  },
  website: {
    backgroundColor: "#89CFF0",
    padding: 6,
    borderRadius: 10,
  height: 45,
    borderColor: "yellow",
    borderWidth: 5
  },
  review: {
    marginVertical: 15,
  },
});}
