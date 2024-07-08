import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";
import { AppContext } from "@/app/AppContext";

export default function CityDropdown({navigation}){
    const { cityName, setCityName, user, setUser } = useContext(AppContext);

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
    }, [user])
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
        <Dropdown style={styles.dropdown} placeholder="Select City" data={citiesList} labelField="label" valueField="value" value={cityName} onChange={handleDropdownChange}/>
    </View>)
}

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: "white",
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    }
})