import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Pin, Paperclip, X, Upload } from 'lucide-react';

const NoteEditorModal = ({ isOpen, onClose, onSave, noteToEdit = null, existingSubjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    tags: '',
    pinned: false,
    attachments: [],
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setFormData({
        title: noteToEdit.title || '',
        subject: noteToEdit.subject || '',
        content: noteToEdit.content || '',
        tags: Array.isArray(noteToEdit.tags) ? noteToEdit.tags.join(', ') : '',
        pinned: Boolean(noteToEdit.pinned),
        attachments: Array.isArray(noteToEdit.attachments) ? noteToEdit.attachments : [],
      });
    } else {
      setFormData({
        title: '',
        subject: existingSubjects[0] || '',
        content: '',
        tags: '',
        pinned: false,
        attachments: [],
      });
    }
    setError('');
  }, [noteToEdit, isOpen, existingSubjects]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('Attached document exceeds 20MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const newAtt = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: loadEvt.target.result,
        uploadedAt: new Date().toISOString(),
      };
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAtt],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Note title is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={noteToEdit ? 'Edit Note' : 'Create New Note'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Note Title *</label>
          <input
            type="text"
            placeholder="e.g. Dynamic Programming Recurrence Patterns"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject / Topic</label>
            <input
              type="text"
              placeholder="e.g. Algorithms"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              list="noteSubjectSuggestions"
            />
            <datalist id="noteSubjectSuggestions">
              {existingSubjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. exam, formula, cheatsheet"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note Content</label>
          <textarea
            rows={8}
            placeholder="Type your lecture notes, code snippets, equations, or summaries here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            style={{ fontFamily: 'inherit', lineHeight: 1.5 }}
          />
        </div>

        {/* Attached Documents Section (WhatsApp docs, PDFs, etc.) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Paperclip size={14} /> Attached Documents ({formData.attachments?.length || 0})
            </label>
            <label
              style={{
                fontSize: '0.8rem',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Upload size={13} /> Add Document / PDF
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
              />
            </label>
          </div>

          {formData.attachments && formData.attachments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {formData.attachments.map((att, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                    <Paperclip size={14} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {att.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      ({Math.round((att.size || 0) / 1024)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="btn-icon"
                    style={{ width: 22, height: 22 }}
                    title="Remove attachment"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                padding: '0.4rem 0',
              }}
            >
              No documents attached. You can attach PDFs, Word docs, or images received from WhatsApp.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="checkbox"
            id="pinCheckbox"
            checked={formData.pinned}
            onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label
            htmlFor="pinCheckbox"
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Pin size={14} style={{ color: 'var(--warning)', transform: 'rotate(45deg)' }} /> Pin this note to top of page
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {noteToEdit ? 'Save Changes' : 'Save Note'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteEditorModal;
