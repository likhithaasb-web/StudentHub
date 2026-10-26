import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Sparkles, Bell } from 'lucide-react';

const PRESETS = [
  { label: '25 min (Pomodoro)', minutes: 25 },
  { label: '45 min (Deep Work)', minutes: 45 },
  { label: '60 min (Intensive)', minutes: 60 },
];

const FocusTimer = ({ onSessionComplete, existingSubjects = [] }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionSubject, setSessionSubject] = useState(existingSubjects[0] || 'General Study');
  const [showCompletionNotice, setShowCompletionNotice] = useState(false);

  const initialDurationRef = useRef(25);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeftSeconds === 0) {
      setIsRunning(false);
      setShowCompletionNotice(true);

      // Record completed session
      onSessionComplete({
        subject: sessionSubject || 'Focus Session',
        durationMinutes: initialDurationRef.current,
        notes: `Focus timer completed for ${sessionSubject || 'study'} (${initialDurationRef.current} mins)`,
      });

      // Browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('StudentHub Focus Timer Completed!', {
          body: `Great job! You finished ${initialDurationRef.current} minutes of study on ${sessionSubject}.`,
        });
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSeconds, sessionSubject, onSessionComplete]);

  const handleSelectPreset = (mins) => {
    setIsRunning(false);
    setSelectedMinutes(mins);
    initialDurationRef.current = mins;
    setTimeLeftSeconds(mins * 60);
    setShowCompletionNotice(false);
  };

  const handleStart = () => {
    // Request notification permission if not yet requested
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setShowCompletionNotice(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedMinutes * 60);
    setShowCompletionNotice(false);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialDurationRef.current * 60 - timeLeftSeconds) / (initialDurationRef.current * 60)) * 100)
  );

  return (
    <div
      className="card"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Focus Pomodoro Timer</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Record verified study sessions automatically
          </span>
        </div>
        <span className={`badge ${isRunning ? 'badge-success' : 'badge-purple'}`}>
          {isRunning ? 'Timer Active' : 'Timer Ready'}
        </span>
      </div>

      {/* Completion alert notice */}
      {showCompletionNotice && (
        <div
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Sparkles size={18} />
          <span>Session completed! {initialDurationRef.current} minutes recorded to your study log.</span>
        </div>
      )}

      {/* Subject Input */}
      <div style={{ width: '100%', maxWidth: 360, marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="What subject are you studying?"
          value={sessionSubject}
          onChange={(e) => setSessionSubject(e.target.value)}
          disabled={isRunning}
          style={{ textAlign: 'center', fontWeight: 600 }}
          list="timerSubjectSuggestions"
        />
        <datalist id="timerSubjectSuggestions">
          {existingSubjects.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {PRESETS.map((p) => (
          <button
            key={p.minutes}
            type="button"
            onClick={() => handleSelectPreset(p.minutes)}
            disabled={isRunning}
            className="btn btn-sm"
            style={{
              backgroundColor: selectedMinutes === p.minutes ? 'var(--primary)' : 'var(--bg-tertiary)',
              color: selectedMinutes === p.minutes ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              opacity: isRunning && selectedMinutes !== p.minutes ? 0.5 : 1,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Circular Progress & Clock Face */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 'var(--radius-full)',
          background: `conic-gradient(var(--primary) ${progressPercent * 3.6}deg, var(--bg-tertiary) 0deg)`,
          padding: 8,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isRunning ? 'var(--shadow-glow)' : 'none',
          transition: 'box-shadow var(--transition-normal)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '2.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {formattedTime}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sessionSubject || 'Focus Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isRunning && timeLeftSeconds === selectedMinutes * 60 ? (
          <button onClick={handleStart} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            <Play size={18} fill="currentColor" /> Start Focus Session
          </button>
        ) : isRunning ? (
          <button onClick={handlePause} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            <Pause size={18} fill="currentColor" /> Pause
          </button>
        ) : (
          <button onClick={handleResume} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            <Play size={18} fill="currentColor" /> Resume
          </button>
        )}

        <button
          onClick={handleReset}
          className="btn btn-outline"
          style={{ padding: '0.75rem 1.25rem' }}
          title="Reset timer"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
