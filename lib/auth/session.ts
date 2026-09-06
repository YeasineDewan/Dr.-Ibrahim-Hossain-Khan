'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { audit } from '@/lib/audit/logger';

const IDLE_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIMEOUT = 5 * 60 * 1000;

type SessionStatus = 'active' | 'idle-warning' | 'idle-locked' | 'expired';

interface SessionState {
  status: SessionStatus;
  lastActive: number;
  timeRemaining: number;
}

export function useSessionManager(userId: string | null) {
  const [state, setState] = useState<SessionState>({
    status: 'active',
    lastActive: Date.now(),
    timeRemaining: IDLE_TIMEOUT,
  });
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleActivity = useCallback(() => {
    if (state.status === 'idle-locked') return;

    setState((prev: SessionState) => ({
      ...prev,
      status: 'active',
      lastActive: Date.now(),
      timeRemaining: IDLE_TIMEOUT,
    }));

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);

    warningTimerRef.current = setTimeout(() => {
      setState((prev: SessionState) => ({
        ...prev,
        status: 'idle-warning',
        timeRemaining: WARNING_TIMEOUT,
      }));
    }, IDLE_TIMEOUT - WARNING_TIMEOUT);

    lockTimerRef.current = setTimeout(() => {
      setState((prev: SessionState) => ({
        ...prev,
        status: 'idle-locked',
        timeRemaining: 0,
      }));
      audit.logAuth(userId ?? 'unknown', 'session_timeout', 'failure');
    }, IDLE_TIMEOUT);
  }, [state.status, userId]);

  const extendSession = useCallback(() => {
    handleActivity();
  }, [handleActivity]);

  const lockSession = useCallback(() => {
    setState((prev: SessionState) => ({
      ...prev,
      status: 'idle-locked',
      timeRemaining: 0,
    }));
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [handleActivity]);

  useEffect(() => {
    handleActivity();
  }, [userId, handleActivity]);

  return {
    status: state.status,
    timeRemaining: state.timeRemaining,
    extendSession,
    lockSession,
    isIdle: state.status === 'idle-warning' || state.status === 'idle-locked',
  };
}
