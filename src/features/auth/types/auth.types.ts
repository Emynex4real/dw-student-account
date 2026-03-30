/**
 * Authentication feature TypeScript types.
 * These interfaces define the contract between the UI and the service layer.
 * When the PHP backend is ready, these types should match the API response shapes.
 */

/** Credentials submitted by the login form */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** The authenticated user object returned from the API */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
  avatarUrl?: string;
}

/** Response shape from the login endpoint */
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

/** Request shape for the forgot-password endpoint */
export interface ForgotPasswordRequest {
  email: string;
}

/** Response shape from the forgot-password endpoint */
export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

/** Request shape for the reset-password endpoint */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/** Response shape from the reset-password endpoint */
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

/** Possible authentication error */
export interface AuthError {
  message: string;
  code?: string;
}
