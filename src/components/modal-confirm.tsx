"use client";

import { useConfirmStore } from "@/lib/zustand";

export default function ModalConfirm() {
  const { isOpen, title, icon, message, confirmText, cancelText, choose } = useConfirmStore();

  return (
    <div
      id="hs-modal-confirmation"
      role="dialog"
      aria-labelledby="modal-confirmation"
      className={`fixed inset-0 z-81 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-xs m-4 sm:m-0 bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
        <div className="p-4 flex flex-col items-center justify-center gap-2">
          <div><i className={`${icon} text-4xl text-muted`}></i></div>
          <div className="text-center text-muted">
            <div className="font-semibold">
              {title}
            </div>
            <p className="text-sm">{message}</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-x-2 py-3 px-4 border-t border-gray-200">
          <button
            onClick={() => choose(true)}
            type="button"
            className="py-1.5 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {confirmText}
          </button>
          <button
            onClick={() => choose(false)}
            type="button"
            className="py-1.5 px-3 text-sm font-medium rounded-lg border bg-white text-gray-800 hover:bg-gray-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
