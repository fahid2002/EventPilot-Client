"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { fallbackEvents } from "@/data/fallbackEvents";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import type { EventItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useActionGuard } from "@/contexts/ActionGuardContext";
import { useToast } from "@/contexts/ToastContext";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [comment, setComment] = useState("");
  const { user, token, isAuthenticated } = useAuth();
  const { openLoginRequired } = useActionGuard();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await api.getEvent(params.id);
        if (!cancelled) setEvent(response.data.event);
      } catch {
        const local = fallbackEvents.find((item) => item._id === params.id) || fallbackEvents[0];
        if (!cancelled) setEvent(local);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id]);

  const related = useMemo(() => fallbackEvents.filter((item) => item._id !== event?._id).slice(0, 4), [event]);

  const guard = () => {
    if (!isAuthenticated || !token || user?.isDemo) {
      openLoginRequired();
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!event || !guard()) return;
    try {
      await api.saveEvent(event._id, token!);
      showToast("Event saved to your dashboard.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save event.", "error");
    }
  };

  const attend = async () => {
    if (!event || !guard()) return;
    if (event.accessType === "premium" && user?.membership !== "premium") {
      router.push(`/payment/${event._id}`);
      return;
    }
    try {
      await api.attendEvent(event._id, token!);
      showToast("You are now attending this event.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to attend event.", "error");
    }
  };

  const review = async () => {
    if (!guard()) return;
    if (comment.trim().length < 10) {
      showToast("Please write at least 10 characters about your EventPilot website experience.", "error");
      return;
    }
    try {
      await api.reviewWebsite({ rating: 5, comment }, token!);
      setComment("");
      showToast("Website review submitted successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to submit review.", "error");
    }
  };

  if (!event) {
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">Loading event details...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button onClick={() => router.back()} className="mb-6 rounded-xl border border-slate-200 px-4 py-2 font-black dark:border-slate-800">← Back</button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="h-[420px] overflow-hidden rounded-[2rem] shadow-soft">
            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {event.gallery.slice(0, 3).map((image) => <img key={image} src={image} alt={`${event.title} gallery`} className="h-28 rounded-3xl object-cover" />)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700 dark:bg-slate-800 dark:text-brand-100">{event.category}</span>
            <span className="rounded-full bg-mint-400/20 px-3 py-1 text-xs font-black text-mint-500">{event.accessType === "premium" ? "Premium members only" : "Free event"}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight">{event.title}</h1>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{event.fullDescription}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Price</p><p className="mt-1 text-xl font-black">{formatPrice(event.price)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Date</p><p className="mt-1 text-xl font-black">{formatDate(event.date)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Location</p><p className="mt-1 text-xl font-black">{event.location}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Website Rating</p><p className="mt-1 text-xl font-black">{event.rating} ★</p></div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button onClick={attend} className="h-14 rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-6 font-black text-white shadow-glow">Attend Event</button>
            <button onClick={save} className="h-14 rounded-2xl border border-slate-200 px-6 font-black dark:border-slate-800">Save Event</button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h2 className="text-2xl font-black">Overview</h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{event.fullDescription}</p>
          <h2 className="mt-8 text-2xl font-black">Key Information</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-800"><th className="p-4">Organizer</th><td className="p-4">{event.organizerName}</td></tr>
                <tr className="border-b border-slate-200 dark:border-slate-800"><th className="p-4">Capacity</th><td className="p-4">{event.capacity} attendees</td></tr>
                <tr><th className="p-4">Tags</th><td className="p-4">{event.tags.join(", ")}</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-black">Review EventPilot</h2>
          <div className="mt-4 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-slate-600 dark:text-slate-300">Reviews are about the website experience, event discovery quality, registration process, and dashboard usefulness.</p>
            <div className="mt-4 flex gap-1 text-2xl">⭐ ⭐ ⭐ ⭐ ⭐</div>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900" rows={4} placeholder="Share how EventPilot helped you find or manage events..." />
            <button onClick={review} className="mt-4 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white dark:bg-white dark:text-slate-950">Submit Website Review</button>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black">Event Facts</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><MapPin className="h-5 w-5 text-pink-500" /><p className="mt-2 font-black">{event.location}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><CalendarDays className="h-5 w-5 text-brand-500" /><p className="mt-2 font-black">{formatDate(event.date)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><Users className="h-5 w-5 text-mint-500" /><p className="mt-2 font-black">{event.capacity} seats</p></div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><Star className="h-5 w-5 fill-amberx text-amberx" /><p className="mt-2 font-black">{event.rating} website rating</p></div>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-black">Related events</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => <EventCard key={item._id} event={item} index={index} />)}
        </div>
      </div>
    </section>
  );
}
