import React from 'react';
import { Pin, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const NoteCard = ({ note, onTogglePin, onEdit, onDelete }) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        backgroundColor: 'var(--bg-card)',
        borderColor: note.pinned ? 'var(--warning-border)' : 'var(--border-subtle)',
        boxShadow: note.pinned ? '0 0 12px rgba(245, 158, 11, 0.1)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div>
        {/* Top bar: Pin button, Title, Subject */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <button
              onClick={() => onTogglePin(note.id)}
              className="btn-icon"
              style={{
                width: 26,
                height: 26,
                color: note.pinned ? 'var(--warning)' : 'var(--text-muted)',
                transform: 'rotate(45deg)',
                padding: 0,
                flexShrink: 0,
              }}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin size={16} fill={note.pinned ? 'currentColor' : 'none'} />
            </button>
            <h3
              style={{
                fontSize: '1.05rem',
                margin: 0,
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
              }}
            >
              {note.title}
            </h3>
          </div>

          <span className="badge badge-purple" style={{ flexShrink: 0 }}>
            {note.subject}
          </span>
        </div>

        {/* Content Preview */}
        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: '1rem',
            maxHeight: 180,
            overflowY: 'auto',
            paddingRight: '0.25rem',
          }}
        >
          {note.content}
        </div>

        {/* Tag chips */}
        {note.tags && note.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {note.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} /> {formatDate(note.updatedAt || note.createdAt)}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(note)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
            title="Edit note"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="btn-icon"
            style={{ width: 30, height: 30, color: 'var(--danger)' }}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
