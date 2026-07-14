"use client";

import { useState } from "react";
import type { EventItem } from "@/types";

type EventPayload = Partial<EventItem>;

const initialForm = {
  title: "",
  category: "Web Development",
  price: "",
  date: "",
  location: "",
  imageUrl: "",
  shortDescription: "",
  fullDescription: "",
  accessType: "free"
};

const defaultEventImage = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop";

export function EventForm({ onSubmit, submitting = false }: { onSubmit: (payload: EventPayload) => Promise<void>; submitting?: boolean }) {
  const [eventForm, setEventForm] = useState(initialForm);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      title: eventForm.title,
      category: eventForm.category,
      price: Number(eventForm.price),
      date: eventForm.date,
      location: eventForm.location,
      imageUrl: eventForm.imageUrl || defaultEventImage,
      shortDescription: eventForm.shortDescription,
      fullDescription: eventForm.fullDescription,
      accessType: eventForm.accessType as "free" | "premium",
      gallery: [eventForm.imageUrl || defaultEventImage],
      capacity: 80,
      tags: [eventForm.category]
    });
    setEventForm(initialForm);
  };

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="font-black text-brand-600">Organizer Dashboard</p>
      <h2 className="mt-2 text-3xl font-black">Add New Event</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Submit a real MongoDB event document. Organizer submissions stay pending until admin approval.</p>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Input label="Title" value={eventForm.title} onChange={(value) => setEventForm({ ...eventForm, title: value })} placeholder="Advanced React Patterns Day" />
        <div>
          <label className="text-sm font-black">Category</label>
          <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <option>Web Development</option>
            <option>AI & Data</option>
            <option>UI/UX Design</option>
            <option>Career</option>
          </select>
        </div>
        <Input label="Price" value={eventForm.price} onChange={(value) => setEventForm({ ...eventForm, price: value })} placeholder="1800" />
        <Input label="Date" type="date" value={eventForm.date} onChange={(value) => setEventForm({ ...eventForm, date: value })} placeholder="" />
        <Input label="Location" value={eventForm.location} onChange={(value) => setEventForm({ ...eventForm, location: value })} placeholder="Dhaka" />
        <Input label="Optional Image URL" value={eventForm.imageUrl} onChange={(value) => setEventForm({ ...eventForm, imageUrl: value })} placeholder="https://images.unsplash.com/..." />
        <div>
          <label className="text-sm font-black">Access Type</label>
          <select value={eventForm.accessType} onChange={(e) => setEventForm({ ...eventForm, accessType: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <option value="free">Free Event</option>
            <option value="premium">Premium Event</option>
          </select>
        </div>
        <Input label="Short Description" value={eventForm.shortDescription} onChange={(value) => setEventForm({ ...eventForm, shortDescription: value })} placeholder="A practical workshop for improving React code quality." />
        <div className="md:col-span-2">
          <label className="text-sm font-black">Full Description</label>
          <textarea value={eventForm.fullDescription} onChange={(e) => setEventForm({ ...eventForm, fullDescription: e.target.value })} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Describe the event schedule, speaker, learning outcomes, and who should attend." />
        </div>
      </div>
      <button disabled={submitting} className="mt-6 rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-6 py-4 font-black text-white shadow-glow disabled:opacity-60">Submit</button>
    </form>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div><label className="text-sm font-black">{label}</label><input required={label !== "Optional Image URL"} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder={placeholder} /></div>;
}
