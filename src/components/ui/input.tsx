import { cn } from '@/lib/utils'
import React from 'react'

type InputProps = {
  label?: string;
};

export default function Input({ label, className, type, ...props }: InputProps & React.ComponentProps<"input">) {
  const inpId = props.id;
  return (
    <div>
      {
        label !== undefined && <label htmlFor={inpId} className="block text-sm font-medium mb-1 dark:text-white">{label}</label>
      }
      <input type={type} id={inpId} name={inpId}
      className={cn(
        "py-2 px-3 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
        className
      )} {...props} />
    </div>
  )
}
