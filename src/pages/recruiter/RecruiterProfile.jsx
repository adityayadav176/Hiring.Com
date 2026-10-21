import { FaLinkedin } from 'react-icons/fa';
import React, { useEffect, useState } from "react";
import {useAuth, useCompany, useProfile} from "../../hooks/Hook"
import {

  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const initialRecruiter = {
  name: "Aarav Sharma",
  title: "Senior Technical Recruiter",
  email: "aarav.sharma@novatech.io",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  department: "Talent Acquisition",
  experience: "6+ years",
  bio: "I help ambitious technology teams connect with exceptional people. I specialize in engineering, product, and leadership hiring, building thoughtful candidate experiences and long-term professional relationships.",
  linkedin: "https://www.linkedin.com/",
  website: "https://example.com",
};

const initialCompany = {
  name: "NovaTech Solutions",
  tagline: "Building technology that moves businesses forward.",
  industry: "Software Development",
  size: "201–500 employees",
  founded: "2016",
  website: "https://example.com",
  location: "Bengaluru, Karnataka, India",
  email: "careers@example.com",
  about:
    "NovaTech Solutions builds modern digital products and scalable software platforms for businesses around the world. Our teams bring together engineers, designers, and product thinkers who enjoy solving meaningful problems.",
  verified: true,
};

const Metrics = [
  {
    label: "Open positions",
    value: "12",
    note: "Across our teams",
    icon: BriefcaseBusiness,
  },
  {
    label: "Candidates engaged",
    value: "248",
    note: "This hiring cycle",
    icon: Users,
  },
  {
    label: "Interviews coordinated",
    value: "36",
    note: "Across active roles",
    icon: CalendarDays,
  },
  {
    label: "Successful hires",
    value: "18",
    note: "Sample hiring data",
    icon: CheckCircle2,
  },
];

const specialties = [
  "Software Engineering",
  "Full-Stack Development",
  "Backend Engineering",
  "Product Management",
  "Cloud & DevOps",
  "Data & AI",
];

const hiringTeams = [
  { name: "Engineering", count: "08 roles", initials: "EN" },
  { name: "Product & Design", count: "02 roles", initials: "PD" },
  { name: "Data & Analytics", count: "02 roles", initials: "DA" },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "R"
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
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

function InfoRow({ icon: Icon, label, value, href }) {
  const content = value || "Not provided";

  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/80">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        {href && value ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-semibold text-slate-800 transition hover:text-violet-700"
          >
            {content}
            <ArrowUpRight size={13} className="shrink-0 text-violet-500" />
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {content}
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
}) {
  const shared =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          className={cx(shared, "resize-y leading-6")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          className={shared}
        />
      )}
    </label>
  );
}

export default function RecruiterProfile() {
  const [draftCompany, setDraftCompany] = useState(initialCompany);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("recruiter");
  const [notice, setNotice] = useState("");

  const {recruiter, setRecruiter, changeName, handleUpdateAvatar} = useAuth();
  const {profile, setProfile, handleGetMyProfile, handleUpdateProfile} = useProfile();
  const {company, setCompany, handleGetMyCompany, handleUpdateCompanyLogo, handleUpdateCompany} = useCompany();

  const updateRecruiter = (key, value) => {
    setDraftRecruiter((current) => ({ ...current, [key]: value }));
  };

  const updateCompany = (key, value) => {
    setDraftCompany((current) => ({ ...current, [key]: value }));
  };

  const startEditing = () => {
    setDraftRecruiter({ ...recruiter });
    setDraftCompany({ ...company });
    setActiveTab("recruiter");
    setNotice("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setRecruiter({ ...recruiter });
    setCompany({ ...company });
    setEditing(false);
    setNotice("Your profile changes have been applied to this preview.");
  };

  const completenessFields = [
    recruiter.name,
    profile.title,
    recruiter.email,
    recruiter.phone,
    recruiter.location,
    recruiter.bio,
    recruiter.linkedin,
    company.name,
    company.industry,
    company.website,
  ];

  const completeness = Math.round(
    (completenessFields.filter((value) => String(value || "").trim()).length /
      completenessFields.length) *
      100
  );

  return (
    <main className="min-h-screen bg-[#F6F7FB] text-slate-900">
      <div className="mx-auto max-w-[1460px] px-4 py-5 sm:px-6 lg:px-9 lg:py-8">
        {/* Page navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2.5 flex items-center gap-2 text-xs font-medium text-slate-400">
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
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
              className="ml-auto rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Premium profile hero */}
        <Panel className="overflow-hidden">
          <div className="relative h-36 overflow-hidden bg-[#24104D] sm:h-44 lg:h-52">
            <div className="absolute inset-0 bg-gradient-to-r from-[#24104D] via-[#4C1D95] to-[#7C3AED]" />
            <div className="absolute -right-12 -top-36 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-1 top-[-92px] h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute right-[22%] top-10 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
            <div className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm sm:left-8 sm:top-7">
              <Sparkles size={13} />
              Professional profile
            </div>
            <div className="absolute bottom-5 right-6 hidden items-center gap-2 text-xs font-medium text-white/75 sm:flex">
              <ShieldCheck size={15} />
              Recruiter workspace
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-11 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                <div className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[25px] border-[5px] border-white bg-gradient-to-br from-violet-100 to-indigo-100 text-2xl font-extrabold tracking-wide text-violet-800 shadow-lg sm:h-[108px] sm:w-[108px] sm:rounded-[28px] sm:text-3xl">
                  {initials(recruiter.name)}
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 sm:bottom-1.5 sm:right-1.5">
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </span>
                </div>

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">
                      {recruiter.name}
                    </h2>
                    {company.verified && (
                      <span
                        title="Sample verification status"
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100"
                      >
                        <BadgeCheck size={13} />
                        Verified company
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-violet-700 sm:text-[15px]">
                    {recruiter.title}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={14} className="text-slate-400" />
                      {company.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      {recruiter.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness size={14} className="text-slate-400" />
                      {recruiter.experience} experience
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 pb-1">
                <a
                  href={`mailto:${recruiter.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Mail size={14} />
                  Contact recruiter
                </a>
                <a
                  href={recruiter.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  aria-label="Open LinkedIn"
                >
                  <FaLinkedin size={16} />
                </a>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="max-w-4xl text-sm leading-7 text-slate-600">
                {recruiter.bio}
              </p>
            </div>
          </div>
        </Panel>

        {/* Overview metrics: illustrative sample data */}
        <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Metrics.map(({ label, value, note, icon: Icon }, index) => (
            <Panel
              key={label}
              className="group p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {value}
                  </p>
                </div>
                <div
                  className={cx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    index === 0
                      ? "bg-violet-50 text-violet-700"
                      : index === 1
                        ? "bg-blue-50 text-blue-700"
                        : index === 2
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                <ArrowDownRight size={13} />
                {note}
              </div>
            </Panel>
          ))}
        </div>

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
          <div className="space-y-5">
            {/* Recruiter details */}
            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Personal details"
                title="About the recruiter"
                description="Professional information and ways to connect."
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

              <div className="mt-4 grid grid-cols-1 gap-x-7 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={Mail}
                    label="Work email"
                    value={recruiter.email}
                    href={`mailto:${recruiter.email}`}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Contact number"
                    value={recruiter.phone}
                    href={`tel:${recruiter.phone}`}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={recruiter.location}
                  />
                </div>
                <div className="divide-y divide-slate-100">
                  <InfoRow
                    icon={BriefcaseBusiness}
                    label="Current position"
                    value={recruiter.title}
                  />
                  <InfoRow
                    icon={Users}
                    label="Department"
                    value={recruiter.department}
                  />
                  <InfoRow
                    icon={Clock3}
                    label="Recruiting experience"
                    value={recruiter.experience}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#F8F7FF] p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                    <Sparkles size={15} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Recruiting philosophy
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Great hiring starts with listening. My focus is to make
                  recruitment transparent, respectful, and efficient for both
                  candidates and hiring teams—from the first conversation to
                  the final decision.
                </p>
              </div>
            </Panel>

            {/* Hiring expertise */}
            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Areas of expertise"
                title="Hiring specializations"
                description="The talent areas this recruiter focuses on."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/70 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:border-violet-200 hover:bg-violet-100"
                  >
                    <CheckCircle2 size={13} className="text-violet-500" />
                    {specialty}
                  </span>
                ))}
              </div>
            </Panel>

            {/* Professional links */}
            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Online presence"
                title="Professional links"
                description="Explore the recruiter's public professional presence."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={recruiter.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0A66C2]">
                    <FaLinkedin size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">
                      LinkedIn
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      Professional network
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-slate-400 transition group-hover:text-violet-700"
                  />
                </a>
                <a
                  href={recruiter.website}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Globe2 size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">
                      Professional website
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      Personal or portfolio site
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-slate-400 transition group-hover:text-violet-700"
                  />
                </a>
              </div>
            </Panel>
          </div>

          {/* Company and profile sidebar */}
          <aside className="space-y-5">
            <Panel className="overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-violet-700 via-violet-500 to-indigo-400" />
              <div className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Organization"
                  title="Company profile"
                  description="The organization behind this recruiter."
                  action={
                    company.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                    ) : null
                  }
                />

                <div className="mt-5 flex items-center gap-3.5">
                  <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-600 text-white shadow-md shadow-violet-200/60">
                    <Building2 size={26} strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-slate-900">
                      {company.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-violet-700">
                      {company.industry}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Est. {company.founded}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {company.tagline}
                </p>

                <div className="mt-4 space-y-0 divide-y divide-slate-100 border-y border-slate-100 py-1">
                  <InfoRow
                    icon={Building2}
                    label="Company size"
                    value={company.size}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Headquarters"
                    value={company.location}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Careers contact"
                    value={company.email}
                    href={`mailto:${company.email}`}
                  />
                  <InfoRow
                    icon={Globe2}
                    label="Company website"
                    value={company.website}
                    href={company.website}
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    About the company
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {company.about}
                  </p>
                </div>

                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                >
                  Visit company website
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </Panel>

            {/* Hiring teams */}
            <Panel className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Hiring overview"
                title="Teams we hire for"
                description="Illustrative distribution of current openings."
              />
              <div className="mt-5 space-y-3">
                {hiringTeams.map((team, index) => (
                  <div
                    key={team.name}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-violet-100 hover:bg-violet-50/40"
                  >
                    <div
                      className={cx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                        index === 0
                          ? "bg-violet-100 text-violet-700"
                          : index === 1
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {team.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {team.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Hiring department
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      {team.count}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Profile completeness */}
            <Panel className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Profile completeness
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A complete profile helps candidates understand who they’re
                    connecting with.
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[4px] border-violet-100 bg-white text-xs font-extrabold text-violet-700">
                  {completeness}%
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-700 to-indigo-500 transition-all duration-500"
                  style={{ width: `${completeness}%` }}
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
            if (event.target === event.currentTarget) cancelEditing();
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
                    Profile settings
                  </div>
                  <h2
                    id="edit-recruiter-title"
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                  >
                    Edit your profile
                  </h2>
                  <p className="mt-1.5 text-sm leading-5 text-white/65">
                    Update your recruiter identity and company information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={cancelEditing}
                  aria-label="Close edit profile"
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="border-b border-slate-200 px-4 pt-3 sm:px-7">
              <div className="flex gap-5">
                {[
                  { id: "recruiter", label: "Recruiter details", icon: Users },
                  { id: "company", label: "Company details", icon: Building2 },
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
                        Personal information
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        These details represent you across the hiring
                        workspace.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Full name"
                        value={draftRecruiter.name}
                        onChange={(v) => updateRecruiter("name", v)}
                      />
                      <FormField
                        label="Professional title"
                        value={draftRecruiter.title}
                        onChange={(v) => updateRecruiter("title", v)}
                      />
                      <FormField
                        label="Work email"
                        type="email"
                        value={draftRecruiter.email}
                        onChange={(v) => updateRecruiter("email", v)}
                      />
                      <FormField
                        label="Phone number"
                        value={draftRecruiter.phone}
                        onChange={(v) => updateRecruiter("phone", v)}
                      />
                      <FormField
                        label="Location"
                        value={draftRecruiter.location}
                        onChange={(v) => updateRecruiter("location", v)}
                      />
                      <FormField
                        label="Department"
                        value={draftRecruiter.department}
                        onChange={(v) => updateRecruiter("department", v)}
                      />
                      <FormField
                        label="Recruiting experience"
                        value={draftRecruiter.experience}
                        onChange={(v) => updateRecruiter("experience", v)}
                      />
                      <FormField
                        label="LinkedIn URL"
                        value={draftRecruiter.linkedin}
                        onChange={(v) => updateRecruiter("linkedin", v)}
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Professional website"
                          value={draftRecruiter.website}
                          onChange={(v) => updateRecruiter("website", v)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FormField
                          label="Professional bio"
                          value={draftRecruiter.bio}
                          onChange={(v) => updateRecruiter("bio", v)}
                          multiline
                        />
                        <p className="mt-1 text-right text-[10px] text-slate-400">
                          {draftRecruiter.bio.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Organization information
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Keep your company profile accurate and useful to
                        candidates.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Company name"
                        value={draftCompany.name}
                        onChange={(v) => updateCompany("name", v)}
                      />
                      <FormField
                        label="Industry"
                        value={draftCompany.industry}
                        onChange={(v) => updateCompany("industry", v)}
                      />
                      <FormField
                        label="Company size"
                        value={draftCompany.size}
                        onChange={(v) => updateCompany("size", v)}
                      />
                      <FormField
                        label="Year founded"
                        value={draftCompany.founded}
                        onChange={(v) => updateCompany("founded", v)}
                      />
                      <FormField
                        label="Office location"
                        value={draftCompany.location}
                        onChange={(v) => updateCompany("location", v)}
                      />
                      <FormField
                        label="Careers email"
                        type="email"
                        value={draftCompany.email}
                        onChange={(v) => updateCompany("email", v)}
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Company website"
                          value={draftCompany.website}
                          onChange={(v) => updateCompany("website", v)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FormField
                          label="Company tagline"
                          value={draftCompany.tagline}
                          onChange={(v) => updateCompany("tagline", v)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FormField
                          label="About the company"
                          value={draftCompany.about}
                          onChange={(v) => updateCompany("about", v)}
                          multiline
                        />
                      </div>
                    </div>
                  </>
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
                  onClick={cancelEditing}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                {activeTab === "recruiter" ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("company")}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-800"
                  >
                    Next: Company
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="edit-recruiter-form"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800"
                  >
                    <Save size={14} />
                    Save changes
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
