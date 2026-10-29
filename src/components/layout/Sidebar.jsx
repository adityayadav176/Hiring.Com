import React, { useContext, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronLeft,
  CircleHelp,
  FileText,
  FileUser,
  LayoutGrid,
  Menu,
  MessagesSquare,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

import { TitleContext } from "../../context/TitleContext";
import { useAuth, useHome } from "../../hooks/Hook";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { setTitle } = useContext(TitleContext);

  const {
    setActivePage,
    activePage,
    adminActivePage,
    setAdminActivePage,
    recruiterActivePage,
    setRecruiterActivePage
  } = useHome();

  const { admin, recruiter, user } = useAuth();

  const currentAccount = admin || recruiter || user;
  const isAdmin = Boolean(admin);
  const isRecruiter = Boolean(recruiter);

  const accountName =
    currentAccount?.name ||
    currentAccount?.fullName ||
    "My Account";

  const accountRole = isAdmin
  ? "Administrator"
  : isRecruiter
    ? "Recruiter"
    : "Candidate";

  const adminItems = [
    {
      label: "Dashboard",
      page: "admin/dashboard",
      title: "Dashboard",
      icon: LayoutGrid,
    },
    {
      label: "Users",
      page: "users",
      title: "Users",
      icon: User,
    },
    {
      label: "Companies",
      page: "companies",
      title: "Companies",
      icon: Building2,
    },
    {
      label: "Jobs",
      page: "admin/jobs",
      title: "Jobs",
      icon: FileText,
    },
    {
      label: "Reports",
      page: "reports",
      title: "Reports",
      icon: CircleHelp,
    },
    {
      label: "Settings",
      page: "admin/settings",
      title: "Settings",
      icon: Settings,
      section: "ACCOUNT",
    },
  ];

  const recruiterItems = [
    {
      label: "Dashboard",
      page: "recruiter/dashboard",
      title: "Dashboard",
      icon: LayoutGrid
    },
    {
      label: "Jobs Dashboard",
      page: "recruiter/jobs",
      title: "JobsDashboard",
      icon: BriefcaseBusiness
    },
    {
      label: "Applications Dashboard",
      page: "recruiter/application",
      title: "ApplicationsDashboard",
      icon: FileText
    },
    {
      label: "Interviews Dashboard",
      page: "recruiter/interviews",
      title: "InterviewsDashboard",
      icon: CalendarDays
    },
    {
      label: "Company Dashboard",
      page: "recruiter/company",
      title: "Company Dashboard",
      icon: Building2
    },
    {
      label: "Message Dashboard",
      page: "recruiter/message",
      title: "Message",
      icon: MessagesSquare,
    },
    {
      label: "Settings",
      page: "recruiter/settings",
      title: "Settings",
      icon: Settings,
      section: "ACCOUNT"
    },
  ]

  const workspaceItems = [
    {
      label: "Overview",
      page: "overview",
      title: "Overview",
      icon: LayoutGrid,
    },
    {
      label: "Find jobs",
      page: "jobs",
      title: "Find jobs",
      icon: Search,
    },
    {
      label: "Applications",
      page: "applications",
      title: "Application",
      icon: FileText,
    },
    {
      label: "Interviews",
      page: "interviews",
      title: "Interviews",
      icon: CalendarDays,
    },
    {
      label: "Messages",
      page: "chats",
      title: "Messages",
      icon: MessagesSquare,
    },
    {
      label: "My Profile",
      page: "profile",
      title: "My Profile",
      icon: User,
      section: "ACCOUNT",
    },
    {
      label: "Resume",
      page: "resume",
      title: "Resume",
      icon: FileUser,
    },
    {
      label: "Settings",
      page: "settings",
      title: "Settings",
      icon: Settings,
    },
  ];

  const items = isAdmin
  ? adminItems
  : isRecruiter
    ? recruiterItems
    : workspaceItems;

  const handleNavigation = (item) => {
    if (isAdmin) {
      setAdminActivePage(item.page);
    } else if (isRecruiter){
      setRecruiterActivePage(item.page);
    } else {
      setActivePage(item.page);
    }

    setTitle(item.title);
  };

  const isActive = (page) =>
    (isAdmin ? adminActivePage : isRecruiter ? recruiterActivePage : activePage) === page;

  const sidebarWidth = isSidebarOpen ? "w-64" : "w-[76px]";

  const itemBase =
    "group relative flex h-11 w-full shrink-0 items-center rounded-xl text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1";

  const getItemClass = (active) =>
    `${itemBase} ${
      isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
    } ${
      active
        ? "bg-[#EEF0FF] text-[#5950E6]"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    }`;

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.page);

    return (
      <React.Fragment key={item.page}>
        {item.section && isSidebarOpen && (
          <div className="px-3 pb-2 pt-5 text-[10px] font-bold tracking-[0.16em] text-slate-400">
            {item.section}
          </div>
        )}

        <button
          type="button"
          onClick={() => handleNavigation(item)}
          aria-current={active ? "page" : undefined}
          aria-label={!isSidebarOpen ? item.label : undefined}
          title={!isSidebarOpen ? item.label : undefined}
          className={getItemClass(active)}
        >
          {active && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#5950E6]" />
          )}

          <Icon
            size={19}
            strokeWidth={active ? 2.2 : 1.8}
            className={`shrink-0 transition-colors ${
              active
                ? "text-[#5950E6]"
                : "text-slate-400 group-hover:text-slate-700"
            }`}
          />

          {isSidebarOpen && (
            <span className="min-w-0 flex-1 truncate text-left">
              {item.label}
            </span>
          )}
        </button>
      </React.Fragment>
    );
  };

  return (
    <aside
      className={`flex h-screen ${sidebarWidth} shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white transition-[width] duration-200 ease-in-out`}
    >
      {/* Logo */}
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-slate-100 ${
          isSidebarOpen ? "gap-3 px-5" : "justify-center px-0"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-700 text-white shadow-sm shadow-violet-700/20">
          <span className="text-xl font-extrabold">P</span>
        </div>

        {isSidebarOpen && (
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-950">
            Peer<span className="text-violet-600">.</span>Hiring
          </span>
        )}
      </div>

      {/* Account */}
      <div className={`shrink-0 px-3 pt-5 ${isSidebarOpen ? "" : "px-2"}`}>
        <button
          type="button"
          title={!isSidebarOpen ? `${accountName} · ${accountRole}` : undefined}
          aria-label={`Account: ${accountName}, ${accountRole}`}
          className={`flex min-h-[58px] w-full items-center rounded-xl border border-slate-200/80 bg-slate-50/70 transition-colors hover:border-violet-200 hover:bg-violet-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
            isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-white text-violet-700">
            {isAdmin ? (
              <Settings size={18} />
            ) : (
              <Building2 size={18} />
            )}
          </div>

          {isSidebarOpen && (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-slate-800">
                {accountName}
              </p>
              <p className="mt-1 truncate text-[11px] capitalize text-slate-500">
                {accountRole}
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className={`mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 ${
          isSidebarOpen ? "" : "px-2"
        }`}
      >
        {isSidebarOpen && (
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
            {isAdmin
  ? "ADMINISTRATION"
  : isRecruiter
    ? "RECRUITER"
    : "WORKSPACE"}
          </p>
        )}

        <div className="flex flex-col gap-1">
          {items.map(renderItem)}
        </div>
      </nav>

      {/* Bottom area */}
      <div
        className={`shrink-0 border-t border-slate-100 p-3 ${
          isSidebarOpen ? "" : "px-2"
        }`}
      >
        {/* Help */}
        <button
          type="button"
          title={!isSidebarOpen ? "Help center" : undefined}
          onClick={() => {
            // Connect your help center route or modal here.
            setTitle("Help Center");
          }}
          className={`mb-2 flex min-h-[54px] w-full items-center rounded-xl border border-violet-100 bg-[#EEF0FF]/70 text-left transition-colors hover:bg-[#EEF0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
            isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#5950E6]">
            <CircleHelp size={19} />
          </span>

          {isSidebarOpen && (
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-800">
                Need help?
              </span>
              <span className="mt-1 block truncate text-[10px] text-slate-500">
                Visit our help center
              </span>
            </span>
          )}
        </button>

        {/* Collapse */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen((previous) => !previous)}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`flex h-11 w-full items-center rounded-xl text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
            isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
          }`}
        >
          {isSidebarOpen ? (
            <>
              <ChevronLeft size={19} className="shrink-0 text-slate-400" />
              <span>Collapse menu</span>
            </>
          ) : (
            <Menu size={20} className="text-slate-500" />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;