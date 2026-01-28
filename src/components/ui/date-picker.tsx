import { useEffect, useRef, useState } from 'react';
import {
  DayPicker,
  SelectSingleEventHandler,
  SelectMultipleEventHandler,
  SelectRangeEventHandler,
  DateRange,
} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

type DatePickerProps = {
  label?: string;
  mandatory?: boolean;
  mode?: 'single' | 'multiple' | 'range';
  value?: Date | Date[] | DateRange;
  onChange?: (date: Date | Date[] | DateRange | undefined) => void;
  position?: 'start' | 'end';
  placeholder?: string;
};

export default function DatePicker({
  label,
  mandatory,
  mode = 'single',
  value,
  onChange,
  position = 'start',
  placeholder = 'Choose Date',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => format(date, 'dd MMM yyyy');

  const getFormattedDate = () => {
    if (mode === 'single') {
      return value instanceof Date ? format(value, 'dd MMMM yyyy') : placeholder;
    }

    if (mode === 'multiple') {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      return value.map((date) => format(date, 'dd MMM')).join(', ');
    }

    if (mode === 'range') {
      const range = value as DateRange;
      if (!range?.from) return placeholder;
      if (range.to) return `${formatDate(range.from)} - ${formatDate(range.to)}`;
      return `${formatDate(range.from)} - ...`;
    }

    return placeholder;
  };

  const getPositionClass = () => {
    if (position === 'end') return 'right-0';
    return '';
  };

  const handleSelectSingle: SelectSingleEventHandler = (date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleSelectMultiple: SelectMultipleEventHandler = (dates) => {
    onChange?.(dates);
  };

  const handleSelectRange: SelectRangeEventHandler = (range) => {
    onChange?.(range);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {label && (
        <label className="block text-sm font-medium mb-1 dark:text-white">
          {label}
          {mandatory && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full truncate justify-between hs-dropdown-toggle inline-flex items-center gap-2 py-1.5 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-800 focus:ring-gray-800 focus:outline-none"
      >
        <span className="truncate overflow-hidden whitespace-nowrap text-black text-sm">{getFormattedDate()}</span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg ${getPositionClass()}`}
          onClick={(e) => e.stopPropagation()}
        >
          {mode === 'single' && (
            <DayPicker
              mode="single"
              captionLayout="dropdown"
              selected={value as Date}
              onSelect={handleSelectSingle}
              className="p-1"
            />
          )}
          {mode === 'multiple' && (
            <DayPicker
              mode="multiple"
              captionLayout="dropdown"
              selected={value as Date[]}
              onSelect={handleSelectMultiple}
              className="p-1"
            />
          )}
          {mode === 'range' && (
            <DayPicker
              mode="range"
              captionLayout="dropdown"
              selected={value as DateRange}
              onSelect={handleSelectRange}
              className="p-1"
            />
          )}
        </div>
      )}
    </div>
  );
};