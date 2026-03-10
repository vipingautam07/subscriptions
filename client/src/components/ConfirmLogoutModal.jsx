import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";

export function ConfirmLogoutModal({ isOpen, onClose, onConfirm }) {
  const cancelBtnRef = useRef(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Auto-focus the cancel button for basic focus trapping/accessibility
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 10);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-labelledby="logout-title"
        aria-describedby="logout-desc"
        aria-modal="true"
        className="relative w-full max-w-[360px] transform overflow-hidden bg-white border-4 border-black p-6 shadow-neo transition-all dark:bg-dark-card dark:border-white animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <LogOut className="h-8 w-8 text-black dark:text-white stroke-[2.5]" aria-hidden="true" />
          <h2 id="logout-title" className="text-2xl font-black text-black dark:text-white uppercase tracking-wider">
            Confirm Logout
          </h2>
        </div>
        
        <p id="logout-desc" className="text-black dark:text-gray-300 font-bold uppercase tracking-wider text-sm mb-8 leading-relaxed">
          Are you sure you want to sign out of your account?
        </p>

        <div className="flex gap-4">
          <Button 
            ref={cancelBtnRef}
            onClick={onClose} 
            variant="outline"
            className="flex-1 bg-gray-200 hover:bg-gray-300 border-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-white dark:text-white"
          >
            CANCEL
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="danger"
            className="flex-1"
          >
            SIGN OUT
          </Button>
        </div>
      </div>
    </div>
  );
}
