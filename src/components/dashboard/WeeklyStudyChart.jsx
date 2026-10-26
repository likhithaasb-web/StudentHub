import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { getLast7DaysList } from '../../utils/dateUtils';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 0.85rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label} ({data.fullDate})
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>
          {data.hours} hrs ({data.minutes} mins)
        </div>
      </div>
    );
  }
  return null;
};

const WeeklyStudyChart = ({ studySessions = [] }) => {
  const chartData = useMemo(() => {
    const days = getLast7DaysList();
    return days.map(({ date, label }) => {
      // Find all sessions on this date
      const sessionsOnDate = studySessions.filter((s) => s.date === date);
      const totalMinutes = sessionsOnDate.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
      const hours = Math.round((totalMinutes / 60) * 10) / 10;
      return {
        day: label,
        fullDate: date,
        hours,
        minutes: totalMinutes,
      };
    });
  }, [studySessions]);

  const totalWeeklyMinutes = chartData.reduce((acc, d) => acc + d.minutes, 0);
  const totalWeeklyHours = Math.round((totalWeeklyMinutes / 60) * 10) / 10;

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">
            <Timer size={18} />
          </div>
          <div>
            <span>Study Hours (Past 7 Days)</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Total: {totalWeeklyHours} hrs recorded
            </div>
          </div>
        </div>
        <Link
          to="/study-planner"
          style={{
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          Planner <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ flex: 1, minHeight: 220, width: '100%', position: 'relative' }}>
        {totalWeeklyMinutes === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            <p>No study sessions logged for the past 7 days.</p>
            <Link to="/study-planner" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              Start Focus Timer
            </Link>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-subtle)' }}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]} maxBarSize={38}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.hours > 0 ? 'var(--primary)' : 'var(--bg-tertiary)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WeeklyStudyChart;
