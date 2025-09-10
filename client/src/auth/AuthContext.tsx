import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { User, Permission, PermissionScope } from "../types";

export type Role = "SUPER_ADMIN" | "ADMIN" | "ARTISAN" | "CLIENT";

export interface AuthUser extends User {
  readonly permissions?: Permission[];
  readonly permissionScopes?: Record<Permission, PermissionScope>;
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
  signIn: (
    identifier: string,
    password: string,
    role?: Role,
    remember?: boolean,
  ) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  hasPermission: (permission: Permission, scope?: PermissionScope) => boolean;
  canAccess: (resource: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const encryptData = (data: any): string => {
  try {
    return btoa(JSON.stringify(data));
  } catch {
    return JSON.stringify(data);
  }
};

const decryptData = (encrypted: string): any => {
  try {
    return JSON.parse(atob(encrypted));
  } catch {
    return JSON.parse(encrypted);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  // Mock users data - in real app this would come from API
  const mockUsers: AuthUser[] = [
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const saved =
          localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (saved) {
          const parsed = decryptData(saved) as AuthData;

          if (parsed?.expiresAt && Date.now() < parsed.expiresAt) {
            if (parsed?.user && !parsed.twoFactorRequired) {
              setUser(parsed.user);
            } else if (parsed.twoFactorRequired) {
              setTwoFactorRequired(true);
            }
          } else {
            localStorage.removeItem("auth");
            sessionStorage.removeItem("auth");
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("auth");
        sessionStorage.removeItem("auth");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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

      // Find user by email
      const foundUser = mockUsers.find(u => u.email === identifier);
      
      if (!foundUser) {
        throw new Error(t("auth.errors.userNotFound", "المستخدم غير موجود"));
      }

      if (!foundUser.isActive) {
        throw new Error(t("auth.errors.accountDisabled", "الحساب معطل"));
      }

      // Check 2FA requirement for SUPER_ADMIN
      if (foundUser.role === "SUPER_ADMIN" && foundUser.twoFactorEnabled) {
        const authData: AuthData = {
          token: `pending_2fa_${Date.now()}`,
          refreshToken: `refresh_${Date.now()}`,
          user: foundUser,
          expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes for 2FA
          twoFactorRequired: true
        };

        const store = remember ? localStorage : sessionStorage;
        store.setItem("auth", encryptData(authData));
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
      store.setItem("auth", encryptData(authData));
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

      // Mock 2FA verification - accept "123456" as valid code
      if (code !== "123456") {
        throw new Error(t("auth.errors.invalid2FA", "رمز التحقق غير صحيح"));
      }

      const saved = localStorage.getItem("auth") || sessionStorage.getItem("auth");
      if (saved) {
        const parsed = decryptData(saved) as AuthData;
        if (parsed.twoFactorRequired) {
          const updatedAuthData: AuthData = {
            ...parsed,
            twoFactorRequired: false,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          };

          setUser(parsed.user);
          setTwoFactorRequired(false);
          
          const store = localStorage.getItem("auth") ? localStorage : sessionStorage;
          store.setItem("auth", encryptData(updatedAuthData));
        }
      }
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
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  const clearError = () => {
    setError(null);
  };

  const hasPermission = (permission: Permission, _scope?: PermissionScope): boolean => {
    if (!user) return false;
    
    // SUPER_ADMIN has all permissions
    if (user.role === "SUPER_ADMIN") return true;
    
    // ADMIN users check their specific permissions
    if (user.role === "ADMIN" && user.permissions) {
      return user.permissions.includes(permission);
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
      signIn, 
      verifyTwoFactor,
      signOut, 
      clearError,
      hasPermission,
      canAccess
    }),
    [user, loading, error, twoFactorRequired],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  const { t } = useTranslation();
  if (!ctx) throw new Error(t("auth.errors.contextError"));
  return ctx;
};
