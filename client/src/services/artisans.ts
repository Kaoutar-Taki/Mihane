import type { Category } from "./categories";
import type { Profession } from "./professions";
import type { User } from "./users";

export type ArtisanProfile = {
  id: number;
  user_id: number;
  profession_id?: number | null;
  category_id?: number | null;
  title_ar: string;
  title_fr?: string | null;
  description_ar?: string | null;
  description_fr?: string | null;
  gallery?: string[] | null;
  social?: { facebook?: string; instagram?: string; website?: string } | null;
  availability?: { hours?: string[]; days?: string[] } | null;
  address_ar?: string | null;
  address_fr?: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  verify_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: Pick<User, 'id'|'name'|'email'|'role'>;
  profession?: Pick<Profession, 'id'|'name_ar'|'name_fr'> | null;
  category?: Pick<Category, 'id'|'name_ar'|'name_fr'> | null;
};

export type ArtisanPayload = {
  user_id: number;
  profession_id?: number | null;
  category_id?: number | null;
  title_ar: string;
  title_fr?: string | null;
  description_ar?: string | null;
  description_fr?: string | null;
  gallery?: string[];
  social?: { facebook?: string; instagram?: string; website?: string };
  availability?: { hours?: string[]; days?: string[] };
  address_ar?: string | null;
  address_fr?: string | null;
  visibility?: 'PUBLIC' | 'PRIVATE';
  verify_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
};

const API_BASE = (
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL?.replace(/\/$/, "")
) ?? "http://localhost:8000/api";

function authHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    const safeParse = <T,>(val: string): T | null => {
      try { return JSON.parse(atob(val)) as T; } catch { try { return JSON.parse(val) as T; } catch { return null; } }
    };
    const parsed = saved ? safeParse<{ token?: string }>(saved) : null;
    const token = parsed?.token ?? localStorage.getItem('token') ?? '';
    const h: Record<string, string> = { Accept: 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  } catch {
    return { Accept: 'application/json' };
  }
}

export async function getArtisans(status: 'active'|'archived'|'all'='active'): Promise<ArtisanProfile[]> {
  const res = await fetch(`${API_BASE}/artisans?status=${encodeURIComponent(status)}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load artisans');
  return res.json();
}

export async function getArtisan(id: number): Promise<ArtisanProfile> {
  const res = await fetch(`${API_BASE}/artisans/${id}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load artisan');
  return res.json();
}

export async function createArtisan(payload: ArtisanPayload): Promise<ArtisanProfile> {
  const res = await fetch(`${API_BASE}/artisans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create artisan');
  return res.json();
}

export async function updateArtisan(id: number, payload: Partial<ArtisanPayload>): Promise<ArtisanProfile> {
  const res = await fetch(`${API_BASE}/artisans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update artisan');
  return res.json();
}

export async function deleteArtisan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/artisans/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to archive artisan');
}

export async function restoreArtisan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/artisans/${id}/restore`, { method: 'POST', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to restore artisan');
}

export async function forceDeleteArtisan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/artisans/${id}/force`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to delete artisan');
}
