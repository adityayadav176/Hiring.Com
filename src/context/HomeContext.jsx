import { createContext, useState } from "react";

export const HomeContext = createContext();

const HomeProvider = ({children}) => {
     const [activePage, setActivePage] = useState(null)
    return (
        <HomeContext.Provider value={{activePage, setActivePage}}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeProvider;