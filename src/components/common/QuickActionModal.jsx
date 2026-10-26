import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import { CheckSquare, FileText, Calendar, Plus } from 'lucide-react';
import { getTodayDateString } from '../../utils/dateUtils';

const QuickActionModal = () => {
  const { quickActionModal, closeQuickAction, addTask, addNote, addExam } = useApp();
  const [activeTab, setActiveTab] = useState(quickActionModal.tab || 'task');

  // Task form state
  const [taskData, setTaskData] = useState({
    title: '',
    subject: '',
    dueDate: getTodayDateString(),
    priority: 'Medium',
    description: '',
  });

  // Note form state
  const [noteData, setNoteData] = useState({
    title: '',
    subject: '',
    content: '',
    tags: '',
    pinned: false,
  });

  // Exam form state
  const [examData, setExamData] = useState({
    subject: '',
    date: getTodayDateString(),
    time: '09:00',
    location: '',
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (quickActionModal.isOpen) {
      setActiveTab(quickActionModal.tab || 'task');
      setError('');
    }
  }, [quickActionModal]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!taskData.dueDate) {
      setError('Due date is required');
      return;
    }
    addTask(taskData);
    setTaskData({
      title: '',
      subject: '',
      dueDate: getTodayDateString(),
      priority: 'Medium',
      description: '',
    });
    closeQuickAction();
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteData.title.trim()) {
      setError('Note title is required');
      return;
    }
    addNote(noteData);
    setNoteData({
      title: '',
      subject: '',
      content: '',
      tags: '',
      pinned: false,
    });
    closeQuickAction();
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    if (!examData.subject.trim()) {
      setError('Exam subject name is required');
      return;
    }
    if (!examData.date) {
      setError('Exam date is required');
      return;
    }
    addExam(examData);
    setExamData({
      subject: '',
      date: getTodayDateString(),
      time: '09:00',
      location: '',
      notes: '',
    });
    closeQuickAction();
  };

  return (
    <Modal isOpen={quickActionModal.isOpen} onClose={closeQuickAction} title="Quick Create" maxWidth="520px">
      {/* Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('task');
            setError('');
          }}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'task' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'task' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <CheckSquare size={15} /> Task
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('note');
            setError('');
          }}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'note' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'note' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <FileText size={15} /> Note
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('exam');
            setError('');
          }}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'exam' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'exam' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Calendar size={15} /> Exam
        </button>
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
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Task Form */}
      {activeTab === 'task' && (
        <form onSubmit={handleTaskSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Implement Binary Search Tree"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                placeholder="e.g. Algorithms"
                value={taskData.subject}
                onChange={(e) => setTaskData({ ...taskData, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add key requirements or references..."
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeQuickAction}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add Task
            </button>
          </div>
        </form>
      )}

      {/* Note Form */}
      {activeTab === 'note' && (
        <form onSubmit={handleNoteSubmit}>
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              placeholder="e.g. Memory Hierarchy Notes"
              value={noteData.title}
              onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                placeholder="e.g. Computer Architecture"
                value={noteData.subject}
                onChange={(e) => setNoteData({ ...noteData, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. lru, cache, exam"
                value={noteData.tags}
                onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Note Content</label>
            <textarea
              rows={4}
              placeholder="Write your study notes, formulas, or summaries..."
              value={noteData.content}
              onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="quickPinNote"
              checked={noteData.pinned}
              onChange={(e) => setNoteData({ ...noteData, pinned: e.target.checked })}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
            <label htmlFor="quickPinNote" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Pin this note to top
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeQuickAction}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Save Note
            </button>
          </div>
        </form>
      )}

      {/* Exam Form */}
      {activeTab === 'exam' && (
        <form onSubmit={handleExamSubmit}>
          <div className="form-group">
            <label className="form-label">Subject Name *</label>
            <input
              type="text"
              placeholder="e.g. Discrete Mathematics"
              value={examData.subject}
              onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Exam Date *</label>
              <input
                type="date"
                value={examData.date}
                onChange={(e) => setExamData({ ...examData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                value={examData.time}
                onChange={(e) => setExamData({ ...examData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room / Hall Location</label>
            <input
              type="text"
              placeholder="e.g. Hall 204 or Block C"
              value={examData.location}
              onChange={(e) => setExamData({ ...examData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Syllabus / Important Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Bring scientific calculator, chapters 1-5..."
              value={examData.notes}
              onChange={(e) => setExamData({ ...examData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeQuickAction}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Schedule Exam
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default QuickActionModal;
