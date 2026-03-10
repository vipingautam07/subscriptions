import { cn } from "../lib/utils"

export function Badge({ className, variant, children, ...props }) {
  const variants = {
    active: "bg-secondary text-black",
    upcoming: "bg-warning text-black",
    expired: "bg-danger text-black",
    default: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center border-[2px] border-black dark:border-white px-3 py-1 text-sm font-bold shadow-neo-sm dark:shadow-neo-sm-dark",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
