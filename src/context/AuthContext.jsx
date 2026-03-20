import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout as reduxLogout } from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    let parsedUser = saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    if (parsedUser && savedRole) {
      parsedUser.role = savedRole;
    }
    return parsedUser;
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Sync Redux on mount and finish loading
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole  = localStorage.getItem('role');
    
    if (user && savedToken) {
      dispatch(loginSuccess({ ...user, token: savedToken, role: savedRole || user.role }));
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Call after a successful login / OAuth callback.
   * Persists to localStorage AND syncs Redux.
   */
  const login = useCallback((userData) => {
    const { token, ...rest } = userData;
    setUser(userData);

    // --- localStorage ---
    localStorage.setItem('user',  JSON.stringify(rest));
    localStorage.setItem('token', token);
    localStorage.setItem('role',  userData.role || '');

    // --- Redux ---
    dispatch(loginSuccess({ ...rest, token, role: userData.role }));
  }, [dispatch]);

  /**
   * Clear everything on logout.
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch(reduxLogout());
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
