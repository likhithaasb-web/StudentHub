import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { DAYS_OF_WEEK } from '../../utils/dateUtils';

const COLOR_PRESETS = [
  '#85325c', // Deep Rosewood
  '#f0eada', // Cream Beige
  '#4a7b80', // Soft Teal
  '#C7B982', // Antique Gold
  '#34d399', // Mint Emerald
  '#e09f58', // Warm Ochre
  '#f87171', // Coral Rose
];

const ClassFormModal = ({
  isOpen,
  onClose,
  onSave,
  sessionToEdit = null,
  allSessions = [],
  defaultDay = 'Monday',
}) => {
  const [formData, setFormData] = useState({
    day: defaultDay,
    subject: '',
    classroom: '',
    startTime: '09:00',
    endTime: '10:30',
    color: '#85325c',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionToEdit) {
      setFormData({
        day: sessionToEdit.day || 'Monday',
        subject: sessionToEdit.subject || '',
        classroom: sessionToEdit.classroom || '',
        startTime: sessionToEdit.startTime || '09:00',
        endTime: sessionToEdit.endTime || '10:30',
        color: sessionToEdit.color || '#6366f1',
      });
    } else {
      setFormData({
        day: defaultDay,
        subject: '',
        classroom: '',
        startTime: '09:00',
        endTime: '10:30',
        color: '#6366f1',
      });
    }
    setError('');
  }, [sessionToEdit, defaultDay, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Subject name is required');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Start and end times are required');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setError('End time must be later than start time');
      return;
    }

    // Overlap conflict check for the same day
    const hasOverlap = allSessions.some((s) => {
      if (sessionToEdit && s.id === sessionToEdit.id) return false;
      if (s.day !== formData.day) return false;

      // Two intervals [A_start, A_end] and [B_start, B_end] overlap if:
      // A_start < B_end && B_start < A_end
      return formData.startTime < s.endTime && s.startTime < formData.endTime;
    });

    if (hasOverlap) {
      setError(`Time conflict! You already have another class scheduled during this window on ${formData.day}.`);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sessionToEdit ? 'Edit Class Session' : 'Add Class Session'}
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
          <label className="form-label">Subject Name *</label>
          <input
            type="text"
            placeholder="e.g. Data Structures & Algorithms"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Day of Week *</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room / Lab</label>
            <input
              type="text"
              placeholder="e.g. Room 302 or Lab 2"
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Color Accent Picker */}
        <div className="form-group">
          <label className="form-label">Color Label</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, color: c })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: c,
                  border: formData.color === c ? '2px solid #ffffff' : '2px solid transparent',
                  outline: formData.color === c ? `2px solid ${c}` : 'none',
                  cursor: 'pointer',
                  transition: 'transform var(--transition-fast)',
                  transform: formData.color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {sessionToEdit ? 'Save Changes' : 'Add Class'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClassFormModal;
