import { useEffect, useRef, useState } from 'react';
import { DayPicker, SelectSingleEventHandler, SelectMultipleEventHandler, SelectRangeEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

type DatePickerProps = {
  mode?: 'single' | 'multiple' | 'range';
  onChange?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void;
};

export default function DatePicker({ mode = 'single', onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedSingle, setSelectedSingle] = useState<Date | undefined>();
  const [selectedMultiple, setSelectedMultiple] = useState<Date[] | undefined>();
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to?: Date } | undefined>();

  const getFormattedDate = () => {
    if (mode === 'single') {
      return selectedSingle ? format(selectedSingle, 'PPP') : 'Choose Date';
    }

    if (mode === 'multiple') {
      if (!selectedMultiple || selectedMultiple.length === 0) return 'Choose Date';
      return selectedMultiple.map((date) => format(date, 'MMM d')).join(', ');
    }

    if (mode === 'range') {
      if (!selectedRange?.from) return 'Choose Date';
      if (selectedRange.to) return `${format(selectedRange.from, 'PPP')} - ${format(selectedRange.to, 'PPP')}`;
      return `${format(selectedRange.from, 'PPP')} - ...`;
    }

    return 'Choose Date';
  };

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
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hs-dropdown-toggle inline-flex items-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        {getFormattedDate()}
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {mode === 'single' && (
            <DayPicker
              mode="single"
              selected={selectedSingle}
              onSelect={handleSelectSingle}
              className="p-1"
            />
          )}
          {mode === 'multiple' && (
            <DayPicker
              mode="multiple"
              selected={selectedMultiple}
              onSelect={handleSelectMultiple}
              className="p-1"
            />
          )}
          {mode === 'range' && (
            <DayPicker
              mode="range"
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
