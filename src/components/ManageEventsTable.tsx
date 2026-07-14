"use client";

import Link from "next/link";
import type { EventItem } from "@/types";

export function ManageEventsTable({ events, onDelete, deletingId }: { events: EventItem[]; onDelete: (eventId: string) => void; deletingId?: string | null }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="font-black text-brand-600">Organizer Dashboard</p>
      <h2 className="mt-2 text-3xl font-black">Manage Events</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">These rows are loaded from MongoDB. Admins see all events; organizers see only their own events.</p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="hidden grid-cols-7 bg-slate-50 p-4 text-sm font-black text-slate-500 dark:bg-slate-950 md:grid">
          <span className="col-span-2">Event</span><span>Category</span><span>Date</span><span>Price</span><span>Status</span><span>Actions</span>
        </div>
        {events.length ? events.map((event) => (
          <div key={event._id} className="grid gap-4 border-t border-slate-200 p-4 dark:border-slate-800 md:grid-cols-7 md:items-center">
            <div className="col-span-2">
              <p className="font-black">{event.title}</p>
              <p className="text-sm text-slate-500">{event.location} | {event.rating} rating</p>
            </div>
            <p>{event.category}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>BDT {event.price}</p>
            <span className="w-fit rounded-full bg-mint-400/20 px-3 py-1 text-xs font-black capitalize text-mint-600">{event.status}</span>
            <div className="flex gap-2">
              <Link href={`/events/${event._id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black dark:border-slate-800">View</Link>
              <button disabled={deletingId === event._id} onClick={() => onDelete(event._id)} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-black text-white disabled:opacity-60">Delete</button>
            </div>
          </div>
        )) : (
          <div className="border-t border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800">No events found for this account yet.</div>
        )}
      </div>
    </div>
  );
}
