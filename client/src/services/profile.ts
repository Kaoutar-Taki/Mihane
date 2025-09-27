import type { User } from "../types";
import { getStoredAuth } from "./auth";

const API = import.meta.env.VITE_API_URL as string;

const ORIGIN = API.replace(/\/?api\/?$/i, "");

export function resolveAssetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return ORIGIN + path;
  return ORIGIN + "/" + path;
}

async function safe(res: Response) {
  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.message || JSON.stringify(data));
    } catch {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }
  return res.json();
}

export async function getProfile(token?: string): Promise<User> {
  const t = token ?? getStoredAuth()?.token;
  if (!t) throw new Error("Not authenticated");
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${t}` },
  });
  return safe(res);
}

export type UpdateProfileInput = Partial<Pick<User, "name" | "email">> & {
  name_ar?: string;
  phone?: string;
  bio?: string;
  bio_ar?: string;
  gender_id?: number | null;
  avatar?: string; 
  avatarFile?: File | null;
};

export async function updateProfile(input: UpdateProfileInput, token?: string): Promise<User> {
  const t = token ?? getStoredAuth()?.token;
  if (!t) throw new Error("Not authenticated");
  const fd = new FormData();
  Object.entries(input).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === "avatarFile" && v instanceof File) {
      fd.append("avatarFile", v);
    } else {
      fd.append(k, String(v));
    }
  });
  fd.append("_method", "PUT");
  const res = await fetch(`${API}/profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}` },
    body: fd,
  });
  return safe(res);
}

export type Gender = { id: number; key: string; name_ar: string; name?: string };
export async function getGenders(): Promise<Gender[]> {
  const res = await fetch(`${API}/genders`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
