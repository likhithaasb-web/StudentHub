import React, { useState, useMemo } from 'react';
import { formatAttendanceDate } from '../../utils/attendanceUtils';
import { getTodayDateString } from '../../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  RefreshCw,
  Edit2,
  Trash2,
} from 'lucide-react';

const AttendanceCalendarView = ({
  records = [],
  subjects = [],
  onOpenRecordModal,
  onToggleStatus,
  onEditRecord,
  onDeleteRecord,
}) => {
  const todayStr = getTodayDateString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Map records by date for O(1) lookup
  const recordsByDate = useMemo(() => {
    const map = {};
    records.forEach((rec) => {
      if (!map[rec.date]) {
        map[rec.date] = [];
      }
      map[rec.date].push(rec);
    });
    return map;
  }, [records]);

  // Days in month & first day index
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const d = new Date();
    setCurrentDate(d);
    setSelectedDateStr(todayStr);
  };

  // Build calendar matrix
  const calendarCells = [];
  // Padding cells before first day
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ empty: true, key: `empty-${i}` });
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dayRecords = recordsByDate[dateStr] || [];

    const presentCount = dayRecords.filter((r) => r.status === 'Present').length;
    const absentCount = dayRecords.filter((r) => r.status === 'Absent').length;

    calendarCells.push({
      empty: false,
      day,
      dateStr,
      dayRecords,
      presentCount,
      absentCount,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      key: dateStr,
    });
  }

  const selectedDayRecords = recordsByDate[selectedDateStr] || [];

  const getSubjectColor = (subjectName) => {
    const s = subjects.find((sub) => sub.name === subjectName);
    return s ? s.color : 'var(--primary)';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(280px, 1fr)',
        gap: '1.25rem',
      }}
      className="attendance-calendar-grid"
    >
      {/* Left: Monthly Calendar View */}
      <div className="card" style={{ padding: '1.4rem' }}>
        {/* Month Header Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarIcon size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {monthNames[month]} {year}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button onClick={goToToday} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              Today
            </button>
            <button onClick={prevMonth} className="btn-icon" style={{ width: 30, height: 30 }} title="Previous month">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="btn-icon" style={{ width: 30, height: 30 }} title="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
            paddingBottom: '0.4rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.35rem',
          }}
        >
          {calendarCells.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} style={{ minHeight: 48 }} />;
            }

            const hasClasses = cell.dayRecords.length > 0;

            return (
              <button
                key={cell.key}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                style={{
                  minHeight: 52,
                  padding: '0.35rem 0.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: cell.isSelected
                    ? 'rgba(223, 214, 174, 0.16)'
                    : cell.isToday
                    ? 'var(--bg-tertiary)'
                    : 'transparent',
                  border: cell.isSelected
                    ? '1.5px solid var(--primary)'
                    : cell.isToday
                    ? '1px dashed var(--primary)'
                    : '1px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: cell.isToday || cell.isSelected ? 800 : 500,
                    color: cell.isSelected
                      ? 'var(--primary)'
                      : cell.isToday
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {cell.day}
                </span>

                {/* Dots / Indicators */}
                {hasClasses && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    {cell.presentCount > 0 && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'var(--success)',
                        }}
                        title={`${cell.presentCount} present`}
                      />
                    )}
                    {cell.absentCount > 0 && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'var(--danger)',
                        }}
                        title={`${cell.absentCount} absent`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span>Present Class</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
            <span>Absent Class</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '2px', border: '1px dashed var(--primary)' }} />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Right: Selected Date Inspector Panel */}
      <div
        className="card"
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Selected Date Log
              </span>
              <h4 style={{ fontSize: '1.05rem', margin: '0.2rem 0 0 0', color: 'var(--text-primary)', fontWeight: 800 }}>
                {formatAttendanceDate(selectedDateStr)}
              </h4>
            </div>

            <button
              onClick={() => onOpenRecordModal('', selectedDateStr)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem', gap: '0.3rem' }}
            >
              <Plus size={14} /> Log Class
            </button>
          </div>

          {/* Classes for this date */}
          {selectedDayRecords.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-muted)',
              }}
            >
              <CalendarIcon size={32} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                No attendance records logged on this date.
              </p>
              <button
                onClick={() => onOpenRecordModal('', selectedDateStr)}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.85rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} /> Record class on {formatAttendanceDate(selectedDateStr)}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {selectedDayRecords.map((rec) => {
                const isPresent = rec.status === 'Present';
                const subjectColor = getSubjectColor(rec.subject);

                return (
                  <div
                    key={rec.id}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: subjectColor,
                          }}
                        />
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {rec.subject}
                        </strong>
                      </div>

                      <span
                        className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      >
                        {isPresent ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {rec.status}
                      </span>
                    </div>

                    {rec.notes && (
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          lineHeight: 1.3,
                        }}
                      >
                        "{rec.notes}"
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.35rem',
                        marginTop: '0.2rem',
                        paddingTop: '0.4rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <button
                        onClick={() => onToggleStatus(rec.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', gap: '0.25rem' }}
                        title="Mistake? Toggle status"
                      >
                        <RefreshCw size={11} />
                        {isPresent ? 'Mark Absent' : 'Mark Present'}
                      </button>

                      <button
                        onClick={() => onEditRecord(rec)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--text-secondary)' }}
                        title="Edit entry"
                      >
                        <Edit2 size={12} />
                      </button>

                      <button
                        onClick={() => onDeleteRecord(rec)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--danger)' }}
                        title="Delete entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          Tip: You can click any past date to record backdated lectures or fix attendance mistakes.
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendarView;
