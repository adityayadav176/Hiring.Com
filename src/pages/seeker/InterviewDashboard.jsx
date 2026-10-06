import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  ExternalLink,
  Filter,
  Globe2,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Search,
  Sparkles,
  Star,
  Video,
  X,
  XCircle,
  Users,
  BriefcaseBusiness,
  CalendarClock,
  AlertCircle,
  ArrowUpRight,
  Phone,
  Building2,
  UserRound,
  RotateCcw,
} from "lucide-react";

const interviewsData = [
  {
    id: 1,
    company: "Microsoft",
    companyShort: "MS",
    companyColor: "bg-[#EEF0FF] text-[#5B4FE9]",
    jobTitle: "Software Engineer",
    round: "Technical Interview",
    roundNumber: 2,
    type: "Online",
    date: "Oct 10, 2026",
    time: "11:00 AM",
    endTime: "12:00 PM",
    duration: "60 min",
    interviewer: "Alex Johnson",
    interviewerRole: "Senior Software Engineer",
    status: "Scheduled",
    response: "Accepted",
    location: "Microsoft Teams",
    meetingLink: "#",
    description:
      "The interview will focus on problem solving, data structures, algorithms and your approach to designing scalable solutions.",
    preparation: [
      "Review graph and dynamic programming concepts",
      "Prepare to explain your problem-solving approach",
      "Keep your camera and microphone ready",
    ],
  },
  {
    id: 2,
    company: "Google",
    companyShort: "G",
    companyColor: "bg-[#FFF4E8] text-[#EA7A16]",
    jobTitle: "Frontend Engineer",
    round: "Coding Interview",
    roundNumber: 1,
    type: "Online",
    date: "Oct 12, 2026",
    time: "3:30 PM",
    endTime: "4:30 PM",
    duration: "60 min",
    interviewer: "Sarah Williams",
    interviewerRole: "Engineering Manager",
    status: "Scheduled",
    response: "Pending",
    location: "Google Meet",
    meetingLink: "#",
    description:
      "A practical coding session covering JavaScript, React fundamentals and frontend problem solving.",
    preparation: [
      "Revise JavaScript fundamentals",
      "Review React component patterns",
      "Be prepared for live coding",
    ],
  },
  {
    id: 3,
    company: "Amazon",
    companyShort: "A",
    companyColor: "bg-[#FFF7E6] text-[#D97706]",
    jobTitle: "Backend Developer",
    round: "System Design",
    roundNumber: 3,
    type: "Online",
    date: "Oct 15, 2026",
    time: "10:30 AM",
    endTime: "11:30 AM",
    duration: "60 min",
    interviewer: "Daniel Smith",
    interviewerRole: "Principal Engineer",
    status: "Scheduled",
    response: "Accepted",
    location: "Amazon Chime",
    meetingLink: "#",
    description:
      "System design discussion focused on APIs, databases, scalability and distributed backend systems.",
    preparation: [
      "Review REST API design",
      "Revise database indexing and caching",
      "Prepare a system design framework",
    ],
  },
  {
    id: 4,
    company: "Adobe",
    companyShort: "A",
    companyColor: "bg-[#FFF0F0] text-[#E11D48]",
    jobTitle: "Software Developer",
    round: "HR Interview",
    roundNumber: 4,
    type: "Online",
    date: "Sep 28, 2026",
    time: "2:00 PM",
    endTime: "2:30 PM",
    duration: "30 min",
    interviewer: "Emily Carter",
    interviewerRole: "Talent Partner",
    status: "Completed",
    response: "Accepted",
    location: "Google Meet",
    meetingLink: "#",
    rating: 4.5,
    recommendation: "Hire",
    description:
      "Final HR discussion covering communication, career goals and culture fit.",
    preparation: [],
  },
  {
    id: 5,
    company: "Meta",
    companyShort: "M",
    companyColor: "bg-[#EEF6FF] text-[#2563EB]",
    jobTitle: "Full Stack Engineer",
    round: "Technical Interview",
    roundNumber: 2,
    type: "Online",
    date: "Sep 22, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    duration: "60 min",
    interviewer: "Michael Brown",
    interviewerRole: "Software Engineer",
    status: "Completed",
    response: "Accepted",
    location: "Zoom",
    meetingLink: "#",
    rating: 4.2,
    recommendation: "Hold",
    description:
      "Technical discussion around frontend architecture, APIs and backend fundamentals.",
    preparation: [],
  },
  {
    id: 6,
    company: "Infosys",
    companyShort: "I",
    companyColor: "bg-[#F0FDF4] text-[#16A34A]",
    jobTitle: "Associate Software Engineer",
    round: "Technical Interview",
    roundNumber: 1,
    type: "Online",
    date: "Sep 18, 2026",
    time: "11:30 AM",
    endTime: "12:15 PM",
    duration: "45 min",
    interviewer: "Rahul Mehta",
    interviewerRole: "Technical Lead",
    status: "Cancelled",
    response: "Accepted",
    location: "Microsoft Teams",
    meetingLink: "#",
    description:
      "Technical interview covering programming fundamentals and basic computer science concepts.",
    preparation: [],
  },
];

const statusStyles = {
  Scheduled: "bg-[#EEF0FF] text-[#5B4FE9]",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  "Reschedule Requested": "bg-amber-50 text-amber-700",
};

function CompanyLogo({ interview, size = "md" }) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div
      className={`${
        interview.companyColor
      } ${sizes[size]} flex shrink-0 items-center justify-center rounded-2xl font-bold`}
    >
      {interview.companyShort}
    </div>
  );
}

function StatusBadge({ status }) {
  const icon =
    status === "Completed" ? (
      <CheckCircle2 size={13} />
    ) : status === "Cancelled" ? (
      <XCircle size={13} />
    ) : (
      <CalendarClock size={13} />
    );

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
      {status}
    </span>
  );
}

function InterviewCard({ interview, onView }) {
  return (
    <div className="group rounded-2xl border border-[#E8EAF2] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8D5FF] hover:shadow-[0_12px_35px_rgba(25,25,60,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo interview={interview} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[15px] font-bold text-[#171827]">
                {interview.jobTitle}
              </h3>
              <StatusBadge status={interview.status} />
            </div>

            <p className="mt-1 text-sm font-medium text-[#626579]">
              {interview.company}
            </p>
          </div>
        </div>

        <button className="rounded-lg p-1.5 text-[#8A8EA0] transition hover:bg-[#F5F5FA] hover:text-[#25263A]">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl bg-[#F8F8FC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9396A7]">
            Date
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#303145]">
            <CalendarDays size={14} className="text-[#6D28D9]" />
            {interview.date}
          </div>
        </div>

        <div className="rounded-xl bg-[#F8F8FC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9396A7]">
            Time
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#303145]">
            <Clock3 size={14} className="text-[#6D28D9]" />
            {interview.time}
          </div>
        </div>

        <div className="rounded-xl bg-[#F8F8FC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9396A7]">
            Round
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#303145]">
            <Code2 size={14} className="text-[#6D28D9]" />
            Round {interview.roundNumber}
          </div>
        </div>

        <div className="rounded-xl bg-[#F8F8FC] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9396A7]">
            Duration
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#303145]">
            <Clock3 size={14} className="text-[#6D28D9]" />
            {interview.duration}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F4] pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F0F8] text-[#6D28D9]">
            <UserRound size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#303145]">
              {interview.interviewer}
            </p>
            <p className="text-[10px] text-[#9295A5]">
              {interview.interviewerRole}
            </p>
          </div>
        </div>

        <button
          onClick={() => onView(interview)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E2F7] px-3.5 py-2 text-xs font-bold text-[#5B4FE9] transition hover:border-[#6D28D9] hover:bg-[#F7F6FF]"
        >
          View details
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

function DetailModal({ interview, onClose }) {
  const [response, setResponse] = useState(interview?.response || "Pending");

  if (!interview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10101A]/45 p-4 backdrop-blur-[3px]"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/50 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.20)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ECECF2] px-6 py-5">
          <div className="flex items-center gap-4">
            <CompanyLogo interview={interview} size="lg" />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#171827]">
                  {interview.jobTitle}
                </h2>
                <StatusBadge status={interview.status} />
              </div>

              <p className="mt-1 text-sm text-[#717487]">
                {interview.company} · {interview.round}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7B7E90] transition hover:bg-[#F5F5F8] hover:text-[#202132]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-85px)] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-[#F8F8FC] p-4">
              <CalendarDays size={17} className="text-[#6D28D9]" />
              <p className="mt-3 text-[11px] text-[#9295A5]">Date</p>
              <p className="mt-1 text-sm font-bold text-[#292A3D]">
                {interview.date}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8FC] p-4">
              <Clock3 size={17} className="text-[#6D28D9]" />
              <p className="mt-3 text-[11px] text-[#9295A5]">Time</p>
              <p className="mt-1 text-sm font-bold text-[#292A3D]">
                {interview.time}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8FC] p-4">
              <Clock3 size={17} className="text-[#6D28D9]" />
              <p className="mt-3 text-[11px] text-[#9295A5]">Duration</p>
              <p className="mt-1 text-sm font-bold text-[#292A3D]">
                {interview.duration}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8FC] p-4">
              <Globe2 size={17} className="text-[#6D28D9]" />
              <p className="mt-3 text-[11px] text-[#9295A5]">Format</p>
              <p className="mt-1 text-sm font-bold text-[#292A3D]">
                {interview.type}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <div>
                <h3 className="text-sm font-bold text-[#202132]">
                  About this interview
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6E7182]">
                  {interview.description}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#202132]">
                  Interviewer
                </h3>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#ECECF2] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EEFF] text-[#6D28D9]">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#292A3D]">
                      {interview.interviewer}
                    </p>
                    <p className="mt-0.5 text-xs text-[#858899]">
                      {interview.interviewerRole}
                    </p>
                  </div>

                  <button className="ml-auto rounded-xl border border-[#E8E8EF] p-2 text-[#737687] hover:bg-[#F7F7FA]">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>

              {interview.preparation?.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={17} className="text-[#6D28D9]" />
                    <h3 className="text-sm font-bold text-[#202132]">
                      Preparation
                    </h3>
                  </div>

                  <div className="mt-3 space-y-2">
                    {interview.preparation.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl bg-[#FAFAFD] p-3"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEEAFE] text-[#6D28D9]">
                          <Check size={12} />
                        </div>
                        <p className="text-xs leading-5 text-[#616476]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#ECECF2] p-4">
              <p className="text-xs font-bold text-[#858899]">
                Interview status
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#858899]">Round</span>
                  <span className="text-xs font-bold text-[#292A3D]">
                    {interview.roundNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#858899]">Response</span>
                  <span
                    className={`text-xs font-bold ${
                      response === "Accepted"
                        ? "text-emerald-600"
                        : response === "Rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {response}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#858899]">Platform</span>
                  <span className="text-xs font-bold text-[#292A3D]">
                    {interview.location}
                  </span>
                </div>
              </div>

              {interview.status === "Scheduled" && (
                <>
                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.18)] transition hover:bg-[#5B21B6]">
                    <Video size={15} />
                    Join Interview
                  </button>

                  <button className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E5EF] px-4 py-3 text-xs font-bold text-[#5B4FE9] transition hover:bg-[#F8F7FF]">
                    <RotateCcw size={14} />
                    Request Reschedule
                  </button>

                  {response === "Pending" && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setResponse("Accepted")}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        <Check size={14} />
                        Accept
                      </button>

                      <button
                        onClick={() => setResponse("Rejected")}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        <X size={14} />
                        Decline
                      </button>
                    </div>
                  )}
                </>
              )}

              {interview.status === "Completed" && (
                <div className="mt-5 rounded-xl bg-[#F8F7FF] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#292A3D]">
                      Interview feedback
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star size={13} fill="currentColor" />
                      {interview.rating}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#747789]">
                    Recommendation:{" "}
                    <span className="font-bold text-[#5B4FE9]">
                      {interview.recommendation}
                    </span>
                  </p>

                  <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E2DFFF] bg-white px-3 py-2.5 text-xs font-bold text-[#5B4FE9]">
                    View Full Feedback
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewDashboard() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  const filteredInterviews = useMemo(() => {
    let data = [...interviewsData];

    if (activeTab === "Upcoming") {
      data = data.filter((item) => item.status === "Scheduled");
    }

    if (activeTab === "Completed") {
      data = data.filter((item) => item.status === "Completed");
    }

    if (activeTab === "Cancelled") {
      data = data.filter((item) => item.status === "Cancelled");
    }

    if (activeTab === "All") {
      data = interviewsData;
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.company.toLowerCase().includes(query) ||
          item.jobTitle.toLowerCase().includes(query) ||
          item.round.toLowerCase().includes(query) ||
          item.interviewer.toLowerCase().includes(query)
      );
    }

    return data;
  }, [activeTab, search]);

  const nextInterview = interviewsData.find(
    (item) => item.status === "Scheduled"
  );

  const upcomingCount = interviewsData.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const completedCount = interviewsData.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = interviewsData.filter(
    (item) => item.response === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#171827]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#777A8B]">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-[#5B4FE9]">Interviews</span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#171827] sm:text-3xl">
              Interviews
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-[#777A8B]">
              Keep track of your upcoming conversations, interview rounds and
              feedback in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#E3E4EC] bg-white px-4 py-2.5 text-xs font-bold text-[#444658] transition hover:border-[#D5D2F7] hover:bg-[#FBFAFF]">
              <CalendarDays size={15} />
              Calendar
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.16)] transition hover:bg-[#5B21B6]">
              <Sparkles size={15} />
              Prepare
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6D28D9]">
                <CalendarClock size={19} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#9A9DAD]">
                Upcoming
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold text-[#202132]">
              {upcomingCount}
            </p>
            <p className="mt-1 text-xs text-[#888B9B]">Scheduled interviews</p>
          </div>

          <div className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertCircle size={19} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#9A9DAD]">
                Action
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold text-[#202132]">
              {pendingCount}
            </p>
            <p className="mt-1 text-xs text-[#888B9B]">Awaiting response</p>
          </div>

          <div className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#9A9DAD]">
                History
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold text-[#202132]">
              {completedCount}
            </p>
            <p className="mt-1 text-xs text-[#888B9B]">Completed interviews</p>
          </div>

          <div className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF6FF] text-blue-600">
                <Users size={19} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#9A9DAD]">
                Total
              </span>
            </div>

            <p className="mt-5 text-2xl font-bold text-[#202132]">
              {interviewsData.length}
            </p>
            <p className="mt-1 text-xs text-[#888B9B]">Interview history</p>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            {/* Next interview */}
            {nextInterview && (
              <div className="relative overflow-hidden rounded-[24px] bg-[#19162E] p-6 text-white shadow-[0_20px_50px_rgba(31,23,67,0.15)] sm:p-7">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#6D28D9]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#4F46E5]/20 blur-3xl" />

                <div className="relative">
                  <div className="flex flex-col justify-between gap-6 md:flex-row">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Next interview
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/70">
                          {nextInterview.round}
                        </span>
                      </div>

                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#5B4FE9]">
                          {nextInterview.companyShort}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white/60">
                            {nextInterview.company}
                          </p>
                          <h2 className="mt-0.5 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                            {nextInterview.jobTitle}
                          </h2>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                          <CalendarDays size={14} />
                          {nextInterview.date}
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                          <Clock3 size={14} />
                          {nextInterview.time}
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                          <Video size={14} />
                          {nextInterview.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end md:items-end">
                      <div className="mb-5 text-left md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Interviewer
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {nextInterview.interviewer}
                        </p>
                        <p className="mt-0.5 text-xs text-white/50">
                          {nextInterview.interviewerRole}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedInterview(nextInterview)}
                          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                        >
                          View details
                        </button>

                        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#4C32A7] transition hover:bg-[#F6F4FF]">
                          <Video size={14} />
                          Join interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#E7E8EF] bg-white p-1">
                {["Upcoming", "All", "Completed", "Cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                      activeTab === tab
                        ? "bg-[#F0EEFF] text-[#5B4FE9]"
                        : "text-[#858899] hover:bg-[#F7F7FA] hover:text-[#444658]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1 lg:w-64">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999CAB]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search interviews..."
                    className="h-10 w-full rounded-xl border border-[#E5E6ED] bg-white pl-10 pr-3 text-xs font-medium text-[#333547] outline-none transition placeholder:text-[#A1A4B2] focus:border-[#B9B4F5] focus:ring-3 focus:ring-[#6D28D9]/5"
                  />
                </div>

                <button className="flex h-10 items-center gap-2 rounded-xl border border-[#E5E6ED] bg-white px-3.5 text-xs font-bold text-[#606376]">
                  <Filter size={15} />
                  <span className="hidden sm:block">Filter</span>
                </button>
              </div>
            </div>

            {/* Interview list */}
            <div className="mt-4">
              {filteredInterviews.length > 0 ? (
                <div className="space-y-3">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      onView={setSelectedInterview}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#DCDDE6] bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EEFF] text-[#6D28D9]">
                    <CalendarDays size={22} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#292A3D]">
                    No interviews found
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#858899]">
                    Try changing your search or selecting another interview
                    status.
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="space-y-5">
            {/* Week */}
            <div className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#292A3D]">
                    October 2026
                  </h3>
                  <p className="mt-0.5 text-[11px] text-[#999CAB]">
                    Your interview schedule
                  </p>
                </div>

                <button className="rounded-lg p-1.5 text-[#858899] hover:bg-[#F5F5F8]">
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div
                    key={index}
                    className="pb-2 text-center text-[9px] font-bold text-[#A0A3B1]"
                  >
                    {day}
                  </div>
                ))}

                {["28", "29", "30", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "1", "2"].map(
                  (day, index) => {
                    const isMuted = index < 3 || index > 33;
                    const hasInterview = ["10", "12", "15"].includes(day);

                    return (
                      <button
                        key={`${day}-${index}`}
                        className={`relative flex h-8 items-center justify-center rounded-lg text-[10px] font-semibold transition ${
                          day === "10" && index === 12
                            ? "bg-[#6D28D9] text-white"
                            : isMuted
                            ? "text-[#C6C8D1]"
                            : "text-[#606376] hover:bg-[#F0EEFF] hover:text-[#5B4FE9]"
                        }`}
                      >
                        {day}
                        {hasInterview && (
                          <span
                            className={`absolute bottom-1 h-1 w-1 rounded-full ${
                              day === "10" && index === 12
                                ? "bg-white"
                                : "bg-[#6D28D9]"
                            }`}
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Preparation */}
            <div className="overflow-hidden rounded-2xl border border-[#E8E9F0] bg-white">
              <div className="border-b border-[#F0F0F4] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#292A3D]">
                      Interview prep
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#999CAB]">
                      Before your next round
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#6D28D9]">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {[
                  ["Review your resume", true],
                  ["Practice coding problems", true],
                  ["Research the company", false],
                  ["Prepare questions", false],
                ].map(([item, done]) => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        done
                          ? "border-[#6D28D9] bg-[#6D28D9] text-white"
                          : "border-[#D8D9E2]"
                      }`}
                    >
                      {done && <Check size={12} />}
                    </div>

                    <p
                      className={`text-xs ${
                        done
                          ? "text-[#7B7E8D] line-through"
                          : "font-medium text-[#454759]"
                      }`}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <button className="flex w-full items-center justify-center gap-1.5 border-t border-[#F0F0F4] py-3.5 text-xs font-bold text-[#5B4FE9] hover:bg-[#FBFAFF]">
                Open preparation
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick help */}
            <div className="rounded-2xl border border-[#E4E1FF] bg-[#F7F6FF] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6D28D9] shadow-sm">
                <MessageSquare size={16} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#292A3D]">
                Need help preparing?
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#777A8B]">
                Get interview preparation resources tailored to your upcoming
                round.
              </p>

              <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#5B4FE9]">
                Explore resources
                <ArrowRight size={13} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      <DetailModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />
    </div>
  );
}