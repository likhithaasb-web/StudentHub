import React from 'react';
import { Search, Save, CheckCircle2, Loader2 } from 'lucide-react';

const SettingsHeader = ({
  searchQuery,
  onSearchChange,
  hasUnsavedChanges,
  isSaving,
  lastSavedTime,
  onSave,
}) => {
  return (
    <div
      className="card"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Top Row: Title, Subtitle & Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Settings & Personalization
          </h1>
          <p
            style={{
              margin: '0.2rem 0 0',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            Make StudentHub work the way you study
          </p>
        </div>

        {/* Action Controls: Last Saved Status & Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {lastSavedTime && !hasUnsavedChanges && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <CheckCircle2 size={15} style={{ color: 'var(--success)' }} />
              <span>All changes saved at {lastSavedTime}</span>
            </div>
          )}

          {hasUnsavedChanges && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--warning)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--warning-bg)',
                border: '1px solid var(--warning-border)',
              }}
            >
              Unsaved changes
            </span>
          )}

          <button
            onClick={onSave}
            disabled={isSaving}
            type="button"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: hasUnsavedChanges ? 'var(--primary)' : 'var(--bg-secondary)',
              color: hasUnsavedChanges ? 'var(--primary-text)' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: hasUnsavedChanges ? 'var(--shadow-glow)' : 'none',
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Settings Search Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.9rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search all settings (e.g. attendance, pomodoro, theme, password, streak, goals, export)..."
          style={{
            paddingLeft: '2.4rem',
            paddingRight: '2rem',
            height: '42px',
            fontSize: '0.88rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            width: '100%',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            type="button"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card-hover)',
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;
