import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    const getUser = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/fetchUser", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: "include"
            });
            
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed to fetch User");  
            }

            setUser(data);
    
            console.log("User fatched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message)
        }
    }

    const handleLogin = async(details) => {
        try {
            const {email, password, phoneNo} = details;
            const response = await fetch("http://localhost:9000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: "include",
                body: JSON.stringify({email, password, phoneNo: phoneNo || null})
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Login Failed");
            }
    
            console.log("Login Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleSignup = async(details) => {
        try {
            const {name, email, password, avatar, coverImage, role, phoneNo} = details;

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
    
            console.log("Signup Successfully");
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
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleForgetPassword = async({password, confirmPassword, otp}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/forgetPassword", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({password, confirmPassword, otp})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Password Reset Failed");
            }
    
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
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleDeleteAccount = async({otp, password}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/deleteAccount", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify({otp, password})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Account Deletion Failed");
            }
    
            console.log("Account deleted Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

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

    const handleEnable2FA = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/2fa/enable" ,{
                headers: {
                    "Content-Type":"application/json",
                },
                method: "POST",
                credentials: "include",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "2FA Enable Failed");
            }
    
            console.log("2FA Enable Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message)
        }
    }

    const handleVerify2fa = async({token}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/2fa/verify-setup", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({token})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "2FA Veify Failed");
            }
    
            console.log("2Fa Verify Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleLoginWith2FA = async({token, otp}) => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/login/2fa", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({token, otp})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "LoginWith2FA Failed");
            }
    
            console.log("LoginWith2FA Successfully");
        } catch (error) {
            console.log(error)
            alert(error.message);
        }
    }

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


    return (
        <AuthContext.Provider value={{user, getUser, handleLogin, handleForgetPassword, handleDeleteAccount, handleLogout ,handleSignup, changeName, handlePasswordResetOtp, handleEnable2FA, handleLoginWith2FA, handleVerify2fa, handleEmailVerificationOtp, handleVerifyEmail, handleUpdateAvatar, handleUpdateCoverImage, handleSendDeleteAccountOtp, handleRefreshAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;