import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

export type User = {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  sessionError: string;
  login: (sessionToken: string, userData: User, expiresAt: number) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const currentToken = useRef<string | null>(null);

  const login = async (sessionToken: string, userData: User, expiresAt: number) => {
    setSessionError('');

    try {
      const session = {
        token: sessionToken,
        userId: userData.id,
        expiresAt,
      };
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync('session', JSON.stringify(session));
      }
      setToken(session.token);
      currentToken.current = session.token;
      setUser(userData);
    } catch {
      throw new Error('Unable to save your session. Please try again.');
    }
  };

  const logout = useCallback(async () => {
    setSessionError('');

    const sessionToken = currentToken.current;
    if (sessionToken) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
          signal: controller.signal,
        });
      } catch {
        setSessionError('Signed out locally. The server session will expire automatically.');
      } finally {
        clearTimeout(timeout);
      }
    }

    try {
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync('session');
        await SecureStore.deleteItemAsync('token');
      }
    } catch {
      setSessionError('Signed out, but the saved session could not be removed. Please try again before closing the app.');
    } finally {
      setToken(null);
      currentToken.current = null;
      setUser(null);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setAuthLoading(true);
    setSessionError('');

    try {
      if (!(await SecureStore.isAvailableAsync())) {
        return;
      }

      const savedSession = await SecureStore.getItemAsync('session');
      if (!savedSession) {
        return;
      }

      let session;
      try {
        session = JSON.parse(savedSession);
      } catch {
        await logout();
        return;
      }

      if (!session || typeof session.token !== 'string' || !session.token.trim() ||
          !Number.isInteger(session.userId) || session.userId < 1 ||
          typeof session.expiresAt !== 'number' || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) {
        await logout();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.status === 401 || response.status === 403 || response.status === 404) {
        await logout();
        return;
      }
      if (!response.ok) {
        throw new Error('Unable to restore your session. Please sign in again.');
      }

      const profile = await response.json();
      if (!profile || profile.id !== session.userId || typeof profile.name !== 'string' || typeof profile.email !== 'string') {
        throw new Error('The API returned an invalid profile.');
      }
      setToken(session.token);
      currentToken.current = session.token;
      setUser(profile);
    } catch (error) {
      setToken(null);
      currentToken.current = null;
      setUser(null);
      setSessionError(error instanceof Error ? error.message : 'Unable to restore your session.');
    } finally {
      setAuthLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, sessionError, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
