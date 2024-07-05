import { View, Text, StyleSheet , TextInput} from 'react-native'
import { useEffect, useContext, useState } from 'react'
import React from 'react'
import { getCity, getSearchPlaces } from '@/app/api'
import { CityContext } from '@/app/CityContext'
import { ThemedText } from './ThemedText'
import { getAttractions } from '@/app/api'

export default function AttractionSearchByName ({setAttractions, setIsSearchTerm})  {
const { cityName, setCityName } = useContext(CityContext);
const [text, setText] = useState("")
const[searchTerm, setSearchTerm] = useState("")
const [gobbledigook, setGobbledigook] = useState(false)

useEffect(()=>{
  if(searchTerm){
        setGobbledigook(false)
        setIsSearchTerm(true)
        getCity(cityName).then(({city})=>{
           return getSearchPlaces(city.city_latitude, city.city_longitude, city.city_radius, searchTerm)
        }).then(({data})=>{
            console.log(data)
            if(data.places){
            setAttractions(data.places)}
else { setGobbledigook(true)}
        })
    }
    else{
      setIsSearchTerm(false)
    }
}, [searchTerm]
)

useEffect(()=>{
  if(text===""){
    setIsSearchTerm(false)
    setSearchTerm("")
  }
}, [text])



useEffect(()=>{
if(gobbledigook){
    setText("")
}
}, [gobbledigook])

  return (
    <View>
        <View style={styles.intro}>
        <View style = {styles.question}>
        <ThemedText type="defaultSemiBold" >Not sure where to start?</ThemedText><ThemedText type="default">Leave the search box below blank for a surprise list of popular attractions in your chosen city.
        </ThemedText></View>
<View style = {styles.question}><ThemedText type="defaultSemiBold">OR...already know where you're going?</ThemedText>
<ThemedText type="default">Search for it below and hit enter!
        </ThemedText>
        </View>
        </View>
        
      <TextInput style={styles.input} onChangeText= {(value)=>setText(value)} onSubmitEditing={(value)=> setSearchTerm(value.nativeEvent.text)} value={text} placeholder="Search for places by name or type..."/>
      <View>
        {gobbledigook ? (<Text>Sorry, we can't find a place matching that search, please try something else.</Text>): null}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({input: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10
  },
  intro:{
    flex: 1
  }, 
  question:{
    marginVertical: 10
  }
})