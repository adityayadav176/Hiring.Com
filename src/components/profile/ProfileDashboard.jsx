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

  const { user } = useAuth();
  console.log("AUTH USER:", user);
console.log("PROFILE:", profile);

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

  // Safe arrays
  const skills = profile?.skills || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const experience = profile?.experience || [];

  const score = profileCompletion?.score ?? 0;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-full w-full bg-[#F7F7FA] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= PROFILE HERO ================= */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

          {/* COVER */}
          <div className="relative h-36 overflow-hidden md:h-44">
            {user?.coverImage?.url ? (
              <img
                src={user.coverImage.url}
                alt="Profile cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-violet-700 via-[#6D28D9] to-indigo-600">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
                  <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-indigo-300 blur-3xl" />
                </div>

                <div className="relative flex h-full items-center justify-center">
                  <span className="text-3xl font-bold tracking-tight text-white/90 md:text-4xl">
                    Peer.Hiring
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE INFO */}
          <div className="px-6 pb-6 md:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              {/* AVATAR + INFO */}
              <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center">

                {/* AVATAR */}
                <div className="h-24 w-24 shrink-0 rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-violet-600">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* USER DETAILS */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      {user?.name}
                    </h1>

                    {/* Optional verified badge */}
                    {user?.isVerified && (
                      <CircleCheck className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>

                  <p className="mt-1 font-medium text-violet-600">
                    {profile?.headline ||
                      "Software Developer | Full Stack Developer"}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />

                    <span>
                      {profile?.location?.city || "Agra"},{" "}
                      {profile?.location?.state || "Uttar Pradesh"},{" "}
                      {profile?.location?.country || "India"}
                    </span>
                  </div>
                </div>
              </div>

              {/* EDIT BUTTON */}
              <button
                type="button"
                className="flex self-start items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 md:self-center"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* ================= SIDEBAR ================= */}
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
                  {score}%
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                <div
                  className="h-full rounded-full bg-[#6D28D9] transition-all duration-500"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-[#64748B]">
                {profileCompletion?.missingFields?.length
                  ? `Add ${profileCompletion.missingFields.join(
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

              {profile?.preferences?.lookingForJob === true ? (
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

              {/* JOB TYPES */}
              <div className="mt-5">
                <p className="text-[11px] font-bold tracking-wider text-[#94A3B8]">
                  JOB TYPES
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {profile?.preferences?.preferredJobType?.length > 0 ? (
                    profile.preferences.preferredJobType.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-[#F1F5F9] px-2.5 py-1.5 text-xs font-medium capitalize text-[#475569]"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#94A3B8]">
                      No preference
                    </span>
                  )}
                </div>
              </div>

              {/* SALARY */}
              <div className="mt-5 border-t border-[#F1F5F9] pt-5">
                <p className="text-[11px] font-bold tracking-wider text-[#94A3B8]">
                  EXPECTED SALARY
                </p>

                <p className="mt-2 text-sm font-semibold text-[#475569]">
                  {profile?.preferences?.expectedSalary?.currency || "INR"}
                  {profile?.preferences?.expectedSalary?.min
                    ? ` ${profile.preferences.expectedSalary.min}`
                    : ""}
                  {profile?.preferences?.expectedSalary?.max
                    ? ` - ${profile.preferences.expectedSalary.max}`
                    : ""}
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

          {/* ================= MAIN ================= */}
          <main className="min-w-0 space-y-6">

            {/* ABOUT */}
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
                {profile?.bio || (
                  <span className="text-[#94A3B8]">
                    Full-stack developer building modern web applications
                    with JavaScript, React, Node.js, Express and MongoDB.
                  </span>
                )}
              </p>
            </div>

            {/* SKILLS */}
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
                  skills.map((item, index) => (
                    <div
                      key={item?._id || index}
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

            {/* EXPERIENCE */}
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
                      <div className="flex shrink-0 flex-col items-center">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#6D28D9]">
                          <Briefcase className="h-5 w-5" />
                        </div>

                        {index !== experience.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-[#E2E8F0]" />
                        )}
                      </div>

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
                              : formatDate(item?.endDate) || "End date"}
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
                    Add your previous experience to strengthen your profile.
                  </p>

                </div>
              )}
            </div>

            {/* EDUCATION */}
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

                  {education.map((item, index) => (
                    <div
                      key={item?._id || index}
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

            {/* PROJECTS */}
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

                  {projects.map((item, index) => (
                    <div
                      key={item?._id || index}
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