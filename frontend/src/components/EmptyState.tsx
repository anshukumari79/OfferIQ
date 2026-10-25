import { Calculator } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 p-10 flex flex-col items-center text-center">
      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
        <Calculator className="h-5 w-5 text-zinc-400" />
      </div>
      <p className="text-sm text-zinc-500 max-w-xs">
        Fill in the offer details and calculate to see your take-home
        breakdown.
      </p>
    </div>
  );
}
