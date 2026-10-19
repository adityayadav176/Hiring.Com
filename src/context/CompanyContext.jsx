import { createContext, useState, useCallback } from "react";

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [company, setCompany] = useState(null);

  const handleCreateCompany = useCallback(async ({ details, logo }) => {
    try {
      if (!details) {
        throw new Error("Company details are required.");
      }

      const {
        name,
        description,
        industry,
        companySize,
        foundedYear,
        headquarters,
        socialLinks,
      } = details;

      if (!name?.trim()) {
        throw new Error("Company name is required.");
      }

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description ?? "");
      formData.append("industry", industry ?? "");

      if (companySize) {
        formData.append("companySize", companySize);
      }

      if (foundedYear !== undefined && foundedYear !== "") {
        formData.append("foundedYear", foundedYear);
      }

      if (headquarters) {
        formData.append("headquarters", JSON.stringify(headquarters));
      }

      if (socialLinks) {
        formData.append("socialLinks", JSON.stringify(socialLinks));
      }

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await fetch(`${API_URL}/companies`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create company.");
      }

      setCompany(data.data);

      return data.data;
    } catch (error) {
      console.error("Create company error:", error);
      throw error;
    }
  }, [API_URL]);

  const handleGetMyCompany = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/companies/my-company`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch your company.");
      }

      setCompany(data.data);

      return data.data;
    } catch (error) {
      console.error("Get my company error:", error);
      throw error;
    }
  }, [API_URL]);

  const handleGetCompanyById = useCallback(async ({ companyId }) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required.");
      }

      const response = await fetch(
        `${API_URL}/companies/${companyId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch company.");
      }

      setCompany(data.data);

      return data.data;
    } catch (error) {
      console.error("Get company by ID error:", error);
      throw error;
    }
  }, [API_URL]);

  const handleUpdateCompany = useCallback(async ({ companyId, details }) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required.");
      }

      if (!details || Object.keys(details).length === 0) {
        throw new Error("Company details are required.");
      }

      const response = await fetch(
        `${API_URL}/companies/${companyId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update company.");
      }

      setCompany(data.data);

      return data.data;
    } catch (error) {
      console.error("Update company error:", error);
      throw error;
    }
  }, [API_URL]);

  const handleUpdateCompanyLogo = useCallback(
    async ({ companyId, logo }) => {
      try {
        if (!companyId) {
          throw new Error("Company ID is required.");
        }

        if (!logo) {
          throw new Error("Company logo is required.");
        }

        const formData = new FormData();
        formData.append("logo", logo);

        const response = await fetch(
          `${API_URL}/companies/${companyId}/logo`,
          {
            method: "PATCH",
            credentials: "include",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update company logo.");
        }

        setCompany(data.data);

        return data.data;
      } catch (error) {
        console.error("Update company logo error:", error);
        throw error;
      }
    },
    [API_URL]
  );

  return (
    <CompanyContext.Provider
      value={{
        company,
        setCompany,
        handleCreateCompany,
        handleGetMyCompany,
        handleGetCompanyById,
        handleUpdateCompany,
        handleUpdateCompanyLogo,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;