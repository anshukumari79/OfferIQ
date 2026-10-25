import { useState, FormEvent } from "react";
import { Building2, Wallet, Landmark, PieChart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Offer } from "../types";
import { SectionCard } from "./SectionCard";

interface OfferFormProps {
  onSubmit: (offer: Offer) => void;
  isLoading: boolean;
}

const emptyOffer: Offer = {
  company: "",
  role: "",
  location: "",
  baseSalary: 0,
  joiningBonus: 0,
  performanceBonus: 0,
  retentionBonus: 0,
  rsus: 0,
  vestingSchedule: [
    { year: 1, percentage: 25 },
    { year: 2, percentage: 25 },
    { year: 3, percentage: 25 },
    { year: 4, percentage: 25 },
  ],
  employerPF: 0,
  employeePF: 0,
  hra: 0,
  gratuity: 0,
  specialAllowance: 0,
  reportedCTC: 0,
};

const cashFields: { key: keyof Offer; label: string }[] = [
  { key: "baseSalary", label: "Base salary" },
  { key: "joiningBonus", label: "Joining bonus" },
  { key: "performanceBonus", label: "Performance bonus" },
  { key: "retentionBonus", label: "Retention bonus" },
  { key: "hra", label: "HRA" },
  { key: "specialAllowance", label: "Special allowance" },
];

const equityFields: { key: keyof Offer; label: string }[] = [
  { key: "rsus", label: "RSU grant (total value)" },
  { key: "employerPF", label: "Employer PF" },
  { key: "employeePF", label: "Employee PF" },
  { key: "gratuity", label: "Gratuity (annual accrual)" },
  { key: "reportedCTC", label: "Reported CTC" },
];

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col text-xs text-zinc-500">
      {label}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 font-mono
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </label>
  );
}

export function OfferForm({ onSubmit, isLoading }: OfferFormProps) {
  const [offer, setOffer] = useState<Offer>(emptyOffer);

  function updateField(key: keyof Offer, value: string) {
    setOffer((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(offer);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SectionCard title="Company & role" icon={Building2}>
        <div className="grid grid-cols-3 gap-3">
          <input
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Company"
            value={offer.company}
            onChange={(e) => setOffer({ ...offer, company: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Role"
            value={offer.role}
            onChange={(e) => setOffer({ ...offer, role: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Location"
            value={offer.location}
            onChange={(e) => setOffer({ ...offer, location: e.target.value })}
            required
          />
        </div>
      </SectionCard>

      <SectionCard title="Cash compensation" icon={Wallet}>
        <div className="grid grid-cols-2 gap-3">
          {cashFields.map(({ key, label }) => (
            <NumberField
              key={key}
              label={label}
              value={offer[key] as number}
              onChange={(v) => updateField(key, v)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Equity & contributions" icon={Landmark}>
        <div className="grid grid-cols-2 gap-3">
          {equityFields.map(({ key, label }) => (
            <NumberField
              key={key}
              label={label}
              value={offer[key] as number}
              onChange={(v) => updateField(key, v)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Vesting schedule" icon={PieChart}>
        <p className="text-xs text-zinc-500 mb-3">Must total 100% across all years</p>
        <div className="grid grid-cols-4 gap-3">
          {offer.vestingSchedule.map((v, idx) => (
            <label key={v.year} className="flex flex-col text-xs text-zinc-500">
              Year {v.year}
              <input
                type="number"
                min={0}
                max={100}
                value={v.percentage}
                onChange={(e) => {
                  const updated = [...offer.vestingSchedule];
                  updated[idx] = { ...updated[idx], percentage: Number(e.target.value) || 0 };
                  setOffer({ ...offer, vestingSchedule: updated });
                }}
                className="mt-1 rounded-lg border border-zinc-200 px-2 py-2 text-sm font-mono text-center
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white
                   text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Calculating" : "Calculate breakdown"}
      </motion.button>
    </form>
  );
}
