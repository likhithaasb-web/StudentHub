import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ArrowLeftRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const AdminHeader = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { theme, toggleTheme, userRole, switchRole, logout, dbStatus, adminAnnouncements, adminAuditLogs } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path.includes('/students')) return 'Student Directory & Management';
    if (path.includes('/academics')) return 'Academic & Curriculum Management';
    if (path.includes('/attendance')) return 'College Attendance Audit & Shortages';
    if (path.includes('/assignments')) return 'Assignments & Coursework';
    if (path.includes('/exams')) return 'Master Examination Schedules';
    if (path.includes('/announcements')) return 'Institutional Circulars & Notices';
    if (path.includes('/analytics')) return 'Analytics & Academic Performance';
    if (path.includes('/management')) return 'Administrator & Faculty Accounts';
    if (path.includes('/audit-logs')) return 'System Audit Trail & Security Logs';
    if (path.includes('/settings')) return 'Platform & Institutional Settings';
    return 'Administration';
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to students with search query or handle in page
    navigate(`/admin/students?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSwitchToStudent = () => {
    switchRole('student');
    navigate('/');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => {
            if (window.innerWidth <= 768) {
              setIsMobileOpen(!isMobileOpen);
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin Portal</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
              {getPageTitle()}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'none', md: 'block' }}>
            {todayFormatted} • Academic Session Spring 2026
          </div>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <form
        onSubmit={handleGlobalSearch}
        style={{
          display: 'none',
          alignItems: 'center',
          position: 'relative',
          maxWidth: '340px',
          width: '100%',
        }}
        className="admin-search-desktop"
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search students, roll #, courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-input, rgba(0,0,0,0.15))',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
        />
      </form>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* DB Connection Status */}
        <div
          title={dbStatus.connected ? 'MongoDB Live Sync Connected' : 'Local Storage Fallback Active'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: dbStatus.connected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
            color: dbStatus.connected ? '#22c55e' : '#eab308',
            border: `1px solid ${dbStatus.connected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
          }}
        >
          <Database size={12} />
          <span>{dbStatus.connected ? 'DB Connected' : 'Offline Mode'}</span>
        </div>

        {/* Switch to Student Portal pill */}
        <button
          onClick={handleSwitchToStudent}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(33, 166, 122, 0.15)',
            border: '1px solid rgba(33, 166, 122, 0.3)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          title="Return to Student Dashboard"
        >
          <ArrowLeftRight size={14} />
          <span className="hidden sm:inline">Student View</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            title="Administrative Notifications"
          >
            <Bell size={17} />
            {adminAnnouncements.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                padding: '14px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                  Administrative Alerts
                </span>
                <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}>
                  {adminAnnouncements.length} Active
                </span>
              </div>
              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {adminAnnouncements.slice(0, 4).map((ann) => (
                  <div
                    key={ann.id}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {ann.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Target: {ann.targetAudience} • {ann.priority.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 8px',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-tertiary, rgba(255,255,255,0.05))',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              EV
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, display: 'none', md: 'inline' }}>
              Dean Vance
            </span>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                padding: '8px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                  Dr. Eleanor Vance
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {userRole.toUpperCase()} • DEAN OFFICE
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Shield size={14} /> Platform Settings
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleSwitchToStudent();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ExternalLink size={14} /> Open Student View
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '4px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
