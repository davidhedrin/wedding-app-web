"use client";

import { TableShortList, TableThModel } from '@/lib/model-types';
import { Dispatch, SetStateAction, useState } from 'react';
import { DateRange } from "react-day-picker";
import Input from './ui/input';
import DatePickerPopover from './popover-datepicker';

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
  // const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
  //   from: startOfMonth(new Date()),
  //   to: endOfMonth(new Date()),
  // });
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);

  return (
    <div>
      {
        tblName != null || tblDesc != null ? (
          <>
            <div className="font-medium">{tblName}</div>
            <p className="text-muted text-sm">{tblDesc}</p>
            <hr className="mb-2.5 mt-0.5 text-gray-300" />
          </>
        ) : <></>
      }
      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input type="search" className="lg:w-72" placeholder="Type to search..." prefixIcon={<i className='bx bx-search-alt-2 text-muted'></i>} />

          <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-400 text-gray-500 hover:border-gray-800 hover:text-gray-800 focus:outline-hidden focus:border-gray-800 focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-plus-circle text-lg'></i> New
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <div className="w-full">
            <DatePickerPopover mode='range' onChange={(date) => setSelectedDate(date)} />
          </div>
        </div>
      </div>
    </div>
  )
}
