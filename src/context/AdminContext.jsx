import { createContext, useContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  // Dashboard
  const [dashboard, setDashboard] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [usersPagination, setUsersPagination] = useState(null);

  // Companies
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [companiesPagination, setCompaniesPagination] = useState(null);

  // Jobs
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [jobsPagination, setJobsPagination] = useState(null);

  // Loading
  const [loading, setLoading] = useState(false);

  // Handle API response
  const handleResponse = async (response, defaultMessage) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || defaultMessage);
    }

    return data;
  };

  // Get dashboard stats
  const handleGetAdminDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: "GET",
        credentials: "include",
      });

      const data = await handleResponse(
        response,
        "Failed to fetch dashboard"
      );

      setDashboard(data.data);

      return data;
    } catch (error) {
      console.error("Dashboard Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all users
  const handleGetAllUsers = async ({
    page = 1,
    limit = 10,
    search = "",
    role = "",
    status = "",
  } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        role,
        status,
      });

      const response = await fetch(
        `${API_URL}/admin/getUsers?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch users"
      );

      setUsers(data.data.users);
      setUsersPagination(data.data.pagination);

      return data;
    } catch (error) {
      console.error("Get Users Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const handleGetUserById = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch user"
      );

      setUser(data.data);

      return data;
    } catch (error) {
      console.error("Get User Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Temporarily block user
  const handleBlockUser = async ({ userId, duration }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!duration || Number(duration) <= 0) {
        throw new Error("Valid block duration is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/block`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            duration: Number(duration),
          }),
        }
      );

      const data = await handleResponse(
        response,
        "Failed to block user"
      );

      await handleGetAllUsers();

      if (user?._id === userId) {
        await handleGetUserById(userId);
      }

      return data;
    } catch (error) {
      console.error("Block User Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Unblock temporarily blocked user
  const handleUnblockUser = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/unblock`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to unblock user"
      );

      await handleGetAllUsers();

      if (user?._id === userId) {
        await handleGetUserById(userId);
      }

      return data;
    } catch (error) {
      console.error("Unblock User Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to delete user"
      );

      setUsers((prevUsers) =>
        prevUsers.filter((item) => item._id !== userId)
      );

      if (user?._id === userId) {
        setUser(null);
      }

      await handleGetAllUsers();

      return data;
    } catch (error) {
      console.error("Delete User Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update permanent user status
  const handleUpdateUserStatus = async ({ userId, status }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!["active", "blocked"].includes(status)) {
        throw new Error("Invalid user status");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await handleResponse(
        response,
        "Failed to update user status"
      );

      await handleGetAllUsers();

      if (user?._id === userId) {
        await handleGetUserById(userId);
      }

      return data;
    } catch (error) {
      console.error("Update User Status Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all companies
  const handleGetAllCompanies = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status,
      });

      const response = await fetch(
        `${API_URL}/admin/companies?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch companies"
      );

      setCompanies(data.data.companies);
      setCompaniesPagination(data.data.pagination);

      return data;
    } catch (error) {
      console.error("Get Companies Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get company by ID
  const handleGetCompanyById = async (companyId) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch company"
      );

      setCompany(data.data);

      return data;
    } catch (error) {
      console.error("Get Company Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify company
  const handleVerifyCompany = async (companyId) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}/verify`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to verify company"
      );

      await handleGetAllCompanies();

      if (company?._id === companyId) {
        setCompany(data.data);
      }

      return data;
    } catch (error) {
      console.error("Verify Company Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reject company
  const handleRejectCompany = async (companyId) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}/reject`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to reject company"
      );

      await handleGetAllCompanies();

      if (company?._id === companyId) {
        setCompany(data.data);
      }

      return data;
    } catch (error) {
      console.error("Reject Company Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Block company
  const handleBlockCompany = async (companyId) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}/block`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to block company"
      );

      await handleGetAllCompanies();

      if (company?._id === companyId) {
        setCompany(null);
      }

      return data;
    } catch (error) {
      console.error("Block Company Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all jobs
  const handleGetJobs = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    isBlocked,
  } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status,
      });

      if (isBlocked !== undefined && isBlocked !== "") {
        params.append("isBlocked", String(isBlocked));
      }

      const response = await fetch(
        `${API_URL}/admin/jobs?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch jobs"
      );

      setJobs(data.data.jobs);
      setJobsPagination(data.data.pagination);

      return data;
    } catch (error) {
      console.error("Get Jobs Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get job by ID
  const handleGetJobById = async (jobId) => {
    try {
      if (!jobId) {
        throw new Error("Job ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/jobs/${jobId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to fetch job"
      );

      setJob(data.data.job);

      return data;
    } catch (error) {
      console.error("Get Job Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Block job
  const handleBlockJob = async (jobId) => {
    try {
      if (!jobId) {
        throw new Error("Job ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/jobs/${jobId}/block`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to block job"
      );

      await handleGetJobs();

      if (job?._id === jobId) {
        await handleGetJobById(jobId);
      }

      return data;
    } catch (error) {
      console.error("Block Job Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    try {
      if (!jobId) {
        throw new Error("Job ID is required");
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/jobs/${jobId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await handleResponse(
        response,
        "Failed to delete job"
      );

      setJobs((prevJobs) =>
        prevJobs.filter((item) => item._id !== jobId)
      );

      if (job?._id === jobId) {
        setJob(null);
      }

      await handleGetJobs();

      return data;
    } catch (error) {
      console.error("Delete Job Error:", error);
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Context values
  const value = {
    dashboard,
    users,
    user,
    usersPagination,
    companies,
    company,
    companiesPagination,
    jobs,
    job,
    jobsPagination,
    loading,

    handleGetAdminDashboard,

    handleGetAllUsers,
    handleGetUserById,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
    handleUpdateUserStatus,

    handleGetAllCompanies,
    handleGetCompanyById,
    handleVerifyCompany,
    handleRejectCompany,
    handleBlockCompany,

    handleGetJobs,
    handleGetJobById,
    handleBlockJob,
    handleDeleteJob,

    setUser,
    setCompany,
    setJob,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
