import type { PiAuthResult } from '@/types/pi-sdk';

const PI_SDK_URL = 'https://sdk.minepi.com/pi-sdk.js';
let initialized = false;

export async function loadPiSdk(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.Pi) {
    return true;
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${PI_SDK_URL}"]`);
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(Boolean(window.Pi)), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      setTimeout(() => resolve(Boolean(window.Pi)), 2500);
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = PI_SDK_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Pi));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function initPiSdk() {
  if (typeof window === 'undefined' || !window.Pi || initialized) {
    return;
  }

  const sandbox = (process.env.NEXT_PUBLIC_PI_SANDBOX ?? 'true') === 'true';
  window.Pi.init({ version: '2.0', sandbox });
  initialized = true;
}

export async function authenticatePiUser(): Promise<PiAuthResult | null> {
  if (typeof window === 'undefined' || !window.Pi) {
    return null;
  }

  initPiSdk();

  try {
    return await window.Pi.authenticate(['username', 'payments']);
  } catch {
    return null;
  }
}

export function isPiBrowserEnvironment() {
  if (typeof window === 'undefined') {
    return false;
  }

  const agent = window.navigator.userAgent.toLowerCase();
  return agent.includes('pi browser') || agent.includes('pibrowser') || Boolean(window.Pi);
}
