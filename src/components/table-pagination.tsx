import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Input from "./ui/input";

type TablePaginationProps = {
  perPage?: number;
  pageTable: number;
  totalPage: number;
  totalCount: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  setPageTable: Dispatch<SetStateAction<number>>;
  fatchData?: (page?: number, countPage?: number) => Promise<void>;

  inputPage: string;
  setInputPage: Dispatch<SetStateAction<string>>;
}

export default function TablePagination({
  perPage,
  pageTable,
  totalPage,
  totalCount,
  setPerPage,
  setPageTable,
  fatchData,

  inputPage,
  setInputPage,
}: TablePaginationProps) {
  const changePaginate = async (page: number, countPage?: number) => {
    if (fatchData) {
      setPageTable(page);
      await fatchData(page, countPage);
    }
  };

  const defaultPageSizes = [5, 10, 15, 20, 25];
  const [extraPageSize, setExtraPageSize] = useState<number | null>(null);
  useEffect(() => {
    if (perPage !== undefined && !defaultPageSizes.includes(perPage)) {
      setExtraPageSize(perPage);
    }
  }, [perPage]);

  const pageSizes = useMemo(() => {
    const sizes = [...defaultPageSizes];

    if (extraPageSize && !sizes.includes(extraPageSize)) {
      sizes.push(extraPageSize);
    }

    return sizes.sort((a, b) => a - b);
  }, [extraPageSize]);

  return (
    <div className="flex items-center justify-between">
      {
        perPage !== undefined && <div className="flex-1 text-sm flex">
          <div className="items-center gap-2 flex">
            <span className="text-sm text-muted hidden md:block">
              Show
            </span>
            <div>
              <select value={perPage.toString()} onChange={(e) => {
                const val = e.target.value;
                setPerPage(parseInt(val));
                changePaginate(1, parseInt(val));
              }} className="py-1.5 px-1 block w-full border border-gray-300 rounded-lg text-sm hover:border-gray-800 focus:ring-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                {pageSizes.map((pageSize) => (
                  <option key={pageSize} value={`${pageSize}`}>{pageSize}</option>
                ))}
              </select>
            </div>
            <span className="hidden text-sm md:block text-muted">
              rows of {totalCount} entries
            </span>
          </div>
        </div>
      }
      <div className="flex items-center gap-4 w-fit">
        <div className="flex items-center text-sm gap-2">
          <div className="text-muted">Page</div>
          <Input value={inputPage}
            onChange={(e) => {
              setInputPage(e.target.value);
              if (e.target.value.trim() != "" && !isNaN(parseInt(e.target.value))) {
                let numPage = parseInt(e.target.value);
                if (numPage > totalPage) numPage = totalPage;
                else if (numPage < 1) numPage = 1;
                changePaginate(numPage);
              }
            }}
            onBlur={(e) => {
              if (e.target.value.trim() === "" || isNaN(parseInt(e.target.value))) {
                setInputPage(pageTable.toString());
              }
            }}
            className="w-10 text-center py-1.5 px-1.5 input-no-spinner bg-white" type="number" min={1} max={totalPage}
          />
          <div className="text-muted"><span className="pe-1">of</span> {totalPage}</div>
        </div>

        <div className="flex items-center gap-2 ml-0">
          <button
            disabled={pageTable <= 1}
            onClick={() => {
              if (pageTable >= 1) changePaginate(1);
            }}
            type="button" className="hidden lg:inline-flex p-1.5 w-9 justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-chevrons-left text-lg'></i>

            <span className="sr-only">Go to first page</span>
          </button>
          <button
            disabled={pageTable <= 1}
            onClick={() => {
              if (pageTable >= 1) changePaginate(pageTable - 1)
            }}
            type="button" className="inline-flex p-1.5 w-9 justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-chevron-left text-lg'></i>

            <span className="sr-only">Go to previous page</span>
          </button>
          <button
            disabled={pageTable >= totalPage}
            onClick={() => {
              if (pageTable <= totalPage) changePaginate(pageTable + 1)
            }}
            type="button" className="inline-flex p-1.5 w-9 justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-chevron-right text-lg'></i>

            <span className="sr-only">Go to next page</span>
          </button>
          <button
            disabled={pageTable >= totalPage}
            onClick={() => {
              if (pageTable <= totalPage) changePaginate(totalPage)
            }}
            type="button" className="hidden lg:inline-flex p-1.5 w-9 justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
            <i className='bx bx-chevrons-right text-lg'></i>

            <span className="sr-only">Go to last page</span>
          </button>
        </div>
      </div>
    </div>
  )
}
