import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import FocusTimer from '../components/study-planner/FocusTimer';
import StudySessionModal from '../components/study-planner/StudySessionModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  Timer,
  Target,
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  Award,
  BarChart2,
} from 'lucide-react';
import { getTodayDateString, formatDate, formatTime12h, getLast7DaysList } from '../utils/dateUtils';

const StudyPlanner = () => {
  const {
    studySessions,
    addStudySession,
    deleteStudySession,
    settings,
    updateSettings,
    tasks,
    attendance,
  } = useApp();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const todayStr = getTodayDateString();
  const dailyGoalMinutes = settings.dailyStudyGoalMinutes || 120;

  // Extract known subjects from tasks & attendance for autocompletion
  const existingSubjects = useMemo(() => {
    const list = new Set([
      ...tasks.map((t) => t.subject),
      ...attendance.map((a) => a.subject),
    ].filter(Boolean));
    return Array.from(list);
  }, [tasks, attendance]);

  // Today's study minutes
  const todayMinutes = useMemo(() => {
    return studySessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  }, [studySessions, todayStr]);

  const todayHours = Math.round((todayMinutes / 60) * 10) / 10;
  const goalProgressPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));

  // Past 7 days total
  const past7DaysKeys = useMemo(() => {
    return getLast7DaysList().map((d) => d.date);
  }, []);

  const weeklyMinutes = useMemo(() => {
    return studySessions
      .filter((s) => past7DaysKeys.includes(s.date))
      .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  }, [studySessions, past7DaysKeys]);

  const weeklyHours = Math.round((weeklyMinutes / 60) * 10) / 10;

  // Study Time by Subject Breakdown
  const subjectBreakdown = useMemo(() => {
    const map = {};
    studySessions.forEach((s) => {
      const sub = s.subject || 'General Study';
      map[sub] = (map[sub] || 0) + (Number(s.durationMinutes) || 0);
    });
    return Object.entries(map)
      .map(([subject, minutes]) => ({
        subject,
        minutes,
        hours: Math.round((minutes / 60) * 10) / 10,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [studySessions]);

  const handleGoalChange = (e) => {
    const mins = Math.max(15, parseInt(e.target.value, 10) || 120);
    updateSettings({ dailyStudyGoalMinutes: mins });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Study Planner & Focus Timer</h1>
          <p className="page-header-subtitle">
            Set daily focus goals, run timed study blocks, and log subject productivity.
          </p>
        </div>
        <button onClick={() => setIsLogModalOpen(true)} className="btn btn-secondary">
          <Plus size={18} /> Log Past Session
        </button>
      </div>

      {/* Goal & Metrics Section */}
      <div className="grid-3">
        {/* Daily Goal Card */}
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="card-title-icon">
                  <Target size={18} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Today's Goal</span>
              </div>
              <span className={`badge ${goalProgressPercent >= 100 ? 'badge-success' : 'badge-purple'}`}>
                {goalProgressPercent}% Achieved
              </span>
            </div>

            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {todayMinutes} / {dailyGoalMinutes} min
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {todayHours} hrs completed today
            </div>

            <div className="progress-container" style={{ height: 10 }}>
              <div
                className="progress-bar"
                style={{
                  width: `${goalProgressPercent}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target minutes:</span>
            <input
              type="number"
              step={15}
              min={15}
              max={600}
              value={dailyGoalMinutes}
              onChange={handleGoalChange}
              style={{ width: 80, padding: '0.2rem 0.5rem', textAlign: 'center', fontWeight: 700 }}
            />
          </div>
        </div>

        {/* Weekly Metric Card */}
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="card-title-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
                <Award size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Weekly Study Total</span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {weeklyHours} hrs
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {weeklyMinutes} minutes recorded over the last 7 days
            </div>
          </div>

          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Consistent daily study boosts memory retention by over 40%!
          </div>
        </div>

        {/* Sessions Count Card */}
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="card-title-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
                <Clock size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Logged Sessions</span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {studySessions.length} sessions
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Verified logs from timer and manual records
            </div>
          </div>

          <button onClick={() => setIsLogModalOpen(true)} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            <Plus size={14} /> Manually Log Session
          </button>
        </div>
      </div>

      {/* Focus Timer Section */}
      <FocusTimer
        onSessionComplete={(session) => addStudySession(session)}
        existingSubjects={existingSubjects}
      />

      {/* Two Column Grid: Subject Breakdown & Recent Logs */}
      <div className="grid-2">
        {/* Time by Subject */}
        <div className="card" style={{ padding: '1.35rem' }}>
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title">
              <div className="card-title-icon">
                <BarChart2 size={18} />
              </div>
              <span>Study Time by Subject</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {subjectBreakdown.length} subjects
            </span>
          </div>

          {subjectBreakdown.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No subject study hours recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {subjectBreakdown.map((item) => (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.subject}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.hours} hrs ({item.minutes} mins)
                    </span>
                  </div>
                  <div className="progress-container" style={{ height: 6 }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min(100, (item.minutes / (weeklyMinutes || item.minutes)) * 100)}%`,
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Sessions Log */}
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title">
              <div className="card-title-icon">
                <Clock size={18} />
              </div>
              <span>Session History</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Recent records
            </span>
          </div>

          <div style={{ flex: 1, maxHeight: 340, overflowY: 'auto' }}>
            {studySessions.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No completed sessions recorded yet. Start the focus timer to begin!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {studySessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {session.subject}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                          {session.durationMinutes} mins
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatDate(session.date)} {session.startTime ? `at ${formatTime12h(session.startTime)}` : ''}
                        {session.notes && ` • ${session.notes}`}
                      </div>
                    </div>

                    <button
                      onClick={() => setSessionToDelete(session)}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--danger)', flexShrink: 0 }}
                      title="Delete record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Session Modal */}
      <StudySessionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={(data) => addStudySession(data)}
        existingSubjects={existingSubjects}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) {
            deleteStudySession(sessionToDelete.id);
            setSessionToDelete(null);
          }
        }}
        title="Delete Study Record"
        message={`Are you sure you want to remove the study session for "${sessionToDelete?.subject}" (${sessionToDelete?.durationMinutes} mins)?`}
        confirmText="Delete Record"
      />
    </div>
  );
};

export default StudyPlanner;
