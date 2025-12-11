import { cn } from '@/lib/utils'
import React from 'react'

type InputProps = {
  label?: string;
  prefixIcon?: React.JSX.Element;
  sufixIcon?: React.JSX.Element;
  prefixGroup?: React.JSX.Element;
  sufixGroup?: React.JSX.Element;
  mandatory?: boolean | undefined;
};

export default function Input({
  label,
  prefixIcon,
  sufixIcon,
  prefixGroup,
  sufixGroup,
  mandatory,
  className,
  type,
  ...props
}: InputProps & React.ComponentProps<"input">) {
  const inpId = props.id;

  return (
    <div>
      {label !== undefined && (
        <label
          htmlFor={inpId}
          className="block text-sm font-medium mb-1 dark:text-white"
        >
          {label}
          {mandatory === true && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex w-full">
        {/* prefix group (jika ada) */}
        {prefixGroup && (
          <span className="px-3 inline-flex items-center min-w-fit rounded-s-md border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            {prefixGroup}
          </span>
        )}

        {/* wrapper untuk input + icons */}
        <div className="relative flex-1">
          <input
            type={type}
            id={inpId}
            name={inpId}
            className={cn(
              "py-2 px-3 block w-full border border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
              className,
              prefixGroup && !sufixGroup && "rounded-e-md", // kalau ada prefixGroup → rounded kanan saja
              sufixGroup && !prefixGroup && "rounded-s-md", // kalau ada sufixGroup → rounded kiri saja
              prefixGroup && sufixGroup && "rounded-none",  // kalau ada dua2nya → rata
              !prefixGroup && !sufixGroup && "rounded-md",  // default
              prefixIcon && "ps-10",
              sufixIcon && "pe-10"
            )}
            {...props}
          />

          {/* prefix icon */}
          {prefixIcon && (
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              {prefixIcon}
            </div>
          )}

          {/* sufix icon */}
          {sufixIcon && (
            <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
              {sufixIcon}
            </div>
          )}
        </div>

        {/* sufix group (jika ada) */}
        {sufixGroup && (
          <span className="px-3 inline-flex items-center min-w-fit rounded-e-md border border-l-0 border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            {sufixGroup}
          </span>
        )}
      </div>
    </div>
  )
}
