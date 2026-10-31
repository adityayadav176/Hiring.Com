
import {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:9000/api/v1"
).replace(/\/$/, "");

// IMPORTANT:
// These paths must match your actual Admin router.

const ADMIN_PROFILE_URL = `${API_URL}/admin/profile`;
const ADMIN_LOGOUT_URL = `${API_URL}/admin/logout`;

const REFRESH_URL = `${API_URL}/auth/refreshAccessToken`;

const parseResponse = async (response) => {
  return response.json().catch(() => ({}));
};

const getErrorMessage = (data, fallback) => {
  return (
    data?.message ||
    data?.error ||
    fallback ||
    "Something went wrong."
  );
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
    if (!mountedRef.current) return;

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

      if (type === "admin") {
        setAdmin(account);
        setUser(null);
        setRecruiter(null);
        return;
      }

      if (type === "recruiter") {
        setRecruiter(account);
        setUser(null);
        setAdmin(null);
        return;
      }

      setUser(account);
      setRecruiter(null);
      setAdmin(null);
    },
    [clearLocalAuth]
  );

  const handleRefreshAccessToken = useCallback(async () => {
    // Deduplicate concurrent refresh requests in this tab.
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
          console.error("Access token refresh failed:", {
            status: response.status,
            message: data?.message,
          });

          return false;
        }

        console.log("Access token refreshed successfully.");

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

  // Use for protected User, Recruiter and Admin requests.
  // Login, registration and refresh requests should not
  // use this helper.

  const authenticatedFetch = useCallback(
    async (url, options = {}) => {
      const makeRequest = () =>
        fetch(url, {
          ...options,
          credentials: "include",
        });

      let response = await makeRequest();

      // Never retry the refresh endpoint itself.
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

      console.log(
        "Protected request returned 401. Refreshing token..."
      );

      const refreshed = await handleRefreshAccessToken();

      if (!refreshed) {
        return response;
      }

      // Retry the original request only once.
      response = await makeRequest();

      return response;
    },
    [handleRefreshAccessToken]
  );

  const getUser = useCallback(async () => {
    if (authCheckPromiseRef.current) {
      return authCheckPromiseRef.current;
    }

    authCheckPromiseRef.current = (async () => {
      try {
        console.log("Checking authentication session...");

        const readCurrentAccount = async () => {

          const userResponse = await fetch(
            `${API_URL}/auth/fetchUser`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const userData = await parseResponse(userResponse);

          if (userResponse.ok) {
            const account = userData?.data;

            if (!account?._id) {
              throw new Error(
                "User data missing from server response."
              );
            }

            return {
              authenticated: true,
              type:
                account.role === "recruiter"
                  ? "recruiter"
                  : "user",
              account,
              userStatus: userResponse.status,
              adminStatus: null,
            };
          }

          const adminResponse = await fetch(
            ADMIN_PROFILE_URL,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const adminData = await parseResponse(adminResponse);

          if (adminResponse.ok) {
            const account = adminData?.data?.admin;

            if (!account?._id) {
              throw new Error(
                "Admin data missing from server response."
              );
            }

            return {
              authenticated: true,
              type: "admin",
              account,
              userStatus: userResponse.status,
              adminStatus: adminResponse.status,
            };
          }

          return {
            authenticated: false,
            account: null,
            userStatus: userResponse.status,
            adminStatus: adminResponse.status,
            userMessage: userData?.message,
            adminMessage: adminData?.message,
          };
        };

    
        let result = await readCurrentAccount();


        if (
          !result.authenticated &&
          (
            result.userStatus === 401 ||
            result.adminStatus === 401
          )
        ) {
          console.log(
            "Access token invalid or expired. Trying refresh..."
          );

          const refreshed = await handleRefreshAccessToken();

          if (refreshed) {
            result = await readCurrentAccount();
          } else {
            throw new Error(
              "Session expired. Please log in again."
            );
          }
        }

        if (!result.authenticated || !result.account) {
          throw new Error(
            result.userMessage ||
            result.adminMessage ||
            "Authentication session could not be restored."
          );
        }

        if (!mountedRef.current) {
          return null;
        }

        setAuthenticatedAccount(
          result.type,
          result.account
        );

        console.log(
          `${result.type} authentication restored successfully.`
        );

        return result.account;
      } catch (error) {
        console.error(
          "Session restoration failed:",
          error
        );

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

    getUser();

    return () => {
      mountedRef.current = false;
    };
  }, [getUser]);

  const handleLogin = async (details) => {
    try {
      const {
        email,
        password,
        phoneNo,
      } = details || {};

      if ((!email && !phoneNo) || !password) {
        throw new Error(
          "Please enter email/phone number and password."
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
            email: email || null,
            phoneNo: phoneNo || null,
            password,
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Login failed.")
        );
      }

      const account = data?.data;

      if (!account) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      if (account.twoFactorRequired) {
        if (!account.twoFactorToken) {
          throw new Error(
            "Temporary 2FA token was not returned by server."
          );
        }

        return {
          success: true,
          requires2FA: true,
          twoFactorToken: account.twoFactorToken,
          userId: account.userId,
          type: account.type,
        };
      }

      if (account.type === "admin") {
        if (!account.admin?._id) {
          throw new Error(
            "Admin data missing from server response."
          );
        }

        setAuthenticatedAccount(
          "admin",
          account.admin
        );

        authCheckPromiseRef.current = null;

        navigate("/admin", { replace: true });

        return {
          success: true,
          requires2FA: false,
          type: "admin",
        };
      }

      if (account.type === "recruiter") {
        if (!account.recruiter?._id) {
          throw new Error(
            "Recruiter data missing from server response."
          );
        }

        setAuthenticatedAccount(
          "recruiter",
          account.recruiter
        );

        authCheckPromiseRef.current = null;

        navigate("/recruiter", { replace: true });

        return {
          success: true,
          requires2FA: false,
          type: "recruiter",
        };
      }

      if (account.type === "user") {
        if (!account.user?._id) {
          throw new Error(
            "User data missing from server response."
          );
        }

        setAuthenticatedAccount(
          "user",
          account.user
        );

        authCheckPromiseRef.current = null;

        navigate("/", { replace: true });

        return {
          success: true,
          requires2FA: false,
          type: "user",
        };
      }

      throw new Error(
        "Unknown account type returned by server."
      );
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };


  const handleGoogleAuth = async ({ credential } = {}) => {
    try {
      if (!credential) {
        throw new Error(
          "Google credential is required."
        );
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
          }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Google authentication failed."
          )
        );
      }

      const accountData = data?.data;

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
          type: accountData.type,
        };
      }

      // Backend may return user or recruiter.
      const account =
        accountData.user ||
        accountData.recruiter;

      if (!account?._id) {
        throw new Error(
          "Account data missing from Google response."
        );
      }

      if (account.role === "recruiter") {
        setAuthenticatedAccount(
          "recruiter",
          account
        );

        navigate("/recruiter", {
          replace: true,
        });

        return {
          success: true,
          requires2FA: false,
          type: "recruiter",
          user: account,
        };
      }

      setAuthenticatedAccount("user", account);

      navigate("/", { replace: true });

      return {
        success: true,
        requires2FA: false,
        type: "user",
        user: account,
      };
    } catch (error) {
      console.error(
        "Google authentication error:",
        error
      );

      throw error;
    }
  };


  const handleSignup = async (details) => {
    try {
      const {
        name,
        email,
        password,
        avatar,
        coverImage,
        phoneNo,
      } = details || {};

      if (!name?.trim() || !email?.trim() || !password) {
        throw new Error(
          "Name, email and password are required."
        );
      }

      if (!(avatar instanceof File)) {
        throw new Error(
          "Please select a valid avatar image."
        );
      }

      if (!(coverImage instanceof File)) {
        throw new Error(
          "Please select a valid cover image."
        );
      }

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);

      if (phoneNo?.trim()) {
        formData.append("phoneNo", phoneNo.trim());
      }

      formData.append("avatar", avatar);
      formData.append("coverImage", coverImage);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Signup failed.")
        );
      }

      const createdName =
        data?.data?.user?.name || name;

      alert(
        `Hello ${createdName}, your account has been created! Welcome to Peer.Hiring.`
      );

      navigate("/login", { replace: true });

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
          getErrorMessage(data, "OTP sending failed.")
        );
      }

      console.log("Password reset OTP request completed.");

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
          getErrorMessage(data, "Password reset failed.")
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
          getErrorMessage(data, "Name update failed.")
        );
      }

      const updatedUser = data?.data;

      if (updatedUser?._id) {
        if (recruiter) {
          setRecruiter((previous) =>
            previous
              ? { ...previous, ...updatedUser }
              : previous
          );
        } else if (user) {
          setUser((previous) =>
            previous
              ? { ...previous, ...updatedUser }
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
    const logoutURL = admin
      ? ADMIN_LOGOUT_URL
      : `${API_URL}/auth/logoutCurrentUser`;

    try {
      let response = await fetch(logoutURL, {
        method: "POST",
        credentials: "include",
      });

      // Retry once if access token has expired.
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

      console.log("Logout successful.");

      return true;
    } catch (error) {
      console.error("Logout error:", error);

      alert(
        error.message ||
        "Logout failed. The local session will be cleared."
      );

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

      console.log("Email verification OTP request completed.");

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

      console.log("Email verified successfully.");

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

      console.log("Delete account OTP request completed.");

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

      const avatar = data?.data?.avatar;

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

      console.log("Avatar updated successfully.");

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

      const coverImage = data?.data?.coverImage;

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

      console.log("Cover image updated successfully.");

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
      const response = await authenticatedFetch(
        `${API_URL}/auth/2fa/verify-setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "2FA verification failed.")
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

      const account =
        data?.user ||
        data?.recruiter;

      if (!account?._id) {
        throw new Error(
          "Account data missing from 2FA login response."
        );
      }

      const accountType =
        data.type === "recruiter" ||
        account.role === "recruiter"
          ? "recruiter"
          : "user";

      setAuthenticatedAccount(
        accountType,
        account
      );

      authCheckPromiseRef.current = null;

      if (accountType === "recruiter") {
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
    // Account state
    user,
    admin,
    recruiter,
    authLoading,

    // Session functions
    getUser,
    handleRefreshAccessToken,
    authenticatedFetch,

    // Authentication
    handleLogin,
    handleGoogleAuth,
    handleSignup,
    handleLogout,

    // Password and account
    handlePasswordResetOtp,
    handleForgetPassword,
    changeName,
    handleDeleteAccount,

    // Email verification
    handleEmailVerificationOtp,
    handleVerifyEmail,

    // Images
    handleUpdateAvatar,
    handleUpdateCoverImage,

    // Account deletion OTP
    handleSendDeleteAccountOtp,

    // 2FA
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
