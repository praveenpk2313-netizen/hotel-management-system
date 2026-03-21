import { createSlice } from '@reduxjs/toolkit';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const loadFromStorage = () => {
  try {
    const user  = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    let parsedUser = user && user !== 'undefined' ? JSON.parse(user) : null;
    if (parsedUser && role) {
      parsedUser.role = role;
    }
    
    return {
      user:  parsedUser,
      token: token || null,
      role:  role  || null,
    };
  } catch {
    return { user: null, token: null, role: null };
  }
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const { user, token, role } = loadFromStorage();

const initialState = {
  user,
  token,
  role,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Set loading + clear any previous error before a request */
    loginStart: (state) => {
      state.loading = true;
      state.error   = null;
    },

    /** Persist a successful login to state and sessionStorage */
    loginSuccess: (state, action) => {
      const { token, role, ...rest } = action.payload;
      state.loading = false;
      state.error   = null;
      state.user    = rest;
      state.token   = token;
      state.role    = role;

      // localStorage is the single source of truth for page-refresh rehydration
      localStorage.setItem('user',  JSON.stringify(rest));
      localStorage.setItem('token', token);
      localStorage.setItem('role',  role || '');
    },

    /** Record a login error */
    loginFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    /** Full logout — wipe state and storage */
    logout: (state) => {
      state.user    = null;
      state.token   = null;
      state.role    = null;
      state.loading = false;
      state.error   = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },

    /**
     * Lightweight credential update (e.g. after profile update that issues a
     * fresh token) without touching other state.
     */
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      if (user  !== undefined) state.user  = user;
      if (token !== undefined) state.token = token;
      if (role  !== undefined) state.role  = role;

      if (token) localStorage.setItem('token', token);
      if (role)  localStorage.setItem('role',  role);
      if (user)  localStorage.setItem('user',  JSON.stringify(user));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setCredentials,
} = authSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCurrentUser  = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole  = (state) => state.auth.role;
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;

export default authSlice.reducer;
