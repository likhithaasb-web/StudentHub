import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubjectAttendanceCard from '../components/attendance/SubjectAttendanceCard';
import RecordClassModal from '../components/attendance/RecordClassModal';
import SubjectFormModal from '../components/attendance/SubjectFormModal';
import AttendanceHistoryTable from '../components/attendance/AttendanceHistoryTable';
import AttendanceCalendarView from '../components/attendance/AttendanceCalendarView';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  calculateOverallAttendance,
  calculateClassesNeeded,
} from '../utils/attendanceUtils';
import {
  Percent,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ListFilter,
  LayoutGrid,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

const Attendance = () => {
  const {
    attendanceSubjects,
    attendanceRecords,
    attendance,
    settings,
    updateSettings,
    addAttendanceSubject,
    updateAttendanceSubject,
    deleteAttendanceSubject,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    toggleAttendanceRecordStatus,
    quickMarkAttendance,
    resetAttendanceToSample,
  } = useApp();

  const targetPercentage = settings.targetAttendance || 75;

  // Active View Tab: 'grid' (Subject Overview) | 'history' (Date-wise logbook) | 'calendar' (Monthly matrix)
  const [activeTab, setActiveTab] = useState('grid');

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordModalConfig, setRecordModalConfig] = useState({
    initialSubject: '',
    initialDate: '',
    recordToEdit: null,
  });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);

  // Confirmation dialogs
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Overall statistics
  const overall = calculateOverallAttendance(attendance);
  const isOverallSafe = overall.percentage >= targetPercentage;

  // Subjects below minimum threshold
  const belowTargetSubjects = attendance.filter((a) => {
    if (a.held === 0) return false;
    return a.percentage < targetPercentage;
  });

  // Handlers
  const handleOpenRecordModal = (subjectName = '', dateStr = '', record = null) => {
    setRecordModalConfig({
      initialSubject: subjectName,
      initialDate: dateStr,
      recordToEdit: record,
    });
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = (formData) => {
    if (recordModalConfig.recordToEdit) {
      updateAttendanceRecord(recordModalConfig.recordToEdit.id, formData);
    } else {
      addAttendanceRecord(formData);
    }
  };

  const handleSaveSubject = (formData) => {
    if (subjectToEdit) {
      updateAttendanceSubject(subjectToEdit.id, formData);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="page-header-title">Personal Attendance Tracker</h1>
            <span
              className="badge badge-purple"
              style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              Self-Managed Logbook
            </span>
          </div>
          <p className="page-header-subtitle">
            Log class presence, track subject shortages, and calculate consecutive classes required to reach your {targetPercentage}% target.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleOpenRecordModal()}
            className="btn btn-primary"
            title="Record class attendance with date and notes"
          >
            <Plus size={16} /> Record Class
          </button>

          <button
            onClick={() => {
              setSubjectToEdit(null);
              setIsSubjectModalOpen(true);
            }}
            className="btn btn-secondary"
            title="Add a new academic subject"
          >
            <BookOpen size={16} /> Add Subject
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn btn-secondary"
            title="Reset to default subjects and sample records (CN, MFEF, TRAINING, OT, API, ML)"
            style={{ fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Demo Data
          </button>
        </div>
      </div>

      {/* Student Personal Records Disclaimer Banner */}
      <div
        className="card"
        style={{
          padding: '0.9rem 1.25rem',
          backgroundColor: 'rgba(39, 66, 69, 0.45)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}
      >
        <ShieldCheck size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Personal Student Logbook:</strong> All attendance counts, percentages, and shortage forecast calculations are derived automatically from your personal class entries. This tool is designed for student productivity and is not officially verified or synchronized with university ERP portals. Always verify with your college administration before semester exams.
        </div>
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
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isOverallSafe ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: isOverallSafe ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={30} />
          </div>

          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Overall Cumulative Attendance
            </span>
            <div style={{ fontSize: '2.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {overall.percentage}%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              <strong>{overall.totalAttended}</strong> attended / <strong>{overall.totalHeld}</strong> held across {attendance.length} subjects (<strong>{overall.totalAbsent}</strong> absent)
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
              Minimum Attendance Target
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Shortage threshold (default 75%)
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

      {/* Shortage Warning Banner (if any subject is below target) */}
      {belowTargetSubjects.length > 0 && (
        <div
          style={{
            padding: '0.95rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            color: 'var(--danger)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              Attendance Shortage Warning: {belowTargetSubjects.length}{' '}
              {belowTargetSubjects.length === 1 ? 'subject is' : 'subjects are'} below your {targetPercentage}% requirement!
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {belowTargetSubjects.map((sub) => {
                const needed = calculateClassesNeeded(sub.attended, sub.held, targetPercentage);
                return (
                  <div key={sub.id} style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    • <strong>{sub.subject}</strong> ({sub.percentage}%): {needed.message}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('grid')}
          className={`btn ${activeTab === 'grid' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <LayoutGrid size={15} /> Subject Overview ({attendance.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <ListFilter size={15} /> Date-wise History & Logbook ({attendanceRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`btn ${activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <Calendar size={15} /> Monthly Calendar View
        </button>
      </div>

      {/* Tab 1: Subject Cards Grid */}
      {activeTab === 'grid' && (
        <>
          {attendance.length === 0 ? (
            <EmptyState
              icon={Percent}
              title="No subjects tracked yet"
              description="Add your enrolled subjects (e.g. CN, MFEF, TRAINING, OT, API, ML) or load demo data to start logging class attendance."
              actionLabel="Add Your First Subject"
              onAction={() => {
                setSubjectToEdit(null);
                setIsSubjectModalOpen(true);
              }}
              secondaryActionLabel="Load Demo Subjects & History"
              onSecondaryAction={resetAttendanceToSample}
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
                  onQuickMark={(subjectName, status) => {
                    quickMarkAttendance(subjectName, status);
                  }}
                  onOpenRecordModal={(subjectName) => {
                    handleOpenRecordModal(subjectName);
                  }}
                  onEdit={(sub) => {
                    setSubjectToEdit(sub);
                    setIsSubjectModalOpen(true);
                  }}
                  onDelete={(sub) => setSubjectToDelete(sub)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Date-wise History Table */}
      {activeTab === 'history' && (
        <AttendanceHistoryTable
          records={attendanceRecords}
          subjects={attendanceSubjects}
          onToggleStatus={(id) => toggleAttendanceRecordStatus(id)}
          onEditRecord={(rec) => handleOpenRecordModal(rec.subject, rec.date, rec)}
          onDeleteRecord={(rec) => setRecordToDelete(rec)}
        />
      )}

      {/* Tab 3: Monthly Calendar View */}
      {activeTab === 'calendar' && (
        <AttendanceCalendarView
          records={attendanceRecords}
          subjects={attendanceSubjects}
          onOpenRecordModal={(subjectName, dateStr) => handleOpenRecordModal(subjectName, dateStr)}
          onToggleStatus={(id) => toggleAttendanceRecordStatus(id)}
          onEditRecord={(rec) => handleOpenRecordModal(rec.subject, rec.date, rec)}
          onDeleteRecord={(rec) => setRecordToDelete(rec)}
        />
      )}

      {/* Record Class Attendance Modal */}
      <RecordClassModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setRecordModalConfig({ initialSubject: '', initialDate: '', recordToEdit: null });
        }}
        onSave={handleSaveRecord}
        subjects={attendanceSubjects}
        initialSubject={recordModalConfig.initialSubject}
        initialDate={recordModalConfig.initialDate}
        recordToEdit={recordModalConfig.recordToEdit}
      />

      {/* Subject Management Modal */}
      <SubjectFormModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setSubjectToEdit(null);
        }}
        onSave={handleSaveSubject}
        subjectToEdit={subjectToEdit}
      />

      {/* Confirm Subject Deletion */}
      <ConfirmDialog
        isOpen={Boolean(subjectToDelete)}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) {
            deleteAttendanceSubject(subjectToDelete.id);
            setSubjectToDelete(null);
          }
        }}
        title="Delete Subject & Records"
        message={`Are you sure you want to stop tracking "${subjectToDelete?.subject || subjectToDelete?.name}"? All associated daily attendance records will be removed.`}
        confirmText="Delete Subject"
      />

      {/* Confirm Record Deletion */}
      <ConfirmDialog
        isOpen={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        onConfirm={() => {
          if (recordToDelete) {
            deleteAttendanceRecord(recordToDelete.id);
            setRecordToDelete(null);
          }
        }}
        title="Delete Attendance Entry"
        message={`Are you sure you want to delete the ${recordToDelete?.status} record for ${recordToDelete?.subject} on ${recordToDelete?.date}?`}
        confirmText="Delete Entry"
      />

      {/* Confirm Reset to Demo Data */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetAttendanceToSample();
          setShowResetConfirm(false);
        }}
        title="Load Demo Attendance Data"
        message="This will reload the realistic demo data for the 6 core subjects: CN, MFEF, TRAINING, OT, API, ML with complete past class attendance history."
        confirmText="Load Demo Data"
      />
    </div>
  );
};

export default Attendance;
