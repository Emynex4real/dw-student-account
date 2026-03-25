import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';
import { examService } from '../services/examService';

export const useAutoSave = (interval: number = 30000) => {
  const { session, saveSession } = useExamStore();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session) return;

    const autoSave = async () => {
      try {
        await examService.saveProgress(session.examId, session);
        saveSession();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    timeoutRef.current = setInterval(autoSave, interval);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [session, interval, saveSession]);

  return {
    lastSaved: session?.lastSaved || 0
  };
};
