"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { verifySession, createProfile, generateUsername, ApiError } from "@/lib/api";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  editToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  registerAnonymous: () => Promise<{ username: string; editToken: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "edit_token";
const USERNAME_KEY = "username";
const LEGACY_PREFIX = "edit_token_";

const DEFAULT_PROFILE = {
  display_name: "My Profile",
  bio: "Welcome to my link collection",
  avatar: "👤",
  theme_color: "#3b82f6",
  background_color: "#ffffff",
};

/**
 * Attempt to recover a token that was saved under the old
 * `edit_token_<username>` key format.  If found, migrate it
 * to the new canonical `edit_token` and `username` keys, and clean up the old one.
 */
function migrateOldToken(): { token: string; username: string } | null {
  if (typeof window === "undefined") return null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LEGACY_PREFIX)) {
      const token = localStorage.getItem(key);
      const username = key.substring(LEGACY_PREFIX.length);
      if (token && username) {
        localStorage.setItem(STORAGE_KEY, token);
        localStorage.setItem(USERNAME_KEY, username);
        localStorage.removeItem(key);
        return { token, username };
      }
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Guard against double-invocations of registerAnonymous
  const registering = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      if (typeof window === "undefined") return;

      // 1. Read stored credentials
      let token = localStorage.getItem(STORAGE_KEY);
      let username = localStorage.getItem(USERNAME_KEY);

      // 2. Fallback: migrate any legacy key written by the old code
      if (!token || !username) {
        const migrated = migrateOldToken();
        if (migrated) {
          token = migrated.token;
          username = migrated.username;
        }
      }

      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const data = await verifySession(token);
        if (!cancelled) {
          const activeUsername = data.username || username;
          if (activeUsername) {
            localStorage.setItem(USERNAME_KEY, activeUsername);
            setUser({ username: activeUsername });
          }
          setEditToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        
        // Only clear the token if the server explicitly rejected it (e.g. 401/403/404)
        // If it's a network error ("Failed to fetch"), keep the token and stay logged out (or show error)
        // so we don't lose the user's session just because the backend is temporarily down.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(USERNAME_KEY);
          if (!cancelled) {
            setUser(null);
            setEditToken(null);
            setIsAuthenticated(false);
          }
        } else {
          // Network error or backend offline: preserve credentials in localStorage,
          // but populate user state so we don't automatically overwrite the session
          // with a new anonymous user when Dashboard loads.
          if (!cancelled && username) {
            setUser({ username });
            setEditToken(token);
            setIsAuthenticated(true); // Treat as authenticated to allow Dashboard to load profile and show retry screen on fetch failure
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await verifySession(token);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, token);
        localStorage.setItem(USERNAME_KEY, data.username);
      }
      setUser({ username: data.username });
      setEditToken(token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login verification failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USERNAME_KEY);
    }
    setUser(null);
    setEditToken(null);
    setIsAuthenticated(false);
  }, []);

  const registerAnonymous = useCallback(
    async (): Promise<{ username: string; editToken: string }> => {
      // Prevent concurrent or repeated registration calls
      if (registering.current) {
        return new Promise(() => {}); // hang; first call will resolve the state
      }
      registering.current = true;

      setIsLoading(true);
      try {
        const username = generateUsername();
        const created = await createProfile({ username, ...DEFAULT_PROFILE });
        const token = String(created.edit_token ?? "");

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, token);
          localStorage.setItem(USERNAME_KEY, username);
        }

        setUser({ username });
        setEditToken(token);
        setIsAuthenticated(true);

        return { username, editToken: token };
      } catch (error) {
        console.error("Anonymous registration failed:", error);
        registering.current = false; // allow retry on genuine error
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        editToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        registerAnonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
