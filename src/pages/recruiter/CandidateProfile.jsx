import React, { useMemo } from "react";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  ExternalLink,
  Globe,
  FileText,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Building2,
  Link2,
  AlertCircle,
} from "lucide-react";

import { useApplication, useHome, useTitle } from "../../hooks/Hook";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* -------------------- Helpers -------------------- */

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const getCandidateName = (candidate) =>
  candidate?.name ||
  candidate?.fullName ||
  candidate?.username ||
  "Candidate";

const getCandidateProfile = (candidate) => {
  if (!candidate || typeof candidate !== "object") {
    return {};
  }

  return candidate.profile &&
    typeof candidate.profile === "object"
    ? candidate.profile
    : {};
};

const getCandidateAvatar = (candidate) =>
  candidate?.avatar?.url ||
  (typeof candidate?.avatar === "string"
    ? candidate.avatar
    : "");

const getCandidateLocation = (candidate, profile) => {
  const location = profile?.location || candidate?.location;

  if (typeof location === "string") {
    return location;
  }

  if (location && typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "";
};

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) =>
      typeof skill === "string"
        ? skill
        : skill?.name || skill?.title || ""
    )
    .filter(Boolean);
};

const normalizeSocialLinks = (profile, candidate) => {
  const profileLinks = profile?.socialLinks || {};
  const candidateLinks = candidate?.socialLinks || {};

  return {
    github:
      profileLinks.github ||
      candidateLinks.github ||
      candidate?.github ||
      "",

    linkedin:
      profileLinks.linkedin ||
      candidateLinks.linkedin ||
      candidate?.linkedin ||
      "",

    portfolio:
      profileLinks.portfolio ||
      profileLinks.website ||
      candidateLinks.portfolio ||
      candidate?.portfolio ||
      "",

    twitter:
      profileLinks.twitter ||
      candidateLinks.twitter ||
      candidate?.twitter ||
      "",
  };
};

const normalizeExperience = (candidate, profile) => {
  const experience =
    profile?.experience ||
    candidate?.experience ||
    [];

  if (!Array.isArray(experience)) return [];

  return experience;
};

const normalizeEducation = (candidate, profile) => {
  const education =
    profile?.education ||
    candidate?.education ||
    [];

  if (Array.isArray(education)) {
    return education;
  }

  if (typeof education === "string") {
    return [
      {
        degree: education,
        institute: candidate?.university || "",
      },
    ];
  }

  return [];
};

const normalizeProjects = (candidate, profile) => {
  const projects =
    profile?.projects ||
    candidate?.projects ||
    [];

  return Array.isArray(projects) ? projects : [];
};

const getProfileCompletion = (candidate, profile) => {
  const completion =
    profile?.profileCompletion ??
    candidate?.profileCompletion;

  if (
    typeof completion === "number" &&
    Number.isFinite(completion)
  ) {
    return Math.min(100, Math.max(0, completion));
  }

  return null;
};

const getSafeUrl = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) return "";

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`
    );

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
};

/* -------------------- UI Components -------------------- */

function CandidateAvatar({ candidate, size = "large" }) {
  const name = getCandidateName(candidate);
  const avatar = getCandidateAvatar(candidate);

  const sizeClasses =
    size === "large"
      ? "h-24 w-24 rounded-3xl text-2xl"
      : "h-12 w-12 rounded-xl text-base";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses} shrink-0 object-cover ring-4 ring-white shadow-md`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} flex shrink-0 items-center justify-center bg-violet-100 font-bold text-violet-700 ring-4 ring-white shadow-md`}
    >
      {getInitials(name)}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <Icon size={20} className="text-violet-600" />
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function ProfileLink({ icon: Icon, label, href }) {
  const safeUrl = getSafeUrl(href);

  if (!safeUrl) return null;

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      <Icon size={16} className="shrink-0" />

      <span className="truncate">{label}</span>

      <ExternalLink size={13} className="shrink-0 opacity-60" />
    </a>
  );
}

function ExperienceCard({ experience }) {
  const position =
    experience.position ||
    experience.role ||
    experience.title ||
    "Position";

  const company =
    experience.company ||
    experience.companyName ||
    experience.organization ||
    "";

  const startDate =
    experience.startDate ||
    experience.startYear;

  const endDate =
    experience.endDate ||
    experience.endYear;

  const current =
    experience.current ||
    experience.isCurrent ||
    experience.currentlyWorking;

  const description =
    experience.description ||
    experience.summary ||
    "";

  return (
    <div className="relative border-l-2 border-violet-100 pl-5">
      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-violet-500 bg-white" />

      <h3 className="font-semibold text-slate-950">
        {position}
      </h3>

      {company && (
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-violet-700">
          <Building2 size={15} />
          {company}
        </p>
      )}

      {(startDate || endDate || current) && (
        <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} />

          {formatDate(startDate) || startDate || "Start date unavailable"}

          {" – "}

          {current
            ? "Present"
            : formatDate(endDate) || endDate || "End date unavailable"}
        </p>
      )}

      {description && (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

function EducationCard({ education }) {
  const degree =
    education.degree ||
    education.qualification ||
    education.title ||
    "Education";

  const institute =
    education.institute ||
    education.institution ||
    education.university ||
    education.school ||
    "";

  const startYear =
    education.startYear ||
    education.startDate;

  const endYear =
    education.endYear ||
    education.endDate;

  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-200">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
          <GraduationCap size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold text-slate-950">
            {degree}
          </h3>

          {education.field && (
            <p className="mt-1 text-sm text-slate-600">
              {education.field}
            </p>
          )}

          {institute && (
            <p className="mt-1 break-words text-sm text-slate-500">
              {institute}
            </p>
          )}

          {(startYear || endYear) && (
            <p className="mt-2 text-xs text-slate-400">
              {formatDate(startYear) || startYear || "—"}
              {" – "}
              {formatDate(endYear) || endYear || "Present"}
            </p>
          )}

          {education.grade && (
            <p className="mt-2 text-xs font-medium text-violet-700">
              Grade: {education.grade}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const title =
    project.title ||
    project.name ||
    "Untitled project";

  const description =
    project.description ||
    project.summary ||
    "";

  const technologies = normalizeSkills(
    project.technologies ||
    project.techStack ||
    project.skills
  );

  const projectUrl = getSafeUrl(
    project.projectUrl ||
    project.liveUrl ||
    project.url
  );

  const githubUrl = getSafeUrl(
    project.githubUrl ||
    project.repositoryUrl ||
    project.repoUrl
  );

  return (
    <article className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
          <Code2 size={20} />
        </div>

        <div className="flex items-center gap-2">
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title}`}
              className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
            >
              <ExternalLink size={17} />
            </a>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} repository`}
              className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
            >
              <FaGithub size={17} />
            </a>
          )}
        </div>
      </div>

      <h3 className="mt-4 break-words font-bold text-slate-950">
        {title}
      </h3>

      {description && (
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}

      {technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology, index) => (
            <span
              key={`${technology}-${index}`}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {technology}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/* -------------------- Main Candidate Profile -------------------- */

export default function CandidateProfile() {
  const {
    selectedCandidate,
    setSelectedCandidate,
  } = useApplication();

  const { setRecruiterActivePage } = useHome();

  const { setTitle } = useTitle();

  const candidate = useMemo(() => {
    if (!selectedCandidate) return null;

    // Supports either a candidate object or a legacy application object.
    if (
      selectedCandidate.candidate &&
      typeof selectedCandidate.candidate === "object"
    ) {
      return selectedCandidate.candidate;
    }

    if (
      selectedCandidate.candidateId &&
      typeof selectedCandidate.candidateId === "object"
    ) {
      return selectedCandidate.candidateId;
    }

    return selectedCandidate;
  }, [selectedCandidate]);

  const profile = useMemo(
    () => getCandidateProfile(candidate),
    [candidate]
  );

  const name = getCandidateName(candidate);

  const avatar = getCandidateAvatar(candidate);

  const headline =
    profile.headline ||
    candidate?.headline ||
    candidate?.currentRole ||
    "";

  const bio =
    profile.bio ||
    profile.about ||
    candidate?.bio ||
    candidate?.about ||
    "";

  const location = getCandidateLocation(candidate, profile);

  const skills = useMemo(
    () =>
      normalizeSkills(
        profile.skills ||
        candidate?.skills
      ),
    [profile.skills, candidate]
  );

  const experience = useMemo(
    () => normalizeExperience(candidate, profile),
    [candidate, profile]
  );

  const education = useMemo(
    () => normalizeEducation(candidate, profile),
    [candidate, profile]
  );

  const projects = useMemo(
    () => normalizeProjects(candidate, profile),
    [candidate, profile]
  );

  const socialLinks = useMemo(
    () => normalizeSocialLinks(profile, candidate),
    [profile, candidate]
  );

  const profileCompletion = getProfileCompletion(
    candidate,
    profile
  );

  const email = candidate?.email || "";

  const phone =
    candidate?.phoneNo ||
    candidate?.phone ||
    "";

  const portfolio = getSafeUrl(socialLinks.portfolio);

  const github = getSafeUrl(socialLinks.github);

  const linkedin = getSafeUrl(socialLinks.linkedin);

  const twitter = getSafeUrl(socialLinks.twitter);

  const candidateId = getId(candidate);

  const goBack = () => {
    setRecruiterActivePage("recruiter/application");
    setTitle("Applications");
  };

  const clearCandidate = () => {
    setSelectedCandidate(null);
    goBack();
  };

  if (!candidate || typeof candidate !== "object") {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={22}
                className="shrink-0 text-amber-600"
              />

              <div>
                <h2 className="font-bold text-slate-900">
                  Candidate profile unavailable
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No candidate information was provided. Open an
                  application and select Candidate Profile again.
                </p>

                <button
                  type="button"
                  onClick={clearCandidate}
                  className="mt-4 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                >
                  Return to applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header */}

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-violet-700"
            >
              <ArrowLeft size={17} />
              Back to applications
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles size={15} />
              Recruiter workspace
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Candidate profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review candidate information, experience, skills, and projects.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCandidate}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Return to applications
          </button>
        </header>

        {/* Profile Hero */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 sm:h-40" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <CandidateAvatar
                  candidate={candidate}
                  size="large"
                />

                <div className="min-w-0 pb-1">
                  <h2 className="break-words text-2xl font-bold text-slate-950">
                    {name}
                  </h2>

                  <p className="mt-1 break-words text-sm font-medium text-slate-600">
                    {headline || "Professional headline not provided"}
                  </p>

                  {location && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin size={15} />
                      {location}
                    </p>
                  )}
                </div>
              </div>

              {profileCompletion !== null && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:min-w-44">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Profile completion
                    </span>

                    <span className="text-sm font-bold text-violet-700">
                      {profileCompletion}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all"
                      style={{
                        width: `${profileCompletion}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact links */}

            <div className="mt-6 flex flex-wrap gap-2">
              <ProfileLink
                icon={Mail}
                label="Email"
                href={email ? `mailto:${email}` : ""}
              />

              <ProfileLink
                icon={Phone}
                label="Phone"
                href={phone ? `tel:${phone}` : ""}
              />

              <ProfileLink
                icon={FaGithub}
                label="GitHub"
                href={github}
              />

              <ProfileLink
                icon={FaLinkedin}
                label="LinkedIn"
                href={linkedin}
              />

              <ProfileLink
                icon={Globe}
                label="Portfolio"
                href={portfolio}
              />

              <ProfileLink
                icon={Link2}
                label="Twitter"
                href={twitter}
              />
            </div>

            {candidateId && (
              <p className="mt-5 break-all text-xs text-slate-400">
                Candidate ID: {candidateId}
              </p>
            )}
          </div>
        </section>

        {/* Profile content */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main content */}

          <div className="space-y-6 lg:col-span-2">

            {/* About */}

            <SectionCard
              title="About candidate"
              icon={UserRound}
            >
              {bio ? (
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {bio}
                </p>
              ) : (
                <EmptyState message="The candidate has not added an about section." />
              )}
            </SectionCard>

            {/* Experience */}

            <SectionCard
              title="Professional experience"
              icon={BriefcaseBusiness}
            >
              {experience.length > 0 ? (
                <div className="space-y-6">
                  {experience.map((item, index) => (
                    <ExperienceCard
                      key={
                        item._id ||
                        `${item.company}-${item.position}-${index}`
                      }
                      experience={item}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No professional experience has been added." />
              )}
            </SectionCard>

            {/* Education */}

            <SectionCard
              title="Education"
              icon={GraduationCap}
            >
              {education.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {education.map((item, index) => (
                    <EducationCard
                      key={
                        item._id ||
                        `${item.institute}-${item.degree}-${index}`
                      }
                      education={item}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No education information is available." />
              )}
            </SectionCard>

            {/* Projects */}

            <SectionCard
              title="Projects"
              icon={Code2}
            >
              {projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={
                        project._id ||
                        `${project.title}-${index}`
                      }
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="The candidate has not added any projects." />
              )}
            </SectionCard>
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">

            {/* Skills */}

            <SectionCard
              title="Technical skills"
              icon={Code2}
            >
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="No skills have been added." />
              )}
            </SectionCard>

            {/* Contact */}

            <SectionCard
              title="Contact information"
              icon={Mail}
            >
              <div className="space-y-4">
                {email && (
                  <div className="flex items-start gap-3">
                    <Mail
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        Email
                      </p>

                      <a
                        href={`mailto:${email}`}
                        className="mt-1 block break-all text-sm font-medium text-violet-700 hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {phone && (
                  <div className="flex items-start gap-3">
                    <Phone
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        Phone
                      </p>

                      <a
                        href={`tel:${phone}`}
                        className="mt-1 block break-all text-sm font-medium text-slate-700 hover:text-violet-700"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-700">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

                {!email && !phone && !location && (
                  <EmptyState message="No contact information is available." />
                )}
              </div>
            </SectionCard>

            {/* Profile information */}

            <SectionCard
              title="Profile information"
              icon={ShieldCheck}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Candidate name
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Profile headline
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-slate-700">
                    {headline || "Not provided"}
                  </p>
                </div>

                {candidate.createdAt && (
                  <div>
                    <p className="text-xs text-slate-400">
                      Member since
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(candidate.createdAt)}
                    </p>
                  </div>
                )}

                {candidate.updatedAt && (
                  <div>
                    <p className="text-xs text-slate-400">
                      Last profile update
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(candidate.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Social links */}

            <SectionCard
              title="Online presence"
              icon={Globe}
            >
              <div className="space-y-2">
                <ProfileLink
                  icon={FaGithub}
                  label="GitHub profile"
                  href={github}
                />

                <ProfileLink
                  icon={FaLinkedin}
                  label="LinkedIn profile"
                  href={linkedin}
                />

                <ProfileLink
                  icon={Globe}
                  label="Portfolio website"
                  href={portfolio}
                />

                <ProfileLink
                  icon={Link2}
                  label="Twitter profile"
                  href={twitter}
                />

                {!github &&
                  !linkedin &&
                  !portfolio &&
                  !twitter && (
                    <EmptyState message="No social links are available." />
                  )}
              </div>
            </SectionCard>
          </aside>
        </div>

        {/* Footer */}

        <footer className="flex flex-col justify-between gap-3 border-t border-slate-200 py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            Peer.Hiring · Recruiter workspace
          </p>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            <ArrowLeft size={16} />
            Back to applications
          </button>
        </footer>
      </main>
    </div>
  );
}