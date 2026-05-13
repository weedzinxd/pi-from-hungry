import type { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  title,
  description,
  pills,
  right,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  pills?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_25%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(10,10,10,0.96))] px-6 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">{eyebrow}</p> : null}
          {pills ? <div className="mb-4 flex flex-wrap gap-2">{pills}</div> : null}
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">{description}</p>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </section>
  );
}
