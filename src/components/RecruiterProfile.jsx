import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAuth, useCompany, useProfile } from "../hooks/Hook";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const getInitials = (name) => {
  const safeName = typeof name === "string" ? name.trim() : "";

  return (
    safeName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "R"
  );
};

const getLocation = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;

  return [
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const getWebsite = (url) => {
  if (typeof url !== "string" || !url.trim()) return "";

  const value = url.trim();
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const getSkills = (profile) =>
  Array.isArray(profile?.skills)
    ? profile.skills.filter(
        (skill) => isObject(skill) && typeof skill.name === "string"
      )
    : [];

function Panel({ children, className = "" }) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_3px_16px_rgba(15,23,42,0.035)]",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.19em] text-violet-600">
            {eyebrow}
          </p>
        )}

        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/80">
        <Icon size={16} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-medium text-slate-400">
          {label}
        </p>

        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-semibold text-slate-800 transition hover:text-violet-700"
          >
            {value}
            <ArrowUpRight size={13} className="shrink-0 text-violet-500" />
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  disabled = false,
  maxLength,
}) {
  const shared =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>

      {multiline ? (
        <textarea
          rows={4}
          value={value ?? ""}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder || label}
          className={cx(shared, "resize-y leading-6")}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder || label}
          className={shared}
        />
      )}
    </label>
  );
}

function SocialLink({ href, label, icon: Icon, description }) {
  if (!href) return null;

  const url = getWebsite(href);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="mt-1 truncate text-xs text-slate-400">
          {description || href}
        </p>
      </div>

      <ArrowUpRight
        size={16}
        className="shrink-0 text-slate-400 transition group-hover:text-violet-700"
      />
    </a>
  );
}

function makeRecruiterDraft(recruiter, profile) {
  const location = isObject(profile?.location)
    ? profile.location
    : {};

  return {
    name: recruiter?.name || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
    city: location.city || "",
    state: location.state || "",
    country: location.country || "India",
    skills: getSkills(profile)
      .map((skill) => skill.name.trim())
      .filter(Boolean)
      .join(", "),
    linkedin: profile?.socialLinks?.linkedin || "",
    github: profile?.socialLinks?.github || "",
    portfolio: profile?.socialLinks?.portfolio || "",
  };
}

function makeCompanyDraft(company) {
  const headquarters = isObject(company?.headquarters)
    ? company.headquarters
    : {};

  const socialLinks = isObject(company?.socialLinks)
    ? company.socialLinks
    : {};

  return {
    name: company?.name || "",
    description: company?.description || "",
    industry: company?.industry || "",
    companySize: company?.companySize || "",
    foundedYear: company?.foundedYear ?? "",
    city: headquarters.city || "",
    state: headquarters.state || "",
    country: headquarters.country || "India",
    website: socialLinks.website || "",
    linkedin: socialLinks.linkedin || "",
    github: socialLinks.github || "",
    twitter: socialLinks.twitter || "",
  };
}

export default function RecruiterProfile() {
  const {
    recruiter,
    changeName,
    handleUpdateAvatar,
    handleUpdateCoverImage,
    authLoading,
  } = useAuth();

  const {
    profile,
    handleGetMyProfile,
    handleCreateProfile,
    handleUpdateProfile,
    handleProfileCompletion,
    profileCompletion,
  } = useProfile();

  const {
    company,
    handleGetMyCompany,
    handleUpdateCompany,
    handleUpdateCompanyLogo,
  } = useCompany();

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("recruiter");

  const [draftRecruiter, setDraftRecruiter] = useState(() =>
    makeRecruiterDraft(recruiter, profile)
  );
  const [draftCompany, setDraftCompany] = useState(() =>
    makeCompanyDraft(company)
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [notice, setNotice] = useState(null);
  const [pageError, setPageError] = useState("");

  const recruiterId = recruiter?._id || recruiter?.id || null;
  const companyId = company?._id || company?.id || null;

  const loadProfileData = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const tasks = [
        handleGetMyProfile,
        handleGetMyCompany,
        handleProfileCompletion,
      ].filter((handler) => typeof handler === "function");

      const results = await Promise.allSettled(
        tasks.map((handler) => handler())
      );

      const failed = results.find(
        (result) => result.status === "rejected"
      );

      if (failed) {
        setPageError(
          getErrorMessage(
            failed.reason,
            "Some profile information could not be loaded."
          )
        );
      }
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to load recruiter profile.")
      );
    } finally {
      setLoading(false);
    }
  }, [
    handleGetMyProfile,
    handleGetMyCompany,
    handleProfileCompletion,
  ]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const recruiterName = recruiter?.name || "Recruiter";
  const recruiterLocation = getLocation(profile?.location);
  const companyLocation = getLocation(company?.headquarters);

  const avatarUrl = recruiter?.avatar?.url || "";
  const coverUrl = recruiter?.coverImage?.url || "";
  const companyLogoUrl = company?.logo?.url || "";

  const recruiterSocialLinks = isObject(profile?.socialLinks)
    ? profile.socialLinks
    : {};

  const companySocialLinks = isObject(company?.socialLinks)
    ? company.socialLinks
    : {};

  const skills = useMemo(() => getSkills(profile), [profile]);

  const professionalLinks = useMemo(
    () =>
      [
        {
          key: "linkedin",
          href: recruiterSocialLinks.linkedin,
          label: "LinkedIn",
          icon: FaLinkedin,
          description: "Professional network",
        },
        {
          key: "github",
          href: recruiterSocialLinks.github,
          label: "GitHub",
          icon: FaGithub,
          description: "Public development profile",
        },
        {
          key: "portfolio",
          href: recruiterSocialLinks.portfolio,
          label: "Portfolio",
          icon: Globe2,
          description: "Professional website",
        },
      ].filter((link) => Boolean(link.href)),
    [
      recruiterSocialLinks.linkedin,
      recruiterSocialLinks.github,
      recruiterSocialLinks.portfolio,
    ]
  );

  const companyLinks = useMemo(
    () =>
      [
        {
          key: "website",
          href: companySocialLinks.website,
          label: "Website",
          icon: Globe2,
          description: "Company website",
        },
        {
          key: "linkedin",
          href: companySocialLinks.linkedin,
          label: "LinkedIn",
          icon: FaLinkedin,
          description: "Company LinkedIn",
        },
        {
          key: "github",
          href: companySocialLinks.github,
          label: "GitHub",
          icon: FaGithub,
          description: "Company GitHub",
        },
      ].filter((link) => Boolean(link.href)),
    [
      companySocialLinks.website,
      companySocialLinks.linkedin,
      companySocialLinks.github,
    ]
  );

  const companyWebsite = getWebsite(companySocialLinks.website);

  const isVerifiedCompany =
    company?.isVerified === true ||
    company?.verificationStatus === "verified";

  const completionItems = [
    Boolean(recruiter?.name),
    Boolean(recruiter?.email),
    Boolean(recruiter?.phoneNo),
    Boolean(profile?.headline),
    Boolean(profile?.bio),
    Boolean(recruiterLocation),
    Boolean(recruiterSocialLinks.linkedin),
    skills.length > 0,
    Boolean(company?.name),
    Boolean(company?.description),
    Boolean(company?.industry),
    Boolean(companySocialLinks.website),
  ];

  const calculatedCompletion = Math.round(
    (completionItems.filter(Boolean).length /
      completionItems.length) *
      100
  );

  const rawBackendCompletion =
    typeof profileCompletion === "number"
      ? profileCompletion
      : profileCompletion?.percentage ??
        profileCompletion?.completion ??
        profileCompletion?.profileCompletion;

  const backendCompletion =
    rawBackendCompletion === null ||
    rawBackendCompletion === undefined ||
    rawBackendCompletion === ""
      ? NaN
      : Number(rawBackendCompletion);

  const completion = Number.isFinite(backendCompletion)
    ? Math.min(100, Math.max(0, Math.round(backendCompletion)))
    : calculatedCompletion;

  const startEditing = () => {
    setDraftRecruiter(makeRecruiterDraft(recruiter, profile));
    setDraftCompany(makeCompanyDraft(company));
    setActiveTab("recruiter");
    setNotice(null);
    setEditing(true);
  };

  const closeEditing = () => {
    if (!saving) setEditing(false);
  };

  const updateRecruiterDraft = (key, value) => {
    setDraftRecruiter((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateCompanyDraft = (key, value) => {
    setDraftCompany((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setNotice(null);

    try {
      const nextName = String(draftRecruiter.name || "").trim();

      if (nextName && nextName !== (recruiter?.name || "")) {
        if (typeof changeName !== "function") {
          throw new Error(
            "The name update handler is not available in AuthContext."
          );
        }

        await changeName({ name: nextName });
      }

      const existingProfile = isObject(profile) ? profile : {};
      const existingSkills = getSkills(existingProfile);

      const skillNames = [
        ...new Set(
          String(draftRecruiter.skills || "")
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        ),
      ];

      const nextSkills = skillNames.map((name) => {
        const existing = existingSkills.find(
          (skill) =>
            skill.name.trim().toLowerCase() === name.toLowerCase()
        );

        return {
          name,
          level: existing?.level || "intermediate",
        };
      });

      const oldLocation = isObject(existingProfile.location)
        ? existingProfile.location
        : {};

      const oldSocialLinks = isObject(existingProfile.socialLinks)
        ? existingProfile.socialLinks
        : {};

      const profileDetails = {
        headline: String(draftRecruiter.headline || "").trim(),
        bio: String(draftRecruiter.bio || "").trim(),
        skills: nextSkills,
        location: {
          ...oldLocation,
          city: String(draftRecruiter.city || "").trim(),
          state: String(draftRecruiter.state || "").trim(),
          country:
            String(draftRecruiter.country || "").trim() || "India",
        },
        socialLinks: {
          ...oldSocialLinks,
          linkedin: String(draftRecruiter.linkedin || "").trim(),
          github: String(draftRecruiter.github || "").trim(),
          portfolio: String(draftRecruiter.portfolio || "").trim(),
        },
        projects: Array.isArray(existingProfile.projects)
          ? existingProfile.projects
          : [],
        experience: Array.isArray(existingProfile.experience)
          ? existingProfile.experience
          : [],
        education: Array.isArray(existingProfile.education)
          ? existingProfile.education
          : [],
        preferences: isObject(existingProfile.preferences)
          ? existingProfile.preferences
          : {},
        resumeId: existingProfile.resumeId || null,
      };

      if (profile) {
        if (typeof handleUpdateProfile !== "function") {
          throw new Error("The profile update handler is unavailable.");
        }

        await handleUpdateProfile(profileDetails);
      } else {
        if (typeof handleCreateProfile !== "function") {
          throw new Error("The profile creation handler is unavailable.");
        }

        await handleCreateProfile(profileDetails);
      }

      // Only update the company when one is already associated.
      if (company && companyId) {
        if (typeof handleUpdateCompany !== "function") {
          throw new Error("The company update handler is unavailable.");
        }

        const oldHeadquarters = isObject(company.headquarters)
          ? company.headquarters
          : {};

        const oldCompanySocialLinks = isObject(company.socialLinks)
          ? company.socialLinks
          : {};

        const companyDetails = {
          name: String(draftCompany.name || "").trim(),
          description: String(draftCompany.description || "").trim(),
          industry: String(draftCompany.industry || "").trim(),
          companySize: draftCompany.companySize || undefined,
          foundedYear:
            draftCompany.foundedYear === ""
              ? undefined
              : Number(draftCompany.foundedYear),
          headquarters: {
            ...oldHeadquarters,
            city: String(draftCompany.city || "").trim(),
            state: String(draftCompany.state || "").trim(),
            country:
              String(draftCompany.country || "").trim() || "India",
          },
          socialLinks: {
            ...oldCompanySocialLinks,
            website: String(draftCompany.website || "").trim(),
            linkedin: String(draftCompany.linkedin || "").trim(),
            github: String(draftCompany.github || "").trim(),
            twitter: String(draftCompany.twitter || "").trim(),
          },
        };

        await handleUpdateCompany({
          companyId,
          details: companyDetails,
        });
      }

      await loadProfileData();

      setEditing(false);
      setNotice({
        type: "success",
        message: "Your profile changes have been submitted.",
      });
    } catch (error) {
      console.error("Recruiter profile save error:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(
          error,
          "Unable to save profile changes."
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event, kind) => {
    const input = event.target;
    const file = input.files?.[0];

    if (input) input.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice({
        type: "error",
        message: "Please select a valid image file.",
      });
      return;
    }

    setUploading(kind);
    setNotice(null);

    try {
      const formData = new FormData();

      if (kind === "avatar") {
        if (typeof handleUpdateAvatar !== "function") {
          throw new Error("Avatar upload is not available.");
        }

        formData.append("avatar", file);
        await handleUpdateAvatar(formData);
      } else if (kind === "cover") {
        if (typeof handleUpdateCoverImage !== "function") {
          throw new Error("Cover image upload is not available.");
        }

        formData.append("coverImage", file);
        await handleUpdateCoverImage(formData);
      } else if (kind === "logo") {
        if (!companyId || typeof handleUpdateCompanyLogo !== "function") {
          throw new Error(
            "Company logo upload is unavailable because no company is associated with this account."
          );
        }

        formData.append("logo", file);

        await handleUpdateCompanyLogo({
          companyId,
          logo: formData,
        });
      }

      await loadProfileData();

      setNotice({
        type: "success",
        message: "The image update request has completed.",
      });
    } catch (error) {
      console.error("Recruiter image upload error:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(error, "Image upload failed."),
      });
    } finally {
      setUploading("");
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F7FB] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <LoaderCircle
            size={19}
            className="animate-spin text-violet-700"
          />
          Loading recruiter profile...
        </div>
      </main>
    );
  }

  if (!recruiter && !recruiterId) {
    return (
      <main className="min-h-screen bg-[#F6F7FB] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Users size={30} className="mx-auto text-violet-700" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Recruiter profile unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in with a recruiter account to view this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7FB] text-slate-900">
      <div className="mx-auto max-w-[1460px] px-4 py-5 sm:px-6 lg:px-9 lg:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span>Recruiter</span>
              <ChevronRight size={13} />
              <span className="text-slate-700">Professional profile</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[30px]">
              Recruiter profile
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Your professional identity and company presence on Peer.Hiring.
            </p>
          </div>

          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(109,40,217,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
          >
            <Pencil size={15} />
            Edit profile
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className={cx(
              "mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium",
              notice.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            )}
          >
            {notice.type === "error" ? (
              <X size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            <span>{notice.message}</span>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
              className="ml-auto rounded-lg p-1 hover:bg-black/5"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {pageError && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {pageError}

            <button
              type="button"
              onClick={loadProfileData}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Recruiter cover and avatar */}
        <Panel className="overflow-hidden">
          <div className="relative h-36 overflow-hidden bg-[#24104D] sm:h-44 lg:h-52">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Recruiter cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#24104D] via-[#4C1D95] to-[#7C3AED]">
                <div className="absolute -right-12 -top-36 h-80 w-80 rounded-full border border-white/10" />
                <div className="absolute -right-1 -top-[92px] h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute right-[22%] top-10 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-2xl" />
              </div>
            )}

            <div className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm sm:left-8 sm:top-7">
              <Sparkles size={13} />
              Professional profile
            </div>

            <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/50">
              {uploading === "cover" ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <Pencil size={13} />
              )}
              Change cover

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(uploading)}
                onChange={(event) => uploadImage(event, "cover")}
              />
            </label>
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-11 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                <div className="relative h-[92px] w-[92px] shrink-0 sm:h-[108px] sm:w-[108px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[25px] border-[5px] border-white bg-gradient-to-br from-violet-100 to-indigo-100 text-2xl font-extrabold tracking-wide text-violet-800 shadow-lg sm:rounded-[28px] sm:text-3xl">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={recruiterName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(recruiterName)
                    )}
                  </div>

                  <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-violet-700 text-white shadow-md transition hover:bg-violet-800">
                    {uploading === "avatar" ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <Pencil size={13} />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={Boolean(uploading)}
                      onChange={(event) => uploadImage(event, "avatar")}
                    />
                  </label>
                </div>

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">
                      {recruiterName}
                    </h2>

                    {isVerifiedCompany && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">
                        <BadgeCheck size={13} />
                        Verified company
                      </span>
                    )}
                  </div>

                  {profile?.headline && (
                    <p className="mt-1 text-sm font-semibold text-violet-700 sm:text-[15px]">
                      {profile.headline}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    {company?.name && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400" />
                        {company.name}
                      </span>
                    )}

                    {recruiterLocation && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        {recruiterLocation}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 pb-1">
                {recruiter?.email && (
                  <a
                    href={`mailto:${recruiter.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Mail size={14} />
                    Contact recruiter
                  </a>
                )}

                {recruiterSocialLinks.linkedin && (
                  <a
                    href={getWebsite(recruiterSocialLinks.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <FaLinkedin size={16} />
                  </a>
                )}
              </div>
            </div>

            {profile?.bio && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </Panel>

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
          <div className="space-y-5">
            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Recruiter information"
                title="About the recruiter"
                description="Professional information from your account and profile."
                action={
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    <Pencil size={13} />
                    Edit details
                  </button>
                }
              />

              <div className="mt-4 grid grid-cols-1 gap-x-7 sm:grid-cols-2">
                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={recruiter?.email}
                    href={
                      recruiter?.email
                        ? `mailto:${recruiter.email}`
                        : undefined
                    }
                  />

                  <InfoRow
                    icon={Phone}
                    label="Phone number"
                    value={recruiter?.phoneNo}
                    href={
                      recruiter?.phoneNo
                        ? `tel:${recruiter.phoneNo}`
                        : undefined
                    }
                  />

                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={recruiterLocation}
                  />
                </div>

                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={BriefcaseBusiness}
                    label="Professional headline"
                    value={profile?.headline}
                  />

                  <InfoRow
                    icon={Users}
                    label="Recruiter account"
                    value={recruiter?.role}
                  />

                  <InfoRow
                    icon={Clock3}
                    label="Account status"
                    value={recruiter?.accountStatus}
                  />
                </div>
              </div>

              {profile?.bio && (
                <div className="mt-5 rounded-xl bg-[#F8F7FF] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                      <Sparkles size={15} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">
                      Professional bio
                    </h3>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {profile.bio}
                  </p>
                </div>
              )}

              {!recruiter?.email &&
                !recruiter?.phoneNo &&
                !recruiterLocation &&
                !profile?.headline &&
                !profile?.bio && (
                  <div className="mt-4">
                    <EmptyState>
                      Add your available professional details to complete this section.
                    </EmptyState>
                  </div>
                )}
            </Panel>

            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Skills"
                title="Professional skills"
                description="Skills saved in your profile."
                action={
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    <Pencil size={13} />
                    Edit skills
                  </button>
                }
              />

              <div className="mt-5">
                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill.name}-${index}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/70 px-3 py-2 text-xs font-semibold text-violet-800"
                      >
                        <CheckCircle2
                          size={13}
                          className="text-violet-500"
                        />
                        {skill.name}

                        {skill.level && (
                          <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-500">
                            {skill.level}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <EmptyState>
                    No professional skills have been added yet.
                  </EmptyState>
                )}
              </div>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Online presence"
                title="Professional links"
                description="Links saved in your profile."
              />

              {professionalLinks.length ? (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {professionalLinks.map((link) => (
                    <SocialLink key={link.key} {...link} />
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState>
                    No professional links have been added yet.
                  </EmptyState>
                </div>
              )}
            </Panel>
          </div>

          {/* Company sidebar */}
          <aside className="space-y-5">
            <Panel className="overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-violet-700 via-violet-500 to-indigo-400" />

              <div className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Organization"
                  title="Company profile"
                  description="Company information connected to your recruiter account."
                  action={
                    isVerifiedCompany ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                    ) : null
                  }
                />

                {company ? (
                  <>
                    <div className="mt-5 flex items-center gap-3.5">
                      <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-600 text-white shadow-md shadow-violet-200/60">
                        {companyLogoUrl ? (
                          <img
                            src={companyLogoUrl}
                            alt={company?.name || "Company logo"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 size={26} strokeWidth={1.6} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold tracking-tight text-slate-900">
                          {company?.name || "Company"}
                        </h3>

                        {company?.industry && (
                          <p className="mt-1 text-xs font-medium text-violet-700">
                            {company.industry}
                          </p>
                        )}

                        {company?.foundedYear && (
                          <p className="mt-1 text-xs text-slate-400">
                            Founded {company.foundedYear}
                          </p>
                        )}
                      </div>

                      <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                        {uploading === "logo" ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Pencil size={14} />
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={Boolean(uploading)}
                          onChange={(event) => uploadImage(event, "logo")}
                        />
                      </label>
                    </div>

                    {company?.description && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {company.description}
                      </p>
                    )}

                    <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100 py-1">
                      <InfoRow
                        icon={Building2}
                        label="Company size"
                        value={company?.companySize}
                      />

                      <InfoRow
                        icon={MapPin}
                        label="Headquarters"
                        value={companyLocation}
                      />

                      <InfoRow
                        icon={Globe2}
                        label="Website"
                        value={companySocialLinks.website}
                        href={companyWebsite || undefined}
                      />
                    </div>

                    {companyLinks.length > 0 && (
                      <div className="mt-5 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Company links
                        </h3>

                        {companyLinks.map((link) => (
                          <SocialLink key={link.key} {...link} />
                        ))}
                      </div>
                    )}

                    {companyWebsite && (
                      <a
                        href={companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                      >
                        Visit company website
                        <ArrowUpRight size={15} />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        startEditing();
                        setActiveTab("company");
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Pencil size={14} />
                      Edit company details
                    </button>
                  </>
                ) : (
                  <div className="mt-5">
                    <EmptyState>
                      No company profile is currently available for this recruiter account.
                    </EmptyState>
                  </div>
                )}
              </div>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Profile completeness
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Based on information available in your account, profile, and company.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[4px] border-violet-100 bg-white text-xs font-extrabold text-violet-700">
                  {completion}%
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-700 to-indigo-500 transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <button
                type="button"
                onClick={startEditing}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900"
              >
                Improve your profile
                <ChevronRight size={14} />
              </button>
            </Panel>
          </aside>
        </div>

        <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400">
          <span>Peer.Hiring · Recruiter workspace</span>
          <span>Professional identity · Company information</span>
        </footer>
      </div>

      {/* Edit profile modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-[3px] sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditing();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-recruiter-title"
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="relative overflow-hidden bg-[#28104F] px-5 py-5 text-white sm:px-7 sm:py-6">
              <div className="absolute -right-8 -top-20 h-44 w-44 rounded-full border border-white/10" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                    <Pencil size={12} />
                    Recruiter profile
                  </div>

                  <h2
                    id="edit-recruiter-title"
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                  >
                    Edit your profile
                  </h2>

                  <p className="mt-1.5 text-sm leading-5 text-white/65">
                    Update your saved professional and company information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditing}
                  disabled={saving}
                  aria-label="Close edit profile"
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="border-b border-slate-200 px-4 pt-3 sm:px-7">
              <div className="flex gap-5">
                {[
                  {
                    id: "recruiter",
                    label: "Recruiter details",
                    icon: Users,
                  },
                  ...(company
                    ? [
                        {
                          id: "company",
                          label: "Company details",
                          icon: Building2,
                        },
                      ]
                    : []),
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={cx(
                      "inline-flex items-center gap-2 border-b-2 px-1 pb-3 pt-2 text-xs font-bold transition sm:text-sm",
                      activeTab === id
                        ? "border-violet-700 text-violet-800"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <form
              id="edit-recruiter-form"
              onSubmit={saveProfile}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-5 px-4 py-5 sm:px-7 sm:py-6">
                {activeTab === "recruiter" ? (
                  <>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Recruiter information
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        These fields use your authenticated user and UserProfile schema.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Full name"
                        value={draftRecruiter.name}
                        onChange={(value) =>
                          updateRecruiterDraft("name", value)
                        }
                      />

                      <FormField
                        label="Professional headline"
                        value={draftRecruiter.headline}
                        onChange={(value) =>
                          updateRecruiterDraft("headline", value)
                        }
                      />

                      <FormField
                        label="Email"
                        value={recruiter?.email || ""}
                        disabled
                      />

                      <FormField
                        label="Phone number"
                        value={recruiter?.phoneNo || ""}
                        disabled
                      />

                      <FormField
                        label="City"
                        value={draftRecruiter.city}
                        onChange={(value) =>
                          updateRecruiterDraft("city", value)
                        }
                      />

                      <FormField
                        label="State"
                        value={draftRecruiter.state}
                        onChange={(value) =>
                          updateRecruiterDraft("state", value)
                        }
                      />

                      <FormField
                        label="Country"
                        value={draftRecruiter.country}
                        onChange={(value) =>
                          updateRecruiterDraft("country", value)
                        }
                      />

                      <FormField
                        label="LinkedIn URL"
                        value={draftRecruiter.linkedin}
                        onChange={(value) =>
                          updateRecruiterDraft("linkedin", value)
                        }
                        placeholder="https://linkedin.com/in/..."
                      />

                      <FormField
                        label="GitHub URL"
                        value={draftRecruiter.github}
                        onChange={(value) =>
                          updateRecruiterDraft("github", value)
                        }
                        placeholder="https://github.com/..."
                      />

                      <FormField
                        label="Portfolio URL"
                        value={draftRecruiter.portfolio}
                        onChange={(value) =>
                          updateRecruiterDraft("portfolio", value)
                        }
                        placeholder="https://..."
                      />

                      <div className="sm:col-span-2">
                        <FormField
                          label="Skills (comma-separated)"
                          value={draftRecruiter.skills}
                          onChange={(value) =>
                            updateRecruiterDraft("skills", value)
                          }
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FormField
                          label="Professional bio"
                          value={draftRecruiter.bio}
                          onChange={(value) =>
                            updateRecruiterDraft("bio", value)
                          }
                          multiline
                          maxLength={500}
                          placeholder="Describe your professional background..."
                        />

                        <p className="mt-1 text-right text-[10px] text-slate-400">
                          {String(draftRecruiter.bio || "").length}/500 characters
                        </p>
                      </div>
                    </div>
                  </>
                ) : company ? (
                  <>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Company information
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        These fields map to your existing Company schema.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Company name"
                        value={draftCompany.name}
                        onChange={(value) =>
                          updateCompanyDraft("name", value)
                        }
                      />

                      <FormField
                        label="Industry"
                        value={draftCompany.industry}
                        onChange={(value) =>
                          updateCompanyDraft("industry", value)
                        }
                      />

                      <label className="block min-w-0">
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Company size
                        </span>

                        <select
                          value={draftCompany.companySize}
                          onChange={(event) =>
                            updateCompanyDraft(
                              "companySize",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                        >
                          <option value="">Select company size</option>

                          {[
                            "1-10",
                            "11-50",
                            "51-200",
                            "201-500",
                            "501-1000",
                            "1001-5000",
                            "5001-10000",
                          ].map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </label>

                      <FormField
                        label="Founded year"
                        type="number"
                        value={draftCompany.foundedYear}
                        onChange={(value) =>
                          updateCompanyDraft("foundedYear", value)
                        }
                      />

                      <FormField
                        label="City"
                        value={draftCompany.city}
                        onChange={(value) =>
                          updateCompanyDraft("city", value)
                        }
                      />

                      <FormField
                        label="State"
                        value={draftCompany.state}
                        onChange={(value) =>
                          updateCompanyDraft("state", value)
                        }
                      />

                      <FormField
                        label="Country"
                        value={draftCompany.country}
                        onChange={(value) =>
                          updateCompanyDraft("country", value)
                        }
                      />

                      <FormField
                        label="Company website"
                        value={draftCompany.website}
                        onChange={(value) =>
                          updateCompanyDraft("website", value)
                        }
                        placeholder="https://..."
                      />

                      <FormField
                        label="Company LinkedIn"
                        value={draftCompany.linkedin}
                        onChange={(value) =>
                          updateCompanyDraft("linkedin", value)
                        }
                      />

                      <FormField
                        label="Company GitHub"
                        value={draftCompany.github}
                        onChange={(value) =>
                          updateCompanyDraft("github", value)
                        }
                      />

                      <FormField
                        label="Company Twitter"
                        value={draftCompany.twitter}
                        onChange={(value) =>
                          updateCompanyDraft("twitter", value)
                        }
                      />

                      <div className="sm:col-span-2">
                        <FormField
                          label="Company description"
                          value={draftCompany.description}
                          onChange={(value) =>
                            updateCompanyDraft("description", value)
                          }
                          multiline
                          placeholder="Describe the company..."
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState>
                    No company profile is available to edit.
                  </EmptyState>
                )}
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-7">
              <p className="hidden text-xs text-slate-400 sm:block">
                {activeTab === "recruiter"
                  ? "Recruiter profile details"
                  : "Organization details"}
              </p>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEditing}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                {activeTab === "recruiter" && company ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("company")}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-800 disabled:opacity-50"
                  >
                    Next: Company
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="edit-recruiter-form"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={14} />
                    )}

                    {saving ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}