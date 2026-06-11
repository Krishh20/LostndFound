import { z } from "zod";

export const createClaimSchema = z.object({
  matchId: z.number(),
});

export const updateClaimSchema=createClaimSchema.partial();

export const submitAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.string().min(1),
    })
  ),
});