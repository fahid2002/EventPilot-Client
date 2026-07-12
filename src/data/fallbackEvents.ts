import type { EventItem } from "@/types";

export const fallbackEvents: EventItem[] = [
  {
    _id: "seed-nextjs-bootcamp",
    title: "Next.js TypeScript Bootcamp",
    shortDescription: "Build a full-stack application with Next.js, TypeScript, JWT, and MongoDB.",
    fullDescription: "A hands-on workshop for learners who want to understand modern full-stack development using Next.js, TypeScript, MongoDB, authentication, protected pages, and clean UI architecture.",
    category: "Web Development",
    location: "Dhaka",
    date: "2026-07-24",
    price: 1500,
    accessType: "premium",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.9,
    capacity: 120,
    organizerName: "EventPilot Academy",
    tags: ["Next.js", "TypeScript", "MongoDB"]
  },
  {
    _id: "seed-ai-career-summit",
    title: "AI Career Summit Bangladesh",
    shortDescription: "A practical summit about AI portfolios, interviews, and industry project planning.",
    fullDescription: "This summit connects learners, mentors, and industry speakers to discuss practical AI career paths, portfolio preparation, responsible AI tools, and project presentation.",
    category: "AI & Data",
    location: "Chattogram",
    date: "2026-08-08",
    price: 2200,
    accessType: "premium",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.7,
    capacity: 180,
    organizerName: "Data Club BD",
    tags: ["AI", "Career", "Portfolio"]
  },
  {
    _id: "seed-mongodb-api-day",
    title: "MongoDB API Builder Day",
    shortDescription: "Learn schema design, secure API routes, and backend architecture.",
    fullDescription: "A backend-focused event covering MongoDB schema design, authentication middleware, protected endpoints, aggregation ideas, and deployment-ready API structure.",
    category: "Web Development",
    location: "Sylhet",
    date: "2026-08-14",
    price: 1200,
    accessType: "free",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.8,
    capacity: 90,
    organizerName: "Backend Builders Community",
    tags: ["MongoDB", "Express", "API"]
  },
  {
    _id: "seed-uiux-portfolio",
    title: "UI/UX Portfolio Review",
    shortDescription: "Design mentors review portfolios and give practical improvement guidance.",
    fullDescription: "A community session where designers and mentors help learners improve case studies, visual hierarchy, accessibility, and presentation confidence.",
    category: "UI/UX Design",
    location: "Online",
    date: "2026-08-20",
    price: 0,
    accessType: "free",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.6,
    capacity: 75,
    organizerName: "Design Practice Lab",
    tags: ["UI", "UX", "Portfolio"]
  },
  {
    _id: "seed-frontend-interview",
    title: "Frontend Interview Practice Night",
    shortDescription: "Practice React, TypeScript, coding problem solving, and communication.",
    fullDescription: "A friendly interview-practice event where junior developers solve frontend tasks, explain code decisions, and receive feedback from mentors.",
    category: "Career",
    location: "Dhaka",
    date: "2026-09-03",
    price: 800,
    accessType: "free",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.5,
    capacity: 60,
    organizerName: "Career Sprint BD",
    tags: ["Interview", "React", "Career"]
  },
  {
    _id: "seed-recharts-data-viz",
    title: "Data Visualization with Recharts",
    shortDescription: "Build beautiful charts and dashboards using React and Recharts.",
    fullDescription: "A practical online event about building dashboard charts, preparing frontend-friendly data, and explaining metrics clearly to users.",
    category: "AI & Data",
    location: "Online",
    date: "2026-09-09",
    price: 900,
    accessType: "premium",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.7,
    capacity: 100,
    organizerName: "Analytics School Online",
    tags: ["Recharts", "Data", "Dashboard"]
  },
  {
    _id: "seed-tailwind-design",
    title: "Tailwind CSS Design Sprint",
    shortDescription: "Create responsive layouts, consistent cards, and clean dark mode UI.",
    fullDescription: "A fast-paced design sprint for developers who want to build polished interfaces with consistent spacing, responsive cards, and maintainable Tailwind utility patterns.",
    category: "UI/UX Design",
    location: "Dhaka",
    date: "2026-09-15",
    price: 1000,
    accessType: "free",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.6,
    capacity: 85,
    organizerName: "Design Practice Lab",
    tags: ["Tailwind", "Design", "Responsive"]
  },
  {
    _id: "seed-startup-networking",
    title: "Startup Tech Networking Meetup",
    shortDescription: "Meet founders, junior developers, mentors, and hiring teams.",
    fullDescription: "A relaxed community meetup for learners, founders, and hiring teams to connect around startup projects, internships, career paths, and collaboration opportunities.",
    category: "Career",
    location: "Chattogram",
    date: "2026-09-21",
    price: 0,
    accessType: "free",
    status: "approved",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.4,
    capacity: 140,
    organizerName: "Startup Connect Bangladesh",
    tags: ["Networking", "Startup", "Career"]
  }
];
