import type { PropertyFilters, PropertyKind } from "../domain/types";
import { compactMoney } from "../lib/format";
import { SearchIcon, SlidersIcon } from "./Icons";

const kinds: PropertyKind[] = ["House", "Condo", "Townhome", "Loft"];

export function FilterBar({ filters, neighbourhoods, resultCount, onChange, onReset }: {
  filters: PropertyFilters;
  neighbourhoods: string[];
  resultCount: number;
  onChange: (next: PropertyFilters) => void;
  onReset: () => void;
}) {
  const toggleKind = (kind: PropertyKind) => onChange({
    ...filters,
    kinds: filters.kinds.includes(kind) ? filters.kinds.filter((item) => item !== kind) : [...filters.kinds, kind],
  });
  const changed = filters.query || filters.kinds.length || filters.minBeds || filters.maxPrice < 2400000 || filters.neighbourhood !== "All neighbourhoods";

  return (
    <section className="filter-panel" aria-label="Property filters">
      <label className="search-field">
        <SearchIcon />
        <span className="sr-only">Search properties</span>
        <input value={filters.query} onChange={(event) => onChange({ ...filters, query: event.target.value })} placeholder="Street, neighbourhood, or feature" />
        <kbd>/</kbd>
      </label>
      <div className="filter-row">
        <label>
          <span>Neighbourhood</span>
          <select value={filters.neighbourhood} onChange={(event) => onChange({ ...filters, neighbourhood: event.target.value })}>
            {neighbourhoods.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Bedrooms</span>
          <select value={filters.minBeds} onChange={(event) => onChange({ ...filters, minBeds: Number(event.target.value) })}>
            <option value={0}>Any</option><option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option><option value={4}>4+</option>
          </select>
        </label>
        <label className="price-range">
          <span>Up to {compactMoney(filters.maxPrice)}</span>
          <input type="range" min="700000" max="2400000" step="50000" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })} />
        </label>
      </div>
      <div className="kind-row">
        <div className="kind-chips" aria-label="Property types">
          {kinds.map((kind) => <button key={kind} className={filters.kinds.includes(kind) ? "chip active" : "chip"} aria-pressed={filters.kinds.includes(kind)} onClick={() => toggleKind(kind)}>{kind}</button>)}
        </div>
        <p><SlidersIcon /> <strong>{resultCount}</strong> homes fit</p>
        {changed ? <button className="text-button" onClick={onReset}>Clear all</button> : null}
      </div>
    </section>
  );
}
