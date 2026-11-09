export class StaticJsonViewingRepository {
  constructor() { this.records = []; }
  async create(payload) { const record = { id: `preview-${payload.propertyId}-${Date.now()}`, ...payload, status: "preview", createdAt: new Date().toISOString() }; this.records.unshift(record); return record; }
  async list() { return [...this.records]; }
  async hasConflict({ propertyId, slot, email }) { return this.records.some((item) => item.propertyId === propertyId && item.slot === slot && item.email === email); }
}
