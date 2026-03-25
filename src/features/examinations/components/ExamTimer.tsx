import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useExamTimer } from '../hooks/useExamTimer';

interface ExamTimerProps {
  onTimeUp: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({ onTimeUp }) => {
  const { formattedTime, isLowTime } = useExamTimer(onTimeUp);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
      isLowTime 
        ? 'bg-red-100 text-red-700 border-2 border-red-300 animate-pulse' 
        : 'bg-gray-100 text-gray-900 border border-gray-300'
    }`}>
      {isLowTime ? <AlertTriangle size={18} /> : <Clock size={18} />}
      <span className="text-lg">{formattedTime}</span>
    </div>
  );
};
