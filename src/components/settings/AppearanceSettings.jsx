import React from 'react';
import {
  Palette,
  Moon,
  Sun,
  Laptop,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Eye,
} from 'lucide-react';

const THEMES = [
  {
    id: 'dark',
    name: 'Dark Emerald',
    subtitle: 'Deep forest green with warm vanilla highlights',
    bg: '#071B14',
    surface: '#0B2B20',
    card: '#10382A',
    accent: '#20A77A',
    accentSecondary: '#65D6A5',
    text: '#F5F2E8',
    muted: '#A7B8AE',
  },
  {
    id: 'light',
    name: 'Light Cream',
    subtitle: 'Warm vanilla canvas with emerald structure',
    bg: '#F6F5EF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    accent: '#167653',
    accentSecondary: '#DCEFE4',
    text: '#18352A',
    muted: '#75847B',
  },
  {
    id: 'system',
    name: 'System Default',
    subtitle: 'Synchronizes automatically with your OS preference',
    bg: 'linear-gradient(135deg, #071B14 50%, #F6F5EF 50%)',
    surface: '#0B2B20',
    card: '#10382A',
    accent: '#20A77A',
    accentSecondary: '#65D6A5',
    text: '#F5F2E8',
    muted: '#A7B8AE',
  },
];

const AppearanceSettings = ({
  currentTheme,
  onThemeSelect,
  formData,
  onChangeField,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Theme Selection */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Palette size={18} />
            </div>
            <span>Color Palette & Theme Mode</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Applies immediately across all dashboard views
          </span>
        </div>

        <div className="grid-3" style={{ gap: '1.15rem' }}>
          {THEMES.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => onThemeSelect(th.id)}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Mini Mock Dashboard Visualizer */}
                <div
                  style={{
                    height: 110,
                    background: th.bg,
                    padding: '0.75rem',
                    position: 'relative',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Mock Navbar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: th.accent,
                        }}
                      />
                      <div
                        style={{
                          height: 6,
                          width: 38,
                          borderRadius: 3,
                          background: th.text,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: th.accent,
                      }}
                    />
                  </div>

                  {/* Mock Cards Grid */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div
                      style={{
                        flex: 1,
                        height: 48,
                        borderRadius: 6,
                        background: th.card,
                        border: `1px solid ${th.muted}33`,
                        padding: '0.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ height: 4, width: '40%', borderRadius: 2, background: th.muted, opacity: 0.6 }} />
                      <div style={{ height: 8, width: '70%', borderRadius: 3, background: th.accent }} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 48,
                        borderRadius: 6,
                        background: th.card,
                        border: `1px solid ${th.muted}33`,
                        padding: '0.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ height: 4, width: '50%', borderRadius: 2, background: th.muted, opacity: 0.6 }} />
                      <div style={{ height: 8, width: '60%', borderRadius: 3, background: th.accentSecondary }} />
                    </div>
                  </div>
                </div>

                {/* Theme Info Footer */}
                <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {th.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                    {th.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography & Layout Density */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Type size={18} />
            </div>
            <span>Typography & Display Scaling</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Adjust reading comfort and screen density
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Font Size Selector */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Base Font Size Scale
            </label>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Scale text across notes, tables, timetable, and study metrics.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'small', label: 'Small', size: '14px' },
                { id: 'medium', label: 'Medium', size: '16px (Default)' },
                { id: 'large', label: 'Large', size: '18px' },
              ].map((font) => {
                const isSelected = (formData.fontSize || 'medium') === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onChangeField('fontSize', font.id)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--primary-text)' : 'var(--text-primary)',
                      border: `1px solid ${isSelected ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                      textAlign: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div>{font.label}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 2 }}>{font.size}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interface Density */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Interface Density
            </label>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Card padding, button gaps, and data table heights.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'comfortable', label: 'Comfortable', desc: 'Spacious & Clean', icon: Maximize2 },
                { id: 'compact', label: 'Compact', desc: 'High Information Density', icon: Minimize2 },
              ].map((density) => {
                const isSelected = (formData.density || 'comfortable') === density.id;
                const Icon = density.icon;
                return (
                  <button
                    key={density.id}
                    type="button"
                    onClick={() => onChangeField('density', density.id)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--primary-text)' : 'var(--text-primary)',
                      border: `1px solid ${isSelected ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Icon size={16} />
                    <span>{density.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{density.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility & Motion */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Sparkles size={18} />
            </div>
            <span>Accessibility & Motion</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Reduced Motion</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Disables CSS sliding animations and transition effects for users sensitive to motion.
            </div>
          </div>
          <input
            type="checkbox"
            checked={!!formData.reducedMotion}
            onChange={(e) => onChangeField('reducedMotion', e.target.checked)}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
