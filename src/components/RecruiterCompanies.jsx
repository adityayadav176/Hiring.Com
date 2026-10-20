
import React, { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  Search,
  Users,
  BriefcaseBusiness,
  FileCheck2,
  Globe,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  Pencil,
  Settings2,
  ExternalLink,
  Upload,
  X,
  ChevronRight,
  Sparkles,
  LockKeyhole,
  Eye,
  Copy,
  LoaderCircle,
} from "lucide-react";

const ACCENT = "#6D28D9";

const EMPTY_COMPANY = {
  name: "",
  industry: "",
  website: "",
  email: "",
  phone: "",
  size: "",
  foundedYear: "",
  location: "",
  description: "",
};

const STATUS_CONFIG = {
  pending: {
    label: "Under review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  approved: {
    label: "Verified",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  rejected: {
    label: "Needs attention",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  unverified: {
    label: "Not verified",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

function normalizeStatus(company) {
  if (!company) return "unverified";

  if (company.isBlocked || company.isDeleted) return "rejected";

  const status = String(company.verificationStatus || "").toLowerCase();

  if (
    company.isVerified === true || status === "verified"
  ) {
    return "approved";
  }

  if (
    status === "rejected"
  ) {
    return "rejected";
  }

  if (
    status === "pending"
  ) {
    return "pending";
  }

  return "unverified";
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unverified;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {status === "approved" ? (
        <CheckCircle2 size={13} />
      ) : status === "pending" ? (
        <Clock3 size={13} />
      ) : status === "rejected" ? (
        <AlertCircle size={13} />
      ) : (
        <ShieldCheck size={13} />
      )}
      {config.label}
    </span>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Metric({ icon: Icon, label, value, caption, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{caption}</p>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-400">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Hero({ children, title, description }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#24104F] via-[#5125A5] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8 lg:p-9">
      <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="relative max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
          <Sparkles size={14} /> Peer.Hiring company workspace
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/90">
          {description}
        </p>
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

function CompanyRegistration({ onSubmit, busy, error, initialValues }) {
  const [form, setForm] = useState({
    ...EMPTY_COMPANY,
    ...(initialValues || {}),
  });

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  function submit(event) {
    event.preventDefault();
    onSubmit?.(form);
  }

  return (
    <div className="space-y-7">
      <Hero
        title="Let's put your company on the map."
        description="Create your company profile to start building your team, managing applicants, and organizing interviews on Peer.Hiring."
      >
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold">
          <ShieldCheck size={17} /> Verification helps build trust
        </div>
      </Hero>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_320px]">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">
              Register your company
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter accurate information. Required fields are marked with *.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company name *">
              <input
                required
                maxLength={150}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Acme Technologies"
                className={inputClass}
              />
            </Field>

            <Field label="Industry *">
              <select
                required
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                className={inputClass}
              >
                <option value="">Select industry</option>
                <option>Information Technology</option>
                <option>Software Development</option>
                <option>AI & Data Science</option>
                <option>Finance & Banking</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>E-commerce</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Official company email *">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="careers@company.com"
                className={inputClass}
              />
            </Field>

            <Field label="Company website">
              <input
                type="url"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://company.com"
                className={inputClass}
              />
            </Field>

            <Field label="Contact phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="Company contact number"
                className={inputClass}
              />
            </Field>

            <Field label="Company size">
              <select
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                className={inputClass}
              >
                <option value="">Select team size</option>
                <option>1–10 employees</option>
                <option>11–50 employees</option>
                <option>51–200 employees</option>
                <option>201–500 employees</option>
                <option>501–1000 employees</option>
                <option>1000+ employees</option>
              </select>
            </Field>

            <Field label="Headquarters location *">
              <input
                required
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="City, country"
                className={inputClass}
              />
            </Field>

            <Field label="Year founded">
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={form.foundedYear}
                onChange={(e) => set("foundedYear", e.target.value)}
                placeholder="e.g. 2020"
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="About your company *">
                <textarea
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tell candidates what your company does, your mission, and the people you are looking to hire."
                  className={inputClass + " resize-y"}
                />
              </Field>
              <p className="mt-1.5 text-right text-xs text-slate-400">
                {form.description.length}/2000
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole size={18} className="mt-0.5 shrink-0 text-violet-700" />
              <div>
                <p className="text-sm font-bold text-violet-950">
                  Company verification
                </p>
                <p className="mt-1 text-xs leading-5 text-violet-800">
                  Submitting your profile does not automatically verify your
                  company. The platform's authorized review process determines
                  the verification status.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {busy ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {busy ? "Submitting..." : "Submit company profile"}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <ShieldCheck size={22} />
            </div>
            <h3 className="mt-4 font-bold text-slate-900">
              What happens next?
            </h3>
            <div className="mt-5 space-y-5">
              {[
                ["01", "Submit details", "Tell us about your company."],
                ["02", "Review process", "The authorized team reviews your submission."],
                ["03", "Get an update", "Check this page for the latest status."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700">
                    {number}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileCheck2 size={17} className="text-violet-700" />
              Before submitting
            </div>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 text-slate-500">
              <li>• Use accurate company information.</li>
              <li>• Provide a working official email.</li>
              <li>• Make sure you are authorized to represent the company.</li>
              <li>• Keep supporting documents ready if requested.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PendingReview({ company, status, onRefresh, onEdit, busy }) {
  const rejected = status === "rejected";
  const steps = [
    {
      title: "Company profile submitted",
      description: "Your company details have been received.",
      done: true,
    },
    {
      title: rejected ? "Additional information required" : "Verification review",
      description: rejected
        ? company.rejectionReason ||
          company.reviewNotes ||
          "Please review the feedback from the authorized review team."
        : "The authorized team will review the information provided.",
      done: false,
    },
    {
      title: "Company workspace access",
      description: rejected
        ? "Address the feedback and follow the available resubmission process."
        : "Access depends on the platform's verification and permission rules.",
      done: false,
    },
  ];

  return (
    <div className="space-y-7">
      <Hero
        title={
          rejected
            ? "Let's get your company profile back on track."
            : "Good things take a little review."
        }
        description={
          rejected
            ? "Your company needs additional attention before it can be verified. Review the feedback below and follow the available next steps."
            : "Your company profile has been submitted. You can check the current review status here while the verification process is underway."
        }
      >
        <StatusBadge status={status} />
        <button
          onClick={onRefresh}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
        >
          <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
          Refresh status
        </button>
      </Hero>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
              rejected ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
            }`}>
              {rejected ? <AlertCircle size={30} /> : <Clock3 size={30} />}
            </div>
            <div className="flex-1">
              <StatusBadge status={status} />
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {company.name || "Your company"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {company.industry || "Company profile"}{" "}
                {company.location ? `· ${company.location}` : ""}
              </p>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} /> Review details
              </button>
            )}
          </div>

          <div className={`mt-6 rounded-xl border p-4 ${
            rejected
              ? "border-rose-200 bg-rose-50"
              : "border-amber-200 bg-amber-50"
          }`}>
            <p className={`text-sm font-bold ${rejected ? "text-rose-900" : "text-amber-900"}`}>
              {rejected ? "Action may be required" : "Your profile is being reviewed"}
            </p>
            <p className={`mt-1.5 text-sm leading-6 ${rejected ? "text-rose-800" : "text-amber-800"}`}>
              {rejected
                ? company.rejectionReason ||
                  company.reviewNotes ||
                  "Check the review feedback and contact platform support if you need clarification."
                : "You do not need to submit another company profile while this submission is pending. Refresh to check for a status update."}
            </p>
          </div>

          <h3 className="mt-8 font-bold text-slate-900">Verification progress</h3>
          <div className="mt-5 space-y-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-4">
                {index < steps.length - 1 && (
                  <div className="absolute left-4 top-9 h-[calc(100%+8px)] w-px bg-slate-200" />
                )}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-emerald-100 text-emerald-700"
                    : rejected && index === 1
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {step.done ? <CheckCircle2 size={17} /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-slate-800">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h3 className="font-bold text-slate-900">Submitted company details</h3>
            <div className="mt-4 space-y-4">
              {[
                [Building2, "Company", company.name],
                [Globe, "Website", company.website],
                [Mail, "Email", company.email],
                [MapPin, "Location", company.location],
              ].filter((item) => item[2]).map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={16} className="mt-0.5 shrink-0 text-violet-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <LockKeyhole size={17} className="text-violet-700" />
              Access and security
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Verification and account permissions are controlled by the
              platform. This page does not grant company approval.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CompanyDashboard({
  company,
  onEdit,
  onRefresh,
  onManageRecruiters,
  onManageJobs,
  onSettings,
  busy,
}) {
  const status = normalizeStatus(company);
  const name = company.name || "Your company";
  const recruiters = Array.isArray(company.recruiters)
    ? company.recruiters
    : [];
  const jobs = company.stats?.jobs ?? company.jobCount ?? 0;
  const applicants = company.stats?.applications ?? company.applicationCount ?? 0;
  const interviews = company.stats?.interviews ?? company.interviewCount ?? 0;

  const details = [
    [Globe, "Website", company.website],
    [Mail, "Company email", company.email],
    [Phone, "Phone", company.phone],
    [MapPin, "Headquarters", company.location],
    [Users, "Company size", company.size],
    [CalendarDays, "Founded", company.foundedYear],
  ].filter((item) => item[2] !== undefined && item[2] !== null && item[2] !== "");

  return (
    <div className="space-y-7">
      <Hero
        title={`Welcome to ${name}.`}
        description="Your company workspace is where you can manage your organization profile, coordinate recruiters, and keep hiring moving."
      >
        <StatusBadge status={status} />
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 hover:bg-violet-50"
        >
          <Pencil size={16} /> Edit company profile
        </button>
        <button
          onClick={onSettings}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
        >
          <Settings2 size={16} /> Settings
        </button>
      </Hero>

      {status !== "approved" && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${
          status === "rejected"
            ? "border-rose-200 bg-rose-50"
            : status === "pending"
            ? "border-amber-200 bg-amber-50"
            : "border-slate-200 bg-white"
        }`}>
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">
              {status === "pending"
                ? "Company verification is pending"
                : status === "rejected"
                ? "Company verification needs attention"
                : "Company verification is incomplete"}
            </p>
            <p className="mt-1 text-sm leading-6">
              Check your verification status. Some company features may be
              restricted until the required verification is complete.
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold hover:bg-white/70 disabled:opacity-60"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Job openings" value={jobs} caption="Company job listings" tone="bg-violet-50 text-violet-700" />
        <Metric icon={Users} label="Applications" value={applicants} caption="Applications across jobs" tone="bg-blue-50 text-blue-700" />
        <Metric icon={CalendarDays} label="Interviews" value={interviews} caption="Interview records" tone="bg-amber-50 text-amber-700" />
        <Metric icon={ShieldCheck} label="Recruiters" value={recruiters.length} caption="Recruiters listed on company" tone="bg-emerald-50 text-emerald-700" />
      </section>

      <SectionHeading
        eyebrow="Company management"
        title="Your workspace"
        description="Quick access to the tools that help your team hire."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            icon: Building2,
            title: "Company profile",
            description: "Keep your company information accurate and up to date.",
            action: "Edit profile",
            click: onEdit,
            tone: "bg-violet-50 text-violet-700",
          },
          {
            icon: Users,
            title: "Recruiter access",
            description: "Review recruiter access and team membership.",
            action: "Manage team",
            click: onManageRecruiters,
            tone: "bg-blue-50 text-blue-700",
          },
          {
            icon: BriefcaseBusiness,
            title: "Job openings",
            description: "Review your job listings and hiring activity.",
            action: "Manage jobs",
            click: onManageJobs,
            tone: "bg-emerald-50 text-emerald-700",
          },
        ].map(({ icon: Icon, title, description, action, click, tone }) => (
          <button
            key={title}
            onClick={click}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/40 sm:p-6"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
              <Icon size={22} />
            </div>
            <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700">
              {action}
              <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Company information</h2>
              <p className="mt-1 text-sm text-slate-500">Your organization at a glance.</p>
            </div>
            <button
              onClick={onEdit}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
              aria-label="Edit company details"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {details.length ? details.map(([Icon, label, value]) => (
              <div key={label} className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">
                Add company details to complete your profile.
              </p>
            )}
          </div>

          {company.description && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About the company</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{company.description}</p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Recruiter team</h2>
              <p className="mt-1 text-sm text-slate-500">People associated with your company.</p>
            </div>
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
              <Users size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recruiters.slice(0, 5).map((person, index) => {
              const displayName =
                typeof person === "string"
                  ? person
                  : person.name || person.email || "Recruiter";

              return (
                <div key={person._id || person.id || index} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                    {displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{displayName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {typeof person === "object" ? person.email || "Company recruiter" : "Company recruiter"}
                    </p>
                  </div>
                </div>
              );
            })}

            {!recruiters.length && (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                <Users size={23} className="mx-auto text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-800">No team members to display</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Recruiter membership will appear here when available from your backend.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onManageRecruiters}
            className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            Manage recruiter team <ChevronRight size={17} />
          </button>
        </section>
      </div>
    </div>
  );
}

export default function RecruiterCompanies() {
  const [localCompany, setLocalCompany] = useState(null);
  const [modal, setModal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loading = false;
  const externalError = "";

  const company = localCompany;
  const status = normalizeStatus(company);

  const initialValues = useMemo(() => {
    if (!company) return EMPTY_COMPANY;

    return {
      name: company.name || "",
      industry: company.industry || "",
      website: company.website || "",
      email: company.email || "",
      phone: company.phone || "",
      size: company.size || "",
      foundedYear: company.foundedYear || "",
      location: company.location || "",
      description: company.description || "",
    };
  }, [company]);

  async function handleSubmit(values) {
    setBusy(true);
    setError("");

    try {
      const result = {
        ...values,
        _id: company?._id || `preview-${Date.now()}`,
        verificationStatus: company
          ? company.verificationStatus || "pending"
          : "pending",
        isVerified: company?.isVerified || false,
        recruiters: company?.recruiters || [],
        stats: company?.stats || {
          jobs: 0,
          applications: 0,
          interviews: 0,
        },
      };

      setLocalCompany(result);
      setModal("");

      setNotice(
        company
          ? "Company profile update submitted."
          : "Company profile submitted for review."
      );
    } catch (err) {
      setError(
        err?.message ||
          "Could not save company details. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    setBusy(true);

    try {
      setNotice("Company status refreshed.");
    } catch {
      setNotice("Could not refresh company status.");
    } finally {
      setBusy(false);
    }
  }

  const handleManageRecruiters = () => {
    setNotice("Connect recruiter management.");
  };

  const handleManageJobs = () => {
    setNotice("Connect your recruiter jobs page.");
  };

  const handleSettings = () => {
    setNotice("Connect company settings.");
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F8FC] px-5">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto animate-spin text-violet-700"
          />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading company workspace...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Fetching your company status.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Recruiter workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Company<span className="text-violet-600">.</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your organization, your team, and your hiring operations.
            </p>
          </div>

          {company && (
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={status} />

              <button
                onClick={handleRefresh}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:text-violet-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={busy ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          )}
        </header>

        {externalError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {externalError}
          </div>
        )}

        {!company ? (
          <CompanyRegistration
            onSubmit={handleSubmit}
            busy={busy}
            error={error}
            initialValues={initialValues}
          />
        ) : status === "pending" || status === "rejected" ? (
          <PendingReview
            company={company}
            status={status}
            onRefresh={handleRefresh}
            onEdit={() => {
              setError("");
              setModal("edit");
            }}
            busy={busy}
          />
        ) : (
          <CompanyDashboard
            company={company}
            onEdit={() => {
              setError("");
              setModal("edit");
            }}
            onRefresh={handleRefresh}
            onManageRecruiters={handleManageRecruiters}
            onManageJobs={handleManageJobs}
            onSettings={handleSettings}
            busy={busy}
          />
        )}

        {modal === "edit" && (
          <Modal
            title="Edit company profile"
            subtitle="Update your organization's information."
            onClose={() => setModal("")}
          >
            <CompanyRegistration
              initialValues={initialValues}
              busy={busy}
              error={error}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}

        {notice && (
          <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50">
            <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
              <CheckCircle2 size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                Peer.Hiring
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {notice}
              </p>
            </div>

            <button
              onClick={() => setNotice("")}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
