import { properties } from "../data/properties";
import { money } from "../lib/format";
import { CloseIcon, HeartIcon } from "./Icons";

export function SavedDrawer({ open, ids, onClose, onOpenHome, onRemove }: {
  open: boolean;
  ids: string[];
  onClose: () => void;
  onOpenHome: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const saved = properties.filter((item) => ids.includes(item.id));
  if (!open) return null;
  return <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="saved-drawer" role="dialog" aria-modal="true" aria-labelledby="saved-title">
      <div className="drawer-heading"><div><p className="eyebrow">Your edit</p><h2 id="saved-title">Saved homes</h2></div><button onClick={onClose} aria-label="Close saved homes"><CloseIcon /></button></div>
      {saved.length ? <div className="saved-list">{saved.map((property) => <article key={property.id}><button className="saved-home" onClick={() => onOpenHome(property.id)}><img src={property.image} alt=""/><span><strong>{property.title}</strong><small>{property.neighbourhood} · {money(property.price)}</small></span></button><button onClick={() => onRemove(property.id)} aria-label={`Remove ${property.title}`}><HeartIcon filled /></button></article>)}</div> : <div className="drawer-empty"><HeartIcon/><h3>Your shortlist starts here.</h3><p>Save homes from the map or cards and they will stay on this device.</p></div>}
      <p className="drawer-note">Saved locally in this browser. No account or personal profile is created.</p>
    </aside>
  </div>;
}
