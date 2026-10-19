
import React, { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  FolderGit2,
  FileText,
  Download,
  CalendarDays,
  Star,
  Mail,
  Globe,
  Award,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const candidate = {
  name: "Aarav Sharma",
  role: "Full Stack Developer",
  location: "Bengaluru, India",
  experience: "2+ years",
  email: "aarav.sharma@example.com",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
  banner:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&auto=format&fit=crop",
  openToWork: true,
  summary:
    "Product-minded Full Stack Developer passionate about building scalable web applications, intuitive user experiences, and reliable APIs. Experienced in React, Node.js, MongoDB, authentication, and responsive UI development. Enjoys solving real-world problems and collaborating with product and engineering teams.",
  skills: [
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "REST APIs",
    "JWT Authentication",
    "Git & GitHub",
    "Docker",
    "SQL",
  ],
  experienceList: [
    {
      role: "Full Stack Developer",
      company: "Nexora Technologies",
      period: "Jan 2025 — Present",
      location: "Bengaluru · Hybrid",
      description:
        "Developed responsive React interfaces and REST APIs for a SaaS recruitment platform. Improved API response performance, implemented role-based authentication, and collaborated on reusable component architecture.",
      tags: ["React", "Node.js", "MongoDB"],
    },
    {
      role: "Frontend Developer Intern",
      company: "PixelCraft Labs",
      period: "Jun 2024 — Dec 2024",
      location: "Remote",
      description:
        "Built accessible interfaces, integrated APIs, fixed UI bugs, and collaborated with designers to deliver responsive product pages.",
      tags: ["JavaScript", "React", "Tailwind"],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      school: "National Institute of Technology",
      period: "2021 — 2025",
      detail: "CGPA: 8.7 / 10",
    },
  ],
  projects: [
    {
      name: "HireFlow — Recruitment Platform",
      description:
        "A full-stack hiring platform with recruiter dashboards, candidate applications, interview scheduling, and role-based access control.",
      tech: ["React", "Node.js", "MongoDB"],
      github: "https://github.com/",
      live: "https://example.com",
      icon: "H",
    },
    {
      name: "DevCollab — Team Workspace",
      description:
        "A collaborative workspace featuring project boards, task management, activity feeds, and secure authentication.",
      tech: ["React", "Express", "Socket.IO"],
      github: "https://github.com/",
      live: "https://example.com",
      icon: "D",
    },
  ],
  certifications: [
    "Meta Front-End Developer Certificate",
    "AWS Cloud Practitioner Essentials",
    "Problem Solving — HackerRank",
  ],
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  portfolio: "https://example.com",
};

const application = {
  jobTitle: "Software Development Engineer",
  company: "Peer.Hiring Demo Company",
  status: "Shortlisted",
  appliedOn: "18 Oct 2026",
  recruiterNote:
    "Strong full-stack fundamentals. Review API design and project ownership during the technical interview.",
};

const statusClasses = {
  Shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
  Interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

function Section({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
            <Icon size={19} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SocialLink({ href, children, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
      {label}
      <ExternalLink size={13} className="text-slate-400" />
    </a>
  );
}

export default function CandidateProfile() {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.recruiterNote);
  const [showNotes, setShowNotes] = useState(false);
  const [toast, setToast] = useState("");
  const [showReject, setShowReject] = useState(false);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const shortlist = () => {
    setStatus("Shortlisted");
    notify("Candidate shortlisted successfully.");
  };

  const reject = () => {
    setStatus("Rejected");
    setShowReject(false);
    notify("Demo application marked as rejected.");
  };

  const scheduleInterview = () => {
    setStatus("Interview");
    notify("Demo interview workflow opened. Connect your interview page here.");
  };

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-3 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-6">

        {/* Top navigation */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => notify("Demo: navigate back to applications.")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-violet-700"
          >
            <ArrowLeft size={17} /> Back to applications
          </button>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Recruiter workspace
          </div>
        </header>

        {/* Hero */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
          <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#241047] via-[#5524A5] to-[#8B5CF6] sm:h-48">
            <img
              src={candidate.banner}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
            />
            <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/20" />
            <div className="absolute right-24 top-8 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-950/40 to-transparent" />
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                />
                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                      {candidate.name}
                    </h1>
                    <CheckCircle2 size={19} className="text-emerald-600" />
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-slate-600 sm:text-base">
                    {candidate.role}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} /> {candidate.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness size={15} /> {candidate.experience}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Open to work
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={shortlist}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
                >
                  <Star size={16} /> Shortlist
                </button>
                <button
                  onClick={scheduleInterview}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <CalendarDays size={16} /> Schedule interview
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  className="rounded-xl border border-rose-200 px-3.5 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Font Awesome social icons */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
              <SocialLink href={candidate.github} label="GitHub">
                <FontAwesomeIcon icon={faGithub} className="text-lg" />
              </SocialLink>
              <SocialLink href={candidate.linkedin} label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} className="text-lg text-[#0A66C2]" />
              </SocialLink>
              <SocialLink href={candidate.portfolio} label="Portfolio">
                <Globe size={16} />
              </SocialLink>
              <a
                href={`mailto:${candidate.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Mail size={16} /> Contact
              </a>
            </div>
          </div>
        </section>

        {/* Application overview */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Application status</p>
            <span className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusClasses[status]}`}>
              {status}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Applied for</p>
            <p className="mt-2 font-bold text-slate-900">{application.jobTitle}</p>
            <p className="mt-1 text-xs text-slate-500">{application.company}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Applied on</p>
            <p className="mt-2 font-bold text-slate-900">{application.appliedOn}</p>
            <p className="mt-1 text-xs text-slate-500">Application received</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Recruiter review</p>
            <p className="mt-2 font-bold text-slate-900">In progress</p>
            <p className="mt-1 text-xs text-slate-500">Demo review status</p>
          </div>
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-6">

            <Section
              icon={Sparkles}
              title="Professional summary"
              subtitle="Get to know the candidate"
            >
              <p className="text-sm leading-8 text-slate-600">
                {candidate.summary}
              </p>
            </Section>

            <Section
              icon={Code2}
              title="Skills & expertise"
              subtitle={`${candidate.skills.length} professional skills`}
            >
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50/80 px-3 py-2 text-sm font-semibold text-violet-800"
                  >
                    <CheckCircle2 size={14} className="text-violet-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            <Section
              icon={BriefcaseBusiness}
              title="Work experience"
              subtitle="Professional background"
            >
              <div className="space-y-7">
                {candidate.experienceList.map((item, index) => (
                  <div key={item.company} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="z-10 mt-1 h-3 w-3 rounded-full border-2 border-violet-600 bg-white" />
                      {index !== candidate.experienceList.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-violet-100" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <h3 className="font-bold text-slate-900">{item.role}</h3>
                          <p className="mt-1 text-sm font-semibold text-violet-700">
                            {item.company}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">{item.location}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              icon={GraduationCap}
              title="Education"
              subtitle="Academic qualifications"
            >
              {candidate.education.map((item) => (
                <div key={item.school} className="flex gap-4">
                  <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                    <GraduationCap size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900">{item.degree}</h3>
                    <p className="mt-1 text-sm font-semibold text-violet-700">{item.school}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.period}</p>
                    <span className="mt-3 inline-flex rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">
                      {item.detail}
                    </span>
                  </div>
                </div>
              ))}
            </Section>

            <Section
              icon={FolderGit2}
              title="Projects & portfolio"
              subtitle="Selected work and practical experience"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {candidate.projects.map((project) => (
                  <article
                    key={project.name}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-extrabold text-white">
                        {project.icon}
                      </div>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`GitHub for ${project.name}`}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-lg" />
                      </a>
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900">{project.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span key={tech} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-900"
                    >
                      View project <ExternalLink size={14} />
                    </a>
                  </article>
                ))}
              </div>
            </Section>

            <Section
              icon={Award}
              title="Certifications & achievements"
              subtitle="Additional qualifications"
            >
              <div className="space-y-3">
                {candidate.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                    <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                      <Award size={18} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{cert}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Right sidebar */}
          <aside className="min-w-0 space-y-6 xl:sticky xl:top-5">
            <Section
              icon={FileText}
              title="Candidate resume"
              subtitle="Resume attached to this application"
            >
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">Aarav_Sharma_Resume.pdf</p>
                    <p className="mt-1 text-xs text-slate-500">PDF · Demo resume</p>
                  </div>
                </div>
                <button
                  onClick={() => notify("Connect this button to your resume PDF.")}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
                >
                  <Download size={16} /> Download resume
                </button>
              </div>
            </Section>

            <Section
              icon={Mail}
              title="Contact information"
              subtitle="Demo candidate details"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 text-violet-600" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Email</p>
                    <a href={`mailto:${candidate.email}`} className="mt-1 block break-all text-sm font-semibold text-slate-800 hover:text-violet-700">
                      {candidate.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 text-violet-600" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{candidate.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness size={17} className="mt-0.5 text-violet-600" />
                  <div>
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{candidate.experience}</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              icon={Sparkles}
              title="Recruiter notes"
              subtitle="Private notes for your hiring team"
              action={
                <button
                  onClick={() => setShowNotes((value) => !value)}
                  className="text-xs font-bold text-violet-700 hover:text-violet-900"
                >
                  {showNotes ? "Close" : "Edit"}
                </button>
              }
            >
              {showNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={5}
                    maxLength={5000}
                    placeholder="Add candidate feedback..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                  <button
                    onClick={() => {
                      setShowNotes(false);
                      notify("Demo notes saved in this page state.");
                    }}
                    className="w-full rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
                  >
                    Save notes
                  </button>
                </div>
              ) : (
                <p className="text-sm leading-7 text-slate-600">{notes || "No recruiter notes added."}</p>
              )}
            </Section>

            <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-violet-700" />
                <div>
                  <p className="text-sm font-bold text-violet-950">Hiring workspace</p>
                  <p className="mt-1 text-xs leading-5 text-violet-800">
                    Review candidate skills, work history, projects, and resume before deciding on the next step.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Reject confirmation */}
        {showReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Reject candidate?</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This changes only the demo status. No real application will be changed.
                  </p>
                </div>
                <button
                  onClick={() => setShowReject(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowReject(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={reject}
                  className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
                >
                  Confirm rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-5 right-4 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:right-6">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <p className="text-sm font-semibold text-slate-700">{toast}</p>
            <button onClick={() => setToast("")} aria-label="Dismiss notification">
              <X size={15} className="text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
