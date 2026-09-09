import { createContext, useState } from "react";

export const ProfileContext = createContext();

const ProfileProvider = ({children}) => {

    const [profile, setProfile] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(null);
    const [profiles, setProfiles] = useState([]);

    const handleCreateProfile = async(details) => {

       try {
        const { bio, headline, skills, projects, experience, education, socialLinks, resumeId, location, preferences } = details;
         const response = await fetch("http://localhost:9000/api/v1/profile", {
             headers: {
                 "Content-Type":"application/json"
             },
             credentials: "include",
             method: "POST",
             body: JSON.stringify({bio, headline, skills, projects, experience, education, socialLinks, resumeId, location, preferences})
         })
 
         const data = await response.json();
 
         if(!response.ok) {
             throw new Error(data.message || "Profile Creting Failed");
         }

         setProfile(data.data);
 
         console.log("Profile Created Successfully");
       } catch (error) {
        console.log(error);
        alert(error.message);
       }
    }

    const handleGetMyProfile = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/profile/me", {
                credentials: "include",
                method: "GET"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Fetched Profile Failed");
            }
    
            console.log("Profile fetched successfully");

            setProfile(data.data);
            
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleUpdateProfile = async(details) => {
        try {
            const { bio, headline, skills, projects, experience, education, socialLinks, resumeId, location, preferences } = details;
            const response = await fetch("http://localhost:9000/api/v1/profile", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({bio, headline, skills, projects, experience, education, socialLinks, resumeId, location, preferences})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Update Profile Failed");
            }
    
            console.log("Profile Updated Successfully");

            setProfile(data.data);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleProfileCompletion = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/profile/profileCompletion", {
                credentials: "include",
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "ProfileCompletion Failed");
            }
    
            console.log("ProfileCompletion Fetched Successfully");
            setProfileCompletion(data.data);

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetProfileByUserId = async(userId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/v1/profile/${userId}`, {
                credentials: "include",
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Profile Fetched Failed");
            }
    
            console.log("Profile Fetched Successfully");
            setSelectedProfile(data.data);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleSearchProfile = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/profile/search", {
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Profile Fetched Failed");
            }
    
            console.log("Profile Fetched Successfully");

            setProfiles(data);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    return (
        <ProfileContext.Provider value={{profile, profiles, selectedProfile, profileCompletion, handleCreateProfile, handleGetMyProfile, handleGetProfileByUserId, handleProfileCompletion, handleSearchProfile, handleUpdateProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileProvider;