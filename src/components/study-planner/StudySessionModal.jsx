import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getTodayDateString } from '../../utils/dateUtils';

const StudySessionModal = ({ isOpen, onClose, onSave, existingSubjects = [] }) => {
  const [formData, setFormData] = useState({
    subject: '',
    date: getTodayDateString(),
    startTime: '14:00',
    durationMinutes: 60,
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      subject: existingSubjects[0] || '',
      date: getTodayDateString(),
      startTime: '14:00',
      durationMinutes: 60,
      notes: '',
    });
    setError('');
  }, [isOpen, existingSubjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Subject name is required');
      return;
    }
    const duration = parseInt(formData.durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      setError('Duration must be at least 1 minute');
      return;
    }

    onSave({
      subject: formData.subject.trim(),
      date: formData.date || getTodayDateString(),
      startTime: formData.startTime || '12:00',
      durationMinutes: duration,
      notes: formData.notes.trim(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Study Session" maxWidth="480px">
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
            placeholder="e.g. Operating Systems"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            autoFocus
            required
            list="manualStudySubjects"
          />
          <datalist id="manualStudySubjects">
            {existingSubjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date *</label>
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
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Duration (Minutes) *</label>
          <input
            type="number"
            min={1}
            max={720}
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Topics Covered / Notes</label>
          <textarea
            rows={3}
            placeholder="e.g. Practiced problem set 3, reviewed lecture slides..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Record Session
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudySessionModal;
