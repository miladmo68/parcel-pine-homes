import { properties } from "../data/properties";
import type { Property, PropertyFilters } from "../domain/types";

export class StaticPropertyRepository {
  async list(filters: PropertyFilters): Promise<Property[]> {
    const query = filters.query.trim().toLocaleLowerCase();
    return properties.filter((property) => {
      const matchesQuery = !query || [property.title, property.neighbourhood, property.address, property.kind, ...property.highlights]
        .join(" ").toLocaleLowerCase().includes(query);
      const matchesKind = filters.kinds.length === 0 || filters.kinds.includes(property.kind);
      const matchesBeds = property.beds >= filters.minBeds;
      const matchesPrice = property.price <= filters.maxPrice;
      const matchesNeighbourhood = filters.neighbourhood === "All neighbourhoods" || property.neighbourhood === filters.neighbourhood;
      return matchesQuery && matchesKind && matchesBeds && matchesPrice && matchesNeighbourhood;
    });
  }

  async byId(id: string): Promise<Property | undefined> {
    return properties.find((property) => property.id === id);
  }
}

export const propertyRepository = new StaticPropertyRepository();
