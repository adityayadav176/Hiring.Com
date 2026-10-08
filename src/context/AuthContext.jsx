import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [recruiter, setRecruiter] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const getUser = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/fetchUser", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: "include",
                
            });
            
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed to fetch User");  
            }

            console.log(data);

            setUser(data.data);
            console.log(data);
    
            console.log("User fatched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message)
        }
    }

    console.log(user);
    console.log("recruiter", recruiter);

const handleLogin = async (details) => {
    try {
        const { email, password, phoneNo } = details;

        if ((!email && !phoneNo) || !password) {
            throw new Error(
                "Please enter email/phone number and password"
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
            throw new Error(
                data?.message || "Login Failed"
            );
        }

        // 2FA REQUIRED
        if (data?.data?.twoFactorRequired) {
            console.log("2FA required");
            console.log(data.data.userId);
            console.log(data.data.type);
            return {
                requires2FA: true,
                userId: data.data.userId,
                type: data.data.type,
            };
        }

        

        // ADMIN
        if (data?.data?.type === "admin") {
            setAdmin(data.data);
            navigate("/admin");
            return {
                requires2FA: false,
                success: true,
            };
        }

        // RECRUITER
        if (data?.data?.user?.role === "recruiter") {
            setRecruiter(data.data.user);
            navigate("/recruiter");
            return {
                requires2FA: false,
                success: true,
            };
        }

        // NORMAL USER
        setUser(data.data.user);

        console.log(
            "User Login Successfully:",
            data.data.user
        );

        navigate("/");

        return {
            requires2FA: false,
            success: true,
        };

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

    const handleSignup = async(details) => {
        try {
            const {name, email, password, avatar, coverImage, role, phoneNo} = details;

            if (!role) {
                alert("Please select your role.");
                return;
            }

            if (!avatar) {
                alert("Please select an avatar.");
                return;
            }

            if (!coverImage) {
                alert("Please select a cover image.");
                return;
            }

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phoneNo", phoneNo);
            formData.append("avatar", avatar);
            formData.append("coverImage", coverImage);
            formData.append("role", role);
            const response = await fetch("http://localhost:9000/api/v1/auth/register", {
                method: "POST",
                body: formData
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Signup Failed")
            }

            alert(
                `Hello ${data?.data?.user?.name}, your account has been created! Welcome to Peer Hiring.`
            );
    
            console.log("Signup Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

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

    const handleLogout = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/logoutCurrentUser", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Logout Failed");
            }
    
            console.log("LogoutUser Successfully");
            localStorage.removeItem("token");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

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

    const handleUpdateAvatar = async({avatar}) => {

        const formData = new FormData();
        formData.append("avatar", avatar);
        try {
            const response  = await fetch("http://localhost:9000/api/v1/auth/update-avatar", {
                method: "PATCH",
                credentials: "include",
                body: formData
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "AvatarUpdating Failed");
            }
    
            console.log("Avatar Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message)
        }
    } 

    const handleUpdateCoverImage = async({coverImage}) => {

        const formData = new FormData();
        formData.append("coverImage", coverImage);

        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/update-coverImage", {
                method:"PATCH",
                credentials:"include",
                body: formData
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "CoverImage Updating Failed");
            }
    
            console.log("CoverIamge Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message)
        }
    }

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

   const handleLoginWith2FA = async ({ userId, token }) => {
    try {
        const response = await fetch(
            "http://localhost:9000/api/v1/auth/login/2fa",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    token,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Login with 2FA failed"
            );
        }

        console.log("Login with 2FA successfully:", data);

        if (data?.data?.type === "admin") {
            setAdmin(data.data);
            navigate("/admin");
            return {
                requires2FA: false,
                success: true,
            };
        }

        // RECRUITER
        if (data?.data?.user?.role === "recruiter") {
            setRecruiter(data.data.user);
            navigate("/recruiter");
            return {
                requires2FA: false,
                success: true,
            };
        }

         setUser(data.data.user);

        console.log(
            "User Login Successfully:",
            data.data.user
        );

        navigate("/");

        return data.data.user;
    } catch (error) {
        console.error("Login with 2FA error:", error);
        throw error;
    }
};

    const handleRefreshAccessToken = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/refreshAccessToken", {
                headers: {
                    "Content-Type":"application/json",
                },
                method: "POST",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "refreshAccessToken Failed");
            }
    
            console.log("refreshAccessToken Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    useEffect(() => {
        if(!user) {
            getUser();
        }
    }, [user])
    


    return (
        <AuthContext.Provider value={{user, admin, recruiter, authLoading, getUser, handleLogin, handleForgetPassword, handleDeleteAccount, handleLogout ,handleSignup, changeName, handlePasswordResetOtp, handleEnable2FA, handleLoginWith2FA, handleVerify2fa, handleEmailVerificationOtp, handleVerifyEmail, handleUpdateAvatar, handleUpdateCoverImage, handleSendDeleteAccountOtp, handleRefreshAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;