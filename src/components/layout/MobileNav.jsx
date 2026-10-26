import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, GraduationCap, Menu } from 'lucide-react';

const MobileNav = ({ onOpenSidebar }) => {
  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 80,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.5rem',
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
        })}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/tasks"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
        })}
      >
        <CheckSquare size={20} />
        <span>Tasks</span>
      </NavLink>

      <NavLink
        to="/timetable"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
        })}
      >
        <CalendarDays size={20} />
        <span>Classes</span>
      </NavLink>

      <NavLink
        to="/exams"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
        })}
      >
        <GraduationCap size={20} />
        <span>Exams</span>
      </NavLink>

      <button
        onClick={onOpenSidebar}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Menu size={20} />
        <span>More</span>
      </button>
    </nav>
  );
};

export default MobileNav;
