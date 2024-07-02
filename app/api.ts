import axios from 'axios'

const cityExplorerAPI = axios.create({
    baseURL: "https://city-explorer-backend-6i2i.onrender.com/api"
})

const googlePlacesAPI = axios.create({
    baseURL: "https://places.googleapis.com/v1"
})

const getAttractionsHeaders = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": "API KEY HERE",
    "X-Goog-FieldMask": "places.name,places.id,places.types,places.nationalPhoneNumber,places.formattedAddress,places.location,places.rating,places.websiteUri,places.regularOpeningHours,places.businessStatus,places.priceLevel,places.userRatingCount,places.displayName.text,places.primaryTypeDisplayName.text,places.photos,places.reviews,places.editorialSummary.text,places.accessibilityOptions"
}

export const getCities = () => {
    return cityExplorerAPI.get('/cities').then((response)=>{
        return response.data
    }).catch((err)=>{
        console.error(err)
        throw err
    })
}

export const getCity = (city) => {
    return cityExplorerAPI.get(`/cities/${city}`).then((response)=>{
        return response.data
    }).catch((err)=>{
        console.error(err)
        throw err
    })
}

export const getAttractions = (longitude, latitude, radius) => {
    return googlePlacesAPI.post(`/places:searchNearby`, {
        includedTypes: [],
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