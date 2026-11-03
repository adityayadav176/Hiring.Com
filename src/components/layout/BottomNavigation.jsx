import { useHome, useAuth } from "../../hooks/Hook";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  MessageSquare,
  Users,
  Building2,
  ClipboardList,
} from "lucide-react";

function BottomNavigation() {
  const {
    activePage,
    adminActivePage,
    recruiterActivePage,
    setActivePage,
    setAdminActivePage,
    setRecruiterActivePage,
  } = useHome();

  const { admin, recruiter } = useAuth();

  const isAdmin = Boolean(admin);
  const isRecruiter = Boolean(recruiter);

  const adminItems = [
    { label: "Dashboard", page: "admin/dashboard", icon: LayoutDashboard },
    { label: "Users", page: "users", icon: Users },
    { label: "Companies", page: "companies", icon: Building2 },
    { label: "Jobs", page: "admin/jobs", icon: BriefcaseBusiness },
    { label: "Reports", page: "reports", icon: ClipboardList },
  ];

  const recruiterItems = [
    { label: "Dashboard", page: "recruiter/dashboard", icon: LayoutDashboard },
    { label: "Jobs", page: "recruiter/jobs", icon: BriefcaseBusiness },
    { label: "Applications", page: "recruiter/application", icon: FileText },
    { label: "Interviews", page: "recruiter/interviews", icon: CalendarDays },
    { label: "Messages", page: "/recruiter/chat", icon: MessageSquare },
  ];

  const candidateItems = [
    { label: "Overview", page: "overview", icon: LayoutDashboard },
    { label: "Jobs", page: "jobs", icon: BriefcaseBusiness },
    { label: "Applications", page: "applications", icon: FileText },
    { label: "Interviews", page: "interviews", icon: CalendarDays },
    { label: "Messages", page: "chats", icon: MessageSquare },
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

  const handleNavigation = (page) => {
    if (isAdmin) {
      setAdminActivePage(page);
    } else if (isRecruiter) {
      setRecruiterActivePage(page);
    } else {
      setActivePage(page);
    }
  };

  // Hide dock during full-screen recruiter chat.
  if (recruiterActivePage === "/recruiter/chat" && activePage === "chats") {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-2 lg:hidden">
      <div
        className="flex h-[54px] items-center gap-1 rounded-full
        border border-white/10 bg-[#101014] px-2 shadow-[0_8px_30px_rgba(0,0,0,0.28)]
        backdrop-blur-xl"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;

          return (
            <button
              key={item.page}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleNavigation(item.page)}
              className={`group relative flex h-[40px] w-[40px] shrink-0
                items-center justify-center rounded-full
                transition-all duration-300 ease-out
                active:scale-90 ${
                  isActive
                    ? "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 text-white shadow-[0_0_18px_rgba(139,92,246,0.55)]"
                    : "bg-[#09090b] text-slate-400 hover:bg-[#24202e] hover:text-violet-300"
                }`}
            >
              {/* Subtle violet glow */}
              {isActive && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-violet-400/20 blur-md" />
              )}

              <Icon
                size={19}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={`relative z-10 transition-transform duration-300 ${
                  isActive
                    ? "scale-105"
                    : "group-hover:scale-110"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;