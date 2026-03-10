import { cn } from "../lib/utils"

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold border-2 border-black dark:border-white transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:translate-x-1 active:translate-y-1 active:shadow-none dark:active:shadow-none shadow-neo dark:shadow-neo-dark",
        "h-12 px-6 py-2 text-base",
        {
          "bg-primary text-black hover:bg-pink-400": variant === "primary",
          "bg-white text-black hover:bg-gray-100 dark:bg-dark-card dark:text-white dark:hover:bg-gray-800": variant === "outline" || variant === "ghost",
          "bg-danger text-black hover:bg-red-400": variant === "danger",
          "bg-secondary text-black hover:bg-green-400": variant === "success",
          "bg-accent text-black hover:bg-blue-400": variant === "accent",
        },
        className
      )}
      {...props}
    />
  )
}
