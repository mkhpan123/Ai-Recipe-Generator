import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: PROTECTED ROUTE COMPONENT (components/ProtectedRoute.tsx)
 * ============================================================================
 * 1. What does this file do?
 *    - Wraps protected page components (Dashboard, Pantry, Recipe Generator, etc.).
 *    - If authentication is still loading (checking stored JWT), renders a spinner.
 *    - If user is not authenticated, redirects them to `/login`.
 *    - If authenticated, renders the requested page (`children`).
 *
 * 2. Interview Question:
 *    - "How do you protect routes in React?"
 *       -> "We create a wrapper component that reads the auth status from our AuthContext.
 *          If no valid user or token is found, we use `<Navigate to='/login' replace />`
 *          to prevent unauthorized viewing."
 * ============================================================================
 */

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading message="Verifying authentication session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
