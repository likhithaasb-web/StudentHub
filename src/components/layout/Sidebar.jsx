import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  GraduationCap,
  FileText,
  Percent,
  Timer,
  Settings,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Shield,
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { tasks, attendance, settings, notifications, switchRole } = useApp();
  const navigate = useNavigate();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const target = settings.targetAttendance || 75;
  const lowAttendanceCount = attendance.filter((a) => {
    if (a.held === 0) return false;
    return (a.attended / a.held) * 100 < target;
  }).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : null, badgeColor: 'var(--primary)' },
    { name: 'Timetable', path: '/timetable', icon: CalendarDays },
    { name: 'Exams', path: '/exams', icon: GraduationCap },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'AI Copilot', path: '/ai', icon: Sparkles, badge: 'AI', badgeColor: '#10b981' },
    { name: 'Attendance', path: '/attendance', icon: Percent, badge: lowAttendanceCount > 0 ? '!' : null, badgeColor: 'var(--warning)' },
    { name: 'Study Planner', path: '/study-planner', icon: Timer },
    { name: 'Career Studio', path: '/career', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--bg-overlay)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'width var(--transition-normal), transform var(--transition-normal)',
          transform: isMobileOpen ? 'translateX(0)' : window.innerWidth <= 768 ? 'translateX(-100%)' : 'translateX(0)',
          overflowX: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0 0.5rem' : '0 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-text)',
                boxShadow: 'var(--shadow-glow)',
                flexShrink: 0,
              }}
            >
              <BookOpen size={20} />
            </div>
            {!isCollapsed && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-secondary)' }}>
                  StudentHub
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginTop: '-2px',
                    fontWeight: 600,
                  }}
                >
                  Productivity Suite
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="btn-icon"
              style={{
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                width: 28,
                height: 28,
              }}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? '1rem 0.5rem' : '1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth <= 768) setIsMobileOpen(false);
                }}
                title={isCollapsed ? item.name : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: isCollapsed ? '0.75rem 0' : '0.7rem 0.9rem',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary-text)' : 'var(--text-primary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      style={{
                        flexShrink: 0,
                        color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                      }}
                    />
                    {!isCollapsed && (
                      <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        style={{
                          backgroundColor: item.badgeColor || 'var(--primary-light)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-full)',
                          padding: '0.1rem 0.5rem',
                          minWidth: 18,
                          textAlign: 'center',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isCollapsed && item.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 10,
                          width: 8,
                          height: 8,
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: item.badgeColor || 'var(--primary)',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapsed Expand Button */}
        {isCollapsed && (
          <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setIsCollapsed(false)}
              className="btn-icon"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                width: 36,
                height: 36,
              }}
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Switch to Admin Dashboard */}
        <div style={{ padding: isCollapsed ? '0.5rem 0.4rem' : '0.5rem 0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => {
              switchRole('superadmin');
              navigate('/admin');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: isCollapsed ? '8px' : '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(33, 166, 122, 0.3)',
              backgroundColor: 'rgba(33, 166, 122, 0.1)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Switch to Administration"
          >
            <Shield size={16} />
            {!isCollapsed && <span>Admin Portal</span>}
          </button>
        </div>

        {/* User Mini Profile Footer */}
        <div
          style={{
            padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.15rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-primary)',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
              flexShrink: 0,
            }}
          >
            {settings.studentName?.charAt(0) || 'S'}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {settings.studentName || 'Student'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {settings.collegeName || 'StudentHub Member'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
