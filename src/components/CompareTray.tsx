import { properties } from "../data/properties";
import { money } from "../lib/format";
import { CloseIcon } from "./Icons";

export function CompareTray({ ids, expanded, onExpand, onRemove, onClear }: {
  ids: string[];
  expanded: boolean;
  onExpand: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const selected = properties.filter((item) => ids.includes(item.id));
  if (!selected.length) return null;
  return (
    <section className={expanded ? "compare-tray expanded" : "compare-tray"} aria-label="Home comparison">
      <div className="compare-bar"><p><strong>{selected.length}</strong> of 3 homes ready to compare</p><div><button onClick={onClear}>Clear</button><button className="primary-small" onClick={onExpand}>{expanded ? "Close comparison" : "Compare homes"}</button></div></div>
      {expanded ? <div className="comparison-grid">
        <div className="comparison-labels"><span>Price</span><span>Monthly estimate</span><span>Space</span><span>Bedrooms</span><span>Walk score</span><span>Signature detail</span></div>
        {selected.map((property) => <article key={property.id}>
          <button className="remove-compare" onClick={() => onRemove(property.id)} aria-label={`Remove ${property.title} from comparison`}><CloseIcon /></button>
          <img src={property.image} alt="" />
          <h3>{property.title}</h3><p>{property.neighbourhood}</p>
          <dl><div><dt>Price</dt><dd>{money(property.price)}</dd></div><div><dt>Monthly estimate</dt><dd>{money(property.monthlyEstimate)}</dd></div><div><dt>Space</dt><dd>{property.area.toLocaleString()} sq ft</dd></div><div><dt>Bedrooms</dt><dd>{property.beds}</dd></div><div><dt>Walk score</dt><dd>{property.walkScore}</dd></div><div><dt>Signature detail</dt><dd>{property.highlights[0]}</dd></div></dl>
        </article>)}
      </div> : null}
    </section>
  );
}
