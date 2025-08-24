import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "client" | "pro";

export interface AuthUser {
  readonly id: number;
  readonly name: string;
  readonly identifier: string;
  readonly role: Role;
  readonly avatar?: string;
  readonly verified: boolean;
  readonly createdAt: string;
}

interface AuthData {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresAt: number;
}

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (
    identifier: string,
    password: string,
    role: Role,
    remember?: boolean,
  ) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const saved =
          localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (saved) {
          const parsed = decryptData(saved) as AuthData;

          if (parsed?.expiresAt && Date.now() < parsed.expiresAt) {
            if (parsed?.user) {
              setUser(parsed.user);
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
    role,
    remember = true,
  ) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((r) => setTimeout(r, 500));

      const logged: AuthUser = {
        id: Date.now(),
        name: identifier.split("@")[0] || identifier,
        identifier,
        role,
        verified: true,
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier.split("@")[0] || identifier)}&background=f97316&color=fff`,
      };

      const authData: AuthData = {
        token: `demo_token_${Date.now()}`,
        refreshToken: `refresh_${Date.now()}`,
        user: logged,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      setUser(logged);
      const store = remember ? localStorage : sessionStorage;
      store.setItem("auth", encryptData(authData));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطأ في تسجيل الدخول";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  const clearError = () => {
    setError(null);
  };

  const value = useMemo(
    () => ({ user, loading, error, signIn, signOut, clearError }),
    [user, loading, error],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
