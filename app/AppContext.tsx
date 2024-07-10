import { createContext, useEffect, useMemo, useState } from "react";
import { getBucketListItemsByUser } from "@/app/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    // username: "madexplorer",
    // password: "myPassword",
  })
  const [cityName, setCityName] = useState("London")
  const [bucketListAttractions, setBucketListAttractions] = useState([])
  const [isBucketListLoading, setIsBucketListLoading] = useState(false)

  useEffect(()=>{
    setIsBucketListLoading(true)
    let isMounted = true;
    getBucketListItemsByUser(user.username, cityName).then(({bucketList})=>{
        if(isMounted){
            if(!bucketList.length){
                setBucketListAttractions([])
            } else {
                setBucketListAttractions(bucketList.map((item)=> {return item.place_json}))
            }
        }
    }).catch((err)=>{
        if(isMounted){
            console.log(err)
        }
    }).finally(()=>{
      setIsBucketListLoading(false)
    })
    return()=>{isMounted = false}
  }, [user.username, cityName])

  const bucketListMemo = useMemo(() => bucketListAttractions,[bucketListAttractions])

  return (
    <AppContext.Provider value={{ user, setUser, cityName, setCityName, bucketListAttractions, setBucketListAttractions, bucketListMemo, isBucketListLoading}}>
      {children}
    </AppContext.Provider>
  );
};