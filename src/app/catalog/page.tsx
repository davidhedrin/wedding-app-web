"use client";

import { useLoading } from "@/components/loading/loading-context";
import NoDataFound from "@/components/no-data-found";
import TablePagination from "@/components/table-pagination";
import TemplateCatalog from "@/components/template-catalog";
import Input from "@/components/ui/input";
import Configs, { CategoryKeys } from "@/lib/config";
import { TableShortList, TableThModel } from "@/lib/model-types";
import { normalizeSelectObj, sortListToOrderBy, toast } from "@/lib/utils";
import { GetDataTemplates } from "@/server/systems/catalog";
import { Prisma, TemplateCaptures, Templates } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

type RateType = "Price" | "Choosen" | "Rating";
const rateFields: RateType[] = ["Price", "Choosen", "Rating"];

export default function CatalogPage() {
  const { setLoading } = useLoading();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortField, setSortField] = useState<RateType | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [openSort, setOpenSort] = useState(false);
  const dropdownSortRef = useRef<HTMLDivElement>(null);

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<(Templates & {
    captures: TemplateCaptures[] | null
  })[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Price", key: "price", key_sort: "price", IsVisible: true },
    { name: "Category", key: "ctg_name", key_sort: "ctg_name", IsVisible: true },
    { name: "Layout", key: "layouts", key_sort: "layouts", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const filterWhere: Prisma.TemplatesWhereInput | undefined = {
        is_active: true,
        OR: [
          { slug: { contains: inputSearch.trim(), mode: "insensitive" } },
          { name: { contains: inputSearch.trim(), mode: "insensitive" } },
        ],
      };
      if (selectedCategories.length > 0) filterWhere.ctg_key = { in: selectedCategories };
      if (sortField && sortDirection) {
        if (sortField === "Price") orderObj.push({ price: sortDirection });
        else if (sortField === "Choosen") orderObj.push({ sold: sortDirection });
        else if (sortField === "Rating") orderObj.push({ rate_count: sortDirection });
      }

      const result = await GetDataTemplates({
        curPage: page,
        perPage: countPage,
        where: filterWhere,
        select: {
          id: true,
          disc_price: true,
          short_desc: true,
          url: true,
          slug: true,
          flag_name: true,
          flag_color: true,
          ctg_key: true,
          rate_1_count: true,
          rate_2_count: true,
          rate_3_count: true,
          rate_4_count: true,
          rate_5_count: true,
          sold: true,

          captures: {
            take: 1,
            orderBy: {
              index: 'asc'
            },
            select: {
              file_path: true
            }
          },
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPage(result.meta.totalPages);
      setTotalCount(result.meta.total);
      setPageTable(result.meta.page);
      setInputPage(result.meta.page.toString());

      setDatas(result.data);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong",
        message: "We can't proccess your request, Please try again."
      });
    }
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDatas(1);
  }, [tblThColomns]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch, selectedCategories, sortField, sortDirection]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      await fatchDatas();
      setIsFirstRender(false);
    };
    firstInit();
  }, []);
  // End Master

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSort = (field: RateType) => {
    if (sortField === field) {
      if (sortDirection == null) setSortDirection("asc");
      else if (sortDirection == "asc") setSortDirection("desc");
      else if (sortDirection == "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownSortRef.current &&
        !dropdownSortRef.current.contains(event.target as Node)
      ) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="pb-16">
      <div className='relative w-full h-[50vh] flex items-end justify-center text-center pb-14'>
        <div className="absolute -z-30 inset-0 bg-gradient-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />
        <div className="
          absolute -z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] lg:w-[650px] lg:h-[650px]
          bg-pink-400/40 blur-3xl rounded-full mix-blend-multiply
          [clip-path:polygon(50%_0%,80%_20%,100%_50%,80%_80%,50%_100%,20%_80%,0%_50%,20%_20%)]
        " />
        <div className="absolute -z-30 top-10 left-10 w-60 h-60 md:w-96 md:h-96 rounded-full bg-indigo-400/70 blur-3xl" />
        <div className="absolute -z-30 top-40 right-10 w-60 h-60 md:w-96 md:h-96 rounded-full bg-pink-400/70 blur-3xl" />

        <div className='max-w-3xl px-4 xl:px-0 mx-auto text-center'>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
            Welcome to the {Configs.app_name} Catalog
          </h1>
          <p className="md:text-base mb-8">
            Choose from our collection of wedding, birthday, party and other event invitation templates that have been specially designed for your special moment.
          </p>
        </div>
      </div>

      <div className='max-w-3xl px-4 xl:px-0 mx-auto mb-10 space-y-6'>
        {/* Categories */}
        <div>
          <div className="text-lg font-semibold text-gray-700 mb-2 text-center underline">Categories</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategories([])}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${selectedCategories.length == 0
                ? "bg-color-app text-white"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
            >
              All
            </button>
            {CategoryKeys.map((cat, i) => (
              <button
                key={i}
                onClick={() => toggleCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${selectedCategories.includes(cat.key)
                  ? "bg-color-app text-white"
                  : "bg-gray-100 text-gray-700 border-gray-400 hover:bg-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[140px]">
            <Input
              type="search"
              placeholder="Search template here..."
              onChange={(e) => setInputSearch(e.target.value)}
              className="bg-white"
              prefixIcon={<i className='bx bx-search-alt-2 text-muted'></i>}
            />
          </div>

          {/* Sort dropdown minimalis */}
          <div className="relative" ref={dropdownSortRef}>
            <button
              onClick={() => setOpenSort((prev) => !prev)}
              className="relative flex items-center justify-center border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 min-w-[120px]"
            >
              <i className="bx bx-sort mr-2"></i>
              <span className="relative">
                Sort By
                {
                  sortField !== null && <span className="absolute top-0 -right-2 block h-2 w-2 rounded-full bg-red-500"></span>
                }
              </span>
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <ul className="text-sm text-gray-700">
                  {rateFields.map((field) => (
                    <li
                      key={field}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between ${sortField === field ? "font-semibold text-indigo-600" : ""
                        }`}
                      onClick={() => handleSort(field)}
                    >
                      {field}
                      {sortField === field && (
                        <span className="inline-flex items-center">
                          {
                            sortDirection !== null && <>
                              {
                                sortDirection === "asc" && <i className="bx bx-sort-up text-lg"></i>
                              }
                              {
                                sortDirection === "desc" && <i className="bx bx-sort-down text-lg"></i>
                              }
                            </>
                          }
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
        {
          datas !== null ? <div>
            {
              datas.length > 0 ? <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-5">
                  {
                    datas.map((x, i) => (
                      <TemplateCatalog key={i} template={x} />
                    ))
                  }
                </div>

                <TablePagination
                  pageTable={pageTable}
                  totalPage={totalPage}
                  totalCount={totalCount}
                  setPerPage={setPerPage}
                  setPageTable={setPageTable}
                  fatchData={fatchDatas}

                  inputPage={inputPage}
                  setInputPage={setInputPage}
                />
              </> : <div className="w-full flex items-center justify-center">
                <div className="max-w-3xl w-full bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                  <NoDataFound />
                </div>
              </div>
            }
          </div> : <div className="animate-pulse h-screen w-full bg-gray-200 rounded-xl dark:bg-neutral-700 my-5"></div>
        }
      </div>
    </div>
  )
}