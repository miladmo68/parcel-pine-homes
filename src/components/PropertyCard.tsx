import type { Property } from "../domain/types";
import { money } from "../lib/format";
import { ArrowIcon, HeartIcon } from "./Icons";

export function PropertyCard({ property, selected, saved, compared, onSelect, onSave, onCompare }: {
  property: Property;
  selected: boolean;
  saved: boolean;
  compared: boolean;
  onSelect: () => void;
  onSave: () => void;
  onCompare: () => void;
}) {
  return (
    <article className={selected ? "property-card selected" : "property-card"} data-property-id={property.id}>
      <button className="image-button" onClick={onSelect} aria-label={`View ${property.title}`}>
        <img src={property.image} alt={property.imageAlt} loading="lazy" />
        <span className="image-wash" style={{ background: `linear-gradient(130deg, transparent 30%, ${property.accent}66)` }} />
        {property.openHouse ? <span className="open-house">Open house · {property.openHouse.split(" · ")[0]}</span> : null}
      </button>
      <button className={saved ? "save-button saved" : "save-button"} onClick={onSave} aria-label={saved ? `Remove ${property.title} from saved homes` : `Save ${property.title}`} aria-pressed={saved}><HeartIcon filled={saved} /></button>
      <div className="card-copy">
        <div className="card-topline"><span>{property.neighbourhood}</span><span>{property.kind}</span></div>
        <button className="title-button" onClick={onSelect}><h3>{property.title}</h3></button>
        <p className="price">{money(property.price)}</p>
        <p className="facts"><strong>{property.beds}</strong> bed <i/> <strong>{property.baths}</strong> bath <i/> <strong>{property.area.toLocaleString()}</strong> sq ft</p>
        <p className="summary">{property.summary}</p>
        <div className="card-actions">
          <button className={compared ? "compare active" : "compare"} onClick={onCompare} aria-pressed={compared}>{compared ? "In comparison" : "Compare"}</button>
          <button className="view-button" onClick={onSelect}>View home <ArrowIcon /></button>
        </div>
      </div>
    </article>
  );
}
