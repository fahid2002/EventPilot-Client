"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { Role } from "@/types";

const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || "demo@eventpilot.dev";
const demoPassword = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || "Demo@123";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ email, password, role });
      login(response.data.user, response.data.token);
      showToast("Login successful. Welcome back.", "success");
      router.push("/dashboard");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setRole("user");
    setEmail(demoEmail);
    setPassword(demoPassword);
    showToast("Demo credentials filled. Demo users can browse but cannot save, attend, review, or pay.", "info");
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="font-black text-brand-600">Authentication</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Login to EventPilot</h1>
        <p className="mt-4 max-w-xl leading-8 text-slate-600 dark:text-slate-300">Choose the same role you registered with. User and organizer accounts are separate, even when they use the same email. Admin signs in with email and password only.</p>
        <div className="mt-8 rounded-[2rem] bg-slate-950 p-7 text-white">
          <h3 className="text-xl font-black">Demo account</h3>
          <p className="mt-3 text-slate-300">Email: {demoEmail}</p>
          <p className="text-slate-300">Password: {demoPassword}</p>
          <p className="mt-3 text-slate-400">The demo account is view-only for safe public preview.</p>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black">Welcome back</h2>
        <div className="mt-6">
          <label className="block text-sm font-black">Login as</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["user", "organizer", "admin"] as Role[]).map((option) => (
              <button key={option} type="button" onClick={() => setRole(option)} className={`h-11 rounded-2xl border px-3 text-sm font-black capitalize ${role === option ? "border-transparent bg-gradient-to-r from-brand-600 to-mint-500 text-white" : "border-slate-200 dark:border-slate-800"}`}>{option}</button>
            ))}
          </div>
        </div>
        {role !== "admin" ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) {
                  showToast("Google login did not return a credential.", "error");
                  return;
                }
                try {
                  const response = await api.googleLogin(credentialResponse.credential, role);
                  login(response.data.user, response.data.token);
                  showToast("Google login successful.", "success");
                  router.push("/dashboard");
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Google login failed.";
                  showToast(message, "error");
                  if (message.toLowerCase().includes("register first") || message.toLowerCase().includes("not registered")) {
                    window.setTimeout(() => router.push("/register"), 1200);
                  }
                }
              }}
              onError={() => showToast("Google login failed. Check your Google client ID.", "error")}
              text="continue_with"
              width="100%"
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">Admin login uses email and password only.</div>
        )}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-black text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>
        <label className="block text-sm font-black">Email address</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="fahid@example.com" />
        <label className="mt-4 block text-sm font-black">Password</label>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Enter your password" />
        <button type="button" onClick={fillDemo} className="mt-5 w-full rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">Demo login auto-fill</button>
        <button disabled={loading} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-mint-500 px-5 py-3 font-black text-white disabled:opacity-60">Login</button>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link href="/register" className="font-black text-brand-600">Create an account</Link></p>
      </form>
    </section>
  );
}
