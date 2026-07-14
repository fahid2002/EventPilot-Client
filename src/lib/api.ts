import type { ApiResponse, EventItem, User, DashboardSummary, Role } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data as ApiResponse<T>;
}

export const api = {
  getEvents: (query = "") => request<{ events: EventItem[]; total: number; page: number; pages: number }>(`/events${query}`),
  getEvent: (id: string) => request<{ event: EventItem }>(`/events/${id}`),
  login: (payload: { email: string; password: string; role: Role }) => request<{ user: User; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: { name: string; email: string; password: string; photoUrl?: string; role: Exclude<Role, "admin"> }) => request<{ user: User; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  googleLogin: (credential: string, role: Exclude<Role, "admin">) => request<{ user: User; token: string }>("/auth/google", { method: "POST", body: JSON.stringify({ credential, role }) }),
  googleRegister: (credential: string, role: Exclude<Role, "admin">) => request<{ user: User; token: string }>("/auth/google/register", { method: "POST", body: JSON.stringify({ credential, role }) }),
  me: (token: string) => request<{ user: User }>("/auth/me", { token }),
  dashboard: (token: string) => request<{ summary: DashboardSummary; saved: EventItem[]; attending: EventItem[]; recommended: EventItem[] }>("/users/dashboard", { token }),
  saveEvent: (eventId: string, token: string) => request<{ saved: boolean }>(`/users/saved/${eventId}`, { method: "POST", token }),
  attendEvent: (eventId: string, token: string) => request<{ attending: boolean; redirectToPayment?: boolean }>(`/users/attend/${eventId}`, { method: "POST", token }),
  reviewWebsite: (payload: { rating: number; comment: string }, token: string) => request<{ reviewId: string }>("/users/reviews", { method: "POST", token, body: JSON.stringify(payload) }),
  manageEvents: (token: string) => request<{ events: EventItem[] }>("/events/manage/list", { token }),
  addEvent: (payload: Partial<EventItem>, token: string) => request<{ event: EventItem }>("/events", { method: "POST", token, body: JSON.stringify(payload) }),
  deleteEvent: (id: string, token: string) => request<{ deleted: boolean }>(`/events/${id}`, { method: "DELETE", token }),
  createCheckout: (eventId: string, token: string) => request<{ url: string }>(`/payments/checkout/${eventId}`, { method: "POST", token }),
  demoUpgrade: (eventId: string, token: string) => request<{ user: User; attending: boolean }>(`/payments/demo-upgrade/${eventId}`, { method: "POST", token }),
  adminPendingEvents: (token: string) => request<{ events: EventItem[] }>("/admin/events/pending", { token }),
  adminUpdateEventStatus: (eventId: string, status: "approved" | "rejected", token: string) => request<{ event: EventItem }>(`/admin/events/${eventId}/status`, { method: "PATCH", token, body: JSON.stringify({ status }) })
};

export { API_URL };
