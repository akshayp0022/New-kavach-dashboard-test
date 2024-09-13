import React, { useState } from "react";
import { createContext, useContext } from "react";

const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const [ isLoggedIn, setLoggedIn ] = useState(true);
    return (
        <AppContext.Provider value={{ isLoggedIn, setLoggedIn }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);