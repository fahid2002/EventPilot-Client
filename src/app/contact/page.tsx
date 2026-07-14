"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/contexts/ToastContext";

export default function ContactPage() {
  // Reference to the contact form
  const formRef = useRef<HTMLFormElement>(null);

  // Tracks email submission state
  const [loading, setLoading] = useState(false);

  // Toast message function
  const { showToast } = useToast();

  // Handles contact form submission
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    setLoading(true);

    try {
      if (serviceId && templateId && publicKey && formRef.current) {
        await emailjs.sendForm(
          serviceId,
          templateId,
          formRef.current,
          {
            publicKey,
          }
        );
      }

      showToast(
        "Message sent successfully. EventPilot support will review your message.",
        "success"
      );

      formRef.current?.reset();
    } catch {
      showToast(
        "Email service is not configured correctly. Check your EmailJS values.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page heading */}
      <p className="font-black text-brand-600">
        Contact
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        Contact EventPilot Support
      </h1>

      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Send a message about event listing issues, account help, organizer
        verification, premium access, or website feedback.
      </p>

      {/* Contact form */}
      <form
        ref={formRef}
        onSubmit={submit}
        className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Name and email fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            name="from_name"
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
            placeholder="Your name"
          />

          <input
            name="reply_to"
            required
            type="email"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
            placeholder="Email address"
          />
        </div>

        {/* Message subject */}
        <input
          name="subject"
          required
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
          placeholder="Message subject"
        />

        {/* Message body */}
        <textarea
          name="message"
          required
          rows={5}
          className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
          placeholder="Write your message clearly so the support team can help you faster."
        />

        {/* Submit button */}
        <button
          disabled={loading}
          className="mt-5 rounded-2xl bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}