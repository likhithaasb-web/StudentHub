import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getTodayDateString } from '../../utils/dateUtils';

const ExamFormModal = ({ isOpen, onClose, onSave, examToEdit = null }) => {
  const [formData, setFormData] = useState({
    subject: '',
    date: getTodayDateString(),
    time: '09:00',
    location: '',
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (examToEdit) {
      setFormData({
        subject: examToEdit.subject || '',
        date: examToEdit.date || getTodayDateString(),
        time: examToEdit.time || '09:00',
        location: examToEdit.location || '',
        notes: examToEdit.notes || '',
      });
    } else {
      setFormData({
        subject: '',
        date: getTodayDateString(),
        time: '09:00',
        location: '',
        notes: '',
      });
    }
    setError('');
  }, [examToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Exam subject name is required');
      return;
    }
    if (!formData.date) {
      setError('Exam date is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={examToEdit ? 'Edit Exam' : 'Schedule New Exam'}
      maxWidth="500px"
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
          <label className="form-label">Subject / Course Name *</label>
          <input
            type="text"
            placeholder="e.g. Operating Systems Final"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Exam Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hall / Location</label>
          <input
            type="text"
            placeholder="e.g. Main Auditorium Hall A, Desk 42"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Topics / Allowed Materials / Notes</label>
          <textarea
            rows={3}
            placeholder="e.g. Chapters 1-6, open book, bring scientific calculator..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {examToEdit ? 'Save Changes' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExamFormModal;
