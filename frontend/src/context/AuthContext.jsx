import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Swap this for real cookie/JWT handling once the FastAPI backend is wired
// up — for now it just persists whatever LoginPage/RegisterPage resolve
// with ({ token, user }) so a page refresh doesn't log the user out.
const STORAGE_KEY = 'transitops_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Starts true so ProtectedRoute can show a brief "checking session" state
  // instead of flashing the login page before localStorage has been read.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Called by LoginPage/RegisterPage's onLoginSuccess / onRegisterSuccess
  // with the { token, user } shape mockLoginRequest/mockRegisterRequest resolve.
  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = { user, token, isAuthenticated: !!token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
}
