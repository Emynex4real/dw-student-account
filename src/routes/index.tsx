import React, { lazy, Suspense } from 'react';
// import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom';

/* ── Layouts ─────────────────────────────────────────────────── */
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from '../components/ErrorPage';

/* ── Lazy-loaded Pages ───────────────────────────────────────── */
const LoginPage = lazy(
  () => import('../features/auth/components/LoginPage'),
);
const ForgotPasswordPage = lazy(
  () => import('../features/auth/components/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(
  () => import('../features/auth/components/ResetPasswordPage'),
);
const DashboardPage = lazy(
  () => import('../features/dashboard/components/DashboardPage'),
);
const ProfilePage = lazy(
  () => import('../features/profile/components/ProfilePage'),
);
const CoursesPage = lazy(
  () => import('../features/courses/components/CoursesPage'),
);
const MarketingPage = lazy(
  () => import('../features/marketing/components/MarketingPage'),
);
const PortfoliosPage = lazy(
  () => import('../features/portfolios/components/PortfoliosPage'),
);
const ClassesPage = lazy(
  () => import('../features/classes/components/ClassesPage'),
);
const EventsPage = lazy(
  () => import('../features/events/components/EventsPage'),
);
const ExaminationsPage = lazy(
  () => import('../features/examinations/components/ExaminationsPage'),
);
const ExamInstructionsWrapper = lazy(
  () => import('../features/examinations/components/ExamInstructionsWrapper'),
);
const ExamInterface = lazy(
  () => import('../features/examinations/components/ExamInterface'),
);
const ExamResults = lazy(
  () => import('../features/examinations/components/ExamResults'),
);
const ExamReview = lazy(
  () => import('../features/examinations/components/ExamReview'),
);

/* ── Loading Fallback ────────────────────────────────────────── */
const PageLoader: React.FC = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

/* ── Suspense Wrapper ────────────────────────────────────────── */
const Suspended = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/* ── Route Definitions ───────────────────────────────────────── */
const routes: RouteObject[] = [
  // Public / Auth routes
  {
    path: '/login',
    element: (
      <Suspended>
        <LoginPage />
      </Suspended>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgot-password',
    element: (
      <Suspended>
        <ForgotPasswordPage />
      </Suspended>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/reset-password',
    element: (
      <Suspended>
        <ResetPasswordPage />
      </Suspended>
    ),
    errorElement: <ErrorPage />,
  },

  // Protected / Dashboard routes
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspended>
                <DashboardPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/profile',
            element: (
              <Suspended>
                <ProfilePage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/courses',
            element: (
              <Suspended>
                <CoursesPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/marketing',
            element: (
              <Suspended>
                <MarketingPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/portfolios',
            element: (
              <Suspended>
                <PortfoliosPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/classes',
            element: (
              <Suspended>
                <ClassesPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/events',
            element: (
              <Suspended>
                <EventsPage />
              </Suspended>
            ),
          },
          {
            path: '/dashboard/examinations',
            element: (
              <Suspended>
                <ExaminationsPage />
              </Suspended>
            ),
          },
        ],
      },
      // Exam routes (outside dashboard layout for full-screen)
      {
        path: '/exams/:examId/instructions',
        element: (
          <Suspended>
            <ExamInstructionsWrapper />
          </Suspended>
        ),
      },
      {
        path: '/exams/:examId/take',
        element: (
          <Suspended>
            <ExamInterface />
          </Suspended>
        ),
      },
      {
        path: '/exams/:examId/results',
        element: (
          <Suspended>
            <ExamResults />
          </Suspended>
        ),
      },
      {
        path: '/exams/:examId/review',
        element: (
          <Suspended>
            <ExamReview />
          </Suspended>
        ),
      },
      {
        path: '/exams',
        element: (
          <Suspended>
            <ExaminationsPage />
          </Suspended>
        ),
      },
      {
        element: <DashboardLayout />,
        children: [
        ],
      },
    ],
  },

  // Catch-all → redirect to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export const router = createBrowserRouter(routes);
