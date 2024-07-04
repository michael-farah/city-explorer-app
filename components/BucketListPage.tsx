import { Text, View } from "react-native";
import CityDropdown from "./CityDropdown";
import AttractionsList from "./AttractionsList";
import { useContext, useEffect, useState } from "react";
import { getBucketListItemsByUser, getCity } from "@/app/api";
import { UserContext } from '../app/UserContext';

export default function BucketListPage({navigation}){
    const {user, setUser} = useContext(UserContext)
    const [cityName, setCityName] = useState("London")
    const [bucketListAttractions, setBucketListAttractions] = useState([])
    useEffect(()=>{
        getCity(cityName).then((response)=>{
        getBucketListItemsByUser(user.username, cityName)
        .then(({bucketList})=>{
            if(!bucketList.length){
                setBucketListAttractions([])
            } else {
                setBucketListAttractions(bucketList.map((item)=> {return item.place_json}))
            }
        })
    }).catch((err) => {console.log(err)})
    },[cityName])
    return (<View>
      <CityDropdown setCityName={setCityName}/>
     {bucketListAttractions.length ? <AttractionsList cityName={cityName} attractions={bucketListAttractions} navigation={navigation}/> : <Text>No attractions in your bucket list for {cityName}, go to the home page to add some!</Text>}
    </View>)
}