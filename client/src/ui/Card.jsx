import { cn } from "../lib/utils"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "border-2 border-black bg-white shadow-neo transition-all dark:border-white dark:bg-dark-card dark:shadow-neo-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
