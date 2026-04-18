export function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const toneClass = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
    danger: 'border-red-500/40 bg-red-500/10 text-red-400',
    neutral: 'border-zinc-700 bg-zinc-800/60 text-zinc-300',
  }[tone];

  return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneClass}`}>{label}</span>;
}
