import React, { useContext, useState } from "react";
import {
    Building2,
    CalendarDays,
    CircleHelp,
    FileText,
    LayoutGrid,
    Menu,
    MessagesSquare,
    Search,
    Settings,
    User,
} from "lucide-react";

import { TitleContext } from "../../context/TitleContext";
import { useAuth, useHome } from "../../hooks/Hook";

function Sidebar() {
    const [isSidebarOpen, setisSidebarOpen] = useState(false);

    const { setTitle } = useContext(TitleContext);

    const { setActivePage, activePage } = useHome();

    const { admin, recruiter, user } = useAuth();

    const currentAccount = admin || recruiter || user;

    const isAdmin = !!admin;

    return (
        <div
            className={`w-full ${
                isSidebarOpen ? "md:w-64" : "md:w-25"
            } h-screen overflow-y-auto overscroll-contain shrink-0 gap-4 p-4 bg-white flex flex-col`}
        >
            {/* ================= LOGO ================= */}

            <div className="flex items-center gap-2 sm:gap-3">
                <div
                    className={`w-8 h-8 items-center shadow shadow-violet-800 justify-center ${
                        isSidebarOpen ? "" : "ml-5"
                    } flex rounded-xl object-contain bg-violet-700`}
                >
                    <span className="font-extrabold text-[17px] text-white">
                        P
                    </span>
                </div>

                {isSidebarOpen && (
                    <p className="text-lg sm:text-xl font-bold text-slate-950">
                        Peer.Hiring
                    </p>
                )}
            </div>

            {/* ================= ACCOUNT ================= */}

            <button
                type="button"
                className={`outline-none cursor-pointer mt-3 p-3 border border-violet-200 rounded-xl w-full flex items-center gap-4 ${
                    isSidebarOpen ? "text-left" : "justify-center"
                } transition-all duration-200`}
            >
                <Building2 className="w-5 h-5 shrink-0" />

                {isSidebarOpen && (
                    <div>
                        <p className="font-semibold text-xs">
                            {currentAccount?.name}
                        </p>

                        <p className="text-[10px] text-slate-500 mt-1">
                            {currentAccount?.role ||
                                currentAccount?.type}
                        </p>
                    </div>
                )}
            </button>

            {/* ================= SIDEBAR MENU ================= */}

            <div className="flex flex-wrap flex-col gap-1">

                {/* =====================================================
                    ADMIN SIDEBAR
                ====================================================== */}

                {isAdmin ? (
                    <>
                        {isSidebarOpen && (
                            <span className="text-[10px] p-3 pl-5 text-slate-500 font-semibold">
                                ADMIN
                            </span>
                        )}

                        {/* Dashboard */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("admin/dashboard");
                                setTitle("Dashboard");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "admin/dashboard"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <LayoutGrid
                                className={`w-5 h-5 ${
                                    activePage === "admin/dashboard"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Dashboard</span>
                            )}
                        </button>

                        {/* Users */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("users");
                                setTitle("Users");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "users"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <User
                                className={`w-5 h-5 ${
                                    activePage === "users"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Users</span>
                            )}
                        </button>

                        {/* Companies */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("companies");
                                setTitle("Companies");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "companies"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <Building2
                                className={`w-5 h-5 ${
                                    activePage === "companies"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Companies</span>
                            )}
                        </button>

                        {/* Jobs */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("jobs");
                                setTitle("Jobs");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "jobs"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <FileText
                                className={`w-5 h-5 ${
                                    activePage === "jobs"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Jobs</span>
                            )}
                        </button>

                        {/* Reports */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("reports");
                                setTitle("Reports");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "reports"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <CircleHelp
                                className={`w-5 h-5 ${
                                    activePage === "reports"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Reports</span>
                            )}
                        </button>

                        {/* Account */}

                        {isSidebarOpen && (
                            <span className="text-[10px] p-3 pl-5 text-slate-500 font-semibold">
                                ACCOUNT
                            </span>
                        )}

                        {/* Settings */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("settings");
                                setTitle("Settings");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "settings"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <Settings
                                className={`w-5 h-5 ${
                                    activePage === "settings"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Settings</span>
                            )}
                        </button>
                    </>
                ) : (

                    /* =====================================================
                       USER / RECRUITER SIDEBAR
                    ====================================================== */

                    <>
                        {isSidebarOpen && (
                            <span className="text-[10px] p-3 pl-5 text-slate-500 font-semibold">
                                WORKSPACE
                            </span>
                        )}

                        {/* Overview */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("overview");
                                setTitle("Overview");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "overview"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <LayoutGrid
                                className={`w-5 h-5 ${
                                    activePage === "overview"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Overview</span>
                            )}
                        </button>

                        {/* Find Jobs */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("jobs");
                                setTitle("Find jobs");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "jobs"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <Search
                                className={`w-5 h-5 ${
                                    activePage === "jobs"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Find jobs</span>
                            )}
                        </button>

                        {/* Applications */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("applications");
                                setTitle("Application");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "applications"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <FileText
                                className={`w-5 h-5 ${
                                    activePage === "applications"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Applications</span>
                            )}
                        </button>

                        {/* Interviews */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("interviews");
                                setTitle("Interviews");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "interviews"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <CalendarDays
                                className={`w-5 h-5 ${
                                    activePage === "interviews"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Interviews</span>
                            )}
                        </button>

                        {/* Messages */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("messages");
                                setTitle("Messages");
                            }}
                            className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
                                activePage === "messages"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            <MessagesSquare
                                className={`w-5 h-5 ${
                                    activePage === "messages"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Messages</span>
                            )}
                        </button>

                        {/* Account */}

                        {isSidebarOpen && (
                            <span className="text-[10px] p-3 pl-5 text-slate-500 font-semibold">
                                ACCOUNT
                            </span>
                        )}

                        {/* Profile */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("profile");
                                setTitle("My Profile");
                            }}
                            className={`w-full flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm font-medium ${
                                activePage === "profile"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500"
                            }`}
                        >
                            <User
                                className={`w-5 h-5 ${
                                    activePage === "profile"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>My Profile</span>
                            )}
                        </button>

                        {/* Settings */}

                        <button
                            type="button"
                            onClick={() => {
                                setActivePage("settings");
                                setTitle("Settings");
                            }}
                            className={`w-full flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm font-medium ${
                                activePage === "settings"
                                    ? "bg-[#EEF0FF] text-[#5950E6]"
                                    : "text-gray-500"
                            }`}
                        >
                            <Settings
                                className={`w-5 h-5 ${
                                    activePage === "settings"
                                        ? "text-[#5950E6]"
                                        : "text-gray-500"
                                }`}
                            />

                            {isSidebarOpen && (
                                <span>Settings</span>
                            )}
                        </button>
                    </>
                )}
            </div>

            {/* ================= HELP ================= */}

            <p
                className={`outline-none cursor-pointer mt-3 p-3 border-violet-300 bg-[#EEF0FF] border rounded-xl w-full flex items-center gap-4 ${
                    isSidebarOpen ? "text-left" : "justify-center"
                } transition-all duration-200`}
            >
                <CircleHelp className="w-5 h-5 text-indigo-500" />

                {isSidebarOpen && (
                    <div>
                        <p className="font-semibold text-sm">
                            Need a help?
                        </p>

                        <p className="text-[10px] text-slate-500 mt-1">
                            Visit our help center
                        </p>
                    </div>
                )}
            </p>

            {/* ================= COLLAPSE ================= */}

            <div
                className={`${
                    isSidebarOpen
                        ? ""
                        : "flex text-center justify-center"
                }`}
            >
                <button
                    type="button"
                    onClick={() =>
                        setisSidebarOpen(!isSidebarOpen)
                    }
                    className="flex gap-2 p-2.5 font-medium hover:bg-gray-100 rounded-xl text-gray-500 text-sm"
                >
                    <Menu className="w-5 h-5 text-slate-400" />

                    {isSidebarOpen && (
                        <span>Collapse menu</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;