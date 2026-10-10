import { createContext, useCallback, useState } from "react";

export const ResumeContext = createContext();

const ResumeProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const BASE_URL = `${API_URL}/resume`;

    const [resume, setResume] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [resumePagination, setResumePagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalResumes: 0,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const parseResponse = async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message || "Something went wrong"
            );
        }

        return data;
    };

    const handleUploadResume = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(BASE_URL, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const result = await parseResponse(response);
            const uploadedResume = result.data;

            setResumes((prev) => [
                uploadedResume,
                ...prev.filter(
                    (item) => item._id !== uploadedResume._id
                ),
            ]);

            setResumePagination((prev) => ({
                ...prev,
                totalResumes: prev.totalResumes + 1,
            }));

            setResume(uploadedResume);

            return {
                success: true,
                data: uploadedResume,
                message: result.message || "Resume uploaded successfully",
            };
        } catch (error) {
            console.error("Upload Resume Error:", error);
            setError(error.message);

            return {
                success: false,
                data: null,
                message: error.message || "Failed to upload resume",
            };
        } finally {
            setLoading(false);
        }
    };


const handleGetAllResumes = useCallback(
  async ({ page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${BASE_URL}/userResumes?page=${page}&limit=${limit}`;

      console.log("Fetching all resumes:", url);

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await parseResponse(response);
      const resumeData = result?.data;

      setResumes(resumeData?.resumes ?? []);

      setResumePagination(
        resumeData?.pagination ?? {
          currentPage: page,
          totalPages: 0,
          totalResumes: 0,
          limit,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );

      return resumeData;
    } catch (error) {
      console.error("Get All Resumes Error:", error);
      setError(error?.message || "Failed to fetch resumes.");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  [BASE_URL, parseResponse]
);


    const handleGetResumeById = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/${resumeId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result = await parseResponse(response);
            const fetchedResume = result.data;

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
        subtitle,
        target,
        skills,
    }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (subtitle !== undefined) updates.subtitle = subtitle;
        if (target !== undefined) updates.target = target;
        if (skills !== undefined) updates.skills = skills;

        if (Object.keys(updates).length === 0) {
            throw new Error("At least one field is required to update");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updates),
                }
            );

            const result = await parseResponse(response);
            const updatedResume = result.data;

            setResumes((prev) =>
                prev.map((item) =>
                    item._id === updatedResume._id
                        ? updatedResume
                        : item
                )
            );

            setResume((prev) =>
                prev?._id === updatedResume._id
                    ? updatedResume
                    : prev
            );

            return updatedResume;
        } catch (error) {
            console.error("Update Resume Details Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResumeFile = async ({
        resumeId,
        file,
    }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        if (!(file instanceof File)) {
            throw new Error("A valid resume file is required");
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/update/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    body: formData,
                }
            );

            const result = await parseResponse(response);
            const updatedResume = result.data;

            setResumes((prev) =>
                prev.map((item) =>
                    item._id === updatedResume._id
                        ? updatedResume
                        : item
                )
            );

            setResume((prev) =>
                prev?._id === updatedResume._id
                    ? updatedResume
                    : prev
            );

            return updatedResume;
        } catch (error) {
            console.error("Update Resume File Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSetIsDefault = async (resumeId) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/ChangeStatus/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await parseResponse(response);
            const defaultResume = result.data;

            setResumes((prev) =>
                prev.map((item) => ({
                    ...item,
                    isDefault: item._id === defaultResume._id,
                }))
            );

            setResume((prev) =>
                prev
                    ? {
                          ...prev,
                          isDefault: prev._id === defaultResume._id,
                      }
                    : prev
            );

            return defaultResume;
        } catch (error) {
            console.error("Set Default Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async (resumeId) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/delete/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await parseResponse(response);

            setResumes((prev) =>
                prev.filter((item) => item._id !== resumeId)
            );

            setResumePagination((prev) => ({
                ...prev,
                totalResumes: Math.max(0, prev.totalResumes - 1),
            }));

            setResume((prev) =>
                prev?._id === resumeId ? null : prev
            );

            return result.data;
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
                `${BASE_URL}/restore/${resumeId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await parseResponse(response);
            const restoredResume = result.data;

            setResumes((prev) => [
                restoredResume,
                ...prev.filter(
                    (item) => item._id !== restoredResume._id
                ),
            ]);

            setResumePagination((prev) => ({
                ...prev,
                totalResumes: prev.totalResumes + 1,
            }));

            return restoredResume;
        } catch (error) {
            console.error("Restore Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handlePermanentlyDeleteResume = async ({ resumeId }) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}/delete/Recycle/${resumeId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await parseResponse(response);

            setResumes((prev) =>
                prev.filter((item) => item._id !== resumeId)
            );

            setResume((prev) =>
                prev?._id === resumeId ? null : prev
            );

            return result.data;
        } catch (error) {
            console.error("Permanently Delete Resume Error:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = ( resumeId ) => {
        if (!resumeId) {
            throw new Error("Resume ID is required");
        }

        const downloadUrl = `${BASE_URL}/${resumeId}/download`;

        window.open(
            downloadUrl,
            "_blank",
            "noopener,noreferrer"
        );

        return downloadUrl;
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