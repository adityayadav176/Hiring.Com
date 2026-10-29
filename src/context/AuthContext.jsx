import {
  createContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [recruiter, setRecruiter] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = "http://localhost:9000/api/v1"

    const refreshPromiseRef = useRef(null);
const authCheckPromiseRef = useRef(null);
const mountedRef = useRef(true);


const handleRefreshAccessToken = useCallback(async () => {
  if (refreshPromiseRef.current) {
    return refreshPromiseRef.current;
  }

  refreshPromiseRef.current = (async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/auth/refreshAccessToken",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Refresh failed:", {
          status: response.status,
          message: data.message,
          response: data,
        });

        return false;
      }

      console.log("Access token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Refresh request failed:", error);
      return false;
    } finally {
      refreshPromiseRef.current = null;
    }
  })();

  return refreshPromiseRef.current;
}, []);



const getUser = useCallback(async () => {
  if (authCheckPromiseRef.current) {
    return authCheckPromiseRef.current;
  }

  authCheckPromiseRef.current = (async () => {
    try {
      const fetchCurrentUser = () =>
        fetch("http://localhost:9000/api/v1/auth/fetchUser", {
          method: "GET",
          credentials: "include",
        });

          console.trace("getUser() was called");

  if (authCheckPromiseRef.current) {
    return authCheckPromiseRef.current;
  }


      let response = await fetchCurrentUser();

      if (response.status === 401) {
        const refreshed = await handleRefreshAccessToken();

        if (refreshed) {
          response = await fetchCurrentUser();
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || `Authentication failed (${response.status})`
        );
      }

      const account = data?.data;

      if (!account) {
        throw new Error("User data was not returned by the server");
      }

      if (!mountedRef.current) return null;

      // Update only user/recruiter state.
      // Never clear admin state from the user authentication flow.
      if (account.role === "recruiter") {
        setRecruiter(account);
        setUser(null);
      } else {
        setUser(account);
        setRecruiter(null);
      }

      return account;
    } catch (error) {
      console.error("User session restoration failed:", error);

      if (mountedRef.current) {
        setUser(null);
        setRecruiter(null);

        // Do not clear admin state.
        // Do not navigate here; let ProtectedRoutes decide.
      }

      return null;
    } finally {
      authCheckPromiseRef.current = null;

      if (mountedRef.current) {
        setAuthLoading(false);
      }
    }
  })();

  return authCheckPromiseRef.current;
}, [handleRefreshAccessToken]);




const handleLogin = async (details) => {
    try {
        const { email, password, phoneNo } = details;

        if ((!email && !phoneNo) || !password) {
            throw new Error(
                "Please enter email/phone number and password."
            );
        }

        const response = await fetch(
            "http://localhost:9000/api/v1/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email || null,
                    password,
                    phoneNo: phoneNo || null,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Login failed.");
        }

        const account = data?.data;

        if (!account) {
            throw new Error("Invalid login response from server.");
        }

        // Two-factor authentication required
        if (account.twoFactorRequired) {
            if (!account.twoFactorToken) {
                throw new Error(
                    "The server requires 2FA but did not return a temporary token."
                );
            }

            return {
                requires2FA: true,
                twoFactorToken: account.twoFactorToken,
                userId: account.userId,
                type: account.type,
            };
        }

        // Admin login
        if (account.type === "admin") {
            setUser(null);
            setRecruiter(null);
            setAdmin(account);

            navigate("/admin", { replace: true });

            return {
                success: true,
                requires2FA: false,
            };
        }

        // Recruiter login
        if (account.type === "recruiter") {
            if (!account.recruiter) {
                throw new Error("Recruiter data missing from server response.");
            }

            setUser(null);
            setAdmin(null);
            setRecruiter(account.recruiter);

            navigate("/recruiter", { replace: true });

            return {
                success: true,
                requires2FA: false,
            };
        }

        // Normal user login
        if (account.type === "user") {
            if (!account.user) {
                throw new Error("User data missing from server response.");
            }

            setAdmin(null);
            setRecruiter(null);
            setUser(account.user);

            navigate("/", { replace: true });

            return {
                success: true,
                requires2FA: false,
            };
        }

        throw new Error("Unknown account type returned by server.");
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


const handleGoogleAuth = async ({ credential, role = null }) => {
    try {
        if (!credential) {
            throw new Error("Google credential is required");
        }

        const response = await fetch(
            "http://localhost:9000/api/v1/auth/google",
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Google Authentication Failed"
            );
        }

        console.log(
            "Google Authentication Successfully:",
            data
        );

        const account = data?.data?.user;

        if (!account) {
            throw new Error("User data was not returned");
        }

        // RECRUITER
        if (account.role === "recruiter") {
            setRecruiter(account);
            setUser(null);

            navigate("/recruiter");

            return {
                success: true,
                requires2FA: false,
                type: "recruiter",
                user: account,
            };
        }

        // NORMAL USER
        setUser(account);
        setRecruiter(null);

        navigate("/");

        return {
            success: true,
            requires2FA: false,
            type: "user",
            user: account,
        };

    } catch (error) {
        console.error(
            "Google Authentication Error:",
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
            role,
            phoneNo,
        } = details;

        if (!role) {
            alert("Please select your role.");
            return;
        }

        if (!(avatar instanceof File)) {
            alert("Please select a valid avatar image.");
            console.log("Avatar value:", avatar);
            return;
        }

        if (!(coverImage instanceof File)) {
            alert("Please select a valid cover image.");
            console.log("Cover image value:", coverImage);
            return;
        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phoneNo", phoneNo ?? "");
        formData.append("avatar", avatar);
        formData.append("coverImage", coverImage);
        formData.append("role", role);

        // Debug: verify the files before sending
        console.log("Avatar:", formData.get("avatar"));
        console.log("Cover image:", formData.get("coverImage"));

        const response = await fetch(
            "http://localhost:9000/api/v1/auth/register",
            {
                method: "POST",
                body: formData,
                // Do not manually set Content-Type for FormData.
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        alert(
            `Hello ${data?.data?.user?.name || name}, your account has been created! Welcome to Peer Hiring.`
        );

        navigate("/login");
    } catch (error) {
        console.error("Signup error:", error);
        alert(error.message || "Something went wrong.");
    }
};


    const handlePasswordResetOtp = async({email}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/SendPasswordResetOtp", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({email})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Otp Sending Failed");
            }
    
            console.log("Otp Send Successfully");
            navigate("/forgetPassword");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleForgetPassword = async({password, confirmPassword, otp}) => {

        const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    if (!password) {
      alert("Please enter your new password");
      return;
    }

    if (!confirmPassword) {
      alert("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/forgetPassword", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({password, confirmPassword, otp: otpValue}),
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Password Reset Failed");
            }

            alert("Password changed successfully");
            navigate("/login");
    
            console.log("Password Reset Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const changeName = async({name}) => {
            try {
                const response = await fetch("http://localhost:9000/api/v1/auth/changeName", {
                    headers: {
                        "Content-Type":"application/json",
                    },
                    method: "PATCH",
                    credentials: "include",
                    body: JSON.stringify({name})
                });
    
                const data = await response.json();
    
                if(!response.ok) {
                    throw new Error(data.message || "NameChange Failed"); 
                }
    
                console.log("NameChange Successully");
            } catch (error) {
                console.log(error);
                alert(error.message);
            }
    }

   
const handleLogout = async () => {
  try {
    const response = await fetch(
      "http://localhost:9000/api/v1/auth/logoutCurrentUser",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    console.log("Logout successful");

    // Clear every account type from React state.
    setUser(null);
    setRecruiter(null);
    setAdmin(null);

    // Clear any cached authentication-check promise.
    authCheckPromiseRef.current = null;

    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout error:", error);
    alert(error.message || "Logout failed");
  }
};


   const handleDeleteAccount = async ({ otp, password }) => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/deleteAccount",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    otp,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Account deletion failed"
            );
        }

        console.log("Account deleted successfully");
        navigate("/login");

    } catch (error) {
        console.error("Delete account error:", error);
        alert(error.message || "Account deletion failed");
    }
};

    const handleEmailVerificationOtp = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/sendEmailVerificationOtp", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "EmailVerificationOTP Failed TO Send");
            }
    
            console.log("EmailVerificationOTPSend");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleVerifyEmail = async({otp}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/VerifyEmail", {
                headers: {
                    "Content-Type":"application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({otp})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "EmailVerification Failed");
            }
    
            console.log("Email Verified Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleSendDeleteAccountOtp = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/sendDeleteAccountOtp", {
                headers: {
                    "Content-Type":"application/json",
                },
                method: "POST",
                credentials: "include"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "DeleteAccountOtpSending Failed");
            }
    
            console.log("DeleteAccountOtpSend");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

const handleUpdateAvatar = async (formData) => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/update-avatar",
            {
                method: "PATCH",
                credentials: "include",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Avatar Updating Failed"
            );
        }

        console.log("Avatar Updated Successfully");

        return data;
    } catch (error) {
        console.error("Avatar update failed:", error);
        throw error;
    }
};

const handleUpdateCoverImage = async (formData) => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/update-coverImage",
            {
                method: "PATCH",
                credentials: "include",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Cover Image Updating Failed"
            );
        }

        console.log("Cover Image Updated Successfully");

        return data;
    } catch (error) {
        console.error("Cover image update failed:", error);
        throw error;
    }
};  

   const handleEnable2FA = async () => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/2fa/enable",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "2FA Enable Failed"
            );
        }

        console.log("2FA Enable Successfully:", data);

        return data;
    } catch (error) {
        console.error("2FA Enable Error:", error);
        throw error;
    }
};

const handleVerify2fa = async ({ token }) => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/2fa/verify-setup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "2FA Verify Failed"
            );
        }

        console.log("2FA Verify Successfully:", data);

        return data;
    } catch (error) {
        console.error("2FA Verify Error:", error);
        throw error;
    }
};

 

const handleLoginWith2FA = async ({ twoFactorToken, userId, token }) => {
  try {
    if (!twoFactorToken || !token) {
      throw new Error(
        "Two-factor login token and authentication code are required."
      );
    }

    const response = await axios.post(
      `${API_URL}/auth/login/2fa`,
      {
        twoFactorToken,
        userId,
        token: String(token).trim(),
      },
      { withCredentials: true }
    );

    const data = response.data?.data;

    if (!data?.user) {
      throw new Error("User data missing from login response.");
    }

    if (data.type === "recruiter") {
      setRecruiter(data.user);
      setUser(null);
      setAdmin(null);

      navigate("/recruiter", { replace: true });
    } else if (data.type === "user") {
      setUser(data.user);
      setRecruiter(null);
      setAdmin(null);

      navigate("/", { replace: true });
    } else {
      throw new Error("Unknown account type returned by server.");
    }

    return {
      success: true,
      requires2FA: false,
      data,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Two-factor login failed.";

    console.error("Login with 2FA error:", message);
    throw new Error(message);
  }
};



 


    return (
        <AuthContext.Provider value={{user, admin, recruiter, handleGoogleAuth, authLoading, getUser, handleLogin, handleForgetPassword, handleDeleteAccount, handleLogout ,handleSignup, changeName, handlePasswordResetOtp, handleEnable2FA, handleLoginWith2FA, handleVerify2fa, handleEmailVerificationOtp, handleVerifyEmail, handleUpdateAvatar, handleUpdateCoverImage, handleSendDeleteAccountOtp, handleRefreshAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;