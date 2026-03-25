# CBT Exam System Documentation

## Overview
A comprehensive Computer-Based Testing (CBT) system for tech schools with industry-standard features including full-screen enforcement, tab switching detection, auto-save, multi-section support, and code question capabilities.

## Features

### Core Functionality
- ✅ Multiple question types (Multiple Choice, Multiple Select, True/False, Code Questions)
- ✅ Multi-section exams with separate timers
- ✅ Full-screen mode enforcement
- ✅ Tab switching detection and warnings
- ✅ Auto-save every 30 seconds
- ✅ Question flagging for review
- ✅ Progress tracking
- ✅ Randomized answer options
- ✅ Admin-controlled answer visibility
- ✅ Section-based results breakdown
- ✅ Certificate generation for passed exams

### Security Features
- Full-screen mode requirement
- Tab switch monitoring with configurable limits
- Session persistence
- Auto-submit on time expiration
- Visibility change detection

### User Experience
- Clean, distraction-free interface
- Question navigation sidebar
- Visual progress indicators
- Color-coded question status
- Responsive design
- Loading states
- Confirmation dialogs

## File Structure

```
examinations/
├── components/
│   ├── ExaminationsPage.tsx          # Exam list page
│   ├── ExamInstructions.tsx          # Pre-exam instructions
│   ├── ExamInstructionsWrapper.tsx   # Wrapper to load exam data
│   ├── ExamInterface.tsx             # Main exam taking interface
│   ├── ExamTimer.tsx                 # Countdown timer component
│   ├── QuestionDisplay.tsx           # Question renderer
│   ├── QuestionNavigation.tsx        # Sidebar navigation
│   ├── ExamResults.tsx               # Post-exam results
│   ├── ExamReview.tsx                # Answer review page
│   └── index.ts                      # Component exports
├── hooks/
│   ├── useExamTimer.ts               # Timer logic
│   ├── useAutoSave.ts                # Auto-save functionality
│   └── useExamSecurity.ts            # Security features
├── services/
│   └── examService.ts                # API service (mock + backend-ready)
├── store/
│   └── examStore.ts                  # Zustand state management
└── types/
    └── exam.types.ts                 # TypeScript interfaces

```

## Routes

- `/exams` - Exam list page
- `/exams/:examId/instructions` - Pre-exam instructions
- `/exams/:examId/take` - Exam interface (full-screen)
- `/exams/:examId/results` - Results page
- `/exams/:examId/review` - Answer review page

## State Management

Uses Zustand with localStorage persistence for:
- Current exam data
- Session state (answers, time, navigation)
- Tab switch count
- Full-screen status

## Question Types

### 1. Multiple Choice (Single Answer)
```typescript
{
  type: 'multiple-choice',
  options: [
    { id: 'a', text: 'Option A', isCorrect: true },
    { id: 'b', text: 'Option B', isCorrect: false }
  ]
}
```

### 2. Multiple Select (Multiple Answers)
```typescript
{
  type: 'multiple-select',
  options: [
    { id: 'a', text: 'Option A', isCorrect: true },
    { id: 'b', text: 'Option B', isCorrect: true }
  ]
}
```

### 3. True/False
```typescript
{
  type: 'true-false',
  options: [
    { id: 'true', text: 'True', isCorrect: true },
    { id: 'false', text: 'False', isCorrect: false }
  ]
}
```

### 4. Code Questions
```typescript
{
  type: 'code',
  code: 'function example() { ... }',
  language: 'javascript',
  options: [...]
}
```

## Exam Settings

```typescript
{
  allowReview: boolean;              // Allow reviewing answers after submission
  randomizeQuestions: boolean;       // Randomize question order
  randomizeOptions: boolean;         // Randomize answer options
  showResultsImmediately: boolean;   // Show results right after submission
  showCorrectAnswers: boolean;       // Admin-controlled answer visibility
  allowBackNavigation: boolean;      // Allow going back to previous questions
  fullScreenRequired: boolean;       // Enforce full-screen mode
  calculatorAllowed: boolean;        // Allow calculator tool
  maxTabSwitches: number;            // Maximum allowed tab switches
}
```

## Backend Integration

The system is designed to work with mock data but is ready for backend integration. Update these functions in `examService.ts`:

```typescript
// Get exam by ID
getExam: async (examId: string): Promise<Exam> => {
  return await fetch(`/api/exams/${examId}`).then(res => res.json());
}

// Submit exam
submitExam: async (examId: string, answers: Answer[]): Promise<ExamResult> => {
  return await fetch(`/api/exams/${examId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  }).then(res => res.json());
}

// Auto-save progress
saveProgress: async (examId: string, session: ExamSession): Promise<void> => {
  await fetch(`/api/exams/${examId}/progress`, {
    method: 'POST',
    body: JSON.stringify(session)
  });
}
```

## Usage

### Starting an Exam
1. Navigate to `/exams`
2. Click "Start Exam" on an active exam
3. Review instructions and system requirements
4. Agree to terms and click "Start Exam"
5. Exam opens in full-screen mode

### During Exam
- Answer questions by selecting options
- Use "Flag for Review" to mark questions
- Navigate using Previous/Next buttons or sidebar
- Timer counts down automatically
- Progress auto-saves every 30 seconds
- Tab switches are monitored

### Submitting Exam
- Click "Submit Exam" on last question
- Review submission summary
- Confirm submission
- View results immediately (if enabled)

### After Exam
- View score and performance breakdown
- Review answers (if admin allows)
- Download certificate (if passed)

## Customization

### Adding New Question Types
1. Add type to `QuestionType` in `exam.types.ts`
2. Update `QuestionDisplay.tsx` to render new type
3. Update answer validation logic

### Modifying Security Settings
Edit `useExamSecurity.ts` hook to add/modify security features.

### Styling
All components use Tailwind CSS. Modify classes to match your design system.

## Dependencies

- React 19.2.0
- React Router DOM 7.13.1
- Zustand 5.0.11 (state management)
- Lucide React (icons)
- Tailwind CSS (styling)

## Future Enhancements

- [ ] Built-in code editor (Monaco Editor)
- [ ] Calculator widget
- [ ] Scratch pad/notes
- [ ] Multi-language support
- [ ] Proctoring integration
- [ ] Analytics dashboard
- [ ] Question bank management
- [ ] Bulk import/export
- [ ] Real-time collaboration
- [ ] Video recording

## Support

For issues or questions, contact the development team.
