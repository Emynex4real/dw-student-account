import { mockDelay } from '../../../services/mock';
import type {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
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
