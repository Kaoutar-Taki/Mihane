import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useQueryParams<T extends string>(keys: T[]) {
  const [sp, setSp] = useSearchParams();
  const values = useMemo(() => {
    const out: Record<string, string | null> = {};
    keys.forEach((k) => (out[k] = sp.get(k) ?? null));
    return out as Record<T, string | null>;
  }, [sp, keys]);

  const setMany = (obj: Partial<Record<T, string | null>>) => {
    const next = new URLSearchParams(sp);
    Object.entries(obj).forEach(([k, v]) => {
      if (!v) next.delete(k);
      else next.set(k, v as string);
    });
    setSp(next, { replace: true });
  };

  return { values, setMany, raw: sp };
}
