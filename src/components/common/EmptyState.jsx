import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-hover)',
      }}
    >
      {Icon && (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Icon size={28} />
        </div>
      )}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: 380, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
