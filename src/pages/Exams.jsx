import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ExamCard from '../components/exams/ExamCard';
import ExamFormModal from '../components/exams/ExamFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { GraduationCap, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { getDaysRemaining } from '../utils/dateUtils';

const Exams = () => {
  const { exams, addExam, updateExam, deleteExam, toggleExamCompleted } = useApp();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'all'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examToDelete, setExamToDelete] = useState(null);

  // Chronologically sorted exams
  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [exams]);

  const upcomingExams = sortedExams.filter((e) => !e.completed);
  const completedExams = sortedExams.filter((e) => e.completed);

  // Closest upcoming exam
  const nextExam = upcomingExams.length > 0 ? upcomingExams[0] : null;
  const daysUntilNext = nextExam ? getDaysRemaining(nextExam.date) : null;

  const displayedExams =
    activeTab === 'upcoming'
      ? upcomingExams
      : activeTab === 'completed'
      ? completedExams
      : sortedExams;

  const handleSaveExam = (formData) => {
    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam(formData);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Exam Schedule & Planner</h1>
          <p className="page-header-subtitle">
            Track midterm dates, final exam locations, and preparation countdowns.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExam(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Schedule Exam
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Upcoming Exams</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}>
            {upcomingExams.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Next Exam Countdown</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)', marginTop: 2 }}>
            {daysUntilNext !== null
              ? daysUntilNext === 0
                ? 'Today!'
                : daysUntilNext === 1
                ? 'Tomorrow'
                : daysUntilNext < 0
                ? `${Math.abs(daysUntilNext)}d ago`
                : `${daysUntilNext} days`
              : 'None'}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Exams Completed</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: 2 }}>
            {completedExams.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          className="btn btn-sm"
          style={{
            backgroundColor: activeTab === 'upcoming' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'upcoming' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          Upcoming ({upcomingExams.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className="btn btn-sm"
          style={{
            backgroundColor: activeTab === 'completed' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'completed' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          Completed ({completedExams.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className="btn btn-sm"
          style={{
            backgroundColor: activeTab === 'all' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'all' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          All Exams ({exams.length})
        </button>
      </div>

      {/* Exam Cards Grid */}
      {displayedExams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={
            activeTab === 'completed'
              ? 'No completed exams yet'
              : 'No upcoming exams'
          }
          description={
            activeTab === 'completed'
              ? 'Completed exams will be preserved here for your academic record.'
              : 'Add your test dates to calculate dynamic countdowns and avoid surprises.'
          }
          actionLabel={activeTab === 'upcoming' ? 'Schedule Exam' : undefined}
          onAction={
            activeTab === 'upcoming'
              ? () => {
                  setEditingExam(null);
                  setIsFormOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {displayedExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onToggleCompleted={toggleExamCompleted}
              onEdit={(e) => {
                setEditingExam(e);
                setIsFormOpen(true);
              }}
              onDelete={(e) => setExamToDelete(e)}
            />
          ))}
        </div>
      )}

      {/* Exam Form Modal */}
      <ExamFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExam(null);
        }}
        onSave={handleSaveExam}
        examToEdit={editingExam}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(examToDelete)}
        onClose={() => setExamToDelete(null)}
        onConfirm={() => {
          if (examToDelete) {
            deleteExam(examToDelete.id);
            setExamToDelete(null);
          }
        }}
        title="Delete Exam"
        message={`Are you sure you want to delete the "${examToDelete?.subject}" exam?`}
        confirmText="Delete Exam"
      />
    </div>
  );
};

export default Exams;
