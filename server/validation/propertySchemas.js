import { z } from "zod";

export const propertyQuerySchema = z.object({
  query: z.string().trim().max(80).default(""),
  neighbourhood: z.string().trim().max(80).optional(),
  kinds: z.union([z.string(), z.array(z.string())]).optional().transform((value) => value ? (Array.isArray(value) ? value : value.split(",")) : []),
  minBeds: z.coerce.number().int().min(0).max(8).default(0),
  maxPrice: z.coerce.number().int().positive().max(50000000).default(50000000),
});

export const viewingRequestSchema = z.object({
  propertyId: z.string().min(2).max(80),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  slot: z.string().trim().min(4).max(100),
  note: z.string().trim().max(500).default(""),
});
