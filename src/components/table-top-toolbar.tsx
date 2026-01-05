"use client";

import { TableShortList, TableThModel } from '@/lib/model-types';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DateRange } from "react-day-picker";
import Input from './ui/input';
import DatePicker from './ui/date-picker';
import { removeListStateByIndex } from '@/lib/utils';

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
  dateRange?: Date | Date[] | DateRange | undefined;
  setDateRange?: (date: DateRange | undefined) => void;
  datePlaceholder?: string;
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
  datePlaceholder,
}: TableTopToolbarProps) {
  const [openSort, setOpenSort] = useState(false);
  const popoverRefSort = useRef<HTMLDivElement>(null);
  const [openView, setOpenView] = useState(false);
  const popoverRefView = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRefSort.current &&
        !popoverRefSort.current.contains(event.target as Node)
      ) setOpenSort(false);

      if (
        popoverRefView.current &&
        !popoverRefView.current.contains(event.target as Node)
      ) setOpenView(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // *** Example Date Range ***
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: startOfMonth(new Date()),
  //   to: endOfMonth(new Date()),
  // });

  return (
    <div>
      {tblName != null && <div className="font-medium text-sm">{tblName}</div>}
      {tblDesc != null && <p className="text-muted text-sm">{tblDesc}</p>}
      {(tblName != null || tblDesc != null) && <hr className="mb-3 mt-1 text-gray-300" />}

      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex items-center gap-2">
          {
            setInputSearch && <div className='w-full'>
              <Input type="search" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} className="lg:w-72 py-1.5" placeholder="Type to search..." prefixIcon={<i className='bx bx-search-alt-2 text-muted'></i>} />
            </div>
          }
          {
            //py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none
            openModal && <button onClick={() => openModal()} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-1 btn-color-app font-medium text-sm text-nowrap text-white rounded-lg focus:outline-hidden hover:scale-103 active:scale-100">
              <i className='bx bx-plus-circle text-lg'></i> New
            </button>
          }
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          {
            setDateRange && <div>
              <DatePicker mode='range' value={dateRange} onChange={(date) => setDateRange(date as DateRange)} placeholder={datePlaceholder} />
            </div>
          }

          <div className="flex items-center gap-2 justify-end">
            {
              setTblSortList && <div className="relative inline-block text-left" ref={popoverRefSort}>
                <button
                  type="button"
                  onClick={() => setOpenSort(prev => !prev)}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm hover:border-gray-800 focus:ring-gray-800"
                  aria-expanded={openSort}
                  aria-haspopup="true"
                >
                  <i className="bx bx-sort text-md" />
                  <span className="ml-auto hidden lg:flex">Sort</span>
                  <i className={`bx bx-chevron-down text-xl transition-transform duration-200 ${openSort ? 'rotate-180' : ''}`} />
                </button>

                {openSort && (
                  <div className="absolute right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0 mt-2 w-auto rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-50 p-4 space-y-3">
                    <div className='mb-2'>
                      <div className="text-sm font-semibold text-gray-900">Sort by</div>
                      <p className="text-sm text-gray-500">Select column for modify sorting your rows.</p>
                    </div>

                    {
                      tblSortList && tblSortList.length > 0 && <div className="grid gap-1.5">
                        {
                          tblSortList.map((x, i) => (
                            thColomn && thColomn?.length > 0 && <div key={i} className="flex gap-1.5 overflow-y-auto">
                              <div>
                                <select value={x.key} onChange={(e) => updateSortField(i, "key", e.target.value)} className="py-1.5 px-1 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                  <option>Select colomn</option>
                                  {
                                    thColomn?.filter(x => x.IsVisible && x.key_sort.trim() != "").map(y => {
                                      return <option key={i + y.key} value={y.key_sort}>{y.name}</option>
                                    })
                                  }
                                </select>
                              </div>
                              <div>
                                <select value={x.sort} onChange={(e) => updateSortField(i, "sort", e.target.value)} className="py-1.5 px-1 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                  <option>Type</option>
                                  <option value="asc">Asc</option>
                                  <option value="desc">Desc</option>
                                </select>
                              </div>
                              <button onClick={() => {
                                setTblSortList(prev => removeListStateByIndex(prev ?? [], i))
                              }} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                                <i className='bx bx-trash text-lg'></i>
                              </button>
                            </div>
                          ))
                        }
                      </div>
                    }

                    <div className="flex items-center gap-16">
                      <div className="flex items-center gap-2">
                        <button onClick={addSort} className="bg-black text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-800">Add</button>
                        <button onClick={() => setTblSortList([])} className="border border-gray-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-100">Reset</button>
                      </div>
                      <div>
                        <button onClick={() => fatchData && fatchData()} className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 ml-auto">Apply</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }

            {
              setTblThColomns && <div className="relative inline-block text-left" ref={popoverRefView}>
                <button
                  type="button"
                  onClick={() => setOpenView(prev => !prev)}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm hover:border-gray-800 focus:ring-gray-800"
                  aria-expanded={openView}
                  aria-haspopup="true"
                >
                  <i className="bx bx-filter-alt text-lg text-muted" />
                  <span className="ml-auto hidden lg:flex">View</span>
                  <i className={`ml-auto hidden lg:flex bx bx-chevron-down text-xl transition-transform duration-200 ${openView ? 'rotate-180' : ''}`} />
                </button>

                {openView && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-50">
                    <div className="py-1">
                      {
                        thColomn?.map(x => (
                          <button
                            key={x.key}
                            onClick={() => {
                              setTblThColomns((prev) =>
                                prev.map((col) => col.key === x.key ? { ...col, IsVisible: !col.IsVisible } : col)
                              )
                            }}
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <span className="truncate">{x.name}</span>
                            {
                              x.IsVisible && <i className="bx bx-check text-muted text-lg" />
                            }
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
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
            }
          </div>
        </div>
      </div>
    </div>
  )
};