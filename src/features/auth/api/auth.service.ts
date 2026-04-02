import api from '../../../services/api';
import type {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth.types';

// ── API response shape from PHP backend ───────────────────────────────
interface ApiLoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    image: string;
    password_change: number;
  };
}

/**
 * Authenticate a user with email and password.
 * POST /auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<ApiLoginResponse>('/auth/login', credentials);

  // Map PHP response shape to frontend AuthUser shape
  const nameParts = data.user.username.trim().split(' ');
  const firstName = nameParts[0] ?? data.user.username;
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    token: data.token,
    user: {
      id: String(data.user.id),
      firstName,
      lastName,
      email: data.user.email,
      role: 'student',
      avatarUrl: data.user.image || undefined,
    },
  };
}

/**
 * Request a password reset key.
 * POST /auth/forgot-password
 */
export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post('/auth/forgot-password', { email: request.email });
  return {
    message: data.message ?? 'Password reset key generated.',
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
