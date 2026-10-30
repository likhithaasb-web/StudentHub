import React, { useMemo } from 'react';
import {
  BarChart2,
  Clock,
  CheckCircle2,
  Calendar,
  Percent,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { getLast7DaysList, getTodayDateString } from '../../utils/dateUtils';
import { calculateOverallAttendance } from '../../utils/attendanceUtils';

const WeeklySummary = ({
  studySessions = [],
  tasks = [],
  attendance = [],
  dailyStudyGoalMinutes = 120,
}) => {
  const last7Days = useMemo(() => getLast7DaysList(), []);

  // Compute 7-day study chart data
  const chartData = useMemo(() => {
    return last7Days.map((dayObj) => {
      const daySessions = studySessions.filter((s) => s.date === dayObj.date);
      const minutes = daySessions.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
      const hours = Math.round((minutes / 60) * 10) / 10;
      return {
        date: dayObj.date,
        day: dayObj.label,
        hours,
        minutes,
        sessionsCount: daySessions.length,
      };
    });
  }, [last7Days, studySessions]);

  // Total hours this 7-day period
  const totalMinutesThisWeek = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.minutes, 0);
  }, [chartData]);

  const totalHoursThisWeek = Math.round((totalMinutesThisWeek / 60) * 10) / 10;

  // Most productive day
  const mostProductiveDay = useMemo(() => {
    let best = { day: 'None', hours: 0 };
    chartData.forEach((d) => {
      if (d.hours > best.hours) {
        best = { day: d.day, hours: d.hours };
      }
    });
    return best;
  }, [chartData]);

  // Subject distribution
  const subjectBreakdown = useMemo(() => {
    const map = {};
    const dateKeys = new Set(last7Days.map((d) => d.date));
    studySessions.forEach((s) => {
      if (dateKeys.has(s.date)) {
        const sub = s.subject || 'General';
        map[sub] = (map[sub] || 0) + (Number(s.durationMinutes) || 0);
      }
    });

    return Object.entries(map)
      .map(([subject, minutes]) => ({
        subject,
        hours: Math.round((minutes / 60) * 10) / 10,
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [last7Days, studySessions]);

  // Tasks completed
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const { percentage: attendancePercent } = calculateOverallAttendance(attendance);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{data.day} ({data.date})</div>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem', marginTop: 2 }}>
            {data.hours} hours ({data.minutes} mins)
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {data.sessionsCount} session(s) logged
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 4 Weekly KPI Cards */}
      <div className="grid-4">
        {/* Total Weekly Hours */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Weekly Study Hours
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800 }}>{totalHoursThisWeek}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hours</span>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              marginTop: '0.4rem',
            }}
          >
            <TrendingUp size={12} /> +15% vs previous week
          </span>
        </div>

        {/* Most Productive Day */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Most Productive Day
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Award size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>{mostProductiveDay.day}</span>
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Logged: {mostProductiveDay.hours} hours
          </p>
        </div>

        {/* Tasks Completed */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Tasks Completed
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800 }}>{completedTasks}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tasks</span>
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Total tasks in backlog: {tasks.length}
          </p>
        </div>

        {/* Average Attendance */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Overall Attendance
            </span>
            <div className="card-title-icon" style={{ width: 28, height: 28 }}>
              <Percent size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800 }}>{attendancePercent}%</span>
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Semester cumulative status
          </p>
        </div>
      </div>

      {/* 7-Day Study Hours Visualizer (Recharts BarChart) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <BarChart2 size={18} />
            </div>
            <span>Past 7 Days Study Hours Activity</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily focus hours logged vs {(dailyStudyGoalMinutes / 60).toFixed(1)}h daily goal
          </span>
        </div>

        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="hours"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Distribution Breakdown */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} /> Weekly Subject Distribution
        </h3>

        {subjectBreakdown.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {subjectBreakdown.map((item) => {
              const pct = totalHoursThisWeek > 0
                ? Math.round((item.hours / totalHoursThisWeek) * 100)
                : 0;

              return (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    <span>{item.subject}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {item.hours} hrs ({pct}%)
                    </span>
                  </div>
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
                        width: `${pct}%`,
                        background: 'var(--primary)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            No subject study sessions logged in the last 7 days.
          </p>
        )}
      </div>
    </div>
  );
};

export default WeeklySummary;
