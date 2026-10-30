import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Upload, FileText, MessageSquare, Check, AlertCircle, Paperclip, X } from 'lucide-react';

const WhatsAppIcon = ({ size = 20, color = 'currentColor' }) => (
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

const WhatsAppImportModal = ({ isOpen, onClose, onImportNote, existingSubjects = [] }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [subject, setSubject] = useState(existingSubjects[0] || 'CN');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('whatsapp, coursework');
  const [error, setError] = useState('');

  // Tab 1: Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tab 2: Paste state
  const [pastedText, setPastedText] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setIsProcessing(true);

    // Auto-fill title from filename
    const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
    if (!title) {
      setTitle(cleanFileName);
    }

    // Try auto-detecting subject from filename
    const lowerName = cleanFileName.toLowerCase();
    const matchedSubject = existingSubjects.find((s) => lowerName.includes(s.toLowerCase()));
    if (matchedSubject) {
      setSubject(matchedSubject);
    }

    const reader = new FileReader();

    // If it's a text/markdown file, read content directly
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (loadEvent) => {
        const text = loadEvent.target.result;
        setExtractedContent(text);
        setFileData({
          name: file.name,
          type: file.type || 'text/plain',
          size: file.size,
          data: loadEvent.target.result,
        });
        setIsProcessing(false);
      };
      reader.readAsText(file);
    } else {
      // For PDF, Word docs, images: read as Data URL to store as attachment
      reader.onload = (loadEvent) => {
        setFileData({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          data: loadEvent.target.result,
        });
        setExtractedContent(`[Attached Document: ${file.name} (${Math.round(file.size / 1024)} KB)]\n\nDownloaded from WhatsApp coursework chat.`);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) {
      setError('Please paste a WhatsApp message first.');
      return;
    }

    setError('');
    const lines = pastedText.trim().split('\n').filter((l) => l.trim().length > 0);
    const firstLine = lines[0].replace(/^[*_~#]+|[*_~#]+$/g, '').trim();

    // Auto-detect title
    const detectedTitle = firstLine.length > 60 ? firstLine.slice(0, 60) + '...' : firstLine;
    setTitle(detectedTitle);

    // Auto-detect subject if mentioned in message
    const lowerMsg = pastedText.toLowerCase();
    const foundSubject = existingSubjects.find((s) => lowerMsg.includes(s.toLowerCase()));
    if (foundSubject) {
      setSubject(foundSubject);
    }

    setExtractedContent(pastedText.trim());
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Note title is required.');
      return;
    }
    if (!subject.trim()) {
      setError('Please choose a subject.');
      return;
    }

    const attachments = fileData ? [fileData] : [];
    const content = extractedContent || pastedText || 'Imported document note.';

    onImportNote({
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      pinned: false,
      attachments: attachments,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Notes & Docs from WhatsApp" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner with WhatsApp styling */}
        <div
          style={{
            padding: '0.9rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WhatsAppIcon size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
              Add WhatsApp Material to StudentHub
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Import PDFs, Word docs, photos, or text messages shared in your college WhatsApp groups.
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '0.6rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'upload' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'upload' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Upload size={15} /> Upload WhatsApp File (.pdf, .doc, image)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            style={{
              padding: '0.6rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'paste' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'paste' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'paste' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <MessageSquare size={15} /> Paste WhatsApp Text
          </button>
        </div>

        {/* Tab 1: File Upload */}
        {activeTab === 'upload' && (
          <div>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.75rem 1.25rem',
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {selectedFile ? selectedFile.name : 'Choose WhatsApp doc or drop file here'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, DOC, TXT, PNG, JPG (up to 20MB)
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
              />
            </label>

            {selectedFile && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                  <Paperclip size={15} color="var(--primary)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFile.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileData(null);
                    setExtractedContent('');
                  }}
                  className="btn-icon"
                  style={{ width: 24, height: 24 }}
                  title="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Message */}
        {activeTab === 'paste' && (
          <div>
            <textarea
              rows={6}
              placeholder="Paste forwarded WhatsApp notes or exam questions here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={handleProcessPastedText}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              >
                Auto-Detect Title & Subject
              </button>
            </div>
          </div>
        )}

        {/* Note Metadata Details Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.825rem' }}>Note Title *</label>
            <input
              type="text"
              placeholder="e.g. Unit 3 Computer Networks Lecture Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row" style={{ margin: 0 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.825rem' }}>Subject *</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {existingSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.825rem' }}>Tags</label>
              <input
                type="text"
                placeholder="e.g. whatsapp, unit3, exam"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.825rem' }}>Note Summary / Content</label>
            <textarea
              rows={4}
              placeholder="Coursework content or description..."
              value={extractedContent}
              onChange={(e) => setExtractedContent(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isProcessing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Check size={16} /> Save to StudentHub Notes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppImportModal;