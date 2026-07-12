"use client";

import Link from "next/link";
import { createContext, useContext, useMemo, useState } from "react";

interface ActionGuardContextValue {
  openLoginRequired: (message?: string) => void;
  closeLoginRequired: () => void;
}

const ActionGuardContext = createContext<ActionGuardContextValue | undefined>(undefined);

export function ActionGuardProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const openLoginRequired = (nextMessage = "Please login with your real account to use this feature completely. Demo visitors can browse EventPilot, but saving, attending, reviewing, and payments require login.") => {
    setMessage(nextMessage);
  };

  const closeLoginRequired = () => setMessage(null);

  const value = useMemo(() => ({ openLoginRequired, closeLoginRequired }), []);

  return (
    <ActionGuardContext.Provider value={value}>
      {children}
      {message ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/70 p-4">
          <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl dark:bg-slate-800">🔐</div>
            <h2 className="mt-5 text-2xl font-black">Login required</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{message}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={closeLoginRequired} className="h-12 flex-1 rounded-2xl border border-slate-200 font-black dark:border-slate-800">Continue Browsing</button>
              <Link onClick={closeLoginRequired} href="/login" className="grid h-12 flex-1 place-items-center rounded-2xl bg-slate-950 font-black text-white dark:bg-white dark:text-slate-950">Go to Login</Link>
            </div>
          </div>
        </div>
      ) : null}
    </ActionGuardContext.Provider>
  );
}

export function useActionGuard() {
  const context = useContext(ActionGuardContext);
  if (!context) {
    throw new Error("useActionGuard must be used inside ActionGuardProvider");
  }
  return context;
}
