import { useHome, useAuth } from "../../hooks/Hook";

import {
  X,
  LayoutDashboard,
  Users,
  Building2,
  BriefcaseBusiness,
  FileText,
  CircleHelp,
  User,
  Settings,
  CalendarDays,
  MessageSquare,
  Search,
  ClipboardList,
  FileUser,
  ChevronRight,
} from "lucide-react";

function MobileDrawer({ isOpen, onClose }) {
  const {
    activePage,
    adminActivePage,
    recruiterActivePage,
    setActivePage,
    setAdminActivePage,
    setRecruiterActivePage,
  } = useHome();

  const { user, admin, recruiter } = useAuth();

  if (!isOpen) return null;

  const isAdmin = Boolean(admin);
  const isRecruiter = Boolean(recruiter);

  const account = admin || recruiter || user;

  const adminItems = [
    { label: "Dashboard", page: "admin/dashboard", icon: LayoutDashboard },
    { label: "Users", page: "users", icon: Users },
    { label: "Companies", page: "companies", icon: Building2 },
    { label: "Jobs", page: "admin/jobs", icon: BriefcaseBusiness },
    { label: "Reports", page: "reports", icon: ClipboardList },
    { label: "Profile", page: "admin/profile", icon: User },
    { label: "Settings", page: "admin/settings", icon: Settings },
  ];

  const recruiterItems = [
    {
      label: "Dashboard",
      page: "recruiter/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Jobs",
      page: "recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      page: "recruiter/application",
      icon: FileText,
    },
    {
      label: "Interviews",
      page: "recruiter/interviews",
      icon: CalendarDays,
    },
    {
      label: "Companies",
      page: "recruiter/company",
      icon: Building2,
    },
    {
      label: "Messages",
      page: "/recruiter/chat",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      page: "recruiter/profile",
      icon: User,
    },
    {
      label: "Settings",
      page: "recruiter/settings",
      icon: Settings,
    },
  ];

  const candidateItems = [
    { label: "Overview", page: "overview", icon: LayoutDashboard },
    { label: "Find Jobs", page: "jobs", icon: Search },
    { label: "Applications", page: "applications", icon: FileText },
    { label: "Interviews", page: "interviews", icon: CalendarDays },
    { label: "Resume", page: "resume", icon: FileUser },
    { label: "Messages", page: "chats", icon: MessageSquare },
    { label: "Profile", page: "profile", icon: User },
    { label: "Settings", page: "settings", icon: Settings },
  ];

  const items = isAdmin
    ? adminItems
    : isRecruiter
      ? recruiterItems
      : candidateItems;

  const currentPage = isAdmin
    ? adminActivePage
    : isRecruiter
      ? recruiterActivePage
      : activePage;

  const roleName = isAdmin
    ? "Administrator"
    : isRecruiter
      ? "Recruiter"
      : "Candidate";

  const handleNavigation = (page) => {
    if (isAdmin) {
      setAdminActivePage(page);
    } else if (isRecruiter) {
      setRecruiterActivePage(page);
    } else {
      setActivePage(page);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside
        className={`absolute inset-y-0 left-0 flex w-[285px] max-w-[85vw]
        flex-col border-r border-slate-200 bg-white shadow-2xl
        transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-100 px-5 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h2 className="text-[17px] font-bold tracking-tight text-slate-900">
                  Peer<span className="text-violet-600">.Hiring</span>
                </h2>

                <p className="text-[11px] font-medium text-slate-400">
                  Career workspace
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          </div>

          {/* Account information */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/70 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-bold text-violet-700">
              {account?.avatar?.url ? (
                <img
                  src={account.avatar.url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                account?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {account?.name || "Welcome back"}
              </p>

              <p className="mt-0.5 text-xs text-violet-600">
                {roleName}
              </p>
            </div>

            <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
              Menu
            </p>

            <span className="text-[10px] font-medium text-slate-400">
              {items.length} items
            </span>
          </div>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;

              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavigation(item.page)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-violet-600"
                        : "text-slate-400 group-hover:text-violet-500"
                    }
                  />

                  <span
                    className={`flex-1 text-[13px] ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="text-violet-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Support */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
              Support
            </p>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <CircleHelp size={19} />

              <span className="text-[13px] font-medium">
                Help & Support
              </span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-600">
                Peer.Hiring
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Find your next opportunity.
              </p>
            </div>

            <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
              <BriefcaseBusiness size={17} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileDrawer;
