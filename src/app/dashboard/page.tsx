"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, CreditCard, ShieldCheck, Star, Users, type LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EventItem } from "@/types";
import { fallbackEvents } from "@/data/fallbackEvents";
import { EventCard } from "@/components/EventCard";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const activityData = [
  { month: "Jan", saved: 3, attending: 1 },
  { month: "Feb", saved: 8, attending: 4 },
  { month: "Mar", saved: 6, attending: 3 },
  { month: "Apr", saved: 14, attending: 8 },
  { month: "May", saved: 12, attending: 7 },
  { month: "Jun", saved: 19, attending: 12 }
];

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 31000 },
  { month: "May", revenue: 45000 },
  { month: "Jun", revenue: 86000 }
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isReady, setUser } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState("overview");
  const [saved, setSaved] = useState<EventItem[]>(fallbackEvents.slice(1, 4));
  const [attending, setAttending] = useState<EventItem[]>(fallbackEvents.slice(0, 2));
  const [pending, setPending] = useState<EventItem[]>(fallbackEvents.filter((event) => event.accessType === "premium").slice(0, 2));
  const [photoUrl, setPhotoUrl] = useState("");
  const [eventForm, setEventForm] = useState({ title: "", category: "Web Development", price: "", date: "", location: "", imageUrl: "", shortDescription: "", fullDescription: "", accessType: "free" });

  useEffect(() => {
    if (isReady && !isAuthenticated) router.push("/login");
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    api.dashboard(token).then((response) => {
      setSaved(response.data.saved.length ? response.data.saved : fallbackEvents.slice(1, 4));
      setAttending(response.data.attending.length ? response.data.attending : fallbackEvents.slice(0, 2));
      return api.adminPendingEvents(token);
    }).then((response) => {
      if (response?.data?.events) setPending(response.data.events);
    }).catch(() => undefined);
  }, [token]);

  const stats = useMemo<Array<[LucideIcon, string, string, string]>>(() => {
    if (!user) return [];
    if (user.role === "admin") {
      return [
        [Users, "Total Users", "2,480", "Registered accounts"],
        [CalendarDays, "Total Events", "84", "Approved listings"],
        [ShieldCheck, "Pending Events", String(pending.length || 12), "Need admin review"],
        [BarChart3, "Reports", "5", "Require moderation"]
      ];
    }
    if (user.role === "organizer") {
      return [
        [CalendarDays, "My Events", "12", "Approved and pending"],
        [Users, "Attendees", "842", "Across my events"],
        [CreditCard, "Premium Sales", "৳86K", "Stripe-ready revenue"],
        [Star, "Website Rating", "4.7", "From attendees"]
      ];
    }
    return [
      [CalendarDays, "Saved Events", String(saved.length), "Bookmarked for later"],
      [Users, "Attending", String(attending.length), "Confirmed sessions"],
      [Star, "Website Reviews", "4", "Feedback submitted"],
      [ShieldCheck, "Membership", user.membership, "Free or premium"]
    ];
  }, [user, saved.length, attending.length, pending.length]);

  const canOrganize = user?.role === "organizer" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const protectedDemo = () => {
    if (user?.isDemo) {
      showToast("Demo users can browse the dashboard but cannot change website data.", "error");
      return true;
    }
    return false;
  };

  const addEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || protectedDemo()) return;
    try {
      await api.addEvent({
        title: eventForm.title,
        category: eventForm.category,
        price: Number(eventForm.price),
        date: eventForm.date,
        location: eventForm.location,
        imageUrl: eventForm.imageUrl,
        shortDescription: eventForm.shortDescription,
        fullDescription: eventForm.fullDescription,
        accessType: eventForm.accessType as "free" | "premium",
        gallery: eventForm.imageUrl ? [eventForm.imageUrl] : [],
        capacity: 80,
        tags: [eventForm.category]
      }, token);
      showToast("Event submitted for admin approval.", "success");
      setEventForm({ title: "", category: "Web Development", price: "", date: "", location: "", imageUrl: "", shortDescription: "", fullDescription: "", accessType: "free" });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add event.", "error");
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

  const previewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (!user) return <div className="mx-auto max-w-7xl px-4 py-16">Loading dashboard...</div>;

  const nav = [
    ["overview", "Overview", true],
    ["saved", "Saved Events", true],
    ["attending", "Attending Events", true],
    ["reviews", "My Reviews", true],
    ["add", "Add Event", canOrganize],
    ["manage", "Manage Events", canOrganize],
    ["analytics", "Organizer Analytics", canOrganize],
    ["admin", "Admin Control", isAdmin],
    ["profile", "Profile Settings", true]
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="font-black text-brand-600">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Welcome back, {user.name}</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">All logged-in features are inside this dashboard. The sidebar changes based on your account role.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black capitalize dark:border-slate-800 dark:bg-slate-900">
          {user.role} • {user.membership} membership
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-slate-700 text-2xl">
                {user.photoUrl || photoUrl ? <img src={photoUrl || user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : "👤"}
              </div>
              <div>
                <p className="font-black">{user.name}</p>
                <p className="text-sm capitalize text-slate-300">{user.role} account</p>
              </div>
            </div>
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
                  <div key={String(label)} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Icon className="h-6 w-6 text-brand-600" />
                    <p className="mt-4 text-sm font-bold text-slate-500">{String(label)}</p>
                    <p className="mt-2 text-4xl font-black capitalize">{String(value)}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{String(help)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-8 xl:grid-cols-3">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                  <h2 className="text-2xl font-black">Activity overview</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saved and attending activity from MongoDB data</p>
                  <div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={activityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="saved" stroke="currentColor" strokeWidth={2} /><Line type="monotone" dataKey="attending" stroke="currentColor" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-2xl font-black">Recent activity</h2>
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="font-black">Attending</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Next.js TypeScript Bootcamp</p></div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="font-black">Saved</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">AI Career Summit Bangladesh</p></div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="font-black">Reviewed Website</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Rated dashboard experience 5 stars</p></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "saved" ? <ListSection title="Saved Events" description="Events saved by the logged-in user are stored in MongoDB and loaded here." events={saved} /> : null}
          {tab === "attending" ? <ListSection title="Attending Events" description="Free events can be attended by logged-in users. Premium events require premium membership." events={attending} /> : null}
          {tab === "reviews" ? <ReviewsSection /> : null}

          {tab === "add" ? (
            <form onSubmit={addEvent} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="font-black text-brand-600">Organizer Dashboard</p>
              <h2 className="mt-2 text-3xl font-black">Add New Event</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">This creates a MongoDB event document with pending approval status.</p>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <Input label="Title" value={eventForm.title} onChange={(value) => setEventForm({ ...eventForm, title: value })} placeholder="Advanced React Patterns Day" />
                <div><label className="text-sm font-black">Category</label><select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"><option>Web Development</option><option>AI & Data</option><option>UI/UX Design</option><option>Career</option></select></div>
                <Input label="Price" value={eventForm.price} onChange={(value) => setEventForm({ ...eventForm, price: value })} placeholder="1800" />
                <Input label="Date" type="date" value={eventForm.date} onChange={(value) => setEventForm({ ...eventForm, date: value })} placeholder="" />
                <Input label="Location" value={eventForm.location} onChange={(value) => setEventForm({ ...eventForm, location: value })} placeholder="Dhaka" />
                <Input label="Image URL" value={eventForm.imageUrl} onChange={(value) => setEventForm({ ...eventForm, imageUrl: value })} placeholder="https://images.unsplash.com/..." />
                <div><label className="text-sm font-black">Access Type</label><select value={eventForm.accessType} onChange={(e) => setEventForm({ ...eventForm, accessType: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"><option value="free">Free Event</option><option value="premium">Premium Event</option></select></div>
                <Input label="Short Description" value={eventForm.shortDescription} onChange={(value) => setEventForm({ ...eventForm, shortDescription: value })} placeholder="A practical workshop for improving React code quality." />
                <div className="md:col-span-2"><label className="text-sm font-black">Full Description</label><textarea value={eventForm.fullDescription} onChange={(e) => setEventForm({ ...eventForm, fullDescription: e.target.value })} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Describe the event schedule, speaker, learning outcomes, and who should attend." /></div>
              </div>
              <button className="mt-6 rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-6 py-4 font-black text-white shadow-glow">Submit for Approval</button>
            </form>
          ) : null}

          {tab === "manage" ? <ManageSection /> : null}
          {tab === "analytics" ? <AnalyticsSection /> : null}
          {tab === "admin" ? <AdminSection pending={pending} approve={approve} /> : null}
          {tab === "profile" ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="font-black text-brand-600">Profile Settings</p>
              <h2 className="mt-2 text-3xl font-black">Update Account Information</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Photo is optional. If no photo is uploaded, a neutral faceless avatar is shown.</p>
              <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-slate-200 text-4xl text-slate-500 dark:bg-slate-700">{photoUrl || user.photoUrl ? <img src={photoUrl || user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : "👤"}</div>
                <div><label className="inline-flex cursor-pointer items-center rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">Browse Photo<input type="file" accept="image/*" className="hidden" onChange={previewPhoto} /></label><p className="mt-2 text-sm text-slate-500">JPG or PNG photo can be selected from your device.</p></div>
              </div>
              <div className="mt-7 grid gap-5 md:grid-cols-2"><Input label="Full Name" value={user.name} onChange={() => undefined} placeholder="" /><Input label="Email" value={user.email} onChange={() => undefined} placeholder="" /></div>
              <button onClick={() => showToast("Profile preview updated. Connect this button to the profile API for production edits.", "success")} className="mt-6 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white dark:bg-white dark:text-slate-950">Save Profile</button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div><label className="text-sm font-black">{label}</label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder={placeholder} /></div>;
}

function ListSection({ title, description, events }: { title: string; description: string; events: EventItem[] }) {
  return <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">{title}</h2><p className="mt-1 text-slate-600 dark:text-slate-300">{description}</p><div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div></div>;
}

function ReviewsSection() {
  return <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">My Website Reviews</h2><p className="mt-1 text-slate-600 dark:text-slate-300">Reviews focus on the EventPilot website experience, not the coding project.</p><div className="mt-6 grid gap-4"><div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950"><p className="font-black">Event discovery experience</p><p className="mt-1 text-sm text-amberx">★★★★★</p><p className="mt-2 text-slate-600 dark:text-slate-300">The search and filter options helped me find an event matching my learning goal.</p></div><div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950"><p className="font-black">Dashboard usefulness</p><p className="mt-1 text-sm text-amberx">★★★★★</p><p className="mt-2 text-slate-600 dark:text-slate-300">Saved and attending events are organized clearly in one place.</p></div></div></div>;
}

function ManageSection() {
  return <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="font-black text-brand-600">Organizer Dashboard</p><h2 className="mt-2 text-3xl font-black">Manage Events</h2><p className="mt-3 text-slate-600 dark:text-slate-300">Organizers can view, update, or delete their own events from inside the dashboard.</p><div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800"><div className="hidden grid-cols-7 bg-slate-50 p-4 text-sm font-black text-slate-500 dark:bg-slate-950 md:grid"><span className="col-span-2">Event</span><span>Category</span><span>Date</span><span>Price</span><span>Status</span><span>Actions</span></div>{fallbackEvents.slice(0,3).map((event) => <div key={event._id} className="grid gap-4 border-t border-slate-200 p-4 dark:border-slate-800 md:grid-cols-7 md:items-center"><div className="col-span-2"><p className="font-black">{event.title}</p><p className="text-sm text-slate-500">{event.location} • {event.rating} ★</p></div><p>{event.category}</p><p>{event.date}</p><p>৳{event.price}</p><span className="w-fit rounded-full bg-mint-400/20 px-3 py-1 text-xs font-black text-mint-500">Approved</span><div className="flex gap-2"><a href={`/events/${event._id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black dark:border-slate-800">View</a><button className="rounded-xl bg-red-500 px-3 py-2 text-sm font-black text-white">Delete</button></div></div>)}</div></div>;
}

function AnalyticsSection() {
  return <div className="grid gap-8 xl:grid-cols-2"><div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">Stripe-ready Premium Sales</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Revenue from premium membership upgrades and premium event access</p><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="currentColor" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div><div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">Event Performance</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Views, saved events, and attending users</p><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:"Views",value:3400},{name:"Saves",value:842},{name:"Attending",value:420}]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="currentColor" /></BarChart></ResponsiveContainer></div></div></div>;
}

function AdminSection({ pending, approve }: { pending: EventItem[]; approve: (eventId: string, status: "approved" | "rejected") => void }) {
  return <div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-bold text-slate-500">Total Users</p><p className="mt-2 text-4xl font-black">2,480</p></div><div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-bold text-slate-500">Total Events</p><p className="mt-2 text-4xl font-black">84</p></div><div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-bold text-slate-500">Pending</p><p className="mt-2 text-4xl font-black">{pending.length}</p></div><div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-bold text-slate-500">Reports</p><p className="mt-2 text-4xl font-black">5</p></div></div><div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-black">Pending Event Approvals</h2><p className="mt-1 text-slate-600 dark:text-slate-300">Admin reviews organizer-submitted events before they become public.</p><div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800"><div className="hidden grid-cols-6 bg-slate-50 p-4 text-sm font-black text-slate-500 dark:bg-slate-950 md:grid"><span className="col-span-2">Event</span><span>Organizer</span><span>Category</span><span>Submitted</span><span>Actions</span></div>{pending.map((event) => <div key={event._id} className="grid gap-4 border-t border-slate-200 p-4 dark:border-slate-800 md:grid-cols-6 md:items-center"><div className="col-span-2"><p className="font-black">{event.title}</p><p className="text-sm text-slate-500">{event.location} • ৳{event.price}</p></div><p>{event.organizerName}</p><p>{event.category}</p><p>Today</p><div className="flex gap-2"><button onClick={() => approve(event._id, "approved")} className="rounded-xl bg-mint-500 px-3 py-2 text-sm font-black text-white">Approve</button><button onClick={() => approve(event._id, "rejected")} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-black text-white">Reject</button></div></div>)}</div></div></div>;
}
