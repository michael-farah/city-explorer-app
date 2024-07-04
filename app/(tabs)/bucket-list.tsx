import AttractionPage from "@/components/AttractionPage";
import BucketListPage from "@/components/BucketListPage"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator()

export default function BucketListScreen() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="BucketList" component={BucketListPage} options={{title: "Bucket List"}}/>
        <Stack.Screen name="Attraction" component={AttractionPage} options={{title: "Attraction"}}/>
    </Stack.Navigator>
  );
}
