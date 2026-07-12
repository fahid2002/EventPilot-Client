"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { EventPilotLogo } from "@/components/EventPilotLogo";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eventpilot_theme");
    const shouldDark = saved === "dark";
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("eventpilot_theme", next ? "dark" : "light");
  };

  const avatar = user?.photoUrl;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/85 shadow-sm glass dark:border-slate-800 dark:bg-slate-950/85">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <EventPilotLogo />
          <span className="text-xl font-black tracking-tight">EventPilot</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 text-sm font-black hover:bg-slate-100 dark:hover:bg-slate-900 ${pathname === link.href ? "text-brand-600" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link href="/dashboard" className="rounded-xl px-4 py-2 text-sm font-black hover:bg-slate-100 dark:hover:bg-slate-900">
              Dashboard
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-black shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated && user ? (
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex">
              <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-slate-200 text-xs font-black text-slate-500 dark:bg-slate-700">
                {avatar ? <img src={avatar} alt={`${user.name} profile`} className="h-full w-full object-cover" /> : "👤"}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-black">{user.name}</p>
                <p className="text-[11px] font-bold capitalize text-brand-600">{user.role} • {user.membership}</p>
              </div>
            </Link>
          ) : null}

          {isAuthenticated ? (
            <button onClick={logout} className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-black hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 sm:inline-flex">
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-soft dark:bg-white dark:text-slate-950">
              Login
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <Link key={link.href} onClick={() => setOpen(false)} href={link.href} className="rounded-xl px-4 py-3 text-left font-black hover:bg-slate-100 dark:hover:bg-slate-900">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? <Link onClick={() => setOpen(false)} href="/dashboard" className="rounded-xl px-4 py-3 text-left font-black hover:bg-slate-100 dark:hover:bg-slate-900">Dashboard</Link> : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
