export type Gender = {
  id: number;
  key: string;
  name_ar: string;
  name_fr?: string | null;
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
    if (!saved) return { Accept: 'application/json' };
    const safeParse = <T,>(val: string): T | null => {
      try { return JSON.parse(atob(val)) as T; } catch { try { return JSON.parse(val) as T; } catch { return null; } }
    };
    const parsed = safeParse<{ token?: string }>(saved);
    const token = parsed?.token ?? "";
    const h: Record<string, string> = { Accept: 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  } catch {
    return { Accept: 'application/json' };
  }
}

export async function getGenders(status: 'active' | 'archived' | 'all' = 'active'): Promise<Gender[]> {
  const res = await fetch(`${API_BASE}/genders?status=${encodeURIComponent(status)}` , { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load genders');
  return res.json();
}

export async function createGender(payload: { key: string; name_ar: string; name_fr?: string | null }): Promise<Gender> {
  const res = await fetch(`${API_BASE}/genders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create gender');
  return res.json();
}

export async function updateGender(id: number, payload: Partial<{ key: string; name_ar: string; name_fr?: string | null }>): Promise<Gender> {
  const res = await fetch(`${API_BASE}/genders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update gender');
  return res.json();
}

export async function deleteGender(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/genders/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to archive gender');
}

export async function restoreGender(id: number): Promise<Gender> {
  const res = await fetch(`${API_BASE}/genders/${id}/restore`, {
    method: 'POST',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to restore gender');
  return res.json();
}

export async function forceDeleteGender(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/genders/${id}/force`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete gender');
}
