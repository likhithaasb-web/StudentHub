import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Pin } from 'lucide-react';

const NoteEditorModal = ({ isOpen, onClose, onSave, noteToEdit = null, existingSubjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    tags: '',
    pinned: false,
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
      });
    } else {
      setFormData({
        title: '',
        subject: existingSubjects[0] || '',
        content: '',
        tags: '',
        pinned: false,
      });
    }
    setError('');
  }, [noteToEdit, isOpen, existingSubjects]);

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
