import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Calendar,
  Megaphone,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { userRole, switchRole, logout, adminStudents, adminDepartments, adminAnnouncements } = useApp();
  const navigate = useNavigate();

  // Shortages count (<75%)
  const shortagesCount = adminStudents.filter((s) => (s.attendancePercentage || 0) < 75).length;

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Student Management', path: '/admin/students', icon: Users, badge: adminStudents.length },
    { name: 'Academic Management', path: '/admin/academics', icon: GraduationCap, badge: adminDepartments.length },
    { name: 'Attendance Audit', path: '/admin/attendance', icon: UserCheck, badge: shortagesCount > 0 ? `${shortagesCount} Defaulters` : null, badgeColor: '#ef4444' },
    { name: 'Assignments', path: '/admin/assignments', icon: ClipboardList },
    { name: 'Examinations', path: '/admin/exams', icon: Calendar },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone, badge: adminAnnouncements.length },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Admin Management', path: '/admin/management', icon: ShieldCheck },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSwitchToStudent = () => {
    switchRole('student');
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--bg-overlay, rgba(7, 27, 20, 0.85))',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '76px' : '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isMobileOpen ? 'translateX(0)' : window.innerWidth <= 768 ? 'translateX(-100%)' : 'translateX(0)',
          overflowX: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0' : '0 18px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(33, 166, 122, 0.35)',
              }}
            >
              <Shield size={20} color="#F7F4E9" />
            </div>
            {!isCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.3px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    StudentHub
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(33, 166, 122, 0.2)',
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    ADMIN
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Manage. Monitor. Empower.
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => isMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '10px' : '10px 14px',
                  borderRadius: '10px',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 150ms ease',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!isCollapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </span>
                )}
                {!isCollapsed && item.badge !== undefined && item.badge !== null && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      backgroundColor: item.badgeColor ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                      color: item.badgeColor || 'inherit',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions & Role Switcher */}
        <div
          style={{
            padding: isCollapsed ? '12px 6px' : '14px 14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'var(--bg-tertiary, rgba(0,0,0,0.1))',
            flexShrink: 0,
          }}
        >
          {/* Quick Role Switcher Button */}
          <button
            onClick={handleSwitchToStudent}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
            title="Switch to Student Portal"
          >
            <ArrowLeftRight size={15} color="var(--primary)" />
            {!isCollapsed && <span>Student Portal View</span>}
          </button>

          {/* Profile & Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              gap: '8px',
              padding: isCollapsed ? '4px 0' : '4px 2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                EV
              </div>
              {!isCollapsed && (
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Dr. Eleanor Vance
                  </div>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}
                  >
                    {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Sign out of Administration"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
