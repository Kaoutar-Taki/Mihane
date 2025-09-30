export type User = {
  id: number;
  name: string;
  name_ar?: string | null;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ARTISAN' | 'CLIENT';
  phone?: string | null;
  avatar?: string | null;
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

export async function getUsers(status: 'active' | 'archived' | 'all' = 'active'): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users?status=${encodeURIComponent(status)}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function createUser(payload: { name: string; name_ar?: string; email: string; password: string; role: User['role']; phone?: string }): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id: number, payload: Partial<{ name: string; name_ar?: string; email: string; password?: string; role: User['role']; phone?: string }>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function restoreUser(id: number): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}/restore`, {
    method: 'POST',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to restore user');
  return res.json();
}

export async function forceDeleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}/force`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to permanently delete user');
}
