import { createContext, useState } from "react";

export const ResumeContext = createContext();

const ResumeProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [resume, setResume] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [resumePagination, setResumePagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalResumes: 0,
        limit: 10,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUploadResume = async ({
        resumeLocalFilePath,
        title,
    }) => {
        if (!resumeLocalFilePath) {
            throw new Error("Resume file is required");
        }

        if (!title?.trim()) {
            throw new Error("Resume title is required");
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();

            formData.append("resume", resumeLocalFilePath);
            formData.append("title", title.trim());

            const response = await fetch(`${API_URL}/resume`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to upload resume"
                );
            }

            const newResume = data?.data;

            setResumes((prev) => [newResume, ...prev]);

            if (newResume?.isDefault) {
                setResume(newResume);
            }

            return newResume;
        } catch (error) {
            console.error("Upload Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllResumes = async ({
        page = 1,
        limit = 10,
    } = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/userResumes?page=${page}&limit=${limit}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to fetch resumes"
                );
            }

            const resumeData = data?.data;

            setResumes(resumeData?.Resumes || []);

            setResumePagination(
                resumeData?.pagination || {
                    currentPage: page,
                    totalPages: 0,
                    totalResumes: 0,
                    limit,
                }
            );

            return resumeData;
        } catch (error) {
            console.error("Get All Resumes Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetResumeById = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/${resumeId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to fetch resume"
                );
            }

            const fetchedResume = data?.data;

            setResume(fetchedResume);

            return fetchedResume;
        } catch (error) {
            console.error("Get Resume By ID Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResumeDetails = async ({
        resumeId,
        title,
    }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        if (!title?.trim()) {
            throw new Error("Resume title is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to update resume"
                );
            }

            const updatedResume = data?.data;

            setResumes((prev) =>
                prev.map((item) =>
                    item._id === resumeId
                        ? updatedResume
                        : item
                )
            );

            setResume((prev) =>
                prev?._id === resumeId
                    ? updatedResume
                    : prev
            );

            return updatedResume;
        } catch (error) {
            console.error(
                "Update Resume Details Error:",
                error
            );
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResumeFile = async ({
        resumeLocalFilePath,
        resumeId,
    }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        if (!resumeLocalFilePath) {
            throw new Error("Resume file is required");
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();

            formData.append("resume", resumeLocalFilePath);

            const response = await fetch(
                `${API_URL}/resume/update/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to update resume file"
                );
            }

            const updatedResume = data?.data;

            setResumes((prev) =>
                prev.map((item) =>
                    item._id === resumeId
                        ? updatedResume
                        : item
                )
            );

            setResume((prev) =>
                prev?._id === resumeId
                    ? updatedResume
                    : prev
            );

            return updatedResume;
        } catch (error) {
            console.error(
                "Update Resume File Error:",
                error
            );
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSetIsDefault = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/ChangeStatus/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to set default resume"
                );
            }

            const defaultResume = data?.data;

            setResumes((prev) =>
                prev.map((item) => ({
                    ...item,
                    isDefault: item._id === resumeId,
                }))
            );

            setResume(defaultResume);

            return defaultResume;
        } catch (error) {
            console.error(
                "Set Default Resume Error:",
                error
            );
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/delete/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to delete resume"
                );
            }

            const deletedResume = data?.data;

            setResumes((prev) =>
                prev.filter(
                    (item) => item._id !== resumeId
                )
            );

            setResume((prev) =>
                prev?._id === resumeId ? null : prev
            );

            return deletedResume;
        } catch (error) {
            console.error("Delete Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreResume = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/restore/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to restore resume"
                );
            }

            const restoredResume = data?.data;

            setResumes((prev) => [
                restoredResume,
                ...prev,
            ]);

            return restoredResume;
        } catch (error) {
            console.error("Restore Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handlePermanentlyDeleteResume = async ({
        resumeId,
    }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/delete/Recycle/${resumeId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to permanently delete resume"
                );
            }

            setResumes((prev) =>
                prev.filter(
                    (item) => item._id !== resumeId
                )
            );

            setResume((prev) =>
                prev?._id === resumeId ? null : prev
            );

            return data?.data;
        } catch (error) {
            console.error(
                "Permanently Delete Resume Error:",
                error
            );
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/resume/${resumeId}/download`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();

                throw new Error(
                    data?.message || "Failed to download resume"
                );
            }

            const downloadUrl = response.url;

            window.open(downloadUrl, "_blank");

            return downloadUrl;
        } catch (error) {
            console.error(
                "Download Resume Error:",
                error
            );
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearResume = () => {
        setResume(null);
    };

    const clearResumeError = () => {
        setError(null);
    };

    return (
        <ResumeContext.Provider
            value={{
                resume,
                resumes,
                resumePagination,
                loading,
                error,
                handleUploadResume,
                handleGetAllResumes,
                handleGetResumeById,
                handleUpdateResumeDetails,
                handleUpdateResumeFile,
                handleSetIsDefault,
                handleDeleteResume,
                handleRestoreResume,
                handlePermanentlyDeleteResume,
                handleDownloadResume,
                clearResume,
                clearResumeError,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeProvider;