import React from 'react';
import {
  User,
  GraduationCap,
  Bell,
  Timer,
  Palette,
  ShieldCheck,
  Flame,
  Target,
  BarChart2,
  Database,
  ChevronDown,
} from 'lucide-react';

export const SETTINGS_TABS = [
  { id: 'overview', label: 'Overview', icon: User, group: 'Personal' },
  { id: 'academic', label: 'Academic Preferences', icon: GraduationCap, group: 'Academics' },
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Alerts' },
  { id: 'study', label: 'Study Preferences', icon: Timer, group: 'Productivity' },
  { id: 'appearance', label: 'Appearance', icon: Palette, group: 'Interface' },
  { id: 'security', label: 'Privacy & Security', icon: ShieldCheck, group: 'Security' },
  { id: 'streak', label: 'Study Streak', icon: Flame, group: 'Habits' },
  { id: 'goals', label: 'My Academic Goals', icon: Target, group: 'Academics' },
  { id: 'summary', label: 'Weekly Summary', icon: BarChart2, group: 'Analytics' },
  { id: 'data', label: 'Data & Storage', icon: Database, group: 'System' },
];

const SettingsSidebar = ({
  activeTab,
  onSelectTab,
  badges = {},
}) => {
  return (
    <>
      {/* Mobile & Tablet Horizontal Scrollable Tab Bar */}
      <div className="settings-mobile-tabs-container">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeValue = badges[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--primary-text)' : 'var(--text-primary)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-subtle)'}`,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {badgeValue && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'rgba(7, 27, 20, 0.25)' : 'var(--primary-light)',
                    color: isActive ? 'var(--primary-text)' : 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Section 2: Settings Navigation Sidebar (240px) */}
      <aside className="settings-nav-sidebar">
        <div
          style={{
            padding: '0.5rem 0.75rem 0.35rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Settings Navigation</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>10 Sections</span>
        </div>

        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeValue = badges[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-text)' : 'var(--text-primary)',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
                width: '100%',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateX(3px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Icon
                  size={16}
                  style={{
                    color: isActive ? 'var(--primary-text)' : 'var(--primary)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tab.label}
                </span>
              </div>

              {badgeValue !== undefined && badgeValue !== null && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.12rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'rgba(7, 27, 20, 0.25)' : 'var(--primary-light)',
                    color: isActive ? 'var(--primary-text)' : 'var(--primary)',
                    letterSpacing: '0.02em',
                    flexShrink: 0,
                    marginLeft: '0.35rem',
                  }}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </aside>
    </>
  );
};

export default SettingsSidebar;
