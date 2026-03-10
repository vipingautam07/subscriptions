import { Search } from "lucide-react"
import { Input } from "./Input"

export function SearchBar({ className, ...props }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-black stroke-[3] dark:text-white" />
      </div>
      <Input
        type="search"
        placeholder="SEARCH SUBSCRIPTIONS..."
        className="pl-12 font-bold uppercase tracking-wider bg-white border-2 border-black focus:shadow-neo dark:bg-dark-card dark:border-white focus:outline-none"
        {...props}
      />
    </div>
  )
}
