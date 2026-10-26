import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const AttendanceFormModal = ({ isOpen, onClose, onSave, subjectToEdit = null }) => {
  const [formData, setFormData] = useState({
    subject: '',
    held: 1,
    attended: 1,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        subject: subjectToEdit.subject || '',
        held: subjectToEdit.held || 0,
        attended: subjectToEdit.attended || 0,
      });
    } else {
      setFormData({
        subject: '',
        held: 20,
        attended: 18,
      });
    }
    setError('');
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Subject name is required');
      return;
    }

    const held = parseInt(formData.held, 10);
    const attended = parseInt(formData.attended, 10);

    if (isNaN(held) || held < 0) {
      setError('Classes held must be 0 or greater');
      return;
    }
    if (isNaN(attended) || attended < 0) {
      setError('Classes attended must be 0 or greater');
      return;
    }
    if (attended > held) {
      setError('Classes attended cannot exceed total classes held');
      return;
    }

    onSave({
      subject: formData.subject.trim(),
      held,
      attended,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? 'Edit Subject Attendance' : 'Add Subject to Track'}
      maxWidth="460px"
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
          <label className="form-label">Subject Name *</label>
          <input
            type="text"
            placeholder="e.g. Operating Systems"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Classes Held</label>
            <input
              type="number"
              min={0}
              value={formData.held}
              onChange={(e) => setFormData({ ...formData, held: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Classes Attended</label>
            <input
              type="number"
              min={0}
              max={formData.held}
              value={formData.attended}
              onChange={(e) => setFormData({ ...formData, attended: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {subjectToEdit ? 'Save Changes' : 'Track Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AttendanceFormModal;
