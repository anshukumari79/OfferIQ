export interface VestingYear {
  year: number;
  percentage: number;
}

export interface Offer {
  company: string;
  role: string;
  location: string;

  baseSalary: number;
  joiningBonus: number;
  performanceBonus: number;
  retentionBonus: number;

  rsus: number;
  vestingSchedule: VestingYear[];

  employerPF: number;
  employeePF: number;

  hra: number;
  gratuity: number;
  specialAllowance: number;

  reportedCTC: number;
}

export interface TaxBreakdown {
  regime: "old" | "new";
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number;
}

export interface YearlyCompensation {
  year: number;
  cash: number;
  vestedStockValue: number;
  totalCompensation: number;
}

export interface CalculationResult {
  grossAnnualCash: number;
  computedCTC: number;
  reportedCTC: number;
  ctcDelta: number;
  employerContribution: number;
  employeeContribution: number;
  monthlyInHand: number;
  annualInHand: number;
  oldRegimeTax: TaxBreakdown;
  newRegimeTax: TaxBreakdown;
  recommendedRegime: "old" | "new";
  yearWiseCompensation: YearlyCompensation[];
}

export interface ApiError {
  error: string;
  details?: { path: string; message: string }[];
}
