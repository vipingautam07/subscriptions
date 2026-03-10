import { cn } from "../lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg transform overflow-hidden bg-white border-4 border-black p-6 shadow-neo transition-all dark:bg-dark-card dark:border-white animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4 dark:border-white">
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-wider">{title}</h2>
          <button 
            onClick={onClose}
            className="border-2 border-black p-1 hover:bg-danger text-black transition-colors shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-white dark:text-white dark:hover:text-black"
          >
            <X className="h-6 w-6 stroke-[3]" />
          </button>
        </div>
        
        <div className="mt-2 text-black dark:text-white font-medium">
          {children}
        </div>
      </div>
    </div>
  )
}
