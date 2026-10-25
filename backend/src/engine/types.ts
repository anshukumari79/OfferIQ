/**
 * Domain types for the OfferIQ Calculation Engine.
 *
 * This mirrors the `Offer` schema defined in ARCHITECTURE.md.
 * This module is intentionally framework-agnostic: no Express, no Mongoose,
 * no React. It is a pure function library that takes an Offer and produces
 * a CalculationResult. That separation is what lets it be unit tested in
 * isolation and reused from the API layer, a future CLI, or test suites
 * without modification.
 */

export interface VestingYear {
  year: number;
  percentage: number; // 0-100, must sum to 100 across all years for a valid schedule
}

export interface Offer {
  company: string;
  role: string;
  location: string;

  baseSalary: number;
  joiningBonus: number;
  performanceBonus: number;
  retentionBonus: number;

  rsus: number; // total RSU grant value, INR
  vestingSchedule: VestingYear[];

  employerPF: number;
  employeePF: number;

  hra: number;
  gratuity: number;
  specialAllowance: number;

  reportedCTC: number;

  /**
   * Which Indian income tax regime to compute under.
   * Both are always computed regardless (see CalculationResult), this only
   * affects which one is used for `effectiveTaxRegime`-dependent convenience
   * fields. Kept here because some employers vary default declarations.
   */
  taxRegimeDefault?: "old" | "new";
}

export interface TaxBreakdown {
  regime: "old" | "new";
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number; // totalTax / grossAnnualCash, as a fraction (0-1)
}

export interface YearlyCompensation {
  year: number;
  cash: number; // base + bonuses applicable that year (year 1 includes joining bonus)
  vestedStockValue: number;
  totalCompensation: number;
}

export interface CalculationResult {
  grossAnnualCash: number; // base + all cash bonuses (excludes RSU, employer PF)
  computedCTC: number; // sum of all components, engine's own tally
  reportedCTC: number; // as stated on the offer
  ctcDelta: number; // computedCTC - reportedCTC

  employerContribution: number; // employer PF + gratuity accrual
  employeeContribution: number; // employee PF

  monthlyInHand: number;
  annualInHand: number;

  oldRegimeTax: TaxBreakdown;
  newRegimeTax: TaxBreakdown;
  recommendedRegime: "old" | "new"; // whichever produces lower totalTax

  yearWiseCompensation: YearlyCompensation[]; // year 1 through last vesting year
}
