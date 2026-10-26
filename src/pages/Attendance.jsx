import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubjectAttendanceCard from '../components/attendance/SubjectAttendanceCard';
import AttendanceFormModal from '../components/attendance/AttendanceFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  calculateOverallAttendance,
} from '../utils/attendanceUtils';
import {
  Percent,
  Plus,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

const Attendance = () => {
  const {
    attendance,
    settings,
    updateSettings,
    addAttendanceSubject,
    updateAttendanceSubject,
    adjustAttendanceRecord,
    deleteAttendanceSubject,
  } = useApp();

  const targetPercentage = settings.targetAttendance || 75;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const overall = calculateOverallAttendance(attendance);
  const isOverallSafe = overall.percentage >= targetPercentage;

  const belowTargetSubjects = attendance.filter((a) => {
    if (a.held === 0) return false;
    return (a.attended / a.held) * 100 < targetPercentage;
  });

  const handleSaveSubject = (formData) => {
    if (editingSubject) {
      updateAttendanceSubject(editingSubject.id, formData);
    } else {
      addAttendanceSubject(formData);
    }
  };

  const handleTargetChange = (e) => {
    const val = Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 75));
    updateSettings({ targetAttendance: val });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Attendance Tracker & Calculator</h1>
          <p className="page-header-subtitle">
            Track class presence, calculate shortage margins, and forecast required sessions.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSubject(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {/* College Notice Disclaimer Banner */}
      <div
        style={{
          padding: '0.75rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <HelpCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <span>
          <strong>Student Guidance:</strong> All attendance percentages and attendance requirements are calculated mathematically based on your recorded counts. For semester hall tickets, always cross-reference your college's official portal.
        </span>
      </div>

      {/* Aggregate Overview Card */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isOverallSafe ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: isOverallSafe ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={28} />
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Aggregate Attendance
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {overall.percentage}%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {overall.totalAttended} of {overall.totalHeld} total classes attended across {attendance.length} subjects
            </div>
          </div>
        </div>

        {/* Configurable Target input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '0.75rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              College Target Threshold
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Adjust target criterion
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <input
              type="number"
              min={1}
              max={100}
              value={targetPercentage}
              onChange={handleTargetChange}
              style={{
                width: 68,
                padding: '0.35rem 0.5rem',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>%</span>
          </div>
        </div>
      </div>

      {/* Warning Alert if any subject below target */}
      {belowTargetSubjects.length > 0 && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--danger)',
            fontSize: '0.875rem',
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span>
            Attention: <strong>{belowTargetSubjects.length} {belowTargetSubjects.length === 1 ? 'subject has' : 'subjects have'}</strong> attendance below your {targetPercentage}% requirement! Check the cards below for consecutive classes needed.
          </span>
        </div>
      )}

      {/* Subjects Grid */}
      {attendance.length === 0 ? (
        <EmptyState
          icon={Percent}
          title="No subjects tracked yet"
          description="Add your registered subjects to track your lecture attendance and prevent exam hall ticket shortages."
          actionLabel="Add Your First Subject"
          onAction={() => {
            setEditingSubject(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {attendance.map((item) => (
            <SubjectAttendanceCard
              key={item.id}
              item={item}
              targetPercentage={targetPercentage}
              onAdjust={adjustAttendanceRecord}
              onEdit={(s) => {
                setEditingSubject(s);
                setIsFormOpen(true);
              }}
              onDelete={(s) => setSubjectToDelete(s)}
            />
          ))}
        </div>
      )}

      {/* Subject Modal */}
      <AttendanceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        subjectToEdit={editingSubject}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(subjectToDelete)}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) {
            deleteAttendanceSubject(subjectToDelete.id);
            setSubjectToDelete(null);
          }
        }}
        title="Delete Subject Attendance"
        message={`Are you sure you want to stop tracking attendance for "${subjectToDelete?.subject}"?`}
        confirmText="Delete Subject"
      />
    </div>
  );
};

export default Attendance;
