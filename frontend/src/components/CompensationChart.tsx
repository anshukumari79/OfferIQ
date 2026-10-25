import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { YearlyCompensation } from "../types";

interface CompensationChartProps {
  data: YearlyCompensation[];
}

function currencyTick(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${value}`;
}

export function CompensationChart({ data }: CompensationChartProps) {
  const chartData = data.map((y) => ({
    name: `Y${y.year}`,
    Cash: y.cash,
    Stock: y.vestedStockValue,
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-medium text-zinc-900 mb-4">
        Year-wise compensation
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#71717A" }}
            axisLine={{ stroke: "#E4E4E7" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={currencyTick}
            tick={{ fontSize: 12, fill: "#71717A" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E4E4E7",
              fontSize: 12,
            }}
          />
          <Bar dataKey="Cash" stackId="comp" fill="#4F46E5" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Stock" stackId="comp" fill="#A5B4FC" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
