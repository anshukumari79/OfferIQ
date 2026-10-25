import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

interface StatHeroProps {
  monthlyInHand: number;
  regime: "old" | "new";
}

/**
 * The one deliberately "signature" moment in this UI: the number this whole
 * product exists to answer, animated on arrival. Everything else in the
 * design stays quiet so this stays the thing people remember.
 */
export function StatHero({ monthlyInHand, regime }: StatHeroProps) {
  const animatedValue = useAnimatedNumber(monthlyInHand);
  const formatted = new Intl.NumberFormat("en-IN").format(animatedValue);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
        Monthly in-hand
      </p>
      <div className="flex items-baseline gap-3 mt-2">
        <p className="text-4xl font-semibold font-mono text-zinc-900 tabular-nums">
          ₹{formatted}
        </p>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-2 py-1">
          {regime === "new" ? "New regime" : "Old regime"}
        </span>
      </div>
    </div>
  );
}
