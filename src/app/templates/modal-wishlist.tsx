"use client";

import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { EventGifts } from "@/generated/prisma";
import { DtoReservation } from "@/lib/dto";
import { ExecuteMinimumDelay, showConfirm, toast } from "@/lib/utils";
import { ReservastionWishlist } from "@/server/event";
import { GetDataEventGiftsById } from "@/server/event-detail";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ModalWishlistProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  wishlist_id: number;
  barcode: string;
  fatchWishlist: (event_id: number, page?: number, countPage?: number) => Promise<void>;
};

export const ModalWishlist = ({
  open,
  setOpen,
  wishlist_id = 0,
  barcode,
  fatchWishlist,
}: ModalWishlistProps) => {
  const [maxQty, setMaxQty] = useState<number>(1);
  const [reqQty, setReqQty] = useState<number>(1);
  const [data, setData] = useState<EventGifts | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>("");
  const [emailWa, setEmailWa] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const closeModal = () => {
    setMaxQty(1);
    setReqQty(1);
    setData(null);
    setOpen(false);
  };

  useEffect(() => {
    if (!open || data) return;

    setName("");
    setEmailWa("");
    setMessage("");
    const fetchDatas = async () => {
      setLoading(true);

      try {
        const getData = await ExecuteMinimumDelay(
          GetDataEventGiftsById(wishlist_id),
          1100
        );
        if (!getData) return;

        setData(getData);
        setMaxQty(getData.qty - getData.reserve_qty);
      } catch (error) {
        console.error("Failed fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatas();
  }, [open]);

  const incsDecsQty = (isInc: boolean) => {
    setReqQty((prev) => {
      if (isInc) {
        return prev < maxQty ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : prev;
      }
    });
  };

  const createDtoData = (): DtoReservation => {
    const data = {
      gift_id: wishlist_id,
      barcode,
      qty: reqQty,
      name: name.trim() !== "" ? name.trim() : null,
      email_wa: emailWa.trim() !== "" ? emailWa.trim() : null,
      message: message.trim() !== "" ? message.trim() : null
    };

    return data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (maxQty === 0) {
      toast({
        type: "warning",
        title: "Reservasi Gagal",
        message: "Maaf, jumlah reservasi sudah penuh!"
      });
      return;
    }

    const confirmed = await showConfirm({
      title: 'Konfirmasi Reservasi?',
      message: 'Apakah kamu sudah yakin submit reservasimu?',
      confirmText: 'Iya, Lanjut',
      cancelText: 'Batal',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      await ExecuteMinimumDelay(
        ReservastionWishlist(createDtoData()),
        1100
      );
      await fatchWishlist(data?.event_id ?? 0);
      toast({
        type: "success",
        title: "Submit successfully",
        message: "Your submission has been successfully completed"
      });
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Request Failed",
        message: error.message
      });
      setLoading(false);
    }
    closeModal();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4"
      onClick={() => closeModal()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-4">
          <button onClick={() => closeModal()} className="absolute top-3 right-3 text-gray-500 hover:text-black">
            <i className="bx bx-x text-2xl"></i>
          </button>

          <h2 className="text-base font-semibold mb-2">
            Reservasi Wishlist Gift
          </h2>
        </div>

        <hr className="text-gray-300" />

        {
          loading ? <div className="my-6 text-center">
            <i className="bx bx-gift bx-tada text-4xl"></i>
            <p className="text-sm font-semibold">Loading...</p>
          </div> : <div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* <div className="col-span-12 mb-1">
                  <div className="bg-teal-100/60 border-s-4 border-teal-600 rounded-lg p-3 dark:bg-teal-800/30" role="alert" aria-labelledby="hs-bordered-success-style-label">
                    <div className="flex items-center">
                      <div className="shrink-0 leading-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-600 dark:border-teal-900 dark:bg-teal-600 dark:text-teal-400">
                          <i className='bx bx-badge-check text-4xl'></i>
                        </span>
                      </div>
                      <div className="ms-2">
                        <div className="text-foreground font-semibold text-sm">
                          Terimakasih atas reservasi anda.
                        </div>
                        <p className="text-sm text-foreground">
                          Hadiah terbaik dari anda sangat bermanfaat bagi kami.
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="col-span-12 md:col-span-6">
                  <p className="text-muted text-sm">Nama Item:</p>
                  <p className="font-semibold text-sm">
                    {
                      data ? data.name : "Set Peralatan Makan Keramik"
                    }
                  </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-muted text-sm">Jumlah Reservasi:</p>
                  <p className="font-semibold text-sm">
                    {
                      data ? maxQty : "1"
                    } Unit / Item
                  </p>
                </div>

                <div className="col-span-12">
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm mb-1">Tentukan jumlah yang akan Anda kirim:</p>

                    <div className="flex items-center gap-3">
                      <button className="w-7 h-7 border border-blue-500 rounded text-blue-500 font-semibold bg-blue-200/40 hover:scale-105" type="button" onClick={() => incsDecsQty(false)}>-</button>
                      <span className="font-semibold text-base">{reqQty}</span>
                      <button className="w-7 h-7 border border-blue-500 rounded text-blue-500 font-semibold bg-blue-200/40 hover:scale-105" type="button" onClick={() => incsDecsQty(true)}>+</button>

                      <span className="text-sm text-muted">
                        dari <span className="font-semibold">{data ? maxQty : 1}</span> Unit / Item tersedia
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-blue-300 border-dashed" />

            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-2">
                <div className="text-sm font-semibold">
                  Identitas Pemberi Hadiah:
                </div>
                <p className="text-xs text-muted">Note: Kosongkan jika ingin menyembunyikan identitas anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                <div className="col-span-12 md:col-span-6">
                  <Input value={name} onChange={(e) => setName(e.target.value)} type='text' id='faq_question' label='Nama' placeholder='Masukkan nama anda' />
                  {/* {stateFormFaq.errors?.faq_question && <ZodErrors err={stateFormFaq.errors?.faq_question} />} */}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Input value={emailWa} onChange={(e) => setEmailWa(e.target.value)} type='text' id='faq_question' label='Email / WhatsApp' placeholder='Email atau no whatsapp' />
                </div>
                <div className="col-span-12">
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} id='faq_question' label='Ucapan & Doa' placeholder='Masukkan ucapan atau Doa jika ada' />
                </div>
              </div>

              <div className="flex justify-start sm:justify-end gap-x-2 sm:order-2 order-2">
                <button onClick={() => closeModal()} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                  Close
                </button>
                <button type="submit" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  );
};