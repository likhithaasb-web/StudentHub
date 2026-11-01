import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  CheckCheck,
  User,
  Settings,
  X,
  ExternalLink,
  BookOpen,
  LogOut,
  Shield,
} from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/tasks': 'My Tasks & Assignments',
  '/timetable': 'Weekly Class Timetable',
  '/exams': 'Exam Schedule & Planner',
  '/notes': 'Notes Organizer',
  '/attendance': 'Attendance Tracker & Calculator',
  '/study-planner': 'Study Planner & Focus Timer',
  '/career': 'Career Studio & Resume Builder',
  '/career-studio': 'Career Studio & Resume Builder',
  '/settings': 'Account & Preferences',
};

const Navbar = ({ isCollapsed, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    settings,
    logout,
    switchRole,
    notifications,
    dismissNotification,
    clearAllNotifications,
    setSearchModalOpen,
    openQuickAction,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const currentTitle = PAGE_TITLES[location.pathname] || 'StudentHub';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="btn-icon mobile-only"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'none',
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            {currentTitle}
          </h2>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '1px',
            }}
          >
            <span>Welcome, {settings.studentName || 'Student'}</span>
            {settings.collegeName && <span>• {settings.collegeName}</span>}
          </div>
        </div>
      </div>

      {/* Right: Search, Quick Add, Notifications, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setSearchModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.9rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            minWidth: 160,
          }}
          className="nav-search-btn"
          title="Search tasks, notes, exams (Ctrl+K)"
        >
          <Search size={16} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>
          <kbd
            style={{
              fontSize: '0.7rem',
              background: 'var(--bg-card)',
              padding: '0.1rem 0.35rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => openQuickAction('task')}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.35rem' }}
          title="Quick create task, note, or exam"
        >
          <Plus size={16} />
          <span className="hide-on-mobile">New</span>
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="btn-icon"
            style={{
              backgroundColor: notificationsOpen ? 'var(--primary-light)' : 'var(--bg-tertiary)',
              color: notificationsOpen ? 'var(--primary)' : 'var(--text-secondary)',
              position: 'relative',
            }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 9,
                  height: 9,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--danger)',
                  border: '2px solid var(--bg-secondary)',
                }}
              />
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div
              className="card animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 340,
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-hover)',
                padding: 0,
                zIndex: 200,
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Notifications</span>
                  {notifications.length > 0 && (
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {notifications.length}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <CheckCheck size={14} /> Clear all
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No new notifications. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 'var(--radius-full)',
                          marginTop: 6,
                          flexShrink: 0,
                          backgroundColor:
                            n.type === 'danger'
                              ? 'var(--danger)'
                              : n.type === 'warning'
                              ? 'var(--warning)'
                              : 'var(--primary)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '2px',
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.4,
                          }}
                        >
                          {n.message}
                        </div>
                        {n.link && (
                          <Link
                            to={n.link}
                            onClick={() => setNotificationsOpen(false)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              marginTop: '0.35rem',
                              color: 'var(--primary)',
                              fontWeight: 600,
                            }}
                          >
                            View details <ExternalLink size={11} />
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="btn-icon"
                        style={{
                          width: 20,
                          height: 20,
                          color: 'var(--text-muted)',
                          padding: 0,
                          flexShrink: 0,
                        }}
                        title="Dismiss"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile Menu Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
            }}
            aria-label="User profile menu"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              {settings.studentName?.charAt(0) || 'S'}
            </div>
          </button>

          {profileOpen && (
            <div
              className="card animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 220,
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-hover)',
                padding: '0.5rem',
                zIndex: 200,
              }}
            >
              <div
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.35rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {settings.studentName || 'Student'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {settings.collegeName || 'StudentHub'}
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  switchRole('superadmin');
                  navigate('/admin');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </button>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Settings size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  toggleTheme();
                  setProfileOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--text-secondary)' }} /> : <Moon size={16} style={{ color: 'var(--text-secondary)' }} />}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger)',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
