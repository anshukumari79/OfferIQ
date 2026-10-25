import { Offer, CalculationResult, YearlyCompensation } from "./types";
import { computeOldRegimeTax, computeNewRegimeTax } from "./taxEngine";

/**
 * Pure function: Offer in, CalculationResult out. No side effects, no I/O.
 * This is the module that should be imported directly by the API layer,
 * by future CLI tooling, and by this file's own test suite, without any
 * adaptation — that's the point of keeping it framework-agnostic.
 */
export function calculate(offer: Offer): CalculationResult {
  validateOfferShape(offer);

  const grossAnnualCash =
    offer.baseSalary +
    offer.joiningBonus +
    offer.performanceBonus +
    offer.retentionBonus +
    offer.specialAllowance +
    offer.hra;

  const computedCTC =
    offer.baseSalary +
    offer.joiningBonus +
    offer.performanceBonus +
    offer.retentionBonus +
    offer.specialAllowance +
    offer.hra +
    offer.employerPF +
    offer.gratuity +
    offer.rsus;

  const ctcDelta = computedCTC - offer.reportedCTC;

  const employerContribution = offer.employerPF + offer.gratuity;
  const employeeContribution = offer.employeePF;

  const oldRegimeTax = computeOldRegimeTax(grossAnnualCash);
  const newRegimeTax = computeNewRegimeTax(grossAnnualCash);
  const recommendedRegime =
    newRegimeTax.totalTax <= oldRegimeTax.totalTax ? "new" : "old";

  const appliedTax =
    recommendedRegime === "new" ? newRegimeTax : oldRegimeTax;

  const annualInHand =
    grossAnnualCash - employeeContribution - appliedTax.totalTax;
  const monthlyInHand = annualInHand / 12;

  const yearWiseCompensation = computeYearWiseCompensation(offer);

  return {
    grossAnnualCash: round2(grossAnnualCash),
    computedCTC: round2(computedCTC),
    reportedCTC: round2(offer.reportedCTC),
    ctcDelta: round2(ctcDelta),
    employerContribution: round2(employerContribution),
    employeeContribution: round2(employeeContribution),
    monthlyInHand: round2(monthlyInHand),
    annualInHand: round2(annualInHand),
    oldRegimeTax,
    newRegimeTax,
    recommendedRegime,
    yearWiseCompensation,
  };
}

function computeYearWiseCompensation(offer: Offer): YearlyCompensation[] {
  const recurringCash =
    offer.baseSalary +
    offer.performanceBonus +
    offer.retentionBonus +
    offer.specialAllowance +
    offer.hra;

  const maxVestingYear =
    offer.vestingSchedule.length > 0
      ? Math.max(...offer.vestingSchedule.map((v) => v.year))
      : 1;

  const years: YearlyCompensation[] = [];

  for (let year = 1; year <= Math.max(maxVestingYear, 1); year++) {
    const cash = year === 1 ? recurringCash + offer.joiningBonus : recurringCash;

    const vestingEntry = offer.vestingSchedule.find((v) => v.year === year);
    const vestedStockValue = vestingEntry
      ? (vestingEntry.percentage / 100) * offer.rsus
      : 0;

    years.push({
      year,
      cash: round2(cash),
      vestedStockValue: round2(vestedStockValue),
      totalCompensation: round2(cash + vestedStockValue),
    });
  }

  return years;
}

/**
 * Guards against the two documented edge cases this engine must not
 * silently mishandle: negative inputs and a vesting schedule that doesn't
 * sum to 100%. These are cheap to check here and expensive to debug later
 * if a malformed Offer slips through from the ingestion layer.
 */
function validateOfferShape(offer: Offer): void {
  const numericFields: [string, number][] = [
    ["baseSalary", offer.baseSalary],
    ["joiningBonus", offer.joiningBonus],
    ["performanceBonus", offer.performanceBonus],
    ["retentionBonus", offer.retentionBonus],
    ["rsus", offer.rsus],
    ["employerPF", offer.employerPF],
    ["employeePF", offer.employeePF],
    ["hra", offer.hra],
    ["gratuity", offer.gratuity],
    ["specialAllowance", offer.specialAllowance],
    ["reportedCTC", offer.reportedCTC],
  ];

  for (const [name, value] of numericFields) {
    if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
      throw new Error(
        `Invalid Offer: field "${name}" must be a non-negative number, got ${value}`
      );
    }
  }

  if (offer.vestingSchedule.length > 0) {
    const totalPercentage = offer.vestingSchedule.reduce(
      (sum, v) => sum + v.percentage,
      0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(
        `Invalid Offer: vestingSchedule percentages sum to ${totalPercentage}, expected 100`
      );
    }
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
