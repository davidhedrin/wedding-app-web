import { cn } from '@/lib/utils';
import React from 'react';

type InputProps = {
  label?: string;
  mandatory?: boolean | undefined;
};

export default function Textarea({ label, mandatory, className, ...props }: InputProps & React.ComponentProps<'textarea'>) {
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

      <textarea id={inpId} name={inpId} {...props}
        className={
          cn(
            "py-2 px-3 block w-full border rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
            className,
          )
        }
      />
    </div>
  )
}
