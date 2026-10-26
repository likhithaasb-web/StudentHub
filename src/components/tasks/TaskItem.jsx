import React from 'react';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { getCountdownLabel, formatDate } from '../../utils/dateUtils';

const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  const countdown = getCountdownLabel(task.dueDate);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1.1rem 1.25rem',
        backgroundColor: isCompleted ? 'var(--bg-secondary)' : 'var(--bg-card)',
        borderColor: countdown.isOverdue && !isCompleted ? 'var(--danger-border)' : 'var(--border-subtle)',
        opacity: isCompleted ? 0.75 : 1,
        transition: 'all var(--transition-fast)',
      }}
    >
      {/* Complete toggle checkbox */}
      <button
        onClick={() => onToggleStatus(task.id)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        aria-label="Toggle task completion"
      >
        {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>

      {/* Main Task Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              margin: 0,
            }}
          >
            {task.title}
          </h4>

          {/* Badges */}
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          <span className="badge badge-purple">
            {task.subject || 'General'}
          </span>

          <span
            className={`badge ${
              task.status === 'Completed'
                ? 'badge-success'
                : task.status === 'In Progress'
                ? 'badge-info'
                : 'badge-warning'
            }`}
          >
            {task.status}
          </span>
        </div>

        {task.description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
              lineHeight: 1.45,
            }}
          >
            {task.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={13} /> Due: {formatDate(task.dueDate)}
          </span>

          {!isCompleted && (
            <span
              className={`badge ${
                countdown.isOverdue
                  ? 'badge-danger'
                  : countdown.isUrgent
                  ? 'badge-warning'
                  : 'badge-info'
              }`}
              style={{ fontSize: '0.7rem' }}
            >
              {countdown.isOverdue && <AlertCircle size={11} />}
              {countdown.text}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={() => onEdit(task)}
          className="btn-icon"
          style={{
            width: 32,
            height: 32,
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
          }}
          title="Edit task"
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="btn-icon"
          style={{
            width: 32,
            height: 32,
            color: 'var(--danger)',
            borderRadius: 'var(--radius-sm)',
          }}
          title="Delete task"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
