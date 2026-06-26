import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const setAuthData = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    scheduleAutoLogout(newToken);
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const authData = response.data; // AuthResponse
    setAuthData(authData.token, {
      id: authData.id,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role
    });
    return authData;
  };

  const register = async (fullName, email, password) => {
    const response = await authService.register(fullName, email, password);
    return response.data;
  };

  const logout = async () => {
    await authService.logout();
    clearAuthData();
  };

  const scheduleAutoLogout = (authToken) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    const decoded = parseJwt(authToken);
    if (!decoded || !decoded.exp) return;

    const expirationTimeMs = decoded.exp * 1000;
    const delay = expirationTimeMs - Date.now();

    if (delay <= 0) {
      clearAuthData();
    } else {
      logoutTimerRef.current = setTimeout(() => {
        clearAuthData();
      }, delay);
    }
  };

  // Restore and validate session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      const decoded = parseJwt(savedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        scheduleAutoLogout(savedToken);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleExternalLogout = () => clearAuthData();
    window.addEventListener('auth-logout', handleExternalLogout);
    return () => window.removeEventListener('auth-logout', handleExternalLogout);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading, isAuthenticated, parseJwt }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
