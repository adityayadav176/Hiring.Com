import { createContext, useState } from "react";

export const HomeContext = createContext();

const HomeProvider = ({children}) => {
     const [activePage, setActivePage] = useState("overview");
     const [adminActivePage, setAdminActivePage] = useState("admin/dashboard");
     const [recruiterActivePage, setRecruiterActivePage] = useState("recruiter/dashboard");
    return (
        <HomeContext.Provider value={{activePage, setActivePage, adminActivePage, setAdminActivePage, recruiterActivePage, setRecruiterActivePage}}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeProvider;