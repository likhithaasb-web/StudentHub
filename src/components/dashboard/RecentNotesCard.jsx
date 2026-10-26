import React from 'react';
import { FileText, Pin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentNotesCard = ({ notes = [] }) => {
  const topNotes = [...notes]
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">
            <FileText size={18} />
          </div>
          <div>
            <span>Recent Notes</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Quick access to your revision materials
            </div>
          </div>
        </div>
        <Link
          to="/notes"
          style={{
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          All Notes <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {topNotes.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <p>No notes written yet.</p>
            <Link to="/notes" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              Create a Note
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {topNotes.map((note) => (
              <Link
                key={note.id}
                to="/notes"
                style={{
                  display: 'block',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                    {note.pinned && <Pin size={12} style={{ color: 'var(--warning)', transform: 'rotate(45deg)' }} />}
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {note.title}
                    </span>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                    {note.subject}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                  }}
                >
                  {note.content}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentNotesCard;
