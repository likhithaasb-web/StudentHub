import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Share2, Sparkles, Globe } from 'lucide-react';
import { getNoteShareUrl, formatNoteForWhatsApp, shareNoteToWhatsApp, copyTextToClipboard } from '../../utils/shareUtils';

// Authentic WhatsApp SVG Icon
const WhatsAppIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
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

const NoteShareModal = ({ isOpen, onClose, note }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !note) return null;

  const shareUrl = getNoteShareUrl(note.id || note._id);
  const formattedText = formatNoteForWhatsApp(note);

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyText = async () => {
    const success = await copyTextToClipboard(formattedText);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    }
  };

  const handleOpenWhatsApp = () => {
    shareNoteToWhatsApp(note);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 580,
          width: '94%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(23, 100, 77, 0.08) 0%, rgba(241, 234, 215, 0.4) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 211, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#25D366',
              }}
            >
              <WhatsAppIcon size={22} color="#25D366" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Share Note with Classmates
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Share via WhatsApp or copy the public web link
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: 32, height: 32 }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Note Title & Subject pill */}
          <div
            style={{
              padding: '0.9rem 1.1rem',
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
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sharing Note
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {note.title}
              </div>
            </div>
            <span className="badge badge-purple" style={{ flexShrink: 0 }}>
              {note.subject}
            </span>
          </div>

          {/* Primary Action Button: Direct WhatsApp Share */}
          <div>
            <button
              onClick={handleOpenWhatsApp}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.975rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.18s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#20ba5a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
            >
              <WhatsAppIcon size={22} color="#ffffff" />
              <span>Share to WhatsApp</span>
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
              Opens WhatsApp Web or mobile app with your formatted note ready to send
            </div>
          </div>

          {/* Public Web Link Sharing Box */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <Globe size={15} color="var(--primary)" />
              <span>Public Peer Link</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', backgroundColor: 'var(--primary-subtle)', padding: '0.1rem 0.45rem', borderRadius: 99 }}>
                No login required for peers
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.55rem 0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  cursor: 'text',
                }}
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.825rem',
                  padding: '0.55rem 0.9rem',
                  minWidth: 105,
                  justifyContent: 'center',
                  borderColor: copiedLink ? 'var(--primary)' : undefined,
                  color: copiedLink ? 'var(--primary)' : undefined,
                }}
              >
                {copiedLink ? (
                  <>
                    <Check size={14} color="var(--primary)" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Message Preview */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Message Preview
              </div>
              <button
                onClick={handleCopyText}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedText ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.4rem',
                }}
              >
                {copiedText ? (
                  <>
                    <Check size={13} color="var(--primary)" /> Text Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy Formatted Text
                  </>
                )}
              </button>
            </div>

            <div
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                lineHeight: 1.55,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                maxHeight: 160,
                overflowY: 'auto',
                fontFamily: 'monospace',
              }}
            >
              {formattedText}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteShareModal;