export type PropertyKind = "House" | "Condo" | "Townhome" | "Loft";

export type Coordinates = { x: number; y: number };

export type Property = {
  id: string;
  slug: string;
  title: string;
  neighbourhood: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  kind: PropertyKind;
  coordinates: Coordinates;
  image: string;
  imageAlt: string;
  accent: string;
  summary: string;
  highlights: string[];
  rooms: { label: string; dimensions: string }[];
  openHouse?: string;
  availableSlots: string[];
  monthlyEstimate: number;
  walkScore: number;
  featured: boolean;
};

export type PropertyFilters = {
  query: string;
  kinds: PropertyKind[];
  minBeds: number;
  maxPrice: number;
  neighbourhood: string;
};

export type ViewingRequest = {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  slot: string;
  note: string;
  createdAt: string;
  status: "preview";
};

export const defaultFilters: PropertyFilters = {
  query: "",
  kinds: [],
  minBeds: 0,
  maxPrice: 2400000,
  neighbourhood: "All neighbourhoods",
};
