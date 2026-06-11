import { z } from "zod";

export const createMatchSchema = z.object({
  lostItemId: z.number().int().positive(),
  foundItemId: z.number().int().positive(),
  similarityScore: z.number().min(0).max(100).optional(),
});