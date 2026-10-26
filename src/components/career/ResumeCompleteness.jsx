import React from 'react';
import { calculateResumeCompleteness } from '../../utils/resumeValidation';
import { CheckCircle2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

const ResumeCompleteness = ({ resume, onSelectSection }) => {
  const { score, suggestions, isComplete } = calculateResumeCompleteness(resume);

  const getScoreColor = () => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreBadgeClass = () => {
    if (score >= 80) return 'badge-success';
    if (score >= 50) return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Resume Completeness
          </h4>
        </div>

        <span className={`badge ${getScoreBadgeClass()}`} style={{ fontWeight: 800, fontSize: '0.85rem' }}>
          {score}%
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div className="progress-container" style={{ height: 8 }}>
          <div
            className="progress-bar"
            style={{
              width: `${score}%`,
              backgroundColor: getScoreColor(),
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
          <span>{isComplete ? 'Application Ready' : 'In Progress'}</span>
          <span>Target: 80%+</span>
        </div>
      </div>

      {/* Suggestions / Checklist */}
      {suggestions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
            }}
          >
            Recommended Additions:
          </div>
          {suggestions.slice(0, 3).map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSection && onSelectSection(sug.field.split('.')[0])}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={13} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                <span>{sug.text}</span>
              </div>
              <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid var(--success-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--success)',
          }}
        >
          <CheckCircle2 size={16} />
          <span>All essential resume sections are thoroughly completed!</span>
        </div>
      )}

      {/* Guidance Note */}
      <div
        style={{
          marginTop: '0.85rem',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}
      >
        Guidance: This completion indicator highlights key information recommended for internship & placement applications. It does not represent an automated ATS score.
      </div>
    </div>
  );
};

export default ResumeCompleteness;
