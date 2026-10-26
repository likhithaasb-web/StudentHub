import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Check, X, Calendar, BookOpen, FileText } from 'lucide-react';
import { getTodayDateString } from '../../utils/dateUtils';

const RecordClassModal = ({
  isOpen,
  onClose,
  onSave,
  subjects = [],
  initialSubject = '',
  initialDate = '',
  recordToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    date: getTodayDateString(),
    status: 'Present',
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        subject: recordToEdit.subject || '',
        date: recordToEdit.date || getTodayDateString(),
        status: recordToEdit.status || 'Present',
        notes: recordToEdit.notes || '',
      });
    } else {
      setFormData({
        subject: initialSubject || (subjects[0] ? subjects[0].name : 'CN'),
        date: initialDate || getTodayDateString(),
        status: 'Present',
        notes: '',
      });
    }
    setError('');
  }, [recordToEdit, initialSubject, initialDate, isOpen, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Please select or specify a subject.');
      return;
    }
    if (!formData.date) {
      setError('Please specify the class date.');
      return;
    }

    onSave({
      subject: formData.subject.trim(),
      date: formData.date,
      status: formData.status,
      notes: formData.notes.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Edit Attendance Entry' : 'Record Class Attendance'}
      maxWidth="480px"
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

        {/* Subject Selection */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={14} style={{ color: 'var(--primary)' }} /> Subject *
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            style={{ fontWeight: 600 }}
          >
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <option key={sub.id || sub.name} value={sub.name}>
                  {sub.name} {sub.fullName && sub.fullName !== sub.name ? `— ${sub.fullName}` : ''}
                </option>
              ))
            ) : (
              <option value="CN">CN — Computer Networks</option>
            )}
          </select>
        </div>

        {/* Class Date */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} style={{ color: 'var(--primary)' }} /> Class Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Attendance Status Selector */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Attendance Status *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Present' })}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${
                  formData.status === 'Present' ? 'var(--success)' : 'var(--border-subtle)'
                }`,
                backgroundColor:
                  formData.status === 'Present' ? 'rgba(52, 211, 153, 0.18)' : 'var(--bg-tertiary)',
                color: formData.status === 'Present' ? 'var(--success)' : 'var(--text-secondary)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Check size={18} /> Present (Attended)
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Absent' })}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${
                  formData.status === 'Absent' ? 'var(--danger)' : 'var(--border-subtle)'
                }`,
                backgroundColor:
                  formData.status === 'Absent' ? 'rgba(248, 113, 113, 0.18)' : 'var(--bg-tertiary)',
                color: formData.status === 'Absent' ? 'var(--danger)' : 'var(--text-secondary)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <X size={18} /> Absent (Missed)
            </button>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={14} style={{ color: 'var(--primary)' }} /> Lecture Notes / Remarks (Optional)
          </label>
          <input
            type="text"
            placeholder={
              formData.status === 'Present'
                ? 'e.g. Chapter 4 packet routing & Wireshark demo'
                : 'e.g. Missed due to doctor appointment / fever'
            }
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Modal Actions */}
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
            {recordToEdit ? 'Save Correction' : 'Record Class'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordClassModal;
