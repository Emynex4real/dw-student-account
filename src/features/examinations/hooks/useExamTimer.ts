import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';

export const useExamTimer = (onTimeUp: () => void) => {
  const { session, updateTimeRemaining } = useExamStore();
  const intervalRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp; // always up-to-date without restarting the interval

  useEffect(() => {
    if (!session) return;

    // Run a single stable interval — read fresh state via getState() each tick
    intervalRef.current = setInterval(() => {
      const current = useExamStore.getState().session;
      if (!current) return;
      const newTime = current.timeRemaining - 1;
      if (newTime <= 0) {
        updateTimeRemaining(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onTimeUpRef.current();
      } else {
        updateTimeRemaining(newTime);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // Only (re)start when a session begins — not on every tick
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!session]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining: session?.timeRemaining || 0,
    formattedTime: formatTime(session?.timeRemaining || 0),
    isLowTime: (session?.timeRemaining || 0) < 300 // Less than 5 minutes
  };
};
