"use client";

import { playMusic, stopMusic } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

export default function FloatingActionButton({
  isMusic,
  setIsMusic,
  musicUrl,
  qrValue,
  guestName,
  eventDate
}: {
  isMusic?: boolean;
  setIsMusic?: React.Dispatch<React.SetStateAction<boolean>>;
  musicUrl?: string;
  qrValue?: string;
  guestName?: string;
  eventDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        fabRef.current &&
        !fabRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div ref={fabRef} className="fixed bottom-5 right-5 flex flex-col items-center gap-3 z-50">
        {/* Sub Buttons */}
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          {/* Button 1 */}
          {
            qrValue && (
              <button
                onClick={() => {
                  setShowQR(true);
                  setOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
              >
                <i className="bx bx-qr text-xl text-gray-700"></i>
              </button>
            )
          }

          {/* Button 2 */}
          {
            (isMusic !== undefined && setIsMusic !== undefined && musicUrl !== undefined) && <button
              onClick={() => {
                if (isMusic) {
                  stopMusic();
                  setIsMusic(false);
                }
                else {
                  playMusic(musicUrl);
                  setIsMusic(true);
                }
              }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition">
              {
                isMusic ? <i className="bx bx-volume-full text-xl text-gray-700"></i> : <i className='bx bx-volume-mute text-xl text-gray-700'></i>
              }
            </button>
          }
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setOpen(!open)}
          className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition"
        >
          <i className={`bx text-2xl transition-transform duration-300 ${open ? "bx-x rotate-90" : "bx-plus"}`}></i>
        </button>
      </div>

      {/* ================= MODAL QR ================= */}
      {
        showQR && qrValue && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4"
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl px-6 py-4 w-full max-w-xs relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>

              <h2 className="text-lg font-semibold mb-2">
                Scan QR-Code
              </h2>

              <p className="text-sm text-gray-600 underline">
                Undangan Untuk
              </p>
              <p className="text-base font-semibold">
                {guestName}
              </p>
              <p className="text-sm text-gray-500">
                {eventDate}
              </p>

              <div className="bg-white p-4 rounded-xl border flex justify-center my-3">
                <QRCode value={qrValue} size={230} bgColor="#ffffff" fgColor="#000000" level="H" />
              </div>

              <div className="mb-2">
                <p className="text-sm text-muted">
                  QR Code:
                </p>
                <p className="text-base font-bold">
                  {qrValue}
                </p>
              </div>

              <p className="text-xs text-gray-500">
                Note: Tingkatkan brightness layar agar memudahkan untuk discan
              </p>
            </div>
          </div>
        )
      }
    </>
  );
}