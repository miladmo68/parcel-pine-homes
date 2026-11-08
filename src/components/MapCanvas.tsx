import type { Property } from "../domain/types";
import { compactMoney } from "../lib/format";

export function MapCanvas({ properties, selectedId, savedIds, onSelect }: {
  properties: Property[];
  selectedId: string | null;
  savedIds: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="map-canvas" aria-label="Illustrated Toronto property map">
      <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="water" d="M0 82C20 74 28 90 48 80c20-10 27 7 52-4v24H0Z"/>
        <path d="M8 12c20 18 31 4 45 18s19 17 39 5M4 54c22-9 38 5 55-7s28-1 37-9M19 4c-2 26 12 37 7 62s2 26 2 34M57 0c7 22-5 36 4 55s7 25 4 45M87 5c-6 17 4 29-4 49s3 30 2 46"/>
        <path className="park" d="m10 20 13-6 8 12-12 9-11-5Zm58-2 12-6 9 10-4 15-14-2Z"/>
      </svg>
      <div className="map-label label-west">West end</div><div className="map-label label-east">East end</div><div className="map-label label-lake">Lake Ontario</div>
      {properties.map((property) => (
        <button
          key={property.id}
          className={`${selectedId === property.id ? "map-pin selected" : "map-pin"}${savedIds.includes(property.id) ? " saved" : ""}`}
          style={{ left: `${property.coordinates.x}%`, top: `${property.coordinates.y}%` }}
          onClick={() => onSelect(property.id)}
          aria-label={`${property.title}, ${compactMoney(property.price)}`}
        >
          {compactMoney(property.price)}
        </button>
      ))}
      <div className="map-legend"><span/><p>Map is a designed orientation view, not an exact location service.</p></div>
    </div>
  );
}
