import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  sessionError: string;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  const login = async (accessToken: string, userData: User) => {
    setSessionError('');

    try {
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync('token', accessToken);
      }
      setToken(accessToken);
      setUser(userData);
    } catch {
      throw new Error('Unable to save your session. Please try again.');
    }
  };

  const logout = useCallback(async () => {
    setSessionError('');

    try {
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync('token');
      }
    } catch {
      setSessionError('Signed out, but the saved session could not be removed. Please try again before closing the app.');
    } finally {
      setToken(null);
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

      const savedToken = await SecureStore.getItemAsync('token');
      if (!savedToken) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (response.status === 401 || response.status === 403) {
        await logout();
        return;
      }
      if (!response.ok) {
        throw new Error('Unable to restore your session. Please sign in again.');
      }

      const profile = await response.json();
      if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
        throw new Error('The API returned an invalid profile.');
      }
      setToken(savedToken);
      setUser(profile);
    } catch (error) {
      setToken(null);
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
