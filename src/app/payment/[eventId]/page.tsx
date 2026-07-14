"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import type { EventItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useActionGuard } from "@/contexts/ActionGuardContext";

export default function PaymentPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const { user, token, isAuthenticated, setUser } = useAuth();
  const { showToast } = useToast();
  const { openLoginRequired } = useActionGuard();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getEvent(params.eventId).then((response) => setEvent(response.data.event)).catch(() => setEvent(null));
  }, [params.eventId]);

  const demoUpgrade = async () => {
    if (!isAuthenticated || !token || user?.isDemo) {
      openLoginRequired("Please login with your real account before upgrading to premium membership or attending premium events.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.demoUpgrade(params.eventId, token);
      setUser(response.data.user);
      localStorage.setItem("eventpilot_user", JSON.stringify(response.data.user));
      showToast("Premium membership activated. You are now attending this event.", "success");
      router.push("/dashboard");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Payment could not be completed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const stripeCheckout = async () => {
    if (!isAuthenticated || !token || user?.isDemo) {
      openLoginRequired("Please login with your real account before opening the payment page.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.createCheckout(params.eventId, token);
      window.location.href = response.data.url;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Stripe Checkout is not configured yet. Use demo upgrade for local testing.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="mx-auto max-w-7xl px-4 py-16">Loading payment page...</div>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="font-black text-brand-600">Premium Access Payment Page</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Unlock premium event access</h1>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
            Premium events are only available to premium EventPilot members. This separate payment page upgrades the user account and stores the payment and attendance record in MongoDB.
          </p>
          <div className="mt-8 rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img src={event.imageUrl} alt={event.title} className="h-64 w-full object-cover" />
            <div className="p-6">
              <span className="rounded-full bg-mint-400/20 px-3 py-1 text-xs font-black text-mint-500">Premium Event</span>
              <h2 className="mt-4 text-2xl font-black">{event.title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{event.shortDescription}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-800"><CreditCard className="h-7 w-7" /></div>
          <h2 className="mt-5 text-3xl font-black">Premium Membership</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Upgrade once and attend all premium events available on EventPilot.</p>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="text-sm font-bold text-slate-500">Membership Price</p>
            <p className="mt-2 text-4xl font-black">৳999</p>
            <p className="mt-2 text-sm text-slate-500">Test payment page for student project demonstration</p>
          </div>
          <div className="mt-6 grid gap-3">
            <button disabled={loading} onClick={stripeCheckout} className="h-14 rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-6 font-black text-white shadow-glow disabled:opacity-60">Pay with Stripe Checkout</button>
            <button disabled={loading} onClick={demoUpgrade} className="h-14 rounded-2xl border border-slate-200 px-6 font-black dark:border-slate-800 disabled:opacity-60">Demo Upgrade for Local Testing</button>
            <Link href={`/events/${event._id}`} className="grid h-12 place-items-center rounded-2xl border border-slate-200 font-black dark:border-slate-800">Back to Event Details</Link>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-mint-500" /> JWT verifies the logged-in user before payment actions.</p>
            <p className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand-600" /> Payment and membership status are stored securely in MongoDB.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
