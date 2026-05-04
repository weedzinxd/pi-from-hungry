import type { Metadata } from 'next';
import { PiAppStudioShell } from '@/components/pi-app/PiAppStudioShell';

export const metadata: Metadata = {
  title: 'Pi From Hungry • Pi App Studio',
  description: 'Mini-app mobile-first para Pi Browser/App Studio com hotspots, intents demo, impacto e transparência.',
};

export default function PiAppPage() {
  return <PiAppStudioShell />;
}
