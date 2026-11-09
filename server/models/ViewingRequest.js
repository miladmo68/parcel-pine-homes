import mongoose from "mongoose";
const viewingRequestSchema = new mongoose.Schema({
  propertyId: { type: String, required: true, trim: true, index: true },
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true },
  slot: { type: String, required: true, index: true }, note: { type: String, default: "", maxlength: 500 },
  status: { type: String, enum: ["preview"], default: "preview" },
}, { timestamps: true });
viewingRequestSchema.index({ propertyId: 1, slot: 1, email: 1 }, { unique: true });
export const ViewingRequestModel = mongoose.models.ViewingRequest || mongoose.model("ViewingRequest", viewingRequestSchema);
