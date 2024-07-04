import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";

export default function CityDropdown({setCityName, cityListIsLoading}){
    const [citiesList, setCitiesList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        getCities().then((response) => {
            setIsLoading(false)
            const data = response.cities.map((city)=> {return {label: city.city_name, value: city.city_name}})
            setCitiesList(data)
        }).catch((err)=>{console.log(err)})
    }, [])
    const handleDropdownChange = (event) => {
        setCityName(event.value)
    }
if(isLoading){
    return(
        <View>
            <Text>City dropdown is loading...</Text>
        </View>
    )
}

    return (<View>
        <Dropdown style={styles.background} placeholder="Select City" data={citiesList} labelField="label" valueField="value" onChange={handleDropdownChange}/>

    </View>)
}

const styles = StyleSheet.create({
    background: {backgroundColor: "white"}
})