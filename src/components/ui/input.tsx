import { cn } from '@/lib/utils'
import React from 'react'

export default function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor="input-label" className="block text-sm font-medium mb-2 dark:text-white">Email</label>
      <input type={type} id="input-label" 
      className={cn(
        "py-2.5 px-3 block w-full border border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
        className
      )}></input>
    </div>
  )
}
