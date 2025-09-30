export type Testimonial = {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: { id: number; name: string; email: string } | null;
};

const API_BASE = (
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL?.replace(/\/$/, "")
) ?? "http://localhost:8000/api";

function authHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (!saved) return {};
    const safeParse = <T,>(val: string): T | null => {
      try { return JSON.parse(atob(val)) as T; } catch { try { return JSON.parse(val) as T; } catch { return null; } }
    };
    const parsed = safeParse<{ token?: string }>(saved);
    const token = parsed?.token ?? "";
    const h: Record<string, string> = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  } catch {
    return {};
  }
}

export async function getTestimonials(status: 'active' | 'archived' | 'all' = 'active'): Promise<Testimonial[]> {
  const url = `${API_BASE}/testimonials?status=${encodeURIComponent(status)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load testimonials');
  return res.json();
}

export async function createTestimonial(payload: { user_id: number; rating: number; comment: string; is_approved?: boolean }): Promise<Testimonial> {
  const res = await fetch(`${API_BASE}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create testimonial');
  return res.json();
}

export async function updateTestimonial(id: number, payload: Partial<{ user_id: number; rating: number; comment: string; is_approved: boolean }>): Promise<Testimonial> {
  const res = await fetch(`${API_BASE}/testimonials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update testimonial');
  return res.json();
}

export async function deleteTestimonial(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE', headers: { Accept: 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to delete testimonial');
}

export async function restoreTestimonial(id: number): Promise<Testimonial> {
  const res = await fetch(`${API_BASE}/testimonials/${id}/restore`, { method: 'POST', headers: { Accept: 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to restore testimonial');
  return res.json();
}

export async function forceDeleteTestimonial(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/testimonials/${id}/force`, { method: 'DELETE', headers: { Accept: 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to permanently delete testimonial');
}
