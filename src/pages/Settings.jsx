import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  User,
  School,
  Sun,
  Moon,
  Percent,
  Timer,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

const Settings = () => {
  const {
    settings,
    updateSettings,
    theme,
    toggleTheme,
    resetToDemoData,
    clearAllData,
  } = useApp();

  const [formData, setFormData] = useState({
    studentName: settings.studentName || '',
    collegeName: settings.collegeName || '',
    targetAttendance: settings.targetAttendance || 75,
    dailyStudyGoalMinutes: settings.dailyStudyGoalMinutes || 120,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      studentName: formData.studentName.trim() || 'Student',
      collegeName: formData.collegeName.trim(),
      targetAttendance: Math.min(100, Math.max(1, parseInt(formData.targetAttendance, 10) || 75)),
      dailyStudyGoalMinutes: Math.min(720, Math.max(15, parseInt(formData.dailyStudyGoalMinutes, 10) || 120)),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 840 }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Settings & Preferences</h1>
          <p className="page-header-subtitle">
            Configure your student identity, academic thresholds, and dashboard storage.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Settings saved successfully! Your preferences are stored in your browser.</span>
        </div>
      )}

      {/* Profile & Identity Form */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <User size={18} />
            </div>
            <span>Profile & Academic Identity</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Student Display Name *</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. State Tech University"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Attendance Target Criterion (%)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.targetAttendance}
                  onChange={(e) => setFormData({ ...formData, targetAttendance: e.target.value })}
                  required
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Default is 75%. Subjects below this percentage trigger shortage warnings.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Study Target (Minutes)</label>
              <input
                type="number"
                min={15}
                max={720}
                step={15}
                value={formData.dailyStudyGoalMinutes}
                onChange={(e) => setFormData({ ...formData, dailyStudyGoalMinutes: e.target.value })}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                120 minutes = 2 hours daily focus time.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Theme Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon" style={{ backgroundColor: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}>
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <span>Appearance & Theme</span>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Choose between the deep navy purple dark mode or high-contrast clean light mode.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            style={{
              flex: 1,
              minWidth: 160,
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#0b0f19',
              border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid #1e293b',
              color: '#f8fafc',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: theme === 'dark' ? 'var(--shadow-glow)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Dark Navy (Default)</span>
              {theme === 'dark' && <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Deep purple accents, low eye strain for late-night study sessions.
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            style={{
              flex: 1,
              minWidth: 160,
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              border: theme === 'light' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
              color: '#0f172a',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: theme === 'light' ? 'var(--shadow-md)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Clean Light</span>
              {theme === 'light' && <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              High-contrast crisp daylight aesthetic.
            </span>
          </button>
        </div>
      </div>

      {/* Storage and Data Management Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <ShieldAlert size={18} />
            </div>
            <span>Data Storage & Privacy</span>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          StudentHub stores your coursework records securely inside your local browser via localStorage. Your data never leaves your computer and no credentials or personal trackers are collected.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Reset Demo Data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Restore Realistic Sample Data
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Populate courses, assignments, timetables, and notes for evaluation.
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={15} /> Load Sample Data
            </button>
          </div>

          {/* Wipe All Data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--danger)' }}>
                Permanently Clear All Local Data
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Deletes all tasks, exams, notes, timetables, study records, and preferences.
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={15} /> Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Dialog for Resetting Data */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetToDemoData();
          setShowResetConfirm(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }}
        title="Load Sample Demo Data"
        message="This will replace current entries with realistic sample courses, assignments, notes, and timetable records."
        confirmText="Load Sample Data"
        danger={false}
      />

      {/* Confirm Dialog for Clearing All Data */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllData();
          setShowClearConfirm(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }}
        title="Wipe All Application Data"
        message="Are you completely sure you want to permanently delete all tasks, notes, exams, timetable, and study records? This action cannot be undone."
        confirmText="Yes, Permanently Delete"
        danger={true}
      />
    </div>
  );
};

export default Settings;
