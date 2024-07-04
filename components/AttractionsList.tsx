import { Text, View, FlatList, Image, ScrollView, StyleSheet } from 'react-native';

import AttractionCard from './AttractionCard';

export default function AttractionsList({navigation, cityName, attractions}){

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                <Text>Attractions for {cityName}:</Text>
                    <View>{attractions.map((attraction)=>{return <View style={styles.attractionCard} key={attraction.id}>
                        <AttractionCard navigation={navigation} cityName={cityName} attraction={attraction}/>
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