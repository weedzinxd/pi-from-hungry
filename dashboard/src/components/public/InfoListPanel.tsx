import { CheckCircle2 } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';

export function InfoListPanel({
  title,
  subtitle,
  items,
  tone = 'emerald',
}: {
  title: string;
  subtitle: string;
  items: string[];
  tone?: 'emerald' | 'cyan';
}) {
  const toneClass = tone === 'cyan' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';

  return (
    <Panel>
      <PanelHeader title={title} subtitle={subtitle} />
      <PanelBody className="space-y-3">
        {items.map((item) => (
          <div key={item} className={`rounded-xl border p-4 text-sm leading-6 text-zinc-300 ${toneClass}`}>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${tone === 'cyan' ? 'text-cyan-400' : 'text-emerald-400'}`} />
              <span>{item}</span>
            </div>
          </div>
        ))}
      </PanelBody>
    </Panel>
  );
}
