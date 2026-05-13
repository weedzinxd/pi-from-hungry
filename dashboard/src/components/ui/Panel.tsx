import type { ReactNode } from 'react';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/95 shadow-[0_10px_35px_-20px_rgba(16,185,129,0.18)] ${className}`}>{children}</div>;
}

export function PanelHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function PanelBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
