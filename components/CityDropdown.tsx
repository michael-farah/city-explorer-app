import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";

export default function CityDropdown({setCityName}){
    const [citiesList, setCitiesList] = useState([])

    useEffect(()=>{
        getCities().then((response) => {
            const data = response.cities.map((city)=> {return {label: city.city_name, value: city.city_name}})
            setCitiesList(data)
        }).catch((err)=>{console.log(err)})
    }, [])
    const handleDropdownChange = (event) => {
        setCityName(event.value)
    }
    return (<View>
        <Dropdown style={styles.background} placeholder="Select a City" data={citiesList} labelField="label" valueField="value" onChange={handleDropdownChange}/>

    </View>)
}

const styles = StyleSheet.create({
    background: {backgroundColor: "white"}
})