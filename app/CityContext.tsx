
import { createContext, useState } from "react";


export const CityContext = createContext();

export const CityProvider = ({children}) => {
    const [city, setCity] = useState( {city_name: 'London', latitude: 51.5072, longitude: -0.1275, radius: 12000})

    return <CityContext.Provider value={{city, setCity}}>{children}</CityContext.Provider>
}