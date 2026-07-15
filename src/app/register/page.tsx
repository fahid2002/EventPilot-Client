"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { Role } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("Fahid Hasan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState<Exclude<Role, "admin">>("user");
  const [loading, setLoading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const previewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(String(reader.result));
    reader.readAsDataURL(file);
    showToast("Photo selected. It will be shown on your profile after registration.", "success");
  };

  const removePhoto = () => {
    setPhotoUrl("");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
    showToast("Selected photo removed. You can register with the default avatar.", "success");
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
      const response = await api.register({ name, email, password, photoUrl, role });
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
        <p className="mt-3 text-slate-600 dark:text-slate-300">Choose whether this account is for a user or organizer. Admin accounts are created only from the server seed credentials.</p>

        <div className="mt-7">
          <label className="block text-sm font-black">Register as</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["user", "organizer"] as Array<Exclude<Role, "admin">>).map((option) => (
              <button key={option} type="button" onClick={() => setRole(option)} className={`h-12 rounded-2xl border px-4 font-black capitalize ${role === option ? "border-transparent bg-gradient-to-r from-brand-600 to-mint-500 text-white" : "border-slate-200 dark:border-slate-800"}`}>{option}</button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-slate-200 text-4xl text-slate-500 dark:bg-slate-700">
            {photoUrl ? <img src={photoUrl} alt="Selected profile" className="h-full w-full object-cover" /> : "👤"}
          </div>
          <div>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-2xl border border-slate-200 px-5 py-3 font-black dark:border-slate-800">
                Browse Photo
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={previewPhoto} />
              </label>
              {photoUrl ? (
                <button type="button" onClick={removePhoto} className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-500 dark:border-red-900">
                  Remove Photo
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-500">A neutral avatar appears if no photo is selected. If registration says the request is too large, remove the photo and try again.</p>
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
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Enter your password" />
          </div>
          <div>
            <label className="text-sm font-black">Confirm Password</label>
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950" placeholder="Confirm your password" />
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
                const response = await api.googleRegister(credentialResponse.credential, role);
                login(response.data.user, response.data.token);
                showToast("Google account connected successfully.", "success");
                router.push("/dashboard");
              } catch (error) {
                const message = error instanceof Error ? error.message : "Google registration failed.";
                showToast(message, "error");
                if (message.toLowerCase().includes("already")) {
                  window.setTimeout(() => router.push("/login"), 1200);
                }
              }
            }}
            onError={() => showToast("Google registration failed. Check your Google client ID.", "error")}
            text="continue_with"
            width="100%"
          />
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-black text-brand-600">Login here</Link></p>
      </form>
    </section>
  );
}
