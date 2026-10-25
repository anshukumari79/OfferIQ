import { TrendingUp } from "lucide-react";

export function TopBar() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
          <TrendingUp className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-zinc-900 tracking-tight">
          OfferIQ
        </span>
      </div>
    </header>
  );
}
