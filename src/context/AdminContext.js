import { createContext } from "react";

export const AdminContext = createContext();

const AdminProvider = ({children}) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const handleblockCompany = async(companyId) => {
        try {
            const response = await fetch(`${API_URL}/admin/companies/${companyId}/block`, {
                credentials: true,
                method: "PATCH"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message);
            }
    
            console.log("Company Block Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    return (
        <AdminContext.Provider value={handleblockCompany}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider;