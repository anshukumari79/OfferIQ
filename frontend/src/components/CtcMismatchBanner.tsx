import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "../lib/format";

interface CtcMismatchBannerProps {
  computedCTC: number;
  reportedCTC: number;
  ctcDelta: number;
}

/**
 * This stays as a persistent inline banner rather than a toast — a CTC
 * mismatch is a fact about the result the user should keep seeing while
 * they review it, not a one-off event that should disappear after a few
 * seconds the way toast notifications do.
 */
export function CtcMismatchBanner({
  computedCTC,
  reportedCTC,
  ctcDelta,
}: CtcMismatchBannerProps) {
  if (Math.abs(ctcDelta) <= 1000) return null;

  return (
    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        The components you entered sum to{" "}
        <span className="font-mono">{formatCurrency(computedCTC)}</span>,
        which differs from the reported CTC of{" "}
        <span className="font-mono">{formatCurrency(reportedCTC)}</span> by{" "}
        <span className="font-mono">{formatCurrency(Math.abs(ctcDelta))}</span>.
        Double check the numbers you entered.
      </p>
    </div>
  );
}
