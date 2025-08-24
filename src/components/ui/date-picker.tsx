"use client";

import React, { useState, useEffect } from "react";

type DatePickerProps = {
  mode?: "single" | "range";
  onChange?: (date: Date | [Date, Date]) => void;
  initialDate?: Date | null;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker: React.FC<DatePickerProps> = ({ mode = "single", onChange, initialDate = null }) => {
  const [today, setToday] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    if (initialDate) {
      setCurrentMonth(initialDate.getMonth());
      setCurrentYear(initialDate.getFullYear());
    } else {
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
    }
  }, [initialDate]);

  if (currentMonth === null || currentYear === null || today === null) {
    return <div>Loading...</div>;
  };

  const getRangePartClass = (date: Date) => {
    if (!rangeStart || !rangeEnd) return "";

    const isStart = date.toDateString() === rangeStart.toDateString();
    const isEnd = date.toDateString() === rangeEnd.toDateString();

    if (isStart && isEnd) {
      return "bg-blue-600 text-white rounded-full";
    }

    if (isStart) {
      return "bg-gray-100 rounded-l-full";
    }

    if (isEnd) {
      return "bg-gray-100 rounded-r-full";
    }

    if (date > rangeStart && date < rangeEnd) {
      return "bg-gray-100";
    }

    return "";
  };

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days: (Date | null)[] = [];

    const firstDay = date.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => (y !== null ? y - 1 : null));
    } else {
      setCurrentMonth((m) => (m !== null ? m - 1 : null));
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => (y !== null ? y + 1 : null));
    } else {
      setCurrentMonth((m) => (m !== null ? m + 1 : null));
    }
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;

    if (mode === "single") {
      setSelectedDate(date);
      onChange?.(date);
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
      } else if (rangeStart && !rangeEnd) {
        if (date < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
          onChange?.([date, rangeStart]);
        } else {
          setRangeEnd(date);
          onChange?.([rangeStart, date]);
        }
      }
    }
  };

  const isSelected = (date: Date) => {
    if (mode === "single") {
      return selectedDate?.toDateString() === date.toDateString();
    } else {
      if (rangeStart && !rangeEnd) {
        return date.toDateString() === rangeStart.toDateString();
      }
      if (rangeStart && rangeEnd) {
        return date >= rangeStart && date <= rangeEnd;
      }
      return false;
    }
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="w-80 flex flex-col bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <div className="p-3 space-y-0.5">
        {/* Header */}
        <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-2">
          <div onClick={handlePrevMonth} className="col-span-1 cursor-pointer">
            <button
              type="button"
              className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full focus:outline-hidden focus:bg-gray-100"
              aria-label="Previous"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="col-span-3 flex justify-center items-center gap-x-1 pointer-events-none select-none">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div onClick={handleNextMonth} className="col-span-1 flex justify-end cursor-pointer">
            <button
              type="button"
              className=" size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full focus:outline-hidden focus:bg-gray-100"
              aria-label="Next"
            >
              <svg
                className="shrink-0 size-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-gray-500 text-sm mb-1">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={idx}></div>;
            }

            const isToday = date.toDateString() === today.toDateString();
            const isStart = rangeStart && date.toDateString() === rangeStart.toDateString();
            const isEnd = rangeEnd && date.toDateString() === rangeEnd.toDateString();
            const isSingleSelected = mode === "single" && selectedDate?.toDateString() === date.toDateString();

            const wrapperClass = mode === "range" ? getRangePartClass(date) : "";
            const isRangeEdge = isStart || isEnd;

            return (
              <div key={idx} className={`flex justify-center items-center ${wrapperClass}`}>
                <button
                  disabled={!date}
                  onClick={() => handleDateClick(date)}
                  className={`
                    h-9 w-9 
                    ${isSingleSelected || isRangeEdge ? "bg-blue-600 text-white rounded-full" : ""}
                    ${!isSingleSelected && !isToday && !isRangeEdge ? "hover:bg-gray-100" : "cursor-default"}
                    disabled:opacity-40
                  `}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;