import { useEffect, useState } from "react";
import type { Property, ViewingRequest } from "../domain/types";
import { money } from "../lib/format";
import { CheckIcon, CloseIcon, HeartIcon } from "./Icons";

type FormState = { name: string; email: string; slot: string; note: string };
const emptyForm: FormState = { name: "", email: "", slot: "", note: "" };

export function PropertyDetail({ property, saved, onSave, onClose, onCreated }: {
  property: Property | null;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  onCreated: (request: ViewingRequest) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<ViewingRequest | null>(null);

  useEffect(() => { setFormOpen(false); setForm(emptyForm); setErrors({}); setConfirmed(null); }, [property?.id]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  if (!property) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.slot) next.slot = "Choose a time.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const request: ViewingRequest = { id: `preview-${property.id}-${Date.now()}`, propertyId: property.id, ...form, createdAt: new Date().toISOString(), status: "preview" };
    setConfirmed(request); onCreated(request);
  };

  return <div className="detail-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="property-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button className="detail-close" onClick={onClose} aria-label="Close property details"><CloseIcon /></button>
      <div className="detail-photo"><img src={property.image} alt={property.imageAlt}/><p>{property.kind} · {property.neighbourhood}</p></div>
      <div className="detail-copy">
        <div className="detail-kicker"><span>{property.address}</span><button className={saved ? "saved" : ""} onClick={onSave}><HeartIcon filled={saved}/>{saved ? "Saved" : "Save"}</button></div>
        <h2 id="detail-title">{property.title}</h2>
        <div className="detail-price"><strong>{money(property.price)}</strong><span>Est. {money(property.monthlyEstimate)} / month</span></div>
        <p className="detail-summary">{property.summary}</p>
        <dl className="detail-stats"><div><dt>Bedrooms</dt><dd>{property.beds}</dd></div><div><dt>Bathrooms</dt><dd>{property.baths}</dd></div><div><dt>Interior</dt><dd>{property.area.toLocaleString()} sq ft</dd></div><div><dt>Walk score</dt><dd>{property.walkScore}</dd></div></dl>
        <div className="detail-columns"><div><p className="eyebrow">What stands out</p><ul>{property.highlights.map((item) => <li key={item}><CheckIcon/>{item}</li>)}</ul></div><div><p className="eyebrow">Key rooms</p><ul>{property.rooms.map((room) => <li key={room.label}><span>{room.label}</span><small>{room.dimensions}</small></li>)}</ul></div></div>
        {property.openHouse ? <div className="open-note"><span>Open house</span><strong>{property.openHouse}</strong><small>Walk-ins shown for the experience only.</small></div> : null}

        {!formOpen && !confirmed ? <button className="tour-button" onClick={() => setFormOpen(true)}>Plan a viewing</button> : null}
        {formOpen && !confirmed ? <form className="viewing-form" onSubmit={submit} noValidate>
          <div className="form-heading"><p className="eyebrow">Viewing preview</p><h3>Choose a time that works.</h3><p>This creates a browser-local planning record; it does not contact a brokerage.</p></div>
          <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} aria-invalid={Boolean(errors.name)}/>{errors.name ? <small>{errors.name}</small> : null}</label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} aria-invalid={Boolean(errors.email)}/>{errors.email ? <small>{errors.email}</small> : null}</label>
          <fieldset><legend>Available times</legend>{property.availableSlots.map((slot) => <label className={form.slot === slot ? "slot selected" : "slot"} key={slot}><input type="radio" name="slot" value={slot} checked={form.slot === slot} onChange={() => setForm({ ...form, slot })}/><span>{slot}</span></label>)}{errors.slot ? <small>{errors.slot}</small> : null}</fieldset>
          <label><span>What should we know? <i>Optional</i></span><textarea rows={3} maxLength={500} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })}/></label>
          <div className="form-actions"><button type="button" onClick={() => setFormOpen(false)}>Back</button><button type="submit">Save viewing preview</button></div>
        </form> : null}
        {confirmed ? <div className="viewing-confirmed" role="status"><CheckIcon/><p className="eyebrow">Added to your plan</p><h3>{confirmed.slot}</h3><p>Your viewing preview for {property.title} is stored locally in this browser.</p><button onClick={onClose}>Continue exploring</button></div> : null}
      </div>
    </section>
  </div>;
}
