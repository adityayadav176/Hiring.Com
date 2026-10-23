import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  AlignLeft,
  ArrowDownToLine,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
  Zap,
  Code2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  useApplication,
  useInterview,
  useResume,
} from "../../hooks/Hook";

/* =========================================================
   CONSTANTS & HELPERS
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TITLE_LENGTH = 120;
const MAX_SUBTITLE_LENGTH = 180;
const MAX_TARGET_LENGTH = 100;
const MAX_SKILLS = 50;

const STATUS_STYLES = {
  applied: "bg-slate-100 text-slate-600",
  screening: "bg-amber-50 text-amber-700",
  shortlisted: "bg-emerald-50 text-emerald-700",
  interview_scheduled: "bg-violet-50 text-violet-700",
  interview_completed: "bg-emerald-50 text-emerald-700",
  selected: "bg-green-50 text-green-700",
  rejected: "bg-rose-50 text-rose-700",
  withdrawn: "bg-slate-100 text-slate-500",
  closed: "bg-slate-100 text-slate-500",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatFileSize = (bytes) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size < 0) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getResumeUrl = (resume) => resume?.resume?.url || "";

const getResumeName = (resume) =>
  resume?.resume?.originalName || "resume.pdf";

const getCompanyName = (application) => {
  const company = application?.companyId;

  if (company && typeof company === "object") {
    return company.name || company.companyName || "Company";
  }

  return "Company";
};

const getJobTitle = (application) => {
  const job = application?.jobId;

  if (job && typeof job === "object") {
    return job.title || job.jobTitle || "Job application";
  }

  return "Job application";
};

const getResumeTitle = (application) => {
  const resume = application?.resumeId;

  if (resume && typeof resume === "object") {
    return resume.title || "Resume";
  }

  return "Resume not available";
};

const openDocument = (resume) => {
  const url = getResumeUrl(resume);

  if (!url) {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};

const downloadDocument = (resume) => {
  const url = getResumeUrl(resume);

  if (!url) {
    return false;
  }

  const link = document.createElement("a");

  link.href = url;
  link.download = getResumeName(resume);
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  link.remove();

  return true;
};

/* =========================================================
   SHARED UI
========================================================= */

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  const variants = {
    primary:
      "bg-violet-600 text-white shadow-sm shadow-violet-600/15 hover:bg-violet-700",
    dark: "bg-slate-950 text-white hover:bg-violet-700",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    danger:
      "border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };

  const sizes = {
    sm: "h-9 gap-2 rounded-xl px-3 text-xs",
    md: "h-10 gap-2 rounded-xl px-4 text-sm",
    lg: "h-11 gap-2 rounded-xl px-5 text-sm",
    icon: "h-9 w-9 rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/15",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SectionHeading = ({ title, description, action }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <h2 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>

    {action}
  </div>
);

const IconBox = ({
  icon: Icon,
  className = "",
  size = "md",
}) => {
  const sizes = {
    sm: "h-9 w-9 rounded-xl",
    md: "h-11 w-11 rounded-2xl",
    lg: "h-12 w-12 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizes[size],
        className
      )}
    >
      <Icon size={size === "sm" ? 17 : 20} strokeWidth={1.8} />
    </div>
  );
};

const EmptyState = ({
  icon: Icon = FileText,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center px-5 py-12 text-center sm:py-16">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
      <Icon size={25} strokeWidth={1.6} />
    </div>

    <h3 className="text-sm font-bold text-slate-900">{title}</h3>

    <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
      {description}
    </p>

    {action && <div className="mt-5">{action}</div>}
  </div>
);

const LoadingState = ({ label = "Loading your workspace..." }) => (
  <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-12">
    <LoaderCircle className="animate-spin text-violet-600" size={26} />
    <p className="text-xs font-medium text-slate-500">{label}</p>
  </div>
);

const MetricCard = ({ icon: Icon, label, value, description }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {value}
        </p>
      </div>

      <IconBox
        icon={Icon}
        size="sm"
        className="bg-violet-50 text-violet-600"
      />
    </div>

    {description && (
      <p className="mt-3 text-[11px] leading-4 text-slate-400">
        {description}
      </p>
    )}
  </div>
);

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timeout);
  }, [toast, onClose]);

  if (!toast || typeof document === "undefined") return null;

  const isError = toast.type === "error";

  return createPortal(
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[100000] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      <div
        role="status"
        className={cn(
          "pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
          isError ? "border-rose-100" : "border-emerald-100"
        )}
      >
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            isError
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
          )}
        >
          {isError ? (
            <AlertCircle size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {isError ? "Something went wrong" : "Success"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body
  );
};

/* =========================================================
   EDIT RESUME MODAL
========================================================= */

const EditResumeDetailsModal = ({
  resume,
  onClose,
  onUpdated,
}) => {
  const { handleUpdateResumeDetails } = useResume();

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resume) return;

    setTitle(resume.title || "");
    setTarget(resume.target || "");
    setSubtitle(resume.subtitle || "");
    setSkills(
      Array.isArray(resume.skills) ? resume.skills : []
    );
    setSkillInput("");
    setError("");
  }, [resume]);

  useEffect(() => {
    if (!resume) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [resume, loading, onClose]);

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (
      skills.some(
        (skill) =>
          skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    if (skills.length >= MAX_SKILLS) {
      setError(`You can add up to ${MAX_SKILLS} skills.`);
      return;
    }

    setSkills((previous) => [...previous, value]);
    setSkillInput("");
    setError("");
  };

  const removeSkill = (skill) => {
    setSkills((previous) =>
      previous.filter((item) => item !== skill)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!resume?._id) {
      setError("Resume ID is missing. Please reopen the modal.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await handleUpdateResumeDetails({
        resumeId: resume._id,
        title: title.trim(),
        target: target.trim(),
        subtitle: subtitle.trim(),
        skills,
      });

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to update resume details."
        );
      }

      onUpdated?.(result?.data || result || {
        ...resume,
        title: title.trim(),
        target: target.trim(),
        subtitle: subtitle.trim(),
        skills,
      });

      onClose?.();
    } catch (err) {
      setError(
        err?.message || "Unable to update your resume. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resume || typeof document === "undefined") return null;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60";

  const labelClass =
    "mb-2 flex items-center gap-2 text-xs font-bold text-slate-700";

  return createPortal(
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-resume-heading"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
              <Sparkles size={12} />
              Resume workspace
            </div>

            <h2
              id="edit-resume-heading"
              className="text-xl font-bold tracking-tight text-slate-950"
            >
              Edit resume details
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Tailor your resume information to the role you want.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={19} />
          </button>
        </header>

        <form
          id="edit-resume-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 px-5 py-6 sm:px-7">
            <div>
              <label
                htmlFor="edit-resume-title"
                className={labelClass}
              >
                <FileText size={15} className="text-violet-600" />
                Resume title <span className="text-rose-500">*</span>
              </label>

              <input
                id="edit-resume-title"
                value={title}
                maxLength={MAX_TITLE_LENGTH}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Software Engineer — Main Resume"
                className={inputClass}
                required
                disabled={loading}
              />

              <p className="mt-1.5 text-right text-[10px] text-slate-400">
                {title.length}/{MAX_TITLE_LENGTH}
              </p>
            </div>

            <div>
              <label
                htmlFor="edit-resume-target"
                className={labelClass}
              >
                <BriefcaseBusiness
                  size={15}
                  className="text-violet-600"
                />
                Target role
              </label>

              <input
                id="edit-resume-target"
                value={target}
                maxLength={MAX_TARGET_LENGTH}
                onChange={(event) => setTarget(event.target.value)}
                placeholder="e.g. Frontend Developer"
                className={inputClass}
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="edit-resume-subtitle"
                className={labelClass}
              >
                <AlignLeft size={15} className="text-violet-600" />
                Short description
              </label>

              <textarea
                id="edit-resume-subtitle"
                value={subtitle}
                maxLength={MAX_SUBTITLE_LENGTH}
                rows={3}
                onChange={(event) => setSubtitle(event.target.value)}
                placeholder="Describe the strengths this resume highlights..."
                className={cn(inputClass, "resize-y")}
                disabled={loading}
              />

              <p className="mt-1.5 text-right text-[10px] text-slate-400">
                {subtitle.length}/{MAX_SUBTITLE_LENGTH}
              </p>
            </div>

            <div>
              <label
                htmlFor="edit-resume-skill"
                className={labelClass}
              >
                <Code2 size={15} className="text-violet-600" />
                Skills
                <span className="font-normal text-slate-400">
                  ({skills.length}/{MAX_SKILLS})
                </span>
              </label>

              <div className="flex gap-2">
                <input
                  id="edit-resume-skill"
                  value={skillInput}
                  onChange={(event) =>
                    setSkillInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                  className={cn(inputClass, "min-w-0 flex-1")}
                  disabled={loading || skills.length >= MAX_SKILLS}
                />

                <Button
                  variant="secondary"
                  onClick={addSkill}
                  disabled={
                    loading ||
                    !skillInput.trim() ||
                    skills.length >= MAX_SKILLS
                  }
                >
                  <Plus size={15} />
                  Add
                </Button>
              </div>

              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-800"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        disabled={loading}
                        aria-label={`Remove ${skill}`}
                        className="text-violet-400 hover:text-rose-600"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                  No skills added yet.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <IconBox
                icon={FileText}
                className="bg-white text-violet-600 shadow-sm"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">
                  Existing PDF
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {getResumeName(resume)}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Editing details does not replace the PDF file.
                </p>
              </div>

              <ShieldCheck
                size={18}
                className="shrink-0 text-emerald-600"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700"
              >
                {error}
              </div>
            )}
          </div>
        </form>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-resume-form"
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {loading ? "Saving changes..." : "Save changes"}
          </Button>
        </footer>
      </section>
    </div>,
    document.body
  );
};

/* =========================================================
   CREATE RESUME MODAL
========================================================= */

const CreateResumeModal = ({ onClose, onCreated }) => {
  const { handleUploadResume } = useResume();

  const fileInputRef = useRef(null);
  const skillInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError("Please select your resume PDF.");
      return false;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF files are allowed.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Your PDF must be 10 MB or smaller.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (
      skills.some(
        (skill) =>
          skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      setError("This skill has already been added.");
      return;
    }

    if (skills.length >= MAX_SKILLS) {
      setError(`You can add a maximum of ${MAX_SKILLS} skills.`);
      return;
    }

    setSkills((previous) => [...previous, value]);
    setSkillInput("");
    setError("");
    skillInputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!title.trim()) {
      setError("Resume title is required.");
      return;
    }

    if (title.trim().length > MAX_TITLE_LENGTH) {
      setError("Resume title is too long.");
      return;
    }

    if (target.trim().length > MAX_TARGET_LENGTH) {
      setError("Target role is too long.");
      return;
    }

    if (subtitle.trim().length > MAX_SUBTITLE_LENGTH) {
      setError("Subtitle is too long.");
      return;
    }

    if (!file || !validateFile(file)) return;

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("subtitle", subtitle.trim());
    formData.append("target", target.trim());
    formData.append("skills", JSON.stringify(skills));
    formData.append("resume", file);

    try {
      setSubmitting(true);
      setError("");

      const result = await handleUploadResume(formData);

      if (result?.success === false) {
        throw new Error(
          result.message || "Failed to upload your resume."
        );
      }

      onCreated?.(result?.data || result);
      onClose?.();
    } catch (err) {
      setError(
        err?.message || "Something went wrong while uploading."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [submitting, onClose]);

  return (
    <div
      className="fixed inset-0 z-[99997] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose?.();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
              <Sparkles size={12} />
              Resume workspace
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Add a new resume
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Upload a PDF and organize it for your next opportunity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={19} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
          <div>
            <label
              htmlFor="new-resume-title"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Resume title <span className="text-rose-500">*</span>
            </label>

            <input
              id="new-resume-title"
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Software Engineer — Main Resume"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              required
              disabled={submitting}
            />

            <p className="mt-1.5 text-right text-[10px] text-slate-400">
              {title.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          <div>
            <label
              htmlFor="new-resume-target"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Target role
            </label>

            <input
              id="new-resume-target"
              value={target}
              maxLength={MAX_TARGET_LENGTH}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="e.g. Backend Developer"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="new-resume-subtitle"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Short description
            </label>

            <textarea
              id="new-resume-subtitle"
              value={subtitle}
              maxLength={MAX_SUBTITLE_LENGTH}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="What does this resume highlight?"
              rows={3}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="new-resume-skills"
              className="mb-2 block text-xs font-bold text-slate-700"
            >
              Skills{" "}
              <span className="font-normal text-slate-400">
                ({skills.length}/{MAX_SKILLS})
              </span>
            </label>

            <div className="flex gap-2">
              <input
                ref={skillInputRef}
                id="new-resume-skills"
                value={skillInput}
                maxLength={60}
                onChange={(event) =>
                  setSkillInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="e.g. React, Node.js"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white"
                disabled={
                  submitting || skills.length >= MAX_SKILLS
                }
              />

              <Button
                variant="secondary"
                onClick={addSkill}
                disabled={
                  submitting ||
                  !skillInput.trim() ||
                  skills.length >= MAX_SKILLS
                }
              >
                <Plus size={15} />
                Add
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-800"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        setSkills((previous) =>
                          previous.filter((item) => item !== skill)
                        )
                      }
                      disabled={submitting}
                      aria-label={`Remove ${skill}`}
                      className="text-violet-400 hover:text-rose-600"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Resume PDF <span className="text-rose-500">*</span>
            </label>

            <div
              role="button"
              tabIndex={submitting ? -1 : 0}
              onClick={() =>
                !submitting && fileInputRef.current?.click()
              }
              onKeyDown={(event) => {
                if (
                  !submitting &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!submitting) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);

                if (!submitting) {
                  const droppedFile = event.dataTransfer.files?.[0];

                  if (droppedFile) {
                    if (validateFile(droppedFile)) {
                      setFile(droppedFile);
                    }
                  }
                }
              }}
              className={cn(
                "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-6 text-center transition",
                dragging
                  ? "border-violet-500 bg-violet-50"
                  : file
                    ? "border-violet-200 bg-violet-50/50"
                    : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/30",
                submitting && "cursor-not-allowed opacity-60"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                disabled={submitting}
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  if (selectedFile) {
                    if (validateFile(selectedFile)) {
                      setFile(selectedFile);
                    }
                  }

                  event.target.value = "";
                }}
              />

              <IconBox
                icon={file ? CheckCircle2 : Upload}
                size="lg"
                className={
                  file
                    ? "mb-3 bg-emerald-50 text-emerald-600"
                    : "mb-3 bg-violet-100 text-violet-700"
                }
              />

              {file ? (
                <>
                  <p className="max-w-full break-all text-sm font-bold text-slate-900">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(file.size)} · PDF selected
                  </p>
                  <p className="mt-3 text-xs font-semibold text-violet-700">
                    Click to replace the file
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-800">
                    Drop your PDF here
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Or click to browse your files
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">
                    PDF only · Maximum 10 MB
                  </p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-[10px] text-slate-400">
            <ShieldCheck size={13} className="mr-1 inline" />
            PDF upload · Maximum 10 MB
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting || !title.trim() || !file}
            >
              {submitting ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Upload size={15} />
              )}
              {submitting ? "Uploading..." : "Create resume"}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
};

/* =========================================================
   RESUME LIST CARD
========================================================= */

const ResumeCard = ({
  resume,
  index,
  active,
  menuOpen,
  onSelect,
  onMenu,
  onEdit,
  onOpenDocument,
  onDownload,
  onSetDefault,
  onDelete,
  busy,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        onMenu?.(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onMenu?.(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, onMenu]);

  const applicationCount = Number(resume?.applications) || 0;
  const interviewCount =
    Number(resume?.interviews ?? resume?.Interview) || 0;
  const readiness = Math.min(
    100,
    Math.max(0, Number(resume?.readiness) || 0)
  );

  const menuItemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition hover:bg-slate-50 disabled:opacity-50";

  return (
    <article
      className={cn(
        "group relative border-b border-slate-100 px-4 py-5 transition-colors last:border-b-0 sm:px-5",
        active ? "bg-violet-50/40" : "hover:bg-slate-50/70"
      )}
    >
      {active && (
        <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-violet-600" />
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        <span className="hidden w-5 shrink-0 pt-3 text-[10px] font-semibold tabular-nums text-slate-300 sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={onSelect}
          aria-label={`View ${resume.title}`}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
            active
              ? "bg-violet-100 text-violet-700"
              : "bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-700"
          )}
        >
          <FileText size={21} strokeWidth={1.7} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="max-w-full text-left text-sm font-bold tracking-tight text-slate-900 hover:text-violet-700"
            >
              <span className="break-words">{resume.title || "Untitled resume"}</span>
            </button>

            {resume.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-700">
                <Star size={10} fill="currentColor" />
                Default
              </span>
            )}
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
            {resume.subtitle ||
              resume.target ||
              "Add a description to organize this resume."}
          </p>

          {resume.target && (
            <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
              <BriefcaseBusiness size={11} />
              <span className="truncate">{resume.target}</span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(Array.isArray(resume.skills) ? resume.skills : [])
              .slice(0, 4)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-[10px] font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}

            {resume.skills?.length > 4 && (
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                +{resume.skills.length - 4}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 sm:hidden">
            <span className="inline-flex items-center gap-1">
              <BriefcaseBusiness size={11} />
              {applicationCount} applications
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={11} />
              {interviewCount} interviews
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-5 xl:flex">
          <div className="min-w-16">
            <p className="text-[10px] text-slate-400">Applications</p>
            <p className="mt-1 text-sm font-bold tabular-nums text-slate-800">
              {applicationCount}
            </p>
          </div>

          <div className="min-w-14">
            <p className="text-[10px] text-slate-400">Interviews</p>
            <p className="mt-1 text-sm font-bold tabular-nums text-slate-800">
              {interviewCount}
            </p>
          </div>

          <div className="min-w-14">
            <p className="text-[10px] text-slate-400">Readiness</p>
            <p className="mt-1 text-sm font-bold tabular-nums text-violet-700">
              {readiness}%
            </p>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => onMenu?.(menuOpen ? null : resume._id)}
            aria-label="Resume actions"
            aria-expanded={menuOpen}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition",
              menuOpen
                ? "bg-violet-100 text-violet-700"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
              <button
                type="button"
                className={cn(menuItemClass, "text-slate-700")}
                onClick={() => {
                  onMenu?.(null);
                  onEdit?.(resume);
                }}
              >
                <Pencil size={15} className="text-slate-400" />
                Edit resume details
              </button>

              <button
                type="button"
                className={cn(menuItemClass, "text-slate-700")}
                onClick={() => {
                  onMenu?.(null);
                  onOpenDocument?.(resume);
                }}
              >
                <ExternalLink size={15} className="text-slate-400" />
                Open PDF
              </button>

              <button
                type="button"
                className={cn(menuItemClass, "text-slate-700")}
                onClick={() => {
                  onMenu?.(null);
                  onDownload?.(resume);
                }}
              >
                <Download size={15} className="text-slate-400" />
                Download PDF
              </button>

              {!resume.isDefault && (
                <button
                  type="button"
                  disabled={busy}
                  className={cn(menuItemClass, "text-slate-700")}
                  onClick={() => {
                    onMenu?.(null);
                    onSetDefault?.(resume);
                  }}
                >
                  <Star size={15} className="text-slate-400" />
                  Set as default
                </button>
              )}

              <div className="my-1.5 border-t border-slate-100" />

              <button
                type="button"
                disabled={busy}
                className={cn(menuItemClass, "text-rose-600 hover:bg-rose-50")}
                onClick={() => {
                  onMenu?.(null);
                  onDelete?.(resume);
                }}
              >
                <Trash2 size={15} />
                Move to recycle bin
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   APPLICATION ROW
========================================================= */

const ApplicationRow = ({ application }) => {
  const status = application?.status || "applied";

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
        {getCompanyName(application).charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-900">
          {getCompanyName(application)}
        </p>

        <p className="mt-1 truncate text-[11px] text-slate-500">
          {getJobTitle(application)}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-400 sm:hidden">
          {getResumeTitle(application)}
        </p>
      </div>

      <div className="hidden min-w-28 max-w-36 sm:block">
        <p className="text-[10px] text-slate-400">Resume used</p>
        <p className="mt-1 truncate text-[11px] font-medium text-slate-600">
          {getResumeTitle(application)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[9px] font-bold capitalize",
            STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
          )}
        >
          {status.replaceAll("_", " ")}
        </span>

        <span className="text-[10px] text-slate-400">
          {formatDate(application?.createdAt)}
        </span>
      </div>

      <ChevronRight
        size={15}
        className="hidden shrink-0 text-slate-300 sm:block"
      />
    </div>
  );
};

/* =========================================================
   RESUME DETAILS DRAWER
========================================================= */

const ReadinessCircle = ({ value = 0 }) => {
  const normalizedValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  const radius = 27;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="relative h-[76px] w-[76px] shrink-0">
      <svg
        viewBox="0 0 76 76"
        className="-rotate-90"
        width="76"
        height="76"
        aria-label={`${normalizedValue}% resume readiness`}
        role="img"
      >
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="#EDE9FE"
          strokeWidth="6"
        />

        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-slate-900">
          {normalizedValue}%
        </span>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, last = false }) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 px-4 py-3.5",
      !last && "border-b border-slate-100"
    )}
  >
    <span className="shrink-0 text-xs text-slate-500">{label}</span>

    <span className="max-w-[65%] break-words text-right text-xs font-semibold text-slate-800">
      {value === null || value === undefined || value === ""
        ? "—"
        : value}
    </span>
  </div>
);

const ResumeDrawer = ({
  resume,
  onClose,
  onPreview,
  onDownload,
  onEdit,
  onSetDefault,
}) => {
  useEffect(() => {
    if (!resume) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [resume, onClose]);

  if (!resume) return null;

  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const url = getResumeUrl(resume);
  const readiness = Math.min(
    100,
    Math.max(0, Number(resume.readiness) || 0)
  );

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <button
        type="button"
        aria-label="Close resume details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
      />

      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col bg-[#F8F9FC] shadow-[-20px_0_80px_rgba(15,23,42,0.18)]">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <IconBox
              icon={FileText}
              className="bg-violet-50 text-violet-700"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {resume.title || "Untitled resume"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Resume details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={19} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                  <Sparkles size={11} />
                  Resume overview
                </span>

                <h2 className="mt-3 break-words text-lg font-bold tracking-tight text-slate-950">
                  {resume.title || "Untitled resume"}
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {resume.subtitle ||
                    "Keep your resume details relevant to your next opportunity."}
                </p>

                {resume.target && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                    <BriefcaseBusiness
                      size={14}
                      className="text-violet-600"
                    />
                    {resume.target}
                  </p>
                )}
              </div>

              <ReadinessCircle value={readiness} />
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-3">
              {[
                {
                  label: "Applications",
                  value: Number(resume.applications) || 0,
                },
                {
                  label: "Interviews",
                  value:
                    Number(resume.interviews ?? resume.Interview) || 0,
                },
                {
                  label: "Profile views",
                  value: Number(resume.views) || 0,
                },
              ].map((metric) => (
                <div key={metric.label} className="bg-white px-4 py-3">
                  <p className="text-[10px] text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  PDF document
                </h3>
                <p className="mt-1 text-[10px] text-slate-500">
                  Original uploaded file
                </p>
              </div>

              <FileText size={18} className="text-violet-600" />
            </div>

            {url ? (
              <div className="p-4">
                <button
                  type="button"
                  onClick={onPreview}
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/40"
                >
                  <IconBox
                    icon={FileText}
                    className="bg-rose-50 text-rose-600"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="break-all text-xs font-semibold text-slate-800">
                      {getResumeName(resume)}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatFileSize(resume?.resume?.sizeBytes)}
                    </p>
                  </div>

                  <Eye
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:text-violet-600"
                  />
                </button>

                <Button
                  variant="secondary"
                  className="mt-3 w-full"
                  onClick={onPreview}
                >
                  <ExternalLink size={15} />
                  Open PDF preview
                </Button>
              </div>
            ) : (
              <p className="px-4 py-6 text-xs text-slate-500">
                No PDF URL is available for this resume.
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-4">
              <h3 className="text-xs font-bold text-slate-900">
                Resume information
              </h3>
            </div>

            <DetailRow label="Target role" value={resume.target} />
            <DetailRow
              label="File size"
              value={formatFileSize(resume?.resume?.sizeBytes)}
            />
            <DetailRow
              label="Last updated"
              value={formatDate(resume.updatedAt)}
            />
            <DetailRow
              label="Default resume"
              value={resume.isDefault ? "Yes" : "No"}
              last
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-900">
                Skills
              </h3>

              <span className="text-[10px] text-slate-400">
                {skills.length} listed
              </span>
            </div>

            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-[11px] font-medium text-violet-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Add relevant skills to make this resume easier to
                identify when applying for roles.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
            <div className="flex items-start gap-3">
              <IconBox
                icon={BriefcaseBusiness}
                className="bg-white text-violet-700 shadow-sm"
              />

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Application insight
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  This resume has been associated with{" "}
                  <strong>{Number(resume.applications) || 0} applications</strong>.
                  {resume.isDefault
                    ? " It is your current default resume."
                    : " You can set it as your default resume or keep it for a specific role."}
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
          <Button
            variant="secondary"
            onClick={() => onEdit?.(resume)}
          >
            <Pencil size={15} />
            Edit details
          </Button>

          <Button onClick={() => onDownload?.(resume)}>
            <ArrowDownToLine size={15} />
            Download PDF
          </Button>

          {!resume.isDefault && (
            <Button
              variant="ghost"
              className="col-span-2"
              onClick={() => onSetDefault?.(resume)}
            >
              <Star size={15} />
              Set as default resume
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
};

/* =========================================================
   FULL PDF PREVIEW
========================================================= */

const FullPreview = ({ resume, onClose, onDownload }) => {
  const url = getResumeUrl(resume);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-[#17181C]">
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#202127] px-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <FileText size={19} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {resume?.title || "Resume preview"}
            </p>
            <p className="mt-1 truncate text-[10px] text-white/45">
              {getResumeName(resume)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => onDownload?.(resume)}
          >
            <Download size={14} />
            Download
          </Button>

          {url && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() =>
                window.open(url, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink size={14} />
              Open separately
            </Button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close PDF preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-[#292B31] p-2 sm:p-5 lg:p-8">
        {url ? (
          <iframe
            src={url}
            title={`PDF preview: ${resume?.title || "Resume"}`}
            className="h-full min-h-[75vh] w-full max-w-[1100px] flex-1 border-0 bg-white shadow-2xl"
          />
        ) : (
          <div className="m-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <FileText
              size={32}
              className="mx-auto text-white/50"
            />
            <h2 className="mt-4 text-base font-bold text-white">
              Preview unavailable
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/50">
              This resume does not have an accessible PDF URL. Check
              the uploaded file and its storage configuration.
            </p>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#202127] px-4 py-3 text-[10px] text-white/40 sm:hidden">
        <span>PDF document preview</span>

        <button
          type="button"
          onClick={() => onDownload?.(resume)}
          className="inline-flex items-center gap-2 font-semibold text-violet-300"
        >
          <Download size={14} />
          Download
        </button>
      </footer>
    </div>
  );
};

/* =========================================================
   RESUME PREFERENCES MODAL
========================================================= */

const ResumePreferencesModal = ({
  onClose,
  resumes,
  defaultResume,
  onChooseDefault,
}) => (
  <div
    className="fixed inset-0 z-[99996] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-preferences-title"
      className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
    >
      <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <IconBox
            icon={Settings2}
            className="mb-3 bg-violet-50 text-violet-700"
          />

          <h2
            id="resume-preferences-title"
            className="text-lg font-bold text-slate-950"
          >
            Resume preferences
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Choose which resume you want to use by default when
            preparing job applications.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preferences"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </header>

      <div className="space-y-3 p-5 sm:p-6">
        {resumes.length === 0 ? (
          <EmptyState
            title="No resumes available"
            description="Upload a PDF before selecting your default resume."
          />
        ) : (
          resumes.map((resume) => (
            <div
              key={resume._id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5"
            >
              <IconBox
                icon={FileText}
                size="sm"
                className="bg-violet-50 text-violet-700"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {resume.title || "Untitled resume"}
                </p>

                <p className="mt-1 truncate text-[10px] text-slate-500">
                  {resume.target || getResumeName(resume)}
                </p>
              </div>

              {resume.isDefault ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold text-violet-700">
                  <Check size={12} />
                  Default
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onChooseDefault?.(resume)}
                >
                  Set default
                </Button>
              )}
            </div>
          ))
        )}

        {defaultResume && (
          <p className="rounded-xl bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-800">
            Current default: <strong>{defaultResume.title}</strong>
          </p>
        )}
      </div>

      <footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </footer>
    </section>
  </div>
);

/* =========================================================
   MAIN PAGE
========================================================= */

function ResumePage() {
  const [activeResume, setActiveResume] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [showMenu, setShowMenu] = useState(null);
  const [editingResume, setEditingResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState(null);

  const {
    resumes: resumeData,
    handleGetAllResumes,
    handleSetIsDefault,
    handleDeleteResume,
  } = useResume();

  const {
    applications: applicationData,
    handleGetMyApplications,
  } = useApplication();

  const {
    Interviews: interviewData,
    handleGetMyInterviews,
  } = useInterview();

  const resumes = Array.isArray(resumeData) ? resumeData : [];
  const applications = Array.isArray(applicationData)
    ? applicationData
    : [];
  const interviews = Array.isArray(interviewData)
    ? interviewData
    : [];

  const activeResumes = useMemo(
    () => resumes.filter((resume) => !resume?.isDeleted),
    [resumes]
  );

  const selectedResume = useMemo(
    () =>
      activeResumes.find(
        (resume) => resume?._id === activeResume
      ) || null,
    [activeResumes, activeResume]
  );

  const defaultResume = useMemo(
    () =>
      activeResumes.find((resume) => resume?.isDefault) || null,
    [activeResumes]
  );

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const refreshResumes = useCallback(async () => {
    if (typeof handleGetAllResumes === "function") {
      await handleGetAllResumes();
    }
  }, [handleGetAllResumes]);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const tasks = [
        typeof handleGetAllResumes === "function"
          ? handleGetAllResumes()
          : Promise.resolve(),
        typeof handleGetMyApplications === "function"
          ? handleGetMyApplications()
          : Promise.resolve(),
        typeof handleGetMyInterviews === "function"
          ? handleGetMyInterviews()
          : Promise.resolve(),
      ];

      const results = await Promise.allSettled(tasks);

      const failed = results.some(
        (result) => result.status === "rejected"
      );

      if (failed) {
        setPageError(
          "Some workspace data could not be loaded. Try refreshing."
        );
      }
    } catch {
      setPageError(
        "Unable to load your workspace. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    handleGetAllResumes,
    handleGetMyApplications,
    handleGetMyInterviews,
  ]);

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    if (
      activeResume &&
      !activeResumes.some((resume) => resume._id === activeResume)
    ) {
      setActiveResume(null);
      setShowPreview(false);
    }
  }, [activeResume, activeResumes]);

  const filteredResumes = useMemo(() => {
    let result = [...activeResumes];

    if (filter === "default") {
      result = result.filter((resume) => resume.isDefault);
    }

    if (filter === "most-used") {
      result.sort(
        (a, b) =>
          (Number(b.applications) || 0) -
          (Number(a.applications) || 0)
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((resume) =>
        [
          resume.title,
          resume.subtitle,
          resume.target,
          getResumeName(resume),
          ...(Array.isArray(resume.skills) ? resume.skills : []),
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [activeResumes, filter, search]);

  const handleOpenResume = useCallback((resume) => {
    setActiveResume(resume?._id || null);
    setShowPreview(false);
    setShowMenu(null);
  }, []);

  const handleOpenDocument = useCallback(
    (resume) => {
      const opened = openDocument(resume);

      if (!opened) {
        showToast("No PDF URL is available for this resume.", "error");
      }
    },
    [showToast]
  );

  const handleDownloadResume = useCallback(
    (resume) => {
      const downloaded = downloadDocument(resume);

      if (!downloaded) {
        showToast("No PDF URL is available for this resume.", "error");
      } else {
        showToast(
          "Your download has been requested. If the file opens in a new tab, use the PDF viewer's download option."
        );
      }
    },
    [showToast]
  );

  const handleSetDefaultResume = useCallback(
    async (resume) => {
      if (!resume?._id || resume.isDefault || actionLoading) return;

      try {
        setActionLoading(true);

        const result = await handleSetIsDefault(resume._id);

        if (result?.success === false) {
          throw new Error(
            result.message || "Could not change the default resume."
          );
        }

        await refreshResumes();

        setShowPreferences(false);
        showToast(`"${resume.title}" is now your default resume.`);
      } catch (error) {
        showToast(
          error?.message || "Could not change the default resume.",
          "error"
        );
      } finally {
        setActionLoading(false);
      }
    },
    [
      actionLoading,
      handleSetIsDefault,
      refreshResumes,
      showToast,
    ]
  );

  const handleDelete = useCallback(
    async (resume) => {
      if (!resume?._id || actionLoading) return;

      const confirmed = window.confirm(
        `Move "${resume.title || "this resume"}" to the recycle bin?`
      );

      if (!confirmed) return;

      try {
        setActionLoading(true);

        const result = await handleDeleteResume(resume._id);

        if (result?.success === false) {
          throw new Error(
            result.message || "Could not move the resume to the recycle bin."
          );
        }

        await refreshResumes();

        if (activeResume === resume._id) {
          setActiveResume(null);
          setShowPreview(false);
        }

        showToast("Resume moved to the recycle bin.");
      } catch (error) {
        showToast(
          error?.message || "Could not delete the resume.",
          "error"
        );
      } finally {
        setActionLoading(false);
      }
    },
    [
      actionLoading,
      handleDeleteResume,
      refreshResumes,
      activeResume,
      showToast,
    ]
  );

  const handleResumeCreated = useCallback(async () => {
    setShowCreate(false);

    try {
      await refreshResumes();
      showToast("Your new resume has been uploaded.");
    } catch {
      showToast(
        "The upload completed, but refreshing your resume list failed.",
        "error"
      );
    }
  }, [refreshResumes, showToast]);

  const handleResumeUpdated = useCallback(
    async () => {
      try {
        await refreshResumes();
        showToast("Resume details updated successfully.");
      } catch {
        showToast(
          "Changes were saved, but refreshing the list failed.",
          "error"
        );
      }
    },
    [refreshResumes, showToast]
  );

  const handleQuickAction = (action) => {
    if (action === "upload") {
      setShowCreate(true);
      return;
    }

    if (action === "preferences") {
      setShowPreferences(true);
      return;
    }

    if (action === "role-version") {
      setShowCreate(true);
    }
  };

  const applicationCount = applications.length;
  const interviewCount = interviews.length;
  const resumeCount = activeResumes.length;

  const profileViews = activeResumes.reduce(
    (total, resume) => total + (Number(resume?.views) || 0),
    0
  );

  const totalResumeApplications = activeResumes.reduce(
    (total, resume) =>
      total + (Number(resume?.applications) || 0),
    0
  );

 return (
  <div className="min-h-full w-full bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8">
    <div className="mx-auto w-full max-w-[1440px] space-y-7">
      {/* PAGE HEADER */}
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-600" />
            Peer.Hiring / Career workspace
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            My resumes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Organize your professional documents, manage resume
            versions, and choose the right resume for every application.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm">
            <FileText size={17} className="text-violet-600" />
            {resumeCount} resumes
          </div>

          <Button
            onClick={() => setShowCreate(true)}
            disabled={actionLoading}
          >
            <Plus size={16} />
            Add resume
          </Button>

          <Button
            variant="secondary"
            onClick={loadPage}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#211044] via-[#48218E] to-[#6D28D9] p-6 text-white shadow-lg shadow-violet-200/40 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              <Sparkles size={14} />
              Your career, in progress
            </div>

            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              One strong resume.
              <br className="hidden sm:block" />
              Multiple career opportunities.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/85">
              Keep your resumes organized, customize versions for
              different roles, and make every job application count.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                className="bg-purple-600 text-white hover:bg-white hover:text-purple-700 border border-purple-600 transition-colors duration-200"
                onClick={() => setShowCreate(true)}
              >
                <Upload size={15} />
                Upload a resume
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowPreferences(true)}
              >
                <Settings2 size={15} />
                Preferences
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[390px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
              <FileText size={19} className="text-violet-200" />
              <p className="mt-4 text-2xl font-bold">{resumeCount}</p>
              <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                Active resumes
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
              <BriefcaseBusiness size={19} className="text-violet-200" />
              <p className="mt-4 text-2xl font-bold">
                {totalResumeApplications}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                Applications
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
              <Eye size={19} className="text-violet-200" />
              <p className="mt-4 text-2xl font-bold">{profileViews}</p>
              <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                Views
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Total resumes"
          value={resumeCount}
          description="Your available resume versions"
          tone="bg-violet-50 text-violet-700"
        />

        <MetricCard
          icon={Star}
          label="Default resume"
          value={defaultResume ? 1 : 0}
          description={
            defaultResume
              ? "Your preferred application document"
              : "Choose a preferred resume"
          }
          tone="bg-amber-50 text-amber-700"
        />

        <MetricCard
          icon={BriefcaseBusiness}
          label="Applications"
          value={applicationCount}
          description="Applications in your workspace"
          tone="bg-blue-50 text-blue-700"
        />

        <MetricCard
          icon={Eye}
          label="Resume views"
          value={profileViews}
          description="Combined view count"
          tone="bg-emerald-50 text-emerald-700"
        />
      </section>

      {/* ERROR MESSAGE */}
      {pageError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-amber-700"
            />
            <p className="text-sm leading-6 text-amber-800">
              {pageError}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={loadPage}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Try again
          </Button>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 space-y-6">
          {/* RESUME LIBRARY */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  Resume library
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, review, and manage your resume documents.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                <TrendingUp size={15} className="text-violet-600" />
                Keep your career documents ready
              </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, role, filename, or skill..."
                  aria-label="Search resumes"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-500 focus-within:border-violet-300">
                <Filter size={16} />

                <span className="shrink-0 text-xs font-medium">
                  Filter
                </span>

                <ChevronDown
                  size={14}
                  className="order-last text-slate-400"
                />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter resumes"
                  className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-xs font-semibold text-slate-700 outline-none sm:min-w-[130px]"
                >
                  <option value="all">All resumes</option>
                  <option value="default">Default resume</option>
                  <option value="most-used">Most used</option>
                </select>
              </label>
            </div>

            {/* LIBRARY STATUS TABS */}
            <div className="overflow-x-auto border-b border-slate-100 px-4 sm:px-6">
              <div className="flex min-w-max items-center gap-6 sm:gap-8">
                {[
                  { value: "all", label: "All resumes" },
                  { value: "default", label: "Default" },
                  { value: "most-used", label: "Most used" },
                ].map((tab) => {
                  const selected = filter === tab.value;

                  const count =
                    tab.value === "default"
                      ? activeResumes.filter((resume) => resume.isDefault)
                          .length
                      : tab.value === "most-used"
                        ? activeResumes.filter(
                            (resume) => Number(resume.applications) > 0
                          ).length
                        : activeResumes.length;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setFilter(tab.value)}
                      aria-pressed={selected}
                      className={`relative inline-flex min-h-14 items-center gap-2 whitespace-nowrap text-sm font-semibold transition ${
                        selected
                          ? "text-violet-700"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}

                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          selected
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>

                      {selected && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RESULTS HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  {filter === "default"
                    ? "Default resumes"
                    : filter === "most-used"
                      ? "Most-used resumes"
                      : "All resumes"}
                </h3>

                <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  {filteredResumes.length} results
                </span>
              </div>

              {(search || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
                >
                  <RotateCcw size={13} />
                  Clear search and filters
                </button>
              )}
            </div>

            {/* RESUME RESULTS */}
            <div className="min-w-0 space-y-3 p-4 sm:space-y-4 sm:p-5">
              {loading ? (
                <LoadingState label="Loading your resumes..." />
              ) : filteredResumes.length > 0 ? (
                filteredResumes.map((resume, index) => (
                  <div key={resume._id} className="min-w-0">
                    <ResumeCard
                      resume={resume}
                      index={index}
                      active={activeResume === resume._id}
                      menuOpen={showMenu === resume._id}
                      busy={actionLoading}
                      onSelect={() => handleOpenResume(resume)}
                      onMenu={(nextMenu) => setShowMenu(nextMenu)}
                      onEdit={setEditingResume}
                      onOpenDocument={handleOpenDocument}
                      onDownload={handleDownloadResume}
                      onSetDefault={handleSetDefaultResume}
                      onDelete={handleDelete}
                    />
                  </div>
                ))
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-5 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                    {search || filter !== "all" ? (
                      <Search size={24} />
                    ) : (
                      <FileText size={24} />
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {search || filter !== "all"
                      ? "No matching resumes"
                      : "Your resume journey starts here"}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {search || filter !== "all"
                      ? "Try a different keyword or clear your filters."
                      : "Upload your first PDF resume to keep your job application documents organized."}
                  </p>

                  {search || filter !== "all" ? (
                    <Button
                      variant="secondary"
                      className="mt-5"
                      onClick={() => {
                        setSearch("");
                        setFilter("all");
                      }}
                    >
                      <RotateCcw size={14} />
                      View all resumes
                    </Button>
                  ) : (
                    <Button
                      className="mt-5"
                      onClick={() => setShowCreate(true)}
                    >
                      <Upload size={15} />
                      Upload first resume
                    </Button>
                  )}
                </div>
              )}
            </div>

            {!loading && activeResumes.length > 0 && (
              <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredResumes.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {activeResumes.length}
                  </span>{" "}
                  resumes
                </p>

                <p className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Your resume library is up to date
                </p>
              </div>
            )}
          </section>

          {/* RECENT APPLICATIONS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <SectionHeading
                title="Recent applications"
                description="See the jobs associated with your resume documents."
                action={
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600">
                    {applicationCount} total
                  </span>
                }
              />
            </div>

            {loading ? (
              <LoadingState label="Loading applications..." />
            ) : applications.length > 0 ? (
              applications.slice(0, 5).map((application) => (
                <ApplicationRow
                  key={application._id}
                  application={application}
                />
              ))
            ) : (
              <EmptyState
                icon={BriefcaseBusiness}
                title="No applications yet"
                description="Your job applications will appear here when you apply for a role."
              />
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="min-w-0 space-y-5">
          {/* DEFAULT RESUME */}
          <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-900/10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-violet-600/30 blur-3xl" />

            <div className="relative border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <Star
                  size={15}
                  className="text-violet-300"
                  fill="currentColor"
                />
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/65">
                  Default resume
                </p>
              </div>
            </div>

            <div className="relative p-5">
              {defaultResume ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-violet-200">
                      <FileText size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-bold">
                        {defaultResume.title || "Untitled resume"}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/55">
                        {defaultResume.target ||
                          "Your preferred application document"}
                      </p>

                      <p className="mt-2 text-[10px] text-white/40">
                        Updated {formatDate(defaultResume.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="bg-purple-600 mt-5 w-full text-white hover:bg-white hover:text-purple-700 border border-purple-600 transition-colors duration-200 "
                    onClick={() => handleOpenResume(defaultResume)}
                  >
                    <Eye size={15} />
                    View resume details
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowPreferences(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-semibold text-white/55 transition hover:text-white"
                  >
                    Change default resume
                    <ChevronRight size={13} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.07] text-violet-200">
                    <Star size={21} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold">
                    Choose your default
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/55">
                    Set a preferred resume to simplify your next
                    job application.
                  </p>

                  {activeResumes.length > 0 && (
                    <Button
                      className="mt-4 w-full bg-white text-slate-950 hover:bg-violet-50"
                      onClick={() => setShowPreferences(true)}
                    >
                      <Settings2 size={15} />
                      Choose default
                    </Button>
                  )}
                </>
              )}
            </div>
          </section>

          {/* WORKSPACE OVERVIEW */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <SectionHeading
              title="Workspace overview"
              description="Your career documents at a glance."
            />

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Active resumes",
                  value: resumeCount,
                  icon: FileText,
                  color: "bg-violet-50 text-violet-700",
                },
                {
                  label: "Applications",
                  value: applicationCount,
                  icon: BriefcaseBusiness,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Interviews",
                  value: interviewCount,
                  icon: Clock3,
                  color: "bg-emerald-50 text-emerald-700",
                },
                {
                  label: "Resume views",
                  value: profileViews,
                  icon: Eye,
                  color: "bg-indigo-50 text-indigo-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3"
                >
                  <IconBox
                    icon={item.icon}
                    size="sm"
                    className={item.color}
                  />

                  <p className="flex-1 text-xs font-medium text-slate-600">
                    {item.label}
                  </p>

                  <p className="text-sm font-bold tabular-nums text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <SectionHeading
                title="Quick actions"
                description="Shortcuts for your resume workflow."
              />
            </div>

            <div className="space-y-1 p-2">
              {[
                {
                  id: "upload",
                  icon: Upload,
                  title: "Upload new resume",
                  description: "Add a PDF to your library",
                },
                {
                  id: "role-version",
                  icon: Copy,
                  title: "Prepare another version",
                  description: "Create a role-specific version",
                },
                {
                  id: "preferences",
                  icon: Settings2,
                  title: "Resume preferences",
                  description: "Manage your default resume",
                },
              ].map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickAction(action.id)}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-violet-50/60"
                >
                  <IconBox
                    icon={action.icon}
                    size="sm"
                    className="bg-slate-100 text-slate-500 transition group-hover:bg-violet-100 group-hover:text-violet-700"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 transition group-hover:text-violet-700">
                      {action.title}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={15}
                    className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-600"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* HELPFUL TIP */}
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-5">
            <div className="flex items-start gap-3">
              <IconBox
                icon={Zap}
                className="bg-white text-violet-700 shadow-sm"
              />

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Make every application count
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Keep separate PDF versions for different roles,
                  update their titles and skills, and set the best
                  version as your default.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-col gap-2 border-t border-slate-200/80 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Peer.Hiring · Resume workspace</p>

        <p className="inline-flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          Your career documents, organized in one place
        </p>
      </footer>
    </div>

    {/* KEEP YOUR EXISTING MODALS AND DRAWERS */}

    {selectedResume && !showPreview && (
      <ResumeDrawer
        resume={selectedResume}
        onClose={() => setActiveResume(null)}
        onPreview={() => setShowPreview(true)}
        onDownload={handleDownloadResume}
        onEdit={(resume) => setEditingResume(resume)}
        onSetDefault={handleSetDefaultResume}
      />
    )}

    {showPreview && selectedResume && (
      <FullPreview
        resume={selectedResume}
        onClose={() => setShowPreview(false)}
        onDownload={handleDownloadResume}
      />
    )}

    {showCreate && (
      <CreateResumeModal
        onClose={() => setShowCreate(false)}
        onCreated={handleResumeCreated}
      />
    )}

    {editingResume && (
      <EditResumeDetailsModal
        resume={editingResume}
        onClose={() => setEditingResume(null)}
        onUpdated={handleResumeUpdated}
      />
    )}

    {showPreferences && (
      <ResumePreferencesModal
        onClose={() => setShowPreferences(false)}
        resumes={activeResumes}
        defaultResume={defaultResume}
        onChooseDefault={handleSetDefaultResume}
      />
    )}

    <Toast toast={toast} onClose={dismissToast} />
  </div>
);
}

export default ResumePage;