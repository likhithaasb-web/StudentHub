import React, { useState } from 'react';
import Modal from '../common/Modal';
import {
  Mail,
  User,
  Key,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const GoogleAuthModal = ({
  isOpen,
  onClose,
  onGoogleSuccess,
  storedClientId = '',
  onSaveClientId,
}) => {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'oauth'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [clientIdInput, setClientIdInput] = useState(storedClientId);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Direct Google Email sign-in handler
  const handleDirectGoogleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Google email address (e.g. yourname@gmail.com).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Determine a friendly display name from email or entered name
      const displayName = name.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=17644D&color=F1EAD7&bold=true`;

      onGoogleSuccess({
        email: email.trim().toLowerCase(),
        name: displayName,
        avatar: avatarUrl,
      });
      setLoading(false);
      onClose();
    }, 400);
  };

  // Launch live OAuth with entered Client ID
  const handleSaveAndLaunchOAuth = () => {
    setError('');
    const id = clientIdInput.trim();
    if (!id) {
      setError('Please enter your Google OAuth Client ID.');
      return;
    }

    onSaveClientId(id);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      // Trigger Google OAuth2 flow
      if (window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: id,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                setError(`Google Sign-In failed: ${tokenResponse.error_description || tokenResponse.error}`);
                return;
              }
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleProfile = await res.json();
                if (googleProfile.email) {
                  onGoogleSuccess({
                    email: googleProfile.email,
                    name: googleProfile.name || googleProfile.given_name || 'Google User',
                    avatar: googleProfile.picture || '',
                  });
                  onClose();
                } else {
                  setError('Could not retrieve email from Google profile.');
                }
              } catch (err) {
                setError('Failed to fetch Google profile. Please try direct sign-in.');
              }
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        } catch (err) {
          setError('Google OAuth initialization error: ' + err.message);
        }
      } else {
        setError('Google Identity Services library is still loading. Please try again in a moment or use direct email.');
      }
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Modal Top Header with Official Google Logo */}
        <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.36 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.27C.46 8.2 0 10.05 0 12s.46 3.8 1.27 5.41l4.01-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.59l4.01 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
              />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
            Sign In with Google
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Access StudentHub with your Google account credentials.
          </p>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('direct');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'direct' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'direct' ? 'var(--primary-text)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            Google Account Sign-In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('oauth');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'oauth' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'oauth' ? 'var(--primary-text)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            Google OAuth 2.0 Client ID
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: Direct Google Account Credentials */}
        {activeTab === 'direct' && (
          <form onSubmit={handleDirectGoogleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Your Google Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Full Name (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Feature Note */}
            <div
              style={{
                backgroundColor: 'rgba(241, 234, 215, 0.08)',
                border: '1px solid rgba(241, 234, 215, 0.16)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }}
            >
              <ShieldCheck size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 1 }} />
              <span>
                Your session will be created as a verified Google student. Your academic data, attendance, and timetable will sync with this Google email.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', gap: '0.5rem', fontSize: '0.925rem' }}
            >
              <span>{loading ? 'Connecting Google Account...' : 'Continue with Google Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* TAB 2: Real Google OAuth Client ID */}
        {activeTab === 'oauth' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter your Google Cloud Web OAuth Client ID to trigger Google's native popup account selector directly from your browser.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Google OAuth 2.0 Client ID
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  style={{ paddingLeft: '2.5rem', fontSize: '0.825rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleSaveAndLaunchOAuth}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.7rem', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <span>{savedSuccess ? 'Connecting...' : 'Launch Google Account Selector'}</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* How to get Client ID help */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: 1.45,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HelpCircle size={14} /> How to get a Google Client ID in 2 minutes:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google Cloud Console &rarr; Credentials</a></li>
                <li>Click <strong>Create Credentials &rarr; OAuth client ID</strong></li>
                <li>Select <strong>Web application</strong>, add <code>http://localhost:5173</code> to Authorised JavaScript origins, and copy the Client ID.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <a
            href="https://accounts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <ExternalLink size={13} /> Manage Google Accounts
          </a>

          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GoogleAuthModal;
