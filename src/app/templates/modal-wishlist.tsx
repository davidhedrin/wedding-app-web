"use client";

import { ExecuteMinimumDelay } from "@/lib/utils";
import { GetDataEventGiftsById } from "@/server/event-detail";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ModalWishlistProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  wishlist_id: number;
};

export const ModalWishlist = ({
  open,
  setOpen,
  wishlist_id = 0,
}: ModalWishlistProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchDatas = async () => {
      setLoading(true);

      try {
        const getData = await ExecuteMinimumDelay(
          GetDataEventGiftsById(wishlist_id),
          1500
        );
        if (!getData) return;

        setData(getData);
      } catch (error) {
        console.error("Failed fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatas();
  }, [open, wishlist_id]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl px-6 py-4 w-full max-w-lg relative text-center text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        <h2 className="text-lg font-semibold mb-2">
          Reservasi Wishlist Gift
        </h2>

        {
          loading && <div className="mt-6">
            <i className="bx bx-gift bx-tada text-4xl"></i>
            <p className="text-sm font-semibold">Loading...</p>
          </div>
        }
      </div>
    </div>
  );
};