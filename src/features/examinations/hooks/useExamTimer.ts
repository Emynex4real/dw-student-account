import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';

export const useExamTimer = (onTimeUp: () => void) => {
  const { session, updateTimeRemaining } = useExamStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session) return;

    intervalRef.current = setInterval(() => {
      const newTime = session.timeRemaining - 1;
      
      if (newTime <= 0) {
        updateTimeRemaining(0);
        onTimeUp();
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        updateTimeRemaining(newTime);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.timeRemaining, onTimeUp, updateTimeRemaining]);

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
