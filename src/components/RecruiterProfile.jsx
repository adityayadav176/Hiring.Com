
import React, { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FaLinkedin } from "react-icons/fa";
const initialProfile = {
  name: "Alex Morgan",
  title: "Senior Technical Recruiter",
  email: "alex.morgan@company.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, India",
  department: "Talent Acquisition",
  bio: "Helping exceptional people find opportunities where they can do their best work. Focused on engineering, product, and technology hiring.",
  linkedin: "https://linkedin.com",
  website: "https://example.com",
};

const initialCompany = {
  name: "Acme Technologies",
  industry: "Information Technology",
  size: "201–500 employees",
  website: "https://example.com",
  location: "Bengaluru, India",
  verified: true,
};

const metrics = [
  {
    label: "Active jobs",
    value: "12",
    detail: "Currently published",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    value: "248",
    detail: "Across your job listings",
    icon: FileText,
  },
  {
    label: "Interviews",
    value: "36",
    detail: "Scheduled and completed",
    icon: CalendarDays,
  },
  {
    label: "Successful hires",
    value: "18",
    detail: "Candidates hired",
    icon: CheckCircle2,
  },
];

function SectionHeading({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, href }) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3.5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            {value}
            <ExternalLink size={12} className="shrink-0" />
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || label}
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
      />
    </label>
  );
}

export default function RecruiterProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [company] = useState(initialCompany);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);
  const [notice, setNotice] = useState("");

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const startEditing = () => {
    setDraft(profile);
    setNotice("");
    setEditing(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setNotice("Profile updated in this session.");
  };

  const cancelEditing = () => {
    setDraft(profile);
    setEditing(false);
  };

  const initials = (profile.name || "R")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page heading */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="text-slate-700">My profile</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              My profile
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your professional identity and the information candidates
              see when interacting with your hiring team.
            </p>
          </div>

          {!editing ? (
            <button
              onClick={startEditing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
            >
              <Pencil size={15} />
              Edit profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEditing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X size={15} />
                Cancel
              </button>
              <button
                form="recruiter-profile-form"
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
              >
                <Save size={15} />
                Save changes
              </button>
            </div>
          )}
        </div>

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            <CheckCircle2 size={17} />
            {notice}
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="ml-auto rounded p-1 hover:bg-emerald-100"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Profile header */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-violet-700" />
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-2xl font-bold tracking-wide text-violet-800 sm:h-[88px] sm:w-[88px]">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                    {profile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 size={12} />
                    Active
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {profile.title}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={14} />
                    {company.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
              {company.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Company verified
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Recruiting metrics */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                  <Icon size={19} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{detail}</p>
            </div>
          ))}
        </section>

        {/* Main content */}
        <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <div className="space-y-5">
            {/* Personal information */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading
                title="Personal information"
                description="Your professional contact details and public profile."
                action={
                  !editing && (
                    <button
                      onClick={startEditing}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                  )
                }
              />

              {editing ? (
                <form
                  id="recruiter-profile-form"
                  onSubmit={saveProfile}
                  className="mt-6 space-y-5"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={draft.name}
                      onChange={(value) => updateDraft("name", value)}
                    />
                    <Field
                      label="Professional title"
                      value={draft.title}
                      onChange={(value) => updateDraft("title", value)}
                    />
                    <Field
                      label="Email address"
                      type="email"
                      value={draft.email}
                      onChange={(value) => updateDraft("email", value)}
                    />
                    <Field
                      label="Phone number"
                      value={draft.phone}
                      onChange={(value) => updateDraft("phone", value)}
                    />
                    <Field
                      label="Location"
                      value={draft.location}
                      onChange={(value) => updateDraft("location", value)}
                    />
                    <Field
                      label="Department"
                      value={draft.department}
                      onChange={(value) => updateDraft("department", value)}
                    />
                    <Field
                      label="LinkedIn URL"
                      value={draft.linkedin}
                      onChange={(value) => updateDraft("linkedin", value)}
                    />
                    <Field
                      label="Professional website"
                      value={draft.website}
                      onChange={(value) => updateDraft("website", value)}
                    />
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Professional bio
                    </span>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={draft.bio}
                      onChange={(event) =>
                        updateDraft("bio", event.target.value)
                      }
                      placeholder="Tell candidates about your recruiting focus..."
                      className="w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    />
                    <span className="mt-1 block text-right text-xs text-slate-400">
                      {draft.bio.length}/1000
                    </span>
                  </label>
                </form>
              ) : (
                <>
                  <div className="mt-5 grid grid-cols-1 gap-x-8 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
                    <div className="divide-y divide-slate-100">
                      <DetailItem
                        icon={UserRound}
                        label="Full name"
                        value={profile.name}
                      />
                      <DetailItem
                        icon={BriefcaseBusiness}
                        label="Professional title"
                        value={profile.title}
                      />
                      <DetailItem
                        icon={Mail}
                        label="Email address"
                        value={profile.email}
                        href={`mailto:${profile.email}`}
                      />
                    </div>
                    <div className="divide-y divide-slate-100">
                      <DetailItem
                        icon={Phone}
                        label="Phone number"
                        value={profile.phone}
                        href={`tel:${profile.phone}`}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Location"
                        value={profile.location}
                      />
                      <DetailItem
                        icon={Building2}
                        label="Department"
                        value={profile.department}
                      />
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-100 pt-5">
                    <h3 className="text-sm font-semibold text-slate-800">
                      About
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {profile.bio || "No professional bio added yet."}
                    </p>
                  </div>
                </>
              )}
            </section>

            {/* Professional links */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading
                title="Professional links"
                description="External links associated with your professional identity."
              />
              <div className="mt-5 divide-y divide-slate-100">
                <div className="flex items-center gap-3 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                    <FaLinkedin size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      LinkedIn
                    </p>
                    {editing ? (
                      <input
                        value={draft.linkedin}
                        onChange={(event) =>
                          updateDraft("linkedin", event.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-500"
                      />
                    ) : (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {profile.linkedin || "Not added"}
                      </p>
                    )}
                  </div>
                  {!editing && profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open LinkedIn profile"
                      className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-700"
                    >
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                    <Globe size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Professional website
                    </p>
                    {editing ? (
                      <input
                        value={draft.website}
                        onChange={(event) =>
                          updateDraft("website", event.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-500"
                      />
                    ) : (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {profile.website || "Not added"}
                      </p>
                    )}
                  </div>
                  {!editing && profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open professional website"
                      className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-700"
                    >
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Company sidebar */}
          <aside className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading
                title="Company affiliation"
                description="Your current recruiting organization."
              />

              <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                  <Building2 size={23} strokeWidth={1.7} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {company.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {company.industry}
                  </p>
                </div>
                {company.verified && (
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-emerald-600"
                  />
                )}
              </div>

              <div className="mt-3 divide-y divide-slate-100">
                <DetailItem
                  icon={Building2}
                  label="Company size"
                  value={company.size}
                />
                <DetailItem
                  icon={MapPin}
                  label="Office location"
                  value={company.location}
                />
                <DetailItem
                  icon={Globe}
                  label="Company website"
                  value={company.website}
                  href={company.website}
                />
              </div>

              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/70 p-3.5">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Verified organization
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    {company.verified
                      ? "This organization is marked as verified in the demo data."
                      : "This organization has not been verified."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading
                title="Recruiting activity"
                description="A quick overview of your workspace."
              />
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <BriefcaseBusiness size={17} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Job management
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Review your published openings and manage job listings.
                    </p>
                  </div>
                  <Clock3 size={15} className="mt-1 text-slate-400" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <CalendarDays size={17} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Interview coordination
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Keep candidate interviews and hiring stages organized.
                    </p>
                  </div>
                  <Clock3 size={15} className="mt-1 text-slate-400" />
                </div>
              </div>
            </section>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Check size={14} className="text-emerald-600" />
                Profile information
                <span className="ml-auto font-medium text-slate-700">
                  {profile.name && profile.title && profile.email ? "Complete" : "Incomplete"}
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-700 transition-all"
                  style={{
                    width: `${
                      [
                        profile.name,
                        profile.title,
                        profile.email,
                        profile.phone,
                        profile.location,
                        profile.bio,
                      ].filter(Boolean).length / 6 * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400">
          <span>Peer.Hiring · Recruiter workspace</span>
          <span>Profile information and company affiliation</span>
        </footer>
      </div>
    </main>
  );
}
