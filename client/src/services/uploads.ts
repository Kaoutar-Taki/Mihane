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

export async function uploadImages(files: File[], folder = 'artisans'): Promise<string[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files[]', f));
  form.append('folder', folder);

  const res = await fetch(`${API_BASE}/uploads/images`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  const data = await res.json();
  return data.paths as string[];
}
