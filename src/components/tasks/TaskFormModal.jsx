import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getTodayDateString } from '../../utils/dateUtils';

const TaskFormModal = ({ isOpen, onClose, onSave, taskToEdit = null, existingSubjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: getTodayDateString(),
    priority: 'Medium',
    status: 'Pending',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        subject: taskToEdit.subject || '',
        dueDate: taskToEdit.dueDate || getTodayDateString(),
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        subject: existingSubjects[0] || '',
        dueDate: getTodayDateString(),
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setError('');
  }, [taskToEdit, isOpen, existingSubjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      maxWidth="520px"
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
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            placeholder="e.g. Implement Dijkstra's Algorithm"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              placeholder="e.g. Algorithms"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              list="subjectSuggestions"
            />
            <datalist id="subjectSuggestions">
              {existingSubjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description / Instructions</label>
          <textarea
            rows={3}
            placeholder="Key deliverables, references, or lab guidelines..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
