import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Palette, BookOpen, Tag } from 'lucide-react';

const PRESET_COLORS = [
  '#DFD6AE', // Yellow Sapling
  '#67e8f9', // Cyan
  '#34d399', // Emerald
  '#f59e0b', // Amber
  '#a78bfa', // Purple
  '#f87171', // Coral / Red
  '#ec4899', // Pink
  '#60a5fa', // Blue
];

const SubjectFormModal = ({
  isOpen,
  onClose,
  onSave,
  subjectToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    color: '#DFD6AE',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        name: subjectToEdit.subject || subjectToEdit.name || '',
        fullName: subjectToEdit.fullName || subjectToEdit.subject || '',
        color: subjectToEdit.color || '#DFD6AE',
      });
    } else {
      setFormData({
        name: '',
        fullName: '',
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      });
    }
    setError('');
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = formData.name.trim().toUpperCase();
    if (!name) {
      setError('Subject code / short name is required (e.g. CN, MFEF, ML).');
      return;
    }

    onSave({
      name,
      fullName: formData.fullName.trim() || name,
      color: formData.color,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? `Edit Subject: ${subjectToEdit.subject || subjectToEdit.name}` : 'Add New Subject'}
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={14} style={{ color: 'var(--primary)' }} /> Subject Code / Short Name *
          </label>
          <input
            type="text"
            placeholder="e.g. CN, MFEF, TRAINING, OT, API, ML"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
            required
            style={{ fontWeight: 700, letterSpacing: '0.04em' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={14} style={{ color: 'var(--primary)' }} /> Full Descriptive Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Networks & Protocols"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Palette size={14} style={{ color: 'var(--primary)' }} /> Color Tag
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, color: c })}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: formData.color === c ? '3px solid #fff' : '2px solid transparent',
                  cursor: 'pointer',
                  transform: formData.color === c ? 'scale(1.15)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {subjectToEdit ? 'Save Changes' : 'Create Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubjectFormModal;
