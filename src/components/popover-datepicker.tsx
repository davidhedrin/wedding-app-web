"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "./ui/date-picker";

type DatePickerPopoverProps = {
  mode?: "single" | "range";
  onChange?: (date: Date | [Date, Date]) => void;
};

const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({ mode = "single", onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formattedDate = (() => {
    if (mode === "single") {
      return selectedDate instanceof Date ? formatDate(selectedDate) : "Pilih tanggal";
    }

    if (mode === "range") {
      if (Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
        const [start, end] = selectedDate;
        return `${formatDate(start)} - ${formatDate(end)}`;
      }
      return "Pilih rentang tanggal";
    }

    return "Pilih tanggal";
  })();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-center items-center py-2 px-3 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
      >
        {formattedDate}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 right-0 w-max">
          <DatePicker
            mode={mode}
            initialDate={
              Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
            }
            onChange={(date) => {
              if(onChange) onChange(date);
              setSelectedDate(date);
              if (
                (mode === "single" && date instanceof Date) ||
                (mode === "range" &&
                  Array.isArray(date) &&
                  date[0] &&
                  date[1])
              ) {
                setIsOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerPopover;
