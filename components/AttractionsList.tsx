import { Text, View, Button, FlatList, Image, ScrollView, StyleSheet } from 'react-native';
import { Linking } from 'react-native';



export default function AttractionsList({city, attractions, navigation}){

    console.log(attractions,'attractions')

    const seeMoreClick=({attraction})=>{
        navigation.navigate("Attraction", {attraction})
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text>List:</Text>
                    <View>{attractions.map((attraction)=>{return <View style={styles.attractionCard} key={attraction.id}>
                        <Text>{attraction.displayName.text}</Text>
                        <Text>Average rating {attraction.rating} according to {attraction.userRatingCount} reviewers</Text>
                        {/* put photo here */}
                    {attraction.editorialSummary? <Text>{attraction.editorialSummary.text}</Text> : null}
                        <Text style={{color: 'blue'}} onPress={() => Linking.openURL(
attraction.websiteUri)}>Visit official site</Text>
                        <Text>Categories: {attraction.types.join(", ")}</Text>
                        <Button title='See more details' onPress={()=>seeMoreClick({attraction})} />
                    </View>})}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1}, 
    attractionCard: {margin: 10}
})