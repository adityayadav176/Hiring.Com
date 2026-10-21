import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

// Adjust this import path only if your CompanyContext is stored elsewhere.
import { useCompany } from "../../hooks/Hook";

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
];

const EMPTY_COMPANY = {
  name: "",
  slug: "",
  description: "",
  industry: "",
  companySize: "",
  foundedYear: "",
  headquarters: { country: "", state: "", city: "" },
  socialLinks: { website: "", linkedin: "", github: "", twitter: "" },
  bannerUrl: "",
};

const INPUT =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getCompanyFromResult(result) {
  // Handles common ApiResponse shapes without assuming one specific wrapper.
  return (
    result?.data?.company ??
    result?.data?.data?.company ??
    result?.data?.data ??
    result?.company ??
    result?.data ??
    result ??
    null
  );
}

function normalizeCompany(company) {
  if (!company) return null;

  const headquarters = company.headquarters || {};
  const socialLinks = company.socialLinks || {};

  return {
    ...company,
    headquarters: {
      country: headquarters.country || "",
      state: headquarters.state || "",
      city: headquarters.city || "",
    },
    socialLinks: {
      website: socialLinks.website || "",
      linkedin: socialLinks.linkedin || "",
      github: socialLinks.github || "",
      twitter: socialLinks.twitter || "",
    },
  };
}

function getStatus(company) {
  const value = String(company?.verificationStatus || "").toLowerCase();
  if (company?.isBlocked || company?.isDeleted || value === "rejected") {
    return "rejected";
  }
  if (company?.isVerified || value === "verified") return "verified";
  return "pending";
}

function StatusBadge({ status }) {
  const config = {
    verified: {
      label: "Verified",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Icon: CheckCircle2,
    },
    rejected: {
      label: "Needs attention",
      className: "bg-rose-50 text-rose-700 ring-rose-200",
      Icon: AlertCircle,
    },
    pending: {
      label: "Under review",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      Icon: Clock3,
    },
  }[status] || {
    label: "Under review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    Icon: Clock3,
  };

  const Icon = config.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

function Field({ label, hint, children }) {
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

function SectionTitle({ title, description }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <h3 className="font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      )}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function CompanyForm({
  company,
  busy,
  error,
  onCancel,
  onSubmit,
  isEditing,
}) {
  const initialValues = useMemo(() => {
    const normalized = normalizeCompany(company);
    if (!normalized) return { ...EMPTY_COMPANY };

    return {
      name: normalized.name || "",
      slug: normalized.slug || "",
      description: normalized.description || "",
      industry: normalized.industry || "",
      companySize: normalized.companySize || "",
      foundedYear: normalized.foundedYear ?? "",
      headquarters: normalized.headquarters,
      socialLinks: normalized.socialLinks,
      bannerUrl: normalized.banner?.url || "",
    };
  }, [company]);

  const [form, setForm] = useState(initialValues);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(company?.logo?.url || "");

  useEffect(() => {
    setForm(initialValues);
    setLogoFile(null);
    setLogoPreview(company?.logo?.url || "");
  }, [initialValues, company?.logo?.url]);

  useEffect(() => {
    if (!logoFile) return undefined;
    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const setNested = (group, key, value) =>
    setForm((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }));

  const submit = (event) => {
    event.preventDefault();

    const details = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim(),
      industry: form.industry.trim(),
      companySize: form.companySize,
      foundedYear: form.foundedYear === "" ? undefined : Number(form.foundedYear),
      headquarters: {
        country: form.headquarters.country.trim(),
        state: form.headquarters.state.trim(),
        city: form.headquarters.city.trim(),
      },
      socialLinks: {
        website: form.socialLinks.website.trim(),
        linkedin: form.socialLinks.linkedin.trim(),
        github: form.socialLinks.github.trim(),
        twitter: form.socialLinks.twitter.trim(),
      },
      // The backend schema stores banner as { url, publicId }.
      // This field updates its URL only; uploading a banner needs a backend handler.
      banner: {
        url: form.bannerUrl.trim(),
        publicId: company?.banner?.publicId || "",
      },
    };

    onSubmit({ details, logoFile });
  };

  return (
    <form onSubmit={submit} className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="space-y-7 px-5 py-6 sm:px-7">
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="space-y-4">
          <SectionTitle
            title="Basic information"
            description="The main details candidates will see on your company profile."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company name *">
              <input
                required
                maxLength={100}
                className={INPUT}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Acme Technologies"
              />
            </Field>

            <Field
              label="Company slug *"
              hint="Unique URL identifier. Use lowercase letters, numbers, and hyphens."
            >
              <input
                required
                maxLength={120}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className={INPUT}
                value={form.slug}
                onChange={(e) =>
                  setField(
                    "slug",
                    e.target.value.toLowerCase().replace(/\s+/g, "-")
                  )
                }
                placeholder="acme-technologies"
              />
            </Field>

            <Field label="Industry">
              <input
                maxLength={100}
                className={INPUT}
                value={form.industry}
                onChange={(e) => setField("industry", e.target.value)}
                placeholder="Software, healthcare, finance..."
              />
            </Field>

            <Field label="Company size">
              <select
                className={INPUT}
                value={form.companySize}
                onChange={(e) => setField("companySize", e.target.value)}
              >
                <option value="">Select company size</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Year founded">
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                className={INPUT}
                value={form.foundedYear}
                onChange={(e) => setField("foundedYear", e.target.value)}
                placeholder="e.g. 2020"
              />
            </Field>

            <Field label="Website" hint="Include https://">
              <input
                type="url"
                className={INPUT}
                value={form.socialLinks.website}
                onChange={(e) =>
                  setNested("socialLinks", "website", e.target.value)
                }
                placeholder="https://company.com"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Company description" hint="Maximum 3,000 characters.">
                <textarea
                  rows={5}
                  maxLength={3000}
                  className={`${INPUT} resize-y`}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe your company, mission, products, and team."
                />
              </Field>
              <p className="mt-1 text-right text-xs text-slate-400">
                {form.description.length}/3000
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Headquarters"
            description="These values are stored in the nested headquarters object."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="City">
              <input
                className={INPUT}
                value={form.headquarters.city}
                onChange={(e) => setNested("headquarters", "city", e.target.value)}
                placeholder="Agra"
              />
            </Field>
            <Field label="State">
              <input
                className={INPUT}
                value={form.headquarters.state}
                onChange={(e) => setNested("headquarters", "state", e.target.value)}
                placeholder="Uttar Pradesh"
              />
            </Field>
            <Field label="Country">
              <input
                className={INPUT}
                value={form.headquarters.country}
                onChange={(e) => setNested("headquarters", "country", e.target.value)}
                placeholder="India"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Branding"
            description="Choose a logo image. Logo upload uses your existing CompanyContext handler."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company logo" hint="Use a square image where possible.">
              <div className="mt-1.5 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={23} />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="min-w-0 text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-semibold file:text-violet-700"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
            </Field>

            <Field
              label="Banner image URL"
              hint="URL only. Your current context has no banner upload handler."
            >
              <input
                type="url"
                className={INPUT}
                value={form.bannerUrl}
                onChange={(e) => setField("bannerUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Social links"
            description="Add the official company profiles."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["linkedin", "LinkedIn URL", "https://linkedin.com/company/..."],
              ["github", "GitHub URL", "https://github.com/..."],
              ["twitter", "Twitter / X URL", "https://x.com/..."],
            ].map(([key, label, placeholder]) => (
              <Field key={key} label={label}>
                <input
                  type="url"
                  className={INPUT}
                  value={form.socialLinks[key]}
                  onChange={(e) => setNested("socialLinks", key, e.target.value)}
                  placeholder={placeholder}
                />
              </Field>
            ))}
          </div>
        </section>

        {company && (
          <section className="space-y-4">
            <SectionTitle
              title="Platform-managed information"
              description="These fields are controlled by the backend and are not editable here."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyValue label="Verification status" value={company.verificationStatus || "pending"} />
              <ReadOnlyValue label="Verified" value={company.isVerified ? "Yes" : "No"} />
              <ReadOnlyValue label="Blocked" value={company.isBlocked ? "Yes" : "No"} />
              <ReadOnlyValue label="Deleted" value={company.isDeleted ? "Yes" : "No"} />
              <ReadOnlyValue label="Recruiter entries" value={String(company.recruiters?.length || 0)} />
              <ReadOnlyValue label="Created" value={formatDate(company.createdAt)} />
              <ReadOnlyValue label="Last updated" value={formatDate(company.updatedAt)} />
            </div>
          </section>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowRight size={17} />}
            {busy ? "Saving..." : isEditing ? "Save company changes" : "Create company profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

function ReadOnlyValue({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function Detail({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-violet-700 hover:underline"
          >
            {value} <ExternalLink size={13} />
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

function CompanyDashboard({ company, onEdit, onRefresh, busy }) {
  const headquarters = company.headquarters || {};
  const location = [headquarters.city, headquarters.state, headquarters.country]
    .filter(Boolean)
    .join(", ");
  const socialLinks = company.socialLinks || {};
  const status = getStatus(company);
  const recruiters = Array.isArray(company.recruiters) ? company.recruiters : [];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#24104F] via-[#5125A5] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10">
            {company.logo?.url ? (
              <img src={company.logo.url} alt={`${company.name} logo`} className="h-full w-full object-cover" />
            ) : (
              <Building2 size={30} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3"><StatusBadge status={status} /></div>
            <h2 className="break-words text-2xl font-bold sm:text-3xl">{company.name}</h2>
            <p className="mt-2 text-sm text-violet-100">
              {company.industry || "Industry not specified"}
              {location ? ` · ${location}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 hover:bg-violet-50"
          >
            <Pencil size={16} /> Edit company
          </button>
        </div>
      </section>

      {status !== "verified" && (
        <div className={cx(
          "flex items-start gap-3 rounded-2xl border p-4",
          status === "rejected" ? "border-rose-200 bg-rose-50 text-rose-900" : "border-amber-200 bg-amber-50 text-amber-900"
        )}>
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">
              {status === "rejected" ? "Company verification needs attention" : "Company verification is pending"}
            </p>
            <p className="mt-1 text-sm leading-6">
              {status === "rejected"
                ? "Review any feedback provided by your platform's verification team."
                : "Your company profile has not been marked as verified. The authorized review process controls this status."}
            </p>
          </div>
          <button type="button" onClick={onRefresh} disabled={busy} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold hover:bg-white/70 disabled:opacity-60">
            <RefreshCw size={14} className={busy ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Company size", value: company.companySize || "—", icon: Users },
          { label: "Founded", value: company.foundedYear || "—", icon: CalendarDays },
          { label: "Recruiters", value: recruiters.length, icon: ShieldCheck },
          { label: "Profile status", value: status === "verified" ? "Verified" : status === "rejected" ? "Needs attention" : "Under review", icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700"><Icon size={19} /></span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <h3 className="text-lg font-bold text-slate-950">Company information</h3>
          <p className="mt-1 text-sm text-slate-500">Details saved in your company profile.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Detail icon={Building2} label="Company name" value={company.name} />
            <Detail icon={Globe} label="Website" value={socialLinks.website} href={socialLinks.website} />
            <Detail icon={MapPin} label="Headquarters" value={location} />
            <Detail icon={Users} label="Company size" value={company.companySize} />
            <Detail icon={CalendarDays} label="Founded" value={company.foundedYear} />
            <Detail icon={ShieldCheck} label="Industry" value={company.industry} />
          </div>
          {company.description && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About the company</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{company.description}</p>
            </div>
          )}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Social links</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                ["LinkedIn", socialLinks.linkedin],
                ["GitHub", socialLinks.github],
                ["Twitter / X", socialLinks.twitter],
              ].filter(([, url]) => url).map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-violet-700 hover:border-violet-200 hover:bg-violet-50">
                  {label} <ExternalLink size={14} />
                </a>
              ))}
              {!socialLinks.linkedin && !socialLinks.github && !socialLinks.twitter && (
                <p className="text-sm text-slate-500">No social links added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700"><Users size={19} /></span>
            <div>
              <h3 className="font-bold text-slate-950">Recruiter team</h3>
              <p className="mt-1 text-sm text-slate-500">Recruiters currently associated with this company.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {recruiters.slice(0, 8).map((entry, index) => {
              const recruiter = entry?.recruiterId || entry;
              const name = recruiter?.name || recruiter?.email || "Recruiter";
              return (
                <div key={recruiter?._id || entry?._id || index} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                    {name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {recruiter?.email || "Company recruiter"}
                    </p>
                  </div>
                  {entry?.joinedAt && <span className="text-xs text-slate-400">Joined {formatDate(entry.joinedAt)}</span>}
                </div>
              );
            })}
            {!recruiters.length && (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                <Users size={23} className="mx-auto text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-800">No recruiter entries to display</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Recruiter membership appears here when returned by the API.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
        <h3 className="font-bold text-slate-900">Company record</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ReadOnlyValue label="Slug" value={company.slug} />
          <ReadOnlyValue label="Verification status" value={company.verificationStatus} />
          <ReadOnlyValue label="Verified" value={company.isVerified ? "Yes" : "No"} />
          <ReadOnlyValue label="Blocked" value={company.isBlocked ? "Yes" : "No"} />
          <ReadOnlyValue label="Deleted" value={company.isDeleted ? "Yes" : "No"} />
          <ReadOnlyValue label="Created" value={formatDate(company.createdAt)} />
          <ReadOnlyValue label="Updated" value={formatDate(company.updatedAt)} />
          <ReadOnlyValue label="Deleted at" value={formatDate(company.deletedAt)} />
        </div>
      </section>
    </div>
  );
}

export default function RecruiterCompanies() {
  const {
    company: contextCompany,
    setCompany,
    handleCreateCompany,
    handleGetMyCompany,
    handleUpdateCompany,
    handleUpdateCompanyLogo,
  } = useCompany();

  const [localCompany, setLocalCompany] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const company = normalizeCompany(contextCompany || localCompany);
  const status = getStatus(company);

  const refreshCompany = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const result = await handleGetMyCompany();
      const nextCompany = normalizeCompany(getCompanyFromResult(result));
      if (nextCompany) {
        setLocalCompany(nextCompany);
        setCompany?.(nextCompany);
      }
      setNotice("Company information refreshed.");
    } catch (err) {
      setError(err?.message || "Could not refresh company information.");
    } finally {
      setBusy(false);
    }
  }, [handleGetMyCompany, setCompany]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await handleGetMyCompany();
        const nextCompany = normalizeCompany(getCompanyFromResult(result));
        if (active && nextCompany) {
          setLocalCompany(nextCompany);
          setCompany?.(nextCompany);
        }
      } catch (err) {
        if (active) setError(err?.message || "Could not load your company profile.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [handleGetMyCompany, setCompany]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const submitCompany = async ({ details, logoFile }) => {
    setBusy(true);
    setError("");
    try {
      let result;

      if (!company) {
        result = await handleCreateCompany({
          details,
          logo: logoFile || undefined,
        });
      } else {
        result = await handleUpdateCompany({
          companyId: company._id,
          details,
        });

        if (logoFile) {
          await handleUpdateCompanyLogo({
            companyId: company._id,
            logo: logoFile,
          });
        }
      }

      // Re-fetch from the API so the UI reflects the persisted server record.
      const refreshed = await handleGetMyCompany();
      const savedCompany = normalizeCompany(
        getCompanyFromResult(refreshed) ||
          getCompanyFromResult(result)
      );

      if (savedCompany) {
        setLocalCompany(savedCompany);
        setCompany?.(savedCompany);
      }

      setModalOpen(false);
      setNotice(company ? "Company profile updated successfully." : "Company profile created successfully.");
    } catch (err) {
      setError(err?.message || "Could not save company details. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const openEditor = () => {
    setError("");
    setModalOpen(true);
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F8FC] px-5">
        <div className="text-center">
          <LoaderCircle size={34} className="mx-auto animate-spin text-violet-700" />
          <p className="mt-4 text-sm font-semibold text-slate-700">Loading company workspace...</p>
          <p className="mt-1 text-xs text-slate-500">Fetching your company profile.</p>
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
              Your organization, your team, and your company profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {company && <StatusBadge status={status} />}
            <button
              type="button"
              onClick={refreshCompany}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:text-violet-700 disabled:opacity-60"
            >
              <RefreshCw size={15} className={busy ? "animate-spin" : ""} />
              Refresh
            </button>
            {company && (
              <button
                type="button"
                onClick={openEditor}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
              >
                <Pencil size={15} /> Edit company
              </button>
            )}
          </div>
        </header>

        {error && !modalOpen && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!company ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Building2 size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-950">Set up your company profile</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add your organization details so your company workspace can be connected to Peer.Hiring.
              </p>
              <button
                type="button"
                onClick={openEditor}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
              >
                Create company profile <ArrowRight size={16} />
              </button>
            </div>
          </section>
        ) : (
          <CompanyDashboard
            company={company}
            onEdit={openEditor}
            onRefresh={refreshCompany}
            busy={busy}
          />
        )}
      </div>

      {modalOpen && (
        <Modal
          title={company ? "Edit company profile" : "Create company profile"}
          subtitle="Update the fields defined in your company schema."
          onClose={() => {
            if (!busy) {
              setModalOpen(false);
              setError("");
            }
          }}
        >
          <CompanyForm
            key={company?._id || "new-company"}
            company={company}
            isEditing={Boolean(company)}
            busy={busy}
            error={error}
            onCancel={() => setModalOpen(false)}
            onSubmit={submitCompany}
          />
        </Modal>
      )}

      {notice && (
        <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
            <CheckCircle2 size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{notice}</p>
          </div>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  );
}
