import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { getCities } from "@/app/api";

interface BucketCityDropdownProps {
  setCity: (city: string) => void;
  city: string;
  username: string;
}

export default function BucketCityDropdown({
  setCity,
  city,
  username,
}: BucketCityDropdownProps) {
  const [citiesList, setCitiesList] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    getCities(username)
      .then((response) => {
        const data = response.cities.map((city: { city_name: string }) => {
          return { label: city.city_name, value: city.city_name };
        });
        setCitiesList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [username]);

  const handleDropdownChange = (event: { value: string }) => {
    setCity(event.value);
  };

  return (
    <View>
      <Dropdown
        style={styles.background}
        placeholder="Select a City"
        data={citiesList}
        labelField="label"
        valueField="value"
        onChange={handleDropdownChange}
      />
      <Text style={styles.background}>Your city is {city}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: "white" },
});