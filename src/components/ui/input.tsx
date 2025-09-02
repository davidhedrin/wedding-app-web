import { cn } from '@/lib/utils'
import React from 'react'

type InputProps = {
  label?: string;
  prefixIcon?: React.JSX.Element;
  mandatory?: boolean | undefined;
};

export default function Input({ label, prefixIcon, mandatory, className, type, ...props }: InputProps & React.ComponentProps<"input">) {
  const inpId = props.id;

  return (
    <div className="relative">
      {
        label !== undefined && <label htmlFor={inpId} className="block text-sm font-medium mb-1 dark:text-white">
          {label}{(mandatory !== undefined && mandatory === true) && <span className="text-red-500">*</span>}
        </label>
      }
      <input type={type} id={inpId} name={inpId}
        className={cn(
          "py-2 px-3 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
          className,
          prefixIcon && "ps-10"
        )}
        {...props}
      />
      {
        prefixIcon && <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
          {prefixIcon}
        </div>
      }
    </div>
  )
}
