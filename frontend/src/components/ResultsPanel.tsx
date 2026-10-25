import { motion } from "framer-motion";
import { CalculationResult } from "../types";
import { StatHero } from "./StatHero";
import { CtcMismatchBanner } from "./CtcMismatchBanner";
import { RegimeTable } from "./RegimeTable";
import { CompensationChart } from "./CompensationChart";

interface ResultsPanelProps {
  result: CalculationResult;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <StatHero
        monthlyInHand={result.monthlyInHand}
        regime={result.recommendedRegime}
      />

      <CtcMismatchBanner
        computedCTC={result.computedCTC}
        reportedCTC={result.reportedCTC}
        ctcDelta={result.ctcDelta}
      />

      <RegimeTable result={result} />

      <CompensationChart data={result.yearWiseCompensation} />

      <p className="text-xs text-zinc-400">
        Simplified FY2024-25 slabs — not a substitute for professional tax
        advice.
      </p>
    </motion.div>
  );
}
