export type Region = { id: number; name_ar: string; name_fr: string };

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

export async function getRegions(status: 'active' | 'archived' | 'all' = 'active'): Promise<Region[]> {
  try {
    const res = await fetch(`${API_BASE}/regions?status=${encodeURIComponent(status)}`);
    if (!res.ok) throw new Error("bad");
    type RegionApi = { id: number | string; name_ar?: string; name_fr?: string; ar?: string; fr?: string };
    const items = (await res.json()) as RegionApi[];
    return items.map((r) => ({
      id: Number(r.id),
      name_ar: String(r.name_ar ?? r.ar ?? ""),
      name_fr: String(r.name_fr ?? r.fr ?? ""),
    }));
  } catch {
    const local = await import("../data/moroccan-regions.json");
    return (local.default as Array<{ id: number; ar: string; fr: string }>).map((r) => ({ id: r.id, name_ar: r.ar, name_fr: r.fr }));
  }
}

export async function createRegion(payload: Omit<Region, "id">): Promise<Region> {
  const res = await fetch(`${API_BASE}/regions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name_ar: payload.name_ar, name_fr: payload.name_fr })
  });
  if (!res.ok) throw new Error("Failed to create region");
  return res.json();
}

export async function updateRegion(id: number, payload: Partial<Omit<Region, "id">>): Promise<Region> {
  const res = await fetch(`${API_BASE}/regions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update region");
  return res.json();
}

export async function deleteRegion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/regions/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("Failed to delete region");
}

export async function restoreRegion(id: number): Promise<Region> {
  const res = await fetch(`${API_BASE}/regions/${id}/restore`, {
    method: "POST",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("Failed to restore region");
  return res.json();
}

export async function forceDeleteRegion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/regions/${id}/force`, {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("Failed to permanently delete region");
}
