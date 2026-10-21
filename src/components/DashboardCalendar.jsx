
import React, { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function DashboardCalendar({ onSelectDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthLabel = visibleMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const startOffset = (firstDay + 6) % 7;

  const calendarDays = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const isToday = (day) =>
    day &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day) =>
    day &&
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  const selectDate = (day) => {
    if (!day) return;

    const date = new Date(year, month, day);
    setSelectedDate(date);
    onSelectDate?.(date);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setVisibleMonth((current) =>
      new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();
    setVisibleMonth(now);
    setSelectedDate(now);
    onSelectDate?.(now);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600"
      >
        <CalendarDays size={17} />
        {selectedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
        <ChevronRight
          size={15}
          className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            aria-label="Close calendar"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-14 z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#11152A]">
                  Calendar
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Your hiring schedule
                </p>
              </div>

              <button
                onClick={goToToday}
                className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-100"
              >
                Today
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-600"
              >
                <ChevronLeft size={16} />
              </button>

              <p className="text-sm font-semibold text-[#11152A]">
                {monthLabel}
              </p>

              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div
                    key={day}
                    className="py-2 text-[10px] font-semibold uppercase text-slate-400"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day, index) => (
                <div key={`${day ?? "empty"}-${index}`} className="flex justify-center">
                  {day ? (
                    <button
                      onClick={() => selectDate(day)}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-medium transition ${
                        isSelected(day)
                          ? "bg-violet-600 text-white shadow-sm"
                          : isToday(day)
                            ? "border border-violet-300 bg-violet-50 font-bold text-violet-700"
                            : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      {day}
                      {isToday(day) && !isSelected(day) && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-500" />
                      )}
                    </button>
                  ) : (
                    <div className="h-9 w-9" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Selected date
              </p>
              <p className="mt-1 text-sm font-semibold text-violet-600">
                {selectedDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardCalendar;
