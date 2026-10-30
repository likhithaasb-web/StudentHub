import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  Laptop,
  CheckCircle2,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Sparkles,
} from 'lucide-react';

const PrivacySecurity = ({
  formData,
  onChangeField,
  onLockScreenNow,
  onChangePassword,
  passwordLoading,
  passwordNotice,
  onOpenClearConfirm,
  onOpenResetConfirm,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Real interactive password strength meter
  const getStrength = (pass) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { label: 'Weak (min 6 chars)', score: 1, color: '#f87171' };
    if (score <= 3) return { label: 'Medium', score: 2, color: '#fbbf24' };
    if (score <= 4) return { label: 'Strong', score: 3, color: '#34d399' };
    return { label: 'Very Strong', score: 4, color: '#20A77A' };
  };

  const strength = getStrength(passwordData.newPassword);

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (onChangePassword) {
      onChangePassword(passwordData, () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 4-Digit PIN Privacy Screen Lock */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Lock size={18} />
            </div>
            <span>4-Digit Screen Privacy PIN</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Shortcut: Cmd/Ctrl + Shift + L
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Set 4-Digit Privacy PIN
            </label>
            <input
              type="password"
              maxLength={4}
              pattern="\d*"
              value={formData.privacyPin || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                onChangeField('privacyPin', val);
              }}
              placeholder="e.g. 1234 (Leave blank to disable)"
              style={{ letterSpacing: '0.3em', fontSize: '1.1rem', fontWeight: 700 }}
            />
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {formData.privacyPin
                ? 'PIN lock is active. StudentHub will require this PIN when locked.'
                : 'No PIN set. Lock screen is disabled.'}
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Auto-Lock Inactivity Timeout
            </label>
            <select
              value={formData.screenLockTimeout || 0}
              onChange={(e) => onChangeField('screenLockTimeout', Number(e.target.value))}
            >
              <option value={0}>Disabled (Manual lock only)</option>
              <option value={1}>After 1 minute of inactivity</option>
              <option value={5}>After 5 minutes of inactivity</option>
              <option value={15}>After 15 minutes of inactivity</option>
              <option value={30}>After 30 minutes of inactivity</option>
            </select>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Automatically overlays the privacy lock when away from your keyboard.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <input
              type="checkbox"
              id="stealthModeCheck"
              checked={!!formData.stealthLibraryMode}
              onChange={(e) => onChangeField('stealthLibraryMode', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
            <label htmlFor="stealthModeCheck" style={{ fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer' }}>
              Stealth Library Mode (masks CGPA and attendance values with asterisks)
            </label>
          </div>

          {formData.privacyPin && (
            <button
              type="button"
              onClick={onLockScreenNow}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                padding: '0.45rem 0.9rem',
              }}
            >
              <Lock size={15} /> Lock Screen Now
            </button>
          )}
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Key size={18} />
            </div>
            <span>Change Account Password</span>
          </div>
        </div>

        {passwordNotice?.text && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: passwordNotice.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: passwordNotice.type === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${passwordNotice.type === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}`,
            }}
          >
            {passwordNotice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{passwordNotice.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="grid-3" style={{ gap: '1rem' }}>
            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Current Password <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                New Password <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                required
              />
              {/* Live strength meter */}
              {passwordData.newPassword && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: 4, height: 4, borderRadius: 2, overflow: 'hidden' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          backgroundColor: step <= strength.score ? strength.color : 'var(--border-subtle)',
                          transition: 'all 200ms',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 700, marginTop: 2, display: 'block' }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Confirm New Password <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Re-type new password"
                required
              />
              {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                <span style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '0.3rem', display: 'block' }}>
                  Passwords do not match
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.15rem',
                fontSize: '0.88rem',
                fontWeight: 700,
              }}
            >
              {passwordLoading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Key size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Active Session & Device Information */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Laptop size={18} />
            </div>
            <span>Active Session & Device</span>
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--success)',
              background: 'var(--success-bg)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--success-border)',
            }}
          >
            ● Current Session
          </span>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Laptop size={28} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Desktop Browser • Windows
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                IP: 127.0.0.1 (Localhost / Secure Session) • Chrome V8 Engine
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Last Active: Just now
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          border: '1px solid var(--danger-border)',
          background: 'rgba(248, 113, 113, 0.04)',
        }}
      >
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title" style={{ color: 'var(--danger)' }}>
            <div
              className="card-title-icon"
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
            >
              <ShieldAlert size={18} />
            </div>
            <span>Danger Zone</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600 }}>
            Irreversible Actions
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Manage permanent data removal or restore clean demo coursework anytime.
        </p>

        <div className="grid-2" style={{ gap: '1rem' }}>
          {/* Reset Demo Data */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                Reset to Demo Curriculum
              </h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Replaces all current data with sample subjects (CN, MFEF, ML, OT, API), tasks, and attendance.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenResetConfirm}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                alignSelf: 'flex-start',
              }}
            >
              <RotateCcw size={15} /> Reset Demo Data
            </button>
          </div>

          {/* Wipe User Data */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--danger)' }}>
                Wipe All Academic Records
              </h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Clears all tasks, timetable classes, exam entries, notes, and attendance history.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenClearConfirm}
              className="btn btn-danger"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                alignSelf: 'flex-start',
                backgroundColor: 'var(--danger)',
                color: '#fff',
              }}
            >
              <Trash2 size={15} /> Clear All Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;
