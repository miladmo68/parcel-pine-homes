export class DomainError extends Error {
  constructor(message, status = 400, code = "DOMAIN_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class PropertyService {
  constructor(repository) {
    this.repository = repository;
  }

  async discover(filters) {
    const items = await this.repository.list(filters);
    return { items, total: items.length, filters, generatedAt: new Date().toISOString() };
  }

  async detail(id) {
    const property = await this.repository.byId(id);
    if (!property) throw new DomainError("Property not found", 404, "PROPERTY_NOT_FOUND");
    return property;
  }

  async previewViewing(payload) {
    const property = await this.detail(payload.propertyId);
    if (!property.availableSlots.includes(payload.slot)) {
      throw new DomainError("That viewing time is no longer available", 409, "SLOT_UNAVAILABLE");
    }
    return {
      id: `preview-${payload.propertyId}-${Date.now()}`,
      ...payload,
      propertyTitle: property.title,
      status: "preview",
      createdAt: new Date().toISOString(),
      notice: "This portfolio experience stores a local preview only and does not contact a brokerage.",
    };
  }
}
