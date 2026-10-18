import { createContext, useState } from "react";

export const HomeContext = createContext();

const HomeProvider = ({children}) => {
     const [activePage, setActivePage] = useState("overview");
     const [adminActivePage, setAdminActivePage] =
    useState("admin/dashboard");
    return (
        <HomeContext.Provider value={{activePage, setActivePage, adminActivePage, setAdminActivePage}}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeProvider;