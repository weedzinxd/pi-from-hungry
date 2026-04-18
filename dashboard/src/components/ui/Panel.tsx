import type { ReactNode } from 'react';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-zinc-800 bg-zinc-900 ${className}`}>{children}</div>;
}

export function PanelHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle ? <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function PanelBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
