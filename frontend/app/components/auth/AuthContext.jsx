"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAPI } from "../../../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "cashive_token";
const USER_KEY = "cashive_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify the stored token

  // On mount — restore session from localStorage and verify with the server
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        setUser(data);
      } catch {
        // Token expired or invalid — clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  /**
   * Login — calls POST /api/auth/login, stores token + user in localStorage.
   * Returns { success, error }.
   */
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      return { success: false, error: message };
    }
  }, []);

  /**
   * Register — calls POST /api/auth/register, stores token + user.
   * Returns { success, error }.
   */
  const register = useCallback(async (name, email, password, role) => {
    try {
      const { data } = await authAPI.register({ name, email, password, role });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, error: message };
    }
  }, []);

  /**
   * Logout — clears token and user from state + localStorage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
