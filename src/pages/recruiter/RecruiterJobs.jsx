
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Search,
  Plus,
  BriefcaseBusiness,
  Users,
  Eye,
  MapPin,
  Clock3,
  CalendarDays,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  CircleCheck,
  CirclePause,
  X,
  Copy,
  Pencil,
  CircleDollarSign,
  SlidersHorizontal,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  Trash2,
  Save,
  Check,
  Filter,
  RotateCcw,
  Building2,
ExternalLink,
Globe2,
Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJob } from "../../hooks/Hook";

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "Draft", value: "DRAFT" },
  { label: "Paused", value: "PAUSED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Expired", value: "EXPIRED" },
];

const EMPLOYMENT_OPTIONS = [
  { label: "All employment types", value: "" },
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Freelance", value: "FREELANCE" },
];

const WORKSPACE_OPTIONS = [
  { label: "All work arrangements", value: "" },
  { label: "On-site", value: "ONSITE" },
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
];

const EXPERIENCE_OPTIONS = [
  { label: "All experience levels", value: "" },
  { label: "Fresher", value: "FRESHER" },
  { label: "Junior", value: "JUNIOR" },
  { label: "Mid-level", value: "MID" },
  { label: "Senior", value: "SENIOR" },
  { label: "Lead", value: "LEAD" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "recent" },
  { label: "Oldest first", value: "oldest" },
  { label: "Title A–Z", value: "title" },
  { label: "Highest salary", value: "salaryHigh" },
  { label: "Lowest salary", value: "salaryLow" },
  { label: "Most applicants", value: "applicants" },
  { label: "Most views", value: "views" },
];

const EMPTY_FILTERS = {
  search: "",
  status: "",
  employmentType: "",
  workSpaceType: "",
  experienceLevel: "",
  location: "",
  skills: "",
  minSalary: "",
  maxSalary: "",
  postedWithin: "",
  sortBy: "recent",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  requirements: "",
  responsibilities: "",
  employmentType: "FULL_TIME",
  workSpaceType: "ONSITE",
  experienceLevel: "FRESHER",
  city: "",
  state: "",
  country: "India",
  salaryMin: "",
  salaryMax: "",
  currency: "INR",
  isNegotiable: false,
  skills: "",
  openings: "1",
  applicationDeadline: "",
  status: "DRAFT",
};

const STATUS_STYLES = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  DRAFT: "bg-violet-50 text-violet-700 ring-violet-200",
  PAUSED: "bg-amber-50 text-amber-700 ring-amber-200",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-200",
  EXPIRED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ACCENTS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

const SORT_PARAMS = {
  recent: ["createdAt", "desc"],
  oldest: ["createdAt", "asc"],
  title: ["title", "asc"],
  salaryHigh: ["salary.max", "desc"],
  salaryLow: ["salary.min", "asc"],
  applicants: ["applicantsCount", "desc"],
  views: ["views", "desc"],
};

function getJobId(job) {
  const id = job?._id ?? job?.id ?? job?.jobId;

  if (id == null) return "";

  const normalizedId = String(id).trim();

  if (!normalizedId || normalizedId === "[object Object]") {
    return "";
  }

  return normalizedId;
}

function getTitle(job) {
  return job?.title || "Untitled job";
}

function getRawStatus(job) {
  return String(job?.status || "DRAFT").toUpperCase();
}

function getStatusLabel(job) {
  const status = getRawStatus(job);

  return {
    OPEN: "Open",
    DRAFT: "Draft",
    PAUSED: "Paused",
    CLOSED: "Closed",
    EXPIRED: "Expired",
  }[status] || status;
}

function formatEnum(value) {
  if (!value) return "Not specified";

  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTimeAgo(value) {
  if (!value) return "Not available";

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return "Not available";

  const days = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 86400000)
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;

  return `${Math.floor(days / 365)} years ago`;
}

function getLocation(job) {
  const location = job?.location;

  if (typeof location === "string") {
    return location || "Location not specified";
  }

  if (location && typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ].filter(Boolean).join(", ") || "Location not specified";
  }

  return "Location not specified";
}

function getSalaryText(job) {
  const salary = job?.salary || {};
  const currency = salary.currency || "INR";
  const min = salary.min;
  const max = salary.max;

  if (salary.isNegotiable && !min && !max) {
    return "Negotiable";
  }

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN");

  if (min != null && max != null && (Number(min) || Number(max))) {
    return `${currency} ${formatAmount(min)} – ${formatAmount(max)}`;
  }

  if (min != null && Number(min)) {
    return `From ${currency} ${formatAmount(min)}`;
  }

  if (max != null && Number(max)) {
    return `Up to ${currency} ${formatAmount(max)}`;
  }

  return salary.isNegotiable ? "Negotiable" : "Not specified";
}

function getApplicants(job) {
  return Number(job?.applicantsCount) || 0;
}

function getInitials(title) {
  return String(title || "JB")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function normalizeJob(job) {
  return {
    ...job,
    _id: getJobId(job),
    title: getTitle(job),
    status: getRawStatus(job),
    statusLabel: getStatusLabel(job),
    locationLabel: getLocation(job),
    salaryLabel: getSalaryText(job),
    applicants: getApplicants(job),
    views: Number(job?.views) || 0,
    postedLabel: getTimeAgo(job?.createdAt),
    deadlineLabel: formatDate(job?.applicationDeadline),
    initials: getInitials(getTitle(job)),
  };
}

function arrayToTextarea(value) {
  if (Array.isArray(value)) return value.join("\n");
  return typeof value === "string" ? value : "";
}

function createFormFromJob(job) {
  const location = job?.location || {};
  const salary = job?.salary || {};

  let deadline = "";

  if (job?.applicationDeadline) {
    const date = new Date(job.applicationDeadline);

    if (!Number.isNaN(date.getTime())) {
      deadline = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
    }
  }

  return {
    ...EMPTY_FORM,
    title: job?.title || "",
    description: job?.description || "",
    category: job?.category || "",
    requirements: arrayToTextarea(job?.requirements),
    responsibilities: arrayToTextarea(job?.responsibilities),
    employmentType: job?.employmentType || "FULL_TIME",
    workSpaceType: job?.workSpaceType || "ONSITE",
    experienceLevel: job?.experienceLevel || "FRESHER",
    city: location?.city || "",
    state: location?.state || "",
    country: location?.country || "India",
    salaryMin: salary?.min ?? "",
    salaryMax: salary?.max ?? "",
    currency: salary?.currency || "INR",
    isNegotiable: Boolean(salary?.isNegotiable),
    skills: Array.isArray(job?.skills)
      ? job.skills.join(", ")
      : "",
    openings: String(job?.openings ?? 1),
    applicationDeadline: deadline,
    status: getRawStatus(job),
  };
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildJobPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),

    requirements: splitLines(form.requirements),
    responsibilities: splitLines(form.responsibilities),

    employmentType: form.employmentType,
    workSpaceType: form.workSpaceType,
    experienceLevel: form.experienceLevel,

    location: {
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
    },

    salary: {
      min: form.salaryMin === "" ? 0 : Number(form.salaryMin),
      max: form.salaryMax === "" ? 0 : Number(form.salaryMax),
      currency: form.currency,
      isNegotiable: Boolean(form.isNegotiable),
    },

    skills: form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),

    openings: Number(form.openings),
    applicationDeadline: form.applicationDeadline || null,
    status: form.status,
  };
}

function Field({ label, required, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${className}`}
    />
  );
}

function SelectInput({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${className}`}
    >
      {children}
    </select>
  );
}

function TextArea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${className}`}
    />
  );
}

function JobFormModal({
  open,
  mode,
  initialJob,
  saving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    setForm(
      mode === "edit" && initialJob
        ? createFormFromJob(initialJob)
        : { ...EMPTY_FORM }
    );
    setErrors({});
  }, [open, mode, initialJob]);

  const update = useCallback((name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }, []);

  if (!open) return null;

  const validate = () => {
    const next = {};

    if (!form.title.trim()) next.title = "Job title is required.";
    if (!form.description.trim()) {
      next.description = "Job description is required.";
    }
    if (!form.employmentType) {
      next.employmentType = "Select an employment type.";
    }
    if (!form.experienceLevel) {
      next.experienceLevel = "Select an experience level.";
    }

    const min = form.salaryMin === "" ? 0 : Number(form.salaryMin);
    const max = form.salaryMax === "" ? 0 : Number(form.salaryMax);
    const openings = Number(form.openings);

    if (!Number.isFinite(min) || min < 0) {
      next.salaryMin = "Enter a valid non-negative salary.";
    }

    if (!Number.isFinite(max) || max < 0) {
      next.salaryMax = "Enter a valid non-negative salary.";
    }

    if (max > 0 && min > max) {
      next.salaryMax = "Maximum salary must be greater than minimum salary.";
    }

    if (!Number.isInteger(openings) || openings < 1) {
      next.openings = "Enter at least one opening.";
    }

    if (
      form.applicationDeadline &&
      Number.isNaN(new Date(form.applicationDeadline).getTime())
    ) {
      next.applicationDeadline = "Enter a valid deadline.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit(buildJobPayload(form));
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
              Peer.Hiring · Job management
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {mode === "edit" ? "Edit job listing" : "Create a job listing"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Complete the job information below. Required fields are marked.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close job form"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto px-5 py-5 sm:px-7">
            <div className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-900">
              <BriefcaseBusiness size={18} className="text-violet-700" />
              Basic job information
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Job title"
                required
                error={errors.title}
                className="sm:col-span-2"
              >
                <TextInput
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  maxLength={150}
                />
              </Field>

              <Field label="Category / department">
                <TextInput
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  placeholder="e.g. Engineering, Design, Marketing"
                  maxLength={100}
                />
              </Field>

              <Field label="Number of openings" error={errors.openings}>
                <TextInput
                  type="number"
                  min="1"
                  step="1"
                  value={form.openings}
                  onChange={(e) => update("openings", e.target.value)}
                  placeholder="1"
                />
              </Field>

              <Field
                label="Employment type"
                required
                error={errors.employmentType}
              >
                <SelectInput
                  value={form.employmentType}
                  onChange={(e) => update("employmentType", e.target.value)}
                >
                  {EMPLOYMENT_OPTIONS.slice(1).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Work arrangement">
                <SelectInput
                  value={form.workSpaceType}
                  onChange={(e) => update("workSpaceType", e.target.value)}
                >
                  {WORKSPACE_OPTIONS.slice(1).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                label="Experience level"
                required
                error={errors.experienceLevel}
              >
                <SelectInput
                  value={form.experienceLevel}
                  onChange={(e) => update("experienceLevel", e.target.value)}
                >
                  {EXPERIENCE_OPTIONS.slice(1).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Job status">
                <SelectInput
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                >
                  {STATUS_OPTIONS.slice(1).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FileText size={18} className="text-violet-700" />
                  Job description and qualifications
                </div>
              </div>

              <Field
                label="Job description"
                required
                error={errors.description}
                className="sm:col-span-2"
              >
                <TextArea
                  rows={6}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the role, team, objectives, and expectations..."
                />
              </Field>

              <Field label="Requirements" className="sm:col-span-2">
                <TextArea
                  rows={4}
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  placeholder={"Enter one requirement per line\nStrong JavaScript fundamentals\nExperience with REST APIs"}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Each line becomes a separate requirement.
                </p>
              </Field>

              <Field label="Responsibilities" className="sm:col-span-2">
                <TextArea
                  rows={4}
                  value={form.responsibilities}
                  onChange={(e) => update("responsibilities", e.target.value)}
                  placeholder={"Enter one responsibility per line\nBuild and maintain APIs\nCollaborate with the development team"}
                />
              </Field>

              <Field label="Skills" className="sm:col-span-2">
                <TextInput
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="React, Node.js, MongoDB, SQL"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Separate skills with commas. They will be stored in lowercase.
                </p>
              </Field>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin size={18} className="text-violet-700" />
                  Job location
                </div>
              </div>

              <Field label="City">
                <TextInput
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Agra"
                />
              </Field>

              <Field label="State">
                <TextInput
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="e.g. Uttar Pradesh"
                />
              </Field>

              <Field label="Country">
                <TextInput
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="e.g. India"
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CircleDollarSign size={18} className="text-violet-700" />
                  Compensation
                </div>
              </div>

              <Field label="Minimum salary" error={errors.salaryMin}>
                <TextInput
                  type="number"
                  min="0"
                  value={form.salaryMin}
                  onChange={(e) => update("salaryMin", e.target.value)}
                  placeholder="e.g. 400000"
                />
              </Field>

              <Field label="Maximum salary" error={errors.salaryMax}>
                <TextInput
                  type="number"
                  min="0"
                  value={form.salaryMax}
                  onChange={(e) => update("salaryMax", e.target.value)}
                  placeholder="e.g. 800000"
                />
              </Field>

              <Field label="Currency">
                <SelectInput
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </SelectInput>
              </Field>

              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isNegotiable}
                    onChange={(e) => update("isNegotiable", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-violet-700"
                  />
                  Salary is negotiable
                </label>
              </div>

              <Field
                label="Application deadline"
                error={errors.applicationDeadline}
              >
                <TextInput
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) =>
                    update("applicationDeadline", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  {mode === "edit" ? "Save changes" : "Create job"}
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, note, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{note}</p>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function JobSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
          <div className="h-5 w-20 rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 h-3 w-4/5 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
      <div className="my-5 border-t border-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 p-3">
            <div className="h-3 rounded bg-slate-200" />
            <div className="mt-3 h-5 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Notice({ notice, onClose }) {
  if (!notice) return null;

  const failed = notice.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${
        failed ? "border-red-200" : "border-violet-100"
      }`}
    >
      <div className={`mt-0.5 rounded-full p-1.5 ${
        failed ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      }`}>
        {failed ? <AlertCircle size={17} /> : <Check size={17} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">
          {failed ? "Operation failed" : "Peer.Hiring"}
        </p>
        <p className="mt-1 break-words text-xs leading-5 text-slate-500">
          {notice.message}
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
      >
        <X size={15} />
      </button>
    </div>
  );
}

function JobCard({ job, view, onAction, onApplicants, onView, busy }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const accent = ACCENTS[
    [...String(job.title)].reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0
    ) % ACCENTS.length
  ];

  return (
    <article
      className={`rounded-2xl border border-slate-200/80 bg-white transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 ${
        view === "list" ? "p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${accent}`}>
            {job.initials}
          </div>

          <div className="min-w-0">
            <button
              onClick={() => onView(job)}
              className="text-left text-base font-bold leading-6 text-slate-900 hover:text-violet-700"
            >
              {job.title}
            </button>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {String(job._id).slice(-8)}
              <span className="mx-1.5">·</span>
              {job.category || "General"}
            </p>
            <span
              className={`mt-2.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                STATUS_STYLES[job.status] || STATUS_STYLES.DRAFT
              }`}
            >
              {job.statusLabel}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            disabled={busy}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Job actions"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
          >
            <MoreHorizontal size={21} />
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close action menu"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <MenuButton
                  icon={Eye}
                  onClick={() => {
                    setMenuOpen(false);
                    onView(job);
                  }}
                >
                  View details
                </MenuButton>
                <MenuButton
                  icon={Pencil}
                  onClick={() => {
                    setMenuOpen(false);
                    onAction("edit", job);
                  }}
                >
                  Edit job
                </MenuButton>
                <MenuButton
                  icon={Copy}
                  onClick={() => {
                    setMenuOpen(false);
                    onAction("duplicate", job);
                  }}
                >
                  Duplicate
                </MenuButton>
                {job.status !== "CLOSED" && job.status !== "EXPIRED" && (
                  <MenuButton
                    icon={job.status === "PAUSED" ? CircleCheck : CirclePause}
                    onClick={() => {
                      setMenuOpen(false);
                      onAction(
                        job.status === "PAUSED" ? "activate" : "pause",
                        job
                      );
                    }}
                  >
                    {job.status === "PAUSED" ? "Activate job" : "Pause job"}
                  </MenuButton>
                )}
                <MenuButton
                  icon={Trash2}
                  danger
                  onClick={() => {
                    setMenuOpen(false);
                    onAction("delete", job);
                  }}
                >
                  Delete job
                </MenuButton>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} /> {job.locationLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness size={14} /> {formatEnum(job.employmentType)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleDollarSign size={14} /> {job.salaryLabel}
        </span>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Applicants" value={job.applicants} />
        <StatBox label="Openings" value={job.openings ?? 1} />
        <StatBox label="Views" value={job.views} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Clock3 size={13} /> Posted {job.postedLabel}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 truncate">
            <CalendarDays size={13} /> Deadline: {job.deadlineLabel}
          </p>
        </div>

        <button
          onClick={() => onApplicants(job)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-100"
        >
          Applicants <Users size={14} />
        </button>
      </div>
    </article>
  );
}

function MenuButton({ icon: Icon, children, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-violet-50"
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 break-words whitespace-pre-wrap text-sm font-medium text-slate-800">
        {value || "Not specified"}
      </p>
    </div>
  );
}

export default function RecruiterJobs() {
  const {
    recruiterJobs,
    recruiterJobPagination,
    handleGetRecruiterJobs,
    handleCreateJob,
    handleUpdateJob,
    handleChangeJobStatus,
    handleDeleteJob,
  } = useJob();

  const navigate = useNavigate();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const rawJobs = useMemo(
    () => Array.isArray(recruiterJobs) ? recruiterJobs : [],
    [recruiterJobs]
  );

  const jobs = useMemo(
    () => rawJobs.map(normalizeJob),
    [rawJobs]
  );
  
  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => {
      if (key === "sortBy") return value !== "recent";
      return Boolean(value);
    }),
    [filters]
  );

  const updateFilter = useCallback((key, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const loadJobs = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));

        if (filters.search.trim()) {
          params.set("search", filters.search.trim());
        }

        if (filters.status) {
          params.set("status", filters.status);
        }

        if (filters.employmentType) {
          params.set("employmentType", filters.employmentType);
        }

        if (filters.workSpaceType) {
          params.set("workSpaceType", filters.workSpaceType);
        }

        if (filters.experienceLevel) {
          params.set("experienceLevel", filters.experienceLevel);
        }

        if (filters.location.trim()) {
          params.set("location", filters.location.trim());
        }

        if (filters.skills.trim()) {
          params.set("skills", filters.skills.trim());
        }

        if (filters.minSalary !== "") {
          params.set("minSalary", filters.minSalary);
        }

        if (filters.maxSalary !== "") {
          params.set("maxSalary", filters.maxSalary);
        }

        if (filters.postedWithin) {
          params.set("postedWithin", filters.postedWithin);
        }

        const [sortBy, sortOrder] = SORT_PARAMS[filters.sortBy] || [
          "createdAt",
          "desc",
        ];

        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);

        await handleGetRecruiterJobs({
          query: `?${params.toString()}`,
        });
      } catch (requestError) {
        console.error("Failed to load recruiter jobs:", requestError);
        setError(
          requestError?.message ||
          "Unable to load jobs. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      page,
      filters,
      handleGetRecruiterJobs,
    ]
  );

  useEffect(() => {
  const timer = setTimeout(
    () => loadJobs(),
    filters.search.trim() ? 350 : 0
  );

  return () => clearTimeout(timer);
}, [loadJobs, filters.search]);

  const totalJobs = Number(
    recruiterJobPagination?.totalJobs ??
    recruiterJobPagination?.total ??
    recruiterJobPagination?.totalDocs
  ) || jobs.length;

  const totalPages = Math.max(
    1,
    Number(recruiterJobPagination?.totalPages) || 1
  );

  const metrics = useMemo(() => ({
    total: totalJobs,
    open: jobs.filter((job) => job.status === "OPEN").length,
    applicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
    views: jobs.reduce((sum, job) => sum + job.views, 0),
  }), [jobs, totalJobs]);

  const showNotice = useCallback((message, type = "success") => {
    setNotice({ message, type });
  }, []);

  const openCreate = () => {
    setEditingJob(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setModalMode("edit");
    setModalOpen(true);
    setSelectedJob(null);
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  const submitJob = async (payload) => {
  setSaving(true);

  try {
    if (modalMode === "edit") {
      const JobId = getJobId(editingJob);

      if (!/^[a-fA-F0-9]{24}$/.test(JobId)) {
        throw new Error("Invalid job ID. Please refresh the jobs list.");
      }

      await handleUpdateJob({ JobId, jobData: payload });
      showNotice("Job updated successfully.");
    } else {
      await handleCreateJob({ jobData: payload });
      showNotice("Job created successfully.");
      setPage(1);
    }

    setModalOpen(false);
    setEditingJob(null);

    await loadJobs({ silent: true });
  } catch (requestError) {
    console.error("Save job error:", requestError);

    showNotice(
      requestError?.message || "Unable to save the job.",
      "error"
    );
  } finally {
    setSaving(false);
  }
};

  const handleAction = async (action, job) => {
  const JobId = getJobId(job);

  if (!/^[a-fA-F0-9]{24}$/.test(JobId)) {
    console.error("Job object without a valid MongoDB ID:", job);

    showNotice(
      "Invalid job ID. Please refresh the jobs list.",
      "error"
    );
    return;
  }

  if (action === "view") {
    setSelectedJob(job);
    return;
  }

  if (action === "edit") {
    setEditingJob(job);
    setModalMode("edit");
    setModalOpen(true);
    setSelectedJob(null);
    return;
  }

  if (action === "applicants") {
    navigate(
      `/recruiter/applications?jobId=${encodeURIComponent(JobId)}`
    );
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${getTitle(job)}"?`
    );

    if (!confirmed) return;
  }

  setActionBusy(true);

  try {
    if (action === "pause" || action === "activate") {
      const status = action === "pause" ? "PAUSED" : "OPEN";

      await handleChangeJobStatus({ JobId, status });

      showNotice(
        action === "pause"
          ? "Job paused successfully."
          : "Job reopened successfully."
      );

      setSelectedJob(null);
    } else if (action === "delete") {
      await handleDeleteJob({ JobId });

      setSelectedJob(null);
      showNotice("Job deleted successfully.");
    } else if (action === "duplicate") {
      const {
        _id,
        id,
        jobId,
        __v,
        createdAt,
        updatedAt,
        recruiterId,
        companyId,
        views,
        applicantsCount,
        isBlocked,
        isDeleted,
        statusLabel,
        locationLabel,
        salaryLabel,
        applicants,
        postedLabel,
        deadlineLabel,
        initials,
        ...copy
      } = job;

      // Remove derived UI values and send only actual job fields.
      await handleCreateJob({
        jobData: {
          title: `${getTitle(job)} (Copy)`,
          description: copy.description || "",
          category: copy.category || "",
          requirements: Array.isArray(copy.requirements)
            ? copy.requirements
            : [],
          responsibilities: Array.isArray(copy.responsibilities)
            ? copy.responsibilities
            : [],
          employmentType: copy.employmentType,
          workSpaceType: copy.workSpaceType,
          experienceLevel: copy.experienceLevel,
          location: copy.location,
          salary: copy.salary,
          skills: Array.isArray(copy.skills) ? copy.skills : [],
          openings: Number(copy.openings) || 1,
          applicationDeadline: copy.applicationDeadline || null,
          status: "DRAFT",
        },
      });

      showNotice("Job duplicated as a draft.");
    }

    await loadJobs({ silent: true });
  } catch (requestError) {
    console.error("Job action failed:", requestError);

    showNotice(
      requestError?.message || "Unable to complete this action.",
      "error"
    );
  } finally {
    setActionBusy(false);
  }
};

  const currentSelectedJob = selectedJob
    ? normalizeJob(selectedJob)
    : null;

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Recruiter workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Manage jobs<span className="text-violet-600">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create openings, manage listings, and discover candidates for your roles.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadJobs({ silent: true })}
              disabled={loading || refreshing}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800"
            >
              <Plus size={19} />
              Post a job
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Total job posts"
            value={metrics.total}
            note="Total jobs reported by the API"
            accent="bg-violet-50 text-violet-700"
          />
          <MetricCard
            icon={CircleCheck}
            label="Open jobs on this page"
            value={metrics.open}
            note="Currently open listings"
            accent="bg-emerald-50 text-emerald-700"
          />
          <MetricCard
            icon={Users}
            label="Applicants on this page"
            value={metrics.applicants}
            note="Applicants reported by the API"
            accent="bg-blue-50 text-blue-700"
          />
          <MetricCard
            icon={Eye}
            label="Views on this page"
            value={metrics.views}
            note="Views reported by the API"
            accent="bg-amber-50 text-amber-700"
          />
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your job listings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and combine filters to find the exact job you need.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              <div className="relative xl:col-span-2">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  placeholder="Search job title, description, skills..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-violet-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FilterSelect
                label="Status"
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                options={STATUS_OPTIONS}
              />
              <FilterSelect
                label="Employment type"
                value={filters.employmentType}
                onChange={(value) => updateFilter("employmentType", value)}
                options={EMPLOYMENT_OPTIONS}
              />
              <FilterSelect
                label="Work arrangement"
                value={filters.workSpaceType}
                onChange={(value) => updateFilter("workSpaceType", value)}
                options={WORKSPACE_OPTIONS}
              />
              <FilterSelect
                label="Experience level"
                value={filters.experienceLevel}
                onChange={(value) => updateFilter("experienceLevel", value)}
                options={EXPERIENCE_OPTIONS}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <input
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                placeholder="City, state, or country"
                className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <input
                value={filters.skills}
                onChange={(e) => updateFilter("skills", e.target.value)}
                placeholder="Skills (e.g. react, node)"
                className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <FilterSelect
                label="Posted within"
                value={filters.postedWithin}
                onChange={(value) => updateFilter("postedWithin", value)}
                options={[
                  { label: "Any time", value: "" },
                  { label: "Last 24 hours", value: "1" },
                  { label: "Last 7 days", value: "7" },
                  { label: "Last 14 days", value: "14" },
                  { label: "Last 30 days", value: "30" },
                  { label: "Last 90 days", value: "90" },
                ]}
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={filters.minSalary}
                  onChange={(e) => updateFilter("minSalary", e.target.value)}
                  placeholder="Min salary"
                  className="h-11 min-w-0 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
                <input
                  type="number"
                  min="0"
                  value={filters.maxSalary}
                  onChange={(e) => updateFilter("maxSalary", e.target.value)}
                  placeholder="Max salary"
                  className="h-11 min-w-0 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                {hasActiveFilters
                  ? "Filters are applied to the job request."
                  : "Showing all job statuses."}
              </p>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-700"
                  >
                    <RotateCcw size={14} />
                    Reset filters
                  </button>
                )}

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    className={`rounded-lg p-2 ${
                      view === "grid"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    className={`rounded-lg p-2 ${
                      view === "list"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <List size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && !loading && (
            <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Could not load jobs
                  </p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => loadJobs()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                : "flex flex-col gap-3"
            }>
              {Array.from({ length: 6 }, (_, index) => (
                <JobSkeleton key={index} />
              ))}
            </div>
          ) : !error && jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <BriefcaseBusiness size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {hasActiveFilters ? "No matching jobs" : "No jobs yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasActiveFilters
                  ? "Try changing your search or clearing some filters."
                  : "Create your first job listing to start building your hiring pipeline."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
                >
                  <Plus size={16} />
                  Create your first job
                </button>
              )}
            </div>
          ) : !error && jobs.length > 0 ? (
            <div className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                : "flex flex-col gap-3"
            }>
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  view={view}
                  busy={actionBusy}
                  onAction={handleAction}
                  onApplicants={(item) => handleAction("applicants", item)}
                  onView={(item) => handleAction("view", item)}
                />
              ))}
            </div>
          ) : null}

          {!loading && !error && jobs.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:px-5">
              <p className="text-xs text-slate-500">
                Page <strong className="text-slate-800">{page}</strong> of{" "}
                <strong className="text-slate-800">{totalPages}</strong>
                {refreshing && (
                  <span className="ml-2 inline-flex items-center gap-1 text-violet-700">
                    <LoaderCircle size={12} className="animate-spin" />
                    Updating
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || refreshing}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-700 px-3 text-xs font-bold text-white">
                  {page}
                </span>

                <button
                  disabled={page >= totalPages || refreshing}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <JobFormModal
        open={modalOpen}
        mode={modalMode}
        initialJob={editingJob}
        saving={saving}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditingJob(null);
          }
        }}
        onSubmit={submitJob}
      />

      {currentSelectedJob && (
        <div
          className="fixed inset-0 z-[70] flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedJob(null);
          }}
        >
          <aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                Job details
              </span>
              <button
                onClick={() => setSelectedJob(null)}
                aria-label="Close details"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-7 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-sm font-bold text-violet-700">
                {currentSelectedJob.initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-950">
                  {currentSelectedJob.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {currentSelectedJob.locationLabel}
                </p>
                <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                  STATUS_STYLES[currentSelectedJob.status] || STATUS_STYLES.DRAFT
                }`}>
                  {currentSelectedJob.statusLabel}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatBox label="Applicants" value={currentSelectedJob.applicants} />
              <StatBox label="Views" value={currentSelectedJob.views} />
              <StatBox label="Openings" value={currentSelectedJob.openings ?? 1} />
              <StatBox label="Salary" value={currentSelectedJob.salaryLabel} />
            </div>

            <div className="mt-6">
              <DetailRow label="Category" value={currentSelectedJob.category} />
              <DetailRow
                label="Employment type"
                value={formatEnum(currentSelectedJob.employmentType)}
              />
              <DetailRow
                label="Workspace"
                value={formatEnum(currentSelectedJob.workSpaceType)}
              />
              <DetailRow
                label="Experience"
                value={formatEnum(currentSelectedJob.experienceLevel)}
              />
              <DetailRow label="Posted" value={currentSelectedJob.postedLabel} />
              <DetailRow
                label="Application deadline"
                value={currentSelectedJob.deadlineLabel}
              />
              <DetailRow
                label="Description"
                value={currentSelectedJob.description}
              />
              <DetailRow
                label="Requirements"
                value={arrayToTextarea(currentSelectedJob.requirements)}
              />
              <DetailRow
                label="Responsibilities"
                value={arrayToTextarea(currentSelectedJob.responsibilities)}
              />
              <DetailRow
                label="Skills"
                value={Array.isArray(currentSelectedJob.skills)
                  ? currentSelectedJob.skills.join(", ")
                  : ""}
              />
            </div>

            <div className="mt-8 grid gap-3">
              {currentSelectedJob.status !== "CLOSED" &&
                currentSelectedJob.status !== "EXPIRED" && (
                  <button
                    disabled={actionBusy}
                    onClick={() =>
                      handleAction(
                        currentSelectedJob.status === "PAUSED"
                          ? "activate"
                          : "pause",
                        selectedJob
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-50"
                  >
                    {actionBusy ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : currentSelectedJob.status === "PAUSED" ? (
                      <CircleCheck size={17} />
                    ) : (
                      <CirclePause size={17} />
                    )}
                    {currentSelectedJob.status === "PAUSED"
                      ? "Reopen job"
                      : "Pause job"}
                  </button>
                )}

              <button
                disabled={actionBusy}
                onClick={() => handleAction("edit", selectedJob)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Pencil size={16} />
                Edit job
              </button>

              <button
                disabled={actionBusy}
                onClick={() => handleAction("applicants", selectedJob)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
              >
                <Users size={16} />
                View applicants
              </button>

              <button
                disabled={actionBusy}
                onClick={() => handleAction("delete", selectedJob)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete job
              </button>
            </div>
          </aside>
        </div>
      )}

      <Notice
        notice={notice}
        onClose={() => setNotice(null)}
      />
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
