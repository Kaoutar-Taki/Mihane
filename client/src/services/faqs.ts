export type Faq = {
  id: number;
  priority: number;
  is_active: boolean;
  question_ar: string;
  question_fr: string;
  answer_ar: string;
  answer_fr: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type FaqPayload = {
  priority: number;
  is_active?: boolean;
  question_ar: string;
  question_fr: string;
  answer_ar: string;
  answer_fr: string;
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

export async function getFaqs(status: 'active'|'archived'|'all'='active'): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/faqs?status=${encodeURIComponent(status)}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load FAQs');
  return res.json();
}

export async function getFaq(id: number): Promise<Faq> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to load FAQ');
  return res.json();
}

export async function createFaq(payload: FaqPayload): Promise<Faq> {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return res.json();
}

export async function updateFaq(id: number, payload: Partial<FaqPayload>): Promise<Faq> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update FAQ');
  return res.json();
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to archive FAQ');
}

export async function restoreFaq(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/faqs/${id}/restore`, { method: 'POST', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to restore FAQ');
}

export async function forceDeleteFaq(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/faqs/${id}/force`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error('Failed to delete FAQ');
}
