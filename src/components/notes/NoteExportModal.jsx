import React from 'react';
import Modal from '../common/Modal';
import { FileText, Download, Printer, Share2, Paperclip, Check, FileCode, ExternalLink } from 'lucide-react';
import { exportNoteToPdf, exportNoteToWord, exportNoteToText, downloadAttachment } from '../../utils/noteExport';
import { shareNoteToWhatsApp } from '../../utils/shareUtils';

const WhatsAppIcon = ({ size = 18, color = 'currentColor' }) => (
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

const NoteExportModal = ({ isOpen, onClose, note }) => {
  if (!isOpen || !note) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert & Export Note" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Note preview pill */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Exporting Note
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {note.title}
            </div>
          </div>
          <span className="badge badge-purple" style={{ flexShrink: 0 }}>
            {note.subject}
          </span>
        </div>

        {/* Export Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {/* PDF Export */}
          <button
            type="button"
            onClick={() => exportNoteToPdf(note)}
            className="card"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.5rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              textAlign: 'left',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Printer size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Export as PDF Document
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                High-fidelity A4 revision sheet formatted with StudentHub styling.
              </div>
            </div>
          </button>

          {/* Word (.doc) Export */}
          <button
            type="button"
            onClick={() => exportNoteToWord(note)}
            className="card"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.5rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              textAlign: 'left',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Export as Word Doc (.doc)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Editable document ready for Microsoft Word, Google Docs, or WPS.
              </div>
            </div>
          </button>

          {/* Plain Text (.txt) Export */}
          <button
            type="button"
            onClick={() => exportNoteToText(note)}
            className="card"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.5rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              textAlign: 'left',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCode size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Export as Plain Text (.txt)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Lightweight plaintext file for quick reading or offline storage.
              </div>
            </div>
          </button>

          {/* Forward to WhatsApp */}
          <button
            type="button"
            onClick={() => shareNoteToWhatsApp(note)}
            className="card"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.5rem',
              cursor: 'pointer',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              backgroundColor: 'rgba(37, 211, 102, 0.05)',
              textAlign: 'left',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#25D366')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.3)')}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#25D366',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WhatsAppIcon size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Share to WhatsApp
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Redirect directly to WhatsApp with pre-filled note and online link.
              </div>
            </div>
          </button>
        </div>

        {/* Attached Documents section */}
        {note.attachments && note.attachments.length > 0 && (
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Paperclip size={14} color="var(--primary)" />
              <span>Download Attached Documents ({note.attachments.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {note.attachments.map((att, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                    <FileText size={14} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {att.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      ({Math.round((att.size || 0) / 1024)} KB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadAttachment(att)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteExportModal;