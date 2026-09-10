import { createContext, useState } from "react";

export const CompanyContext = createContext()

const CompanyProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [company, setCompany] = useState(null);
    const [companyPagination, setCompanyPagination] = useState({});
    const [companies, setCompanies] = useState([]);

    const handleCreateCompany = async({details}) => {
        try {
            const {name, description, industry, companySize, foundedYear, headquarters, socialLinks} = details;

            if([name, description, industry, companySize, foundedYear, headquarters, socialLinks].some((some) => !some)) {
                throw new Error("All Fields Are Required");
            }

            const response = await fetch(`${API_URL}/company`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({name, description, industry, companySize, foundedYear, headquarters, socialLinks})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Create Company");
            }
    
            setCompany(data.data);
            setCompanies((prev) => [data.data, ...prev]);
            setCompanyPagination((prev) => ({...prev, totalCompanies: prev.totalCompanies + 1}))
            console.log("Company Created Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }

    const handleGetCompanyByIdForU = async({companyId}) => {
        try {

            if(!companyId) {
                throw new Error("CompanyId is required");
            }

            const response = await fetch(`${API_URL}/company/${companyId}`, {
                method: "GET",
                credentials: "include"
            })
            
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Company");
            }
    
            setCompany(data.data);
            console.log("Company Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }

    const handleGetAllCompaniesForU = async() => {
        try {
            const response = await fetch(`${API_URL}/company`, {
                method: "GET",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Companys");
            }
    
            setCompanies(data.data.companies);
            setCompanyPagination(data.data.pagination)
            console.log("Companys Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }

    const handleUpdateCompanyForU = async({companyId, details}) => {
        try {
            const {name, description, industry, companySize, foundedYear, headquarters, socialLinks} = details;

            if(!companyId) {
                throw new Error("CompanyId is required");
            }

            if([name, description, industry, companySize, foundedYear, headquarters, socialLinks].some((some) => !some)) {
                throw new Error("All Fields Are Required");
            }

            const response = await fetch(`${API_URL}/company/${companyId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({name, description, industry, companySize, foundedYear, headquarters, socialLinks})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Update Company");
            }

            setCompanies((prev) => prev.map((item) => item._id === companyId ? data.data : item));
            setCompany(data.data);
            console.log("Company Update Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }
    const handleDeleteCompanyForU = async({companyId}) => {
        try {
            if(!companyId) {
                throw new Error("CompanyId is Required");
            }

            const response = await fetch(`${API_URL}/company/${companyId}/delete`, {
                method: "PATCH",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Company");
            }

            setCompanies((prev) => prev.filter((item) => item._id !== companyId));
            setCompanyPagination((prev) => ({...prev, totalCompanies: Math.max(0, prev.totalCompanies - 1)}))
            console.log("Company Delete Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error
        }
    }
    const handleParmanentDeleteCompanyForU = async({companyId}) => {
        try {

            if(!companyId) {
                throw new Error("CompanyId is Required");
            }

            const response = await fetch(`${API_URL}/company/${companyId}/permanent`, {
                method: "DELETE",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Company");
            }

            setCompanies((prev) => prev.filter((item) => item._id !== companyId));
            setCompanyPagination((prev) => ({...prev, totalCompanies: Math.max(0, prev.totalCompanies - 1)}))
            console.log("Company Delete Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }
    const handleRestoreCompanyForU = async({companyId}) => {
        try {

            if(!companyId) {
                throw new Error("Company Id Is Required");
            }

            const response = await fetch(`${API_URL}/company/${companyId}/restore`, {
                method: "PATCH",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Restore Company");
            }

            setCompanies((prev) => {
            const exists = prev.some((item) => item._id === companyId);

            if (exists) {
                return prev.map((item) => item._id === companyId ? data.data : item);
            }

            return [data.data, ...prev];
            });
            console.log("Company Restore Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
            throw error;
        }
    }

    return (
        <CompanyContext.Provider value={{company, companies, companyPagination, handleCreateCompany, handleDeleteCompanyForU, handleGetAllCompaniesForU, handleGetCompanyByIdForU, handleParmanentDeleteCompanyForU, handleRestoreCompanyForU, handleUpdateCompanyForU}}>
            {children}
        </CompanyContext.Provider>
    )
}

export default CompanyProvider;
