import React from 'react';
import {
  User,
  GraduationCap,
  Percent,
  Flame,
  Clock,
  CheckSquare,
  Calendar,
  Shield,
  Palette,
  Bell,
  ArrowRight,
  Sparkles,
  School,
  Mail,
  Hash,
  CheckCircle2,
} from 'lucide-react';
import { calculateOverallAttendance } from '../../utils/attendanceUtils';

const SettingsOverview = ({
  formData,
  attendance = [],
  studySessions = [],
  tasks = [],
  exams = [],
  streakStats = { currentStreak: 0, longestStreak: 0 },
  weeklyHours = 0,
  onNavigateTab,
}) => {
  const { percentage: attendancePercent } = calculateOverallAttendance(attendance);
  const targetAttendance = Number(formData.targetAttendance) || 75;
  const isAttendanceSafe = attendancePercent >= targetAttendance;
  const isAttendanceCritical = attendancePercent < targetAttendance - 10;

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const upcomingExams = exams.filter((e) => !e.completed).length;

  const initials = formData.studentName
    ? formData.studentName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SH';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ====================================================================
          B. Student Profile Banner
          ==================================================================== */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          borderColor: 'var(--border-subtle)',
          padding: '1.5rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 320,
            height: '100%',
            background: 'var(--gradient-glow)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Avatar and Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {formData.studentName || 'Alex Morgan'}
                </h2>
                {/* Verified Student Status */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--success-bg)',
                    color: 'var(--success)',
                    border: '1px solid var(--success-border)',
                  }}
                >
                  <CheckCircle2 size={13} /> Verified Student
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginTop: '0.45rem',
                  flexWrap: 'wrap',
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <School size={15} style={{ color: 'var(--primary)' }} />
                  {formData.collegeName || 'State Tech University'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GraduationCap size={15} style={{ color: 'var(--primary)' }} />
                  {formData.academicBranch || 'Computer Science & Engineering'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} style={{ color: 'var(--primary)' }} />
                  {formData.semester || 'Semester 5 (Fall 2026)'}
                </span>
                {formData.rollNumber && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Hash size={15} style={{ color: 'var(--primary)' }} />
                    ID: {formData.rollNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <button
            onClick={() => onNavigateTab('academic')}
            type="button"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
            }}
          >
            <span>Edit Profile</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ====================================================================
          C. Academic Statistics (6 Responsive Cards in 3 Columns)
          ==================================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Academic Statistics & Metrics
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Synchronized with live semester coursework
          </span>
        </div>

        <div className="settings-stats-grid">
          {/* Card 1: Overall Attendance */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Overall Attendance
                </span>
                <div className="card-title-icon" style={{ width: 30, height: 30 }}>
                  <Percent size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {attendancePercent}%
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isAttendanceSafe
                      ? 'var(--success-bg)'
                      : isAttendanceCritical
                      ? 'var(--danger-bg)'
                      : 'var(--warning-bg)',
                    color: isAttendanceSafe
                      ? 'var(--success)'
                      : isAttendanceCritical
                      ? 'var(--danger)'
                      : 'var(--warning)',
                    border: `1px solid ${
                      isAttendanceSafe
                        ? 'var(--success-border)'
                        : isAttendanceCritical
                        ? 'var(--danger-border)'
                        : 'var(--warning-border)'
                    }`,
                  }}
                >
                  {isAttendanceSafe ? 'Safe' : isAttendanceCritical ? 'Critical' : 'Caution'} (Target {targetAttendance}%)
                </span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  height: 6,
                  background: 'var(--bg-secondary)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, attendancePercent)}%`,
                    background: isAttendanceSafe ? 'var(--primary)' : 'var(--warning)',
                    borderRadius: 3,
                    transition: 'width var(--transition-normal)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Target Academic CGPA */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Target Academic CGPA
                </span>
                <div className="card-title-icon" style={{ width: 30, height: 30 }}>
                  <GraduationCap size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formData.cgpaTarget || '8.5'}
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  / {formData.gpaScale || '10.0'} Scale
                </span>
              </div>
            </div>
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Current Semester: {formData.semester || 'Semester 5'}
            </p>
          </div>

          {/* Card 3: Study Streak */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Study Streak
                </span>
                <div
                  className="card-title-icon"
                  style={{ width: 30, height: 30, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}
                >
                  <Flame size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {streakStats.currentStreak}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Days Active
                </span>
                {streakStats.longestStreak > streakStats.currentStreak && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Best: {streakStats.longestStreak}d
                  </span>
                )}
              </div>
            </div>
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Keep logging study sessions to maintain your flame!
            </p>
          </div>

          {/* Card 4: Weekly Study Hours */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Weekly Study Hours
                </span>
                <div className="card-title-icon" style={{ width: 30, height: 30 }}>
                  <Clock size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{weeklyHours}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>hrs this week</span>
              </div>
            </div>
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Weekly Goal: {((Number(formData.dailyStudyGoalMinutes) || 120) * 7 / 60).toFixed(1)} hrs/wk
            </p>
          </div>

          {/* Card 5: Pending Tasks */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Pending Tasks
                </span>
                <div className="card-title-icon" style={{ width: 30, height: 30 }}>
                  <CheckSquare size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pendingTasks}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>tasks incomplete</span>
              </div>
            </div>
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total tasks registered: {tasks.length}
            </p>
          </div>

          {/* Card 6: Upcoming Exams */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Upcoming Exams
                </span>
                <div className="card-title-icon" style={{ width: 30, height: 30 }}>
                  <Calendar size={15} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{upcomingExams}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>scheduled</span>
              </div>
            </div>
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Reminders: {formData.examReminderDays || 3} days in advance
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          D. Quick Personalization Hub (4 Attractive Navigation Cards)
          ==================================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={17} style={{ color: 'var(--primary)' }} /> Quick Personalization Hub
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Jump directly into core configuration modules
          </span>
        </div>

        <div className="settings-hub-grid">
          {[
            {
              id: 'study',
              title: 'Study Preferences',
              desc: 'Customize Pomodoro intervals, daily study goal hours, and weekly schedule.',
              action: 'Configure Study Rhythm',
              icon: Clock,
            },
            {
              id: 'notifications',
              title: 'Notifications & Alerts',
              desc: 'Set exam reminders, low attendance alerts, timetable chimes, and push toasts.',
              action: 'Manage Alert Channels',
              icon: Bell,
            },
            {
              id: 'appearance',
              title: 'Appearance & Themes',
              desc: 'Switch between Dark Emerald, Light Cream, or customize font scaling and density.',
              action: 'Customize Display & Theme',
              icon: Palette,
            },
            {
              id: 'security',
              title: 'Privacy & Security',
              desc: 'Configure 4-digit screen lock PIN, update account password, and stealth mode.',
              action: 'Security & Screen Lock',
              icon: Shield,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className="card"
                style={{
                  padding: '1.25rem 1.35rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="card-title-icon"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {item.title}
                    </h4>
                    <ArrowRight size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  </div>
                  <p style={{ margin: '0.35rem 0 0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {item.action} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview;
