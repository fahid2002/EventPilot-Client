"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed right-4 top-24 z-[80] max-w-sm rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-900 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-white">
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
