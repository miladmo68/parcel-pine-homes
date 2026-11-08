import { useEffect, useState } from "react";

export function usePersistentIds(key: string) {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(window.localStorage.getItem(key) || "[]"); } catch { return []; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(ids)); }, [ids, key]);
  const toggle = (id: string, limit = Number.POSITIVE_INFINITY) => setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < limit ? [...current, id] : current);
  const remove = (id: string) => setIds((current) => current.filter((item) => item !== id));
  const clear = () => setIds([]);
  return { ids, setIds, toggle, remove, clear };
}
