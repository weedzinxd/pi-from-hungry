import type { ReactNode } from 'react';

export function SectionIntro({ title, description, right }: { title: string; description: string; right?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">{description}</p>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
