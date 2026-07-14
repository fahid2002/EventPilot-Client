"use client";

import { useEffect, useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { fallbackEvents } from "@/data/fallbackEvents";
import { api } from "@/lib/api";
import type { EventItem } from "@/types";

const perPage = 8;

export default function ExplorePage() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [accessType, setAccessType] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      setLoading(true);
      try {
        const response = await api.getEvents("?limit=100&status=approved");
        if (!cancelled) setEvents(response.data.events.length ? response.data.events : fallbackEvents);
      } catch {
        if (!cancelled) setEvents(fallbackEvents);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadEvents();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const list = [...events].filter((event) => {
      return event.title.toLowerCase().includes(search.toLowerCase())
        && (!category || event.category === category)
        && (!location || event.location === location)
        && (!accessType || event.accessType === accessType);
    });

    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "ratingHigh") list.sort((a, b) => b.rating - a.rating);
    if (sort === "latest") list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return list;
  }, [events, search, category, location, accessType, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => setPage(1), [search, category, location, accessType, sort]);

  return (
    <>
      <section className="bg-white py-10 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-black text-brand-600">Explore</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Find your next tech event</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Search by title, filter by category, location, and free/premium access, then sort results before attending.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 lg:grid-cols-6">
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950 lg:col-span-2" placeholder="Search event title..." />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <option value="">All categories</option>
              <option>Web Development</option>
              <option>AI & Data</option>
              <option>UI/UX Design</option>
              <option>Career</option>
            </select>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <option value="">All locations</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Sylhet</option>
              <option>Online</option>
            </select>
            <select value={accessType} onChange={(event) => setAccessType(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <option value="">Free and premium</option>
              <option value="free">Free events</option>
              <option value="premium">Premium events</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <option value="latest">Sort by date</option>
              <option value="priceLow">Price: low to high</option>
              <option value="ratingHigh">Rating: high to low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="skeleton-line h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="skeleton-line mt-4 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="skeleton-line mt-3 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="skeleton-line mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : current.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {current.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-5xl">🔍</p>
            <h3 className="mt-4 text-2xl font-black">No events found</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Try changing your keyword, category, location, or access type.</p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-xl border border-slate-200 px-4 py-2 font-black disabled:opacity-40 dark:border-slate-800">Previous</button>
          {Array.from({ length: pages }).map((_, index) => (
            <button key={index} onClick={() => setPage(index + 1)} className={`rounded-xl px-4 py-2 font-black ${page === index + 1 ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-slate-200 dark:border-slate-800"}`}>{index + 1}</button>
          ))}
          <button disabled={page === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} className="rounded-xl border border-slate-200 px-4 py-2 font-black disabled:opacity-40 dark:border-slate-800">Next</button>
        </div>
      </section>
    </>
  );
}
