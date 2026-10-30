import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Mail,
  User,
  Hash,
  Percent,
  Award,
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

const AcademicPreferences = ({
  formData,
  onChangeField,
  attendanceSubjects = [],
  onAddSubject,
  onDeleteSubject,
  errors = {},
}) => {
  const [newSubject, setNewSubject] = useState({ name: '', fullName: '', color: '#20A77A' });
  const [showAddSubject, setShowAddSubject] = useState(false);

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    if (onAddSubject) {
      onAddSubject({
        id: `sub-${Date.now()}`,
        name: newSubject.name.trim().toUpperCase(),
        fullName: newSubject.fullName.trim() || newSubject.name.trim(),
        color: newSubject.color || '#20A77A',
      });
      setNewSubject({ name: '', fullName: '', color: '#20A77A' });
      setShowAddSubject(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Student Identity & Institution */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <User size={18} />
            </div>
            <span>Student Profile & Institution</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Used across reports, resumes, and study metrics
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1.15rem' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Full Student Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.studentName || ''}
              onChange={(e) => onChangeField('studentName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              style={{
                borderColor: errors.studentName ? 'var(--danger)' : 'var(--border-subtle)',
              }}
            />
            {errors.studentName && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                {errors.studentName}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Student Email Address
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChangeField('email', e.target.value)}
              placeholder="alex@university.edu"
              style={{
                borderColor: errors.email ? 'var(--danger)' : 'var(--border-subtle)',
              }}
            />
            {errors.email && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* College / University */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              College or University
            </label>
            <input
              type="text"
              value={formData.collegeName || ''}
              onChange={(e) => onChangeField('collegeName', e.target.value)}
              placeholder="e.g. State Tech University"
            />
          </div>

          {/* Department / Branch */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Degree & Major / Branch
            </label>
            <input
              type="text"
              value={formData.academicBranch || ''}
              onChange={(e) => onChangeField('academicBranch', e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>

          {/* Current Semester */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Current Semester
            </label>
            <input
              type="text"
              value={formData.semester || ''}
              onChange={(e) => onChangeField('semester', e.target.value)}
              placeholder="e.g. Semester 5 (Fall 2026)"
            />
          </div>

          {/* Roll No / Student ID */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Roll Number / Student ID
            </label>
            <input
              type="text"
              value={formData.rollNumber || ''}
              onChange={(e) => onChangeField('rollNumber', e.target.value)}
              placeholder="e.g. 21CS042"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Academic Year
            </label>
            <input
              type="text"
              value={formData.academicYear || '2026-2027'}
              onChange={(e) => onChangeField('academicYear', e.target.value)}
              placeholder="e.g. 2026-2027"
            />
          </div>

          {/* Grading System Scale */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Grading Scale System
            </label>
            <select
              value={formData.gpaScale || '10.0'}
              onChange={(e) => onChangeField('gpaScale', e.target.value)}
            >
              <option value="10.0">10.0 Scale (CGPA - Standard Indian / International)</option>
              <option value="4.0">4.0 Scale (US GPA)</option>
              <option value="percentage">Percentage (100% Scale)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Academic Targets & Thresholds */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Percent size={18} />
            </div>
            <span>Academic Performance Targets</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Thresholds for dashboard alerts and status indicators
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Target Attendance */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0 }}>
                Minimum Attendance Target
              </label>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                }}
              >
                {formData.targetAttendance || 75}%
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              StudentHub highlights subjects in yellow or red if your attendance dips below this threshold.
            </p>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={formData.targetAttendance || 75}
              onChange={(e) => onChangeField('targetAttendance', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>50%</span>
              <span>75% (Mandatory)</span>
              <span>85% (Safe)</span>
              <span>95%</span>
            </div>
          </div>

          {/* Target CGPA */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0 }}>
                Target CGPA / Grade Goal
              </label>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                }}
              >
                {formData.cgpaTarget || '8.5'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Set your target for semester transcripts and goal tracking.
            </p>
            <input
              type="text"
              value={formData.cgpaTarget || ''}
              onChange={(e) => onChangeField('cgpaTarget', e.target.value)}
              placeholder="e.g. 8.5 or 9.0"
              style={{
                borderColor: errors.cgpaTarget ? 'var(--danger)' : 'var(--border-subtle)',
              }}
            />
            {errors.cgpaTarget && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                {errors.cgpaTarget}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Courses & Subjects Manager */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <BookOpen size={18} />
            </div>
            <span>Enrolled Subjects & Courses</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              padding: '0.4rem 0.8rem',
            }}
          >
            <Plus size={15} /> {showAddSubject ? 'Cancel' : 'Add Course'}
          </button>
        </div>

        {showAddSubject && (
          <form
            onSubmit={handleCreateSubject}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Register New Subject</h4>
            <div className="grid-3" style={{ gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Code / Short Name (e.g. DS, AI)
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g. AI"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Full Course Title
                </label>
                <input
                  type="text"
                  value={newSubject.fullName}
                  onChange={(e) => setNewSubject({ ...newSubject, fullName: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Theme Color Badge
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px' }}>
                  <input
                    type="color"
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    style={{ width: 44, height: 38, padding: 2, cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{newSubject.color}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                Save Course
              </button>
            </div>
          </form>
        )}

        {/* Existing Subjects Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {attendanceSubjects.map((sub) => (
            <div
              key={sub.id || sub.name}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: sub.color || '#20A77A',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{sub.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sub.fullName || sub.name}
                  </div>
                </div>
              </div>

              {onDeleteSubject && attendanceSubjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteSubject(sub.id || sub.name)}
                  title="Remove Subject"
                  style={{
                    color: 'var(--text-muted)',
                    padding: '0.3rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicPreferences;
