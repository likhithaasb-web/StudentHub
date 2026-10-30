import React from 'react';
import { Pin, Edit2, Trash2, Calendar, Tag, Share2, Download, Paperclip } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { downloadAttachment } from '../../utils/noteExport';

const WhatsAppIcon = ({ size = 15, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.507 14.307c-.283-.141-1.67-.824-1.929-.918-.259-.095-.448-.141-.637.141-.189.283-.73 0.918-.895 1.107-.165.189-.33.212-.613.071-.283-.142-1.196-.441-2.278-1.406-.843-.751-1.411-1.68-1.576-1.963-.165-.283-.018-.436.124-.577.127-.127.283-.33.424-.495.142-.165.189-.283.283-.472.095-.189.047-.354-.024-.495-.071-.141-.637-1.533-.872-2.1-.229-.553-.462-.478-.637-.487-.165-.008-.354-.01-.542-.01s-.495.071-.754.354c-.259.283-.99 0.967-.99 2.358 0 1.391 1.013 2.735 1.155 2.924.142.189 1.993 3.044 4.829 4.268.675.292 1.202.466 1.613.597.678.216 1.296.185 1.785.112.545-.082 1.67-.683 1.906-1.342.235-.66.235-1.225.165-1.342-.07-.117-.259-.188-.542-.33z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.662 1.438 5.176L2 22l4.982-1.404C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.642 0-3.167-.47-4.46-1.282l-.32-.2-2.956.833.847-2.88-.208-.332A8.163 8.163 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z"
      fill={color}
    />
  </svg>
);

const NoteCard = ({ note, onTogglePin, onEdit, onDelete, onWhatsApp, onShareModal, onExport, onShare }) => {
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

        {/* Attached Documents preview */}
        {note.attachments && note.attachments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {note.attachments.map((att, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadAttachment(att);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.6rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'background-color 0.15s ease',
                }}
                title="Click to download document"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                  <Paperclip size={13} color="var(--primary)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    ({Math.round((att.size || 0) / 1024)} KB)
                  </span>
                </div>
                <Download size={13} style={{ flexShrink: 0, marginLeft: 6, color: 'var(--primary)' }} />
              </div>
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
          {/* Export to PDF / Word button */}
          {onExport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExport(note);
              }}
              className="btn-icon"
              style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
              title="Convert / Export note to PDF or Word Doc"
            >
              <Download size={14} />
            </button>
          )}

          {(onWhatsApp || onShare) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onWhatsApp) {
                  onWhatsApp(note);
                } else if (onShare) {
                  onShare(note);
                }
              }}
              className="btn-icon"
              style={{
                width: 30,
                height: 30,
                color: '#25D366',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
              }}
              title="Share directly to WhatsApp"
            >
              <WhatsAppIcon size={16} color="#25D366" />
            </button>
          )}

          {onShareModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShareModal(note);
              }}
              className="btn-icon"
              style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
              title="Share link & preview options"
            >
              <Share2 size={14} />
            </button>
          )}

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
