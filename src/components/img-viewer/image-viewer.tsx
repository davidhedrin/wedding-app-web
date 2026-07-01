"use client";

import { useEffect, useRef, useState } from "react";
import { useImageViewer } from "./use-image-viewer";

export default function ImageViewer() {
  const { image, closeImgViewer } = useImageViewer();

  useEffect(() => {
    if (image) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [image]);

  if (!image || image.trim() === "") return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={closeImgViewer}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={closeImgViewer}
        className="absolute top-5 right-5 z-10000 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
      >
        {/* X ICON */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* IMAGE */}
      <div
        className="overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image}
          alt="preview"
          className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}