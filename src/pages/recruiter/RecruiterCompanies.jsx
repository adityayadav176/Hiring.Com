import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  Users,
  BriefcaseBusiness,
  FileCheck2,
  Globe,
  MapPin,
  CalendarDays,
  Pencil,
  Settings2,
  Upload,
  X,
  ChevronRight,
  Sparkles,
  LockKeyhole,
  LoaderCircle,
  Phone,
} from "lucide-react";

import { useCompany } from "../../hooks/Hook";

const EMPTY_COMPANY = {
  name: "",
  industry: "",
  website: "",
  size: "",
  foundedYear: "",
  location: "",
  description: "",
  city: "",
  state: "",
  country: "",
};

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1001-5000", label: "1,001–5,000 employees" },
  { value: "5001-10000", label: "5,001–10,000 employees" },
];

const STATUS_CONFIG = {
  pending: {
    label: "Under review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  verified: {
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

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50";

function normalizeCompanyResponse(value) {
  if (!value) return null;

  const company =
    value?.data?.company ??
    value?.company ??
    value?.data ??
    value;

  return company && typeof company === "object" ? company : null;
}

function normalizeStatus(company) {
  if (!company) return "unverified";

  if (company.isBlocked || company.isDeleted) return "rejected";

  const status = String(company.verificationStatus || "").toLowerCase();

  if (company.isVerified === true || status === "verified") {
    return "verified";
  }

  if (status === "rejected") return "rejected";
  if (status === "pending") return "pending";

  return "unverified";
}

function isCompanyMissing(error) {
  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("not found") ||
    message.includes("no company") ||
    message.includes("does not exist") ||
    message.includes("404")
  );
}

function getCompanyId(company) {
  return company?._id || company?.id || "";
}

function getLocation(company) {
  const headquarters = company?.headquarters;

  if (typeof headquarters === "string") return headquarters;

  if (headquarters && typeof headquarters === "object") {
    return [
      headquarters.city,
      headquarters.state,
      headquarters.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  // Supports older data that might use `location`.
  return company?.location || "";
}

function getFormValues(company) {
  if (!company) return { ...EMPTY_COMPANY };

  const headquarters = company.headquarters || {};
  const location = getLocation(company);

  return {
    name: company.name || "",
    industry: company.industry || "",
    website: company.socialLinks?.website || company.website || "",
    size: company.companySize || company.size || "",
    foundedYear: company.foundedYear
      ? String(company.foundedYear)
      : "",
    location,
    description: company.description || "",
    city: headquarters.city || "",
    state: headquarters.state || "",
    country: headquarters.country || "",
  };
}

function getCompanyDetails(values) {
  const city = values.city?.trim() || "";
  const state = values.state?.trim() || "";
  const country = values.country?.trim() || "";

  const details = {
    name: values.name.trim(),
    industry: values.industry || "",
    description: values.description?.trim() || "",
    companySize: values.size || undefined,
    headquarters: {
      city,
      state,
      country,
    },
    socialLinks: {
      website: values.website?.trim() || "",
      linkedin: values.socialLinks?.linkedin || "",
      github: values.socialLinks?.github || "",
      twitter: values.socialLinks?.twitter || "",
    },
  };

  if (values.foundedYear) {
    details.foundedYear = Number(values.foundedYear);
  }

  return details;
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unverified;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {status === "verified" ? (
        <CheckCircle2 size={13} />
      ) : status === "pending" ? (
        <Clock3 size={13} />
      ) : (
        <AlertCircle size={13} />
      )}
      {config.label}
    </span>
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

function SectionHeading({ eyebrow, title, description }) {
  return (
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

        {children && (
          <div className="mt-6 flex flex-wrap gap-3">{children}</div>
        )}
      </div>
    </section>
  );
}

function CompanyForm({
  initialValues,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => ({ ...initialValues }));
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    setForm({ ...initialValues });
    setLogo(null);
  }, [initialValues]);

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  function submit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      logo,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name *">
          <input
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="e.g. Acme Technologies"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field label="Industry *">
          <select
            required
            value={form.industry}
            onChange={(event) => set("industry", event.target.value)}
            className={inputClass}
            disabled={busy}
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

        <Field label="Company website">
          <input
            type="url"
            value={form.website}
            onChange={(event) => set("website", event.target.value)}
            placeholder="https://company.com"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field label="Company size">
          <select
            value={form.size}
            onChange={(event) => set("size", event.target.value)}
            className={inputClass}
            disabled={busy}
          >
            <option value="">Select team size</option>
            {COMPANY_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Headquarters city *">
          <input
            required
            value={form.city}
            onChange={(event) => set("city", event.target.value)}
            placeholder="e.g. Agra"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field label="State">
          <input
            value={form.state}
            onChange={(event) => set("state", event.target.value)}
            placeholder="e.g. Uttar Pradesh"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field label="Country *">
          <input
            required
            value={form.country}
            onChange={(event) => set("country", event.target.value)}
            placeholder="e.g. India"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <Field label="Year founded">
          <input
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={form.foundedYear}
            onChange={(event) => set("foundedYear", event.target.value)}
            placeholder="e.g. 2020"
            className={inputClass}
            disabled={busy}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="About your company *">
            <textarea
              required
              minLength={20}
              maxLength={3000}
              rows={5}
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="Tell candidates what your company does, your mission, and the people you are looking to hire."
              className={`${inputClass} resize-y`}
              disabled={busy}
            />
          </Field>

          <p className="mt-1.5 text-right text-xs text-slate-400">
            {form.description.length}/3000
          </p>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Company logo"
            hint="Choose an image file. The backend must support multipart uploads."
          >
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setLogo(event.target.files?.[0] || null)}
              className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-violet-700`}
              disabled={busy}
            />
          </Field>

          {logo && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {logo.name}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
        <div className="flex items-start gap-3">
          <LockKeyhole
            size={18}
            className="mt-0.5 shrink-0 text-violet-700"
          />
          <div>
            <p className="text-sm font-bold text-violet-950">
              Company verification
            </p>
            <p className="mt-1 text-xs leading-5 text-violet-800">
              Submitting your profile does not automatically verify your
              company. The authorized review process determines verification.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          {busy ? "Saving..." : submitLabel}
          {!busy && <ArrowRight size={16} />}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function CompanyRegistration({ onSubmit, busy, error }) {
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
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">
              Register your company
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter accurate company information. Required fields are marked
              with *.
            </p>
          </div>

          <CompanyForm
            initialValues={EMPTY_COMPANY}
            busy={busy}
            error={error}
            submitLabel="Submit company profile"
            onSubmit={onSubmit}
          />
        </section>

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
                    <p className="text-sm font-bold text-slate-800">
                      {title}
                    </p>
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
  const location = getLocation(company);

  const feedback =
    company.rejectionReason ||
    company.reviewNotes ||
    "Check the review feedback or contact platform support if you need clarification.";

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
            ? "Your company needs additional attention before it can be verified. Review the feedback and follow the available next steps."
            : "Your company profile has been submitted. Check the current review status here while verification is underway."
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

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
              rejected
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {rejected ? <AlertCircle size={30} /> : <Clock3 size={30} />}
          </div>

          <div className="flex-1">
            <StatusBadge status={status} />
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              {company.name || "Your company"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {company.industry || "Company profile"}
              {location ? ` · ${location}` : ""}
            </p>
          </div>

          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={15} /> Edit details
          </button>
        </div>

        <div
          className={`mt-6 rounded-xl border p-4 ${
            rejected
              ? "border-rose-200 bg-rose-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              rejected ? "text-rose-900" : "text-amber-900"
            }`}
          >
            {rejected
              ? "Review feedback"
              : "Your profile is being reviewed"}
          </p>
          <p
            className={`mt-1.5 text-sm leading-6 ${
              rejected ? "text-rose-800" : "text-amber-800"
            }`}
          >
            {rejected
              ? feedback
              : "You do not need to submit another company profile while this submission is pending. Refresh to check for an update."}
          </p>
        </div>

        <h3 className="mt-8 font-bold text-slate-900">
          Verification progress
        </h3>

        <div className="mt-5 space-y-6">
          {[
            {
              title: "Company profile submitted",
              description: "Your company details have been received.",
              done: true,
            },
            {
              title: rejected
                ? "Additional information required"
                : "Verification review",
              description: rejected
                ? feedback
                : "The authorized team will review the information provided.",
              done: false,
            },
            {
              title: "Company workspace access",
              description:
                "Access depends on the platform's verification and permission rules.",
              done: false,
            },
          ].map((step, index, steps) => (
            <div key={step.title} className="relative flex gap-4">
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-9 h-[calc(100%+8px)] w-px bg-slate-200" />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-emerald-100 text-emerald-700"
                    : rejected && index === 1
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              <div className="pb-2">
                <p className="text-sm font-bold text-slate-800">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
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
  const applications =
    company.stats?.applications ?? company.applicationCount ?? 0;
  const interviews =
    company.stats?.interviews ?? company.interviewCount ?? 0;

  const details = [
    [Globe, "Website", company.socialLinks?.website],
    [MapPin, "Headquarters", getLocation(company)],
    [
      Users,
      "Company size",
      COMPANY_SIZES.find(
        (size) => size.value === company.companySize
      )?.label || company.companySize,
    ],
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

      {status !== "verified" && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            status === "rejected"
              ? "border-rose-200 bg-rose-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
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
              Some company features may be restricted until the required
              verification is complete.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold hover:bg-white/70 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={busy ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={BriefcaseBusiness}
          label="Job openings"
          value={jobs}
          caption="Company job listings"
          tone="bg-violet-50 text-violet-700"
        />
        <Metric
          icon={Users}
          label="Applications"
          value={applications}
          caption="Applications across jobs"
          tone="bg-blue-50 text-blue-700"
        />
        <Metric
          icon={CalendarDays}
          label="Interviews"
          value={interviews}
          caption="Interview records"
          tone="bg-amber-50 text-amber-700"
        />
        <Metric
          icon={ShieldCheck}
          label="Recruiters"
          value={recruiters.length}
          caption="Recruiters listed on company"
          tone="bg-emerald-50 text-emerald-700"
        />
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
            description:
              "Keep your company information accurate and up to date.",
            action: "Edit profile",
            click: onEdit,
            tone: "bg-violet-50 text-violet-700",
          },
          {
            icon: Users,
            title: "Recruiter access",
            description:
              "Review recruiter access and team membership.",
            action: "Manage team",
            click: onManageRecruiters,
            tone: "bg-blue-50 text-blue-700",
          },
          {
            icon: BriefcaseBusiness,
            title: "Job openings",
            description:
              "Review your job listings and hiring activity.",
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
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
            >
              <Icon size={22} />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
              {description}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700">
              {action}
              <ArrowUpRight
                size={16}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Company information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your organization at a glance.
              </p>
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
            {details.length ? (
              details.map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Add company details to complete your profile.
              </p>
            )}
          </div>

          {company.description && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                About the company
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {company.description}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Recruiter team
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                People associated with your company.
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
              <Users size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recruiters.slice(0, 5).map((person, index) => {
              const recruiter =
                typeof person === "object" && person !== null
                  ? person.recruiterId || person
                  : person;

              const displayName =
                typeof recruiter === "string"
                  ? recruiter
                  : recruiter?.name ||
                    recruiter?.fullName ||
                    recruiter?.email ||
                    "Recruiter";

              const email =
                typeof recruiter === "object"
                  ? recruiter?.email || ""
                  : "";

              return (
                <div
                  key={person?._id || person?.id || index}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                    {displayName
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {displayName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {email || "Company recruiter"}
                    </p>
                  </div>
                </div>
              );
            })}

            {!recruiters.length && (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                <Users size={23} className="mx-auto text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-800">
                  No team members to display
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Recruiter membership will appear here when available from
                  your backend.
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

function EditCompanyModal({
  company,
  busy,
  error,
  onClose,
  onSubmit,
}) {
  const initialValues = useMemo(
    () => getFormValues(company),
    [company]
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Edit company profile
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your organization's information.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </header>

        <div className="p-5 sm:p-7">
          <CompanyForm
            initialValues={initialValues}
            busy={busy}
            error={error}
            submitLabel="Save changes"
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </section>
    </div>
  );
}

export default function RecruiterCompanies() {
  const {
    company,
    setCompany,
    handleCreateCompany,
    handleGetMyCompany,
    handleGetCompanyById,
    handleUpdateCompany,
    handleUpdateCompanyLogo,
  } = useCompany();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState("");

  const status = normalizeStatus(company);

  const loadCompany = useCallback(
    async ({ showLoader = true } = {}) => {
      if (showLoader) setLoading(true);

      setPageError("");

      try {
        const result = await handleGetMyCompany();
        const fetchedCompany = normalizeCompanyResponse(result);

        if (fetchedCompany) {
          setCompany(fetchedCompany);
        } else {
          setCompany(null);
        }
      } catch (err) {
        if (isCompanyMissing(err)) {
          // No company profile yet; show the registration screen.
          setCompany(null);
          setPageError("");
        } else {
          setPageError(
            err?.message || "Could not load your company profile."
          );
        }
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [handleGetMyCompany, setCompany]
  );

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const refreshCompany = useCallback(async () => {
    setBusy(true);
    setError("");
    setPageError("");

    try {
      const currentId = getCompanyId(company);

      let result;

      if (currentId) {
        result = await handleGetCompanyById({
          companyId: currentId,
        });
      } else {
        result = await handleGetMyCompany();
      }

      const refreshedCompany = normalizeCompanyResponse(result);

      if (refreshedCompany) {
        setCompany(refreshedCompany);
      }

      setNotice("Company status refreshed.");
    } catch (err) {
      if (isCompanyMissing(err)) {
        setCompany(null);
        setNotice("No company profile was found for this account.");
      } else {
        setPageError(
          err?.message || "Could not refresh company status."
        );
      }
    } finally {
      setBusy(false);
    }
  }, [
    company,
    handleGetCompanyById,
    handleGetMyCompany,
    setCompany,
  ]);

  async function handleSubmit(values) {
  setBusy(true);
  setError("");
  setPageError("");

  try {
    const details = getCompanyDetails(values);
    const logo = values.logo instanceof File ? values.logo : undefined;

    if (!details.name) {
      throw new Error("Company name is required.");
    }

    if (
      !details.headquarters.city ||
      !details.headquarters.country
    ) {
      throw new Error("Headquarters city and country are required.");
    }

    if (company && getCompanyId(company)) {
      const companyId = getCompanyId(company);

      const result = await handleUpdateCompany({
        companyId,
        details,
      });

      let updatedCompany = normalizeCompanyResponse(result);

      if (logo) {
        const logoResult = await handleUpdateCompanyLogo({
          companyId,
          logo,
        });

        updatedCompany =
          normalizeCompanyResponse(logoResult) || updatedCompany;
      }

      if (updatedCompany) setCompany(updatedCompany);

      setNotice("Company profile updated successfully.");
    } else {
      const result = await handleCreateCompany({
        details,
        logo,
      });

      const createdCompany = normalizeCompanyResponse(result);

      if (createdCompany) {
        setCompany(createdCompany);
      }

      setNotice("Company profile submitted successfully.");
    }

    setModal("");
  } catch (err) {
    setError(
      err?.message ||
        "Could not save company details. Please try again."
    );
  } finally {
    setBusy(false);
  }
}

  const handleManageRecruiters = () => {
    setNotice(
      "Connect this action to your recruiter team management route."
    );
  };

  const handleManageJobs = () => {
    setNotice("Connect this action to your recruiter jobs route.");
  };

  const handleSettings = () => {
    setNotice("Connect this action to your company settings route.");
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
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              <button
                onClick={refreshCompany}
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

        {pageError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1">{pageError}</div>

            <button
              onClick={() => loadCompany()}
              className="shrink-0 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {!company ? (
          <CompanyRegistration
            onSubmit={handleSubmit}
            busy={busy}
            error={error}
          />
        ) : status === "pending" || status === "rejected" ? (
          <PendingReview
            company={company}
            status={status}
            onRefresh={refreshCompany}
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
            onRefresh={refreshCompany}
            onManageRecruiters={handleManageRecruiters}
            onManageJobs={handleManageJobs}
            onSettings={handleSettings}
            busy={busy}
          />
        )}

        {modal === "edit" && company && (
          <EditCompanyModal
            company={company}
            busy={busy}
            error={error}
            onClose={() => {
              if (!busy) {
                setModal("");
                setError("");
              }
            }}
            onSubmit={handleSubmit}
          />
        )}

        {notice && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50"
          >
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