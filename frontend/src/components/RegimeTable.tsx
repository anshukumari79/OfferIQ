import { CalculationResult } from "../types";
import { formatCurrency, formatPercent } from "../lib/format";

interface RegimeTableProps {
  result: CalculationResult;
}

export function RegimeTable({ result }: RegimeTableProps) {
  const rows = [result.oldRegimeTax, result.newRegimeTax];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 text-left text-zinc-500 text-xs uppercase tracking-wide">
            <th className="px-4 py-2 font-medium">Regime</th>
            <th className="px-4 py-2 font-medium">Taxable income</th>
            <th className="px-4 py-2 font-medium">Total tax</th>
            <th className="px-4 py-2 font-medium">Effective rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tax) => {
            const isRecommended = tax.regime === result.recommendedRegime;
            return (
              <tr
                key={tax.regime}
                className={`border-t border-zinc-100 ${
                  isRecommended ? "bg-indigo-50/50" : ""
                }`}
              >
                <td className="px-4 py-2.5 capitalize font-medium text-zinc-900">
                  {tax.regime}
                  {isRecommended && (
                    <span className="ml-2 text-xs text-indigo-600 font-normal">
                      recommended
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-700">
                  {formatCurrency(tax.taxableIncome)}
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-700">
                  {formatCurrency(tax.totalTax)}
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-700">
                  {formatPercent(tax.effectiveTaxRate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
