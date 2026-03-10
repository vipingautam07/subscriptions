import { cn } from "../lib/utils"
import { ChevronDown } from "lucide-react"

export function Select({ className, options = [], value, onChange, placeholder = "Select an option", ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none border-2 border-black bg-white px-4 py-2 pr-10 font-medium text-black transition-all focus:outline-none focus:shadow-neo dark:border-white dark:bg-dark-card dark:text-white dark:focus:shadow-neo-dark disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="" disabled className="text-gray-500">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black dark:text-white">
        <ChevronDown className="h-5 w-5 stroke-[3]" />
      </div>
    </div>
  )
}
