export type Category = {
  id: number;
  name_ar: string;
  name_fr?: string | null;
  description_ar?: string | null;
  description_fr?: string | null;
  icon?: string | null;
  color?: string | null;
  is_active: boolean;
  display_order?: number | null;
  professions_count?: number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

import type { Profession } from "./professions";
export type CategoryDetail = Category & { professions: Profession[] };

export type CategoryPayload = {
  name_ar: string;
  name_fr?: string | null;
  description_ar?: string | null;
  description_fr?: string | null;
  icon?: string | null;
  color?: string | null;
  is_active?: boolean;
  display_order?: number | null;
  professionIds?: number[];
};

const API_BASE = (
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL?.replace(/\/$/, "")
) ?? "http://localhost:8000/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (token) {
    return { Accept: 'application/json', Authorization: `Bearer ${token}` };
  } else {
    return { Accept: 'application/json' };
  }
}

export async function getCategories(status: 'active'|'archived'|'all'='active'): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories?status=${encodeURIComponent(status)}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function getCategory(id: number): Promise<CategoryDetail> {
  const res = await fetch(`${API_BASE}/categories/${id}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load category');
  return res.json();
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to archive category');
}

export async function restoreCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}/restore`, { method: 'POST', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to restore category');
}

export async function forceDeleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}/force`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to delete category');
}
