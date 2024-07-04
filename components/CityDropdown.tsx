import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";
import { CityContext } from "@/app/CityContext";

export default function CityDropdown(){
    const { cityName, setCityName } = useContext(CityContext);

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
        <Dropdown style={styles.background} placeholder="Select City" data={citiesList} labelField="label" valueField="value" value={cityName} onChange={handleDropdownChange}/>

    </View>)
}

const styles = StyleSheet.create({
    background: {backgroundColor: "white"}
})