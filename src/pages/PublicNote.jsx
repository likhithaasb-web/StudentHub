import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import {
  FileText,
  Calendar,
  Tag,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Share2,
  Sparkles,
  Download,
  Paperclip,
  Printer,
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { copyTextToClipboard, shareNoteToWhatsApp, formatNoteForWhatsApp } from '../utils/shareUtils';
import { exportNoteToPdf, exportNoteToWord, downloadAttachment } from '../utils/noteExport';

// Authentic WhatsApp SVG Icon
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

const PublicNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError('');

      // 1. Try public backend endpoint
      try {
        const data = await api.get(`/notes/public/${shareId}`);
        if (data && (data.title || data._id)) {
          setNote(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback below
      }

      // 2. Fallback to localStorage
      try {
        const raw = localStorage.getItem('notes');
        if (raw) {
          const parsed = JSON.parse(raw);
          const found = parsed.find((n) => n.id === shareId || n._id === shareId);
          if (found) {
            setNote(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      setError('The requested note was not found or the link may have expired.');
      setLoading(false);
    };

    if (shareId) {
      fetchNote();
    }
  }, [shareId]);

  const handleCopyLink = async () => {
    const ok = await copyTextToClipboard(window.location.href);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyContent = async () => {
    if (!note) return;
    const ok = await copyTextToClipboard(formatNoteForWhatsApp(note));
    if (ok) {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (note) {
      shareNoteToWhatsApp(note);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0d281f',
          color: '#F1EAD7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '3px solid rgba(241, 234, 215, 0.2)',
            borderTopColor: '#F1EAD7',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: '#F1EAD7', fontSize: '0.95rem', fontWeight: 500 }}>
          Loading shared student note...
        </p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0d281f',
          color: '#F1EAD7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <FileText size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Note Not Found</h2>
        <p style={{ color: 'rgba(241, 234, 215, 0.7)', maxWidth: 440, marginBottom: '1.5rem' }}>
          {error || 'The note link you followed could not be loaded.'}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: '#17644D',
            color: '#F1EAD7',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontWeight: 600,
            border: '1px solid rgba(241, 234, 215, 0.3)',
          }}
        >
          <ArrowLeft size={16} /> Go to StudentHub
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a1d17',
        color: '#F1EAD7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Shared Note Banner / Header */}
      <header
        style={{
          backgroundColor: '#11352a',
          borderBottom: '1px solid rgba(241, 234, 215, 0.12)',
          padding: '0.85rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#17644D',
                border: '1px solid rgba(241, 234, 215, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F1EAD7',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em', color: '#F1EAD7' }}>
                StudentHub
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(241, 234, 215, 0.65)' }}>
                Peer Revision & Study Material
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)',
              }}
              title="Share to WhatsApp"
            >
              <WhatsAppIcon size={16} color="#ffffff" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                backgroundColor: 'rgba(241, 234, 215, 0.08)',
                color: '#F1EAD7',
                border: '1px solid rgba(241, 234, 215, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
              }}
            >
              {copiedLink ? <Check size={14} color="#25D366" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: '#17644D',
                color: '#F1EAD7',
                border: '1px solid rgba(241, 234, 215, 0.3)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.825rem',
                textDecoration: 'none',
              }}
            >
              <span>StudentHub</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: 860,
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.25rem 4rem 1.25rem',
        }}
      >
        {/* Note Paper Card */}
        <article
          style={{
            backgroundColor: '#ffffff',
            color: '#1a202c',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(241, 234, 215, 0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Note Top Bar */}
          <div
            style={{
              padding: '1.75rem 2rem 1.25rem 2rem',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#17644D',
                  color: '#F1EAD7',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 99,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {note.subject}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
                <Calendar size={14} />
                <span>Last updated {formatDate(note.updatedAt || note.createdAt)}</span>
              </div>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.3,
                margin: 0,
                wordBreak: 'break-word',
              }}
            >
              {note.title}
            </h1>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 4,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note Body */}
          <div
            style={{
              padding: '2rem',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: '#334155',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              minHeight: 260,
            }}
          >
            {note.content || 'No content recorded in this note.'}
          </div>

          {/* Attached Documents if present */}
          {note.attachments && note.attachments.length > 0 && (
            <div
              style={{
                padding: '1.25rem 2rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Paperclip size={15} color="#17644D" />
                <span>Attached Coursework Documents ({note.attachments.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {note.attachments.map((att, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.825rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <FileText size={15} color="#17644D" />
                      <span style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {att.name}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        ({Math.round((att.size || 0) / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadAttachment(att)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#17644D',
                        color: '#F1EAD7',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Download size={13} /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions inside Note */}
          <div
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Study note shared via <strong>StudentHub</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => exportNoteToPdf(note)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Download / Print as PDF"
              >
                <Printer size={14} color="#ef4444" />
                <span>Save as PDF</span>
              </button>

              <button
                onClick={() => exportNoteToWord(note)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Download as Microsoft Word document"
              >
                <FileText size={14} color="#3b82f6" />
                <span>Save as Word (.doc)</span>
              </button>

              <button
                onClick={handleCopyContent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedContent ? <Check size={14} color="#17644D" /> : <Copy size={14} />}
                <span>{copiedContent ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <WhatsAppIcon size={16} color="#ffffff" />
                <span>Forward on WhatsApp</span>
              </button>
            </div>
          </div>
        </article>

        {/* Call to action for classmates */}
        <section
          style={{
            marginTop: '2.5rem',
            padding: '1.75rem',
            backgroundColor: 'rgba(3, 22, 16, 0.88)',
          backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(241, 234, 215, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} color="#F1EAD7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#F1EAD7' }}>
                Join StudentHub to Ace Your Semesters
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(241, 234, 215, 0.75)', maxWidth: 520 }}>
              Track 75% attendance criteria, manage exam timetables, organize coursework notes, and build career-ready resumes in one unified workspace.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              padding: '0.75rem 1.4rem',
              backgroundColor: '#F1EAD7',
              color: '#17644D',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span>Open StudentHub</span>
            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default PublicNote;