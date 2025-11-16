import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getStoredAuth } from "../services/auth";
import type { User, Permission, PermissionScope } from "../types";

const AUTH_STORAGE_KEY = "auth" as const;
type ViteMeta = { env?: { VITE_USE_MOCK_AUTH?: string } };
const USE_MOCK_AUTH = ((import.meta as unknown as ViteMeta).env?.VITE_USE_MOCK_AUTH) === "true";

export type Role = "SUPER_ADMIN" | "ADMIN" | "ARTISAN" | "CLIENT";

export interface AuthUser extends User {
  readonly permissions?: Permission[];
  readonly permissionScopes?: Record<Permission, PermissionScope>;
  readonly twoFactorEnabled?: boolean;
}

interface AuthData {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresAt: number;
  twoFactorRequired?: boolean;
}

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  twoFactorRequired: boolean;
  isAuthenticated: boolean;
  signIn: (
    identifier: string,
    password: string,
    role?: Role,
    remember?: boolean,
  ) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  hasPermission: (permission: Permission, scope?: PermissionScope) => boolean;
  canAccess: (resource: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

function encryptData<T>(data: T): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch {
    return JSON.stringify(data);
  }
}

function decryptData<T>(encrypted: string): T | null {
  try {
    const json = decodeURIComponent(escape(atob(encrypted)));
    return JSON.parse(json) as T;
  } catch {
    try {
      return JSON.parse(encrypted) as T;
    } catch {
      return null;
    }
  }
}

const MOCK_USERS: Readonly<AuthUser[]> = [
    {
      id: 1,
      name: "Super Admin",
      email: "admin@digitalcard.ma",
      role: "SUPER_ADMIN",
      phone: "+212600000000",
      bio: "مدير النظام مع صلاحيات كاملة",
      avatar: "/assets/avatars/admin.jpg",
      isActive: true,
      lastLoginAt: "2025-08-25T12:30:00Z",
      createdAt: "2025-08-25T10:00:00Z",
      language: "ar",
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 2,
      name: "Ahmed Benali",
      email: "ahmed.benali@example.com",
      role: "ARTISAN",
      phone: "+212661234567",
      bio: "حِرفي فخار مع 20 سنة خبرة",
      avatar: "/assets/avatars/ahmed.jpg",
      isActive: true,
      lastLoginAt: "2025-08-25T11:45:00Z",
      createdAt: "2025-08-25T09:00:00Z",
      language: "ar",
      emailVerified: true
    },
    {
      id: 3,
      name: "Fatima Zahra",
      email: "fatima.zahra@example.com",
      role: "CLIENT",
      phone: "+212662345678",
      bio: "مهتمة بالحرف التقليدية المغربية",
      avatar: "/assets/avatars/fatima.jpg",
      isActive: true,
      lastLoginAt: "2025-08-25T12:00:00Z",
      createdAt: "2025-08-25T08:30:00Z",
      language: "ar",
      emailVerified: true
    }
  ];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      try {
        const stored = getStoredAuth();
        if (stored && stored.user && stored.token) {
          setUser(stored.user as AuthUser);
          setTwoFactorRequired(false);
          setLoading(false);
          return;
        }

        const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = decryptData<AuthData>(saved);
            if (parsed?.expiresAt && Date.now() < parsed.expiresAt) {
              if (parsed?.user && !parsed.twoFactorRequired) {
                setUser(parsed.user);
              } else if (parsed.twoFactorRequired) {
                setTwoFactorRequired(true);
              }
            } else {
              localStorage.removeItem(AUTH_STORAGE_KEY);
              sessionStorage.removeItem(AUTH_STORAGE_KEY);
            }
          } catch {
            // 
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const onStorage = () => initAuth();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn: AuthContextType["signIn"] = async (
    identifier,
    _password,
    _role,
    remember = true,
  ) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((r) => setTimeout(r, 500));
      if (USE_MOCK_AUTH) {
        const foundUser = MOCK_USERS.find(u => u.email === identifier);
        if (!foundUser) {
          throw new Error(t("auth.errors.userNotFound", "المستخدم غير موجود"));
        }
        if (!foundUser.isActive) {
          throw new Error(t("auth.errors.accountDisabled", "الحساب معطل"));
        }
        if (foundUser.role === "SUPER_ADMIN" && foundUser.twoFactorEnabled) {
          const authData: AuthData = {
            token: `pending_2fa_${Date.now()}`,
            refreshToken: `refresh_${Date.now()}`,
            user: foundUser,
            expiresAt: Date.now() + 10 * 60 * 1000,
            twoFactorRequired: true
          };
          const store = remember ? localStorage : sessionStorage;
          store.setItem(AUTH_STORAGE_KEY, encryptData(authData));
          setTwoFactorRequired(true);
          return;
        }
        const authData: AuthData = {
          token: `demo_token_${Date.now()}`,
          refreshToken: `refresh_${Date.now()}`,
          user: foundUser,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        setUser(foundUser);
        const store = remember ? localStorage : sessionStorage;
        store.setItem(AUTH_STORAGE_KEY, encryptData(authData));
        return;
      }

      throw new Error(t("auth.errors.signInError", "تعذر تسجيل الدخول: فعّل VITE_USE_MOCK_AUTH أو اربط بالـ API"));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("auth.errors.signInError");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactor: AuthContextType["verifyTwoFactor"] = async (code) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((r) => setTimeout(r, 500));
      if (USE_MOCK_AUTH) {
        if (code !== "123456") {
          throw new Error(t("auth.errors.invalid2FA", "رمز التحقق غير صحيح"));
        }
        const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          const parsed = decryptData<AuthData>(saved);
          if (parsed && parsed.twoFactorRequired) {
            const updatedAuthData: AuthData = {
              ...parsed,
              twoFactorRequired: false,
              expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            };
            setUser(parsed.user);
            setTwoFactorRequired(false);
            const store = localStorage.getItem(AUTH_STORAGE_KEY) ? localStorage : sessionStorage;
            store.setItem(AUTH_STORAGE_KEY, encryptData(updatedAuthData));
          }
        }
        return;
      }

      throw new Error(t("auth.errors.2FAError", "تحقق بخطوتين غير مفعّل بعد: فعّل VITE_USE_MOCK_AUTH أو اربط بالـ API"));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("auth.errors.2FAError");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    setTwoFactorRequired(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser: AuthContextType["updateUser"] = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch } as AuthUser;
      const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = decryptData<AuthData>(saved);
        if (parsed) {
          const updated: AuthData = { ...parsed, user: next };
          const store = localStorage.getItem(AUTH_STORAGE_KEY) ? localStorage : sessionStorage;
          store.setItem(AUTH_STORAGE_KEY, encryptData(updated));
        }
      }
      return next;
    });
  };

  const clearError = () => {
    setError(null);
  };

  const hasPermission = (permission: Permission, scope?: PermissionScope): boolean => {
    if (!user) return false;

    if (user.role === "SUPER_ADMIN") return true;

    if (user.role === "ADMIN" && user.permissions?.includes(permission)) {
      if (!scope) return true;
      const allowed = user.permissionScopes?.[permission];
      if (!allowed) return false;
      const allowedRec = allowed as unknown as Record<string, unknown>;
      const scopeRec = scope as unknown as Record<string, unknown>;
      return Object.keys(scopeRec).every((k) => allowedRec[k] === scopeRec[k]);
    }

    return false;
  };

  const canAccess = (resource: string): boolean => {
    if (!user) return false;

    const roleAccess: Record<Role, string[]> = {
      SUPER_ADMIN: ["/admin", "/artisan", "/client", "/"],
      ADMIN: ["/admin", "/"],
      ARTISAN: ["/artisan", "/chat", "/"],
      CLIENT: ["/client", "/chat", "/review", "/"]
    };

    const allowedRoutes = roleAccess[user.role] || [];
    return allowedRoutes.some(route => resource.startsWith(route));
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      twoFactorRequired,
      isAuthenticated: !!user,
      signIn,
      verifyTwoFactor,
      signOut,
      clearError,
      updateUser,
      hasPermission,
      canAccess,
    }),
    [user, loading, error, twoFactorRequired, signIn, verifyTwoFactor],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  const { t } = useTranslation();
  if (!ctx) throw new Error(t("auth.errors.contextError"));
  return ctx;
};
