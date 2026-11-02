import {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
const REFRESH_URL = `${API_URL}/auth/refreshAccessToken`;

const parseResponse = async (response) => {
  return response.json().catch(() => ({}));
};

const getErrorMessage = (
  data,
  fallback = "Something went wrong."
) => {
  return data?.message || data?.error || fallback;
};

const normalizeAccountType = (type, account) => {
  const role = account?.role;

  if (type === "admin" || role === "admin") {
    return "admin";
  }

  if (type === "recruiter" || role === "recruiter") {
    return "recruiter";
  }

  if (
    type === "user" ||
    type === "User" ||
    role === "User" ||
    role === "user"
  ) {
    return "user";
  }

  return null;
};

function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshPromiseRef = useRef(null);
  const authCheckPromiseRef = useRef(null);
  const mountedRef = useRef(false);

  const clearLocalAuth = useCallback(() => {
    setUser(null);
    setRecruiter(null);
    setAdmin(null);
  }, []);

  const setAuthenticatedAccount = useCallback(
    (type, account) => {
      if (!account) {
        clearLocalAuth();
        return;
      }

      const normalizedType = normalizeAccountType(
        type,
        account
      );

      if (normalizedType === "admin") {
        setAdmin(account);
        setUser(null);
        setRecruiter(null);
        return;
      }

      if (normalizedType === "recruiter") {
        setRecruiter(account);
        setUser(null);
        setAdmin(null);
        return;
      }

      if (normalizedType === "user") {
        setUser(account);
        setRecruiter(null);
        setAdmin(null);
        return;
      }

      throw new Error("Unknown account type.");
    },
    [clearLocalAuth]
  );

  const handleRefreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        const response = await fetch(REFRESH_URL, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          console.error("Token refresh failed:", {
            status: response.status,
            message: data?.message,
          });

          return false;
        }

        return true;
      } catch (error) {
        console.error("Refresh request failed:", error);
        return false;
      }
    })();

    try {
      return await refreshPromiseRef.current;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, []);

  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      const makeRequest = () =>
        fetch(url, {
          ...options,
          credentials: "include",
        });

      let response = await makeRequest();

      const requestUrl =
        typeof url === "string"
          ? url
          : url instanceof URL
            ? url.toString()
            : "";

      if (
        requestUrl.includes("/auth/refreshAccessToken")
      ) {
        return response;
      }

      if (response.status !== 401) {
        return response;
      }

      const refreshed = await handleRefreshAccessToken();

      if (!refreshed) {
        return response;
      }

      return makeRequest();
    },
    [handleRefreshAccessToken]
  );

  
const getUser = useCallback(async () => {
  if (authCheckPromiseRef.current) {
    return authCheckPromiseRef.current;
  }

  authCheckPromiseRef.current = (async () => {
    setAuthLoading(true);

    try {
      const fetchCurrentUser = async () => {
        return fetch(`${API_URL}/auth/fetchUser`, {
          method: "GET",
          credentials: "include",
        });
      };

      let response = await fetchCurrentUser();

      if (response.status === 401) {
        const refreshed = await handleRefreshAccessToken();

        if (!refreshed) {
          clearLocalAuth();
          return null;
        }

        response = await fetchCurrentUser();
      }

      const data = await parseResponse(response);

      if (!response.ok) {
        clearLocalAuth();
        return null;
      }

      const account = data?.data;

      if (!account?._id) {
        clearLocalAuth();
        return null;
      }

      const type = normalizeAccountType(account.role, account);

      if (type !== "user" && type !== "recruiter") {
        clearLocalAuth();
        return null;
      }

      if (mountedRef.current) {
        setAuthenticatedAccount(type, account);
      }

      return account;
    } catch (error) {
      console.error("User session restoration failed:", error);
      clearLocalAuth();
      return null;
    } finally {
      authCheckPromiseRef.current = null;

      if (mountedRef.current) {
        setAuthLoading(false);
      }
    }
  })();

  return authCheckPromiseRef.current;
}, [
  handleRefreshAccessToken,
  setAuthenticatedAccount,
  clearLocalAuth,
]);


useEffect(() => {
  mountedRef.current = true;

  return () => {
    mountedRef.current = false;
  };
}, []);

  const handleLogin = async (details = {}) => {
    try {
      const {
        email,
        password,
        phoneNo,
      } = details;

      const normalizedEmail =
        typeof email === "string"
          ? email.trim().toLowerCase()
          : "";

      const normalizedPhone =
        typeof phoneNo === "string"
          ? phoneNo.trim()
          : "";

      if (!password || typeof password !== "string") {
        throw new Error(
          "Please enter your password."
        );
      }

      if (!normalizedEmail && !normalizedPhone) {
        throw new Error(
          "Please enter your email or phone number."
        );
      }

      if (normalizedEmail && normalizedPhone) {
        throw new Error(
          "Please enter either email or phone number, not both."
        );
      }

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...(normalizedEmail
              ? { email: normalizedEmail }
              : {}),
            ...(normalizedPhone
              ? { phoneNo: normalizedPhone }
              : {}),
            password,
          }),
        }
      );

      const responseData = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(responseData, "Login failed.")
        );
      }

      const accountData = responseData?.data;

      if (!accountData) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      if (accountData.twoFactorRequired) {
        if (
          !accountData.twoFactorToken ||
          !accountData.userId
        ) {
          throw new Error(
            "Invalid 2FA response from server."
          );
        }

        return {
          success: true,
          requires2FA: true,
          twoFactorToken: accountData.twoFactorToken,
          userId: accountData.userId,
          type: normalizeAccountType(accountData.type),
        };
      }

      const account =
        accountData.user ||
        accountData.recruiter ||
        accountData.admin;

      const accountType = normalizeAccountType(
        accountData.type,
        account
      );

      if (!account?._id || !accountType) {
        throw new Error(
          "Account data or account type missing from login response."
        );
      }

      setAuthenticatedAccount(
        accountType,
        account
      );

      authCheckPromiseRef.current = null;
      setAuthLoading(false);

      if (accountType === "admin") {
        navigate("/admin", { replace: true });
      } else if (accountType === "recruiter") {
        navigate("/recruiter", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      return {
        success: true,
        requires2FA: false,
        type: accountType,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleGoogleAuth = async ({
    credential,
    role,
  } = {}) => {
    try {
      if (!credential) {
        throw new Error("Google credential is required.");
      }

      const response = await fetch(
        `${API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential,
            ...(role ? { role } : {}),
          }),
        }
      );

      const responseData = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            responseData,
            "Google authentication failed."
          )
        );
      }

      const accountData = responseData?.data;

      if (!accountData) {
        throw new Error(
          "Invalid Google authentication response."
        );
      }

      if (accountData.twoFactorRequired) {
        if (!accountData.twoFactorToken) {
          throw new Error(
            "Google 2FA token missing from response."
          );
        }

        return {
          success: true,
          requires2FA: true,
          twoFactorToken: accountData.twoFactorToken,
          userId: accountData.userId,
          type: normalizeAccountType(accountData.type),
        };
      }

      const account =
        accountData.user ||
        accountData.recruiter ||
        accountData.admin ||
        accountData;

      const accountType = normalizeAccountType(
        accountData.type,
        account
      );

      if (!account?._id || !accountType) {
        throw new Error(
          "Account data missing from Google response."
        );
      }

      setAuthenticatedAccount(accountType, account);

      authCheckPromiseRef.current = null;
      setAuthLoading(false);

      if (accountType === "admin") {
        navigate("/admin", { replace: true });
      } else if (accountType === "recruiter") {
        navigate("/recruiter", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      return {
        success: true,
        requires2FA: false,
        type: accountType,
        user: account,
      };
    } catch (error) {
      console.error("Google authentication error:", error);
      throw error;
    }
  };

  const handleSignup = async (details = {}) => {
    try {
      const {
        role,
        name,
        email,
        password,
        phoneNo,
      } = details;

      if (
        !name?.trim() ||
        !email?.trim() ||
        !password
      ) {
        throw new Error(
          "Name, email and password are required."
        );
      }

      if (!["User", "recruiter"].includes(role)) {
        throw new Error(
          "Please select a valid account type."
        );
      }

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
            ...(phoneNo?.trim()
              ? { phoneNo: phoneNo.trim() }
              : {}),
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Signup failed.")
        );
      }

      const createdName =
        data?.data?.user?.name ||
        name.trim();

      alert(
        `Hello ${createdName}, your account has been created! Welcome to Peer.Hiring.`
      );

      navigate("/login", {
        replace: true,
      });

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message || "Signup failed.");
      throw error;
    }
  };

  const handlePasswordResetOtp = async ({ email } = {}) => {
    try {
      if (!email?.trim()) {
        throw new Error("Email is required.");
      }

      const response = await fetch(
        `${API_URL}/auth/SendPasswordResetOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "OTP sending failed."
          )
        );
      }

      navigate("/forgetPassword");

      return data;
    } catch (error) {
      console.error("Password reset OTP error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleForgetPassword = async ({
    password,
    confirmPassword,
    otp,
  } = {}) => {
    try {
      const otpValue = Array.isArray(otp)
        ? otp.join("")
        : String(otp || "").trim();

      if (!/^\d{6}$/.test(otpValue)) {
        throw new Error(
          "Please enter the valid six-digit OTP."
        );
      }

      if (!password || !confirmPassword) {
        throw new Error(
          "Please enter and confirm your new password."
        );
      }

      if (password !== confirmPassword) {
        throw new Error(
          "Password and confirm password do not match."
        );
      }

      const response = await fetch(
        `${API_URL}/auth/forgetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
            confirmPassword,
            otp: otpValue,
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Password reset failed."
          )
        );
      }

      clearLocalAuth();

      alert("Password changed successfully.");

      navigate("/login", { replace: true });

      return data;
    } catch (error) {
      console.error("Password reset error:", error);
      alert(error.message);
      throw error;
    }
  };

  const changeName = async ({ name } = {}) => {
    try {
      if (!name?.trim()) {
        throw new Error("Name is required.");
      }

      const response = await authenticatedFetch(
        `${API_URL}/auth/changeName`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Name update failed."
          )
        );
      }

      const updatedAccount = data?.data;

      if (updatedAccount?._id) {
        if (recruiter) {
          setRecruiter((previous) =>
            previous
              ? { ...previous, ...updatedAccount }
              : previous
          );
        } else if (user) {
          setUser((previous) =>
            previous
              ? { ...previous, ...updatedAccount }
              : previous
          );
        }
      }

      return data;
    } catch (error) {
      console.error("Name update error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    const logoutURL = `${API_URL}/auth/logoutCurrentUser`;

    try {
      let response = await fetch(logoutURL, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshed =
          await handleRefreshAccessToken();

        if (refreshed) {
          response = await fetch(logoutURL, {
            method: "POST",
            credentials: "include",
          });
        }
      }

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Logout failed.")
        );
      }

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    } finally {
      clearLocalAuth();
      authCheckPromiseRef.current = null;
      navigate("/login", { replace: true });
    }
  };

  const handleDeleteAccount = async ({
    otp,
    password,
  } = {}) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/deleteAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            password,
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Account deletion failed."
          )
        );
      }

      clearLocalAuth();

      authCheckPromiseRef.current = null;

      alert("Account deleted successfully.");

      navigate("/login", { replace: true });

      return data;
    } catch (error) {
      console.error("Delete account error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleEmailVerificationOtp = async () => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/sendEmailVerificationOtp`,
        {
          method: "POST",
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Email verification OTP sending failed."
          )
        );
      }

      return data;
    } catch (error) {
      console.error("Email verification OTP error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleVerifyEmail = async ({ otp } = {}) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/VerifyEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Email verification failed."
          )
        );
      }

      await getUser();

      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleSendDeleteAccountOtp = async () => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/sendDeleteAccountOtp`,
        {
          method: "POST",
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Delete account OTP sending failed."
          )
        );
      }

      return data;
    } catch (error) {
      console.error("Delete account OTP error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleUpdateAvatar = async (formData) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/update-avatar`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Avatar update failed.")
        );
      }

      const avatar =
        data?.data?.avatar ||
        (data?.data?.url ? data.data : null);

      if (avatar) {
        setUser((previous) =>
          previous
            ? { ...previous, avatar }
            : previous
        );

        setRecruiter((previous) =>
          previous
            ? { ...previous, avatar }
            : previous
        );

      }

      return data;
    } catch (error) {
      console.error("Avatar update failed:", error);
      throw error;
    }
  };

  const handleUpdateCoverImage = async (formData) => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/update-coverImage`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Cover image update failed."
          )
        );
      }

      const coverImage =
        data?.data?.coverImage ||
        (data?.data?.url ? data.data : null);

      if (coverImage) {
        setUser((previous) =>
          previous
            ? { ...previous, coverImage }
            : previous
        );

        setRecruiter((previous) =>
          previous
            ? { ...previous, coverImage }
            : previous
        );
      }

      return data;
    } catch (error) {
      console.error("Cover image update failed:", error);
      throw error;
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await authenticatedFetch(
        `${API_URL}/auth/2fa/enable`,
        {
          method: "POST",
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "2FA enable failed.")
        );
      }

      return data;
    } catch (error) {
      console.error("2FA enable error:", error);
      throw error;
    }
  };

  const handleVerify2fa = async ({ token } = {}) => {
    try {
      if (!token) {
        throw new Error(
          "Authentication code is required."
        );
      }

      const response = await authenticatedFetch(
        `${API_URL}/auth/2fa/verify-setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: String(token).trim(),
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "2FA verification failed."
          )
        );
      }

      await getUser();

      return data;
    } catch (error) {
      console.error("2FA verification error:", error);
      throw error;
    }
  };

  const handleLoginWith2FA = async ({
    twoFactorToken,
    userId,
    token,
  } = {}) => {
    try {
      if (!twoFactorToken || !token) {
        throw new Error(
          "Two-factor login token and authentication code are required."
        );
      }

      const response = await fetch(
        `${API_URL}/auth/login/2fa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            twoFactorToken,
            userId,
            token: String(token).trim(),
          }),
        }
      );

      const responseData = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            responseData,
            "Two-factor login failed."
          )
        );
      }

      const data = responseData?.data;

      if (!data) {
        throw new Error(
          "Invalid 2FA login response."
        );
      }

      const account =
        data.user ||
        data.recruiter ||
        data.admin;

      const accountType = normalizeAccountType(
        data.type,
        account
      );

      if (!account?._id || !accountType) {
        throw new Error(
          "Account data missing from 2FA login response."
        );
      }

      setAuthenticatedAccount(
        accountType,
        account
      );

      authCheckPromiseRef.current = null;
      setAuthLoading(false);

      if (accountType === "admin") {
        navigate("/admin", { replace: true });
      } else if (accountType === "recruiter") {
        navigate("/recruiter", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      return {
        success: true,
        requires2FA: false,
        type: accountType,
        data,
      };
    } catch (error) {
      console.error("2FA login error:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    admin,
    recruiter,
    authLoading,
    getUser,
    handleRefreshAccessToken,
    authenticatedFetch,
    handleLogin,
    handleGoogleAuth,
    handleSignup,
    handleLogout,
    handlePasswordResetOtp,
    handleForgetPassword,
    changeName,
    handleDeleteAccount,
    handleEmailVerificationOtp,
    handleVerifyEmail,
    handleUpdateAvatar,
    handleUpdateCoverImage,
    handleSendDeleteAccountOtp,
    handleEnable2FA,
    handleVerify2fa,
    handleLoginWith2FA,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;