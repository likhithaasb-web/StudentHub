import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, Edit2, Trash2, FileText, AlertCircle } from 'lucide-react';
import { formatDate, formatTime12h, getCountdownLabel } from '../../utils/dateUtils';

const ExamCard = ({ exam, onToggleCompleted, onEdit, onDelete }) => {
  const countdown = getCountdownLabel(exam.date);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        backgroundColor: exam.completed ? 'var(--bg-secondary)' : 'var(--bg-card)',
        borderColor: exam.completed
          ? 'var(--border-subtle)'
          : countdown.isUrgent
          ? 'var(--warning-border)'
          : 'var(--border-subtle)',
        opacity: exam.completed ? 0.75 : 1,
        transition: 'all var(--transition-fast)',
      }}
    >
      <div>
        {/* Top Header: Completion toggle, Subject, Status Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => onToggleCompleted(exam.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: exam.completed ? 'var(--success)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              title={exam.completed ? 'Mark as upcoming' : 'Mark as completed'}
            >
              {exam.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
            <h3
              style={{
                fontSize: '1.1rem',
                margin: 0,
                color: exam.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: exam.completed ? 'line-through' : 'none',
              }}
            >
              {exam.subject}
            </h3>
          </div>

          <span
            className={`badge ${
              exam.completed
                ? 'badge-success'
                : countdown.isOverdue
                ? 'badge-danger'
                : countdown.isUrgent
                ? 'badge-warning'
                : 'badge-purple'
            }`}
          >
            {exam.completed ? (
              'Completed'
            ) : (
              <>
                {countdown.isUrgent && <AlertCircle size={12} />}
                {countdown.text}
              </>
            )}
          </span>
        </div>

        {/* Exam Schedule Meta */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.85rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <span>{formatDate(exam.date)}</span>
          </div>
          {exam.time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} style={{ color: 'var(--accent-purple)' }} />
              <span>{formatTime12h(exam.time)}</span>
            </div>
          )}
          {exam.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} style={{ color: 'var(--accent-pink)' }} />
              <span>{exam.location}</span>
            </div>
          )}
        </div>

        {/* Optional Notes */}
        {exam.notes && (
          <div
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              display: 'flex',
              gap: '0.4rem',
              marginBottom: '1rem',
            }}
          >
            <FileText size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
            <span>{exam.notes}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {exam.completed ? 'Exam taken' : `Countdown: ${countdown.text}`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(exam)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
            title="Edit exam"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(exam)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--danger)' }}
            title="Delete exam"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
