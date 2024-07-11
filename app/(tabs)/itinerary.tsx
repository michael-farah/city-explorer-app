import ItineraryPage from "@/components/ItineraryPage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator()

export default function ItineraryScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Itinerary" component={ItineraryPage} options={{title: "City Explorer"}}/>
  </Stack.Navigator>
);
}