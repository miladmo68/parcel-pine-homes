import properties from "../data/properties.json" with { type: "json" };

export class StaticJsonPropertyRepository {
  async list(filters) {
    const needle = filters.query.toLowerCase();
    return properties.filter((property) => {
      const haystack = `${property.title} ${property.neighbourhood} ${property.address} ${property.kind}`.toLowerCase();
      return (!needle || haystack.includes(needle))
        && (!filters.neighbourhood || property.neighbourhood === filters.neighbourhood)
        && (!filters.kinds.length || filters.kinds.includes(property.kind))
        && property.beds >= filters.minBeds
        && property.price <= filters.maxPrice;
    }).sort((a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price);
  }

  async byId(id) {
    return properties.find((property) => property.id === id) ?? null;
  }
}
