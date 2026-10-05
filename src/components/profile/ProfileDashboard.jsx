import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  Code2,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";

import { useAuth, useProfile } from "../../hooks/Hook";
import CreateUProfile from "./CreateUProfile";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import UpdateProfileModal from "../../routes/updateProfileModal";

function ProfileDashboard() {
  const [createProfileModal, setCreateProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    type: null,
    data: null,
  });

  const {
    profile,
    profileCompletion,
    handleGetMyProfile,
    handleProfileCompletion,
    handleCreateProfile,
    handleUpdateProfile,
    setUpdateProfileModal,
    updateProfileModalS
  } = useProfile();

  const [addItemModal, setAddItemModal] = useState({
  open: false,
  type: null,
});

const [addItemForm, setAddItemForm] = useState({});
const [addItemLoading, setAddItemLoading] = useState(false);

const openAddItemModal = (type) => {
  setAddItemModal({
    open: true,
    type,
  });

  if (type === "skill") {
    setAddItemForm({
      name: "",
      level: "beginner",
    });
  }

  if (type === "experience") {
    setAddItemForm({
      position: "",
      company: "",
      employmentType: "full-time",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    });
  }

  if (type === "education") {
    setAddItemForm({
      degree: "",
      field: "",
      institute: "",
      startYear: "",
      endYear: "",
      grade: "",
    });
  }

  if (type === "project") {
    setAddItemForm({
      title: "",
      description: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      startDate: "",
      endDate: "",
    });
  }
};

const closeAddItemModal = () => {
  if (addItemLoading) return;

  setAddItemModal({
    open: false,
    type: null,
  });

  setAddItemForm({});
};

const updateAddItemForm = (field, value) => {
  setAddItemForm((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleAddItem = async (e) => {
  e.preventDefault();

  if (!addItemModal.type) return;

  try {
    setAddItemLoading(true);

    let updatedProfile = {
      ...profile,
    };

    if (addItemModal.type === "skill") {
      if (!addItemForm.name?.trim()) {
        alert("Please enter a skill name.");
        return;
      }

      updatedProfile.skills = [
        ...(profile?.skills || []),
        {
          name: addItemForm.name.trim(),
          level: addItemForm.level,
        },
      ];
    }

    if (addItemModal.type === "experience") {
      if (
        !addItemForm.position?.trim() ||
        !addItemForm.company?.trim()
      ) {
        alert("Please enter position and company.");
        return;
      }

      updatedProfile.experience = [
        ...(profile?.experience || []),
        {
          position: addItemForm.position.trim(),
          company: addItemForm.company.trim(),
          employmentType: addItemForm.employmentType,
          startDate: addItemForm.startDate || null,
          endDate: addItemForm.currentlyWorking
            ? null
            : addItemForm.endDate || null,
          currentlyWorking: addItemForm.currentlyWorking,
          description: addItemForm.description.trim(),
        },
      ];
    }

    if (addItemModal.type === "education") {
      if (
        !addItemForm.degree?.trim() ||
        !addItemForm.institute?.trim()
      ) {
        alert("Please enter degree and institute.");
        return;
      }

      updatedProfile.education = [
        ...(profile?.education || []),
        {
          degree: addItemForm.degree.trim(),
          field: addItemForm.field.trim(),
          institute: addItemForm.institute.trim(),
          startYear: addItemForm.startYear
            ? Number(addItemForm.startYear)
            : null,
          endYear: addItemForm.endYear
            ? Number(addItemForm.endYear)
            : null,
          grade: addItemForm.grade.trim(),
        },
      ];
    }

    if (addItemModal.type === "project") {
      if (!addItemForm.title?.trim()) {
        alert("Please enter a project title.");
        return;
      }

      updatedProfile.projects = [
        ...(profile?.projects || []),
        {
          title: addItemForm.title.trim(),
          description: addItemForm.description.trim(),
          technologies: addItemForm.technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          githubUrl: addItemForm.githubUrl.trim(),
          liveUrl: addItemForm.liveUrl.trim(),
          startDate: addItemForm.startDate || null,
          endDate: addItemForm.endDate || null,
        },
      ];
    }

    await handleUpdateProfile(updatedProfile);

    closeAddItemModal();

    await handleGetMyProfile();
    await handleProfileCompletion();
  } catch (error) {
    console.error("Failed to add profile item:", error);
    alert(
      error?.response?.data?.message ||
        "Something went wrong while saving."
    );
  } finally {
    setAddItemLoading(false);
  }
};

  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const profileData = await handleGetMyProfile();

        if (profileData) {
          await handleProfileCompletion();
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      mounted = false;
    };
  }, []);

  const skills = profile?.skills || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const experience = profile?.experience || [];

  const location = profile?.location || {};
  const preferences = profile?.preferences || {};
  const socialLinks = profile?.socialLinks || {};

  const score =
    profileCompletion?.score ??
    profile?.profileCompletion ??
    0;

  const missingFields = profileCompletion?.missingFields || [];

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (startDate, endDate, currentlyWorking) => {
    const start = formatDate(startDate);

    if (!start) {
      return currentlyWorking ? "Currently working" : "";
    }

    if (currentlyWorking) {
      return `${start} - Present`;
    }

    const end = formatDate(endDate);

    if (!end) {
      return start;
    }

    return `${start} - ${end}`;
  };

  const formatYearRange = (startYear, endYear) => {
    if (!startYear && !endYear) {
      return "";
    }

    if (startYear && endYear) {
      return `${startYear} - ${endYear}`;
    }

    if (startYear) {
      return `${startYear} - Present`;
    }

    return `${endYear}`;
  };

  const capitalize = (value) => {
    if (!value) return "";

    return value
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const normalizeUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `https://${url}`;
  };

  const openUrl = (url) => {
    if (!url) return;

    window.open(
      normalizeUrl(url),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openDetails = (type, data) => {
    setDetailsModal({
      open: true,
      type,
      data,
    });
  };

  const closeDetails = () => {
    setDetailsModal({
      open: false,
      type: null,
      data: null,
    });
  };

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }

    return "U";
  };

  const getSkillLevelStyle = (level) => {
    if (level === "expert") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (level === "intermediate") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-64 rounded-3xl bg-white border border-slate-200" />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <div className="h-96 rounded-3xl bg-white border border-slate-200" />

            <div className="space-y-6">
              <div className="h-48 rounded-3xl bg-white border border-slate-200" />
              <div className="h-64 rounded-3xl bg-white border border-slate-200" />
              <div className="h-64 rounded-3xl bg-white border border-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />
            </div>

            <div className="relative px-6 pb-10 md:px-10">
              <div className="-mt-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-violet-100 text-4xl font-bold text-violet-700 shadow-lg">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user?.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial()
                )}
              </div>

              <div className="mt-6 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {user?.name || "Your Profile"}
                  </h1>

                  {user?.isVerified && (
                    <CircleCheck className="h-5 w-5 text-blue-500" />
                  )}
                </div>

                <p className="mt-2 text-slate-500">
                  Build your professional identity on Peer.Hiring.
                </p>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Add your skills, experience, education, projects,
                  social links and job preferences so recruiters can
                  understand your profile better.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateProfileModal(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-[#5b21b6]"
              >
                <Plus className="h-4 w-4" />
                Create profile
              </button>
            </div>
          </div>

          {createProfileModal && (
            <CreateUProfile
              open={createProfileModal}
              onClose={() => setCreateProfileModal(false)}
              onSubmit={handleCreateProfile}
            />
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Cover */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 md:h-60">
            {user?.coverImage?.url && (
              <img
                src={user.coverImage.url}
                alt="Profile cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            <div className="absolute right-5 top-5">
              <div className="rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                Peer.Hiring Profile
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative px-5 pb-6 md:px-8">
            <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div className="flex flex-col gap-4 md:flex-row md:items-end">

                {/* Avatar */}
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-violet-100 text-4xl font-bold text-violet-700 shadow-lg">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitial()
                  )}
                </div>

                <div className="pb-1">

                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      {user?.name || "User"}
                    </h1>

                    {user?.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        <CircleCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  {profile?.headline && (
                    <p className="mt-1 text-base font-medium text-slate-600">
                      {profile.headline}
                    </p>
                  )}

                  {(location.city ||
                    location.state ||
                    location.country) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 text-slate-400" />

                      <span>
                        {[
                          location.city,
                          location.state,
                          location.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit */}
              <button 
              onClick={() => setUpdateProfileModal(true)}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            {/* Profile meta */}
            <div className="mt-6 flex flex-wrap gap-3">

              {profile.createdAt && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined {formatFullDate(profile.createdAt)}
                </div>
              )}

              {profile.updatedAt && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                  <CircleCheck className="h-3.5 w-3.5" />
                  Updated {formatFullDate(profile.updatedAt)}
                </div>
              )}
              
              {user?.email && (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </div>
                )}

              {preferences.lookingForJob && (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Target className="h-3.5 w-3.5" />
                  Open to opportunities
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

          <aside className="space-y-6">

            {/* Profile Strength */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Profile strength
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep your profile complete
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                  <span className="text-sm font-bold text-violet-700">
                    {score}%
                  </span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
                  style={{
                    width: `${Math.min(Math.max(score, 0), 100)}%`,
                  }}
                />
              </div>

              {missingFields.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Missing
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {missingFields.slice(0, 5).map((field, index) => (
                      <span
                        key={`${field}-${index}`}
                        className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700"
                      >
                        {typeof field === "string"
                          ? field
                          : field?.name || "Complete profile"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Preferences */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Job preferences
                  </p>
                  <p className="text-xs text-slate-500">
                    What you're looking for
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">

                {/* Looking for job */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Availability
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        preferences.lookingForJob
                          ? "bg-emerald-500"
                          : "bg-slate-300"
                      }`}
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {preferences.lookingForJob
                        ? "Looking for opportunities"
                        : "Not currently looking"}
                    </span>
                  </div>
                </div>

                {/* Job type */}
                {preferences.preferredJobType && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Job type
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {capitalize(
                        preferences.preferredJobType
                      )}
                    </p>
                  </div>
                )}

                {/* Work mode */}
                {preferences.workMode && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Work mode
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {capitalize(preferences.workMode)}
                    </p>
                  </div>
                )}

                {/* Salary */}
                {(preferences.expectedSalary?.min ||
                  preferences.expectedSalary?.max) && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Expected salary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {preferences.expectedSalary?.currency || "INR"}{" "}
                      {preferences.expectedSalary?.min
                        ? `₹${preferences.expectedSalary.min.toLocaleString(
                            "en-IN"
                          )}`
                        : ""}
                      {preferences.expectedSalary?.min &&
                      preferences.expectedSalary?.max
                        ? " - "
                        : ""}
                      {preferences.expectedSalary?.max
                        ? `₹${preferences.expectedSalary.max.toLocaleString(
                            "en-IN"
                          )}`
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(socialLinks.github ||
              socialLinks.linkedin ||
              socialLinks.portfolio) && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <LinkIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Social links
                    </p>

                    <p className="text-xs text-slate-500">
                      Connect your profiles
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">

                  {socialLinks.github && (
                    <button
                      type="button"
                      onClick={() => openUrl(socialLinks.github)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-200 hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <FaGithub className="h-4 w-4" />
                        GitHub
                      </span>

                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}

                  {socialLinks.linkedin && (
                    <button
                      type="button"
                      onClick={() =>
                        openUrl(socialLinks.linkedin)
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <FaLinkedin className="h-4 w-4" />
                        LinkedIn
                      </span>

                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}

                  {socialLinks.portfolio && (
                    <button
                      type="button"
                      onClick={() =>
                        openUrl(socialLinks.portfolio)
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <LinkIcon className="h-4 w-4" />
                        Portfolio
                      </span>

                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Resume */}
            {profile.resumeId && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Resume
                    </p>

                    <p className="mt-0.5 text-xs text-emerald-600">
                      Resume attached
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Your profile has a resume connected. Resume
                  preview/download should be connected to your Resume
                  API using this resume reference.
                </p>
              </div>
            )}

            {/* Overview */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-sm font-semibold text-slate-900">
                Profile overview
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Code2 className="h-5 w-5 text-violet-600" />
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {skills.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Skills
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {projects.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Projects
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {experience.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Experience
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <GraduationCap className="h-5 w-5 text-orange-600" />
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {education.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Education
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-6">

            {/* ABOUT */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    About
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Professional summary
                  </p>
                </div>

                <UserRound className="h-5 w-5 text-slate-300" />
              </div>

              {profile.bio ? (
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {profile.bio}
                </p>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-sm text-slate-500">
                    No professional summary added yet.
                  </p>
                </div>
              )}
            </section>

            {/* SKILLS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Skills
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Technical skills and proficiency
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openAddItemModal("skill")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Skill
                </button>
              </div>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={`${skill?._id || skill?.name}-${index}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-violet-600" />

                        <span className="text-sm font-semibold text-slate-800">
                          {skill?.name}
                        </span>
                      </div>

                      {skill?.level && (
                        <span
                          className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getSkillLevelStyle(
                            skill.level
                          )}`}
                        >
                          {capitalize(skill.level)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <Code2 className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    No skills added yet.
                  </p>
                </div>
              )}
            </section>

            {/* EXPERIENCE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Experience
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Professional experience
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openAddItemModal("experience")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Experience
                </button>
              </div>

              {experience.length > 0 ? (
                <div className="mt-6 space-y-4">

                  {experience.map((item, index) => (
                    <button
                      type="button"
                      key={`${item?._id || item?.company}-${index}`}
                      onClick={() =>
                        openDetails("experience", item)
                      }
                      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-violet-200 hover:bg-violet-50/30"
                    >
                      <div className="flex gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {item?.position || "Position"}
                              </h3>

                              {item?.company && (
                                <p className="mt-1 text-sm font-medium text-slate-600">
                                  {item.company}
                                </p>
                              )}
                            </div>

                            <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-violet-600" />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {item?.employmentType && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {capitalize(
                                  item.employmentType
                                )}
                              </span>
                            )}

                            {item?.currentlyWorking && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                Current
                              </span>
                            )}

                            {formatDateRange(
                              item?.startDate,
                              item?.endDate,
                              item?.currentlyWorking
                            ) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                <CalendarDays className="h-3 w-3" />
                                {formatDateRange(
                                  item.startDate,
                                  item.endDate,
                                  item.currentlyWorking
                                )}
                              </span>
                            )}
                          </div>

                          {item?.description && (
                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                              {item.description}
                            </p>
                          )}

                          <p className="mt-4 text-xs font-semibold text-violet-600">
                            View details →
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                  <Briefcase className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    No experience added yet.
                  </p>
                </div>
              )}
            </section>

            {/* EDUCATION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Education
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Academic background
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openAddItemModal("education")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Education
                </button>
              </div>

              {education.length > 0 ? (
                <div className="mt-6 space-y-4">

                  {education.map((item, index) => (
                    <button
                      type="button"
                      key={`${item?._id || item?.institute}-${index}`}
                      onClick={() =>
                        openDetails("education", item)
                      }
                      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-violet-200 hover:bg-violet-50/30"
                    >
                      <div className="flex gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {item?.degree || "Degree"}
                              </h3>

                              {item?.field && (
                                <p className="mt-1 text-sm text-slate-600">
                                  {item.field}
                                </p>
                              )}

                              {item?.institute && (
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                  {item.institute}
                                </p>
                              )}
                            </div>

                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-600" />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {formatYearRange(
                              item?.startYear,
                              item?.endYear
                            ) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                <CalendarDays className="h-3 w-3" />
                                {formatYearRange(
                                  item.startYear,
                                  item.endYear
                                )}
                              </span>
                            )}

                            {item?.grade && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                Grade: {item.grade}
                              </span>
                            )}
                          </div>

                          <p className="mt-4 text-xs font-semibold text-violet-600">
                            View details →
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                  <GraduationCap className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    No education added yet.
                  </p>
                </div>
              )}
            </section>

            {/* PROJECTS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Projects
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Things you've built
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openAddItemModal("project")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Project
                </button>
              </div>

              {projects.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                  {projects.map((project, index) => (
                    <button
                      type="button"
                      key={`${project?._id || project?.title}-${index}`}
                      onClick={() =>
                        openDetails("project", project)
                      }
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100"
                    >

                      {/* Project Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-slate-100">

                        {project?.image?.url ? (
                          <img
                            src={project.image.url}
                            alt={project?.title || "Project"}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-violet-600 shadow-sm backdrop-blur">
                              <Rocket className="h-7 w-7" />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">

                          {project?.technologies?.length > 0 ? (
                            <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                              {project.technologies.length} technologies
                            </span>
                          ) : (
                            <span />
                          )}

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition group-hover:bg-violet-600 group-hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-5">

                        <h3 className="font-semibold text-slate-900">
                          {project?.title || "Untitled project"}
                        </h3>

                        {project?.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {project.description}
                          </p>
                        )}

                        {project?.technologies?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.technologies
                              .slice(0, 4)
                              .map((technology, techIndex) => (
                                <span
                                  key={`${technology}-${techIndex}`}
                                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                                >
                                  {technology}
                                </span>
                              ))}

                            {project.technologies.length > 4 && (
                              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {(project?.startDate ||
                          project?.endDate) && (
                          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {formatDateRange(
                              project.startDate,
                              project.endDate,
                              false
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                  <Rocket className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">
                    No projects added yet.
                  </p>
                </div>
              )}
            </section>

          </main>
        </div>
      </div>

      {detailsModal.open && detailsModal.data && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">

            {/* Close */}
            <button
              type="button"
              onClick={closeDetails}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto">

              {detailsModal.type === "project" && (
                <>
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-slate-100 md:h-80">

                    {detailsModal.data?.image?.url ? (
                      <img
                        src={detailsModal.data.image.url}
                        alt={
                          detailsModal.data?.title ||
                          "Project"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-violet-600 shadow-lg">
                          <Rocket className="h-9 w-9" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                        Project
                      </p>

                      <h2 className="pr-10 text-2xl font-bold text-white md:text-3xl">
                        {detailsModal.data?.title ||
                          "Untitled project"}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">

                    {detailsModal.data?.description && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          About this project
                        </h3>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                          {detailsModal.data.description}
                        </p>
                      </div>
                    )}

                    {/* Technologies */}
                    {detailsModal.data?.technologies
                      ?.length > 0 && (
                      <div className="mt-7">
                        <h3 className="text-sm font-bold text-slate-900">
                          Technologies
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {detailsModal.data.technologies.map(
                            (technology, index) => (
                              <span
                                key={`${technology}-${index}`}
                                className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700"
                              >
                                {technology}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    {(detailsModal.data?.startDate ||
                      detailsModal.data?.endDate) && (
                      <div className="mt-7 rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <div>
                            <p className="text-xs font-semibold text-slate-400">
                              Project duration
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatDateRange(
                                detailsModal.data.startDate,
                                detailsModal.data.endDate,
                                false
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-7 flex flex-wrap gap-3">

                      {detailsModal.data?.githubUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            openUrl(
                              detailsModal.data.githubUrl
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          <FaGithub className="h-4 w-4" />
                          GitHub
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {detailsModal.data?.liveUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            openUrl(
                              detailsModal.data.liveUrl
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#6d28d9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Live Demo
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {detailsModal.type === "experience" && (
                <div className="p-6 md:p-8">

                  <div className="flex items-start gap-4 pr-10">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                        Experience
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {detailsModal.data?.position ||
                          "Position"}
                      </h2>

                      {detailsModal.data?.company && (
                        <p className="mt-1 text-base font-medium text-slate-500">
                          {detailsModal.data.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">

                    {detailsModal.data?.employmentType && (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {capitalize(
                          detailsModal.data.employmentType
                        )}
                      </span>
                    )}

                    {detailsModal.data?.currentlyWorking && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        Currently working
                      </span>
                    )}

                    {formatDateRange(
                      detailsModal.data?.startDate,
                      detailsModal.data?.endDate,
                      detailsModal.data?.currentlyWorking
                    ) && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateRange(
                          detailsModal.data.startDate,
                          detailsModal.data.endDate,
                          detailsModal.data.currentlyWorking
                        )}
                      </span>
                    )}
                  </div>

                  {detailsModal.data?.description && (
                    <div className="mt-8">
                      <h3 className="text-sm font-bold text-slate-900">
                        Description
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                        {detailsModal.data.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Employment
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {detailsModal.data?.employmentType
                          ? capitalize(
                              detailsModal.data
                                .employmentType
                            )
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Duration
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {formatDateRange(
                          detailsModal.data?.startDate,
                          detailsModal.data?.endDate,
                          detailsModal.data?.currentlyWorking
                        ) || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {detailsModal.type === "education" && (
                <div className="p-6 md:p-8">

                  <div className="flex items-start gap-4 pr-10">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <GraduationCap className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                        Education
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {detailsModal.data?.degree ||
                          "Degree"}
                      </h2>

                      {detailsModal.data?.field && (
                        <p className="mt-1 text-base font-medium text-slate-500">
                          {detailsModal.data.field}
                        </p>
                      )}
                    </div>
                  </div>

                  {detailsModal.data?.institute && (
                    <div className="mt-7 rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Institute
                      </p>

                      <p className="mt-2 text-base font-semibold text-slate-800">
                        {detailsModal.data.institute}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Duration
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {formatYearRange(
                          detailsModal.data?.startYear,
                          detailsModal.data?.endYear
                        ) || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Grade
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {detailsModal.data?.grade ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  {detailsModal.data?.field && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Field of study
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {detailsModal.data.field}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {createProfileModal && (
        <CreateUProfile
          open={createProfileModal}
          onClose={() => setCreateProfileModal(false)}
          onSubmit={handleCreateProfile}
        />
      )}

      {addItemModal.open && (
  <div
    className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        closeAddItemModal();
      }
    }}
  >
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {addItemModal.type === "skill" && "Add Skill"}
            {addItemModal.type === "experience" && "Add Experience"}
            {addItemModal.type === "education" && "Add Education"}
            {addItemModal.type === "project" && "Add Project"}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Add information to your professional profile
          </p>
        </div>

        <button
          type="button"
          onClick={closeAddItemModal}
          disabled={addItemLoading}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleAddItem}>

        <div className="max-h-[65vh] overflow-y-auto p-5">

          {addItemModal.type === "skill" && (
            <div className="space-y-4">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Skill name
                </label>

                <input
                  type="text"
                  value={addItemForm.name || ""}
                  onChange={(e) =>
                    updateAddItemForm("name", e.target.value)
                  }
                  placeholder="e.g. React.js"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Proficiency
                </label>

                <select
                  value={addItemForm.level || "beginner"}
                  onChange={(e) =>
                    updateAddItemForm("level", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

            </div>
          )}

          {addItemModal.type === "experience" && (
            <div className="space-y-4">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Position
                  </label>

                  <input
                    type="text"
                    value={addItemForm.position || ""}
                    onChange={(e) =>
                      updateAddItemForm("position", e.target.value)
                    }
                    placeholder="Software Developer"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Company
                  </label>

                  <input
                    type="text"
                    value={addItemForm.company || ""}
                    onChange={(e) =>
                      updateAddItemForm("company", e.target.value)
                    }
                    placeholder="Company name"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Employment type
                </label>

                <select
                  value={addItemForm.employmentType || "full-time"}
                  onChange={(e) =>
                    updateAddItemForm(
                      "employmentType",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={addItemForm.startDate || ""}
                    onChange={(e) =>
                      updateAddItemForm("startDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                {!addItemForm.currentlyWorking && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      End date
                    </label>

                    <input
                      type="date"
                      value={addItemForm.endDate || ""}
                      onChange={(e) =>
                        updateAddItemForm("endDate", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                )}

              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={addItemForm.currentlyWorking || false}
                  onChange={(e) =>
                    updateAddItemForm(
                      "currentlyWorking",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />

                <span className="text-sm font-medium text-slate-700">
                  I currently work here
                </span>
              </label>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={addItemForm.description || ""}
                  onChange={(e) =>
                    updateAddItemForm("description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

            </div>
          )}

          {addItemModal.type === "education" && (
            <div className="space-y-4">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Degree
                </label>

                <input
                  type="text"
                  value={addItemForm.degree || ""}
                  onChange={(e) =>
                    updateAddItemForm("degree", e.target.value)
                  }
                  placeholder="Bachelor of Computer Applications"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Field of study
                </label>

                <input
                  type="text"
                  value={addItemForm.field || ""}
                  onChange={(e) =>
                    updateAddItemForm("field", e.target.value)
                  }
                  placeholder="Computer Science"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Institute
                </label>

                <input
                  type="text"
                  value={addItemForm.institute || ""}
                  onChange={(e) =>
                    updateAddItemForm("institute", e.target.value)
                  }
                  placeholder="University / College"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Start year
                  </label>

                  <input
                    type="number"
                    value={addItemForm.startYear || ""}
                    onChange={(e) =>
                      updateAddItemForm("startYear", e.target.value)
                    }
                    placeholder="2024"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    End year
                  </label>

                  <input
                    type="number"
                    value={addItemForm.endYear || ""}
                    onChange={(e) =>
                      updateAddItemForm("endYear", e.target.value)
                    }
                    placeholder="2027"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Grade / CGPA
                </label>

                <input
                  type="text"
                  value={addItemForm.grade || ""}
                  onChange={(e) =>
                    updateAddItemForm("grade", e.target.value)
                  }
                  placeholder="8.2 CGPA"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

            </div>
          )}

          {addItemModal.type === "project" && (
            <div className="space-y-4">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Project title
                </label>

                <input
                  type="text"
                  value={addItemForm.title || ""}
                  onChange={(e) =>
                    updateAddItemForm("title", e.target.value)
                  }
                  placeholder="Peer.Hiring"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={addItemForm.description || ""}
                  onChange={(e) =>
                    updateAddItemForm("description", e.target.value)
                  }
                  placeholder="What did you build?"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Technologies
                </label>

                <input
                  type="text"
                  value={addItemForm.technologies || ""}
                  onChange={(e) =>
                    updateAddItemForm(
                      "technologies",
                      e.target.value
                    )
                  }
                  placeholder="React, Node.js, MongoDB, Tailwind"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Separate technologies with commas
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    value={addItemForm.githubUrl || ""}
                    onChange={(e) =>
                      updateAddItemForm(
                        "githubUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Live URL
                  </label>

                  <input
                    type="url"
                    value={addItemForm.liveUrl || ""}
                    onChange={(e) =>
                      updateAddItemForm(
                        "liveUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={addItemForm.startDate || ""}
                    onChange={(e) =>
                      updateAddItemForm("startDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    End date
                  </label>

                  <input
                    type="date"
                    value={addItemForm.endDate || ""}
                    onChange={(e) =>
                      updateAddItemForm("endDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">

          <button
            type="button"
            onClick={closeAddItemModal}
            disabled={addItemLoading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={addItemLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d28d9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addItemLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  </div>
)}

      {updateProfileModalS && (
  <UpdateProfileModal
    open={updateProfileModalS}
    onClose={() => setUpdateProfileModal(false)}
    profile={profile}
    onUpdate={handleUpdateProfile}
  />
)}
    </div>
  );
}

export default ProfileDashboard;