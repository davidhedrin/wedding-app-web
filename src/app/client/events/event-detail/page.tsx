"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import { BreadcrumbType, Color } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { GetDataEventByCode } from "@/server/event";
import { Events, Templates } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const smartLink = useSmartLink();
  const listBr: BreadcrumbType[] = [
    { name: "Modules", url: null },
    { name: "My Events", url: "/client/events" },
    { name: "Event Detail", url: null },
  ];
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const tmpCode = searchParams.get('code');

  const [dataEvent, setDataEvent] = useState<Events & {
    template: Templates & { captures: { file_path: string }[] | null } | null
  } | null>(null);
  const [templateColor, setTemplateColor] = useState<Color[]>([]);

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      if (tmpCode && tmpCode.trim() !== '') {
        const data = await GetDataEventByCode(tmpCode);
        if (data) {
          setDataEvent(data);
          setTemplateColor(data.template?.colors ? JSON.parse(data.template?.colors) : []);
        }
      }
    };

    firstInit();
  }, [tmpCode]);

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-medium text-muted">
            Event Detail
          </h1>
        </div>

        <div className="flex items-center gap-x-5">
          <BreadcrumbList listBr={listBr} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 flex flex-col border-e border-gray-200 p-4">
            {
              dataEvent && dataEvent.template ? <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                  {/* Carousel */}
                  <div className="relative w-full md:h-[420px] h-[300px] overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={dataEvent.template.captures ? dataEvent.template.captures[0].file_path : ""}
                      alt="Capture"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100`}
                    />
                  </div>

                  {/* Detail Info */}
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">
                      {dataEvent.template.ctg_name}
                    </span>
                    <h1 className="text-xl font-bold mt-1 text-gray-800">{dataEvent.template.name}</h1>


                    <div className="flex items-center mt-1 gap-4">
                      <div className="text-sm text-muted flex items-center gap-2">
                        <span>
                          Status: PENDING
                        </span>
                        <span>•</span>
                        <span>Order At: 10 Nov 2025</span>
                      </div>
                    </div>

                    {/* Harga */}
                    {
                      dataEvent.template.disc_price ? <div className="mt-2 flex items-center gap-3">
                        <span className="text-base line-through text-muted">
                          Rp {dataEvent.template.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          Rp {(dataEvent.template.price - dataEvent.template.disc_price).toLocaleString("id-ID")}
                        </span>
                      </div> : <div className="mt-2">
                        <span className="text-lg font-bold text-indigo-600">
                          Rp {dataEvent.template.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    }


                    {/* Short Description */}
                    <p className="mt-1 text-gray-600">{dataEvent.template.short_desc}</p>

                    {/* Detail & Spesifikasi */}
                    <div className="mt-2">
                      <h2 className="text-base font-semibold text-gray-800 mb-2">
                        Template Spesification
                      </h2>

                      <table className="w-full border border-gray-200 text-sm text-gray-600">
                        <tbody>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                              Category
                            </td>
                            <td>: </td>
                            <td className="px-4 py-2">{dataEvent.template.ctg_name}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                              Colors
                            </td>
                            <td>: </td>
                            <td className="flex items-center px-4 py-2 gap-2">
                              {templateColor.length > 0 ? templateColor.map((x, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-5 border"
                                  style={{ backgroundColor: x.value }}
                                ></div>
                              )) : "-"}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                              Language
                            </td>
                            <td>: </td>
                            <td className="px-4 py-2">{dataEvent.template.language}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                              Layouts
                            </td>
                            <td>: </td>
                            <td className="px-4 py-2">{dataEvent.template.layouts}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-6 flex gap-4">
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
                        Process Template
                      </button>
                      <Link href="#" className='text-center w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm px-3 py-2 rounded-lg transition' target='_blank'>
                        Live Preview
                      </Link>
                    </div>
                  </div>
                </div>
              </div> : <div className="animate-pulse h-full w-full bg-gray-200 rounded-xl dark:bg-neutral-700"></div>
            }
          </div>
        </div>
      </div>
    </>
  )
}