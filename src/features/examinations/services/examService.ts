import type { Exam, ExamResult } from '../types/exam.types';

// Mock exam data
export const mockExamData: Exam = {
  id: '1',
  title: 'Frontend React Certification Exam',
  course: 'Advanced Web Development',
  description: 'Comprehensive assessment covering React fundamentals, hooks, state management, and best practices.',
  totalDuration: 120,
  totalQuestions: 20,
  passingScore: 75,
  sections: [
    {
      id: 'section-1',
      title: 'React Fundamentals',
      description: 'Core concepts and component basics',
      duration: 40,
      questions: [
        {
          id: 'q1',
          sectionId: 'section-1',
          type: 'multiple-choice',
          text: 'What is the primary purpose of React?',
          options: [
            { id: 'a', text: 'To build user interfaces', isCorrect: true },
            { id: 'b', text: 'To manage databases', isCorrect: false },
            { id: 'c', text: 'To handle server-side logic', isCorrect: false },
            { id: 'd', text: 'To style web pages', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'React is a JavaScript library for building user interfaces, particularly single-page applications.'
        },
        {
          id: 'q2',
          sectionId: 'section-1',
          type: 'multiple-select',
          text: 'Which of the following are valid React hooks? (Select all that apply)',
          options: [
            { id: 'a', text: 'useState', isCorrect: true },
            { id: 'b', text: 'useEffect', isCorrect: true },
            { id: 'c', text: 'useComponent', isCorrect: false },
            { id: 'd', text: 'useContext', isCorrect: true }
          ],
          points: 5,
          correctAnswer: ['a', 'b', 'd'],
          explanation: 'useState, useEffect, and useContext are built-in React hooks. useComponent does not exist.'
        },
        {
          id: 'q3',
          sectionId: 'section-1',
          type: 'true-false',
          text: 'React components must always return JSX.',
          options: [
            { id: 'true', text: 'True', isCorrect: false },
            { id: 'false', text: 'False', isCorrect: true }
          ],
          points: 5,
          correctAnswer: 'false',
          explanation: 'React components can return JSX, strings, numbers, null, or arrays of elements.'
        },
        {
          id: 'q4',
          sectionId: 'section-1',
          type: 'multiple-choice',
          text: 'What is the virtual DOM in React?',
          options: [
            { id: 'a', text: 'A lightweight copy of the actual DOM', isCorrect: true },
            { id: 'b', text: 'A database for storing component state', isCorrect: false },
            { id: 'c', text: 'A CSS framework', isCorrect: false },
            { id: 'd', text: 'A testing library', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'The virtual DOM is a lightweight representation of the actual DOM that React uses for efficient updates.'
        },
        {
          id: 'q5',
          sectionId: 'section-1',
          type: 'multiple-choice',
          text: 'Which method is used to update state in a class component?',
          options: [
            { id: 'a', text: 'this.state = newState', isCorrect: false },
            { id: 'b', text: 'this.setState()', isCorrect: true },
            { id: 'c', text: 'this.updateState()', isCorrect: false },
            { id: 'd', text: 'this.changeState()', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'b',
          explanation: 'this.setState() is the correct method to update state in React class components.'
        }
      ]
    },
    {
      id: 'section-2',
      title: 'React Hooks & State Management',
      description: 'Advanced hooks and state management patterns',
      duration: 40,
      questions: [
        {
          id: 'q6',
          sectionId: 'section-2',
          type: 'code',
          text: 'What will be logged to the console when this component mounts?',
          code: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Effect running');
    setCount(count + 1);
  }, []);
  
  return <div>{count}</div>;
}`,
          language: 'javascript',
          options: [
            { id: 'a', text: 'Effect running (once)', isCorrect: true },
            { id: 'b', text: 'Effect running (infinite loop)', isCorrect: false },
            { id: 'c', text: 'Nothing', isCorrect: false },
            { id: 'd', text: 'Error', isCorrect: false }
          ],
          points: 10,
          correctAnswer: 'a',
          explanation: 'The empty dependency array [] means the effect runs only once on mount.'
        },
        {
          id: 'q7',
          sectionId: 'section-2',
          type: 'multiple-choice',
          text: 'What is the purpose of the useEffect cleanup function?',
          options: [
            { id: 'a', text: 'To prevent memory leaks and clean up subscriptions', isCorrect: true },
            { id: 'b', text: 'To reset component state', isCorrect: false },
            { id: 'c', text: 'To optimize performance', isCorrect: false },
            { id: 'd', text: 'To handle errors', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'Cleanup functions prevent memory leaks by cleaning up subscriptions, timers, and event listeners.'
        },
        {
          id: 'q8',
          sectionId: 'section-2',
          type: 'multiple-select',
          text: 'Which statements about useCallback are true? (Select all that apply)',
          options: [
            { id: 'a', text: 'It memoizes functions', isCorrect: true },
            { id: 'b', text: 'It prevents unnecessary re-renders', isCorrect: true },
            { id: 'c', text: 'It replaces useState', isCorrect: false },
            { id: 'd', text: 'It requires a dependency array', isCorrect: true }
          ],
          points: 5,
          correctAnswer: ['a', 'b', 'd'],
          explanation: 'useCallback memoizes functions to prevent unnecessary re-renders and requires a dependency array.'
        },
        {
          id: 'q9',
          sectionId: 'section-2',
          type: 'multiple-choice',
          text: 'What is the correct way to update state based on previous state?',
          options: [
            { id: 'a', text: 'setState(state + 1)', isCorrect: false },
            { id: 'b', text: 'setState(prevState => prevState + 1)', isCorrect: true },
            { id: 'c', text: 'setState(this.state + 1)', isCorrect: false },
            { id: 'd', text: 'state = state + 1', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'b',
          explanation: 'Using the functional form ensures you always work with the latest state value.'
        },
        {
          id: 'q10',
          sectionId: 'section-2',
          type: 'true-false',
          text: 'useContext can be used to avoid prop drilling.',
          options: [
            { id: 'true', text: 'True', isCorrect: true },
            { id: 'false', text: 'False', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'true',
          explanation: 'useContext allows you to share data across components without passing props through every level.'
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Advanced Concepts & Best Practices',
      description: 'Performance optimization and production patterns',
      duration: 40,
      questions: [
        {
          id: 'q11',
          sectionId: 'section-3',
          type: 'multiple-choice',
          text: 'What is the purpose of React.memo()?',
          options: [
            { id: 'a', text: 'To memoize component rendering', isCorrect: true },
            { id: 'b', text: 'To store data in memory', isCorrect: false },
            { id: 'c', text: 'To create memos for developers', isCorrect: false },
            { id: 'd', text: 'To manage component state', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'React.memo() is a higher-order component that memoizes the result to prevent unnecessary re-renders.'
        },
        {
          id: 'q12',
          sectionId: 'section-3',
          type: 'code',
          text: 'What optimization technique is being used in this code?',
          code: `const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <p key={item.id}>{item.name}</p>)}</div>;
});`,
          language: 'javascript',
          options: [
            { id: 'a', text: 'Component memoization', isCorrect: true },
            { id: 'b', text: 'Lazy loading', isCorrect: false },
            { id: 'c', text: 'Code splitting', isCorrect: false },
            { id: 'd', text: 'Server-side rendering', isCorrect: false }
          ],
          points: 10,
          correctAnswer: 'a',
          explanation: 'React.memo() is used to memoize the component and prevent re-renders when props haven\'t changed.'
        },
        {
          id: 'q13',
          sectionId: 'section-3',
          type: 'multiple-select',
          text: 'Which are valid ways to optimize React performance? (Select all that apply)',
          options: [
            { id: 'a', text: 'Using React.lazy for code splitting', isCorrect: true },
            { id: 'b', text: 'Implementing useMemo for expensive calculations', isCorrect: true },
            { id: 'c', text: 'Avoiding keys in lists', isCorrect: false },
            { id: 'd', text: 'Using the React DevTools Profiler', isCorrect: true }
          ],
          points: 5,
          correctAnswer: ['a', 'b', 'd'],
          explanation: 'Code splitting, memoization, and profiling are valid optimization techniques. Keys are required for lists.'
        },
        {
          id: 'q14',
          sectionId: 'section-3',
          type: 'multiple-choice',
          text: 'What is the purpose of the key prop in React lists?',
          options: [
            { id: 'a', text: 'To help React identify which items have changed', isCorrect: true },
            { id: 'b', text: 'To style list items', isCorrect: false },
            { id: 'c', text: 'To sort the list', isCorrect: false },
            { id: 'd', text: 'To encrypt data', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'Keys help React identify which items have changed, been added, or removed for efficient updates.'
        },
        {
          id: 'q15',
          sectionId: 'section-3',
          type: 'true-false',
          text: 'React automatically batches multiple setState calls in event handlers.',
          options: [
            { id: 'true', text: 'True', isCorrect: true },
            { id: 'false', text: 'False', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'true',
          explanation: 'React batches multiple setState calls in event handlers for better performance.'
        },
        {
          id: 'q16',
          sectionId: 'section-3',
          type: 'multiple-choice',
          text: 'Which hook would you use to store a mutable value that persists across renders?',
          options: [
            { id: 'a', text: 'useState', isCorrect: false },
            { id: 'b', text: 'useRef', isCorrect: true },
            { id: 'c', text: 'useMemo', isCorrect: false },
            { id: 'd', text: 'useEffect', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'b',
          explanation: 'useRef creates a mutable reference that persists across renders without causing re-renders.'
        },
        {
          id: 'q17',
          sectionId: 'section-3',
          type: 'multiple-choice',
          text: 'What is prop drilling?',
          options: [
            { id: 'a', text: 'Passing props through multiple component levels', isCorrect: true },
            { id: 'b', text: 'A performance optimization technique', isCorrect: false },
            { id: 'c', text: 'A way to validate props', isCorrect: false },
            { id: 'd', text: 'A testing methodology', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'a',
          explanation: 'Prop drilling refers to passing props through multiple levels of components to reach a deeply nested child.'
        },
        {
          id: 'q18',
          sectionId: 'section-3',
          type: 'multiple-select',
          text: 'Which are benefits of using TypeScript with React? (Select all that apply)',
          options: [
            { id: 'a', text: 'Type safety', isCorrect: true },
            { id: 'b', text: 'Better IDE autocomplete', isCorrect: true },
            { id: 'c', text: 'Faster runtime performance', isCorrect: false },
            { id: 'd', text: 'Catch errors at compile time', isCorrect: true }
          ],
          points: 5,
          correctAnswer: ['a', 'b', 'd'],
          explanation: 'TypeScript provides type safety, better tooling, and compile-time error detection, but doesn\'t affect runtime performance.'
        },
        {
          id: 'q19',
          sectionId: 'section-3',
          type: 'code',
          text: 'What pattern is demonstrated in this code?',
          code: `function App() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  
  return <Dashboard theme={theme} user={user} />;
}`,
          language: 'javascript',
          options: [
            { id: 'a', text: 'Context API usage', isCorrect: true },
            { id: 'b', text: 'Higher-order component', isCorrect: false },
            { id: 'c', text: 'Render props', isCorrect: false },
            { id: 'd', text: 'Component composition', isCorrect: false }
          ],
          points: 10,
          correctAnswer: 'a',
          explanation: 'This code demonstrates using the Context API with useContext hook to access shared data.'
        },
        {
          id: 'q20',
          sectionId: 'section-3',
          type: 'true-false',
          text: 'Custom hooks must start with the word "use".',
          options: [
            { id: 'true', text: 'True', isCorrect: true },
            { id: 'false', text: 'False', isCorrect: false }
          ],
          points: 5,
          correctAnswer: 'true',
          explanation: 'Custom hooks must start with "use" to follow React conventions and enable linting rules.'
        }
      ]
    }
  ],
  settings: {
    allowReview: true,
    randomizeQuestions: false,
    randomizeOptions: true,
    showResultsImmediately: true,
    showCorrectAnswers: true,
    allowBackNavigation: true,
    fullScreenRequired: true,
    calculatorAllowed: false,
    maxTabSwitches: 3
  },
  deadline: 'Mar 18, 2026 - 11:59 PM'
};

export const examService = {
  getExam: async (examId: string): Promise<Exam> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExamData), 500);
    });
  },

  submitExam: async (examId: string, answers: any[]): Promise<ExamResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalPoints = 100;
        const earnedPoints = 85;
        const score = (earnedPoints / totalPoints) * 100;
        
        resolve({
          examId,
          studentId: 'student-123',
          score,
          totalPoints,
          earnedPoints,
          passed: score >= mockExamData.passingScore,
          completedAt: new Date().toISOString(),
          timeSpent: 3600,
          answers,
          sectionResults: [
            { sectionId: 'section-1', sectionTitle: 'React Fundamentals', score: 90, totalPoints: 25, earnedPoints: 22 },
            { sectionId: 'section-2', sectionTitle: 'React Hooks', score: 85, totalPoints: 40, earnedPoints: 34 },
            { sectionId: 'section-3', sectionTitle: 'Advanced Concepts', score: 82, totalPoints: 35, earnedPoints: 29 }
          ]
        });
      }, 1000);
    });
  },

  saveProgress: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  }
};
