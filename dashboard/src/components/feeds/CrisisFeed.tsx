'use client';

import { CheckCircle2, Radio } from 'lucide-react';
import { Panel, PanelHeader } from '@/components/ui/Panel';
import { SEVERITY_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';
import type { CrisisEvent } from '@/types/domain';

interface CrisisFeedProps {
  events: CrisisEvent[];
  selectedEventId: string | null;
  onSelect: (id: string) => void;
}

export function CrisisFeed({ events, selectedEventId, onSelect }: CrisisFeedProps) {
  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        title="FOCOS ATIVOS"
        right={<Radio className="w-4 h-4 text-emerald-400 animate-pulse" />}
      />
      <div className="max-h-[400px] overflow-y-auto">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelect(event.id)}
            className={`w-full text-left p-3 border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer transition ${selectedEventId === event.id ? 'bg-emerald-500/10' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[event.severity] }} />
              <span className="text-white text-sm font-medium">{event.location}</span>
              {event.gvcActive && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>{formatNumber(event.affected)} afetados</span>
              <span className="text-emerald-400">{formatNumber(event.peopleHelped)} ajudados</span>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}
