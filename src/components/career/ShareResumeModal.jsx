import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Copy, Check, ExternalLink, Globe, Sparkles, ShieldCheck, Share2 } from 'lucide-react';

const ShareResumeModal = ({ isOpen, onClose, resume }) => {
  const [copied, setCopied] = useState(false);

  if (!resume) return null;

  const shareId = resume.shareId || resume.id;
  const shareUrl = `${window.location.origin}/r/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleOpen = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Live Resume Link" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 700 }}>
            {resume.title || 'Student Resume'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Anyone with this unique link can view your live resume online and download an A4 PDF without creating an account.
          </p>
        </div>

        {/* Link Input & Copy Group */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--accent-cream, #f0eada)',
              }}
            />
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => e.target.select()}
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '0.75rem',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
            style={{ gap: '0.35rem', whiteSpace: 'nowrap', minWidth: 105 }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Action Button: Open in New Tab */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={handleOpen}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem', fontSize: '0.825rem' }}
          >
            <ExternalLink size={14} /> Open Live Preview in New Tab
          </button>
        </div>

        {/* Benefits list */}
        <div
          style={{
            backgroundColor: 'rgba(240, 234, 218, 0.08)',
            border: '1px solid rgba(240, 234, 218, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-cream, #f0eada)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Always Up-to-Date</strong>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Edits made in Career Studio sync immediately. Recruiters always see your latest projects and GPA.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Private & Unindexed</strong>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Your resume is only accessible to people who have the direct unique link.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareResumeModal;
