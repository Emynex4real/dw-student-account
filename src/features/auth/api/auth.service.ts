import { mockDelay } from '../../../services/mock';
import type {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth.types';

// ── Mock Data ──────────────────────────────────────────────────────────
// Hardcoded test credentials for development.
// These will be removed when the PHP backend is live.

const MOCK_USER = {
  id: 'usr_001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'student@university.edu',
  role: 'student' as const,
  avatarUrl: undefined,
};

const MOCK_TOKEN = 'mock-jwt-token-abc123def456';

// ── Service Functions ──────────────────────────────────────────────────

/**
 * Authenticate a user with email and password.
 *
 * PHP endpoint (future): POST /api/auth/login
 *
 * @throws Error with descriptive message on invalid credentials
 */
export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  // Simulate network latency
  await mockDelay(null, 600);

  // ACCEPT ALL: In mock mode, we grant access to any credentials provided.
  // This helps with rapid testing and demonstration.
  return {
    user: {
      ...MOCK_USER,
      email: credentials.email.toLowerCase(),
    },
    token: MOCK_TOKEN,
  };
}

/**
 * Request a password reset link.
 *
 * PHP endpoint (future): POST /api/auth/forgot-password
 */
export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  // Simulate network latency
  await mockDelay(null, 800);

  // In mock mode, always return success if email looks valid
  if (!request.email || !request.email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  return {
    message: `A password reset link has been sent to ${request.email}`,
    success: true,
  };
}

/**
 * Reset a user's password using a valid token.
 *
 * PHP endpoint (future): POST /api/auth/reset-password
 */
export async function resetPassword(
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  await mockDelay(null, 800);

  if (!request.token) {
    throw new Error('Invalid or expired reset link. Please request a new one.');
  }

  if (!request.password || request.password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  return {
    message: 'Your password has been reset successfully.',
    success: true,
  };
}
