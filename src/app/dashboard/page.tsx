"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, CreditCard, ShieldCheck, Star, Users, type LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardSummary, EventItem } from "@/types";
import { EventCard } from "@/components/EventCard";
import { EventForm } from "@/components/EventForm";
import { ManageEventsTable } from "@/components/ManageEventsTable";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isReady } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState("overview");
  const [saved, setSaved] = useState<EventItem[]>([]);
  const [attending, setAttending] = useState<EventItem[]>([]);
  const [pending, setPending] = useState<EventItem[]>([]);
  const [managedEvents, setManagedEvents] = useState<EventItem[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canOrganize = user?.role === "organizer" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isReady && !isAuthenticated) router.push("/login");
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    api.dashboard(token).then((response) => {
      setSummary(response.data.summary);
      setSaved(response.data.saved);
      setAttending(response.data.attending);
    }).catch(() => undefined);
  }, [token]);

  useEffect(() => {
    if (!token || !isAdmin) return;
    api.adminPendingEvents(token).then((response) => setPending(response.data.events)).catch(() => undefined);
  }, [token, isAdmin]);

  useEffect(() => {
    if (!token || !canOrganize) return;
    api.manageEvents(token).then((response) => setManagedEvents(response.data.events)).catch(() => undefined);
  }, [token, canOrganize]);

  const stats = useMemo<Array<[LucideIcon, string, string, string]>>(() => {
    if (!user) return [];
    if (user.role === "admin") {
      return [
        [Users, "Total Users", String(summary?.totalUsers || 0), "Registered accounts"],
        [CalendarDays, "Total Events", String(summary?.totalEvents || 0), "MongoDB event records"],
        [ShieldCheck, "Pending Events", String(summary?.pendingEvents || pending.length), "Need admin review"],
        [BarChart3, "Reviews", String(summary?.reports || 0), "Website feedback records"]
      ];
    }
    if (user.role === "organizer") {
      return [
        [CalendarDays, "My Events", String(summary?.myEvents || managedEvents.length), "Approved and pending"],
        [Users, "Attendees", String(summary?.attendees || 0), "Across my events"],
        [CreditCard, "Premium Sales", `BDT ${summary?.revenue || 0}`, "Paid payment records"],
        [Star, "Website Reviews", String(summary?.reviewCount || 0), "Feedback submitted"]
      ];
    }
    return [
      [CalendarDays, "Saved Events", String(summary?.savedCount || saved.length), "Bookmarked for later"],
      [Users, "Attending", String(summary?.attendingCount || attending.length), "Confirmed sessions"],
      [Star, "Website Reviews", String(summary?.reviewCount || 0), "Feedback submitted"],
      [ShieldCheck, "Membership", user.membership, "Free or premium"]
    ];
  }, [user, summary, pending.length, managedEvents.length, saved.length, attending.length]);

  const chartData = useMemo(() => [
    { name: "Saved", value: summary?.savedCount || saved.length },
    { name: "Attending", value: summary?.attendingCount || attending.length },
    { name: "Reviews", value: summary?.reviewCount || 0 },
    { name: "Events", value: user?.role === "admin" ? summary?.totalEvents || 0 : summary?.myEvents || managedEvents.length }
  ], [summary, saved.length, attending.length, managedEvents.length, user?.role]);

  const protectedDemo = () => {
    if (user?.isDemo) {
      showToast("Demo users can browse the dashboard but cannot change website data.", "error");
      return true;
    }
    return false;
  };

  const addEvent = async (payload: Partial<EventItem>) => {
    if (!token || protectedDemo()) return;
    try {
      const response = await api.addEvent(payload, token);
      setManagedEvents((items) => [response.data.event, ...items]);
      showToast("Event submitted for admin approval.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add event.", "error");
    }
  };

  const deleteManagedEvent = async (eventId: string) => {
    if (!token || protectedDemo()) return;
    setDeletingId(eventId);
    try {
      await api.deleteEvent(eventId, token);
      setManagedEvents((items) => items.filter((item) => item._id !== eventId));
      showToast("Event deleted.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to delete event.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const approve = async (eventId: string, status: "approved" | "rejected") => {
    if (!token || protectedDemo()) return;
    try {
      await api.adminUpdateEventStatus(eventId, status, token);
      setPending((items) => items.filter((item) => item._id !== eventId));
      showToast(`Event ${status}.`, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Admin action failed.", "error");
    }
  };

  if (!user) return <div className="mx-auto max-w-7xl px-4 py-16">Loading dashboard...</div>;

  const nav = [
    ["overview", "Overview", true],
    ["saved", "Saved Events", true],
    ["attending", "Attending Events", true],
    ["reviews", "My Reviews", true],
    ["add", "Add Event", canOrganize],
    ["manage", "Manage Events", canOrganize],
    ["analytics", "Analytics", canOrganize],
    ["admin", "Admin Control", isAdmin]
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="font-black text-brand-600">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Welcome back, {user.name}</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">All dashboard numbers are loaded from MongoDB for the logged-in account role.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black capitalize dark:border-slate-800 dark:bg-slate-900">{user.role} | {user.membership} membership</div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <p className="font-black">{user.name}</p>
            <p className="mt-1 text-sm capitalize text-slate-300">{user.role} account</p>
          </div>
          <div className="mt-4 grid gap-2">
            {nav.filter((item) => item[2]).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`rounded-2xl border border-slate-200 px-4 py-3 text-left font-black dark:border-slate-800 ${tab === id ? "bg-gradient-to-r from-brand-600 to-mint-500 text-white" : ""}`}>{label}</button>
            ))}
          </div>
        </aside>

        <div>
          {tab === "overview" ? (
            <div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([Icon, label, value, help]) => (
                  <div key={label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Icon className="h-6 w-6 text-brand-600" />
                    <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
                    <p className="mt-2 text-4xl font-black capitalize">{value}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{help}</p>
                  </div>
                ))}
              </div>
              <AnalyticsChart data={chartData} />
            </div>
          ) : null}

          {tab === "saved" ? <ListSection title="Saved Events" description="Events saved by the logged-in user." events={saved} /> : null}
          {tab === "attending" ? <ListSection title="Attending Events" description="Confirmed attendance records for the logged-in user." events={attending} /> : null}
          {tab === "reviews" ? <ReviewSection count={summary?.reviewCount || 0} /> : null}
          {tab === "add" ? <EventForm onSubmit={addEvent} /> : null}
          {tab === "manage" ? <ManageEventsTable events={managedEvents} deletingId={deletingId} onDelete={deleteManagedEvent} /> : null}
          {tab === "analytics" ? <AnalyticsChart data={chartData} /> : null}
          {tab === "admin" ? <AdminSection pending={pending} approve={approve} /> : null}
        </div>
      </div>
    </section>
  );
}

function AnalyticsChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-black">MongoDB Activity</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live summary for the selected account role.</p>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="currentColor" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ListSection({ title, description, events }: { title: string; description: string; events: EventItem[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{description}</p>
      {events.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-slate-500 dark:bg-slate-950">No records found yet.</p>}
    </div>
  );
}

function ReviewSection({ count }: { count: number }) {
  return <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">My Website Reviews</h2><p className="mt-2 text-slate-600 dark:text-slate-300">You have submitted {count} website review{count === 1 ? "" : "s"}. Reviews are stored in MongoDB and counted in the dashboard summary.</p></div>;
}

function AdminSection({ pending, approve }: { pending: EventItem[]; approve: (eventId: string, status: "approved" | "rejected") => void }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-black">Pending Event Approvals</h2>
      <p className="mt-1 text-slate-600 dark:text-slate-300">Admin reviews organizer-submitted events before they become public.</p>
      <div className="mt-6 grid gap-4">
        {pending.length ? pending.map((event) => (
          <div key={event._id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="font-black">{event.title}</p>
            <p className="mt-1 text-sm text-slate-500">{event.organizerName} | {event.category} | BDT {event.price}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => approve(event._id, "approved")} className="rounded-xl bg-mint-500 px-4 py-2 text-sm font-black text-white">Approve</button>
              <button onClick={() => approve(event._id, "rejected")} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-black text-white">Reject</button>
            </div>
          </div>
        )) : <p className="rounded-2xl bg-slate-50 p-5 text-slate-500 dark:bg-slate-950">No pending events.</p>}
      </div>
    </div>
  );
}
