const API = import.meta.env.VITE_API_URL as string;
import type { User } from "../types";

export type AuthResponse = {
  user: User;
  token: string;
};

export type StoredAuth = {
  token: string;
  user: User;
  expiresAt: number;
  refreshToken?: string;
};

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message || JSON.stringify(data);
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

export async function apiRegister(params: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'CLIENT' | 'ARTISAN';
}): Promise<AuthResponse> {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(await safeError(res));
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await safeError(res));
  return res.json();
}

export async function apiMe(token: string): Promise<User> {
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await safeError(res));
  return res.json() as Promise<User>;
}

export async function apiLogout(token: string): Promise<void> {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await safeError(res));
}

export function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function clearStoredAuth(): void {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");
}
