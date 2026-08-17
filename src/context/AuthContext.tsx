import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: AUTH CONTEXT (context/AuthContext.tsx)
 * ============================================================================
 * 1. What does this file do?
 *    - Provides a global state for the currently authenticated user and their JWT.
 *    - Allows any component in the application to access `user`, `login()`, `register()`,
 *      and `logout()` without "prop drilling".
 *
 * 2. Key Interview Explanations:
 *    - "What is React Context API?"
 *       -> Context provides a way to pass data through the component tree without having
 *          to pass props down manually at every level.
 *    - "What happens on Page Refresh?"
 *       -> In `useEffect()`, we check if a JWT exists in `localStorage`. If found, we
 *          call `api.auth.getMe()` to restore the user session automatically.
 *    - "How does Logout work?"
 *       -> We remove the token from `localStorage` and reset the `user` state to `null`.
 * ============================================================================
 */

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify existing session on app load
  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
        } catch (error) {
          console.warn('Session expired or invalid, logging out:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    const res = await api.auth.register({ name, email, password, confirmPassword });
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
