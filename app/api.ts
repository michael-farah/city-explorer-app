import axios from "axios";
import Constants from "expo-constants";

const googleMapsApiKey = Constants.expoConfig.extra.googleMapsApiKey;

const cityExplorerAPI = axios.create({
  baseURL: "https://city-explorer-backend-6i2i.onrender.com/api",
});

const googlePlacesAPI = axios.create({
  baseURL: "https://places.googleapis.com/v1",
});

const getAttractionsHeaders = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": googleMapsApiKey,
  "X-Goog-FieldMask":
    "places.name,places.id,places.types,places.nationalPhoneNumber,places.formattedAddress,places.location,places.rating,places.websiteUri,places.regularOpeningHours,places.businessStatus,places.priceLevel,places.userRatingCount,places.displayName.text,places.primaryTypeDisplayName.text,places.photos,places.reviews,places.editorialSummary.text,places.accessibilityOptions",
};

export const getCities = () => {
  return cityExplorerAPI
    .get("/cities")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const getCity = (city) => {
  return cityExplorerAPI
    .get(`/cities/${city}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const getAttractions = (longitude, latitude, radius) => {
    return googlePlacesAPI.post(`/places:searchNearby`, {
        includedTypes: ["art_gallery","museum","performing_arts_theater", "casino", "national_park", "night_club", "park", "tourist_attraction", "visitor_center", "zoo", "ice_cream_shop", "spa", "church", "hindu_temple", "mosque" , "synagogue", "cemetery", "gift_shop", "department_store",  "shopping_mall", "market", "book_store", "athletic_field", "fitness_center","golf_course", "gym", "playground", "ski_resort", "sports_club", "sports_complex", "stadium", "swimming_pool", "amusement_center","amusement_park","aquarium", "bowling_alley", "convention_center", "cultural_center", "dog_park", "hiking_area","historical_landmark", "marina", "movie_theater"
    ],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude},
            radius: radius
          }, 
      }
}, {headers: getAttractionsHeaders})
.catch((err) => {
  console.error(err)
  throw err
})
}

export const getPhoto =(photoReference, maxHeightPx, maxWidthPx)=>{
    let url = `/${photoReference}/media?key=INSERTKEYHERE`;
    if (maxHeightPx) {
        url += `&maxHeightPx=${maxHeightPx}`;
    }
    if (maxWidthPx) {
        url += `&maxWidthPx=${maxWidthPx}`;
    }
    url+= `&skipHttpRedirect=true`;
    return googlePlacesAPI.get(url)
    .then((response) => {
        return response.data.photoUri})
    .catch(err => {
        console.error('Error fetching place photo:', err);
        throw err;
    });
  }
  