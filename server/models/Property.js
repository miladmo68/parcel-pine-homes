import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({ label: { type: String, required: true }, dimensions: { type: String, required: true } }, { _id: false });

const propertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  neighbourhood: { type: String, required: true, index: true },
  address: { type: String, required: true },
  price: { type: Number, required: true, min: 0, index: true },
  beds: { type: Number, required: true, min: 0 },
  baths: { type: Number, required: true, min: 0 },
  area: { type: Number, required: true, min: 100 },
  kind: { type: String, enum: ["House", "Condo", "Townhome", "Loft"], required: true, index: true },
  coordinates: { x: { type: Number, required: true }, y: { type: Number, required: true } },
  image: { type: String, required: true },
  imageAlt: { type: String, required: true },
  accent: { type: String, required: true },
  summary: { type: String, required: true },
  highlights: [{ type: String, required: true }],
  rooms: [roomSchema],
  openHouse: String,
  availableSlots: [{ type: String, required: true }],
  monthlyEstimate: { type: Number, required: true, min: 0 },
  walkScore: { type: Number, required: true, min: 0, max: 100 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const PropertyModel = mongoose.models.Property || mongoose.model("Property", propertySchema);
