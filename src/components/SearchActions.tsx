import type { PropertyFilters } from "../domain/types";
import { properties } from "../data/properties";
import { downloadShortlist, readSavedSearch, serializeFilters } from "../lib/shortlist";
import { ArrowIcon, CheckIcon } from "./Icons";
export function SearchActions({ filters, savedIds, notice, onNotice, onRestore }: { filters: PropertyFilters; savedIds: string[]; notice: string; onNotice: (message: string) => void; onRestore: (filters: PropertyFilters) => void; }) {
  const saveSearch = () => { window.localStorage.setItem("parcel-pine:saved-search", JSON.stringify({ filters, savedAt: new Date().toISOString() })); onNotice("Search saved on this device"); };
  const copySearch = async () => {
    const query = serializeFilters(filters); const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}`;
    try { await navigator.clipboard.writeText(url); onNotice("Search link copied"); }
    catch { onNotice("Search encoded in the address bar"); window.history.replaceState({}, "", query ? `?${query}` : window.location.pathname); }
  };
  const exportSaved = () => { const selected = properties.filter((item) => savedIds.includes(item.id)); if (!selected.length) { onNotice("Save a home before exporting"); return; } downloadShortlist(selected); onNotice(`${selected.length} saved ${selected.length === 1 ? "home" : "homes"} exported`); };
  const restoreSearch = () => { const saved = readSavedSearch(); if (!saved) { onNotice("No saved search on this device"); return; } onRestore(saved); onNotice("Saved search restored"); };
  return <div className="search-actions" aria-label="Search actions"><button onClick={saveSearch}><span>＋</span> Save search</button><button onClick={restoreSearch}><span>↺</span> Restore saved</button><button onClick={copySearch}><ArrowIcon/> Share search</button><button onClick={exportSaved}><span>↓</span> Export shortlist</button><p className={notice ? "action-notice visible" : "action-notice"} role="status">{notice ? <><CheckIcon/>{notice}</> : null}</p></div>;
}
