import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";

function RecruiterSidebar() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const navigation = [
    {
      section: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/recruiter",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },

    {
      section: "Hiring",
      items: [
        {
          name: "Hiring Jobs",
          path: "/recruiter/jobs",
          icon: BriefcaseBusiness,
          badge: "8",
        },
        {
          name: "Applications",
          path: "/recruiter/applications",
          icon: FileText,
          badge: "24",
        },
        {
          name: "Interviews",
          path: "/recruiter/interviews",
          icon: CalendarDays,
          badge: "4",
        },
        {
          name: "Candidates",
          path: "/recruiter/candidates",
          icon: UserRoundSearch,
        },
      ],
    },

    {
      section: "Company",
      items: [
        {
          name: "Company Profile",
          path: "/recruiter/company",
          icon: Building2,
        },
        {
          name: "Team Members",
          path: "/recruiter/team",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <aside
      className="
        fixed
        left-0
        top-[72px]
        bottom-0
        z-40
        hidden
        w-[270px]
        border-r
        border-gray-200
        bg-white
        md:flex
      "
    >
      <div className="flex h-full w-full flex-col">

        {/* =====================================================
            WORKSPACE HEADER
        ====================================================== */}

        <div
          className="
            relative
            h-[128px]
            shrink-0
            overflow-visible
            bg-gradient-to-br
            from-[#6D28D9]
            via-[#7C3AED]
            to-[#8B5CF6]
          "
        >
          {/* Decorative circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-12
              h-32
              w-32
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-14
              -left-8
              h-28
              w-28
              rounded-full
              bg-white/10
            "
          />

          {/* Content */}

          <div className="relative h-full px-5 py-5">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-violet-200
              "
            >
              Workspace
            </p>

            <button
              type="button"
              onClick={() => setWorkspaceOpen((prev) => !prev)}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                text-left
                transition
                hover:bg-white/5
              "
            >
              <div className="flex min-w-0 items-center gap-3">

                {/* Company icon */}

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-[#6D28D9]
                    shadow-sm
                  "
                >
                  <Building2
                    size={18}
                    strokeWidth={2.2}
                  />
                </div>

                {/* Company info */}

                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-[13px]
                      font-bold
                      text-white
                    "
                  >
                    Acme Technologies
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      font-medium
                      text-violet-200
                    "
                  >
                    Recruiter workspace
                  </p>

                </div>
              </div>

              <ChevronDown
                size={17}
                className={`
                  ml-2
                  shrink-0
                  text-white/80
                  transition-transform
                  duration-200
                  ${workspaceOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Workspace dropdown */}

            {workspaceOpen && (
              <div
                className="
                  absolute
                  left-4
                  right-4
                  top-[92px]
                  z-50
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-2
                  shadow-xl
                "
              >
                <button
                  type="button"
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    bg-violet-50
                    px-3
                    py-2.5
                    text-left
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#6D28D9]
                      text-white
                    "
                  >
                    <Building2 size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      Acme Technologies
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#6D28D9]">
                      Current workspace
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            MAIN NAVIGATION
        ====================================================== */}

        <nav
          className="
            sidebar-scroll
            flex-1
            overflow-y-auto
            px-4
            py-7
          "
        >
          {navigation.map((section) => (
            <div
              key={section.section}
              className="mb-7 last:mb-0"
            >
              {/* Section title */}

              <p
                className="
                  mb-2.5
                  px-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-gray-400
                "
              >
                {section.section}
              </p>

              {/* Navigation items */}

              <div className="space-y-1">

                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) => `
                        group
                        relative
                        flex
                        h-11
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        px-3
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-[#F1EDFF] text-[#6D28D9]"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}

                          {isActive && (
                            <span
                              className="
                                absolute
                                left-0
                                top-1/2
                                h-6
                                w-[3px]
                                -translate-y-1/2
                                rounded-r-full
                                bg-[#6D28D9]
                              "
                            />
                          )}

                          {/* Icon + text */}

                          <div className="flex min-w-0 items-center gap-3">

                            <Icon
                              size={18}
                              strokeWidth={isActive ? 2.3 : 1.9}
                              className={`
                                shrink-0
                                transition-colors
                                ${
                                  isActive
                                    ? "text-[#6D28D9]"
                                    : "text-gray-400 group-hover:text-gray-700"
                                }
                              `}
                            />

                            <span
                              className={`
                                truncate
                                text-[13px]
                                ${
                                  isActive
                                    ? "font-semibold"
                                    : "font-medium"
                                }
                              `}
                            >
                              {item.name}
                            </span>

                          </div>

                          {/* Badge */}

                          {item.badge && (
                            <span
                              className={`
                                ml-2
                                shrink-0
                                rounded-md
                                px-2
                                py-0.5
                                text-[10px]
                                font-bold
                                ${
                                  isActive
                                    ? "bg-white text-[#6D28D9] shadow-sm"
                                    : "bg-gray-100 text-gray-500"
                                }
                              `}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>
            </div>
          ))}
        </nav>

        {/* =====================================================
            BOTTOM AREA
        ====================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-gray-100
            bg-white
            px-4
            pb-4
            pt-3
          "
        >

          {/* Settings */}

          <NavLink
            to="/recruiter/settings"
            className={({ isActive }) => `
              mt-1
              flex
              h-10
              items-center
              rounded-xl
              px-3
              transition
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <Settings
              size={18}
              strokeWidth={1.9}
            />

            <span className="ml-3 text-[13px] font-medium">
              Settings
            </span>
          </NavLink>

          {/* Profile */}

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              border-t
              border-gray-100
              pt-3
            "
          >
            {/* Avatar */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#EDE9FE]
                text-xs
                font-bold
                text-[#6D28D9]
              "
            >
              AY
            </div>

            {/* User info */}

            <div className="min-w-0 flex-1">

              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                  text-gray-800
                "
              >
                Aditya Yadav
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-gray-400
                "
              >
                Recruiter
              </p>

            </div>

            {/* Logout */}

            <button
              type="button"
              title="Logout"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-gray-400
                transition
                hover:bg-red-50
                hover:text-red-500
              "
            >
              <LogOut
                size={16}
                strokeWidth={1.9}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RecruiterSidebar;