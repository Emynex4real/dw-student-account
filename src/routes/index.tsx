import { lazy, Suspense } from 'react';
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
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: (
          <Suspended>
            <LoginPage />
          </Suspended>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspended>
            <ForgotPasswordPage />
          </Suspended>
        ),
      },
    ],
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
    ],
  },

  // Catch-all → redirect to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export const router = createBrowserRouter(routes);
