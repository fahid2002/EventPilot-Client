"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { api } from "@/lib/api";
import type { EventItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function AddItemPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isReady } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const canOrganize = user?.role === "organizer" || user?.role === "admin";

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !canOrganize) {
      showToast("Only organizer and admin accounts can add events.", "error");
      router.push("/dashboard");
    }
  }, [canOrganize, isAuthenticated, isReady, router, showToast, user]);

  const addEvent = async (payload: Partial<EventItem>) => {
    if (!token || !user) return;
    if (user.isDemo) {
      showToast("Demo users can browse EventPilot but cannot add events.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.addEvent(payload, token);
      showToast("Event submitted for admin approval.", "success");
      router.push("/items/manage");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add event.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isReady || !user || !canOrganize) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading add event page...</div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <EventForm onSubmit={addEvent} submitting={submitting} />
    </section>
  );
}
