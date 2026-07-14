"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ManageEventsTable } from "@/components/ManageEventsTable";
import { api } from "@/lib/api";
import type { EventItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function ManageItemsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isReady } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canOrganize = user?.role === "organizer" || user?.role === "admin";

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !canOrganize) {
      showToast("Only organizer and admin accounts can manage events.", "error");
      router.push("/dashboard");
    }
  }, [canOrganize, isAuthenticated, isReady, router, showToast, user]);

  useEffect(() => {
    if (!token || !canOrganize) return;
    let cancelled = false;
    setLoading(true);
    api.manageEvents(token)
      .then((response) => {
        if (!cancelled) setEvents(response.data.events);
      })
      .catch((error) => {
        if (!cancelled) showToast(error instanceof Error ? error.message : "Unable to load managed events.", "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [canOrganize, showToast, token]);

  const deleteEvent = async (eventId: string) => {
    if (!token || !user) return;
    if (user.isDemo) {
      showToast("Demo users can browse EventPilot but cannot delete events.", "error");
      return;
    }
    setDeletingId(eventId);
    try {
      await api.deleteEvent(eventId, token);
      setEvents((items) => items.filter((item) => item._id !== eventId));
      showToast("Event deleted.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to delete event.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isReady || !user || !canOrganize) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading manage events page...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Loading managed events from MongoDB...
        </div>
      ) : (
        <ManageEventsTable events={events} deletingId={deletingId} onDelete={deleteEvent} />
      )}
    </section>
  );
}
