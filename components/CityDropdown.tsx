import { Text, View, Platform } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";
import { AppContext } from "@/app/AppContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export default function CityDropdown({navigation}){
    const { cityName, setCityName, user, setUser, bucketListMemo } = useContext(AppContext);

    const [citiesList, setCitiesList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { routes, index } = navigation.getState();
    const currentRoute = routes[index].name;  

    useEffect(()=>{
        if(currentRoute === "Home"){
            getCities()
            .then((response) => {
                setIsLoading(false)
                const data = response.cities.map((city)=> {return {label: city.city_name, value: city.city_name}})
                setCitiesList(data)
            }).catch((err)=>{console.log(err)})
        } else {
            const username = user.username
            getCities(username)
            .then((response) => {
                setIsLoading(false)
                const data = response.cities.map((city)=> {return {label: city.city_name, value: city.city_name}})
                setCitiesList(data)
            }).catch((err)=>{console.log(err)})
        }
    }, [user, bucketListMemo])
    const handleDropdownChange = (event) => {
        setCityName(event.value)
    }
if(isLoading){
    return(
        <ThemedView>
            <ThemedText>City dropdown is loading...</ThemedText>
        </ThemedView>
    )
}

    return (<ThemedView>
        <Dropdown style={styles.dropdown} placeholder="Select City" data={citiesList} labelField="label" valueField="value" value={cityName} onChange={handleDropdownChange}/>
    </ThemedView>)
}

const styles = StyleSheet.create({
    dropdown: {
      ...Platform.select({android: {
        backgroundColor: "white",
        height: 40,
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10        
      }, web: {
          backgroundColor: "white",
          height: 40,
          maxWidth: 200,
          minWidth: 100,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 10,
          padding: 10
      }
    })
    }
})