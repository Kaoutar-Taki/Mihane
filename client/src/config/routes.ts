export const routes = {
  profession: (id: number, q?: { region?: number; city?: number }) => {
    const qs = new URLSearchParams();
    if (q?.region) qs.set("region", String(q.region));
    if (q?.city) qs.set("city", String(q.city));
    const s = qs.toString();
    return `/profession/${id}${s ? `?${s}` : ""}`;
  },
  city: (id: number) => `/city/${id}`,
  region: (id: number) => `/region/${id}`,
  profile: (id: number) => `/profile/${id}`,
};
