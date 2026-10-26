import React from 'react';
import {
  calculateAttendancePercentage,
  calculateClassesNeeded,
  calculateClassesCanMiss,
} from '../../utils/attendanceUtils';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
} from 'lucide-react';

const SubjectAttendanceCard = ({
  item,
  targetPercentage,
  onQuickMark,
  onOpenRecordModal,
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
        padding: '1.4rem',
        backgroundColor: 'var(--bg-card)',
        borderColor: !isAboveTarget && item.held > 0 ? 'var(--danger-border)' : 'var(--border-subtle)',
        boxShadow: !isAboveTarget && item.held > 0 ? '0 0 16px rgba(248, 113, 113, 0.12)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        position: 'relative',
      }}
    >
      <div>
        {/* Top Header: Subject Code & Name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '0.65rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: item.color || 'var(--primary)',
                }}
              />
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                }}
              >
                {item.subject}
              </h3>
            </div>
            {item.fullName && item.fullName !== item.subject && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.3,
                  maxWidth: 220,
                }}
              >
                {item.fullName}
              </div>
            )}
          </div>

          <span
            className={`badge ${
              item.held === 0
                ? 'badge-purple'
                : isAboveTarget
                ? 'badge-success'
                : 'badge-danger'
            }`}
            style={{ fontWeight: 700, fontSize: '0.85rem' }}
          >
            {item.held === 0 ? (
              'No classes'
            ) : isAboveTarget ? (
              <>
                <CheckCircle2 size={13} /> {percentage}%
              </>
            ) : (
              <>
                <AlertTriangle size={13} /> {percentage}%
              </>
            )}
          </span>
        </div>

        {/* Breakdown Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Held: </span>
            <strong>{item.held}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--success)' }}>Attended: </span>
            <strong>{item.attended}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--danger)' }}>Absent: </span>
            <strong>{item.absent ?? (item.held - item.attended)}</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="progress-container" style={{ height: 9 }}>
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
            <span>
              {item.held === 0
                ? 'Ready to log'
                : isAboveTarget
                ? 'On track'
                : 'Shortage Warning'}
            </span>
          </div>
        </div>

        {/* Mathematical Forecast / Shortage Box */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor:
              item.held === 0
                ? 'var(--bg-tertiary)'
                : isAboveTarget
                ? 'rgba(52, 211, 153, 0.08)'
                : 'var(--danger-bg)',
            border:
              item.held === 0
                ? '1px solid var(--border-subtle)'
                : isAboveTarget
                ? '1px solid var(--success-border)'
                : '1px solid var(--danger-border)',
            fontSize: '0.825rem',
            lineHeight: 1.45,
            color:
              item.held === 0
                ? 'var(--text-muted)'
                : isAboveTarget
                ? 'var(--text-primary)'
                : 'var(--danger)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.55rem',
          }}
        >
          {item.held === 0 ? (
            <Info size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
          ) : isAboveTarget ? (
            <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
          ) : (
            <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
          )}

          <div>
            {item.held === 0 ? (
              'Record your first class using the buttons below.'
            ) : isAboveTarget ? (
              <div>
                <strong>Safe Margin:</strong> {canMissResult.message}
              </div>
            ) : (
              <div>
                <strong>Shortage Alert:</strong> {neededResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Quick Log Buttons for Today's Class */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
              marginBottom: '0.45rem',
            }}
          >
            Record Today's Class
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => onQuickMark(item.subject, 'Present')}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: 'var(--success-border)',
                backgroundColor: 'rgba(52, 211, 153, 0.08)',
                color: 'var(--success)',
                fontWeight: 600,
                justifyContent: 'center',
                gap: '0.35rem',
              }}
              title="Record class as Present today"
            >
              <Check size={14} /> Present
            </button>
            <button
              onClick={() => onQuickMark(item.subject, 'Absent')}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: 'var(--danger-border)',
                backgroundColor: 'rgba(248, 113, 113, 0.08)',
                color: 'var(--danger)',
                fontWeight: 600,
                justifyContent: 'center',
                gap: '0.35rem',
              }}
              title="Record class as Absent today"
            >
              <X size={14} /> Absent
            </button>
          </div>

          <button
            onClick={() => onOpenRecordModal(item.subject)}
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <FileText size={13} /> Custom Date / Add Notes...
          </button>
        </div>
      </div>

      {/* Footer Actions: Edit Subject & Delete Subject */}
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
          {item.absent ?? (item.held - item.attended)} absences recorded
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(item)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
            title="Edit subject name or color"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--danger)' }}
            title="Delete subject and its records"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectAttendanceCard;
