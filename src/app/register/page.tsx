"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("Fahid Hasan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const previewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(String(reader.result));
    reader.readAsDataURL(file);
    showToast("Photo selected. It will be shown on your profile after registration.", "success");
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Password and confirm password do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await api.register({ name, email, password, photoUrl });
      login(response.data.user, response.data.token);
      showToast("Account created successfully.", "success");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed.";
      showToast(message, "error");
      if (message.toLowerCase().includes("already")) {
        window.setTimeout(() => router.push("/login"), 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <p className="font-black text-brand-600">Registration</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Create your EventPilot account</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Photo is optional. New accounts start as free users. Admin can upgrade accounts to organizer, and the payment page can upgrade membership to premium.</p>

        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-slate-200 text-4xl text-slate-500 dark:bg-slate-700">
            {photoUrl ? <img src={photoUrl} alt="Selected profile" className="h-full w-full object-cover" /> : "👤"}
          </div>
          <div>
            <label className="inline-flex cursor-pointer items-center rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">
              Browse Photo
              <input type="file" accept="image/*" className="hidden" onChange={previewPhoto} />
            </label>
            <p className="mt-2 text-sm text-slate-500">A neutral avatar appears if no photo is selected.</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-black">Full Name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Fahid Hasan" />
          </div>
          <div>
            <label className="text-sm font-black">Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="fahid@example.com" />
          </div>
          <div>
            <label className="text-sm font-black">Password</label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Minimum 6 characters" />
          </div>
          <div>
            <label className="text-sm font-black">Confirm Password</label>
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Repeat password" />
          </div>
        </div>

        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60 dark:bg-white dark:text-slate-950">Create Account</button>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) {
                showToast("Google registration did not return a credential.", "error");
                return;
              }
              try {
                const response = await api.googleLogin(credentialResponse.credential);
                login(response.data.user, response.data.token);
                showToast("Google account connected successfully.", "success");
                router.push("/dashboard");
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Google registration failed.", "error");
              }
            }}
            onError={() => showToast("Google registration failed. Check your Google client ID.", "error")}
            width="100%"
          />
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-black text-brand-600">Login here</Link></p>
      </form>
    </section>
  );
}
