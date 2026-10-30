import React from 'react';
import {
  Timer,
  Clock,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Calendar,
  Volume2,
  Shield,
  Zap,
} from 'lucide-react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STUDY_WINDOWS = [
  { id: 'morning', label: 'Morning', hours: '6:00 AM – 12:00 PM', icon: Sun },
  { id: 'afternoon', label: 'Afternoon', hours: '12:00 PM – 5:00 PM', icon: Zap },
  { id: 'evening', label: 'Evening', hours: '5:00 PM – 9:00 PM', icon: Sunset },
  { id: 'night', label: 'Night Owl', hours: '9:00 PM – 2:00 AM', icon: Moon },
];

const StudyPreferences = ({ formData, onChangeField }) => {
  const goalMinutes = Number(formData.dailyStudyGoalMinutes) || 120;
  const goalHours = (goalMinutes / 60).toFixed(1);

  const selectedDays = formData.preferredStudyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedWindows = formData.preferredWindows || ['evening', 'night'];

  const toggleDay = (day) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChangeField('preferredStudyDays', next);
  };

  const toggleWindow = (winId) => {
    const next = selectedWindows.includes(winId)
      ? selectedWindows.filter((w) => w !== winId)
      : [...selectedWindows, winId];
    onChangeField('preferredWindows', next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Daily Study Goal */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Clock size={18} />
            </div>
            <span>Daily Study Target & Rhythm</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Calibrates daily progress rings and streak requirements
          </span>
        </div>

        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Daily Target Hours</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target study time to log each active study day.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {goalHours}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                hrs / day ({goalMinutes} mins)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="30"
            max="360"
            step="15"
            value={goalMinutes}
            onChange={(e) => onChangeField('dailyStudyGoalMinutes', Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '0.4rem',
            }}
          >
            <span>30m (Light)</span>
            <span>1h 30m</span>
            <span>2h (Recommended)</span>
            <span>3h</span>
            <span>4h+ (Intense)</span>
          </div>
        </div>

        {/* Preferred Study Days */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Active Study Days Schedule
          </label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Choose which days of the week you plan to study. Unselected days won't break your study streak.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {WEEKDAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: isSelected ? 'var(--primary-text)' : 'var(--text-muted)',
                    border: `1px solid ${isSelected ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Study Time Windows */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Optimal Study Windows
          </label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Helps the AI Academic Copilot recommend session slots when your focus is highest.
          </p>
          <div className="grid-2" style={{ gap: '0.75rem' }}>
            {STUDY_WINDOWS.map((win) => {
              const isSelected = selectedWindows.includes(win.id);
              const Icon = win.icon;
              return (
                <div
                  key={win.id}
                  onClick={() => toggleWindow(win.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {win.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{win.hours}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ width: 'auto', pointerEvents: 'none' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pomodoro Technique Parameters */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Timer size={18} />
            </div>
            <span>Pomodoro Focus Timer Configuration</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Custom intervals for Study Planner focus sessions
          </span>
        </div>

        <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Work Duration */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Focus Duration
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="10"
                max="120"
                step="5"
                value={formData.pomodoroWorkMin || 25}
                onChange={(e) => onChangeField('pomodoroWorkMin', Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
            </div>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Standard: 25 minutes
            </p>
          </div>

          {/* Short Break */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Short Break
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="2"
                max="20"
                step="1"
                value={formData.pomodoroShortBreakMin || 5}
                onChange={(e) => onChangeField('pomodoroShortBreakMin', Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
            </div>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Standard: 5 minutes
            </p>
          </div>

          {/* Long Break */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Long Break
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="10"
                max="45"
                step="5"
                value={formData.pomodoroLongBreakMin || 15}
                onChange={(e) => onChangeField('pomodoroLongBreakMin', Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
            </div>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Every 4 sessions: 15 min
            </p>
          </div>
        </div>

        {/* Auto transitions & Stealth Focus */}
        <div className="grid-2" style={{ gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Auto-start Breaks</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Automatically begins the break countdown when focus concludes
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.autoStartBreaks !== false}
              onChange={(e) => onChangeField('autoStartBreaks', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Stealth Library Mode</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Masks grades and attendance percentages with asterisks
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!formData.stealthLibraryMode}
              onChange={(e) => onChangeField('stealthLibraryMode', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPreferences;
