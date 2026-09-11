import api from '../../../services/api';
import type {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
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

// Keep retrying for up to deadlineMs (default 60s) on network failures.
// Each attempt has a 15s timeout. Delays grow: 2s, 4s, 6s...
// Stops immediately if the server responds with an error (wrong password, etc.)
async function withDeadlineRetry<T>(fn: () => Promise<T>, deadlineMs = 60000): Promise<T> {
  const start = Date.now();
  let lastError: unknown;
  let attempt = 0;

  while (Date.now() - start < deadlineMs) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (err?.response?.status) throw err; // server error — never retry
      attempt++;
      const delay = Math.min(2000 * attempt, 8000);
      const timeLeft = deadlineMs - (Date.now() - start);
      if (timeLeft <= 0) break;
      await new Promise(res => setTimeout(res, Math.min(delay, timeLeft)));
    }
  }
  throw lastError;
}

/**
 * Authenticate a user with email and password.
 * Automatically retries up to 2× on network failures before giving up.
 * POST /auth/login
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await withDeadlineRetry(
    () => api.post<ApiLoginResponse>('/auth/login', credentials, { timeout: 30000 }),
    60000, // keep trying for up to 60 seconds on bad network
  );

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
  const { data } = await api.post('/auth/forgot-password', { email: request.email }, { timeout: 60000 });
  return {
    message: data.message ?? 'Reset link sent.',
    success: true,
  };
}

/**
 * Reset password using token from email.
 * POST /auth/reset-password
 */
export async function resetPassword({ token, password }: { token: string; password: string }): Promise<void> {
  await api.post('/auth/reset-password', { reset_key: token, password });
}

/**
 * Auto-login via a single-use scholarship handoff token, minted right after
 * a scholarship application succeeds — drops the applicant straight into
 * their dashboard without re-typing the password they just chose.
 * GET /auth/scholarship-handoff?token=...
 */
export async function scholarshipHandoffLogin(token: string): Promise<AuthResponse> {
  const { data } = await api.get<ApiLoginResponse>(
    `/auth/scholarship-handoff?token=${encodeURIComponent(token)}`,
  );

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
 * Auto-login via giveaway link.
 * GET /auth/giveaway?token=DigitalWorldTechAcademy&year=2
 */
export async function giveawayLogin(token: string, year: string): Promise<AuthResponse> {
  const { data } = await api.get<ApiLoginResponse & { user: { isGiveaway?: boolean } }>(
    `/auth/giveaway?token=${encodeURIComponent(token)}&year=${encodeURIComponent(year)}`,
  );

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
      isGiveaway: data.user.isGiveaway ?? false,
    },
  };
}
