import React from 'react';
import { CalendarDays, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentDayName, formatTime12h } from '../../utils/dateUtils';

const TodayScheduleCard = ({ timetable = [] }) => {
  const currentDay = getCurrentDayName();
  const todayClasses = timetable
    .filter((c) => c.day.toLowerCase() === currentDay.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Determine current time in HH:MM
  const now = new Date();
  const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">
            <CalendarDays size={18} />
          </div>
          <div>
            <span>Today's Schedule</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              {currentDay} • {todayClasses.length} {todayClasses.length === 1 ? 'class' : 'classes'}
            </div>
          </div>
        </div>
        <Link
          to="/timetable"
          style={{
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          Timetable <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {todayClasses.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <p>No classes scheduled for {currentDay}.</p>
            <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Enjoy your study break or review notes!</p>
            <Link to="/timetable" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              View Weekly Grid
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayClasses.map((session) => {
              const isPast = session.endTime < currentHourMin;
              const isOngoing = session.startTime <= currentHourMin && session.endTime >= currentHourMin;
              const isNext = !isPast && !isOngoing;

              return (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isOngoing
                      ? 'var(--primary-light)'
                      : 'var(--bg-tertiary)',
                    border: isOngoing
                      ? '1px solid var(--primary)'
                      : '1px solid var(--border-subtle)',
                    opacity: isPast ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 4,
                        height: 36,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: session.color || 'var(--primary)',
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {session.subject}
                        </span>
                        {isOngoing && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Happening Now</span>}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: 3,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={12} /> {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}
                        </span>
                        {session.classroom && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={12} /> {session.classroom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayScheduleCard;
