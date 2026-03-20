import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * OAuthCallback
 *
 * Handles the redirect from the server after Google / GitHub OAuth.
 * Two operating modes:
 *
 *   1. Popup mode  (window.opener exists)
 *      → post a message to the parent window, then close this tab.
 *
 *   2. Full-page mode  (no opener, e.g. mobile or opened directly)
 *      → parse the user data, call login(), and redirect.
 */
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const dataString = searchParams.get('data');
    const errorParam = searchParams.get('error');

    // ── Error path ─────────────────────────────────────────────────────────
    if (errorParam || !dataString) {
      const message = errorParam === 'oauth_failed'
        ? 'OAuth authentication failed. Please try again.'
        : (errorParam || 'Authentication failed');

      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', message }, window.location.origin || '*');
        setTimeout(() => window.close(), 150);
      } else {
        navigate(`/login?error=oauth_failed`, { replace: true });
      }
      return;
    }

    // ── Success path ───────────────────────────────────────────────────────
    if (window.opener) {
      // Pass the raw encoded string to the parent; it will decode & parse it.
      window.opener.postMessage(
        { type: 'OAUTH_SUCCESS', payload: dataString },
        window.location.origin || '*'
      );
      setTimeout(() => window.close(), 150);
    } else {
      // Full-page flow
      try {
        const userData = JSON.parse(decodeURIComponent(dataString));
        login(userData);   // persists to localStorage + Redux

        const destination =
          userData.role === 'admin'   ? '/admin/dashboard'   :
          userData.role === 'manager' ? '/manager/dashboard' :
          '/customer/dashboard';

        navigate(destination, { replace: true });
      } catch (err) {
        console.error('Failed to parse OAuth data:', err);
        navigate('/login?error=oauth_failed', { replace: true });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      height:'100vh',
      gap:'1.5rem',
      background:'linear-gradient(135deg,#f8fafc,#f1f5f9)',
    }}>
      {/* Spinner */}
      <div style={{
        width:'52px', height:'52px',
        borderRadius:'50%',
        border:'4px solid #e2e8f0',
        borderTopColor:'#f59e0b',
        animation:'spin 0.8s linear infinite',
      }} />

      <p style={{ color:'#64748b', fontSize:'1rem', fontWeight:'500', margin:0 }}>
        Completing authentication…
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OAuthCallback;
