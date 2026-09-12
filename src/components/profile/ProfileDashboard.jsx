import React, { useEffect } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Code2,
  Edit3,
  GraduationCap,
  MapPin,
  Plus,
  CircleCheck,
} from "lucide-react";

import { useAuth, useProfile } from "../../hooks/Hook";

function ProfileDashboard() {
  const {
    profile,
    profileCompletion,
    handleGetMyProfile,
    handleProfileCompletion,
  } = useProfile();

//   const { user } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await handleGetMyProfile();
        await handleProfileCompletion();
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfileData();
  }, []);

const user = {
  name: "Aditya Yadav",
  avatar: {
    url: "https://i.pravatar.cc/300?img=12"
  },
  coverImage: {
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop"
  }
};

  const sampleUser = {
    name: "Aditya Yadav",
    avatar: null,
  };

  const sampleProfile = {
    headline: "Full Stack Developer | MERN Stack | Problem Solver",

    bio: "Passionate software developer focused on building scalable and user-friendly web applications. Experienced with React, Node.js, Express.js and MongoDB, with a strong interest in system design, APIs and problem solving.",

    location: {
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
    },

    preferences: {
      lookingForJob: true,

      preferredJobType: ["Full-time", "Internship"],

      expectedSalary: {
        currency: "INR",
      },
    },

    skills: [
      {
        _id: "skill-1",
        name: "C++",
        level: "advanced",
      },
      {
        _id: "skill-2",
        name: "JavaScript",
        level: "advanced",
      },
      {
        _id: "skill-3",
        name: "React",
        level: "advanced",
      },
      {
        _id: "skill-4",
        name: "Node.js",
        level: "intermediate",
      },
      {
        _id: "skill-5",
        name: "Express.js",
        level: "intermediate",
      },
      {
        _id: "skill-6",
        name: "MongoDB",
        level: "intermediate",
      },
      {
        _id: "skill-7",
        name: "SQL",
        level: "intermediate",
      },
      {
        _id: "skill-8",
        name: "Git & GitHub",
        level: "advanced",
      },
    ],

    experience: [
      {
        _id: "exp-1",
        position: "Full Stack Developer",
        company: "Peer.Hiring",
        employmentType: {
          type: "Full-time",
        },
        startDate: "2026-01-01",
        currentlyWorking: true,
        endDate: null,
        description:
          "Building a full-stack hiring platform using React, Node.js, Express.js and MongoDB. Working on authentication, job management, applications, interviews, chat and real-time communication.",
      },

      {
        _id: "exp-2",
        position: "Frontend Developer Intern",
        company: "TechNova Solutions",
        employmentType: {
          type: "Internship",
        },
        startDate: "2025-06-01",
        currentlyWorking: false,
        endDate: "2025-09-30",
        description:
          "Developed responsive React interfaces, integrated REST APIs and improved reusable UI components for internal web applications.",
      },
    ],

    education: [
      {
        _id: "edu-1",
        institute:
          "Manorama Institute of Management & Technology",
        degree: "Bachelor of Computer Applications",
        field: "Computer Applications",
        startYear: "2024",
        endYear: "2027",
      },

      {
        _id: "edu-2",
        institute: "S.M.T. Durga Devi Inter College",
        degree: "Intermediate",
        field: "Science",
        startYear: "2022",
        endYear: "2024",
      },
    ],

    projects: [
      {
        _id: "project-1",
        title: "Peer.Hiring",
        description:
          "A full-stack hiring platform connecting job seekers and recruiters with job management, applications, interviews, chat and ATS features.",
        technologies: [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "Socket.IO",
          "JWT",
        ],
        githubUrl: "https://github.com/adityayadav176",
      },

      {
        _id: "project-2",
        title: "Real-Time Chat Application",
        description:
          "Real-time direct messaging application with online status, typing indicators, message delivery and seen status.",
        technologies: [
          "React",
          "Node.js",
          "Socket.IO",
          "MongoDB",
        ],
        githubUrl: "https://github.com/adityayadav176",
      },
    ],
  };

  const sampleCompletion = {
    score: 86,
    missingFields: ["Resume"],
  };

  const displayUser = user || sampleUser;

  const displayProfile =
    profile && Object.keys(profile).length > 0
      ? profile
      : sampleProfile;

  const displayCompletion =
    profileCompletion && Object.keys(profileCompletion).length > 0
      ? profileCompletion
      : sampleCompletion;

  const skills = displayProfile?.skills || [];
  const experience = displayProfile?.experience || [];
  const education = displayProfile?.education || [];
  const projects = displayProfile?.projects || [];

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="min-h-full w-full bg-[#F7F7FA] px-4 py-6 md:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}

       {/* PROFILE HERO */}
<div className="overflow-hidden rounded-3xl bg-white border border-slate-200">
  {/* COVER */}
  <div className="relative h-36 md:h-44 overflow-hidden">
    {user?.coverImage?.url ? (
      <img
        src={user.coverImage.url}
        alt="Profile cover"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-r from-violet-700 via-[#6D28D9] to-indigo-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-indigo-300 blur-3xl" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-white/90 tracking-tight">
            Peer.Hiring
          </span>
        </div>
      </div>
    )}
  </div>

  {/* PROFILE INFO */}
  <div className="px-6 pb-6 md:px-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

      {/* AVATAR + INFO */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-5">

        {/* AVATAR */}
        <div className="w-24 h-24 shrink-0 rounded-3xl bg-white p-1.5 border border-slate-200 shadow-sm">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-violet-600 flex items-center justify-center">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            )}
          </div>
        </div>

        {/* USER DETAILS */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {user?.name || "Alex"}
          </h1>

          <p className="text-violet-600 font-medium mt-1">
            {profile?.headline || "Add your professional headline"}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
            <MapPin className="w-4 h-4" />

            <span>
              {profile?.location?.city || "City"},{" "}
              {profile?.location?.state || "State"},{" "}
              {profile?.location?.country || "Country"}
            </span>
          </div>
        </div>
      </div>

      {/* EDIT BUTTON */}
      <button
        type="button"
        className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all font-semibold text-sm"
      >
        <Edit3 className="w-4 h-4" />
        Edit Profile
      </button>

    </div>
  </div>
</div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

          <aside className="space-y-5">

            {/* PROFILE STRENGTH */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <CircleCheck className="h-5 w-5 text-[#6D28D9]" />

                  <span className="font-semibold text-[#0F172A]">
                    Profile strength
                  </span>

                </div>

                <span className="font-bold text-[#6D28D9]">
                  {displayCompletion?.score ?? 0}%
                </span>

              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F1F5F9]">

                <div
                  className="h-full rounded-full bg-[#6D28D9] transition-all duration-500"
                  style={{
                    width: `${displayCompletion?.score ?? 0}%`,
                  }}
                />

              </div>

              <p className="mt-3 text-xs leading-5 text-[#64748B]">

                {displayCompletion?.missingFields?.length
                  ? `Add ${displayCompletion.missingFields.join(
                      ", "
                    )} to complete your profile.`
                  : "Your profile is complete."}

              </p>

            </div>

            {/* JOB PREFERENCES */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-5 flex items-center gap-2">

                <Briefcase className="h-5 w-5 text-[#6D28D9]" />

                <h2 className="font-semibold text-[#0F172A]">
                  Job Preferences
                </h2>

              </div>

              {displayProfile?.preferences?.lookingForJob === true ? (
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  Actively looking

                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">

                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  Not looking

                </div>
              )}

              {/* Job Types */}

              <div className="mt-5">

                <p className="text-[11px] font-bold tracking-wider text-[#94A3B8]">
                  JOB TYPES
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {displayProfile?.preferences?.preferredJobType
                    ?.length > 0 ? (
                    displayProfile.preferences.preferredJobType.map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-[#F1F5F9] px-2.5 py-1.5 text-xs font-medium capitalize text-[#475569]"
                        >
                          {item}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-xs text-[#94A3B8]">
                      No preference
                    </span>
                  )}

                </div>

              </div>

              {/* Currency */}

              <div className="mt-5 border-t border-[#F1F5F9] pt-5">

                <p className="text-[11px] font-bold tracking-wider text-[#94A3B8]">
                  CURRENCY
                </p>

                <p className="mt-2 text-sm font-semibold text-[#475569]">
                  {displayProfile?.preferences?.expectedSalary
                    ?.currency || "Not specified"}
                </p>

              </div>

            </div>

            {/* PROFILE OVERVIEW */}

            <div className="rounded-2xl bg-[#0F172A] p-5 text-white">

              <p className="text-xs font-medium tracking-wide text-[#94A3B8]">
                PROFILE OVERVIEW
              </p>

              <div className="mt-5 grid grid-cols-2 gap-5">

                <div>
                  <p className="text-2xl font-bold">
                    {skills.length}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Skills
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {projects.length}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Projects
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {education.length}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Education
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {experience.length}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Experience
                  </p>
                </div>

              </div>

            </div>

          </aside>

          {/* ===================================================
              RIGHT CONTENT
          ==================================================== */}

          <main className="min-w-0 space-y-6">

            {/* =================================================
                ABOUT
            ================================================== */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-lg font-bold text-[#0F172A]">
                  About
                </h2>

                <span className="text-xs font-medium text-[#94A3B8]">
                  ABOUT ME
                </span>

              </div>

              <p className="text-sm leading-7 text-[#64748B]">
                {displayProfile?.bio || (
                  <span className="text-[#94A3B8]">
                    No About information added yet.
                  </span>
                )}
              </p>

            </div>

            {/* =================================================
                SKILLS
            ================================================== */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Code2 className="h-5 w-5 text-[#6D28D9]" />

                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Skills
                  </h2>

                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </button>

              </div>

              <div className="flex flex-wrap gap-2.5">

                {skills.length > 0 ? (
                  skills.map((item) => (
                    <div
                      key={item?._id}
                      className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2"
                    >

                      <span className="text-sm font-semibold text-[#334155]">
                        {item?.name}
                      </span>

                      {item?.level && (
                        <span className="rounded-md bg-[#F3E8FF] px-2 py-1 text-[11px] font-semibold capitalize text-[#6D28D9]">
                          {item.level}
                        </span>
                      )}

                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#94A3B8]">
                    No skills added
                  </span>
                )}

              </div>

            </div>

            {/* =================================================
                EXPERIENCE
            ================================================== */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Briefcase className="h-5 w-5 text-[#6D28D9]" />

                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Experience
                  </h2>

                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </button>

              </div>

              {experience.length > 0 ? (
                <div className="space-y-7">

                  {experience.map((item, index) => (
                    <div
                      key={item?._id || index}
                      className="relative flex gap-4"
                    >

                      {/* Timeline */}

                      <div className="flex shrink-0 flex-col items-center">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                          <Briefcase className="h-5 w-5" />
                        </div>

                        {index !== experience.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-[#E2E8F0]" />
                        )}

                      </div>

                      {/* Experience content */}

                      <div className="min-w-0 pb-2">

                        <h3 className="font-bold text-[#0F172A]">
                          {item?.position}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-[#475569]">
                          {item?.company}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          {item?.employmentType?.type && (
                            <span className="text-xs font-semibold capitalize text-[#6D28D9]">
                              {item.employmentType.type}
                            </span>
                          )}

                          <span className="text-[#CBD5E1]">
                            •
                          </span>

                          <span className="text-xs text-[#94A3B8]">

                            {formatDate(item?.startDate)}

                            {" - "}

                            {item?.currentlyWorking
                              ? "Present"
                              : formatDate(item?.endDate) ||
                                "End date"}

                          </span>

                        </div>

                        {item?.description && (
                          <p className="mt-3 text-sm leading-6 text-[#64748B]">
                            {item.description}
                          </p>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] py-8 text-center">

                  <Briefcase className="mx-auto h-6 w-6 text-[#CBD5E1]" />

                  <p className="mt-3 text-sm font-medium text-[#475569]">
                    No experience added
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Add your previous experience to strengthen your
                    profile.
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                EDUCATION
            ================================================== */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <GraduationCap className="h-5 w-5 text-[#6D28D9]" />

                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Education
                  </h2>

                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </button>

              </div>

              {education.length > 0 ? (
                <div className="space-y-5">

                  {education.map((item) => (
                    <div
                      key={item?._id}
                      className="flex items-start gap-4"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-semibold text-[#0F172A]">
                          {item?.institute}
                        </h3>

                        <p className="mt-1 text-sm text-[#475569]">
                          {item?.degree}
                          {item?.field
                            ? ` in ${item.field}`
                            : ""}
                        </p>

                        <p className="mt-2 text-xs text-[#94A3B8]">
                          {item?.startYear} - {item?.endYear}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-sm text-[#94A3B8]">
                  No education added
                </p>
              )}

            </div>

            {/* =================================================
                PROJECTS
            ================================================== */}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Code2 className="h-5 w-5 text-[#6D28D9]" />

                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Projects
                  </h2>

                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </button>

              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {projects.map((item) => (
                    <div
                      key={item?._id}
                      className="group rounded-xl border border-[#E2E8F0] p-5 transition-all hover:border-[#C4B5FD] hover:shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="font-bold text-[#0F172A] transition-colors group-hover:text-[#6D28D9]">
                          {item?.title || "Project"}
                        </h3>

                        {item?.githubUrl && (
                          <ArrowUpRight
                            className="h-5 w-5 shrink-0 cursor-pointer text-[#94A3B8] transition-colors hover:text-[#6D28D9]"
                            onClick={() =>
                              window.open(
                                item.githubUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
                        )}

                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#64748B]">
                        {item?.description ||
                          "No project description available."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {item?.technologies?.length > 0 ? (
                          item.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#475569]"
                            >
                              {technology}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#94A3B8]">
                            No technologies added
                          </span>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] py-8 text-center">

                  <Code2 className="mx-auto h-6 w-6 text-[#CBD5E1]" />

                  <p className="mt-3 text-sm font-medium text-[#475569]">
                    No projects added
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Showcase your best projects here.
                  </p>

                </div>
              )}

            </div>

          </main>

        </div>

      </div>

    </section>
  );
}

export default ProfileDashboard;