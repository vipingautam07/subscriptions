import { cn } from "../lib/utils"

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-12 w-full border-2 border-black bg-white px-4 py-2 font-medium text-black transition-all focus:outline-none focus:shadow-neo dark:border-white dark:bg-dark-card dark:text-white dark:focus:shadow-neo-dark placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
