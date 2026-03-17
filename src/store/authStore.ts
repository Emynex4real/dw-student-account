import { create } from 'zustand';
import type { AuthUser } from '../features/auth/types/auth.types';

// ── Types ──────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

type AuthStore = AuthState & AuthActions;

// ── Persistence Helpers ────────────────────────────────────────────────
// Store token + user in localStorage so auth survives page refreshes.

const STORAGE_KEY_TOKEN = 'sp_auth_token';
const STORAGE_KEY_USER = 'sp_auth_user';

function loadPersistedAuth(): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEY_USER);
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;

    return {
      token,
      user,
      isAuthenticated: !!(token && user),
    };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
}

function persistAuth(user: AuthUser | null, token: string | null): void {
  if (token && user) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

// ── Store ──────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  ...loadPersistedAuth(),

  login: (user, token) => {
    persistAuth(user, token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    persistAuth(null, null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set((state) => {
      persistAuth(user, state.token);
      return { user };
    });
  },
}));
