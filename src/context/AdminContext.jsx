
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const AdminContext = createContext(null);

const AdminProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  // =========================
  // STATES
  // =========================

  const [dashboard, setDashboard] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersPagination, setUsersPagination] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesPagination, setCompaniesPagination] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [jobsPagination, setJobsPagination] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // COMMON API HELPERS
  // =========================

  const handleResponse = useCallback(
    async (response, defaultMessage = "Request failed") => {
      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || defaultMessage);
      }

      return result;
    },
    []
  );

  const buildQuery = useCallback((filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });

    return params.toString();
  }, []);

  // =========================
  // DASHBOARD
  // GET /admin/dashboard
  // =========================

  const handleGetAdminDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: "GET",
        credentials: "include",
      });

      const result = await handleResponse(
        response,
        "Failed to fetch dashboard"
      );

      setDashboard(result.data ?? null);

      return result.data;
    } catch (error) {
      console.error("Dashboard Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, handleResponse]);

  const handleGetAllUsers = useCallback(
    async ({
      page = 1,
      limit = 10,
      search = "",
      role = "",
      accountStatus = "",
    } = {}) => {
      try {
        setLoading(true);

        const query = buildQuery({
          page,
          limit,
          search: search.trim(),
          role,
          accountStatus,
        });

        const response = await fetch(
          `${API_URL}/admin/getUsers?${query}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await handleResponse(
          response,
          "Failed to fetch users"
        );

        const usersList = result?.data?.data?.users;
        const pagination = result?.data?.data?.pagination;

        if (!Array.isArray(usersList)) {
          console.error("Unexpected users API response:", result);
          throw new Error("The users API returned an invalid response.");
        }

        setUsers(usersList);
        setUsersPagination(pagination ?? null);

        return usersList;
      } catch (error) {
        console.error("Get Users Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, buildQuery, handleResponse]
  );

  const handleGetUserById = useCallback(
    async (userId) => {
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

        const result = await handleResponse(
          response,
          "Failed to fetch user"
        );

        const userData = result?.data;

        if (!userData || typeof userData !== "object") {
          throw new Error("Invalid user response");
        }

        setSelectedUser(userData);

        // Return the user itself, not the entire API response.
        return userData;
      } catch (error) {
        console.error("Get User Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, handleResponse]
  );

  const handleBlockUser = useCallback(
    async ({ userId, duration }) => {
      try {
        if (!userId) {
          throw new Error("User ID is required");
        }

        const minutes = Number(duration);

        if (!Number.isInteger(minutes) || minutes <= 0) {
          throw new Error("Block duration must be a positive integer");
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
            body: JSON.stringify({ duration: minutes }),
          }
        );

        const result = await handleResponse(
          response,
          "Failed to block user"
        );

        console.log(result);

        await handleGetAllUsers();

        if (selectedUser?._id === userId) {
          await handleGetUserById(userId);
        }

        return result.data;
      } catch (error) {
        console.error("Block User Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllUsers,
      handleGetUserById,
      selectedUser,
    ]
  );

  // =========================
  // UNBLOCK USER
  // PATCH /admin/users/:userId/unblock
  // =========================

  const handleUnblockUser = useCallback(
    async (userId) => {
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

        const result = await handleResponse(
          response,
          "Failed to unblock user"
        );

        await handleGetAllUsers();

        if (selectedUser?._id === userId) {
          await handleGetUserById(userId);
        }

        return result.data;
      } catch (error) {
        console.error("Unblock User Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllUsers,
      handleGetUserById,
      selectedUser,
    ]
  );

  // =========================
  // DELETE USER
  // DELETE /admin/users/:userId/delete
  // =========================

  const handleDeleteUser = useCallback(
    async (userId) => {
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

        const result = await handleResponse(
          response,
          "Failed to delete user"
        );

        setUsers((previousUsers) =>
          previousUsers.filter((item) => item._id !== userId)
        );

        if (selectedUser?._id === userId) {
          setSelectedUser(null);
        }

        await handleGetAllUsers();

        return result.data;
      } catch (error) {
        console.error("Delete User Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, handleResponse, handleGetAllUsers, selectedUser]
  );

  // =========================
  // UPDATE USER STATUS
  // PATCH /admin/users/:userId/status
  // =========================

  const handleUpdateUserStatus = useCallback(
    async ({ userId, status }) => {
      try {
        if (!userId) {
          throw new Error("User ID is required");
        }

        if (!["active", "blocked"].includes(status)) {
          throw new Error("Status must be active or blocked");
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
            body: JSON.stringify({ status }),
          }
        );

        const result = await handleResponse(
          response,
          "Failed to update user status"
        );

        await handleGetAllUsers();

        if (selectedUser?._id === userId) {
          await handleGetUserById(userId);
        }

        return result.data;
      } catch (error) {
        console.error("Update User Status Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllUsers,
      handleGetUserById,
      selectedUser,
    ]
  );

  // =========================
  // GET ALL COMPANIES
  // GET /admin/companies
  // =========================

  const handleGetAllCompanies = useCallback(
  async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = {}) => {
    try {
      setLoading(true);

      const query = buildQuery({
        page,
        limit,
        search: search.trim(),
        status,
      });

      const response = await fetch(
        `${API_URL}/admin/companies?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log(response);

      const result = await handleResponse(
        response,
        "Failed to fetch companies"
      );

      console.log(result);
      const data = result?.data?.data ?? result?.data;
      const companiesList = data?.companies;
      const pagination = data?.pagination;

      if (!Array.isArray(companiesList)) {
        throw new Error("The companies API returned an invalid response.");
      }

      setCompanies(companiesList);
      setCompaniesPagination(pagination ?? null);

      return companiesList;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, buildQuery, handleResponse]
);

  // =========================
  // GET COMPANY BY ID
  // GET /admin/companies/:companyId
  // =========================

  const handleGetCompanyById = useCallback(
    async (companyId) => {
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

        const result = await handleResponse(
          response,
          "Failed to fetch company"
        );

        const companyData = result?.data;

        if (!companyData || typeof companyData !== "object") {
          throw new Error("Invalid company response");
        }

        setSelectedCompany(companyData);

        return companyData;
      } catch (error) {
        console.error("Get Company Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, handleResponse]
  );

  // =========================
  // VERIFY COMPANY
  // PATCH /admin/companies/:companyId/verify
  // =========================

  const handleVerifyCompany = useCallback(
    async (companyId) => {
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

        const result = await handleResponse(
          response,
          "Failed to verify company"
        );

        await handleGetAllCompanies();

        if (selectedCompany?._id === companyId) {
          setSelectedCompany(result?.data ?? selectedCompany);
        }

        return result.data;
      } catch (error) {
        console.error("Verify Company Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllCompanies,
      selectedCompany,
    ]
  );

  // =========================
  // REJECT COMPANY VERIFICATION
  // PATCH /admin/companies/:companyId/reject
  // =========================

  const handleRejectCompany = useCallback(
    async (companyId) => {
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

        const result = await handleResponse(
          response,
          "Failed to reject company"
        );

        await handleGetAllCompanies();

        if (selectedCompany?._id === companyId) {
          setSelectedCompany(result?.data ?? selectedCompany);
        }

        return result.data;
      } catch (error) {
        console.error("Reject Company Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllCompanies,
      selectedCompany,
    ]
  );

  // =========================
  // BLOCK COMPANY
  // PATCH /admin/companies/:companyId/block
  // =========================

  const handleBlockCompany = useCallback(
    async (companyId) => {
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

        const result = await handleResponse(
          response,
          "Failed to block company"
        );

        setCompanies((previousCompanies) =>
          previousCompanies.filter((item) => item._id !== companyId)
        );

        if (selectedCompany?._id === companyId) {
          setSelectedCompany(null);
        }

        await handleGetAllCompanies();

        return result.data;
      } catch (error) {
        console.error("Block Company Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetAllCompanies,
      selectedCompany,
    ]
  );

  // =========================
  // GET ALL JOBS
  // GET /admin/jobs
  // =========================

  const handleGetJobs = useCallback(
    async ({
      page = 1,
      limit = 10,
      search = "",
      status = "",
      isBlocked,
    } = {}) => {
      try {
        setLoading(true);

        const query = buildQuery({
          page,
          limit,
          search: search.trim(),
          status,
          isBlocked,
        });

        const response = await fetch(
          `${API_URL}/admin/jobs?${query}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await handleResponse(
          response,
          "Failed to fetch jobs"
        );

        // Backend response:
        // result.data.jobs
        // result.data.pagination
        const jobsList = result?.data?.jobs;
        const pagination = result?.data?.pagination;

        if (!Array.isArray(jobsList)) {
          console.error("Unexpected jobs API response:", result);
          throw new Error("The jobs API returned an invalid response.");
        }

        setJobs(jobsList);
        setJobsPagination(pagination ?? null);

        return jobsList;
      } catch (error) {
        console.error("Get Jobs Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, buildQuery, handleResponse]
  );

  // =========================
  // GET JOB BY ID
  // GET /admin/jobs/:jobId
  // =========================

  const handleGetJobById = useCallback(
    async (jobId) => {
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

        const result = await handleResponse(
          response,
          "Failed to fetch job"
        );

        // Controller returns { data: { job } }.
        const jobData = result?.data?.job;

        if (!jobData || typeof jobData !== "object") {
          throw new Error("Invalid job response");
        }

        setJob(jobData);

        return jobData;
      } catch (error) {
        console.error("Get Job Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, handleResponse]
  );

  // =========================
  // BLOCK JOB
  // PATCH /admin/jobs/:jobId/block
  // =========================

  const handleBlockJob = useCallback(
    async (jobId) => {
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

        const result = await handleResponse(
          response,
          "Failed to block job"
        );

        await handleGetJobs();

        if (job?._id === jobId) {
          await handleGetJobById(jobId);
        }

        return result.data;
      } catch (error) {
        console.error("Block Job Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      handleResponse,
      handleGetJobs,
      handleGetJobById,
      job,
    ]
  );

  // =========================
  // DELETE JOB
  // DELETE /admin/jobs/:jobId
  // =========================

  const handleDeleteJob = useCallback(
    async (jobId) => {
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

        const result = await handleResponse(
          response,
          "Failed to delete job"
        );

        setJobs((previousJobs) =>
          previousJobs.filter((item) => item._id !== jobId)
        );

        if (job?._id === jobId) {
          setJob(null);
        }

        await handleGetJobs();

        return result.data;
      } catch (error) {
        console.error("Delete Job Error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, handleResponse, handleGetJobs, job]
  );

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = useMemo(
    () => ({
      dashboard,
      setDashboard,

      users,
      setUsers,
      selectedUser,
      setSelectedUser,
      usersPagination,

      companies,
      setCompanies,
      selectedCompany,
      setSelectedCompany,
      companiesPagination,

      jobs,
      setJobs,
      job,
      setJob,
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
    }),
    [
      dashboard,
      users,
      selectedUser,
      usersPagination,
      companies,
      selectedCompany,
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
    ]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
