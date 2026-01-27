"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import { BreadcrumbType, Color } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { CartCheckoutProps, eventStatusLabels, formatDate, showConfirm, toast } from "@/lib/utils";
import { CancelOrderEvent, GetDataEventByCode, StoreSnapMidtrans } from "@/server/event";
import { Events, Templates, Tr, Vouchers } from "@/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/badge";
import Alert from "@/components/ui/alert";
import Input from "@/components/ui/input";
import { CheckVoucherCode } from "@/server/systems/voucher";
import Configs from "@/lib/config";
import TabListWraper from "../components/wraper-list";
import TabContentWraper from "../components/wraper-content";

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
    template: Templates & { captures: { file_path: string }[] | null } | null,
    tr: Tr | null
  } | null>(null);
  const [priceInit, setPriceInit] = useState(0);
  const [templateColor, setTemplateColor] = useState<Color[]>([]);

  const [initPriceAddOn, setInitPriceAddOn] = useState(Configs.priceAddOn1);
  const [isCheckedAddOn1, setIsCheckedAddOn1] = useState(false);
  const [grandTotalOrder, setGrandTotalOrder] = useState(0);

  const [isApplyVoucher, setIsApplyVoucher] = useState(false);
  const [voucherInputVal, setVoucherInputVal] = useState("");
  const [voucherData, setVoucherData] = useState<Vouchers | null>(null);
  const [voucherActiveCode, setVoucherActiveCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const fatchOrderEvent = async () => {
    if (tmpCode && tmpCode.trim() !== '') {
      const data = await GetDataEventByCode(tmpCode);
      if (data) {
        setDataEvent(data);
        let setGrandTotal = 0;

        if (data.template) {
          setTemplateColor(data.template.colors ? JSON.parse(data.template.colors) : []);

          const dataPriceInit = data.template.disc_price ? data.template.price - data.template.disc_price : data.template.price;
          setPriceInit(dataPriceInit);
          setGrandTotal = dataPriceInit;
        }

        if (data.tr) {
          setIsCheckedAddOn1(data.tr.add_ons1 !== null ? data.tr.add_ons1 : false);
          setInitPriceAddOn(data.tr.add_ons1_amount ?? Configs.priceAddOn1);

          setVoucherInputVal(data.tr.voucher_code ?? "");
          setDiscountAmount(data.tr.voucher_amount ?? 0);
          setVoucherActiveCode(data.tr.voucher_code ?? "");
          setGrandTotal = data.tr.total_amount;
        }

        setGrandTotalOrder(setGrandTotal);
      }
    }
  };

  const resetAllState = () => {
    setPriceInit(0);
    setTemplateColor([]);

    setInitPriceAddOn(Configs.priceAddOn1);
    setIsCheckedAddOn1(false);

    setVoucherInputVal("");
    setDiscountAmount(0);
    setVoucherActiveCode("");

    setGrandTotalOrder(0);
    setVoucherInputVal("");
    setVoucherData(null);
    setVoucherActiveCode("");
    setDiscountAmount(0);
  };

  useEffect(() => {
    resetAllState();
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

  useEffect(() => {
    if (dataEvent?.tr !== null) return;
    const allPropsCheckout = CartCheckoutProps({ subTotal: priceInit, addOns: isCheckedAddOn1, voucher: voucherData });

    setDiscountAmount(allPropsCheckout.dicAmountResult);
    setGrandTotalOrder(allPropsCheckout.totalAmount);
  }, [voucherData, isCheckedAddOn1]);

  const applyVoucherCode = async () => {
    if (voucherInputVal.trim() === "") return;

    setIsApplyVoucher(true);
    setTimeout(async () => {
      try {
        const dataVoucher = await CheckVoucherCode(voucherInputVal);
        if (dataVoucher !== null) {
          setVoucherData(dataVoucher);
          setVoucherActiveCode(dataVoucher.code);
          toast({
            type: "success",
            title: "Voucher Applied!",
            message: "Your discount has been successfully applied"
          });
        } else {
          setDiscountAmount(0);
          setVoucherData(null);
          setVoucherActiveCode("");
          toast({
            type: "warning",
            title: "Voucher Failed!",
            message: "Oops! That promotion voucher code doesn't exist."
          });
        }
      } catch (error: any) {
        setDiscountAmount(0);
        setVoucherData(null);
        setVoucherActiveCode("");
        toast({
          type: "warning",
          title: "Voucher Failed!",
          message: error.message || "We can't proccess your request, Please try again."
        });
      };
    }, 100);
    setIsApplyVoucher(false);
  };

  const orderProses = async (eventId: number) => {
    if (dataEvent?.tr === null) {
      const confirmed = await showConfirm({
        title: 'Order Confirmation!',
        message: 'Are your sure want to process your order? Please double-check before proceeding!',
        confirmText: 'Order Now',
        cancelText: 'No, Go Back',
        icon: 'bx bx-cart bx-tada text-red-500'
      });
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      const snapRes = await StoreSnapMidtrans({
        event_id: eventId,
        voucher_id: voucherData ? voucherData.id : null,
        add_ons1: isCheckedAddOn1,
        add_ons1_amount: isCheckedAddOn1 ? initPriceAddOn : null
      });
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
        await fatchOrderEvent();
        toast({
          type: "success",
          title: "Payment Successful!",
          message: "Thank you! Your payment has been received. And confirmation email has been sent!"
        });
        setLoading(false);
        return;
      },
      onPending: async function (result: any) {
        await fatchOrderEvent();
        setLoading(false);
        return;
      },
      onError: async function (result: any) {
        await fatchOrderEvent();
        setLoading(false);
        toast({
          type: "warning",
          title: "Payment Error!",
          message: "Looks like there was a problem with your payment!"
        });
        return;
      },
      onClose: async function () {
        await fatchOrderEvent();
        setLoading(false);
        return;
      }
    });
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

  const [activeTab, setActiveTab] = useState("main-info");

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
                <div className="grid grid-cols-12 gap-6">
                  {/* Carousel */}
                  <div className="col-span-12 md:col-span-5">
                    <div className="relative w-full md:h-[355] h-70 overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={dataEvent.template.captures ? dataEvent.template.captures[0].file_path : ""}
                        alt="Capture"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100`}
                      />
                    </div>
                  </div>

                  {/* Detail Info */}
                  <div className="col-span-12 md:col-span-4 flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted flex items-center gap-2">
                        <span>
                          Status: <Badge label={eventStatusLabels[dataEvent.tmp_status].name} status={eventStatusLabels[dataEvent.tmp_status].color} />
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
                            <td className="px-4 py-1.5 font-medium text-gray-700 w-1/3">
                              Category
                            </td>
                            <td>: </td>
                            <td className="px-4 py-1.5">{dataEvent.template.ctg_name}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-1.5 font-medium text-gray-700 w-1/3">
                              Colors
                            </td>
                            <td>: </td>
                            <td className="flex items-center px-4 py-1.5 gap-2">
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
                            <td className="px-4 py-1.5 font-medium text-gray-700 w-1/3">
                              Language
                            </td>
                            <td>: </td>
                            <td className="px-4 py-1.5">{dataEvent.template.language}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-1.5 font-medium text-gray-700 w-1/3">
                              Layouts
                            </td>
                            <td>: </td>
                            <td className="px-4 py-1.5">{dataEvent.template.layouts}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <Alert status={eventStatusLabels[dataEvent.tmp_status].color}>
                      <p className="text-sm text-gray-700">
                        {
                          dataEvent.tmp_status === "ACTIVE" ? <span>
                            Your order are currently <span className="font-semibold">{eventStatusLabels[dataEvent.tmp_status].name}</span> righ now! Let's start creating your special moment ✨.
                          </span> : dataEvent.tmp_status === "ENDED" ? <span>
                            Your order are currently <span className="font-semibold">{eventStatusLabels[dataEvent.tmp_status].name}</span> righ now! Thank's for your trust in using our Wedlyvite for your precious moments.
                          </span> : <span>
                            Your order are currently <span className="font-semibold">{eventStatusLabels[dataEvent.tmp_status].name}</span> righ now! Continue process the order to activate the template.
                          </span>
                        }
                      </p>
                    </Alert>
                  </div>

                  {/* Checkout */}
                  <div className="col-span-12 md:col-span-3 border border-gray-200 rounded-xl p-3 h-fit">
                    <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
                      <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-1.5 px-3">
                        <div className="text-sm font-bold text-gray-800">
                          Order Summary
                        </div>
                      </div>
                      <div className="px-3 py-2">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>Rp {priceInit.toLocaleString("id-ID")}</span>
                          </div>
                          {
                            isCheckedAddOn1 && <div className="flex justify-between">
                              <span>WA-Invitation:</span>
                              <span>Rp {initPriceAddOn.toLocaleString("id-ID")}</span>
                            </div>
                          }
                          {
                            discountAmount > 0 && <div className="flex justify-between text-green-600">
                              <span>Voucher: ({voucherActiveCode})</span>
                              <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                            </div>
                          }
                          <div className="flex justify-between">
                            <span>Grand Total:</span>
                            <span>Rp {grandTotalOrder.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <label className="block text-sm font-medium mb-1 dark:text-white">
                        Add-On
                      </label>
                      <div className="flex items-center gap-x-3">
                        <label htmlFor="hs-xs-switch-add-ons" className="relative inline-block w-9 h-5 cursor-pointer">
                          <input
                            disabled={dataEvent.tr === null ? false : true}
                            checked={isCheckedAddOn1}
                            onChange={(e) => setIsCheckedAddOn1(e.target.checked)}
                            type="checkbox" id="hs-xs-switch-add-ons" className="peer sr-only"
                          />
                          <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                          <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                        </label>
                        <label htmlFor="hs-xs-switch-add-ons" className="text-sm text-gray-500">WA-Invitation (IDR {Configs.priceAddOn1.toLocaleString("id-ID")})</label>
                      </div>
                      <p className="text-xs text-muted mt-1.5 italic">
                        <i className='bx bx-info-circle'></i>&nbsp;Enable this feature to automatically send invitations to your WhatsApp guests.
                      </p>
                    </div>

                    <div className="mt-2">
                      <label htmlFor="inpVoucherCode" className="block text-sm font-medium mb-1 dark:text-white">
                        Voucher Code
                      </label>
                      <form action={() => applyVoucherCode()} className="flex w-full">
                        <div className="relative flex-1">
                          <Input
                            value={voucherInputVal}
                            disabled={dataEvent.tr === null ? false : true}
                            onChange={(e) => {
                              setDiscountAmount(0);
                              setVoucherData(null);
                              setVoucherActiveCode("");
                              setVoucherInputVal(e.target.value);
                            }}
                            type="search"
                            id="inpVoucherCode"
                            style={dataEvent.tr === null ? { borderStartEndRadius: "0px", borderEndEndRadius: "0px" } : {}}
                            prefixIcon={<i className='bx bxs-discount text-lg text-muted'></i>}
                            placeholder={dataEvent.tr === null ? "Enter voucher here..." : "No voucher applied"}
                          />
                        </div>

                        {
                          dataEvent.tr === null && <button disabled={isApplyVoucher} type="submit" className="px-3 inline-flex items-center rounded-e-md min-w-fit bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition sm:shrink-0">
                            {isApplyVoucher ? <i className='bx bx-loader-alt bx-spin text-lg'></i> : "Apply"}
                          </button>
                        }

                      </form>
                    </div>

                    {
                      (dataEvent.tmp_status === "NOT_PAID" || dataEvent.tmp_status === "PENDING") && <div>
                        {/* Tombol Aksi */}
                        <div className="mt-3 flex gap-4">
                          <button onClick={() => orderProses(dataEvent.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
                            Order Now
                          </button>
                          <button onClick={() => handleCancelOrder(dataEvent.id)} className='text-center w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm px-3 py-2 rounded-lg transition'>
                            Cancel
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <div className="relative min-h-75 mt-6">
                  <div className="p-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                      {/* Text Section */}
                      <div>
                        <div className="font-semibold text-lg">Event Details</div>
                        <p className="text-gray-500 text-sm">
                          Customize and manage your event detail design. Choose the section tab information to modify your event.
                        </p>
                      </div>

                      {/* Preview Button */}
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition sm:shrink-0">
                        Preview
                      </button>
                    </div>

                    <hr className="my-3 text-gray-300" />

                    <div className="w-full">
                      {
                        (dataEvent.tmp_status !== "NOT_PAID" && dataEvent.tmp_status !== "PENDING") &&
                        <div className="flex flex-col sm:flex-row ">
                          <div className="w-full sm:w-44 border-b sm:border-b-0 border-gray-200 sticky top-0 sm:top-4 sm:self-start bg-white z-10">
                            <TabListWraper event_type={dataEvent.tmp_ctg_key} />
                          </div>

                          <div className="w-full sm:border-s border-gray-200 sm:ps-4 pt-3 sm:pt-0">
                            <TabContentWraper event_type={dataEvent.tmp_ctg_key} event_id={dataEvent.id} />
                          </div>

                          {/* <div className="w-full sm:w-44 border-b sm:border-b-0 border-gray-200 sticky top-0 sm:top-4 sm:self-start bg-white z-10">
                            <nav className="flex flex-wrap justify-center sm:flex-col gap-2" aria-label="Tabs" role="tablist" aria-orientation="vertical">
                              <button type="button" id="main-info-item" aria-selected="true" data-hs-tab="#main-info-tab" aria-controls="main-info-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden active" role="tab">
                                <i className="bx bx-info-circle text-lg"></i>
                                Main Info
                              </button>

                              <button type="button" id="scheduler-tab-item" aria-selected="false" data-hs-tab="#scheduler-tab" aria-controls="scheduler-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-calendar-star text-lg"></i>
                                Schedule
                              </button>

                              <button type="button" id="gallery-tab-item" aria-selected="false" data-hs-tab="#gallery-tab" aria-controls="gallery-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-photo-album text-lg"></i>
                                Gallery
                              </button>

                              <button type="button" id="history-tab-item" aria-selected="false" data-hs-tab="#history-tab" aria-controls="history-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-book-heart text-lg"></i>
                                History
                              </button>

                              <button type="button" id="gift-tab-item" aria-selected="false" data-hs-tab="#gift-tab" aria-controls="gift-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-gift text-lg"></i>
                                Gift
                              </button>

                              <button type="button" id="rsvp-tab-item" aria-selected="false" data-hs-tab="#rsvp-tab" aria-controls="rsvp-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-envelope text-lg"></i>
                                RSVP
                              </button>

                              <button type="button" id="faq-tab-item" aria-selected="false" data-hs-tab="#faq-tab" aria-controls="faq-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
                                <i className="bx bx-help-circle text-lg"></i>
                                FAQ
                              </button>
                            </nav>
                          </div>

                          <div className="w-full sm:border-s border-gray-200 sm:ps-4 pt-3 sm:pt-0">
                            <div id="main-info-tab" role="tabpanel" aria-labelledby="main-info-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Main Info</em> tab body.</p>
                            </div>

                            <div id="scheduler-tab" className="hidden" role="tabpanel" aria-labelledby="scheduler-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Schedule</em> tab body.</p>
                            </div>

                            <div id="gallery-tab" className="hidden" role="tabpanel" aria-labelledby="gallery-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Gallery</em> tab body.</p>
                            </div>

                            <div id="history-tab" className="hidden" role="tabpanel" aria-labelledby="history-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">History</em> tab body.</p>
                            </div>

                            <div id="gift-tab" className="hidden" role="tabpanel" aria-labelledby="gift-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Gift</em> tab body.</p>
                            </div>

                            <div id="rsvp-tab" className="hidden" role="tabpanel" aria-labelledby="rsvp-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">RSVP</em> tab body.</p>
                            </div>

                            <div id="faq-tab" className="hidden" role="tabpanel" aria-labelledby="faq-tab-item">
                              <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">FAQ</em> tab body.</p>
                            </div>
                          </div> */}
                        </div>
                      }
                    </div>

                  </div>

                  {/* Overlay blur + terkunci */}
                  {
                    (dataEvent.tmp_status === "NOT_PAID" || dataEvent.tmp_status === "PENDING") && <div className="absolute inset-0 bg-white/10 backdrop-blur-xs flex flex-col items-center justify-center z-10">
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
                  }
                </div>
              </div> : <div className="animate-pulse h-full w-full bg-gray-200 rounded-xl dark:bg-neutral-700"></div>
            }
          </div>
        </div>
      </div >
    </>
  )
}