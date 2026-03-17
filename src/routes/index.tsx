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
const FeedbackPage = lazy(
  () => import('../features/feedback/components/FeedbackPage'),
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
            path: '/dashboard/feedback',
            element: (
              <Suspended>
                <FeedbackPage />
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
