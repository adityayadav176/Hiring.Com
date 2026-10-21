

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {

  useApplication,
  useInterview,

} from "../../hooks/Hook";

import {

  Video, CalendarDays, Clock3, Plus, Search, ChevronDown,

  MoreHorizontal, MapPin, Phone, CheckCircle2, XCircle,

  Pencil, X, Sparkles, CalendarClock, UserRound, Link2,

  SlidersHorizontal, LayoutGrid, List, FileText, Check,

  AlertCircle, LoaderCircle, Copy, RefreshCw, ExternalLink,

} from "lucide-react";



const FILTERS = [

  "All interviews",

  "Scheduled",

  "Accepted",

  "Rescheduled",

  "Reschedule Requested",

  "Completed",

  "Cancelled",

  "Rejected",

  "No Show",

];



const STATUS_STYLES = {

  Scheduled: "bg-blue-50 text-blue-700 ring-blue-200",

  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Completed: "bg-violet-50 text-violet-700 ring-violet-200",

  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",

  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",

  Rescheduled: "bg-amber-50 text-amber-700 ring-amber-200",

  "Reschedule Requested": "bg-orange-50 text-orange-700 ring-orange-200",

  "No Show": "bg-slate-100 text-slate-700 ring-slate-200",

};



const EMPTY_FORM = {

  applicationId: "",

  candidateId: "",

  jobId: "",

  round: "1",

  interviewType: "Online",

  date: "",

  time: "10:00",

  duration: "45",

  timezone: "Asia/Kolkata",

  location: "",

  description: "",

  interviewRoomId: "",

};



function getId(value) {

  if (!value) return "";

  if (typeof value === "string") return value;

  return String(value._id || value.id || "");

}



function getName(value, fallback = "Unknown") {

  if (!value) return fallback;

  if (typeof value === "string") return value;

  return (

    value.name ||

    value.fullName ||

    value.title ||

    value.companyName ||

    fallback

  );

}



function normalizeInterview(raw = {}) {

  const candidate =

    raw.candidateId || raw.candidate || raw.applicant || {};

  const job = raw.jobId || raw.job || {};

  const company = raw.companyId || raw.company || {};

  const application = raw.applicationId || raw.application || {};



  const scheduledAt = raw.scheduledAt || raw.date || null;
  const dateObj = scheduledAt ? new Date(scheduledAt) : null;
  const validDate = dateObj && !Number.isNaN(dateObj.getTime());
  const timezone = raw.timezone || "Asia/Kolkata";

  const dateFormatter = validDate
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : null;
  const timeFormatter = validDate
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
    : null;
  const formattedDate = dateFormatter ? dateFormatter.format(dateObj) : "";
  const formattedTime = timeFormatter ? timeFormatter.format(dateObj) : "";

  return {

    ...raw,

    id: getId(raw) || raw.id || "",

    candidateId: getId(candidate) || getId(raw.candidateId),

    candidate: getName(candidate, raw.candidateName || "Unknown candidate"),

    email: candidate?.email || raw.candidateEmail || "",

    jobId: getId(job) || getId(raw.jobId),

    jobTitle: getName(job, raw.jobTitle || "Untitled job"),

    companyId: getId(company) || getId(raw.companyId),

    applicationId: getId(application) || getId(raw.applicationId),

    type: raw.interviewType || raw.type || "Online",

    status: raw.status || "Scheduled",

    date:
      typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
        ? raw.date
        : formattedDate || raw.date || "",

    time:
      typeof raw.time === "string" && /^\d{2}:\d{2}$/.test(raw.time)
        ? raw.time
        : formattedTime || raw.time || "",

    scheduledAt,

    duration: Number(raw.duration || 60),

    timezone: raw.timezone || "Asia/Kolkata",

    interviewer: getName(raw.recruiterId || raw.recruiter, "Recruiter"),

    roomId: raw.interviewRoomId || raw.roomId || "",

    notes: raw.description || raw.notes || "",

    round: raw.round || 1,

  };

}



function formatDate(date) {

  if (!date) return "Date not set";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return "Date not set";

  return parsed.toLocaleDateString("en-IN", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

}



function formatTime(time) {

  if (!time) return "Time not set";

  const [hours, minutes] = time.split(":").map(Number);

  const parsed = new Date();

  parsed.setHours(hours, minutes, 0, 0);

  return parsed.toLocaleTimeString("en-IN", {

    hour: "numeric",

    minute: "2-digit",

    hour12: true,

  });

}



function initials(name = "") {

  return name

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part) => part[0]?.toUpperCase() || "")

    .join("") || "??";

}



function toScheduledAt(date, time, timezone = "Asia/Kolkata") {
  if (!date || !time || !timezone) return "";

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return "";

  // Convert a selected wall-clock time in the chosen IANA timezone to UTC.
  // Iteration accounts for timezone offsets and daylight-saving changes.
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = targetUtc;

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

    for (let i = 0; i < 4; i += 1) {
      const parts = Object.fromEntries(
        formatter.formatToParts(new Date(candidate))
          .filter((part) => part.type !== "literal")
          .map((part) => [part.type, Number(part.value)])
      );
      const representedUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second
      );
      const difference = targetUtc - representedUtc;
      candidate += difference;
      if (difference === 0) break;
    }

    const result = new Date(candidate);
    return Number.isNaN(result.getTime()) ? "" : result.toISOString();
  } catch {
    return "";
  }
}



function MetricCard({ icon: Icon, label, value, caption, tone }) {

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

      <p className="mt-4 text-xs text-slate-500">{caption}</p>

    </div>

  );

}



function Modal({ title, subtitle, onClose, children, wide = false }) {

  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"

      onMouseDown={(event) => {

        if (event.target === event.currentTarget) onClose();

      }}

    >

      <section

        className={`my-auto w-full overflow-hidden rounded-3xl bg-white shadow-2xl ${

          wide ? "max-w-3xl" : "max-w-xl"

        }`}

      >

        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">

          <div>

            <h2 className="text-xl font-bold tracking-tight text-slate-950">

              {title}

            </h2>

            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

          </div>

          <button

            onClick={onClose}

            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"

            _aria-label_="Close modal"

          >

            <X size={19} />

          </button>

        </div>

        {children}

      </section>

    </div>

  );

}



const fieldClass =

  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";



export default function RecruiterInterviews() {



  const {

    interview,

    interviews: contextInterviews,

    recruiterInterviews,

    recruiterInterviewStats,

    loading,

    error,

    handleScheduleInterview,

    handleGetRecruiterInterviews,

    handleGetRecruiterInterviewById,

    handleGetRecruiterInterviewStats,

    handleRescheduleInterview,

    handleChangeInterviewStatus,

    handleCancelRecruiterInterview,


  } = useInterview();

  const { applications, handleGetRecruiterApplications } = useApplication();
  const [applicationSearch, setApplicationSearch] = useState("");
const [applicationPickerOpen, setApplicationPickerOpen] = useState(false);

const [loadingApplications, setLoadingApplications] = useState(false);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("All interviews");

  const [typeFilter, setTypeFilter] = useState("All types");

  const [view, setView] = useState("grid");

  const [sortBy, setSortBy] = useState("date");

  const [modal, setModal] = useState("");

  const [selected, setSelected] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");

  const [formError, setFormError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);



  const refresh = useCallback(async () => {

    const results = await Promise.allSettled([

      handleGetRecruiterInterviews({ page: 1, limit: 100, sort: "oldest" }),

      handleGetRecruiterInterviewStats(),

    ]);



    const failed = results.find((result) => result.status === "rejected");

    if (failed) {

      setNotice(failed.reason?.message || "Some interview data could not be loaded.");

    }

  }, [handleGetRecruiterInterviews, handleGetRecruiterInterviewStats]);



  useEffect(() => {

    refresh();

  }, [refresh]);



  const sourceInterviews = useMemo(() => {

    const source =

      Array.isArray(recruiterInterviews) && recruiterInterviews.length

        ? recruiterInterviews

        : Array.isArray(contextInterviews)

          ? contextInterviews

          : [];



    const unique = new Map();

    source.forEach((item) => {

      const normalized = normalizeInterview(item);

      if (normalized.id) unique.set(normalized.id, normalized);

    });



    return [...unique.values()];

  }, [recruiterInterviews, contextInterviews]);



  const metrics = useMemo(() => {

    const now = new Date();

    const upcoming = sourceInterviews.filter((item) => {

      const scheduled = item.scheduledAt

        ? new Date(item.scheduledAt)

        : new Date(`${item.date}T${item.time || "00:00"}:00`);



      return (

        ["Scheduled", "Accepted", "Rescheduled"].includes(item.status) &&

        !Number.isNaN(scheduled.getTime()) &&

        scheduled >= now

      );

    });



    return {

      total: recruiterInterviewStats?.total ?? sourceInterviews.length,

      upcoming: recruiterInterviewStats?.upcoming ?? upcoming.length,

      completed:

        recruiterInterviewStats?.completed ??

        sourceInterviews.filter((item) => item.status === "Completed").length,

      online: sourceInterviews.filter(

        (item) =>

          item.type === "Online" &&

          ["Scheduled", "Accepted", "Rescheduled"].includes(item.status)

      ).length,

    };

  }, [sourceInterviews, recruiterInterviewStats]);



  const filtered = useMemo(() => {

    let result = sourceInterviews.filter((item) => {

      const query = search.trim().toLowerCase();

      const matchesSearch =

        !query ||

        [

          item.candidate,

          item.email,

          item.jobTitle,

          item.id,

          item.interviewer,

          item.roomId,

          item.applicationId,

        ].some((value) => String(value || "").toLowerCase().includes(query));



      const matchesStatus =

        activeFilter === "All interviews" || item.status === activeFilter;

      const matchesType = typeFilter === "All types" || item.type === typeFilter;



      return matchesSearch && matchesStatus && matchesType;

    });



    result = [...result].sort((a, b) => {

      if (sortBy === "candidate") return a.candidate.localeCompare(b.candidate);

      if (sortBy === "recent") {

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

      }



      const aDate = a.scheduledAt || `${a.date}T${a.time}`;

      const bDate = b.scheduledAt || `${b.date}T${b.time}`;

      return String(aDate).localeCompare(String(bDate));

    });



    return result;

  }, [sourceInterviews, search, activeFilter, typeFilter, sortBy]);



  function updateForm(key, value) {

    setForm((current) => ({ ...current, [key]: value }));

  }



const openCreate = async () => {
  setEditingId(null);
  setApplicationSearch("");
setApplicationPickerOpen(false);
  setSelected(null);
  setForm(EMPTY_FORM);
  setFormError("");
  setModal("create");

  try {
    setLoadingApplications(true);

    await handleGetRecruiterApplications({
      page: 1,
      limit: 100,
      sortBy: "newest",
      includeDeleted: false,
    });
  } catch (error) {
    setFormError(
      error.message || "Failed to load applications."
    );
  } finally {
    setLoadingApplications(false);
  }
};

const getApplicationId = (application) =>
  application?._id || application?.applicationId || "";

const getApplicationCandidate = (application) =>
  application?.candidateId || application?.candidate || {};

const getApplicationJob = (application) =>
  application?.jobId || application?.job || {};

const handleApplicationSelect = (applicationId) => {
  const selectedApplication = applications.find(
    (item) => getApplicationId(item) === applicationId
  );

  if (!selectedApplication) return;

  const candidate = getApplicationCandidate(selectedApplication);
  const job = getApplicationJob(selectedApplication);

  setForm((prev) => ({
    ...prev,
    applicationId: getApplicationId(selectedApplication),
    candidateId: getId(candidate),
    jobId: getId(job),
  }));

  setApplicationPickerOpen(false);
  setApplicationSearch("");
  setFormError("");
};

const filteredApplications = useMemo(() => {
  const query = applicationSearch.trim().toLowerCase();

  const list = Array.isArray(applications) ? applications : [];

  if (!query) return list;

  return list.filter((item) => {
    const candidate = getApplicationCandidate(item);
    const job = getApplicationJob(item);

    return [
      candidate?.name,
      candidate?.fullName,
      candidate?.email,
      job?.title,
      job?.jobTitle,
      item?.status,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });
}, [applications, applicationSearch]);

const selectedApplication = useMemo(
  () =>
    applications.find(
      (item) => getApplicationId(item) === form.applicationId
    ),
  [applications, form.applicationId]
);



  function openEdit(item) {

    const normalized = normalizeInterview(item);

    setEditingId(normalized.id);

    setSelected(normalized);



    setForm({

      ...EMPTY_FORM,

      applicationId: normalized.applicationId,

      candidateId: normalized.candidateId,

      jobId: normalized.jobId,

      round: String(normalized.round || 1),

      interviewType: normalized.type,

      date: normalized.date,

      time: normalized.time,

      duration: String(normalized.duration || 60),

      timezone: normalized.timezone || "Asia/Kolkata",

      location: normalized.location || "",

      description: normalized.notes || "",

      interviewRoomId: normalized.roomId || "",

    });



    setFormError("");

    setModal("create");

  }



  async function submitInterview(event) {

    event.preventDefault();

    setFormError("");



    if (!form.applicationId) {
  setFormError("Please select an application first.");
  return;
}



    if (!form.date || !form.time) {

      setFormError("Please select an interview date and start time.");

      return;

    }



    if (

      ["Offline", "Phone"].includes(form.interviewType) &&

      !form.location.trim()

    ) {

      setFormError(

        "Enter the location or contact instructions for this interview."

      );

      return;

    }



    const roundNumber = Number(form.round);
    const durationNumber = Number(form.duration);

    if (!Number.isSafeInteger(roundNumber) || roundNumber < 1 || roundNumber > 50) {
      setFormError("Interview round must be a whole number between 1 and 50.");
      return;
    }

    if (!Number.isSafeInteger(durationNumber) || durationNumber < 5 || durationNumber > 480) {
      setFormError("Duration must be a whole number between 5 and 480 minutes.");
      return;
    }

    const scheduledAt = toScheduledAt(form.date, form.time, form.timezone);

    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {

      setFormError("The interview must be scheduled for a future time.");

      return;

    }



   const payload = {
  application: form.applicationId,
  round: Number(form.round),
  interviewType: form.interviewType,
  location: form.interviewType === "Offline"
    ? form.location.trim()
    : "",
  scheduledAt: form.scheduledAt,
  duration: Number(form.duration),
  timezone: form.timezone || "Asia/Kolkata",
  description: form.description.trim(),
};


    setSubmitting(true);



    try {

      if (editingId) {

        await handleRescheduleInterview({

          interviewId: editingId,

          scheduledAt,

          rescheduleReason: form.description || "Rescheduled by recruiter",

        });



        // If the type or other fields changed, persist those through the

        // status/update API only if your backend supports those fields.

        setNotice("Interview rescheduled successfully.");

      } else {

        await handleScheduleInterview({ details: payload });

        setNotice("Interview scheduled successfully.");

      }



      setModal("");

      await refresh();

    } catch (err) {

      setFormError(err?.message || "The interview could not be saved.");

    } finally {

      setSubmitting(false);

    }

  }



  async function openDetails(item) {

    setSelected(item);

    setModal("details");



    try {

      const id = getId(item);

      if (!id) return;



      const result = await handleGetRecruiterInterviewById({

        interviewId: id,

      });



      if (result) setSelected(normalizeInterview(result));

    } catch (err) {

      setNotice(err?.message || "Could not load interview details.");

    }

  }



  async function changeStatus(item, status) {

    const id = getId(item);

    if (!id) {

      setNotice("This interview does not have a valid database ID.");

      return;

    }



    try {

      if (status === "Cancelled") {

        await handleCancelRecruiterInterview({

          interviewId: id,

          cancellationReason: "Cancelled by recruiter",

        });

      } else {

        await handleChangeInterviewStatus({

          interviewId: id,

          status,

        });

      }



      setSelected((current) =>

        current && getId(current) === id ? { ...current, status } : current

      );



      setNotice(`Interview marked ${status.toLowerCase()}.`);

      await refresh();

    } catch (err) {

      setNotice(err?.message || "Could not update interview status.");

    }

  }



  async function copyRoom(roomId) {

    if (!roomId) return;



    try {

      await navigator.clipboard.writeText(roomId);

      setNotice("Room ID copied to clipboard.");

    } catch {

      setNotice(`Room ID: ${roomId}`);

    }

  }



  function InterviewCard({ item }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const canCancel = ["Scheduled", "Accepted", "Rescheduled"].includes(

      item.status

    );



    return (

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6">

        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3.5">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-sm font-bold text-violet-700">

              {initials(item.candidate)}

            </div>



            <div className="min-w-0">

              <button

                onClick={() => openDetails(item)}

                className="truncate text-left text-base font-bold text-slate-900 hover:text-violet-700"

              >

                {item.candidate}

              </button>

              <p className="mt-1 truncate text-xs text-slate-500">

                {item.jobTitle}

              </p>

              <p className="mt-1 break-all text-[11px] text-slate-400">

                {item.id}

              </p>

            </div>

          </div>



          <div className="relative">

            <button

              onClick={() => setMenuOpen((value) => !value)}

              _aria-label_="Interview actions"

              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"

            >

              <MoreHorizontal size={20} />

            </button>



            {menuOpen && (

              <div className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

                <button

                  onClick={() => {

                    setMenuOpen(false);

                    openDetails(item);

                  }}

                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"

                >

                  <FileText size={15} /> View details

                </button>

                <button

                  onClick={() => {

                    setMenuOpen(false);

                    openEdit(item);

                  }}

                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"

                >

                  <Pencil size={15} /> Reschedule

                </button>

                {item.roomId && (

                  <button

                    onClick={() => {

                      setMenuOpen(false);

                      copyRoom(item.roomId);

                    }}

                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"

                  >

                    <Copy size={15} /> Copy room ID

                  </button>

                )}

                {canCancel && (

                  <button

                    onClick={() => {

                      setMenuOpen(false);

                      changeStatus(item, "Cancelled");

                    }}

                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"

                  >

                    <XCircle size={15} /> Cancel interview

                  </button>

                )}

              </div>

            )}

          </div>

        </div>



        <div className="mt-5 flex flex-wrap items-center gap-2">

          <span

            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${

              STATUS_STYLES[item.status] || STATUS_STYLES.Scheduled

            }`}

          >

            {item.status}

          </span>



          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">

            {item.type === "Online" ? (

              <Video size={12} />

            ) : item.type === "Phone" ? (

              <Phone size={12} />

            ) : (

              <MapPin size={12} />

            )}

            {item.type}

          </span>



          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">

            Round {item.round}

          </span>

        </div>



        <div className="mt-5 space-y-3 rounded-xl bg-slate-50/80 p-4">

          <div className="flex items-center gap-3 text-sm">

            <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">

              <CalendarDays size={16} />

            </div>

            <div>

              <p className="font-semibold text-slate-800">

                {formatDate(item.date)}

              </p>

              <p className="mt-0.5 text-xs text-slate-500">

                {formatTime(item.time)} · {item.duration} minutes

              </p>

            </div>

          </div>



          <div className="flex items-center gap-3 text-sm">

            <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">

              <UserRound size={16} />

            </div>

            <div className="min-w-0">

              <p className="text-xs text-slate-500">Interviewer</p>

              <p className="mt-0.5 truncate font-semibold text-slate-800">

                {item.interviewer}

              </p>

            </div>

          </div>



          {item.type === "Online" && (

            <div className="flex items-center gap-3 text-sm">

              <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">

                <Link2 size={16} />

              </div>

              <div className="min-w-0">

                <p className="text-xs text-slate-500">Meeting room</p>

                <p className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-700">

                  {item.roomId || "Room not configured"}

                </p>

              </div>

            </div>

          )}

        </div>



        <div className="mt-5 flex gap-2">

          <button

            onClick={() => openDetails(item)}

            className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"

          >

            View details

          </button>

          <button

            onClick={() => openEdit(item)}

            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-violet-800"

          >

            <CalendarClock size={15} /> Reschedule

          </button>

        </div>

      </article>

    );

  }



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

              Interviews<span className="text-violet-600">.</span>

            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

              Schedule conversations, coordinate with candidates, and keep

              your hiring process moving forward.

            </p>

          </div>



          <div className="flex flex-wrap gap-2">

            <button

              onClick={refresh}

              disabled={loading}

              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"

            >

              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />

              Refresh

            </button>

            <button

              onClick={openCreate}

              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800"

            >

              <Plus size={19} /> Schedule interview

            </button>

          </div>

        </header>



        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#24104F] via-[#5125A5] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8 lg:p-9">

          <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />



          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">

                <Sparkles size={14} /> Your interview command center

              </div>

              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">

                Every great hire

                <br className="hidden sm:block" /> starts with a conversation.

              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100/90">

                Manage real interview records, track progress, and keep each

                hiring round organized.

              </p>

              <button

                onClick={() => {

                  setActiveFilter("Scheduled");

                  setTypeFilter("Online");

                }}

                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"

              >

                <Video size={17} /> Online interviews

              </button>

            </div>



            <div className="grid grid-cols-2 gap-3 sm:min-w-[290px]">

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

                <CalendarDays size={20} className="text-violet-200" />

                <p className="mt-4 text-3xl font-bold">{metrics.upcoming}</p>

                <p className="mt-1 text-xs font-medium text-violet-100">

                  Upcoming interviews

                </p>

              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">

                <Video size={20} className="text-violet-200" />

                <p className="mt-4 text-3xl font-bold">{metrics.online}</p>

                <p className="mt-1 text-xs font-medium text-violet-100">

                  Active online meetings

                </p>

              </div>

            </div>

          </div>

        </section>



        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard

            icon={CalendarDays}

            label="Total interviews"

            value={metrics.total}

            caption="Recruiter interview records"

            tone="bg-violet-50 text-violet-700"

          />

          <MetricCard

            icon={CalendarClock}

            label="Upcoming"

            value={metrics.upcoming}

            caption="Scheduled or accepted"

            tone="bg-blue-50 text-blue-700"

          />

          <MetricCard

            icon={CheckCircle2}

            label="Completed"

            value={metrics.completed}

            caption="Interviews already finished"

            tone="bg-emerald-50 text-emerald-700"

          />

          <MetricCard

            icon={Video}

            label="Online meetings"

            value={metrics.online}

            caption="Active online interviews"

            tone="bg-amber-50 text-amber-700"

          />

        </section>



        {(error || notice) && (

          <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-white p-4 text-sm text-slate-700">

            <AlertCircle size={18} className="mt-0.5 shrink-0 text-violet-600" />

            <p className="flex-1">{notice || error}</p>

            <button

              onClick={() => setNotice("")}

              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"

              _aria-label_="Dismiss message"

            >

              <X size={15} />

            </button>

          </div>

        )}



        <section className="space-y-5">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900">

                Interview schedule

              </h2>

              <p className="mt-1 text-sm text-slate-500">

                Manage candidate meetings and keep every round organized.

              </p>

            </div>

            <span className="text-xs font-medium text-slate-500">

              Showing {filtered.length} of {sourceInterviews.length} interviews

            </span>

          </div>



          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">

            <div className="flex flex-col gap-3 xl:flex-row">

              <div className="relative flex-1">

                <Search

                  size={18}

                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"

                />

                <input

                  value={search}

                  onChange={(event) => setSearch(event.target.value)}

                  placeholder="Search candidate, job, interviewer or room ID..."

                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"

                />

              </div>



              <div className="flex flex-wrap gap-2">

                <label className="relative flex h-12 min-w-[145px] flex-1 items-center sm:flex-none">

                  <SlidersHorizontal

                    size={15}

                    className="pointer-events-none absolute left-3 text-slate-500"

                  />

                  <select

                    value={typeFilter}

                    onChange={(event) => setTypeFilter(event.target.value)}

                    className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"

                  >

                    <option>All types</option>

                    <option>Online</option>

                    <option>Offline</option>

                    <option>Phone</option>

                  </select>

                  <ChevronDown

                    size={15}

                    className="pointer-events-none absolute right-3 text-slate-400"

                  />

                </label>



                <label className="relative flex h-12 min-w-[145px] flex-1 items-center sm:flex-none">

                  <select

                    value={sortBy}

                    onChange={(event) => setSortBy(event.target.value)}

                    className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"

                  >

                    <option value="date">Date & time</option>

                    <option value="recent">Recently created</option>

                    <option value="candidate">Candidate A–Z</option>

                  </select>

                  <ChevronDown

                    size={15}

                    className="pointer-events-none absolute right-3 text-slate-400"

                  />

                </label>



                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">

                  <button

                    onClick={() => setView("grid")}

                    _aria-label_="Grid view"

                    className={`rounded-lg p-2.5 ${

                      view === "grid"

                        ? "bg-white text-violet-700 shadow-sm"

                        : "text-slate-400 hover:text-slate-700"

                    }`}

                  >

                    <LayoutGrid size={18} />

                  </button>

                  <button

                    onClick={() => setView("list")}

                    _aria-label_="List view"

                    className={`rounded-lg p-2.5 ${

                      view === "list"

                        ? "bg-white text-violet-700 shadow-sm"

                        : "text-slate-400 hover:text-slate-700"

                    }`}

                  >

                    <List size={18} />

                  </button>

                </div>

              </div>

            </div>



            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

              {FILTERS.map((filter) => {

                const count =

                  filter === "All interviews"

                    ? sourceInterviews.length

                    : sourceInterviews.filter(

                        (item) => item.status === filter

                      ).length;



                return (

                  <button

                    key={filter}

                    onClick={() => setActiveFilter(filter)}

                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${

                      activeFilter === filter

                        ? "bg-violet-700 text-white shadow-md shadow-violet-200"

                        : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"

                    }`}

                  >

                    {filter}

                    <span

                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${

                        activeFilter === filter

                          ? "bg-white/15 text-white"

                          : "bg-white text-slate-500"

                      }`}

                    >

                      {count}

                    </span>

                  </button>

                );

              })}

            </div>

          </div>



          {loading && sourceInterviews.length === 0 ? (

            <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500">

              <LoaderCircle className="animate-spin" size={20} />

              Loading interviews...

            </div>

          ) : filtered.length > 0 ? (

            <div

              className={

                view === "grid"

                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"

                  : "flex flex-col gap-3"

              }

            >

              {filtered.map((item) => (

                <InterviewCard key={item.id} item={item} />

              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">

                <CalendarDays size={24} />

              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">

                No interviews found

              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">

                Try a different filter or schedule a new interview.

              </p>

              <button

                onClick={() => {

                  setSearch("");

                  setActiveFilter("All interviews");

                  setTypeFilter("All types");

                }}

                className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"

              >

                Clear filters

              </button>

            </div>

          )}

        </section>



        {modal === "create" && (

          <Modal

            title={editingId ? "Reschedule interview" : "Schedule an interview"}

            subtitle="Use real application, candidate, and job IDs from Peer.Hiring."

            onClose={() => setModal("")}

            wide

          >

            <form

              onSubmit={submitInterview}

              className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-6 sm:px-7"

            >

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">

                  Application references

                </p>


<div className="space-y-3">
  <label
    htmlFor="application-search"
    className="text-sm font-semibold text-slate-700"
  >
    Select application <span className="text-rose-500">*</span>
  </label>

  {/* Selected application */}
  {form.applicationId && (
    <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 p-3 sm:p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
        {initials(
          selectedApplication
            ? getName(
                getApplicationCandidate(selectedApplication),
                "Candidate"
              )
            : selected?.candidate || "Candidate"
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">
          {selectedApplication
            ? getName(
                getApplicationCandidate(selectedApplication),
                "Candidate"
              )
            : selected?.candidate || "Selected candidate"}
        </p>

        <p className="mt-1 truncate text-xs text-slate-600">
          {selectedApplication
            ? getApplicationCandidate(selectedApplication)?.email ||
              "Email unavailable"
            : selected?.email || "Email unavailable"}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-violet-700">
          {selectedApplication
            ? getName(
                getApplicationJob(selectedApplication),
                "Job title unavailable"
              )
            : selected?.jobTitle || "Selected application"}
        </p>
      </div>

      {!editingId && (
        <button
          type="button"
          onClick={() => {
            setForm((prev) => ({
              ...prev,
              applicationId: "",
              candidateId: "",
              jobId: "",
            }));
            setApplicationSearch("");
            setApplicationPickerOpen(true);
          }}
          className="shrink-0 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
        >
          Change
        </button>
      )}
    </div>
  )}

  {/* Search and results */}
  {!form.applicationId && (
    <div className="relative">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="application-search"
          type="text"
          autoComplete="off"
          value={applicationSearch}
          onFocus={() => setApplicationPickerOpen(true)}
          onChange={(event) => {
            setApplicationSearch(event.target.value);
            setApplicationPickerOpen(true);
          }}
          placeholder="Search candidate, email, or job title..."
          disabled={loadingApplications || Boolean(editingId)}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {applicationPickerOpen && !editingId && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Applications
            </p>

            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">
              {filteredApplications.length}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto overscroll-contain p-2">
            {loadingApplications ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading applications...
              </div>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((item) => {
                const applicationId = getApplicationId(item);
                const candidate = getApplicationCandidate(item);
                const job = getApplicationJob(item);

                const candidateName =
                  getName(candidate, "") ||
                  candidate?.email ||
                  "Candidate";

                const jobTitle =
                  job?.title ||
                  job?.jobTitle ||
                  item?.jobTitle ||
                  "Job title unavailable";

                const avatarUrl =
                  typeof candidate?.avatar === "string"
                    ? candidate.avatar
                    : candidate?.avatar?.url;

                return (
                  <button
                    key={applicationId}
                    type="button"
                    onClick={() =>
                      handleApplicationSelect(applicationId)
                    }
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-violet-50 focus:bg-violet-50 focus:outline-none"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
                        {initials(candidateName)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {candidateName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {candidate?.email || "Email unavailable"}
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-violet-700">
                        {jobTitle}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="max-w-28 truncate rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-600">
                        {String(item.status || "applied").replaceAll(
                          "_",
                          " "
                        )}
                      </span>

                      <span className="text-xs font-semibold text-violet-600">
                        Select
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-9 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Search size={20} />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-800">
                  {applications.length === 0
                    ? "No applications available"
                    : "No matching applications"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {applications.length === 0
                    ? "Applications for your company's jobs will appear here."
                    : "Try a different candidate name, email, or job title."}
                </p>
              </div>
            )}
          </div>

          {!loadingApplications &&
            applications.length > 0 &&
            !applicationSearch && (
              <div className="border-t border-slate-100 px-4 py-2.5">
                <p className="text-[11px] text-slate-400">
                  Showing loaded applications. More results may be available
                  on other pages.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  )}

  {!form.applicationId && (
    <p className="text-xs leading-5 text-slate-500">
      Search and select an application. Candidate and job references will
      be filled automatically.
    </p>
  )}
</div>

              </div>



              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">

                  Schedule and format

                </p>

                <div className="grid gap-4 sm:grid-cols-2">

                  <label className="text-sm font-semibold text-slate-700">

                    Interview type *

                    <select

                      value={form.interviewType}

                      onChange={(e) => updateForm("interviewType", e.target.value)}

                      className={fieldClass}

                    >

                      <option>Online</option>

                      <option>Offline</option>

                    </select>

                  </label>



                  <label className="text-sm font-semibold text-slate-700">

                    Round *

                    <input

                      type="number"

                      min="1"

                      max="50"

                      value={form.round}

                      onChange={(e) => updateForm("round", e.target.value)}

                      className={fieldClass}

                      required

                    />

                  </label>



                  <label className="text-sm font-semibold text-slate-700">

                    Duration *

                    <select

                      value={form.duration}

                      onChange={(e) => updateForm("duration", e.target.value)}

                      className={fieldClass}

                    >

                      <option value="15">15 minutes</option>

                      <option value="30">30 minutes</option>

                      <option value="45">45 minutes</option>

                      <option value="60">60 minutes</option>

                      <option value="90">90 minutes</option>

                      <option value="120">120 minutes</option>

                    </select>

                  </label>



                  <label className="text-sm font-semibold text-slate-700">

                    Time zone *

                    <select

                      value={form.timezone}

                      onChange={(e) => updateForm("timezone", e.target.value)}

                      className={fieldClass}

                    >

                      <option value="Asia/Kolkata">India Standard Time (IST)</option>

                      <option value="UTC">UTC</option>

                      <option value="America/New_York">Eastern Time</option>

                      <option value="Europe/London">London</option>

                    </select>

                  </label>



                  <label className="text-sm font-semibold text-slate-700">

                    Interview date *

                    <input

                      type="date"

                      value={form.date}

                      onChange={(e) => updateForm("date", e.target.value)}

                      min={new Date().toLocaleDateString("en-CA")}

                      className={fieldClass}

                      required

                    />

                  </label>



                  <label className="text-sm font-semibold text-slate-700">

                    Start time *

                    <input

                      type="time"

                      value={form.time}

                      onChange={(e) => updateForm("time", e.target.value)}

                      className={fieldClass}

                      required

                    />

                  </label>



                  {form.interviewType !== "Online" && (

                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">

                      Location / contact instructions *

                      <input

                        value={form.location}

                        onChange={(e) => updateForm("location", e.target.value)}

                        placeholder="Office address or phone interview instructions"

                        className={fieldClass}

                        required

                      />

                    </label>

                  )}



                  {form.interviewType === "Online" && (

                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">

                      Meeting room ID (optional)

                      <input

                        value={form.interviewRoomId}

                        onChange={(e) => updateForm("interviewRoomId", e.target.value)}

                        placeholder="Leave blank if the backend generates the room ID"

                        className={fieldClass}

                      />

                    </label>

                  )}

                </div>

              </div>



              <label className="block text-sm font-semibold text-slate-700">

                Interview description / notes

                <textarea

                  value={form.description}

                  onChange={(e) => updateForm("description", e.target.value)}

                  rows={3}

                  maxLength={5000}

                  placeholder="Interview agenda, topics, or preparation notes..."

                  className={`${fieldClass} resize-y`}

                />

              </label>



              {formError && (

                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">

                  <AlertCircle size={17} className="mt-0.5 shrink-0" />

                  {formError}

                </div>

              )}



              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button

                  type="button"

                  onClick={() => setModal("")}

                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={submitting}

                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {submitting ? (

                    <LoaderCircle size={17} className="animate-spin" />

                  ) : (

                    <Check size={17} />

                  )}

                  {submitting

                    ? "Saving..."

                    : editingId

                      ? "Reschedule interview"

                      : "Schedule interview"}

                </button>

              </div>

            </form>

          </Modal>

        )}



        {modal === "details" && selected && (

          <Modal

            title="Interview details"

            subtitle="Review the persisted interview record."

            onClose={() => setModal("")}

          >

            <div className="space-y-5 px-5 py-6 sm:px-7">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">

                  {initials(selected.candidate)}

                </div>

                <div className="min-w-0">

                  <h3 className="text-lg font-bold text-slate-900">

                    {selected.candidate}

                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-500">

                    {selected.email || "No email available"}

                  </p>

                  <span

                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${

                      STATUS_STYLES[selected.status] || STATUS_STYLES.Scheduled

                    }`}

                  >

                    {selected.status}

                  </span>

                </div>

              </div>



              <div className="rounded-2xl border border-slate-200 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                  Job

                </p>

                <p className="mt-2 font-bold text-slate-900">

                  {selected.jobTitle}

                </p>

                <p className="mt-1 break-all text-xs text-slate-500">

                  Job ID: {selected.jobId || "Not available"}

                </p>

                <p className="mt-1 break-all text-xs text-slate-500">

                  Application ID: {selected.applicationId || "Not available"}

                </p>

                <p className="mt-1 break-all text-xs text-slate-500">

                  Interview ID: {selected.id}

                </p>

              </div>



              <div className="grid grid-cols-2 gap-3">

                {[

                  ["Date", formatDate(selected.date), CalendarDays],

                  ["Time", `${formatTime(selected.time)} (${selected.timezone})`, Clock3],

                  ["Duration", `${selected.duration} minutes`, CalendarClock],

                  ["Format", selected.type, selected.type === "Online" ? Video : selected.type === "Phone" ? Phone : MapPin],

                ].map(([label, value, Icon]) => (

                  <div key={label} className="rounded-xl bg-slate-50 p-4">

                    <Icon size={17} className="text-violet-600" />

                    <p className="mt-3 text-xs text-slate-500">{label}</p>

                    <p className="mt-1 break-words text-sm font-bold text-slate-800">

                      {value}

                    </p>

                  </div>

                ))}

              </div>



              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                  Interviewer

                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">

                  {selected.interviewer || "Not assigned"}

                </p>

              </div>



              {selected.roomId && (

                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">

                    <Video size={15} /> Meeting room

                  </div>

                  <p className="mt-2 break-all font-mono text-sm text-violet-950">

                    {selected.roomId}

                  </p>

                  <button

                    onClick={() => copyRoom(selected.roomId)}

                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-900"

                  >

                    <Copy size={14} /> Copy room ID

                  </button>

                </div>

              )}



              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                  Description / notes

                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">

                  {selected.notes || "No notes added."}

                </p>

              </div>



              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row">

                <button

                  onClick={() => openEdit(selected)}

                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"

                >

                  <Pencil size={16} /> Reschedule

                </button>



                {["Scheduled", "Accepted", "Rescheduled"].includes(

                  selected.status

                ) && (

                  <button

                    onClick={() => changeStatus(selected, "Cancelled")}

                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50"

                  >

                    <XCircle size={16} /> Cancel interview

                  </button>

                )}

              </div>

            </div>

          </Modal>

        )}



        {notice && (

          <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50">

            <div className="rounded-lg bg-violet-100 p-2 text-violet-700">

              <CheckCircle2 size={17} />

            </div>

            <div className="flex-1">

              <p className="text-sm font-bold text-slate-900">Peer.Hiring</p>

              <p className="mt-1 break-words text-xs leading-5 text-slate-500">

                {notice}

              </p>

            </div>

            <button

              onClick={() => setNotice("")}

              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"

              _aria-label_="Dismiss notification"

            >

              <X size={15} />

            </button>

          </div>

        )}

      </div>

    </main>

  );

}
