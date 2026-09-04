import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';

export const useAutoSave = (interval: number = 30000) => {
  const { session, saveSession } = useExamStore();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session) return;

    // Persist session timestamp to Zustand (already written to localStorage via persist middleware)
    timeoutRef.current = setInterval(() => {
      saveSession();
    }, interval);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [!!session, interval, saveSession]);

  return {
    lastSaved: session?.lastSaved || 0
  };
};
