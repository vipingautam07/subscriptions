import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Theme Toggle logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg text-black dark:text-white transition-colors duration-200 uppercase font-sans">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)} 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
        />
        <main className="flex-1 py-10 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay placeholder */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-72 shadow-neo transition-transform flex flex-col" onClick={e => e.stopPropagation()}>
            <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
