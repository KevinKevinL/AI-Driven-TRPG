// ai/schemas.js
import { z } from "zod";

export const taSchema = z.object({
  testRequired: z.array(z.string()),
  hardLevel: z.number().min(1).max(3),
  talkRequired: z.array(z.string()),
  fightRequired: z.number().min(0).max(1),
});

export const kpSchema = z.object({
  description: z.string(),
  actions: z.array(z.string()),
  nextSteps: z.array(z.string()),
});

export const npcSchema = z.object({
  dialogue: z.string(),
  hints: z.array(z.string()),
});
