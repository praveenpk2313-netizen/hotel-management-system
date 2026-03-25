import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout as logoutAction } from '../redux/slices/authSlice';

const AuthContext = createContext();

/**
 * Rehydrates auth state synchronously from localStorage.
 * Used during initialization to prevent "flash of unauthenticated" on refresh.
 */
const getInitialAuthState = () => {
  try {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedUser && savedToken && savedUser !== 'undefined') {
      const parsed = JSON.parse(savedUser);
      return { 
        ...parsed, 
        token: savedToken, 
        role: savedRole || parsed.role 
      };
    }
  } catch (err) {
    console.error('Initial auth rehydration failed:', err);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialAuthState);
  const [loading, setLoading] = useState(false); 
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Flag that we've finished the initial rehydration check
    setIsInitialized(true);
  }, []);

  // 1. Double-check synchronization with Redux on mount
  useEffect(() => {
    if (user) {
      dispatch(loginSuccess(user));
    }
  }, [dispatch]); // Only run on first mount

  const login = useCallback((userData) => {
    // 1. Wipe everything to ensure no cross-role leakage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    const { token, role, ...rest } = userData;
    const userToStore = { ...rest, role };

    // 2. Persist to storage immediately (Sync)
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || '');

    // 3. Update Sync context state 
    const fullUserData = { ...userToStore, token };
    setUser(fullUserData);

    // 4. Update Redux (Sync in RTK) ──────────────
    dispatch(loginSuccess(fullUserData));
    
    // 5. Audit Log
    console.log('Session established for:', role);
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    dispatch(logoutAction());
    
    // Explicitly reset other slices if they shouldn't persist
    dispatch({ type: 'manager/clearManagerData' });
    dispatch({ type: 'admin/clearAdminData' });
  }, [dispatch]);

  // Listen for global auth failure events (e.g. from axios 401 interceptor)
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
