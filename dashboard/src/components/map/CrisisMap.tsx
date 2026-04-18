'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Satellite } from 'lucide-react';
import { SEVERITY_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';
import type { CrisisEvent } from '@/types/domain';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then((m) => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

export function LeafletCSS() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return null;
}

export function CrisisMap({
  events,
  selectedId,
  onSelect,
}: {
  events: CrisisEvent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[400px] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
        <Satellite className="w-12 h-12 text-cyan-400 animate-pulse" />
      </div>
    );
  }

  const tileUrl =
    mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="relative h-[400px] rounded-xl overflow-hidden border border-cyan-500/30">
      <div className="absolute top-2 left-2 z-[1000] bg-black/90 backdrop-blur rounded-lg p-1 flex gap-1 border border-cyan-500/50">
        <button onClick={() => setMapType('satellite')} className={`px-2 py-1 text-[10px] font-bold rounded ${mapType === 'satellite' ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>SAT</button>
        <button onClick={() => setMapType('street')} className={`px-2 py-1 text-[10px] font-bold rounded ${mapType === 'street' ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>MAP</button>
      </div>

      <MapContainer center={[15, 20]} zoom={3} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileUrl} />
        {events.map((event) => (
          <CircleMarker
            key={event.id}
            center={event.coordinates}
            radius={selectedId === event.id ? 15 : event.gvcActive ? 12 : 8}
            pathOptions={{ color: SEVERITY_COLORS[event.severity], fillColor: SEVERITY_COLORS[event.severity], fillOpacity: 0.7, weight: 2 }}
            eventHandlers={{ click: () => onSelect(event.id) }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-bold text-sm">{event.location}</h3>
                <p className="text-xs text-zinc-500">{event.country}</p>
                <div className="mt-2 text-xs">
                  <div>Afetados: {formatNumber(event.affected)}</div>
                  <div>Ajudados: {formatNumber(event.peopleHelped)}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
