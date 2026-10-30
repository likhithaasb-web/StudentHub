import React from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sliders,
  Radio,
  FileText,
} from 'lucide-react';

const NotificationSettings = ({ formData, onChangeField }) => {
  const allEnabled =
    formData.examReminderDays > 0 &&
    formData.shortageNotification !== false &&
    formData.dailyReminderToast !== false &&
    formData.soundAlerts !== false;

  const handleToggleAll = () => {
    if (allEnabled) {
      // Mute all
      onChangeField('shortageNotification', false);
      onChangeField('dailyReminderToast', false);
      onChangeField('soundAlerts', false);
      onChangeField('streakRiskAlert', false);
      onChangeField('classReminder', false);
    } else {
      // Enable all
      onChangeField('shortageNotification', true);
      onChangeField('dailyReminderToast', true);
      onChangeField('soundAlerts', true);
      onChangeField('streakRiskAlert', true);
      onChangeField('classReminder', true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Master Toggle Banner */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            className="card-title-icon"
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: allEnabled ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: allEnabled ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            {allEnabled ? <Bell size={20} /> : <VolumeX size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Master Notification Controls
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {allEnabled
                ? 'All notification channels and sound effects are currently active.'
                : 'Some notifications are muted or disabled.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="btn btn-secondary"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {allEnabled ? 'Mute All Notifications' : 'Enable All Notifications'}
        </button>
      </div>

      {/* Academic Notification Category */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Calendar size={18} />
            </div>
            <span>Academic Alerts & Timetable</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exam dates, attendance warnings, and timetable alerts
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Attendance Shortage Warning */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Low Attendance Warning
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Triggers an in-app banner whenever a subject drops below {formData.targetAttendance || 75}%.
                </div>
              </div>
            </div>
            <label className="toggle-switch" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.shortageNotification !== false}
                onChange={(e) => onChangeField('shortageNotification', e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
            </label>
          </div>

          {/* Exam Countdown Timing */}
          <div
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Upcoming Exam Alerts
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Advance notice before tests and midterms commence.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Remind me:</span>
              <select
                value={formData.examReminderDays || 3}
                onChange={(e) => onChangeField('examReminderDays', Number(e.target.value))}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.84rem' }}
              >
                <option value={1}>1 day before</option>
                <option value={2}>2 days before</option>
                <option value={3}>3 days before</option>
                <option value={5}>5 days before</option>
                <option value={7}>1 week before</option>
              </select>
            </div>
          </div>

          {/* Timetable Class Reminder */}
          <div
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Next Class Reminders
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Sends a heads-up before your scheduled timetable lecture starts.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={formData.classReminderTiming || '15'}
                onChange={(e) => onChangeField('classReminderTiming', e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.84rem' }}
              >
                <option value="10">10 mins before</option>
                <option value="15">15 mins before</option>
                <option value="30">30 mins before</option>
                <option value="60">1 hour before</option>
              </select>
              <input
                type="checkbox"
                checked={formData.classReminder !== false}
                onChange={(e) => onChangeField('classReminder', e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Study Habits & Productivity Alerts */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Flame size={18} />
            </div>
            <span>Study & Habit Notifications</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily goals, study streak preservation, and weekly digests
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Daily Goal Reminder */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Daily Study Goal Toast</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Display encouraging toasts when you achieve your daily target hours.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.dailyReminderToast !== false}
              onChange={(e) => onChangeField('dailyReminderToast', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>

          {/* Streak Risk Alert */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Streak Risk Protection Alert</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sends a reminder at 8:00 PM if no study session has been logged for today.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.streakRiskAlert !== false}
              onChange={(e) => onChangeField('streakRiskAlert', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>

          {/* Weekly Summary Report */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly Academic Digest</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Summarize total hours logged, tasks completed, and attendance metrics every Sunday.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.weeklyDigest !== false}
              onChange={(e) => onChangeField('weeklyDigest', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Delivery Channels & Audio */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Volume2 size={18} />
            </div>
            <span>Audio & Delivery Channels</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Chimes, push notifications, and sound effects
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1rem' }}>
          {/* Audio Chimes */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Volume2 size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Sound Chimes & Alerts</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Pomodoro completion chimes & timer bells
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.soundAlerts !== false}
              onChange={(e) => onChangeField('soundAlerts', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>

          {/* Browser Push */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Radio size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>In-App Toast Banners</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Visual popups in upper right corner
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.inAppToasts !== false}
              onChange={(e) => onChangeField('inAppToasts', e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
