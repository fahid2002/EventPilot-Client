"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import type { EventItem } from "@/types";

export function EventCarousel({ events }: { events: EventItem[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(events.length / 4));

  const visible = useMemo(() => events.slice(page * 4, page * 4 + 4), [events, page]);

  return (
    <section className="bg-white py-16 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-black text-brand-600">Featured Carousel</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Events people are exploring now</h2>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">A clean carousel section keeps the homepage interactive without making the navbar complicated.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">Previous</button>
            <button onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white dark:bg-white dark:text-slate-950">Next</button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}
        </div>
      </div>
    </section>
  );
}
