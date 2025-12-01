"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import { BreadcrumbType, Color } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { eventStatusLabels, formatDate, showConfirm, toast } from "@/lib/utils";
import { CancelOrderEvent, GetDataEventByCode, StoreSnapMidtrans } from "@/server/event";
import { Events, Templates } from "@/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    snap: any;
  }
};

export default function Page() {
  const router = useRouter();
  const smartLink = useSmartLink();
  const listBr: BreadcrumbType[] = [
    { name: "My Events", url: "/client/events" },
    { name: "Event Detail", url: null },
  ];
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const tmpCode = searchParams.get('code');

  const [dataEvent, setDataEvent] = useState<Events & {
    template: Templates & { captures: { file_path: string }[] | null } | null
  } | null>(null);
  const [priceInit, setPriceInit] = useState<Number>(0);
  const [templateColor, setTemplateColor] = useState<Color[]>([]);

  const fatchOrderEvent = async () => {
    if (tmpCode && tmpCode.trim() !== '') {
      const data = await GetDataEventByCode(tmpCode);
      if (data) {
        setDataEvent(data);

        if (data.template) {
          setTemplateColor(data.template.colors ? JSON.parse(data.template.colors) : []);

          const dataPriceInit = data.template.disc_price ? data.template.price - data.template.disc_price : data.template.price;
          setPriceInit(dataPriceInit);
        }
      }
    }
  };

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      if (tmpCode && tmpCode.trim() !== '') {
        fatchOrderEvent();
      } else {
        toast({
          type: "warning",
          title: "Invalid Code",
          message: "Looks like something gone wrong with your event. Please try again!"
        });
        router.push("/client/events");
      }
    };

    firstInit();
  }, [tmpCode]);

  const orderProses = async (eventId: number) => {
    try {
      setLoading(true);
      const snapRes = await StoreSnapMidtrans(eventId);
      if (snapRes !== undefined && snapRes.token) handleCheckoutPayment(snapRes.token);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong",
        message: error?.message ?? "We can't proccess your request, Please try again"
      });
    }
  };

  const handleCheckoutPayment = async (tr_token: string) => {
    await window.snap.pay(tr_token, {
      onSuccess: async function (result: any) {
        toast({
          type: "success",
          title: "Payment Successful!",
          message: "Thank you! Your payment has been received. And confirmation email has been sent!"
        });
        setLoading(false);
        return;
      },
      onPending: function (result: any) {
        setLoading(false);
        return;
      },
      onError: function (result: any) {
        setLoading(false);
        toast({
          type: "warning",
          title: "Payment Error!",
          message: "Looks like there was a problem with your payment!"
        });
        return;
      },
      onClose: function () {
        setLoading(false);
        return;
      }
    });

    await fatchOrderEvent();
  };


  const handleCancelOrder = async (eventId: number) => {
    const confirmed = await showConfirm({
      title: 'Cancel Confirmation!',
      message: 'Are your sure want to cancel your order? You will not abel to undo this action!',
      confirmText: 'Yes, Canceled',
      cancelText: 'No, Keep It',
      icon: 'bx bx-cart bx-tada text-red-500'
    });
    if (!confirmed) return;

    setLoading(true);
    try {
      await CancelOrderEvent(eventId);
      window.dispatchEvent(new CustomEvent("sidebar:refresh", {
        detail: {
          user_id: dataEvent?.user_id
        }
      }));

      toast({
        type: "success",
        title: "Cancel Finish!",
        message: "Your order has been canceled successfuly!"
      });
      router.push("/client/events");
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong!",
        message: "We can't proccess your request, Please try again."
      });
    }
  };

  return (
    <>
      <Script src={process.env.NEXT_PUBLIC_MT_SNAP_URL} data-client-key={process.env.NEXT_PUBLIC_MT_CLIENT_KEY} strategy="afterInteractive"></Script>

      <div className="py-1 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-x-2">
          <button type="button" onClick={() => router.back()} className='p-1 inline-flex items-center rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none'>
            <i className='bx bx-arrow-back text-lg'></i>
          </button>
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
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted flex items-center gap-2">
                        <span>
                          Status: {eventStatusLabels[dataEvent.tmp_status]}
                        </span>
                        <span>•</span>
                        <span>Order At: {dataEvent.createdAt ? formatDate(dataEvent.createdAt, "medium") : "-"}</span>
                      </div>
                    </div>

                    <span className="mt-2 text-sm font-semibold text-indigo-500 uppercase tracking-wide">
                      {dataEvent.template.ctg_name}
                    </span>
                    <h1 className="text-xl font-bold text-gray-800">{dataEvent.template.name}</h1>

                    {/* Harga */}
                    {
                      dataEvent.template.disc_price ? <div className="flex items-center gap-3">
                        <span className="text-base line-through text-muted">
                          Rp {dataEvent.template.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          Rp {priceInit.toLocaleString("id-ID")}
                        </span>
                      </div> : <div>
                        <span className="text-lg font-bold text-indigo-600">
                          Rp {priceInit.toLocaleString("id-ID")}
                        </span>
                      </div>
                    }

                    {/* Detail & Spesifikasi */}
                    <div className="mt-1">
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

                    <div className="bg-blue-50 border-s-4 border-blue-500 p-3 mt-3" role="alert">
                      <div className="flex items-center">
                        <div className="shrink-0">
                          {/* Icon */}
                          <span className="inline-flex justify-center items-center size-9 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800">
                            <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                              <path d="M12 9v4"></path>
                              <path d="M12 17h.01"></path>
                            </svg>
                          </span>
                          {/* End Icon */}
                        </div>
                        <div className="ms-3">
                          <p className="text-sm text-gray-700">
                            Your order template are currently <span className="font-semibold">{eventStatusLabels[dataEvent.tmp_status]}</span> righ now! Continue process the order to activate the template.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-4 flex gap-4">
                      <button onClick={() => orderProses(dataEvent.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
                        Process Order
                      </button>
                      <button onClick={() => handleCancelOrder(dataEvent.id)} className='text-center w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm px-3 py-2 rounded-lg transition'>
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden min-h-[300px] mt-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">Konten Eksklusif</h2>
                    <p className="text-gray-500">
                      Konten ini akan muncul setelah event diaktifkan.
                    </p>
                  </div>

                  {/* Overlay blur + terkunci */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <div className="flex flex-col items-center text-center">
                      <i className='bx bx-lock text-4xl mb-3'></i>
                      <p className="text-gray-700 font-medium">
                        This section is locked!
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Please complete your order to unlock full access for customize your event invitation.
                      </p>
                    </div>
                  </div>
                </div>
              </div> : <div className="animate-pulse h-full w-full bg-gray-200 rounded-xl dark:bg-neutral-700"></div>
            }
          </div>
        </div>
      </div >
    </>
  )
}