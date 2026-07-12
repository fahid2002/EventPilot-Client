"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ActionGuardProvider } from "@/contexts/ActionGuardContext";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-google-client-id";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ToastProvider>
        <AuthProvider>
          <ActionGuardProvider>{children}</ActionGuardProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
