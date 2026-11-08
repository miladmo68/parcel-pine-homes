import test from "node:test";
import assert from "node:assert/strict";
import { PropertyService } from "../server/services/propertyService.js";
import { StaticJsonPropertyRepository } from "../server/repositories/staticJsonPropertyRepository.js";

const service = new PropertyService(new StaticJsonPropertyRepository());
const defaults = { query: "", neighbourhood: undefined, kinds: [], minBeds: 0, maxPrice: 50000000 };

test("discovery returns the complete curated inventory", async () => {
  const result = await service.discover(defaults);
  assert.equal(result.total, 6);
  assert.equal(result.items[0].featured, true);
});

test("discovery combines text, kind, beds and price filters", async () => {
  const result = await service.discover({ ...defaults, query: "garden", kinds: ["Condo"], minBeds: 1, maxPrice: 800000 });
  assert.deepEqual(result.items.map((item) => item.id), ["pp-105"]);
});

test("detail returns a known property and rejects an unknown id", async () => {
  assert.equal((await service.detail("pp-102")).title, "Gallery Loft on Sterling");
  await assert.rejects(() => service.detail("missing"), (error) => error.code === "PROPERTY_NOT_FOUND" && error.status === 404);
});

test("viewing preview accepts only a published availability slot", async () => {
  const payload = { propertyId: "pp-104", name: "Avery Chen", email: "avery@example.com", slot: "Wed, Nov 11 · 12:30 PM", note: "Looking for a quiet second room." };
  const preview = await service.previewViewing(payload);
  assert.equal(preview.status, "preview");
  assert.match(preview.notice, /does not contact/i);
  await assert.rejects(() => service.previewViewing({ ...payload, slot: "Friday at midnight" }), (error) => error.code === "SLOT_UNAVAILABLE");
});
