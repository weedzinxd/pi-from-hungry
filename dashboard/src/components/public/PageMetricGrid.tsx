import type { LucideIcon } from 'lucide-react';
import { Panel, PanelBody } from '@/components/ui/Panel';

export function PageMetricGrid({
  items,
  columns = 'xl:grid-cols-3',
}: {
  items: Array<{ icon: LucideIcon; label: string; value: string; color: string }>;
  columns?: string;
}) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
      {items.map((item) => (
        <Panel key={item.label} className="card-hover">
          <PanelBody className="p-5">
            <item.icon className={`mb-3 h-8 w-8 ${item.color}`} />
            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-500">{item.label}</p>
          </PanelBody>
        </Panel>
      ))}
    </div>
  );
}
