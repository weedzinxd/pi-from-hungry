import type { LucideIcon } from 'lucide-react';

export function MetricCard({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
      <Icon className={`mb-1 h-5 w-5 ${colorClass}`} />
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}
