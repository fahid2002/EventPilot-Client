import Link from "next/link";
import { EventPilotLogo } from "@/components/EventPilotLogo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <EventPilotLogo />
            <span className="text-xl font-black">EventPilot</span>
          </div>
          <p className="mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-300">
            EventPilot is a trusted event discovery and management platform for tech learners, organizers, and community admins. Users can explore verified events, attend free sessions, unlock premium events, save favorites, review the website experience, and manage activity from a secure dashboard.
          </p>
        </div>
        <div>
          <h3 className="font-black">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore Events</Link>
            <Link href="/about">About EventPilot</Link>
            <Link href="/contact">Contact Support</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black">Support</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <a href="mailto:support@eventpilot.dev">support@eventpilot.dev</a>
            <a href="tel:+8801700000000">+880 1700-000000</a>
            <a href="https://github.com" target="_blank">GitHub</a>
            <a href="https://linkedin.com" target="_blank">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-5 text-center text-sm font-bold text-slate-500 dark:border-slate-800">
        © 2026 EventPilot. All rights reserved.
      </div>
    </footer>
  );
}
