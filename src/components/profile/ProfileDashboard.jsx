import React, { useEffect, useState } from "react";
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
  UserRound,
  Sparkles,
  BriefcaseBusiness,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useProfile } from "../../hooks/Hook";
import CreateProfile from "./CreateProfile";

function ProfileDashboard() {
  const [createProfileModal, setCreateProfileModal] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const {
    profile,
    profileCompletion,
    handleGetMyProfile,
    handleProfileCompletion,
  } = useProfile();

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

  const score = profileCompletion?.score ?? 0;


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

  if (loading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#6D28D9]" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full w-full overflow-auto bg-[#F7F8FC]">
        <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col px-7 py-7 lg:px-10">
          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-600" />

                <span className="text-sm font-semibold text-violet-600">
                  My Profile
                </span>
              </div>

              <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.025em] text-slate-900">
                Build your professional profile
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
                Create a profile that represents your skills, experience,
                projects, and career goals.
              </p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
                Profile setup
              </div>
            </div>
          </div>

          {/* =====================================================
              MAIN
          ====================================================== */}

          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-[1250px]">
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.07)]">
                {/* Decorative gradients */}

                <div className="pointer-events-none absolute right-[-120px] top-[-150px] h-[420px] w-[420px] rounded-full bg-violet-100/70 blur-3xl" />

                <div className="pointer-events-none absolute bottom-[-180px] left-[-100px] h-[350px] w-[350px] rounded-full bg-indigo-50 blur-3xl" />

                <div className="relative grid lg:grid-cols-[1.15fr_0.85fr]">
                  {/* =================================================
                      LEFT
                  ================================================== */}

                  <div className="px-9 py-12 lg:px-14 lg:py-14">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 ring-1 ring-violet-100">
                      <UserRound
                        size={27}
                        strokeWidth={1.8}
                        className="text-violet-600"
                      />
                    </div>

                    <div className="mt-7 max-w-[650px]">
                      <p className="text-sm font-medium text-slate-400">
                        Welcome to your profile workspace
                      </p>

                      <h2 className="mt-2 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-slate-900">
                        Make your profile{" "}
                        <span className="text-violet-600">stand out.</span>
                      </h2>

                      <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-500">
                        Add your professional information once and build a
                        profile that recruiters can quickly understand. You
                        can update everything later.
                      </p>
                    </div>

                    {/* Benefits */}

                    <div className="mt-9 space-y-3">
                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                          <Sparkles
                            size={18}
                            className="text-violet-600"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Showcase your expertise
                          </p>

                          <p className="mt-0.5 text-[13px] text-slate-500">
                            Skills, technologies, and professional strengths
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                          <BriefcaseBusiness
                            size={18}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Highlight your experience
                          </p>

                          <p className="mt-0.5 text-[13px] text-slate-500">
                            Work history, education, and projects
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                          <Target
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Define your career goals
                          </p>

                          <p className="mt-0.5 text-[13px] text-slate-500">
                            Job type, location, and salary preferences
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}

                    <div className="mt-9 flex items-center gap-4">
                      <button
                      onClick={() => setCreateProfileModal(true)}
                        type="button"
                        className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-[#6D28D9] px-6 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(109,40,217,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5B21B6] hover:shadow-[0_8px_24px_rgba(109,40,217,0.28)] active:translate-y-0"
                      >
                        <Plus size={18} />
                        Create profile
                      </button>

                      {createProfileModal && <CreateProfile/>}

                      <span className="text-[13px] text-slate-400">
                        Takes only a few minutes
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      RIGHT PREVIEW
                  ================================================== */}

                  <div className="relative hidden min-h-[560px] items-center justify-center border-l border-slate-100 bg-[#FAFAFD] px-10 lg:flex">
                    <div className="w-full max-w-[360px]">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                        {/* Cover */}

                        <div className="h-24 bg-gradient-to-r   from-violet-600 via-purple-500 to-indigo-500" />

                        <div className="px-6 pb-6">
                          {/* Avatar */}

                          <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-violet-50 shadow-sm">
                            <UserRound
                              size={30}
                              className="text-violet-500"
                            />
                          </div>

                          <div className="mt-4">
                            <div className="h-4 w-36 rounded bg-slate-200" />

                            <div className="mt-2 h-3 w-48 rounded bg-slate-100" />

                            <div className="mt-5 flex gap-2">
                              <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-600">
                                React
                              </span>

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                                Node.js
                              </span>
                            </div>
                          </div>

                          <div className="mt-7 space-y-5">
                            <div>
                              <div className="mb-2 h-3 w-16 rounded bg-slate-200" />

                              <div className="h-2.5 w-full rounded bg-slate-100" />

                              <div className="mt-1.5 h-2.5 w-4/5 rounded bg-slate-100" />
                            </div>

                            <div>
                              <div className="mb-2 h-3 w-20 rounded bg-slate-200" />

                              <div className="flex gap-2">
                                <div className="h-8 flex-1 rounded-lg bg-slate-50" />

                                <div className="h-8 flex-1 rounded-lg bg-slate-50" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Completion hint */}

                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                          <Sparkles
                            size={15}
                            className="text-violet-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            Your profile, your story
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Add details and make it yours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PROFILE EXISTS
  // ============================================================

  return (
    <section className="min-h-full w-full bg-[#F7F7FA] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            PROFILE HERO
        ====================================================== */}

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

                    {user?.isVerified && (
                      <CircleCheck className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>

                  <p className="mt-1 font-medium text-violet-600">
                    {profile?.headline || "Your Title"}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />

                    <span>
                      {[
                        profile?.location?.city,
                        profile?.location?.state,
                        profile?.location?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location not added"}
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

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* ====================================================
              SIDEBAR
          ==================================================== */}

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

              {/* LOOKING FOR JOB */}

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
                  <p className="text-2xl font-bold">{skills.length}</p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Skills
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Projects
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">{education.length}</p>

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

          {/* ====================================================
              MAIN
          ==================================================== */}

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
                {profile?.bio || "No About Added"}
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

                          <span className="text-[#CBD5E1]">•</span>

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
                          {item?.field ? ` in ${item.field}` : ""}
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
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                item.githubUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            className="shrink-0"
                          >
                            <ArrowUpRight className="h-5 w-5 text-[#94A3B8] transition-colors hover:text-[#6D28D9]" />
                          </button>
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