import { NavLink } from "react-router-dom"
import { LayoutDashboard, List, BarChart3, Settings, LogOut, CircleDollarSign } from "lucide-react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmLogoutModal } from "../components/ConfirmLogoutModal";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: List },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ isMobile = false, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      toast.success("Signed out successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Logout failed");
    }
  }
  const navContent = (
    <nav className="flex-1 space-y-3">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={() => {
            if (isMobile && onClose) {
              onClose();
            }
          }}
          className={({ isActive }) =>
            `group flex items-center gap-x-4 border-2 border-black dark:border-white p-3 font-bold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-secondary text-black shadow-neo-sm dark:bg-black dark:text-white dark:shadow-neo-sm-dark translate-x-1"
                : "bg-transparent text-black hover:bg-neutral-100 hover:translate-x-1 hover:shadow-neo-sm dark:text-white dark:hover:bg-gray-800"
            }`
          }
        >
          <item.icon className="h-6 w-6 shrink-0 stroke-[2.5]" aria-hidden="true" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className={`z-40 border-r-4 border-black dark:bg-dark-card dark:border-white transition-colors pt-6 bg-white flex flex-col ${isMobile ? 'w-full h-full border-r-0' : 'hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0'}`}>
      <div className="flex h-16 shrink-0 items-center justify-between px-6 pb-6 border-b-4 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white shadow-neo-sm dark:bg-black dark:border-white dark:shadow-neo-sm-dark">
            <CircleDollarSign className="h-6 w-6 text-black dark:text-white stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">SubTrack</span>
        </div>
        
        {isMobile && (
          <button 
            type="button" 
            className="border-2 border-black p-1 bg-white text-black shadow-neo-sm hover:bg-danger dark:border-white dark:bg-black dark:text-white" 
            onClick={onClose}
          >
             <span className="font-bold text-lg px-1">X</span>
          </button>
        )}
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        {navContent}
        
        <div className="mt-auto">
          <button className="group flex w-full items-center gap-x-4 border-2 border-black dark:border-white p-3 font-bold uppercase tracking-wider text-black bg-danger hover:bg-red-400 hover:shadow-neo-sm transition-all dark:text-white dark:bg-danger dark:hover:bg-red-500" onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut className="h-6 w-6 shrink-0 stroke-[2.5]" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      <ConfirmLogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}
