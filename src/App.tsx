import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { GridIcon, HeartIcon, MapIcon } from "./components/Icons";
import { MapCanvas } from "./components/MapCanvas";
import { PropertyCard } from "./components/PropertyCard";
import { CompareTray } from "./components/CompareTray";
import { SavedDrawer } from "./components/SavedDrawer";
import { PropertyDetail } from "./components/PropertyDetail";
import { neighbourhoods } from "./data/properties";
import { defaultFilters, type Property, type PropertyFilters } from "./domain/types";
import { propertyRepository } from "./repositories/staticPropertyRepository";
import { usePersistentIds } from "./hooks/usePersistentIds";
import { useViewingPlan } from "./hooks/useViewingPlan";

type ViewMode = "split" | "list" | "map";

export function App() {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [results, setResults] = useState<Property[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const saved = usePersistentIds("parcel-pine:saved");
  const compare = usePersistentIds("parcel-pine:compare");
  const viewingPlan = useViewingPlan();
  const [view, setView] = useState<ViewMode>("split");
  const [loading, setLoading] = useState(true);
  const [savedOpen, setSavedOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const next = await propertyRepository.list(filters);
      setResults(next);
      if (selectedId && !next.some((property) => property.id === selectedId)) setSelectedId(null);
      setLoading(false);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [filters, selectedId]);

  const selected = useMemo(() => results.find((property) => property.id === selectedId) ?? null, [results, selectedId]);
  const openSavedHome = (id: string) => { setSelectedId(id); setSavedOpen(false); document.getElementById("discover")?.scrollIntoView(); };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Parcel and Pine home"><span>P</span><strong>Parcel <i>&amp;</i> Pine</strong></a>
        <nav aria-label="Primary navigation"><a href="#discover">Discover</a><a href="#collections">Collections</a><a href="#guide">Neighbourhood guide</a></nav>
        <button className="saved-link" onClick={() => setSavedOpen(true)}><HeartIcon /> Saved <span>{saved.ids.length}</span></button>
      </header>

      <main id="top">
        <section className="hero" id="discover">
          <div className="hero-index" aria-hidden="true">43.65° N<br/>79.38° W</div>
          <div className="hero-copy"><p className="eyebrow">Toronto homes · considered clearly</p><h1>Find the place that fits the way you live.</h1></div>
          <p className="hero-note">A calm, spatial search for homes with character—compare the details, save a shortlist, and plan your viewings without losing the thread.</p>
          <div className="hero-stamp"><span>06</span><p>curated homes<br/>across the city</p></div>
        </section>

        <FilterBar filters={filters} neighbourhoods={neighbourhoods} resultCount={results.length} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />

        <section className={`discovery-layout view-${view}`}>
          <div className="results-panel">
            <div className="results-heading">
              <div><p className="eyebrow">Shortlist-ready</p><h2>{filters.neighbourhood === "All neighbourhoods" ? "Homes across Toronto" : `Homes in ${filters.neighbourhood}`}</h2></div>
              <div className="view-switch" aria-label="View mode">
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view"><GridIcon /></button>
                <button className={view === "split" ? "active" : ""} onClick={() => setView("split")} aria-label="Split view"><span className="split-icon" /></button>
                <button className={view === "map" ? "active" : ""} onClick={() => setView("map")} aria-label="Map view"><MapIcon /></button>
              </div>
            </div>
            {loading ? <div className="loading-grid" aria-label="Loading homes">{[1,2,3].map((item) => <div key={item} />)}</div> : results.length ? (
              <div className="property-grid">{results.map((property) => <PropertyCard key={property.id} property={property} selected={selected?.id === property.id} saved={saved.ids.includes(property.id)} compared={compare.ids.includes(property.id)} onSelect={() => setSelectedId(property.id)} onSave={() => saved.toggle(property.id)} onCompare={() => compare.toggle(property.id, 3)} />)}</div>
            ) : (
              <div className="empty-state"><span>0</span><h3>No homes match that exact brief.</h3><p>Try a broader price range or remove one property type.</p><button onClick={() => setFilters(defaultFilters)}>Reset the search</button></div>
            )}
          </div>
          <aside className="map-panel"><MapCanvas properties={results} selectedId={selectedId} savedIds={saved.ids} onSelect={setSelectedId} /></aside>
        </section>
      </main>
      <CompareTray ids={compare.ids} expanded={compareOpen} onExpand={() => setCompareOpen((value) => !value)} onRemove={compare.remove} onClear={compare.clear} />
      <SavedDrawer open={savedOpen} ids={saved.ids} onClose={() => setSavedOpen(false)} onOpenHome={openSavedHome} onRemove={saved.remove} />
      <PropertyDetail property={selected} saved={selected ? saved.ids.includes(selected.id) : false} onSave={() => selected && saved.toggle(selected.id)} onClose={() => setSelectedId(null)} onCreated={viewingPlan.add} />
      <footer><p>Parcel &amp; Pine</p><p>Illustrative listings and viewing previews for a portfolio experience.</p><p>Toronto · 2026</p></footer>
    </div>
  );
}
