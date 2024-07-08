import axios from "axios";
import Constants from "expo-constants";

const googleMapsApiKey = Constants.expoConfig.extra.googleMapsApiKey;

const cityExplorerAPI = axios.create({
  baseURL: "https://city-explorer-backend-6i2i.onrender.com/api",
});

const googlePlacesAPI = axios.create({
  baseURL: "https://places.googleapis.com/v1",
});

const googleRoutesAPI = axios.create({
  baseURL: "https://routes.googleapis.com",
});

const getRoutesHeaders = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": googleMapsApiKey,
  "X-Goog-FieldMask":
    "routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex",
};

const getAttractionsHeaders = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": googleMapsApiKey,
  "X-Goog-FieldMask":
    "places.name,places.id,places.types,places.nationalPhoneNumber,places.formattedAddress,places.location,places.rating,places.websiteUri,places.regularOpeningHours,places.businessStatus,places.priceLevel,places.userRatingCount,places.displayName.text,places.primaryTypeDisplayName.text,places.photos,places.reviews,places.editorialSummary.text,places.accessibilityOptions",
};

export const getCities = (username: string) => {
  return cityExplorerAPI
    .get("/cities", { params: { username } })
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const getCity = (city: string) => {
  return cityExplorerAPI
    .get(`/cities/${city}`)
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const getAttractions = (
  longitude: number,
  latitude: number,
  radius: number
) => {
  return googlePlacesAPI
    .post(
      `/places:searchNearby`,
      {
        includedTypes: [
          "art_gallery",
          "museum",
          "performing_arts_theater",
          "casino",
          "national_park",
          "night_club",
          "park",
          "tourist_attraction",
          "visitor_center",
          "zoo",
          "ice_cream_shop",
          "spa",
          "church",
          "hindu_temple",
          "mosque",
          "synagogue",
          "cemetery",
          "gift_shop",
          "department_store",
          "shopping_mall",
          "book_store",
          "athletic_field",
          "fitness_center",
          "golf_course",
          "gym",
          "playground",
          "ski_resort",
          "sports_club",
          "sports_complex",
          "stadium",
          "swimming_pool",
          "amusement_center",
          "amusement_park",
          "aquarium",
          "bowling_alley",
          "convention_center",
          "cultural_center",
          "dog_park",
          "hiking_area",
          "historical_landmark",
          "marina",
          "movie_theater"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: radius,
          },
        },
      },
      { headers: getAttractionsHeaders },
    )
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const getAttractionsWithType = (
  longitude: number,
  latitude: number,
  radius: number,
  type: Array<string> 
) => {
  return googlePlacesAPI
    .post(
      `/places:searchNearby`,
      {
        includedPrimaryTypes: type,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: radius,
          },
        },
      },
      { headers: getAttractionsHeaders },
    )
    .catch((err) => {
      console.error(err);
      throw err;
    });
};




export const getPhoto = (
  photoReference: string,
  maxHeightPx: number,
  maxWidthPx: number,
) => {
  let url = `/${photoReference}/media?key=${googleMapsApiKey}`;
  if (maxHeightPx) {
    url += `&maxHeightPx=${maxHeightPx}`;
  }
  if (maxWidthPx) {
    url += `&maxWidthPx=${maxWidthPx}`;
  }
  url += `&skipHttpRedirect=true`;
  return googlePlacesAPI
    .get(url)
    .then((response) => response.data.photoUri)
    .catch((err) => {
      console.error("Error fetching place photo:", err);
      throw err;
    });
};

export const getBucketListItemsByUser = (
  username: string,
  city_name: string,
) => {
  return cityExplorerAPI
    .get(`/bucket_list/${username}`, { params: { city_name } })
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
export const postBucketListItem = (
  attraction: any,
  username: string,
  cityName: string,
) => {
  return cityExplorerAPI
    .post(`/bucket_list`, {
      place_displayname: attraction.displayName.text,
      place_json: attraction,
      city_name: cityName,
      username: username,
    })
    .then((response) => {
      if (!response.data) {
        throw new Error("Invalid response structure");
      }
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const deleteBucketListItem = (attraction, username, cityName) => {
  getBucketListItemsByUser(username, cityName).then((response) => {
    const bucketListItems = response.bucketList;
    let bucketListId;
    for (let i = 0; i < bucketListItems.length; i++) {
      if (bucketListItems[i].place_json.id === attraction.id) {
        bucketListId = Number(bucketListItems[i].bucket_list_id);
      }
    }
    return cityExplorerAPI
      .delete(`bucket_list/${bucketListId}`)
      .catch((err) => {
        console.error(err)
        throw err
      })
    })
  }

  
  
export const getRoutes = (
  origin: LatLng,
  destination: LatLng,
  intermediates: LatLng[],
  transport: string ,
) => {
  const intermediateWaypoints = intermediates.map((coordinate) => ({
    location: {
      latLng: coordinate,
    },
    via: false,
  }));

  return googleRoutesAPI
    .post(
      `/directions/v2:computeRoutes`,
      {
        origin: {
          location: {
            latLng: origin,
          },
        },
        destination: {
          location: {
            latLng: destination,
          },
        },
        intermediates: intermediateWaypoints,
        travelMode: transport,
        // routingPreference: "TRAFFIC_UNAWARE",
        optimizeWaypointOrder: true,
      },
      { headers: getRoutesHeaders },
    )
    .then((response) => {
      console.log(response, 'response from routes')
      return response.data})
    .catch((err) => {
      console.error("Error fetching routes:", err);
      throw err;
    });
};

  export const getSearchPlaces = (rectangle, text)=>{
    return googlePlacesAPI.post(`/places:searchText`, {
      textQuery: `${text}`,
      locationRestriction: {
        rectangle: rectangle
      },
      maxResultCount: 20,
    }, {headers: getAttractionsHeaders}
  )
  .catch((err) => {
    console.error(err)
    throw err
  })
  }