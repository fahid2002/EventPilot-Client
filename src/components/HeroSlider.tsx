"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useActionGuard } from "@/contexts/ActionGuardContext";

const slides = [
  {
    title: "Next.js TypeScript Bootcamp",
    meta: "Dhaka • July 24, 2026 • Premium",
    className: "card-gradient-a"
  },
  {
    title: "Data Visualization with Recharts",
    meta: "Online • September 9, 2026 • Premium",
    className: "card-gradient-b"
  },
  {
    title: "Startup Tech Networking Meetup",
    meta: "Chattogram • September 21, 2026 • Free",
    className: "card-gradient-d"
  }
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const { isAuthenticated } = useAuth();
  const { openLoginRequired } = useActionGuard();

  useEffect(() => {
    const id = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-[2rem] border border-white/60 bg-white/85 p-4 shadow-soft glass dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <p className="text-sm font-black text-brand-600">Animated Event Highlights</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Auto-changing carousel preview</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActive((active - 1 + slides.length) % slides.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-sm font-black dark:border-slate-800"><ArrowLeft className="h-4 w-4" /></button>
          <button onClick={() => setActive((active + 1) % slides.length)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-sm font-black dark:border-slate-800"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="relative mt-4 min-h-[385px] overflow-hidden rounded-3xl">
        {slides.map((slide, index) => (
          <div key={slide.title} className={`absolute inset-0 transition-all duration-700 ${index === active ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0 pointer-events-none"}`}>
            <div className={`${slide.className} h-64 rounded-3xl p-6 text-white`}>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black glass">Featured</span>
              <h3 className="mt-20 text-3xl font-black">{slide.title}</h3>
              <p className="mt-3 text-white/85">{slide.meta}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="floating-card rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">Active users</p>
                <p className="mt-2 text-4xl font-black">12K</p>
              </div>
              <div className="floating-card rounded-3xl bg-mint-400 p-5 text-slate-950">
                <p className="text-sm font-black">Platform rating</p>
                <p className="mt-2 text-4xl font-black">4.8</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button key={slide.title} onClick={() => setActive(index)} className={`${index === active ? "w-8 bg-brand-600" : "w-2.5 bg-slate-300 dark:bg-slate-700"} h-2.5 rounded-full transition-all`} aria-label={`Show slide ${index + 1}`} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link href="/explore" className="grid h-12 place-items-center rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 font-black text-white shadow-glow">Explore Events</Link>
        {isAuthenticated ? (
          <Link href="/dashboard" className="grid h-12 place-items-center rounded-2xl border border-slate-200 font-black dark:border-slate-800">Go to Dashboard</Link>
        ) : (
          <button onClick={() => openLoginRequired()} className="h-12 rounded-2xl border border-slate-200 font-black dark:border-slate-800">Login to Use Dashboard</button>
        )}
      </div>
    </div>
  );
}
