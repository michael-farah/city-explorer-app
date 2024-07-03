import { Text, View, Button, FlatList, Image, ScrollView, StyleSheet } from 'react-native';


export default function AttractionsList({city, attractions}){
    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text>List:</Text>
                    <View>{attractions.map((attraction)=>{return <View key={attraction.id}>
                        <Text>{attraction.displayName.text}</Text>
                        <Text>Average rating {attraction.rating} according to {attraction.userRatingCount} reviewers</Text>
                        {/* put photo here */}
                        {attraction.editorialSummary? <Text>{attraction.editorialSummary.text}</Text> : null}
                    </View>})}</View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1}, 
})