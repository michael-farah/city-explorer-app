import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchPage from "@/components/SearchPage";
import AttractionPage from "@/components/AttractionPage";

const Stack = createNativeStackNavigator()

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={SearchPage} options={{title: "City Explorer"}}/>
      <Stack.Screen name="Attraction" component={AttractionPage} options={{title: "City Explorer"}}/>
    </Stack.Navigator>
      )
 
}

