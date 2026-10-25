import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

/**
 * One wrapper, reused everywhere a titled group of content appears.
 * Deliberately dumb: icon + title + children in a bordered card. Nothing
 * clever, which is the point — easy to point at and explain in an interview.
 */
export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-indigo-600" strokeWidth={2} />
        <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
