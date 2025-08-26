"use client";

import { TableShortList, TableThModel } from '@/lib/model-types';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DateRange } from "react-day-picker";
import Input from './ui/input';
import DatePicker from './ui/date-picker';

type TableTopToolbarProps = {
  tblName?: string;
  tblDesc?: string;
  thColomn?: TableThModel[];
  tblSortList?: TableShortList[];
  inputSearch?: string;
  setTblThColomns?: React.Dispatch<React.SetStateAction<TableThModel[]>>;
  setTblSortList?: Dispatch<SetStateAction<TableShortList[]>>
  setInputSearch?: Dispatch<SetStateAction<string>>;
  fatchData?: (page?: number) => Promise<void>;

  openModal?: (id?: number) => Promise<void>;
  dateRange?: DateRange | undefined;
  setDateRange?: (date: DateRange | undefined) => void;
};

export default function TableTopToolbar({
  tblName,
  tblDesc,
  thColomn,
  tblSortList,
  inputSearch,
  setTblThColomns,
  setTblSortList,
  setInputSearch,
  fatchData,

  openModal,
  dateRange,
  setDateRange,
}: TableTopToolbarProps) {
  const addSort = () => {
    const newRow: TableShortList = { key: "", sort: "" };
    setTblSortList && setTblSortList(prev => [...prev, newRow]);
  };

  const updateSortField = (idx: number, field: keyof TableShortList, value: string) => {
    setTblSortList && setTblSortList(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    )
  };

  // *** Example Date Range ***
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: startOfMonth(new Date()),
  //   to: endOfMonth(new Date()),
  // });

  return (
    <div>
      { tblName != null && <div className="font-medium text-sm">{tblName}</div> }
      { tblDesc != null && <p className="text-muted text-sm">{tblDesc}</p> }
      { (tblName != null || tblDesc != null) && <hr className="mb-3 mt-1 text-gray-300" /> }
      
      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className='w-full'>
            <Input type="search" className="lg:w-72 py-1.5" placeholder="Type to search..." prefixIcon={<i className='bx bx-search-alt-2 text-muted'></i>} />
          </div>

          <button type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-plus-circle text-lg'></i> New
          </button>
          {/* {
            setInputSearch && <div className='w-full'>
              <Input type="search" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} className="lg:w-72 py-1.5" placeholder="Type to search..." prefixIcon={<i className='bx bx-search-alt-2 text-muted'></i>} />
            </div>
          }

          {
            openModal && <button type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-500 hover:border-gray-800 hover:text-gray-800 focus:outline-hidden focus:border-gray-800 focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none">
              <i className='bx bx-plus-circle text-lg'></i> New
            </button>
          } */}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <div className="w-full">
            <DatePicker mode='range' />
          </div>
          <SortPopover />
          <ViewPopover />
          <div className="col-start-2 text-center">
            <div className="hs-tooltip [--placement:top] inline-block">
              <button type="button" className="hs-tooltip-toggle py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                <i className='bx bx-refresh text-lg'></i>

                <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs" role="tooltip">
                  Refresh to fatch data
                </span>
              </button>
            </div>
          </div>

          {/* {
            setDateRange && <div className="w-full">
              <DatePicker mode='range' onChange={(date) => setDateRange(date as DateRange)} />
            </div>
          }

          {
            setTblSortList && <SortPopover />
          }

          {
            setTblThColomns && <ViewPopover />
          }

          {
            fatchData && <div className="col-start-2 text-center">
              <div className="hs-tooltip [--placement:top] inline-block">
                <button onClick={() => fatchData()} type="button" className="hs-tooltip-toggle py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                  <i className='bx bx-refresh text-lg'></i>

                  <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs" role="tooltip">
                    Refresh to fatch data
                  </span>
                </button>
              </div>
            </div>
          } */}
        </div>
      </div>
    </div>
  )
};

function SortPopover() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm shadow-sm hover:border-gray-800 focus:ring-gray-800"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <i className="bx bx-sort text-md" />
        <span className="ml-auto hidden lg:flex">Sort</span>
        <i className={`bx bx-chevron-down text-xl transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0 mt-2 w-auto rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-50 p-4 space-y-4">
          <div className='mb-2'>
            <div className="text-sm font-semibold text-gray-900">Sort by</div>
            <p className="text-sm text-gray-500">Select column for modify sorting your rows.</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <button className="bg-black text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-800">Add</button>
              <button className="border border-gray-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-100">Reset</button>
            </div>
            <div>
              <button className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 ml-auto">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ViewPopover() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { id: 'code', label: 'Code' },
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Created At' },
  ];

  const [selected, setSelected] = useState<string[]>(['code', 'name', 'description']);

  const toggleOption = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm shadow-sm hover:border-gray-800 focus:ring-gray-800"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <i className="bx bx-filter-alt text-lg text-muted" />
        <span className="ml-auto hidden lg:flex">View</span>
        <i className={`ml-auto hidden lg:flex bx bx-chevron-down text-xl transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-50">
          <div className="py-1">
            {options.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleOption(id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>{label}</span>
                {selected.includes(id) && (
                  <i className="bx bx-check text-muted text-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};