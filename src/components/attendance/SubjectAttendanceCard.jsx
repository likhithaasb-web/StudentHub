import React from 'react';
import {
  calculateAttendancePercentage,
  calculateClassesNeeded,
  calculateClassesCanMiss,
} from '../../utils/attendanceUtils';
import { Plus, Minus, Edit2, Trash2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const SubjectAttendanceCard = ({
  item,
  targetPercentage,
  onAdjust,
  onEdit,
  onDelete,
}) => {
  const percentage = calculateAttendancePercentage(item.attended, item.held);
  const isAboveTarget = percentage >= targetPercentage;

  const neededResult = calculateClassesNeeded(item.attended, item.held, targetPercentage);
  const canMissResult = calculateClassesCanMiss(item.attended, item.held, targetPercentage);

  const barColor = isAboveTarget
    ? 'var(--success)'
    : percentage >= targetPercentage - 10
    ? 'var(--warning)'
    : 'var(--danger)';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.35rem',
        backgroundColor: 'var(--bg-card)',
        borderColor: !isAboveTarget ? 'var(--danger-border)' : 'var(--border-subtle)',
        boxShadow: !isAboveTarget ? '0 0 15px rgba(239, 68, 68, 0.08)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
              {item.subject}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {item.attended} of {item.held} classes attended
            </span>
          </div>

          <span className={`badge ${isAboveTarget ? 'badge-success' : 'badge-danger'}`}>
            {isAboveTarget ? (
              <>
                <CheckCircle2 size={12} /> {percentage}%
              </>
            ) : (
              <>
                <AlertTriangle size={12} /> {percentage}%
              </>
            )}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.1rem' }}>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
            }}
          >
            <span>Target: {targetPercentage}%</span>
            <span>{isAboveTarget ? 'On track' : 'Shortage'}</span>
          </div>
        </div>

        {/* Mathematical Guidance / Insight Box */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isAboveTarget ? 'var(--bg-tertiary)' : 'var(--danger-bg)',
            border: isAboveTarget ? '1px solid var(--border-subtle)' : '1px solid var(--danger-border)',
            fontSize: '0.825rem',
            lineHeight: 1.45,
            color: isAboveTarget ? 'var(--text-secondary)' : 'var(--danger)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          {isAboveTarget ? (
            <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          ) : (
            <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
          )}
          <div>
            {isAboveTarget ? (
              canMissResult.message
            ) : (
              <div>
                <strong>Below target:</strong> {neededResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => onAdjust(item.id, 1, 1)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', borderColor: 'var(--success-border)', color: 'var(--success)' }}
            title="Mark present for today's class (+1 attended, +1 held)"
          >
            <Plus size={14} /> Attended
          </button>
          <button
            onClick={() => onAdjust(item.id, 0, 1)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem', borderColor: 'var(--danger-border)', color: 'var(--danger)' }}
            title="Mark absent for today's class (+0 attended, +1 held)"
          >
            <Plus size={14} /> Missed
          </button>
        </div>
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
          {item.held - item.attended} classes missed total
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(item)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
            title="Edit subject record"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--danger)' }}
            title="Delete subject record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectAttendanceCard;
