'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PiAuthResult } from '@/types/pi-sdk';
import { authenticatePiUser, initPiSdk, isPiBrowserEnvironment, loadPiSdk } from '@/lib/pi-sdk';

export function usePiBrowser() {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [user, setUser] = useState<PiAuthResult['user'] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const ready = await loadPiSdk();
      if (!mounted) return;
      if (ready) {
        initPiSdk();
      }
      setSdkReady(ready);
      setLoading(false);
    }

    boot().catch(() => {
      if (mounted) {
        setSdkReady(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = useCallback(async () => {
    setAuthenticating(true);
    const result = await authenticatePiUser();
    setUser(result?.user ?? null);
    setAuthenticating(false);
    return result;
  }, []);

  return {
    sdkReady,
    loading,
    authenticating,
    user,
    isPiBrowser: useMemo(() => isPiBrowserEnvironment(), []),
    authenticate,
  };
}
