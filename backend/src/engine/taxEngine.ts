import { TaxBreakdown } from "./types";

/**
 * Indian personal income tax calculations.
 *
 * SCOPE NOTE: This is deliberately scoped to Indian individual income tax
 * (FY2024-25 slabs), stated explicitly per the project's design decision to
 * pick one jurisdiction and get it right rather than attempt a vague
 * jurisdiction-agnostic model. Slabs are defined as constants below so they
 * can be updated for future assessment years without touching engine logic.
 *
 * These are simplified for a portfolio-scale tool: they omit some real-world
 * deductions (80C, 80D, HRA exemption nuances, etc.) that a production tax
 * filing product would need. That simplification is intentional and should
 * be stated as such — this engine estimates take-home pay for comparison
 * purposes, it does not file taxes.
 */

const CESS_RATE = 0.04;
const STANDARD_DEDUCTION_OLD = 50000;
const STANDARD_DEDUCTION_NEW = 75000;

interface Slab {
  upTo: number; // upper bound of this slab, Infinity for the top slab
  rate: number; // marginal rate on the portion of income within this slab
}

const OLD_REGIME_SLABS: Slab[] = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 300000, rate: 0 },
  { upTo: 600000, rate: 0.05 },
  { upTo: 900000, rate: 0.1 },
  { upTo: 1200000, rate: 0.15 },
  { upTo: 1500000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

// Section 87A rebate: tax becomes zero if taxable income is at or below
// these thresholds (post standard deduction, pre-cess).
const OLD_REGIME_REBATE_THRESHOLD = 500000;
const NEW_REGIME_REBATE_THRESHOLD = 700000;

function computeSlabTax(taxableIncome: number, slabs: Slab[]): number {
  let tax = 0;
  let lowerBound = 0;

  for (const slab of slabs) {
    if (taxableIncome <= lowerBound) break;
    const taxableInThisSlab = Math.min(taxableIncome, slab.upTo) - lowerBound;
    if (taxableInThisSlab > 0) {
      tax += taxableInThisSlab * slab.rate;
    }
    lowerBound = slab.upTo;
  }

  return tax;
}

function computeRegimeTax(
  grossAnnualCash: number,
  regime: "old" | "new"
): TaxBreakdown {
  const standardDeduction =
    regime === "old" ? STANDARD_DEDUCTION_OLD : STANDARD_DEDUCTION_NEW;
  const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
  const rebateThreshold =
    regime === "old" ? OLD_REGIME_REBATE_THRESHOLD : NEW_REGIME_REBATE_THRESHOLD;

  const taxableIncome = Math.max(0, grossAnnualCash - standardDeduction);

  let incomeTax = computeSlabTax(taxableIncome, slabs);

  // Section 87A rebate: full rebate (tax = 0) if taxable income is within
  // threshold. This is a simplified all-or-nothing application; real rebate
  // calculations include marginal relief at the threshold boundary.
  if (taxableIncome <= rebateThreshold) {
    incomeTax = 0;
  }

  const cess = incomeTax * CESS_RATE;
  const totalTax = incomeTax + cess;
  const effectiveTaxRate = grossAnnualCash > 0 ? totalTax / grossAnnualCash : 0;

  return {
    regime,
    taxableIncome,
    incomeTax: round2(incomeTax),
    cess: round2(cess),
    totalTax: round2(totalTax),
    effectiveTaxRate: round4(effectiveTaxRate),
  };
}

export function computeOldRegimeTax(grossAnnualCash: number): TaxBreakdown {
  return computeRegimeTax(grossAnnualCash, "old");
}

export function computeNewRegimeTax(grossAnnualCash: number): TaxBreakdown {
  return computeRegimeTax(grossAnnualCash, "new");
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
