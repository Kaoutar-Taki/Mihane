export type City = { id: number; name_ar: string; name_fr: string; region_id: number; region_name?: string };

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

export async function getCities(status: 'active' | 'archived' | 'all' = 'active'): Promise<City[]> {
  try {
    const res = await fetch(`${API_BASE}/cities?status=${encodeURIComponent(status)}`);
    if (!res.ok) throw new Error("bad");
    type CityApi = { id: number | string; name_ar?: string; name_fr?: string; ar?: string; fr?: string; region_id?: number | string; region?: { id?: number|string; name_ar?: string; name_fr?: string } };
    const items = (await res.json()) as CityApi[];
    return items.map((c) => ({
      id: Number(c.id),
      name_ar: String(c.name_ar ?? c.ar ?? ""),
      name_fr: String(c.name_fr ?? c.fr ?? ""),
      region_id: Number(c.region_id ?? c.region?.id ?? 0),
      region_name: String(c.region?.name_ar ?? ""),
    }));
  } catch {
    return [];
  }
}

export async function createCity(payload: Omit<City, "id" | "region_name">): Promise<City> {
  const res = await fetch(`${API_BASE}/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name_ar: payload.name_ar, name_fr: payload.name_fr, region_id: payload.region_id })
  });
  if (!res.ok) throw new Error("Failed to create city");
  return res.json();
}

export async function updateCity(id: number, payload: Partial<Omit<City, "id" | "region_name">>): Promise<City> {
  const res = await fetch(`${API_BASE}/cities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update city");
  return res.json();
}

export async function deleteCity(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/cities/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to delete city");
}

export async function restoreCity(id: number): Promise<City> {
  const res = await fetch(`${API_BASE}/cities/${id}/restore`, { method: "POST", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to restore city");
  return res.json();
}

export async function forceDeleteCity(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/cities/${id}/force`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to permanently delete city");
}
