import React from "react";
import {
  ChevronRight,
  MapPin,
  FileText,
  Check,
  Circle,
} from "lucide-react";

const ApplicationCard = ({
  application,
  statusStyle,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 transition duration-200 hover:border-slate-300 hover:shadow-[0_6px_25px_rgba(15,23,42,0.04)]">

      {/* ================= TOP ================= */}

      <div className="flex items-start justify-between">

        {/* Company + Job */}
        <div className="flex gap-3.5">

          {/* Company Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700">
            {application?.company
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {application?.company}
            </p>

            <h2 className="mt-0.5 text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
              {application?.jobTitle}
            </h2>

            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">

              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {application?.location}
              </span>

              <span>•</span>

              <span>
                {application?.type}
              </span>

            </div>

          </div>

        </div>


        {/* Status */}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyle(application?.status)}`}
        >
          {application?.status}
        </span>

      </div>


      {/* ================= TIMELINE ================= */}

      <div className="mt-7 px-2">

        <div className="relative flex items-start justify-between">

          {/* Connecting Line */}
          <div className="absolute left-[7px] right-[7px] top-[7px] h-px bg-slate-200" />


          {application?.steps?.map(
            (step) => (
              <div
                key={step.label}
                className="relative z-10 flex w-[25%] flex-col"
              >

                {/* Circle */}
                <div>

                  {step.completed ? (
                    <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-violet-600 ring-4 ring-white">

                      <Check
                        size={9}
                        strokeWidth={3}
                        className="text-white"
                      />

                    </div>
                  ) : (
                    <Circle
                      size={15}
                      strokeWidth={1.5}
                      className="fill-white text-slate-300"
                    />
                  )}

                </div>


                {/* Label */}
                <p
                  className={`mt-2 text-[10px] font-medium ${
                    step.completed
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>


                {/* Date */}
                {step.date && (
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    {step.date}
                  </p>
                )}

              </div>
            )
          )}

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

        <div className="flex items-center gap-5 text-[10px] text-slate-400">

          <span className="flex items-center gap-1.5">
            <FileText size={12} />
            {application?.resume}
          </span>

          <span>
            Applied {application?.appliedAt}
          </span>

        </div>


        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-medium text-violet-600 transition hover:text-violet-700"
        >
          View application

          <ChevronRight size={13} />
        </button>

      </div>

    </div>
  );
};

export default ApplicationCard;