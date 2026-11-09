import type { Property, PropertyFilters } from "../domain/types";
const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function shortlistCsv(properties: Property[]) {
  const header = ["Home", "Neighbourhood", "Type", "Price CAD", "Beds", "Baths", "Area sq ft", "Monthly estimate CAD", "Walk score"];
  return [header, ...properties.map((item) => [item.title, item.neighbourhood, item.kind, item.price, item.beds, item.baths, item.area, item.monthlyEstimate, item.walkScore])].map((row) => row.map(escape).join(",")).join("\n");
}
export function downloadShortlist(properties: Property[]) {
  const blob = new Blob([shortlistCsv(properties)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "parcel-pine-shortlist.csv"; anchor.click(); URL.revokeObjectURL(url);
}
export function serializeFilters(filters: PropertyFilters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.neighbourhood !== "All neighbourhoods") params.set("area", filters.neighbourhood);
  if (filters.kinds.length) params.set("type", filters.kinds.join(","));
  if (filters.minBeds) params.set("beds", String(filters.minBeds));
  if (filters.maxPrice < 2400000) params.set("price", String(filters.maxPrice));
  return params.toString();
}
