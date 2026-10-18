import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  Home,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <BriefcaseBusiness size={22} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Peer<span className="text-violet-600">.</span>Hiring
          </span>
        </Link>

        <p className="hidden text-sm font-medium text-slate-500 sm:block">
          Better People <span className="mx-2 text-violet-500">•</span>
          Better Opportunities
        </p>
      </header>

      {/* Main */}
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-2xl text-center">
          {/* Custom 404 illustration */}
          <div
            aria-hidden="true"
            className="relative mx-auto mb-10 flex h-56 w-64 items-center justify-center sm:h-64 sm:w-72"
          >
            <div className="absolute left-8 top-6 h-40 w-40 rounded-full bg-violet-50 sm:h-48 sm:w-48" />

            <div className="absolute bottom-5 left-1/2 h-1 w-48 -translate-x-1/2 rounded-full bg-violet-100" />

            {/* Browser window */}
            <div className="absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-6 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-xl shadow-violet-900/10 sm:w-56">
              <div className="flex h-9 items-center gap-1.5 border-b border-violet-100 bg-violet-50 px-3">
                <span className="h-2 w-2 rounded-full bg-violet-300" />
                <span className="h-2 w-2 rounded-full bg-violet-200" />
                <span className="h-2 w-2 rounded-full bg-violet-200" />
              </div>

              <div className="flex h-32 flex-col items-center justify-center sm:h-36">
                <span className="text-5xl font-extrabold tracking-tight text-violet-600 sm:text-6xl">
                  404
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Page not found
                </span>
              </div>
            </div>

            {/* Floating compass */}
            <div className="absolute right-3 top-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-white text-violet-600 shadow-md shadow-violet-900/5 sm:right-0">
              <Compass size={24} strokeWidth={1.7} />
            </div>

            {/* Decorative shapes */}
            <span className="absolute bottom-10 left-5 h-3 w-3 rounded-full bg-violet-300" />
            <span className="absolute left-7 top-12 h-2 w-2 rounded-full bg-indigo-300" />
            <span className="absolute bottom-16 right-6 h-2.5 w-2.5 rounded-full bg-violet-200" />
          </div>

          {/* Message */}
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Error 404
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Oops! Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
            The page you’re looking for doesn’t exist, may have moved,
            or is no longer available. Don’t worry, let’s get you back
            on track.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={17} />
              Go back
            </button>
          </div>

          {/* Helpful note */}
          <div className="mx-auto mt-12 flex max-w-md items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Compass size={17} />
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
            Check the URL or use the navigation options above to find
            your way back.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs font-semibold text-slate-500">
            Peer.Hiring
          </p>
          <p className="text-xs text-slate-400">
            Connecting people with opportunities.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default NotFound;