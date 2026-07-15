export default function Page() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page label */}
      <p className="font-black text-brand-600">
        EventPilot
      </p>

      {/* Page heading */}
      <h1 className="mt-2 text-4xl font-black tracking-tight">
        Terms of Service
      </h1>

      {/* Terms of service description */}
      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
        Users must provide accurate information, respect event rules, and avoid
        submitting misleading event listings or unsafe content.
      </p>
    </section>
  );
}