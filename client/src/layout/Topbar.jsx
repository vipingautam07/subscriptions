import { Bell, Menu, Sun, Moon } from "lucide-react"
import { SearchBar } from "../ui/SearchBar"
import { useAuth } from "../context/AuthContext"

export function Topbar({ onMenuClick, isDark, toggleTheme }) {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-x-4 border-b-4 border-black bg-secondary px-4 dark:border-white dark:bg-dark-card sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-black lg:hidden dark:text-white"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-8 w-8 stroke-[3]" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-8 w-1 bg-black lg:hidden dark:bg-white" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 justify-center sm:justify-start pt-3 pb-3">
          <SearchBar className="w-full max-w-md hidden sm:block" />
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-8">
          <button
            type="button"
            className="border-2 border-black bg-white p-2 text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all dark:border-white dark:bg-black dark:text-white dark:shadow-neo-sm-dark"
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle theme</span>
            {isDark ? <Sun className="h-6 w-6 stroke-[3]" /> : <Moon className="h-6 w-6 stroke-[3]" />}
          </button>

          <button type="button" className="relative border-2 border-black bg-white p-2 text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all dark:border-white dark:bg-black dark:text-white dark:shadow-neo-sm-dark">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6 stroke-[3]" aria-hidden="true" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-2 border-black bg-danger font-black text-[10px] text-black shadow-neo-sm dark:border-white">
              !
            </span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-10 lg:w-1 lg:bg-black dark:bg-white" aria-hidden="true" />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4">
            <img
              src={user?.profilePicture || "https://i.pinimg.com/736x/92/b4/e7/92b4e7c57de1b5e1e8c5e883fd915450.jpg"}
              className="h-12 w-12 border-2 border-black bg-white shadow-neo-sm cursor-pointer dark:border-white dark:shadow-neo-sm-dark object-cover"
              alt="User profile"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
