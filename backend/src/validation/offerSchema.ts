import { z } from "zod";

/**
 * Validates the shape of an incoming Offer before it reaches the calculation
 * engine. This is API-boundary validation (malformed JSON, wrong types,
 * missing fields) — NOT the same as the domain-level Validation Engine
 * planned for Milestone 3 (which checks business rules like "does CTC add
 * up" or "is this tax rate plausible"). Keep these two concerns separate:
 * this schema answers "is this a well-formed Offer at all", the future
 * Validation Engine answers "is this a *sensible* Offer".
 */
export const vestingYearSchema = z.object({
  year: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
});

export const offerSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),

  baseSalary: z.number().nonnegative(),
  joiningBonus: z.number().nonnegative(),
  performanceBonus: z.number().nonnegative(),
  retentionBonus: z.number().nonnegative(),

  rsus: z.number().nonnegative(),
  vestingSchedule: z.array(vestingYearSchema),

  employerPF: z.number().nonnegative(),
  employeePF: z.number().nonnegative(),

  hra: z.number().nonnegative(),
  gratuity: z.number().nonnegative(),
  specialAllowance: z.number().nonnegative(),

  reportedCTC: z.number().nonnegative(),

  taxRegimeDefault: z.enum(["old", "new"]).optional(),
});

export type OfferInput = z.infer<typeof offerSchema>;
