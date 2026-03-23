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
          const parsed = JSON.parse(savedUser);
          const userData = { ...parsed, token: savedToken, role: savedRole || parsed.role };
          
          setUser(userData);
          dispatch(loginSuccess(userData));
        }
      } catch (err) {
        console.error('Auth rehydration failed:', err);
        localStorage.clear();
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
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(rest));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || '');
    
    // Update internal state
    const cleanUser = { ...rest, token, role };
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
