import { View, Text, StyleSheet , TextInput} from 'react-native'
import { useEffect, useContext, useState } from 'react'
import React from 'react'
import { getCity, getSearchPlaces } from '@/app/api'
import { AppContext } from '@/app/AppContext'
import { ThemedText } from './ThemedText'
import { getAttractions } from '@/app/api'
import { ThemedView } from './ThemedView'
import ThemedTextInput from './ThemedTextInput'


export default function AttractionSearchByName ({setAttractions, text, setText, searchTerm, setSearchTerm, gobbledigook, setGobbledigook})  {

const { cityName, setCityName } = useContext(AppContext);


useEffect(()=>{
  if(text===""){
    setSearchTerm("")
  }
}, [text])

useEffect(()=>{
if(gobbledigook){
    setText("")
}
}, [gobbledigook])

  return (
    <ThemedView>
        <View style={styles.intro}>
        <View style = {styles.question}>
        <ThemedText type="defaultSemiBold" >Not sure where to start?</ThemedText><ThemedText type="default">Leave the search box below blank for a surprise list of popular attractions in your chosen city.
        </ThemedText></View>
<View style = {styles.question}><ThemedText type="defaultSemiBold">OR...already know where you're going?</ThemedText>
<ThemedText type="default">Search for it below and hit enter!
        </ThemedText>
        </View>
        </View>
        
      <ThemedTextInput style={styles.input} onChangeText= {(value)=>setText(value)} onSubmitEditing={(value)=> setSearchTerm(value.nativeEvent.text)} value={text} placeholder="Search here..."/>
      <View>
        {gobbledigook ? (<ThemedText>Sorry, we can't find a place matching that search, please try something else.</ThemedText>): null}
      </View>

    </ThemedView>
  )
}

const styles = StyleSheet.create(
  {input: {
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