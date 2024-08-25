import { Button , StyleSheet} from "react-native";
import { useContext, useState } from "react";
import { AppContext } from "@/app/AppContext";
import { postBucketListItem } from "@/app/api";

export default function AddToBucketListButton({attraction}){
    const [isAdding, setIsAdding] = useState(false)
    const { cityName, user, bucketListMemo, setBucketListAttractions } = useContext(AppContext);

    const bucketListClick = ({ attraction }) => {
        setIsAdding(true)
        postBucketListItem(attraction, user.username, cityName)
        .then(({addedPlace})=>{
          setBucketListAttractions((currAttractions)=> [addedPlace.place_json, ...currAttractions])
          setIsAdding(false)
        })
      };

    const isItemInBucketList = bucketListMemo.map((item)=> item.id).includes(attraction.id)

    return (
        <Button style={styles.button}
            title={isItemInBucketList ? "Added to Bucket List" : isAdding?"Adding to Bucket List":"Add to Bucket List"}
            onPress={() => bucketListClick({attraction})}
            disabled={isItemInBucketList||isAdding?true:false}
        />
    )
} 

const styles = StyleSheet.create({
button: {
}
})