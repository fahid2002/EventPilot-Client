import Link from "next/link";
import { BarChart3, CheckCircle2, Database, ShieldCheck, Users, CalendarDays, Search, Sparkles, type LucideIcon } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { EventCarousel } from "@/components/EventCarousel";
import { EventCard } from "@/components/EventCard";
import { API_URL } from "@/lib/api";
import type { ApiResponse, EventItem } from "@/types";

async function loadFeaturedEvents() {
  try {
    const response = await fetch(`${API_URL}/events?limit=8&status=approved`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json() as ApiResponse<{ events: EventItem[] }>;
    return payload.data.events;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await loadFeaturedEvents();
  const featured = events.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mockup-grid" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-24 top-44 h-72 w-72 rounded-full bg-mint-500/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[68vh] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-black text-brand-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-brand-100">
              <span className="h-2 w-2 rounded-full bg-mint-500" />
              Tech events, workshops, bootcamps, and community meetups
            </span>
            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Discover and manage <span className="bg-gradient-to-r from-brand-500 to-mint-500 bg-clip-text text-transparent">professional tech events.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              EventPilot helps learners find trusted events, register with confidence, save favorites, and review event experiences. Organizers can manage listings, track attendees, and grow their tech community.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/explore" className="rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-6 py-4 text-center font-black text-white shadow-glow transition hover:scale-[1.02]">Explore Events</Link>
              <Link href="/login" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-black shadow-sm transition hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900">Login to Use Dashboard</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>✅ Free and premium events</span>
              <span>✅ Google login</span>
              <span>✅ Role dashboard</span>
              <span>✅ MongoDB data flow</span>
            </div>
          </div>
          <HeroSlider />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-black text-brand-600">How EventPilot Works</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">A useful platform for every role</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Public navigation stays simple. Logged-in features stay inside the dashboard, so users do not feel confused by too many navbar routes.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {([
            [Users, "Learners", "Find free events, unlock premium events, save favorites, attend sessions, and review the website experience."],
            [CalendarDays, "Organizers", "Create event listings, track attendees, see performance charts, and manage event approval status."],
            [ShieldCheck, "Admins", "Approve events, manage users, keep listings trusted, and monitor platform health from one panel."]
          ] as Array<[LucideIcon, string, string]>).map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-800"><Icon className="h-7 w-7" /></span>
              <h3 className="mt-5 text-2xl font-black">{String(title)}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{String(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <EventCarousel events={events} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-black text-brand-600">Categories</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Explore events by interest</h2>
          </div>
          <Link href="/explore" className="rounded-2xl border border-slate-200 px-5 py-3 text-center font-black dark:border-slate-800">Browse All</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["💻", "Web Development", "Build stronger frontend and backend skills."],
            ["🤖", "AI & Data", "Learn practical data and AI workflows."],
            ["🎨", "UI/UX Design", "Improve design thinking and portfolio quality."],
            ["🚀", "Career Growth", "Meet mentors, recruiters, and founders."]
          ].map(([emoji, title, text], index) => (
            <div key={title} className={`rounded-3xl p-6 ${index === 0 ? "bg-slate-950 text-white shadow-soft" : "bg-brand-50 dark:bg-slate-800"}`}>
              <p className="text-3xl">{emoji}</p>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className={`mt-2 text-sm ${index === 0 ? "text-slate-300" : "text-slate-500 dark:text-slate-300"}`}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-black text-brand-600">Popular Events</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Upcoming verified events</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Cards use consistent height, matching button alignment, and clear free/premium status.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featured.length ? featured.map((event, index) => <EventCard key={event._id} event={event} index={index} />) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500 dark:border-slate-700 dark:bg-slate-900 md:col-span-2 lg:col-span-4">
                No approved events are published yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[["84+", "Verified events"], ["12K+", "Active visitors"], ["1,284", "Event attendances"], ["4.8", "Average website rating"]].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-4xl font-black">{value}</p>
              <p className="mt-2 text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-black text-brand-600">Data Flow</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Designed for MongoDB storage</h2>
            <div className="mt-8 grid gap-4">
              {([
                [Database, "Users collection", "Stores name, email, hashed password, photo URL, Google account ID, role, membership, and account status."],
                [CalendarDays, "Events collection", "Stores title, descriptions, category, date, price, free/premium access type, organizer ID, approval status, and ratings."],
                [BarChart3, "Activity collections", "Saved events, attending events, website reviews, and payments power personalized dashboards."]
              ] as Array<[LucideIcon, string, string]>).map(([Icon, title, text]) => (
                <div key={String(title)} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="flex items-center gap-3 font-black"><Icon className="h-5 w-5 text-brand-600" />{String(title)}</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{String(text)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                [Search, "Search + Filters", "Users find relevant events faster."],
                [ShieldCheck, "JWT + Roles", "Server checks every protected action."],
                [CheckCircle2, "Free/Premium Rules", "Premium events require premium membership."],
                [Sparkles, "Payment Page", "Membership upgrade opens a separate payment page."]
              ] as Array<[LucideIcon, string, string]>).map(([Icon, title, text]) => (
                <div key={String(title)} className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                  <Icon className="h-7 w-7 text-brand-600" />
                  <h3 className="mt-4 font-black">{String(title)}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{String(text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-black text-brand-600">Website Reviews</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">What users say about EventPilot</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Nadia Rahman", "EventPilot made it easy to find relevant tech events without checking multiple social media groups."],
              ["Tanvir Ahmed", "The saved events and attending dashboard helped me keep track of every workshop I planned to join."],
              ["Maliha Chowdhury", "As an organizer, the analytics view helped me understand which event topics received the most interest."]
            ].map(([name, text]) => (
              <blockquote key={name} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-slate-700 dark:text-slate-300">“{text}”</p>
                <footer className="mt-5 font-black">{name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="font-black text-brand-600">FAQ</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Common questions</h2>
          </div>
          <div className="grid gap-4 lg:col-span-2">
            {[
              ["Can free users attend free events?", "Yes. Logged-in free users can attend free events immediately."],
              ["Who can attend premium events?", "Only premium members can attend premium events. Free users are redirected to the payment page to upgrade."],
              ["Where are organizer and admin pages?", "They are inside the dashboard sidebar, not the public navbar, so the navigation stays clean."]
            ].map(([q, a]) => (
              <details key={q} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" open={q === "Can free users attend free events?"}>
                <summary className="cursor-pointer font-black">{q}</summary>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-600 to-mint-500 p-8 text-white shadow-glow lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Start discovering useful tech events today.</h2>
              <p className="mt-4 text-white/85">Browse verified events, register for free sessions, unlock premium access, and manage your learning plan from one clean dashboard.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/explore" className="rounded-2xl bg-white px-6 py-4 text-center font-black text-slate-950">Browse Events</Link>
              <Link href="/register" className="rounded-2xl border border-white/40 px-6 py-4 text-center font-black">Create Account</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
