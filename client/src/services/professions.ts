export type Profession = {
  id: number;
  name_ar: string;
  name_fr?: string | null;
  image?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

const API_BASE = (
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL?.replace(/\/$/, "")
) ?? "http://localhost:8000/api";

function authHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    const base: Record<string, string> = { Accept: 'application/json' };
    if (!saved) return base;
    const safeParse = <T,>(val: string): T | null => {
      try { return JSON.parse(atob(val)) as T; } catch { try { return JSON.parse(val) as T; } catch { return null; } }
    };
    const parsed = safeParse<{ token?: string }>(saved);
    const token = parsed?.token ?? "";
    if (token) base.Authorization = `Bearer ${token}`;
    return base;
  } catch {
    return { Accept: 'application/json' };
  }
}

export async function getProfessions(status: 'active' | 'archived' | 'all' = 'active'): Promise<Profession[]> {
  const res = await fetch(`${API_BASE}/professions?status=${encodeURIComponent(status)}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load professions');
  return res.json();
}

export async function createProfession(payload: { name_ar: string; name_fr?: string | null; image?: string | null }): Promise<Profession> {
  const res = await fetch(`${API_BASE}/professions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create profession');
  return res.json();
}

export async function updateProfession(id: number, payload: Partial<{ name_ar: string; name_fr?: string | null; image?: string | null }>): Promise<Profession> {
  const res = await fetch(`${API_BASE}/professions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update profession');
  return res.json();
}

export async function deleteProfession(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/professions/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to archive profession');
}

export async function restoreProfession(id: number): Promise<Profession> {
  const res = await fetch(`${API_BASE}/professions/${id}/restore`, { method: 'POST', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to restore profession');
  return res.json();
}

export async function forceDeleteProfession(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/professions/${id}/force`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to delete profession');
}

export async function uploadProfessionImage(id: number, file: File): Promise<{ image: string; profession: Profession }> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/professions/${id}/image`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}
