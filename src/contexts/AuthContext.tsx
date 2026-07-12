"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";
import { api } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (nextUser: User, nextToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "eventpilot_token";
const USER_KEY = "eventpilot_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }

    setIsReady(true);
  }, []);

  const login = (nextUser: User, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const refreshUser = async () => {
    if (!token) return;
    const response = await api.me(token);
    setUser(response.data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isReady,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    refreshUser,
    setUser
  }), [user, token, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
