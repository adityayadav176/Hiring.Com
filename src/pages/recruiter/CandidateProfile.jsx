import React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderGit2,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Wallet,
  Clock3,
  Building2,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useApplication, useHome } from "../../hooks/Hook";

const CandidateProfile = () => {
  const { selectedCandidate } = useApplication();
  const { setRecruiterActivePage } = useHome();

  const candidate =
    selectedCandidate?.candidate ??
    selectedCandidate?.candidateId ??
    selectedCandidate;

  const profile = candidate?.profile ?? {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];
  const education = Array.isArray(profile.education)
    ? profile.education
    : [];

  const socialLinks = profile.socialLinks ?? {};
  const location = profile.location ?? {};
  const preferences = profile.preferences ?? {};
  const expectedSalary = preferences.expectedSalary ?? {};

  const city =
    typeof location === "string"
      ? location
      : [location.city, location.state, location.country]
          .filter(Boolean)
          .join(", ");

  const initials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "C";

  const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  const externalUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return null;

    try {
      const url = new URL(
        /^https?:\/\//i.test(value.trim())
          ? value.trim()
          : `https://${value.trim()}`
      );

      if (!["http:", "https:"].includes(url.protocol)) return null;
      if (["localhost", "127.0.0.1"].includes(url.hostname)) return null;

      return url.href;
    } catch {
      return null;
    }
  };

  const text = (value, fallback = "Not provided") =>
    value === undefined || value === null || value === ""
      ? fallback
      : String(value);

  const goBack = () => {
    setRecruiterActivePage("recruiter/application");
  };

  const skillsList = skills
    .map((skill) =>
      typeof skill === "string" ? skill : skill?.name
    )
    .filter(Boolean);

  const socialItems = [
    {
      label: "GitHub",
      url: externalUrl(socialLinks.github),
      Icon: FaGithub,
    },
    {
      label: "LinkedIn",
      url: externalUrl(socialLinks.linkedin),
      Icon: FaLinkedin,
    },
    {
      label: "Portfolio",
      url: externalUrl(socialLinks.portfolio),
      Icon: Globe,
    },
  ].filter((item) => item.url);

  const salaryMin = formatSalary(expectedSalary.min);
  const salaryMax = formatSalary(expectedSalary.max);
  const currency = expectedSalary.currency || "INR";

  const Card = ({ children, className = "" }) => (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );

  const SectionTitle = ({ icon: Icon, title, count }) => (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <Icon size={19} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Candidate {title.toLowerCase()}
          </p>
        </div>
      </div>

      {count !== undefined && (
        <span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-500">
          {count}
        </span>
      )}
    </div>
  );

  const Empty = ({ children }) => (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-400">
      {children}
    </div>
  );

  const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <div className="mt-1 break-words text-sm font-medium leading-5 text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );

  if (!candidate || typeof candidate !== "object") {
    return (
      <div className="min-h-full bg-[#F7F8FC] p-5 sm:p-8">
        <button
          type="button"
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          <ArrowLeft size={17} /> Back to applications
        </button>

        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <UserRound className="mx-auto mb-4 text-slate-300" size={38} />
          <h2 className="text-lg font-bold text-slate-900">
            Candidate profile unavailable
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Open a candidate from the applications page to review their
            professional profile.
          </p>
        </div>
      </div>
    );
  }

  const name = candidate.name || candidate.fullName || "Candidate";
  const avatarUrl = candidate.avatar?.url;
  const coverUrl = candidate.coverImage?.url;
  const headline = profile.headline || "Professional profile";
  const completion =
    typeof profile.profileCompletion === "number"
      ? Math.min(100, Math.max(0, profile.profileCompletion))
      : null;

  return (
    <div className="min-h-full bg-[#F7F8FC] text-slate-800">
      <main className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 xl:p-8">
        {/* Breadcrumb and page heading */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Candidate profile
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Review professional background, qualifications, and job
              preferences.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
            <ShieldCheck size={16} className="text-violet-600" />
            Recruiter view
          </div>
        </header>

        {/* Candidate identity */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-violet-800 via-violet-600 to-indigo-500 md:h-52">
            {coverUrl && (
              <img
                src={coverUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-950/30 to-transparent" />
            <div className="absolute bottom-4 right-5 hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:flex">
              <Sparkles size={13} />
              Professional profile
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-7">
            <div className="relative -mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-white object-cover shadow-lg sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-violet-100 text-2xl font-bold text-violet-800 shadow-lg sm:h-28 sm:w-28">
                  {initials(name)}
                </div>
              )}

              <div className="min-w-0 flex-1 pt-14 sm:pb-1 sm:pt-14">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-2xl font-bold tracking-tight text-slate-950">
                    {name}
                  </h2>
                  {candidate.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-medium text-violet-700">
                  {headline}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  {city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {city}
                    </span>
                  )}
                  {candidate.createdAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      Joined {formatDate(candidate.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              {socialItems.length > 0 && (
                <div className="flex items-center gap-2 pb-1 sm:pb-2">
                  {socialItems.map(({ label, url, Icon }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick details */}
            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={Mail} label="Email address">
                {candidate.email ? (
                  <a
                    href={`mailto:${candidate.email}`}
                    className="transition hover:text-violet-700"
                  >
                    {candidate.email}
                  </a>
                ) : "Not provided"}
              </InfoRow>

              <InfoRow icon={Phone} label="Phone number">
                {candidate.phoneNo ? (
                  <a
                    href={`tel:${candidate.phoneNo}`}
                    className="transition hover:text-violet-700"
                  >
                    {candidate.phoneNo}
                  </a>
                ) : "Not provided"}
              </InfoRow>

              <InfoRow icon={BriefcaseBusiness} label="Current headline">
                {headline}
              </InfoRow>
            </div>
          </div>
        </section>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Skills",
              value: skillsList.length,
              detail: "Listed skills",
              Icon: Code2,
            },
            {
              label: "Projects",
              value: projects.length,
              detail: "Portfolio projects",
              Icon: FolderGit2,
            },
            {
              label: "Experience",
              value: experience.length,
              detail: "Work entries",
              Icon: BriefcaseBusiness,
            },
            {
              label: "Education",
              value: education.length,
              detail: "Qualifications",
              Icon: GraduationCap,
            },
          ].map(({ label, value, detail, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.02)] sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                  {label}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon size={17} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums text-slate-950">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </div>

        {/* Main two-column content */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            {/* About */}
            <Card>
              <SectionTitle icon={UserRound} title="About candidate" />
              {profile.bio ? (
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {profile.bio}
                </p>
              ) : (
                <Empty>No professional summary has been added.</Empty>
              )}
            </Card>

            {/* Skills */}
            <Card>
              <SectionTitle
                icon={Code2}
                title="Technical skills"
                count={skillsList.length}
              />
              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg border border-violet-100 bg-violet-50/80 px-3 py-2 text-xs font-semibold text-violet-800 sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <Empty>No skills have been added yet.</Empty>
              )}
            </Card>

            {/* Experience */}
            <Card>
              <SectionTitle
                icon={BriefcaseBusiness}
                title="Professional experience"
                count={experience.length}
              />

              {experience.length > 0 ? (
                <div className="space-y-6">
                  {experience.map((item, index) => (
                    <article
                      key={item._id || index}
                      className="relative border-l-2 border-violet-100 pb-1 pl-5 last:border-l-transparent"
                    >
                      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-violet-600 bg-white" />

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {item.position ||
                              item.role ||
                              item.title ||
                              "Position not specified"}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-violet-700">
                            <Building2 size={14} />
                            {item.company ||
                              item.companyName ||
                              "Company not specified"}
                          </p>
                        </div>
                        {item.employmentType && (
                          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-500">
                            {String(item.employmentType).replaceAll("-", " ")}
                          </span>
                        )}
                      </div>

                      {(item.startDate ||
                        item.endDate ||
                        item.currentlyWorking ||
                        item.current) && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          {formatDate(item.startDate) || "Start date not specified"}
                          {" – "}
                          {item.currentlyWorking || item.current
                            ? "Present"
                            : formatDate(item.endDate) || "End date not specified"}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <Empty>No professional experience has been added.</Empty>
              )}
            </Card>

            {/* Projects */}
            <Card>
              <SectionTitle
                icon={FolderGit2}
                title="Projects"
                count={projects.length}
              />

              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project, index) => {
                    const githubUrl = externalUrl(
                      project.githubUrl || project.github
                    );
                    const liveUrl = externalUrl(
                      project.liveUrl || project.projectUrl
                    );

                    const technologies = Array.isArray(project.technologies)
                      ? project.technologies
                      : Array.isArray(project.techStack)
                        ? project.techStack
                        : [];

                    return (
                      <article
                        key={project._id || index}
                        className="rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-violet-700">
                            <FolderGit2 size={19} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900">
                              {project.title || project.name || "Untitled project"}
                            </h3>
                            {(project.startDate || project.endDate) && (
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                <CalendarDays size={13} />
                                {formatDate(project.startDate) || "Start date not specified"}
                                {" – "}
                                {formatDate(project.endDate) || "Present"}
                              </p>
                            )}
                          </div>
                        </div>

                        {project.description && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                            {project.description}
                          </p>
                        )}

                        {technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {technologies.map((technology, i) => (
                              <span
                                key={`${technology}-${i}`}
                                className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                              >
                                {typeof technology === "string"
                                  ? technology
                                  : technology?.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {(githubUrl || liveUrl) && (
                          <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-3">
                            {githubUrl && (
                              <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
                              >
                                <FaLinkedin size={15} /> Source code
                                <ArrowUpRight size={13} />
                              </a>
                            )}
                            {liveUrl && (
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
                              >
                                <ExternalLink size={14} /> Live project
                                <ArrowUpRight size={13} />
                              </a>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty>No portfolio projects have been added.</Empty>
              )}
            </Card>

            {/* Education */}
            <Card>
              <SectionTitle
                icon={GraduationCap}
                title="Education"
                count={education.length}
              />

              {education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((item, index) => (
                    <article
                      key={item._id || index}
                      className="flex gap-3 rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <GraduationCap size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900">
                          {item.degree || "Degree not specified"}
                        </h3>
                        {item.field && (
                          <p className="mt-1 text-sm text-slate-600">
                            {item.field}
                          </p>
                        )}
                        <p className="mt-1.5 text-sm text-slate-500">
                          {item.institute ||
                            item.university ||
                            item.school ||
                            "Institution not specified"}
                        </p>
                        {(item.startYear || item.endYear || item.graduationYear) && (
                          <p className="mt-2 text-xs text-slate-400">
                            {item.startYear || "—"} –{" "}
                            {item.endYear || item.graduationYear || "Present"}
                          </p>
                        )}
                        {item.grade != null && item.grade !== "" && (
                          <span className="mt-2 inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            Grade: {item.grade}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty>No education details have been added.</Empty>
              )}
            </Card>
          </div>

          {/* Recruiter sidebar */}
          <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
            <Card>
              <SectionTitle icon={Mail} title="Contact information" />

              <div className="space-y-5">
                <InfoRow icon={Mail} label="Email address">
                  {candidate.email ? (
                    <a
                      href={`mailto:${candidate.email}`}
                      className="hover:text-violet-700"
                    >
                      {candidate.email}
                    </a>
                  ) : "Not provided"}
                </InfoRow>

                <InfoRow icon={Phone} label="Phone number">
                  {candidate.phoneNo ? (
                    <a
                      href={`tel:${candidate.phoneNo}`}
                      className="hover:text-violet-700"
                    >
                      {candidate.phoneNo}
                    </a>
                  ) : "Not provided"}
                </InfoRow>

                <InfoRow icon={MapPin} label="Location">
                  {city || "Not provided"}
                </InfoRow>
              </div>

              {socialItems.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Online presence
                  </p>
                  <div className="space-y-2">
                    {socialItems.map(({ label, url, Icon }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={16} />
                          {label}
                        </span>
                        <ArrowUpRight size={15} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle icon={BriefcaseBusiness} title="Job preferences" />

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Availability
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    {preferences.lookingForJob === true
                      ? "Open to opportunities"
                      : preferences.lookingForJob === false
                        ? "Not currently looking"
                        : "Not specified"}
                  </p>
                </div>

                {Array.isArray(preferences.preferredJobType) &&
                  preferences.preferredJobType.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Preferred employment
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {preferences.preferredJobType.map((type, index) => (
                          <span
                            key={`${type}-${index}`}
                            className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold capitalize text-violet-700"
                          >
                            {String(type).replaceAll("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {preferences.workMode && (
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Preferred work mode
                    </p>
                    <p className="mt-1.5 text-sm font-semibold capitalize text-slate-800">
                      {String(preferences.workMode).replaceAll("-", " ")}
                    </p>
                  </div>
                )}

                {(salaryMin || salaryMax) && (
                  <div className="rounded-xl bg-violet-50/70 p-4">
                    <p className="text-xs font-medium text-violet-700">
                      Expected salary
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Wallet size={18} className="shrink-0 text-violet-700" />
                      <p className="text-sm font-bold text-slate-900">
                        {salaryMin && salaryMax
                          ? `${currency} ${salaryMin} – ${salaryMax}`
                          : `${currency} ${salaryMin || salaryMax}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Clock3} title="Profile details" />

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Account status
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        candidate.isVerified ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {candidate.isVerified ? "Verified" : "Not verified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Account role
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    {text(candidate.role, "User")}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Member since
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    {formatDate(candidate.createdAt) || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Last profile update
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    {formatDate(profile.updatedAt) || "Not provided"}
                  </p>
                </div>
              </div>

              {completion !== null && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Profile completion
                    </span>
                    <span className="text-sm font-bold text-violet-700">
                      {completion}%
                    </span>
                  </div>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-valuenow={completion}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Profile completion"
                  >
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-5">
          <p className="text-xs text-slate-400">
            Peer.Hiring · Recruiter workspace
          </p>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
          >
            <ArrowLeft size={16} />
            Back to applications
          </button>
        </footer>
      </main>
    </div>
  );
};

export default CandidateProfile;