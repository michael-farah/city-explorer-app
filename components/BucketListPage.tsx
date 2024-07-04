import { View } from "react-native";
import CityDropdown from "./CityDropdown";
import AttractionsList from "./AttractionsList";
import { useState } from "react";

export default function BucketListPage({cityName}){
    const [bucketListAttractions, setBucketListAttractions] = useState()

    return (<View>
        <CityDropdown />
        {/* <AttractionsList /> */}
    </View>)
}