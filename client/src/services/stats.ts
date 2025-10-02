const API_BASE = (
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL?.replace(/\/$/, "")
) ?? "http://localhost:8000/api";

function authHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    const parseMaybe = <T,>(val: string): T | null => {
      try { return JSON.parse(atob(val)) as T; } catch { try { return JSON.parse(val) as T; } catch { return null; } }
    };
    const parsed = saved ? parseMaybe<{ token?: string }>(saved) : null;
    const token = parsed?.token ?? localStorage.getItem('token') ?? '';
    const h: Record<string, string> = { Accept: 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  } catch {
    return { Accept: 'application/json' };
  }
}

export type StatsOverview = {
  kpis: { totalUsers: number; verifiedArtisans: number; pendingRequests: number; criticalErrors: number };
  series: { dates: string[]; signups: number[]; profiles: number[] };
  regions: { region: string; visitors: number; growth: string }[];
};

export async function getOverview(): Promise<StatsOverview> {
  const res = await fetch(`${API_BASE}/stats/overview`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}
