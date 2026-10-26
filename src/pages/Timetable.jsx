import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ClassFormModal from '../components/timetable/ClassFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DAYS_OF_WEEK, getCurrentDayName, formatTime12h } from '../../src/utils/dateUtils';

const Timetable = () => {
  const { timetable, addClassSession, updateClassSession, deleteClassSession } = useApp();

  const currentDayName = getCurrentDayName();
  const [selectedDayTab, setSelectedDayTab] = useState(() => {
    return DAYS_OF_WEEK.includes(currentDayName) ? currentDayName : 'Monday';
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'day'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [formDefaultDay, setFormDefaultDay] = useState('Monday');

  // Next Upcoming Class Logic
  const nextClass = useMemo(() => {
    if (!timetable || timetable.length === 0) return null;

    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Check if there is a class later today
    const todayClasses = timetable
      .filter((c) => c.day.toLowerCase() === currentDayName.toLowerCase() && c.endTime >= currentHourMin)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (todayClasses.length > 0) {
      return { session: todayClasses[0], when: 'Today' };
    }

    // 2. Check subsequent days of the week
    const dayIndices = DAYS_OF_WEEK.map((d) => d.toLowerCase());
    const currentIdx = dayIndices.indexOf(currentDayName.toLowerCase());

    for (let offset = 1; offset <= 6; offset++) {
      const nextDayIdx = (currentIdx + offset) % 6; // Mon-Sat
      const nextDayName = DAYS_OF_WEEK[nextDayIdx];
      const classesOnNextDay = timetable
        .filter((c) => c.day.toLowerCase() === nextDayName.toLowerCase())
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      if (classesOnNextDay.length > 0) {
        return { session: classesOnNextDay[0], when: nextDayName };
      }
    }

    return null;
  }, [timetable, currentDayName]);

  const handleSaveSession = (sessionData) => {
    if (editingSession) {
      updateClassSession(editingSession.id, sessionData);
    } else {
      addClassSession(sessionData);
    }
  };

  const handleOpenAddForDay = (day) => {
    setEditingSession(null);
    setFormDefaultDay(day);
    setIsFormOpen(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Weekly Class Timetable</h1>
          <p className="page-header-subtitle">
            Keep track of lecture schedules, classrooms, and weekly timings.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="btn btn-sm"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              Week Grid
            </button>
            <button
              onClick={() => setViewMode('day')}
              className="btn btn-sm"
              style={{
                backgroundColor: viewMode === 'day' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'day' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              Day View
            </button>
          </div>
          <button
            onClick={() => handleOpenAddForDay(selectedDayTab)}
            className="btn btn-primary"
          >
            <Plus size={18} /> Add Class
          </button>
        </div>
      </div>

      {/* Next Upcoming Class Banner */}
      {nextClass && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderColor: 'var(--border-focus)',
            padding: '1.1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  Next Up • {nextClass.when}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {formatTime12h(nextClass.session.startTime)} - {formatTime12h(nextClass.session.endTime)}
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                {nextClass.session.subject}
              </div>
            </div>
          </div>

          {nextClass.session.classroom && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--bg-card)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <MapPin size={15} style={{ color: 'var(--primary)' }} />
              <span>{nextClass.session.classroom}</span>
            </div>
          )}
        </div>
      )}

      {/* Weekday Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {DAYS_OF_WEEK.map((day) => {
          const isToday = day.toLowerCase() === currentDayName.toLowerCase();
          const isSelected = selectedDayTab === day;
          const classCount = timetable.filter((c) => c.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDayTab(day)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected
                  ? 'var(--primary)'
                  : isToday
                  ? 'var(--primary-light)'
                  : 'var(--bg-secondary)',
                border: isSelected
                  ? '1px solid var(--primary)'
                  : isToday
                  ? '1px solid var(--border-focus)'
                  : '1px solid var(--border-subtle)',
                color: isSelected ? '#ffffff' : isToday ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isSelected || isToday ? 700 : 500,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{day}</span>
              {isToday && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSelected ? '#ffffff' : 'var(--primary)',
                    color: isSelected ? 'var(--primary)' : '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Today
                </span>
              )}
              {classCount > 0 && !isToday && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    opacity: 0.8,
                  }}
                >
                  ({classCount})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid or Day View */}
      {timetable.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Your timetable is empty"
          description="Build your college schedule by adding your weekly classes and lab sessions."
          actionLabel="Add Your First Class"
          onAction={() => handleOpenAddForDay('Monday')}
        />
      ) : viewMode === 'grid' ? (
        /* Full Week Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {DAYS_OF_WEEK.map((day) => {
            const isToday = day.toLowerCase() === currentDayName.toLowerCase();
            const dayClasses = timetable
              .filter((c) => c.day === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.1rem',
                  borderColor: isToday ? 'var(--border-focus)' : 'var(--border-subtle)',
                  boxShadow: isToday ? '0 0 15px var(--primary-light)' : 'var(--shadow-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {day}
                    </span>
                    {isToday && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Today</span>}
                  </div>
                  <button
                    onClick={() => handleOpenAddForDay(day)}
                    className="btn-icon"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-muted)',
                    }}
                    title={`Add class on ${day}`}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {dayClasses.length === 0 ? (
                    <div
                      style={{
                        padding: '1.5rem 0.5rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.825rem',
                      }}
                    >
                      No classes scheduled.
                    </div>
                  ) : (
                    dayClasses.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          borderLeft: `4px solid ${item.color || 'var(--primary)'}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                            {item.subject}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Clock size={12} /> {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                            </span>
                            {item.classroom && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <MapPin size={12} /> {item.classroom}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            onClick={() => {
                              setEditingSession(item);
                              setIsFormOpen(true);
                            }}
                            className="btn-icon"
                            style={{ width: 26, height: 26, color: 'var(--text-muted)' }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setSessionToDelete(item)}
                            className="btn-icon"
                            style={{ width: 26, height: 26, color: 'var(--danger)' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Selected Day View */
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {selectedDayTab} Schedule
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {timetable.filter((c) => c.day === selectedDayTab).length} sessions scheduled
              </p>
            </div>
            <button
              onClick={() => handleOpenAddForDay(selectedDayTab)}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={16} /> Add Session to {selectedDayTab}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {timetable.filter((c) => c.day === selectedDayTab).length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No classes scheduled for {selectedDayTab}.</p>
                <button
                  onClick={() => handleOpenAddForDay(selectedDayTab)}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                >
                  <Plus size={15} /> Add Class
                </button>
              </div>
            ) : (
              timetable
                .filter((c) => c.day === selectedDayTab)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      borderLeft: `5px solid ${item.color || 'var(--primary)'}`,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem 0' }}>{item.subject}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={14} style={{ color: 'var(--primary)' }} />
                          {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                        </span>
                        {item.classroom && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={14} style={{ color: 'var(--accent-purple)' }} />
                            {item.classroom}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setEditingSession(item);
                          setIsFormOpen(true);
                        }}
                        className="btn-icon"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setSessionToDelete(item)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        sessionToEdit={editingSession}
        allSessions={timetable}
        defaultDay={formDefaultDay}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) {
            deleteClassSession(sessionToDelete.id);
            setSessionToDelete(null);
          }
        }}
        title="Delete Class Session"
        message={`Are you sure you want to remove "${sessionToDelete?.subject}" on ${sessionToDelete?.day}?`}
        confirmText="Remove Class"
      />
    </div>
  );
};

export default Timetable;
