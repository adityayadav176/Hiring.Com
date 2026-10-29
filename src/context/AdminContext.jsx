
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AdminContext = createContext(null);

const AdminProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [admin, setAdmin] = useState(null);
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

  const [adminProfile, setAdminProfile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState("");
   

  const [loading, setLoading] = useState(false);

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

  const getResponseData = (result) => {
  return (
    result?.data?.company ??
    result?.data?.data?.company ??
    result?.data?.data ??
    result?.data ??
    result?.company ??
    result
  );
};


const handleRefreshAdminToken = useCallback(async () => {
  try {
    const response = await fetch(
      `${API_URL}/admin/refresh-admin-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error(
        "Admin token refresh failed:",
        response.status
      );
      return false;
    }

    console.log("Admin access token refreshed successfully");
    return true;
  } catch (error) {
    console.error("Admin refresh request failed:", error);
    return false;
  }
}, [API_URL]);




const getAdmin = useCallback(async () => {
  try {
    const fetchAdminProfileRequest = () =>
      fetch(`${API_URL}/admin/profile`, {
        method: "GET",
        credentials: "include",
      });

    let response = await fetchAdminProfileRequest();

    // Access token expired: refresh and retry once.
    if (response.status === 401) {
      const refreshed = await handleRefreshAdminToken();

      if (!refreshed) {
        setAdmin(null);
        setAdminProfile(null);
        return null;
      }

      response = await fetchAdminProfileRequest();
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.success === false) {
      setAdmin(null);
      setAdminProfile(null);
      return null;
    }

    const adminData = result?.data?.admin;

    if (!adminData?._id) {
      setAdmin(null);
      setAdminProfile(null);
      return null;
    }

    setAdmin(adminData);
    setAdminProfile(adminData);

    return adminData;
  } catch (error) {
    console.error("Get Admin Error:", error);
    setAdmin(null);
    setAdminProfile(null);
    return null;
  }
}, [API_URL, handleRefreshAdminToken]);


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

      // Match the exact enum values in your User schema.
      const normalizedRole =
        role.toLowerCase() === "user"
          ? "User"
          : role.toLowerCase() === "recruiter"
            ? "recruiter"
            : "";

      const query = buildQuery({
        page,
        limit,
        search: search.trim(),
        role: normalizedRole,
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

      const data = result?.data?.data ?? result?.data;
      const usersList = data?.users;
      const pagination = data?.pagination;

      if (!Array.isArray(usersList)) {
        console.error("Unexpected users API response:", result);
        throw new Error(
          "The users API returned an invalid response."
        );
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
    if (!userId) {
      throw new Error("User ID is required");
    }

    const minutes = Number(duration);

    if (!Number.isInteger(minutes) || minutes <= 0) {
      throw new Error(
        "Block duration must be a positive integer in minutes"
      );
    }

    try {
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

      await handleGetAllUsers();

      if (String(selectedUser?._id) === String(userId)) {
        await handleGetUserById(userId);
      }

      return result?.data ?? result;
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
    selectedUser?._id,
  ]
);

const handleUnblockUser = useCallback(
  async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
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

      if (String(selectedUser?._id) === String(userId)) {
        await handleGetUserById(userId);
      }

      return result?.data ?? result;
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
    selectedUser?._id,
  ]
);


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



const handleGetAllAdminCompanies = useCallback(
  async ({
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    verificationStatus = "all",
    blocked = "all",
    deleted = "all",
    industry = "",
    companySize = "",
    country = "",
    state = "",
    city = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: String(search).trim(),
      status,
      blocked,
      deleted: status === "deleted" ? "true" : deleted,
      sortBy,
      sortOrder,
    });

    if (verificationStatus && verificationStatus !== "all") {
      params.set("verificationStatus", verificationStatus);
    }

    const optionalFilters = {
      industry,
      companySize,
      country,
      state,
      city,
    };

    Object.entries(optionalFilters).forEach(([key, value]) => {
      const normalizedValue = String(value ?? "").trim();

      if (normalizedValue) {
        params.set(key, normalizedValue);
      }
    });

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("Companies HTTP status:", response.status);

      const result = await handleResponse(
        response,
        "Failed to fetch companies"
      );

      console.log("Companies API result:", result);

      const data =
        result?.data?.data ??
        result?.data ??
        result;

      if (!Array.isArray(data?.companies)) {
        console.error("Unexpected companies response structure:", data);
        throw new Error("Invalid companies response.");
      }

      setCompanies(data.companies);
      setCompaniesPagination(data.pagination ?? null);

      return {
        companies: data.companies,
        pagination: data.pagination ?? null,
        filters: data.filters ?? null,
      };
    } catch (error) {
      console.error("Get All Admin Companies Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);


const handleGetCompanyById = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
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

      const company = getResponseData(result);

      if (!company || typeof company !== "object" || !company._id) {
        console.error("Unexpected company response:", result);
        throw new Error("Invalid company response from server.");
      }

      setSelectedCompany(company);

      return company;
    } catch (error) {
      console.error("Get Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);


const handleVerifyCompany = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
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

      const updatedCompany = getResponseData(result);

      if (!updatedCompany?._id) {
        throw new Error("Invalid company response.");
      }

      setCompanies((previous) =>
        previous.map((company) =>
          String(company._id) === String(companyId)
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSelectedCompany((previous) =>
        String(previous?._id) === String(companyId)
          ? { ...previous, ...updatedCompany }
          : previous
      );

      return updatedCompany;
    } catch (error) {
      console.error("Verify Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

const handleRestoreCompany = async (companyId) => {
  try {
    const response = await fetch(
      `${API_URL}/admin/companies/${companyId}/restore`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to restore company"
      );
    }

    setCompanies(result.data);

    return {
      success: true,
      data: result.data,
      message: result.message || "Company restored successfully",
    };
  } catch (error) {
    console.error("Restore company error:", error);

    return {
      success: false,
      message: error.message || "Failed to restore company",
    };
  }
};

const handleRejectCompany = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
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

      const updatedCompany = getResponseData(result);

      if (!updatedCompany?._id) {
        throw new Error("Invalid company response.");
      }

      setCompanies((previous) =>
        previous.map((company) =>
          String(company._id) === String(companyId)
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSelectedCompany((previous) =>
        String(previous?._id) === String(companyId)
          ? { ...previous, ...updatedCompany }
          : previous
      );

      return updatedCompany;
    } catch (error) {
      console.error("Reject Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

const handleBlockCompany = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
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

      const updatedCompany = getResponseData(result);

      if (!updatedCompany?._id) {
        throw new Error("Invalid company response.");
      }

      setCompanies((previous) =>
        previous.map((company) =>
          String(company._id) === String(companyId)
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSelectedCompany((previous) =>
        String(previous?._id) === String(companyId)
          ? { ...previous, ...updatedCompany }
          : previous
      );

      return updatedCompany;
    } catch (error) {
      console.error("Block Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

const handleUnblockCompany = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}/unblock`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await handleResponse(
        response,
        "Failed to unblock company"
      );

      const updatedCompany = getResponseData(result);

      if (!updatedCompany?._id) {
        throw new Error("Invalid company response.");
      }

      setCompanies((previous) =>
        previous.map((company) =>
          String(company._id) === String(companyId)
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSelectedCompany((previous) =>
        String(previous?._id) === String(companyId)
          ? { ...previous, ...updatedCompany }
          : previous
      );

      return updatedCompany;
    } catch (error) {
      console.error("Unblock Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

const handleSoftDeleteCompany = useCallback(
  async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/companies/${companyId}/delete`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await handleResponse(
        response,
        "Failed to delete company"
      );

      const deletedCompany = getResponseData(result);

      if (!deletedCompany?._id) {
        throw new Error("Invalid company response.");
      }

      // Remove the deleted company from the current list.
      setCompanies((previous) =>
        previous.filter(
          (company) =>
            String(company._id) !== String(companyId)
        )
      );

      setSelectedCompany((previous) =>
        String(previous?._id) === String(companyId)
          ? null
          : previous
      );

      return deletedCompany;
    } catch (error) {
      console.error("Soft Delete Company Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

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

      const data = result?.data?.data ?? result?.data;
      const jobsList = data?.jobs;
      const pagination = data?.pagination;

      if (!Array.isArray(jobsList)) {
        console.error("Unexpected jobs API response:", result);
        throw new Error(
          "The jobs API returned an invalid response."
        );
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

  const handleGetJobById = useCallback(
  async (jobId) => {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    try {
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

      const jobData =
        result?.data?.job ?? result?.data;

      if (
        !jobData ||
        typeof jobData !== "object" ||
        !jobData._id
      ) {
        console.error("Unexpected job response:", result);
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

  const handleBlockJob = useCallback(
  async (jobId) => {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    try {
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

      const blockedJob = result?.data;

      if (!blockedJob?.jobId) {
        throw new Error("Invalid block job response");
      }

      setJobs((previousJobs) =>
        previousJobs.map((item) =>
          String(item._id) === String(blockedJob.jobId)
            ? { ...item, isBlocked: blockedJob.isBlocked }
            : item
        )
      );

      setJob((previousJob) =>
        previousJob &&
        String(previousJob._id) === String(blockedJob.jobId)
          ? {
              ...previousJob,
              isBlocked: blockedJob.isBlocked,
            }
          : previousJob
      );

      return blockedJob;
    } catch (error) {
      console.error("Block Job Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [API_URL, handleResponse]
);

const handleDeleteJob = useCallback(
  async (jobId) => {
    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const response = await fetch(
      `${API_URL}/admin/jobs/${jobId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error("Invalid response received from server.");
    }

    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message || "Failed to delete job."
      );
    }

    // Your backend returns: { jobId: deletedJob._id }
    const deletedJobId =
      result?.data?.jobId ||
      result?.data?.data?.jobId ||
      jobId;

    // Remove the deleted job immediately from AdminContext.
    setJobs((previousJobs) =>
      previousJobs.filter(
        (job) => String(job._id) !== String(deletedJobId)
      )
    );

    return result.data;
  },
  []
);

const handleUnlockJob = useCallback(async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required to unlock a job.");
  }

  const response = await fetch(
    `${API_URL}/admin/jobs/${jobId}/unlock`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response received from server.");
  }

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || "Failed to unlock job."
    );
  }

  // Your backend returns the job directly inside ApiResponse.data.
  const updatedJob =
    result?.data?.job ||
    result?.data?.data ||
    result?.data;

  if (!updatedJob || typeof updatedJob !== "object") {
    throw new Error("Updated job was not returned by the server.");
  }

  // Update the jobs list immediately.
  setJobs((prevJobs) =>
    prevJobs.map((job) =>
      String(job._id) === String(jobId)
        ? { ...job, ...updatedJob, isBlocked: false }
        : job
    )
  );

  return updatedJob;
}, []);

 const fetchAdminProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch admin profile"
        );
      }

      const admin = result.data?.admin;

      setAdminProfile(admin || null);

      return admin;
    } catch (error) {
      setError(error.message || "Something went wrong");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdminAvatar = useCallback(
    async (file) => {
      if (!file) {
        throw new Error("Please select a profile picture");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      setAvatarLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/profile/avatar`,
          {
            method: "PATCH",
            credentials: "include",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to update admin avatar"
          );
        }

        const updatedAvatar = result.data?.avatar;

        if (updatedAvatar) {
          setAdminProfile((previous) =>
            previous
              ? { ...previous, avatar: updatedAvatar }
              : previous
          );
        }

        return result;
      } catch (error) {
        setError(error.message || "Something went wrong");
        throw error;
      } finally {
        setAvatarLoading(false);
      }
    },
    []
  );

  const navigate = useNavigate();

  const adminLogout = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Admin logout failed");
    }
    setAdminProfile(null);
    navigate("/login");

    return result;
  } catch (error) {
    throw error;
  }
};

  const value = useMemo(
    () => ({
      dashboard,
      setDashboard,
      adminLogout,

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

      handleGetCompanyById,
      handleVerifyCompany,
      handleRejectCompany,
      handleBlockCompany,

      handleGetJobs,
      handleGetJobById,
      handleBlockJob,
      handleDeleteJob,
      handleUnlockJob,
      handleUnblockCompany,
      handleBlockCompany,
      handleSoftDeleteCompany,
      handleGetAllAdminCompanies,
      adminProfile,
      updateAdminAvatar,
      fetchAdminProfile,
      setAdminProfile,
      avatarLoading,
      getAdmin,
      admin,
      setAdmin,
      handleRefreshAdminToken,
      handleRestoreCompany,
    }),
    [
      setAdminProfile,
      admin,
      setAdmin,
      handleRefreshAdminToken,
      adminProfile,
      adminLogout,
      avatarLoading,
      fetchAdminProfile,
      updateAdminAvatar,
      dashboard,
      users,
      selectedUser,
      usersPagination,
      companies,
      selectedCompany,
      handleRestoreCompany,
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
      handleGetCompanyById,
      handleVerifyCompany,
      handleRejectCompany,
      handleBlockCompany,
      handleGetJobs,
      handleGetJobById,
      handleBlockJob,
      handleDeleteJob,
      handleUnlockJob,
      handleUnblockCompany,
      handleBlockCompany,
      handleSoftDeleteCompany,
      getAdmin,
      handleGetAllAdminCompanies
    ]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
