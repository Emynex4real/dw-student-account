import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamInstructions } from './ExamInstructions';
import { examService } from '../services/examService';
import type { Exam } from '../types/exam.types';

const ExamInstructionsWrapper: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const examData = await examService.getExam(examId!);
        setExam(examData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam:', error);
        navigate('/exams');
      }
    };

    loadExam();
  }, [examId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f7941d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  return <ExamInstructions exam={exam} />;
};

export default ExamInstructionsWrapper;
