import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2,
  CircleCheck, Code2, ExternalLink, FileText, GraduationCap,
  Link2, LoaderCircle, Mail, MapPin, Pencil, Plus, RefreshCw, Rocket, Sparkles,
  Target, Upload, UserRound, X, Eye, Globe2, ChevronRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAuth, useProfile } from "../../hooks/Hook";
import CreateUProfile from "./CreateUProfile";
import UpdateProfileModal from "../../routes/updateProfileModal";

const cx = (...classes) => classes.filter(Boolean).join(" ");
const card = "rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)]";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60";
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const emptyForm = (type) => {
  if (type === "skill") return { name: "", level: "beginner" };
  if (type === "experience") return { position: "", company: "", employmentType: "full-time", startDate: "", endDate: "", currentlyWorking: false, description: "" };
  if (type === "education") return { degree: "", field: "", institute: "", startYear: "", endYear: "", grade: "" };
  return { title: "", description: "", technologies: "", githubUrl: "", liveUrl: "", startDate: "", endDate: "" };
};

function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></div>
      <div><h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p></div>
    </div>
    {action}
  </div>;
}

function EmptyState({ icon: Icon, title, text, action }) {
  return <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm"><Icon className="h-5 w-5" /></div>
    <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">{text}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>;
}

function ProfileDashboard() {
  const [createProfileModal, setCreateProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [detailsModal, setDetailsModal] = useState({ open: false, type: null, data: null });
  const [addItemModal, setAddItemModal] = useState({ open: false, type: null });
  const [addItemForm, setAddItemForm] = useState({});
  const [addItemLoading, setAddItemLoading] = useState(false);
  const { user, handleUpdateAvatar, handleUpdateCoverImage } = useAuth();
  const {
    profile, profileCompletion, handleGetMyProfile, handleProfileCompletion,
    handleCreateProfile, handleUpdateProfile, setUpdateProfileModal, updateProfileModalS,
  } = useProfile();

  const loadProfile = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setRefreshing(true);
      const result = await handleGetMyProfile();
      if (result || profile) await handleProfileCompletion();
    } catch (error) {
      console.error("Failed to load profile:", error);
      setNotice(error?.response?.data?.message || "We couldn't refresh your profile. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [handleGetMyProfile, handleProfileCompletion, profile]);

  useEffect(() => { loadProfile(); }, []); // Initial fetch only.

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const skills = profile?.skills || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const experience = profile?.experience || [];
  const location = profile?.location || {};
  const preferences = profile?.preferences || {};
  const socialLinks = profile?.socialLinks || {};
  const score = Math.min(100, Math.max(0, Number(profileCompletion?.score ?? profile?.profileCompletion ?? 0)));
  const missingFields = profileCompletion?.missingFields || [];

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };
  const formatFullDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const dateRange = (start, end, current = false) => {
    const a = formatDate(start);
    const b = formatDate(end);
    if (!a) return current ? "Currently working" : b;
    if (current) return `${a} – Present`;
    return b ? `${a} – ${b}` : a;
  };
  const yearRange = (start, end) => start && end ? `${start} – ${end}` : start ? `${start} – Present` : end ? String(end) : "";
  const capitalize = (value) => {
    if (value == null || value === "") return "";
    if (Array.isArray(value)) return value.map(capitalize).filter(Boolean).join(", ");
    if (typeof value === "object") return capitalize(value.label ?? value.name ?? value.value ?? value.title ?? "");
    return String(value).split("-").filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  };
  const normalizeUrl = (url) => !url ? "" : /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const openUrl = (url) => { if (url) window.open(normalizeUrl(url), "_blank", "noopener,noreferrer"); };
  const initial = (user?.name || user?.username || "U").charAt(0).toUpperCase();

  const openAddItemModal = (type) => { setAddItemForm(emptyForm(type)); setAddItemModal({ open: true, type }); };
  const closeAddItemModal = () => { if (!addItemLoading) { setAddItemModal({ open: false, type: null }); setAddItemForm({}); } };
  const updateAddItemForm = (field, value) => setAddItemForm((prev) => ({ ...prev, [field]: value }));
  const openDetails = (type, data) => setDetailsModal({ open: true, type, data });
  const closeDetails = () => setDetailsModal({ open: false, type: null, data: null });

  const handleAddItem = async (event) => {
    event.preventDefault();
    const type = addItemModal.type;
    if (!type || !profile) return;
    const trim = (key) => (addItemForm[key] || "").trim();
    try {
      setAddItemLoading(true);
      const updated = { ...profile };
      if (type === "skill") {
        if (!trim("name")) { setNotice("Enter a skill name first."); return; }
        if (skills.some((item) => item.name?.toLowerCase() === trim("name").toLowerCase())) { setNotice("That skill is already on your profile."); return; }
        updated.skills = [...skills, { name: trim("name"), level: addItemForm.level || "beginner" }];
      } else if (type === "experience") {
        if (!trim("position") || !trim("company")) { setNotice("Position and company are required."); return; }
        updated.experience = [...experience, { position: trim("position"), company: trim("company"), employmentType: addItemForm.employmentType, startDate: addItemForm.startDate || null, endDate: addItemForm.currentlyWorking ? null : addItemForm.endDate || null, currentlyWorking: Boolean(addItemForm.currentlyWorking), description: trim("description") }];
      } else if (type === "education") {
        if (!trim("degree") || !trim("institute")) { setNotice("Degree and institute are required."); return; }
        updated.education = [...education, { degree: trim("degree"), field: trim("field"), institute: trim("institute"), startYear: addItemForm.startYear ? Number(addItemForm.startYear) : null, endYear: addItemForm.endYear ? Number(addItemForm.endYear) : null, grade: trim("grade") }];
      } else {
        if (!trim("title")) { setNotice("Project title is required."); return; }
        updated.projects = [...projects, { title: trim("title"), description: trim("description"), technologies: trim("technologies").split(",").map((item) => item.trim()).filter(Boolean), githubUrl: trim("githubUrl"), liveUrl: trim("liveUrl"), startDate: addItemForm.startDate || null, endDate: addItemForm.endDate || null }];
      }
      await handleUpdateProfile(updated);
      setAddItemModal({ open: false, type: null });
      setAddItemForm({});
      await loadProfile(true);
      setNotice(`${capitalize(type)} added to your profile.`);
    } catch (error) {
      console.error("Failed to add profile item:", error);
      setNotice(error?.response?.data?.message || "Couldn't save this item. Please try again.");
    } finally { setAddItemLoading(false); }
  };

  const openImagePreview = (type) => {
    const url = type === "avatar" ? user?.avatar?.url : user?.coverImage?.url;
    if (url) setImagePreview({ type, url });
  };
  const openFilePicker = (type) => { (type === "avatar" ? avatarInputRef : coverInputRef).current?.click(); };
  const handleImageSelected = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setNotice("Choose a valid image file."); event.target.value = ""; return; }
    if (file.size > 5 * 1024 * 1024) { setNotice("Image must be smaller than 5 MB."); event.target.value = ""; return; }
    if (selectedImage?.preview) URL.revokeObjectURL(selectedImage.preview);
    const preview = URL.createObjectURL(file);
    setSelectedImage({ type, file, preview });
    setImagePreview({ type, url: preview });
    event.target.value = "";
  };
  const handleImageUpload = async () => {
    if (!selectedImage?.file || imageUploading) return;
    try {
      setImageUploading(true);
      const formData = new FormData();
      if (selectedImage.type === "avatar") { formData.append("avatar", selectedImage.file); await handleUpdateAvatar(formData); }
      else { formData.append("coverImage", selectedImage.file); await handleUpdateCoverImage(formData); }
      if (selectedImage.preview) URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null); setImagePreview(null);
      await loadProfile(true);
      setNotice("Image updated successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);
      setNotice(error?.response?.data?.message || error?.message || "Failed to update image.");
    } finally { setImageUploading(false); }
  };

  const stats = useMemo(() => [
    { label: "Skills", value: skills.length, icon: Code2, tone: "violet" },
    { label: "Projects", value: projects.length, icon: Rocket, tone: "blue" },
    { label: "Experience", value: experience.length, icon: BriefcaseBusiness, tone: "emerald" },
    { label: "Education", value: education.length, icon: GraduationCap, tone: "amber" },
  ], [skills.length, projects.length, experience.length, education.length]);

  if (loading) return <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 md:px-8"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-8 w-56 rounded-lg bg-slate-200"/><div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200"/><div className="mt-7 h-64 rounded-2xl border border-slate-200 bg-white"/><div className="mt-6 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]"><div className="h-[560px] rounded-2xl bg-white"/><div className="space-y-5"><div className="h-40 rounded-2xl bg-white"/><div className="h-64 rounded-2xl bg-white"/><div className="h-64 rounded-2xl bg-white"/></div></div></div></div>;

  if (!profile) return <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 md:px-8"><div className="mx-auto max-w-5xl"><div className={`${card} overflow-hidden`}><div className="relative h-44 bg-gradient-to-r from-violet-800 via-violet-700 to-indigo-700"><div className="absolute -right-8 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"/><div className="absolute bottom-0 left-1/3 h-28 w-1/3 rounded-full bg-fuchsia-400/20 blur-3xl"/></div><div className="px-6 pb-8 md:px-9"><div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-violet-100 text-4xl font-bold text-violet-700 shadow-lg">{user?.avatar?.url ? <img src={user.avatar.url} alt="Profile" className="h-full w-full object-cover"/> : initial}</div><p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Your career workspace</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Make your profile stand out.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Build a professional profile recruiters can understand at a glance. Add your skills, experience, education, projects and links.</p><button type="button" onClick={() => setCreateProfileModal(true)} className={`${primaryButton} mt-6`}><Plus className="h-4 w-4"/> Create profile</button></div></div>{createProfileModal && <CreateUProfile open onClose={() => setCreateProfileModal(false)} onSubmit={handleCreateProfile}/>}</div></div>;

  const addButton = (type, label) => <button type="button" onClick={() => openAddItemModal(type)} className={secondaryButton}><Plus className="h-4 w-4"/>{label}</button>;
  const socialButton = (label, url, Icon, hover = "hover:bg-violet-50") => <button type="button" onClick={() => openUrl(url)} className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-left transition ${hover}`}><span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><Icon className="h-4 w-4"/>{label}</span><ExternalLink className="h-3.5 w-3.5 text-slate-400"/></button>;

  return <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 md:px-8 md:py-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700"><Sparkles className="h-4 w-4"/> Peer.Hiring workspace</div><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">My professional profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Your experience, skills and projects — organized to help recruiters see your potential.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => loadProfile(true)} disabled={refreshing} className={secondaryButton}><RefreshCw className={cx("h-4 w-4", refreshing && "animate-spin")}/>{refreshing ? "Refreshing" : "Refresh"}</button><button type="button" onClick={() => setUpdateProfileModal(true)} className={primaryButton}><Pencil className="h-4 w-4"/> Edit profile</button></div>
      </header>

      {notice && <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice"><X className="h-4 w-4"/></button></div>}

      <section className={`${card} overflow-hidden`}>
        <div className="group relative h-44 overflow-hidden bg-gradient-to-r from-violet-800 via-violet-700 to-indigo-700 md:h-56">
          {user?.coverImage?.url && <img src={user.coverImage.url} alt="Profile cover" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"/>}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-slate-950/10"/>
          <div className="absolute left-5 top-5 rounded-lg border border-white/20 bg-slate-950/20 px-3 py-2 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">CAREER PROFILE</div>
          <div className="absolute right-4 top-4 flex gap-2"><button type="button" onClick={() => openImagePreview("cover")} disabled={!user?.coverImage?.url} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/25 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-slate-950/40 disabled:opacity-40"><Eye className="h-3.5 w-3.5"/> Preview</button><button type="button" onClick={() => openFilePicker("cover")} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-violet-50"><Upload className="h-3.5 w-3.5"/> Change cover</button></div>
          <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleImageSelected(event, "cover")}/>
        </div>
        <div className="px-5 pb-5 md:px-7 md:pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
              <div className="group relative h-24 w-24 shrink-0">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-violet-100 text-3xl font-bold text-violet-700 shadow-lg">{user?.avatar?.url ? <img src={user.avatar.url} alt={user?.name || "Profile"} className="h-full w-full object-cover"/> : initial}</div>
                <button type="button" onClick={() => openFilePicker("avatar")} aria-label="Change profile photo" className="absolute inset-1 flex items-center justify-center rounded-xl bg-slate-950/50 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"><Upload className="h-5 w-5"/></button>
                <button type="button" onClick={() => openImagePreview("avatar")} disabled={!user?.avatar?.url} aria-label="Preview profile photo" className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-700 text-white shadow-sm hover:bg-violet-800 disabled:hidden"><Eye className="h-3.5 w-3.5"/></button>
                <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleImageSelected(event, "avatar")}/>
              </div>
              <div className="min-w-0 pb-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold tracking-tight text-slate-950 md:text-2xl">{user?.name || user?.username || "Your profile"}</h2>{user?.isVerified && <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700"><CircleCheck className="h-3.5 w-3.5"/> Verified</span>}</div><p className="mt-1 text-sm font-medium text-slate-600">{profile.headline || "Add a headline to introduce your professional focus"}</p>{(location.city || location.state || location.country) && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5"/>{[location.city, location.state, location.country].filter(Boolean).join(", ")}</p>}</div>
            </div>
            {preferences.lookingForJob && <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Open to opportunities</span>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">{user?.email && <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400"/>{user.email}</span>}{profile.createdAt && <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><CalendarDays className="h-3.5 w-3.5 text-slate-400"/> Joined {formatFullDate(profile.createdAt)}</span>}{profile.updatedAt && <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><CheckCircle2 className="h-3.5 w-3.5 text-slate-400"/> Updated {formatFullDate(profile.updatedAt)}</span>}</div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon, tone }) => <div key={label} className={`${card} flex items-center gap-3 p-4 md:p-5`}><div className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone === "violet" && "bg-violet-50 text-violet-700", tone === "blue" && "bg-blue-50 text-blue-700", tone === "emerald" && "bg-emerald-50 text-emerald-700", tone === "amber" && "bg-amber-50 text-amber-700")}><Icon className="h-5 w-5"/></div><div><p className="text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p></div></div>)}</section>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className={`${card} p-5`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-900">Profile strength</p><p className="mt-1 text-xs text-slate-500">A stronger profile makes a better first impression.</p></div><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-violet-100 bg-violet-50 text-sm font-bold text-violet-800">{score}%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-700 to-indigo-500 transition-all duration-500" style={{ width: `${score}%` }}/></div><div className="mt-2 flex justify-between text-[11px] text-slate-400"><span>Profile completion</span><span>{score === 100 ? "All set" : `${100 - score}% to go`}</span></div>{missingFields.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Recommended next steps</p><div className="mt-2 flex flex-wrap gap-1.5">{missingFields.slice(0, 5).map((field, index) => <span key={`${typeof field === "string" ? field : field?.name}-${index}`} className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800">{typeof field === "string" ? field : field?.name || "Complete profile"}</span>)}</div></div>}</section>

          <section className={`${card} p-5`}><SectionTitle icon={Target} title="Job preferences" subtitle="Your next career move"/><div className="mt-5 space-y-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Availability</p><p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"><span className={cx("h-2 w-2 rounded-full", preferences.lookingForJob ? "bg-emerald-500" : "bg-slate-300")}/>{preferences.lookingForJob ? "Looking for opportunities" : "Not currently looking"}</p></div>{preferences.preferredJobType && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Job type</p><p className="mt-1 text-sm font-medium text-slate-700">{capitalize(preferences.preferredJobType)}</p></div>}{preferences.workMode && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Work mode</p><p className="mt-1 text-sm font-medium text-slate-700">{capitalize(preferences.workMode)}</p></div>}{(preferences.expectedSalary?.min || preferences.expectedSalary?.max) && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Expected salary</p><p className="mt-1 text-sm font-semibold text-slate-700">{preferences.expectedSalary?.currency || "INR"} {preferences.expectedSalary?.min ? `₹${Number(preferences.expectedSalary.min).toLocaleString("en-IN")}` : ""}{preferences.expectedSalary?.min && preferences.expectedSalary?.max ? " – " : ""}{preferences.expectedSalary?.max ? `₹${Number(preferences.expectedSalary.max).toLocaleString("en-IN")}` : ""}</p></div>}</div></section>

          {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && <section className={`${card} p-5`}><SectionTitle icon={Link2} title="Social links" subtitle="Your work across the web"/><div className="mt-4 space-y-2">{socialLinks.github && socialButton("GitHub", socialLinks.github, FaGithub)}{socialLinks.linkedin && socialButton("LinkedIn", socialLinks.linkedin, FaLinkedin, "hover:bg-blue-50")}{socialLinks.portfolio && socialButton("Portfolio", socialLinks.portfolio, Globe2)}</div></section>}

          {profile.resumeId && <section className={`${card} p-5`}><SectionTitle icon={FileText} title="Resume" subtitle="Attached to your profile"/><div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50/70 p-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"/><p className="text-xs leading-5 text-emerald-800">A resume is linked to this profile. Connect your Resume API here to preview or download it.</p></div></section>}
        </aside>

        <main className="min-w-0 space-y-5">
          <section className={`${card} p-5 md:p-6`}><SectionTitle icon={UserRound} title="About" subtitle="Your professional summary"/><div className="mt-5">{profile.bio ? <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{profile.bio}</p> : <EmptyState icon={UserRound} title="Tell recruiters about yourself" text="Add a short summary of your strengths, interests and the kind of work you want to do." action={<button type="button" onClick={() => setUpdateProfileModal(true)} className={secondaryButton}><Pencil className="h-4 w-4"/> Add summary</button>}/>}</div></section>

          <section className={`${card} p-5 md:p-6`}><SectionTitle icon={Code2} title="Skills" subtitle="Tools and strengths you bring to the role" action={addButton("skill", "Add skill")}/>{skills.length ? <div className="mt-5 flex flex-wrap gap-2.5">{skills.map((skill, index) => <div key={`${skill?._id || skill?.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50/60"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm"><Code2 className="h-3.5 w-3.5"/></span><span className="text-sm font-semibold text-slate-800">{skill?.name}</span></div>{skill?.level && <span className={cx("mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold", skill.level === "expert" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : skill.level === "intermediate" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-amber-200 bg-amber-50 text-amber-700")}>{capitalize(skill.level)}</span>}</div>)}</div> : <EmptyState icon={Code2} title="Your skills belong here" text="Add relevant technical and professional skills to help recruiters understand your strengths." action={addButton("skill", "Add your first skill")}/>}</section>

          <section className={`${card} p-5 md:p-6`}><SectionTitle icon={BriefcaseBusiness} title="Experience" subtitle="Roles, responsibilities and impact" action={addButton("experience", "Add experience")}/>{experience.length ? <div className="mt-5 space-y-3">{experience.map((item, index) => <button type="button" key={`${item?._id || item?.company}-${index}`} onClick={() => openDetails("experience", item)} className="group w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/30"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Building2 className="h-5 w-5"/></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{item?.position || "Position"}</h3><p className="mt-1 text-sm text-slate-600">{item?.company}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-700"/></div><div className="mt-3 flex flex-wrap gap-2">{item?.employmentType && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{capitalize(item.employmentType)}</span>}{item?.currentlyWorking && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Current</span>}{dateRange(item?.startDate, item?.endDate, item?.currentlyWorking) && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500"><CalendarDays className="h-3 w-3"/>{dateRange(item.startDate, item.endDate, item.currentlyWorking)}</span>}</div>{item?.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>}<p className="mt-3 text-xs font-semibold text-violet-700">View details <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></p></div></div></button>)}</div> : <EmptyState icon={BriefcaseBusiness} title="Add your experience" text="Include jobs, internships, freelance work or meaningful practical experience." action={addButton("experience", "Add experience")}/>}</section>

          <section className={`${card} p-5 md:p-6`}><SectionTitle icon={GraduationCap} title="Education" subtitle="Your academic background" action={addButton("education", "Add education")}/>{education.length ? <div className="mt-5 space-y-3">{education.map((item, index) => <button type="button" key={`${item?._id || item?.institute}-${index}`} onClick={() => openDetails("education", item)} className="group w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50/30"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><GraduationCap className="h-5 w-5"/></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{item?.degree || "Degree"}</h3>{item?.field && <p className="mt-1 text-sm text-slate-600">{item.field}</p>}<p className="mt-1.5 text-sm text-slate-500">{item?.institute}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-orange-700"/></div><div className="mt-3 flex flex-wrap gap-2">{yearRange(item?.startYear, item?.endYear) && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500"><CalendarDays className="h-3 w-3"/>{yearRange(item.startYear, item.endYear)}</span>}{item?.grade && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Grade: {item.grade}</span>}</div><p className="mt-3 text-xs font-semibold text-violet-700">View details <ChevronRight className="ml-1 inline h-3.5 w-3.5"/></p></div></div></button>)}</div> : <EmptyState icon={GraduationCap} title="Add your education" text="Show your degree, institute and academic progress." action={addButton("education", "Add education")}/>}</section>

          <section className={`${card} p-5 md:p-6`}><SectionTitle icon={Rocket} title="Projects" subtitle="Selected work and things you've built" action={addButton("project", "Add project")}/>{projects.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{projects.map((project, index) => <button type="button" key={`${project?._id || project?.title}-${index}`} onClick={() => openDetails("project", project)} className="group overflow-hidden rounded-xl border border-slate-200 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60"><div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-slate-100">{project?.image?.url ? <img src={project.image.url} alt={project?.title || "Project"} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm"><Rocket className="h-6 w-6"/></div>}<div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition group-hover:bg-violet-700 group-hover:text-white"><ArrowUpRight className="h-4 w-4"/></div></div><div className="p-4"><h3 className="font-semibold text-slate-900">{project?.title || "Untitled project"}</h3>{project?.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{project.description}</p>}{project?.technologies?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{project.technologies.slice(0, 4).map((technology, i) => <span key={`${technology}-${i}`} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{technology}</span>)}{project.technologies.length > 4 && <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">+{project.technologies.length - 4}</span>}</div>}{(project?.startDate || project?.endDate) && <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400"><CalendarDays className="h-3.5 w-3.5"/>{dateRange(project.startDate, project.endDate)}</p>}</div></button>)}</div> : <EmptyState icon={Rocket} title="Show what you can build" text="Add projects with a short description, technology stack and links to your code or live demo." action={addButton("project", "Add your first project")}/>}</section>
        </main>
      </div>
    </div>

    {createProfileModal && <CreateUProfile open onClose={() => setCreateProfileModal(false)} onSubmit={handleCreateProfile}/>}
    {updateProfileModalS && <UpdateProfileModal open={updateProfileModalS} onClose={() => setUpdateProfileModal(false)} profile={profile} onUpdate={handleUpdateProfile}/>}

    {addItemModal.open && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAddItemModal(); }}><div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">Profile builder</p><h2 className="mt-1 text-lg font-bold text-slate-900">Add {addItemModal.type}</h2><p className="mt-1 text-xs text-slate-500">Add accurate details to your professional profile.</p></div><button type="button" onClick={closeAddItemModal} disabled={addItemLoading} aria-label="Close modal" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4"/></button></div><form onSubmit={handleAddItem}><div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
      {addItemModal.type === "skill" && <><Field label="Skill name" value={addItemForm.name} onChange={(v) => updateAddItemForm("name", v)} placeholder="e.g. React.js" required/><Field label="Proficiency" as="select" value={addItemForm.level} onChange={(v) => updateAddItemForm("level", v)} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "expert", label: "Expert" }]}/></>}
      {addItemModal.type === "experience" && <><div className="grid gap-4 sm:grid-cols-2"><Field label="Position" value={addItemForm.position} onChange={(v) => updateAddItemForm("position", v)} placeholder="Software Developer" required/><Field label="Company" value={addItemForm.company} onChange={(v) => updateAddItemForm("company", v)} placeholder="Company name" required/></div><Field label="Employment type" as="select" value={addItemForm.employmentType} onChange={(v) => updateAddItemForm("employmentType", v)} options={[{ value: "full-time", label: "Full-time" }, { value: "part-time", label: "Part-time" }, { value: "internship", label: "Internship" }, { value: "freelance", label: "Freelance" }, { value: "contract", label: "Contract" }]}/><div className="grid gap-4 sm:grid-cols-2"><Field label="Start date" type="date" value={addItemForm.startDate} onChange={(v) => updateAddItemForm("startDate", v)}/>{!addItemForm.currentlyWorking && <Field label="End date" type="date" value={addItemForm.endDate} onChange={(v) => updateAddItemForm("endDate", v)}/>}</div><label className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={Boolean(addItemForm.currentlyWorking)} onChange={(e) => updateAddItemForm("currentlyWorking", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-500"/>I currently work here</label><Field label="Description" as="textarea" rows={4} value={addItemForm.description} onChange={(v) => updateAddItemForm("description", v)} placeholder="Responsibilities and achievements"/></>}
      {addItemModal.type === "education" && <><Field label="Degree" value={addItemForm.degree} onChange={(v) => updateAddItemForm("degree", v)} placeholder="Bachelor of Computer Applications" required/><Field label="Field of study" value={addItemForm.field} onChange={(v) => updateAddItemForm("field", v)} placeholder="Computer Applications"/><Field label="Institute" value={addItemForm.institute} onChange={(v) => updateAddItemForm("institute", v)} placeholder="University / College" required/><div className="grid grid-cols-2 gap-4"><Field label="Start year" type="number" value={addItemForm.startYear} onChange={(v) => updateAddItemForm("startYear", v)} placeholder="2024"/><Field label="End year" type="number" value={addItemForm.endYear} onChange={(v) => updateAddItemForm("endYear", v)} placeholder="2027"/></div><Field label="Grade / CGPA" value={addItemForm.grade} onChange={(v) => updateAddItemForm("grade", v)} placeholder="8.2 CGPA"/></>}
      {addItemModal.type === "project" && <><Field label="Project title" value={addItemForm.title} onChange={(v) => updateAddItemForm("title", v)} placeholder="Peer.Hiring" required/><Field label="Description" as="textarea" rows={4} value={addItemForm.description} onChange={(v) => updateAddItemForm("description", v)} placeholder="What did you build?"/><Field label="Technologies" value={addItemForm.technologies} onChange={(v) => updateAddItemForm("technologies", v)} placeholder="React, Node.js, MongoDB" hint="Separate technologies with commas."/><div className="grid gap-4 sm:grid-cols-2"><Field label="GitHub URL" type="url" value={addItemForm.githubUrl} onChange={(v) => updateAddItemForm("githubUrl", v)} placeholder="https://github.com/..."/><Field label="Live URL" type="url" value={addItemForm.liveUrl} onChange={(v) => updateAddItemForm("liveUrl", v)} placeholder="https://..."/></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Start date" type="date" value={addItemForm.startDate} onChange={(v) => updateAddItemForm("startDate", v)}/><Field label="End date" type="date" value={addItemForm.endDate} onChange={(v) => updateAddItemForm("endDate", v)}/></div></>}
    </div><div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4"><button type="button" onClick={closeAddItemModal} disabled={addItemLoading} className={secondaryButton}>Cancel</button><button type="submit" disabled={addItemLoading} className={primaryButton}>{addItemLoading ? <><LoaderCircle className="h-4 w-4 animate-spin"/>Saving…</> : <><CheckCircle2 className="h-4 w-4"/>Save {addItemModal.type}</>}</button></div></form></div></div>}

    {detailsModal.open && detailsModal.data && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetails(); }}><div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"><button type="button" onClick={closeDetails} aria-label="Close details" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-500 shadow-sm hover:bg-slate-100"><X className="h-4 w-4"/></button><div className="max-h-[90vh] overflow-y-auto">{detailsModal.type === "project" && <div className="relative flex h-48 items-end overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-700 p-6 md:h-60">{detailsModal.data.image?.url && <img src={detailsModal.data.image.url} alt={detailsModal.data.title || "Project"} className="absolute inset-0 h-full w-full object-cover"/>}<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"/><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Project details</p><h2 className="mt-2 pr-8 text-2xl font-bold text-white">{detailsModal.data.title || "Untitled project"}</h2></div></div>}<div className="p-6 md:p-8">{detailsModal.type !== "project" && <div className="flex items-start gap-3 pr-8"><div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", detailsModal.type === "education" ? "bg-orange-50 text-orange-700" : "bg-violet-50 text-violet-700")}>{detailsModal.type === "education" ? <GraduationCap className="h-6 w-6"/> : <Building2 className="h-6 w-6"/>}</div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">{detailsModal.type}</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{detailsModal.data.position || detailsModal.data.degree}</h2><p className="mt-1 text-sm text-slate-500">{detailsModal.data.company || detailsModal.data.institute || detailsModal.data.field}</p></div></div>}{detailsModal.type === "project" && <h3 className="text-sm font-bold text-slate-900">About this project</h3>}{detailsModal.data.description && <p className={cx("whitespace-pre-line text-sm leading-7 text-slate-600", detailsModal.type === "project" ? "mt-3" : "mt-6")}>{detailsModal.data.description}</p>}{detailsModal.type === "project" && detailsModal.data.technologies?.length > 0 && <div className="mt-6"><h3 className="text-sm font-bold text-slate-900">Technologies</h3><div className="mt-3 flex flex-wrap gap-2">{detailsModal.data.technologies.map((tech, i) => <span key={`${tech}-${i}`} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">{tech}</span>)}</div></div>}<div className="mt-6 grid gap-3 sm:grid-cols-2">{(detailsModal.type === "education" ? [{ label: "Duration", value: yearRange(detailsModal.data.startYear, detailsModal.data.endYear) }, { label: "Grade", value: detailsModal.data.grade }] : [{ label: "Type", value: capitalize(detailsModal.data.employmentType) }, { label: "Duration", value: dateRange(detailsModal.data.startDate, detailsModal.data.endDate, detailsModal.data.currentlyWorking) }]).map((row) => <div key={row.label} className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{row.label}</p><p className="mt-2 text-sm font-semibold text-slate-700">{row.value || "Not specified"}</p></div>)}</div>{detailsModal.type === "project" && <div className="mt-6 flex flex-wrap gap-2">{detailsModal.data.githubUrl && <button type="button" onClick={() => openUrl(detailsModal.data.githubUrl)} className={secondaryButton}><FaGithub className="h-4 w-4"/>GitHub<ExternalLink className="h-3.5 w-3.5"/></button>}{detailsModal.data.liveUrl && <button type="button" onClick={() => openUrl(detailsModal.data.liveUrl)} className={primaryButton}><Globe2 className="h-4 w-4"/>Live demo<ExternalLink className="h-3.5 w-3.5"/></button>}</div>}</div></div></div></div>}

    {imagePreview && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget && !imageUploading) setImagePreview(null); }}><button type="button" onClick={() => { if (!imageUploading) setImagePreview(null); }} aria-label="Close image preview" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5"/></button><div className="flex max-h-[90vh] max-w-[95vw] flex-col items-center"><img src={imagePreview.url} alt={imagePreview.type === "avatar" ? "Profile photo preview" : "Cover image preview"} className="max-h-[72vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"/><div className="mt-5 flex flex-wrap items-center justify-center gap-3"><span className="rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white">{imagePreview.type === "avatar" ? "Profile photo" : "Cover image"}</span>{selectedImage?.type === imagePreview.type && <button type="button" onClick={handleImageUpload} disabled={imageUploading} className={primaryButton}>{imageUploading ? <><LoaderCircle className="h-4 w-4 animate-spin"/>Updating…</> : <><CheckCircle2 className="h-4 w-4"/>Save image</>}</button>}</div></div></div>}
  </div>;
}

function Field({ label, value, onChange, placeholder, type = "text", as = "input", options = [], hint, rows = 3, required = false }) {
  return <div><label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}{required && <span className="ml-1 text-rose-500">*</span>}{as === "select" ? <select required={required} value={value || ""} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-1.5`}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : as === "textarea" ? <textarea required={required} rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-1.5 resize-y`}/> : <input required={required} type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-1.5`}/>}</label>{hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}</div>;
}

export default ProfileDashboard;
