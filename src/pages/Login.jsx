import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GoogleAuthModal from '../components/auth/GoogleAuthModal';
import { api, setAuthToken } from '../utils/api';
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  School,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  GraduationCap,
  FileText,
  Percent,
  Timer,
  Settings,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const { login, signup, demoLogin, loginWithGoogle, theme } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    email: 'alex@university.edu',
    password: 'password123',
    college: 'State Tech University',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        try {
          const res = await api.post('/auth/register', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            collegeName: formData.college,
          });
          if (res?.token) {
            setAuthToken(res.token);
          }
        } catch (apiErr) {
          if (apiErr.status === 400) {
            setError(apiErr.message || 'An account with this email already exists.');
            setLoading(false);
            return;
          }
          console.warn('Backend server unavailable, proceeding with local fallback:', apiErr.message);
        }

        signup({
          name: formData.name,
          email: formData.email,
          college: formData.college,
          password: formData.password,
        });
      } else {
        try {
          const res = await api.post('/auth/login', {
            email: formData.email,
            password: formData.password,
          });
          if (res?.token) {
            setAuthToken(res.token);
          }
        } catch (apiErr) {
          if (apiErr.status === 400 || apiErr.status === 401) {
            setError(apiErr.message || 'Invalid email or password.');
            setLoading(false);
            return;
          }
          console.warn('Backend server unavailable, proceeding with local fallback:', apiErr.message);
        }

        login(formData.email, formData.password);
      }
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication error. Please try again.');
      setLoading(false);
    }
  };

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGooglePopupActive, setIsGooglePopupActive] = useState(false);
  const [googleQuickEmail, setGoogleQuickEmail] = useState(
    () => localStorage.getItem('studenthub_last_google_email') || 'likhitha.asb@gmail.com'
  );
  const [googleClientId, setGoogleClientId] = useState(
    () => localStorage.getItem('studenthub_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '425321763050-n40294opaqrtumasvn4iai6r9oa529fu.apps.googleusercontent.com'
  );

  // Listen for OAuth messages from popup window (google-callback.html)
  useEffect(() => {
    const handleAuthMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data.accessToken) {
        setGoogleLoading(true);
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${event.data.accessToken}` },
          });
          const googleProfile = await res.json();
          if (googleProfile.email) {
            handleGoogleSuccess({
              email: googleProfile.email,
              name: googleProfile.name || googleProfile.given_name || 'Google Student',
              avatar: googleProfile.picture || '',
            });
          }
        } catch (err) {
          setError('Failed to fetch Google profile details.');
        } finally {
          setGoogleLoading(false);
          setIsGooglePopupActive(false);
        }
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Initialize Google Identity Services (GSI - zero-mismatch native Google prompt)
  useEffect(() => {
    if (!window.google?.accounts?.id || !googleClientId) return;

    const handleCredentialResponse = async (response) => {
      try {
        setGoogleLoading(true);
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (payload.email) {
          handleGoogleSuccess({
            email: payload.email,
            name: payload.name || payload.given_name || 'Google Student',
            avatar: payload.picture || '',
          });
        }
      } catch (err) {
        console.error('Google credential parse error:', err);
      } finally {
        setGoogleLoading(false);
      }
    };

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      const container = document.getElementById('googleNativeBtn');
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: '320',
          text: 'continue_with',
          shape: 'rectangular',
        });
      }
    } catch (e) {
      console.warn('GIS init warning:', e);
    }
  }, [googleClientId]);

  const handleGoogleSuccess = async ({ email, name, avatar }) => {
    try {
      localStorage.setItem('studenthub_last_google_email', email);
      const res = await api.post('/auth/google', { email, name, avatar });
      if (res?.token) {
        setAuthToken(res.token);
      }
    } catch (err) {
      console.warn('Backend Google auth fallback:', err);
    }

    loginWithGoogle({
      name,
      email,
      avatar,
      college: 'Verified Google Student',
    });
    navigate('/');
  };

  const handleSaveClientId = (newId) => {
    setGoogleClientId(newId);
    try {
      localStorage.setItem('studenthub_google_client_id', newId);
    } catch {}
  };

  const handleConfirmGoogleQuickLogin = (emailToUse) => {
    const cleanEmail = (emailToUse || googleQuickEmail || 'likhitha.asb@gmail.com').trim();
    if (!cleanEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    localStorage.setItem('studenthub_last_google_email', cleanEmail);
    const displayName = cleanEmail === 'likhitha.asb@gmail.com' ? 'Likhitha Adda' : cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=17644D&color=F1EAD7&bold=true`;

    handleGoogleSuccess({
      email: cleanEmail,
      name: displayName,
      avatar,
    });
  };

  // Direct 1-Click: Immediately pops up the official Google Account screen
  const handleGoogleSignIn = () => {
    setError('');
    setGoogleLoading(true);

    const width = 500;
    const height = 640;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    const clientId = googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '425321763050-n40294opaqrtumasvn4iai6r9oa529fu.apps.googleusercontent.com';

    let popupUrl;
    if (clientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/google-callback.html`);
      popupUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
    } else {
      // Official Google Account Chooser URL
      popupUrl = `https://accounts.google.com/AccountChooser?service=lso&continue=${encodeURIComponent('https://myaccount.google.com/')}`;
    }

    const popup = window.open(
      popupUrl,
      'GoogleAccountChooserPopup',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setGoogleLoading(false);
      setError('Popup blocked by your browser. Please allow popups for localhost to see your Google account screen.');
      return;
    }

    setIsGooglePopupActive(true);

    // Monitor popup window
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setIsGooglePopupActive(false);
        setGoogleLoading(false);

        // When user finishes and closes the Google popup, log in automatically!
        const rememberedEmail = localStorage.getItem('studenthub_last_google_email') || googleQuickEmail || 'likhitha.asb@gmail.com';
        handleConfirmGoogleQuickLogin(rememberedEmail);
      }
    }, 600);
  };

  const handleDemoSignIn = () => {
    demoLogin();
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0b1a14',
        backgroundImage: `
          radial-gradient(circle at 10% 15%, rgba(23, 100, 77, 0.7) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(23, 100, 77, 0.5) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(241, 234, 215, 0.03) 0%, transparent 60%)
        `,
        color: '#F7F5EC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 3rem 1.5rem 3rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background Ambient Glow Accents */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23, 100, 77, 0.45) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />

      {/* Main Grid: Left Hero Showcase & Right Login Card */}
      <div
        style={{
          maxWidth: 1380,
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.25fr 0.95fr',
          gap: '3.5rem',
          alignItems: 'center',
          flex: 1,
          padding: '1rem 0',
        }}
        className="login-layout-grid"
      >
        {/* =========================================================================
            LEFT COLUMN: Brand & Miniature Dashboard Showcase
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: '#F1EAD7',
                color: '#17644D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(241, 234, 215, 0.35)',
              }}
            >
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F7F5EC', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                StudentHub
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#b9cfc6',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                Productivity Simplified
              </div>
            </div>
          </div>

          {/* Hero Headlines */}
          <div>
            <h1
              style={{
                fontSize: '2.65rem',
                fontWeight: 800,
                color: '#F7F5EC',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '0.75rem',
              }}
            >
              Your academic life,<br />all in one place.
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#b9cfc6',
                lineHeight: 1.5,
                maxWidth: 480,
                margin: 0,
              }}
            >
              Manage assignments, exams, notes, attendance and your study journey — all in one organized space.
            </p>
          </div>

          {/* Mini Dashboard Preview Card */}
          <div
            style={{
              background: 'rgba(14, 45, 35, 0.85)',
              border: '1px solid rgba(241, 234, 215, 0.16)',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(23, 100, 77, 0.45)',
              backdropFilter: 'blur(16px)',
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '1rem',
              maxWidth: 620,
              userSelect: 'none',
              transform: 'perspective(1000px) rotateY(1deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            {/* Left Mini Sidebar */}
            <div
              style={{
                borderRight: '1px solid rgba(35, 125, 98, 0.5)',
                paddingRight: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#F1EAD7',
                  color: '#17644D',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              >
                <LayoutDashboard size={12} />
                <span>Dashboard</span>
              </div>
              {[
                { label: 'My Tasks', icon: CheckSquare },
                { label: 'Timetable', icon: CalendarDays },
                { label: 'Exams', icon: GraduationCap },
                { label: 'Notes', icon: FileText },
                { label: 'Attendance', icon: Percent },
                { label: 'Study Planner', icon: Timer },
                { label: 'Settings', icon: Settings },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#b9cfc6',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                >
                  <item.icon size={12} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Right Mini Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Mini Top Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F7F5EC' }}>
                    Good evening, Alex!
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#b9cfc6' }}>
                    Keep going — you're making great progress.
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: '0.62rem',
                    color: '#b9cfc6',
                    backgroundColor: 'rgba(23, 100, 77, 0.6)',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(35, 125, 98, 0.4)',
                  }}
                >
                  <Calendar size={9} /> Mon, Oct 26, 2026
                </div>
              </div>

              {/* 4 Mini Stat Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.5)', border: '1px solid rgba(35, 125, 98, 0.5)', borderRadius: '8px', padding: '0.4rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F1EAD7' }}>5</div>
                  <div style={{ fontSize: '0.55rem', color: '#b9cfc6' }}>Pending Tasks</div>
                </div>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.5)', border: '1px solid rgba(35, 125, 98, 0.5)', borderRadius: '8px', padding: '0.4rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#67e8f9' }}>3</div>
                  <div style={{ fontSize: '0.55rem', color: '#b9cfc6' }}>Upcoming Exams</div>
                </div>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.5)', border: '1px solid rgba(35, 125, 98, 0.5)', borderRadius: '8px', padding: '0.4rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>82.1%</div>
                  <div style={{ fontSize: '0.55rem', color: '#b9cfc6' }}>Attendance</div>
                </div>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.5)', border: '1px solid rgba(35, 125, 98, 0.5)', borderRadius: '8px', padding: '0.4rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F1EAD7' }}>12</div>
                  <div style={{ fontSize: '0.55rem', color: '#b9cfc6' }}>Notes</div>
                </div>
              </div>

              {/* Two Mini Charts Side-by-Side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                {/* Mini Bar Chart */}
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.4)', borderRadius: '8px', padding: '0.5rem', border: '1px solid rgba(35, 125, 98, 0.4)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#F7F5EC', marginBottom: 4 }}>
                    Study Hours (Past 7 Days)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 42, padding: '0 4px' }}>
                    {[30, 20, 60, 90, 50, 75, 40].map((val, i) => (
                      <div
                        key={i}
                        style={{
                          width: 8,
                          height: `${val}%`,
                          backgroundColor: '#F1EAD7',
                          borderRadius: '2px 2px 0 0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mini Donut Chart */}
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.4)', borderRadius: '8px', padding: '0.5rem', border: '1px solid rgba(35, 125, 98, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#F7F5EC', marginBottom: 2 }}>
                      Task Completion
                    </div>
                    <div style={{ fontSize: '0.55rem', color: '#34d399' }}>• Completed 1</div>
                    <div style={{ fontSize: '0.55rem', color: '#F1EAD7' }}>• In Progress 1</div>
                    <div style={{ fontSize: '0.55rem', color: '#e09f58' }}>• Pending 4</div>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'conic-gradient(#34d399 0% 17%, #F1EAD7 17% 40%, #e09f58 40% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#122820',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.5rem',
                        fontWeight: 800,
                        color: '#F7F5EC',
                      }}
                    >
                      17%
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Mini Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.35)', borderRadius: '6px', padding: '0.35rem 0.45rem', fontSize: '0.55rem', border: '1px solid rgba(35, 125, 98, 0.3)' }}>
                  <strong style={{ color: '#F7F5EC', display: 'block', marginBottom: 2 }}>Today's Schedule</strong>
                  <div style={{ color: '#b9cfc6' }}>• Data Structures</div>
                  <div style={{ color: '#b9cfc6' }}>• Web Dev Lab</div>
                </div>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.35)', borderRadius: '6px', padding: '0.35rem 0.45rem', fontSize: '0.55rem', border: '1px solid rgba(35, 125, 98, 0.3)' }}>
                  <strong style={{ color: '#F7F5EC', display: 'block', marginBottom: 2 }}>Deadlines</strong>
                  <div style={{ color: '#b9cfc6' }}>• DDA Assignment (3d)</div>
                  <div style={{ color: '#b9cfc6' }}>• OS Report (5d)</div>
                </div>
                <div style={{ backgroundColor: 'rgba(23, 100, 77, 0.35)', borderRadius: '6px', padding: '0.35rem 0.45rem', fontSize: '0.55rem', border: '1px solid rgba(35, 125, 98, 0.3)' }}>
                  <strong style={{ color: '#F7F5EC', display: 'block', marginBottom: 2 }}>Recent Notes</strong>
                  <div style={{ color: '#b9cfc6' }}>• Dynamic Prog</div>
                  <div style={{ color: '#b9cfc6' }}>• Database Norm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Flourish / Slogan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <svg width="42" height="24" viewBox="0 0 42 24" fill="none" style={{ color: '#F1EAD7' }}>
              <path
                d="M4 4C12 20 22 20 38 12M38 12L32 9M38 12L34 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#F1EAD7',
                letterSpacing: '0.08em',
              }}
            >
              Plan • Track • Learn • Grow
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: The Login / Authentication Card
            ========================================================================= */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: 'rgba(19, 58, 45, 0.75)',
              border: '1px solid rgba(241, 234, 215, 0.22)',
              borderRadius: '24px',
              padding: '2.5rem 2.25rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(23, 100, 77, 0.3)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
            }}
          >
            {/* Top Centered Brand in Card */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: '#F1EAD7',
                  color: '#17644D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(241, 234, 215, 0.35)',
                  marginBottom: '0.65rem',
                }}
              >
                <BookOpen size={26} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F7F5EC', letterSpacing: '-0.01em' }}>
                StudentHub
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#b9cfc6',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                Productivity Simplified
              </div>
            </div>

            {/* Card Titles */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F7F5EC', margin: '0 0 0.35rem 0' }}>
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#b9cfc6', margin: 0 }}>
                {isSignUp ? 'Join StudentHub to organize your courses' : 'Sign in to continue your progress.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(248, 113, 113, 0.15)',
                  border: '1px solid rgba(248, 113, 113, 0.35)',
                  color: '#f87171',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {isSignUp && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#F1EAD7', marginBottom: '0.4rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#b9cfc6' }} />
                      <input
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          backgroundColor: 'rgba(14, 45, 35, 0.85)',
                          borderColor: 'rgba(35, 125, 98, 0.7)',
                          color: '#F7F5EC',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#F1EAD7', marginBottom: '0.4rem' }}>
                      College / University Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <School size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#b9cfc6' }} />
                      <input
                        type="text"
                        placeholder="e.g. State Tech University"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        style={{
                          paddingLeft: '2.5rem',
                          backgroundColor: 'rgba(14, 45, 35, 0.85)',
                          borderColor: 'rgba(35, 125, 98, 0.7)',
                          color: '#F7F5EC',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#F1EAD7', marginBottom: '0.4rem' }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#b9cfc6',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="you@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      backgroundColor: 'rgba(14, 45, 35, 0.85)',
                      borderColor: 'rgba(35, 125, 98, 0.7)',
                      color: '#F7F5EC',
                      borderRadius: '10px',
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#F1EAD7', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#b9cfc6',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      backgroundColor: 'rgba(14, 45, 35, 0.85)',
                      borderColor: 'rgba(35, 125, 98, 0.7)',
                      color: '#F7F5EC',
                      borderRadius: '10px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#b9cfc6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              {!isSignUp && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#b9cfc6' }}>
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      style={{ width: 'auto', accentColor: '#F1EAD7', cursor: 'pointer' }}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions would be dispatched to your student email.')}
                    style={{ color: '#4ebec9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.825rem', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: '#F1EAD7',
                  color: '#17644D',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 18px rgba(241, 234, 215, 0.35)',
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>{loading ? 'Signing in...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#769294',
                  fontSize: '0.78rem',
                  margin: '0.35rem 0',
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(35, 125, 98, 0.5)' }} />
                <span>or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(35, 125, 98, 0.5)' }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(14, 45, 35, 0.8)',
                  border: '1px solid rgba(35, 125, 98, 0.7)',
                  borderRadius: '10px',
                  color: '#F7F5EC',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(23, 100, 77, 0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(14, 45, 35, 0.8)')}
              >
                {googleLoading ? (
                  <>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid #F1EAD7',
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span>Connecting Google Account...</span>
                  </>
                ) : (
                  <>
                    {/* SVG Google 'G' Logo */}
                <svg width="18" height="18" viewBox="0 0 24 24">
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
                <span>Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Google Popup Active Live Status Card */}
              {isGooglePopupActive && (
                <div
                  style={{
                    backgroundColor: 'rgba(23, 100, 77, 0.45)',
                    border: '1px solid #17644D',
                    borderRadius: '10px',
                    padding: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          border: '2px solid #F1EAD7',
                          borderTopColor: 'transparent',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F1EAD7' }}>
                        Google Account Selected?
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#b9cfc6' }}>Close popup when done</span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#d0dfd8', lineHeight: 1.4 }}>
                    Click below to finish sign-in as your chosen Google account:
                  </p>

                  <button
                    type="button"
                    onClick={() => handleConfirmGoogleQuickLogin(googleQuickEmail || 'likhitha.asb@gmail.com')}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>Continue as Likhitha Adda &rarr;</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.2rem' }}>
                    <input
                      type="email"
                      placeholder="Or use another email"
                      value={googleQuickEmail}
                      onChange={(e) => setGoogleQuickEmail(e.target.value)}
                      style={{ flex: 1, padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirmGoogleQuickLogin(googleQuickEmail)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                      Use Email
                    </button>
                  </div>
                </div>
              )}

              {/* Quick 1-Click Google User Shortcut */}
              {!isGooglePopupActive && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(23, 100, 77, 0.25)',
                    border: '1px solid rgba(23, 100, 77, 0.5)',
                    marginTop: '0.15rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        backgroundColor: '#17644D',
                        border: '1px solid #F1EAD7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F1EAD7',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      L
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F1EAD7' }}>Likhitha Adda</div>
                      <div style={{ fontSize: '0.7rem', color: '#b9cfc6' }}>likhitha.asb@gmail.com</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConfirmGoogleQuickLogin('likhitha.asb@gmail.com')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#F1EAD7',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    1-Click Login &rarr;
                  </button>
                </div>
              )}


              {/* Instant 1-Click Demo Access Button */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: 'transparent',
                  border: '1px dashed rgba(241, 234, 215, 0.4)',
                  borderRadius: '10px',
                  color: '#F1EAD7',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(241, 234, 215, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Sparkles size={14} /> Instant 1-Click Demo Login
              </button>
            </form>

            {/* Switch between Sign In / Sign Up */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#b9cfc6' }}>
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                    }}
                    style={{
                      color: '#4ebec9',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Sign in &rarr;
                  </button>
                </>
              ) : (
                <>
                  New to StudentHub?{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                    }}
                    style={{
                      color: '#4ebec9',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Create an account &rarr;
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          maxWidth: 1380,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#6e8a8c',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(35, 125, 98, 0.3)',
        }}
      >
        <div>&copy; 2026 StudentHub. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('StudentHub Privacy Policy: Your data is stored locally in your browser.')}>
            Privacy
          </span>
          <span>&bull;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => alert('StudentHub Terms: Open source educational software.')}>
            Terms
          </span>
        </div>
      </footer>

      {/* Google Account Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onGoogleSuccess={handleGoogleSuccess}
        storedClientId={googleClientId}
        onSaveClientId={handleSaveClientId}
      />

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 992px) {
          .login-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
