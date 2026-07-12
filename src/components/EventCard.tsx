"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import type { EventItem } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useActionGuard } from "@/contexts/ActionGuardContext";
import { useToast } from "@/contexts/ToastContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const gradients = ["card-gradient-a", "card-gradient-b", "card-gradient-c", "card-gradient-d"];

export function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const { user, token, isAuthenticated } = useAuth();
  const { openLoginRequired } = useActionGuard();
  const { showToast } = useToast();
  const router = useRouter();

  const guard = () => {
    if (!isAuthenticated || !token || user?.isDemo) {
      openLoginRequired();
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!guard()) return;
    try {
      await api.saveEvent(event._id, token!);
      showToast("Event saved to your dashboard.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save event.", "error");
    }
  };

  const handleAttend = async () => {
    if (!guard()) return;

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

  return (
    <article className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`${gradients[index % gradients.length]} h-44 shrink-0 p-5 text-white`}>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black glass">{event.category}</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black glass">{event.accessType === "premium" ? "Premium" : "Free"}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="min-h-[64px] text-xl font-black leading-8">{event.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[52px] text-sm leading-6 text-slate-600 dark:text-slate-300">{event.shortDescription}</p>
        <div className="mt-5 grid gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-pink-500" />{event.location}</span>
          <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-500" />{formatDate(event.date)}</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-amberx text-amberx" />{event.rating} • {formatPrice(event.price)}</span>
        </div>
        <div className="mt-auto grid gap-3 pt-8">
          <Link href={`/events/${event._id}`} className="grid h-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
            View Details
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleSave} className="h-11 rounded-2xl border border-slate-200 text-sm font-black dark:border-slate-800">Save</button>
            <button onClick={handleAttend} className="h-11 rounded-2xl border border-slate-200 text-sm font-black dark:border-slate-800">Attend</button>
          </div>
        </div>
      </div>
    </article>
  );
}
