import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout as logoutAction } from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // 1. Initial rehydration from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');

        if (savedUser && savedToken && savedUser !== 'undefined') {
          let parsed;
          try {
            parsed = JSON.parse(savedUser);
          } catch (parseErr) {
            // Only clear the corrupted key — keep the token and role intact
            console.warn('Corrupted user data in localStorage, clearing only user key');
            localStorage.removeItem('user');
            setLoading(false);
            return;
          }

          const userData = { ...parsed, token: savedToken, role: savedRole || parsed.role };
          setUser(userData);
          dispatch(loginSuccess(userData));
        }
      } catch (err) {
        console.error('Auth rehydration failed:', err);
        // Only remove individual keys — never use localStorage.clear() which wipes everything
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  const login = useCallback((userData) => {
    // Ensure we start with a clean slate to avoid role leakage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    const { token, role, ...rest } = userData;

    // Include role in the stored user object as a fallback for rehydration
    const userToStore = { ...rest, role };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || '');

    // Update internal state (include token for in-memory use)
    const cleanUser = { ...userToStore, token };
    setUser(cleanUser);

    // Sync with Redux
    dispatch(loginSuccess(cleanUser));
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    dispatch(logoutAction());
  }, [dispatch]);

  // 2. Listen for global auth failure events emitted by the axios interceptor
  //    (fired when any API call receives a 401 with an auth-failure message)
  useEffect(() => {
    const handleForcedLogout = (e) => {
      console.warn('Session invalidated by server:', e.detail?.reason);
      logout();
    };
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, [logout]);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
