import React, { useMemo, useState } from 'react';
import {
  Flame,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Info,
} from 'lucide-react';
import { getTodayDateString } from '../../utils/dateUtils';

const MILESTONES = [
  { id: 'm-3', days: 3, title: '3-Day Starter', desc: 'Forming your initial study rhythm', icon: '🌱' },
  { id: 'm-7', days: 7, title: '7-Day Warrior', desc: '1 full week of relentless academic focus', icon: '⚔️' },
  { id: 'm-14', days: 14, title: '14-Day Champion', desc: '2 consecutive weeks of habitual study', icon: '🛡️' },
  { id: 'm-30', days: 30, title: '30-Day Scholar', desc: 'A full month of daily intellectual mastery', icon: '👑' },
  { id: 'm-100', days: 100, title: '100-Day Legend', desc: 'Top tier consistency in the student body', icon: '🌟' },
];

const StudyStreak = ({ studySessions = [] }) => {
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  // Group study sessions by date
  const sessionsByDate = useMemo(() => {
    const map = {};
    studySessions.forEach((s) => {
      if (!s.date) return;
      if (!map[s.date]) {
        map[s.date] = { totalMinutes: 0, sessions: [] };
      }
      map[s.date].totalMinutes += Number(s.durationMinutes) || 0;
      map[s.date].sessions.push(s);
    });
    return map;
  }, [studySessions]);

  // Calculate Streak metrics from actual dates
  const stats = useMemo(() => {
    const uniqueDates = Object.keys(sessionsByDate).sort();
    const totalDays = uniqueDates.length;
    const totalMinutes = studySessions.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    if (totalDays === 0) {
      return { currentStreak: 0, longestStreak: 0, totalDays: 0, totalHours: 0 };
    }

    // Convert date strings to timestamps for day calculation
    const parsedDates = uniqueDates.map((d) => new Date(d + 'T00:00:00'));

    let longest = 1;
    let temp = 1;

    for (let i = 1; i < parsedDates.length; i++) {
      const diffMs = parsedDates[i] - parsedDates[i - 1];
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        temp++;
        longest = Math.max(longest, temp);
      } else if (diffDays > 1) {
        temp = 1;
      }
    }

    // Current streak ending today or yesterday
    const today = new Date(getTodayDateString() + 'T00:00:00');
    let current = 0;
    let checkDate = new Date(today);

    // If today has session:
    const todayStr = getTodayDateString();
    let hasSessionToday = !!sessionsByDate[todayStr];

    if (!hasSessionToday) {
      // Check if yesterday had a session to keep streak alive
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      if (sessionsByDate[key]) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak: current,
      longestStreak: Math.max(longest, current),
      totalDays,
      totalHours,
    };
  }, [sessionsByDate, studySessions]);

  // Generate 35-day calendar grid (last 5 weeks up to today)
  const calendarCells = useMemo(() => {
    const cells = [];
    const today = new Date(getTodayDateString() + 'T00:00:00');

    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const data = sessionsByDate[dateKey];
      const minutes = data ? data.totalMinutes : 0;

      cells.push({
        date: dateKey,
        dayNumber: d.getDate(),
        monthName: d.toLocaleString('en-US', { month: 'short' }),
        dayName: d.toLocaleString('en-US', { weekday: 'short' }),
        minutes,
        hours: Math.round((minutes / 60) * 10) / 10,
        sessions: data ? data.sessions : [],
        isToday: i === 0,
      });
    }
    return cells;
  }, [sessionsByDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Metric Highlights */}
      <div className="grid-4">
        {/* Current Streak */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Current Streak
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Flame size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.currentStreak}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {stats.currentStreak > 0 ? 'Flame burning strong!' : 'Log a session to ignite'}
          </p>
        </div>

        {/* Longest Streak */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Longest Streak
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <TrendingUp size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.longestStreak}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Personal All-Time Record
          </p>
        </div>

        {/* Total Days */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Study Days
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <Calendar size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.totalDays}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Total unique session days
          </p>
        </div>

        {/* Total Logged Hours */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Time Logged
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.totalHours}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hours</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Across all coursework
          </p>
        </div>
      </div>

      {/* 35-Day Interactive Activity Heatmap */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Calendar size={18} />
            </div>
            <span>35-Day Focus Heatmap</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Less</span>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }} />
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(32, 167, 122, 0.3)' }} />
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(32, 167, 122, 0.65)' }} />
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)' }} />
            <span>More</span>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Click any date cell to view session details and subject breakdown.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.55rem',
          }}
        >
          {calendarCells.map((cell) => {
            const isFilled = cell.minutes > 0;
            const bg =
              cell.minutes === 0
                ? 'var(--bg-secondary)'
                : cell.minutes <= 45
                ? 'rgba(32, 167, 122, 0.28)'
                : cell.minutes <= 90
                ? 'rgba(32, 167, 122, 0.65)'
                : 'var(--primary)';

            const isSelected = selectedDayInfo?.date === cell.date;

            return (
              <div
                key={cell.date}
                onClick={() => setSelectedDayInfo(cell)}
                style={{
                  height: 54,
                  borderRadius: 'var(--radius-md)',
                  background: bg,
                  border: isSelected
                    ? '2px solid #FFFFFF'
                    : cell.isToday
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700 }}>
                  <span style={{ color: isFilled && cell.minutes > 90 ? 'var(--primary-text)' : 'var(--text-muted)' }}>
                    {cell.monthName} {cell.dayNumber}
                  </span>
                  {cell.isToday && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--primary)', fontWeight: 800 }}>
                      ●
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isFilled && cell.minutes > 90 ? 'var(--primary-text)' : 'var(--text-primary)' }}>
                  {isFilled ? `${cell.hours}h` : '–'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Inspector Panel */}
        {selectedDayInfo && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {selectedDayInfo.dayName}, {selectedDayInfo.monthName} {selectedDayInfo.dayNumber} ({selectedDayInfo.date})
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayInfo(null)}
                style={{ fontSize: '0.76rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            {selectedDayInfo.sessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedDayInfo.sessions.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.subject}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{s.durationMinutes} mins • {s.startTime || 'Scheduled'}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.notes || 'Focus block'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No study sessions logged on this day.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Streak Milestones & Badges */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Award size={18} />
            </div>
            <span>Streak Milestones & Achievements</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Unlocked automatically based on consecutive study days
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1rem' }}>
          {MILESTONES.map((m) => {
            const isUnlocked = stats.longestStreak >= m.days;
            const progress = Math.min(100, Math.round((stats.longestStreak / m.days) * 100));

            return (
              <div
                key={m.id}
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: isUnlocked ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: '1.8rem',
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: isUnlocked ? 'var(--primary-light)' : 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {m.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{m.title}</h4>
                    {isUnlocked ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--success)',
                          background: 'var(--success-bg)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--success-border)',
                        }}
                      >
                        Unlocked
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Lock size={11} /> {stats.longestStreak}/{m.days}d
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.2rem 0 0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {m.desc}
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: 5,
                      background: 'var(--bg-card)',
                      borderRadius: 2.5,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: isUnlocked ? 'var(--primary)' : 'var(--text-muted)',
                        borderRadius: 2.5,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;
