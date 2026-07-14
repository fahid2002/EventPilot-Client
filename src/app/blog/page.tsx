// Blog article data
const posts = [
  [
    "Learning",
    "How to choose the right tech workshop",
    "A practical guide for selecting events that match your current skill level and future goals.",
  ],
  [
    "Organizing",
    "How organizers can improve event attendance",
    "Clear titles, useful descriptions, fair pricing, and honest schedules help users trust events.",
  ],
  [
    "Community",
    "Why verified event listings matter",
    "Admin approval helps reduce spam and keeps the event discovery experience reliable.",
  ],
];

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page heading */}
      <p className="font-black text-brand-600">
        Blog
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        Event planning and learning articles
      </h1>

      {/* Blog article cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map(([tag, title, text]) => (
          <article
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Article category */}
            <p className="text-sm font-black text-brand-600">
              {tag}
            </p>

            {/* Article title */}
            <h3 className="mt-3 text-xl font-black">
              {title}
            </h3>

            {/* Article description */}
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}