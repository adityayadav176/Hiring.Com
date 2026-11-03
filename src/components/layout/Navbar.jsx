import { useContext } from "react";

import {
    ChevronDown,
    Menu,
    BellIcon,
    CircleQuestionMark,
    X,
} from "lucide-react";

import { useAuth, useHome } from "../../hooks/Hook";
import { TitleContext } from "../../context/TitleContext";

function Navbar({
    isMobileMenuOpen = false,
    setIsMobileMenuOpen = () => {},
}) {
    const { user, admin, recruiter } = useAuth();

    const { title, setTitle } = useContext(TitleContext);

    const {
        setActivePage,
        setAdminActivePage,
        setRecruiterActivePage,
    } = useHome();

    const currentAccount = user || admin || recruiter;

    const handleProfileNavigation = () => {
        if (admin) {
            setAdminActivePage("admin/profile");
            setTitle("Admin Profile");
        } else if (recruiter) {
            setRecruiterActivePage("recruiter/profile");
            setTitle("Profile");
        } else {
            setActivePage("profile");
            setTitle("My Profile");
        }

        // Close drawer if it is open
        setIsMobileMenuOpen(false);
    };

    const avatarUrl = currentAccount?.avatar?.url;

    const avatarLetter =
        currentAccount?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <nav className="sticky top-0 z-40 flex h-[76px] w-full min-w-0 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 lg:px-8">

            {/* Left Side */}
            <div className="flex min-w-0 items-center gap-3">

                {/* Mobile Hamburger */}
                <button
                    type="button"
                    onClick={() =>
                        setIsMobileMenuOpen((previous) => !previous)
                    }
                    aria-label={
                        isMobileMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={isMobileMenuOpen}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                >
                    {isMobileMenuOpen ? (
                        <X size={21} />
                    ) : (
                        <Menu size={21} />
                    )}
                </button>

                {/* Breadcrumb */}
                <div className="flex min-w-0 items-center gap-2">

                    <p className="hidden text-sm text-slate-500 sm:block">
                        Workspace
                    </p>

                    <span className="hidden text-sm text-slate-400 sm:block">
                        /
                    </span>

                    <p className="truncate text-sm font-semibold text-slate-950 sm:text-base">
                        {title || "Dashboard"}
                    </p>

                </div>
            </div>

            {/* Right Side */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                {/* Notifications */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                >
                    <BellIcon className="h-5 w-5" />
                </button>

                {/* Help */}
                <button
                    type="button"
                    aria-label="Help center"
                    onClick={() => setTitle("Help Center")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                >
                    <CircleQuestionMark className="h-5 w-5" />
                </button>

                {/* Desktop Profile */}
                <button
                    type="button"
                    onClick={handleProfileNavigation}
                    className="hidden max-w-[200px] items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-50 md:flex"
                >

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-700">

                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={currentAccount?.name || "User"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            avatarLetter
                        )}

                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-semibold text-slate-900">
                            {currentAccount?.name || "My Account"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-slate-500">
                            {admin
                                ? "Admin"
                                : recruiter
                                    ? "Recruiter"
                                    : currentAccount?.role ||
                                      currentAccount?.type ||
                                      "User"}
                        </p>

                    </div>

                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />

                </button>

                {/* Mobile Profile Shortcut */}
                <button
                    type="button"
                    onClick={handleProfileNavigation}
                    aria-label="Open profile"
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-700 md:hidden"
                >

                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={currentAccount?.name || "User"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        avatarLetter
                    )}

                </button>

            </div>
        </nav>
    );
}

export default Navbar;