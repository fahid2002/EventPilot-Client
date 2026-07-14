export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page heading */}
      <p className="font-black text-brand-600">
        About
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        About EventPilot
      </h1>

      {/* EventPilot platform description */}
      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
        EventPilot is a tech event discovery and management website for
        learners, organizers, and community admins. It helps people find
        valuable workshops, save events, attend sessions, review the website
        experience, and manage event activity from a clean dashboard.
      </p>

      {/* Platform user groups */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Learner information card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-black">
            For Learners
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Find free events, unlock premium events, and track your learning
            plan.
          </p>
        </div>

        {/* Organizer information card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-black">
            For Organizers
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Publish events, monitor attendees, and understand audience
            interest.
          </p>
        </div>

        {/* Admin information card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-black">
            For Admins
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Review listings, manage users, and maintain a trusted event
            platform.
          </p>
        </div>
      </div>
    </section>
  );
}