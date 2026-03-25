import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout as logoutAction } from '../redux/slices/authSlice';

const AuthContext = createContext();

/**
 * Rehydrates auth state synchronously from sessionStorage.
 * Used during initialization to prevent "flash of unauthenticated" on refresh.
 * Switching to sessionStorage ensures that different tabs can have independent 
 * sessions (e.g. Admin in Tab 1, Customer in Tab 2) without leakage.
 */
const getInitialAuthState = () => {
  try {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');
    const savedRole = sessionStorage.getItem('role');

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
    // 1. Wipe everything in THIS tab's session
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    const { token, role, ...rest } = userData;
    const userToStore = { ...rest, role };

    // 2. Persist to sessionStorage (Tab-specific)
    sessionStorage.setItem('user', JSON.stringify(userToStore));
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role || '');

    // 3. Update Sync context state 
    const fullUserData = { ...userToStore, token };
    setUser(fullUserData);

    // 4. Update Redux (Sync in RTK)
    dispatch(loginSuccess(fullUserData));
    
    console.log('Session established for:', role, 'in this tab.');
  }, [dispatch]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setUser(null);
    dispatch(logoutAction());
    
    dispatch({ type: 'manager/clearManagerData' });
    dispatch({ type: 'admin/clearAdminData' });
  }, [dispatch]);

  // Listen for global auth failure events
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
      sessionStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isInitialized, login, logout, updateUser }}>
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
