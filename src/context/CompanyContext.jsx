import { createContext } from "react";

export const CompanyContext = createContext()

const CompanyProvider = ({children}) => {
    return (
        <CompanyContext.Provider value={""}>
            {children}
        </CompanyContext.Provider>
    )
}

export default CompanyProvider;
