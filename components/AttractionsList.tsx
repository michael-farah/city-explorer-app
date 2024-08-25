import { Text, View, FlatList, Image, ScrollView, StyleSheet, Platform } from 'react-native';
import { useEffect , useState} from 'react';
import { ThemedText } from './ThemedText';
import { ReverseThemedText } from './ReverseThemedText';
import AttractionCard from './AttractionCard';


export default function AttractionsList({navigation, cityName, attractions, accessibleOnly}){

const [wheelchairAccessibleAttractions, setWheelChairAccessibleAttractions] = useState([])

    useEffect(() => {
          setWheelChairAccessibleAttractions(attractions.filter((attraction) => {
              return (
                attraction.accessibilityOptions &&
                attraction.accessibilityOptions.wheelchairAccessibleEntrance ===
                  true &&
                attraction.accessibilityOptions.wheelchairAccessibleRestroom ===
                  true
              );
            }))
        }
      , [attractions]);


    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                <ThemedText style={styles.topText} type="subtitle" >Showing { accessibleOnly ? wheelchairAccessibleAttractions.length : attractions.length} attractions for {cityName}:</ThemedText>
                {/* //fix 'attraction / attractions here' */}
{accessibleOnly? <View>{wheelchairAccessibleAttractions.map((attraction)=>{return <View style={styles.attractionCard} key={attraction.id}>
                        <AttractionCard navigation={navigation} cityName={cityName} attraction={attraction}/>
                    </View>})}
                    </View>: <View>{attractions.map((attraction)=>{return <View style={styles.attractionCard} key={attraction.id}>
                        <AttractionCard navigation={navigation} cityName={cityName} attraction={attraction}/>
                    </View>})}
                    </View>}

                    


                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1,
        ...Platform.select({android: {padding: 0}, web: {padding: "5%"}}),
    }
})