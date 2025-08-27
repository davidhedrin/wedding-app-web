import { useEffect, useRef, useState } from 'react';
import { DayPicker, SelectSingleEventHandler, SelectMultipleEventHandler, SelectRangeEventHandler, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

type DatePickerProps = {
  label?: string;
  required?: boolean | undefined;
  mode?: 'single' | 'multiple' | 'range';
  value?: Date | Date[] | DateRange | undefined;
  onChange?: (date: Date | Date[] | DateRange | undefined) => void;
  position?: 'start' | 'end';
};

export default function DatePicker({ label, required, mode = 'single', value, onChange, position = 'start' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedSingle, setSelectedSingle] = useState<Date | undefined>(value as Date);
  const [selectedMultiple, setSelectedMultiple] = useState<Date[] | undefined>(value as Date[]);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value as DateRange);

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy');
  };

  const getFormattedDate = () => {
    if (mode === 'single') {
      return selectedSingle ? format(selectedSingle, 'dd MMMM yyyy') : 'Choose Date';
    }

    if (mode === 'multiple') {
      if (!selectedMultiple || selectedMultiple.length === 0) return 'Choose Date';
      return selectedMultiple.map((date) => format(date, 'dd MMM')).join(', ');
    }

    if (mode === 'range') {
      if (!selectedRange?.from) return 'Choose Date';
      if (selectedRange.to) return `${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`;
      return `${formatDate(selectedRange.from)} - ...`;
    }

    return 'Choose Date';
  };

  const getPositionClass = () => {
    if (position == 'start') return "";
    else if (position == 'end') return "right-0";
  }

  const handleSelectSingle: SelectSingleEventHandler = (date) => {
    setSelectedSingle(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handleSelectMultiple: SelectMultipleEventHandler = (dates) => {
    setSelectedMultiple(dates);
    onChange?.(dates);
  };

  const handleSelectRange: SelectRangeEventHandler = (range: any) => {
    setSelectedRange(range);
    onChange?.(range);
  };

  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {label && (
        <label className="block text-sm font-medium mb-1 dark:text-white">
          {label}{(required !== undefined && required === true) && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full truncate justify-between hs-dropdown-toggle inline-flex items-center gap-2 py-1.5 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-800 focus:ring-gray-800 focus:outline-none"
      >
        <span className='truncate overflow-hidden whitespace-nowrap'>
          {getFormattedDate()}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              selected={selectedSingle}
              onSelect={handleSelectSingle}
              className="p-1"
            />
          )}
          {mode === 'multiple' && (
            <DayPicker
              mode="multiple"
              captionLayout="dropdown"
              selected={selectedMultiple}
              onSelect={handleSelectMultiple}
              className="p-1"
            />
          )}
          {mode === 'range' && (
            <DayPicker
              mode="range"
              captionLayout="dropdown"
              selected={selectedRange}
              onSelect={handleSelectRange}
              className="p-1"
            />
          )}
        </div>
      )}
    </div>
  );
}
