export type Role = "user" | "organizer" | "admin";
export type Membership = "free" | "premium";
export type EventAccess = "free" | "premium";
export type EventStatus = "pending" | "approved" | "rejected";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  membership: Membership;
  photoUrl?: string;
  isDemo?: boolean;
  status?: "active" | "blocked";
}

export interface EventItem {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: string;
  date: string;
  price: number;
  accessType: EventAccess;
  status: EventStatus;
  imageUrl: string;
  gallery: string[];
  rating: number;
  capacity: number;
  organizerName: string;
  organizerId?: string;
  tags: string[];
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardSummary {
  savedCount: number;
  attendingCount: number;
  reviewCount: number;
  recommendationCount: number;
  myEvents?: number;
  attendees?: number;
  revenue?: number;
  totalUsers?: number;
  totalEvents?: number;
  pendingEvents?: number;
  reports?: number;
}

export interface AdminUserCounts {
  users: number;
  organizers: number;
  total: number;
}
