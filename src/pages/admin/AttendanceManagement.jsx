import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  AlertTriangle,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Edit3,
  X,
  FileText,
  Clock,
  Shield,
} from 'lucide-react';

const AttendanceManagement = () => {
  const { adminStudents, adminSettings, addAuditLog, updateAdminStudent } = useApp();

  const [cutoffThreshold, setCutoffThreshold] = useState(adminSettings.minimumAttendanceThreshold || 75);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [onlyShortages, setOnlyShortages] = useState(false);

  // Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [adjustmentClasses, setAdjustmentClasses] = useState(2);
  const [adjustmentReason, setAdjustmentReason] = useState('Official ACM Hackathon / University Representation');
  const [adjustmentSubject, setAdjustmentSubject] = useState('Computer Networks (CN)');

  const filteredStudents = useMemo(() => {
    return adminStudents.filter((student) => {
      const percentage = student.attendancePercentage || 85;
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept = selectedDept === 'All' || student.department === selectedDept;
      const matchesShortage = !onlyShortages || percentage < cutoffThreshold;

      return matchesSearch && matchesDept && matchesShortage;
    });
  }, [adminStudents, searchTerm, selectedDept, onlyShortages, cutoffThreshold]);

  // Statistics
  const totalStudents = adminStudents.length;
  const shortageStudents = adminStudents.filter((s) => (s.attendancePercentage || 85) < cutoffThreshold);
  const aggregateAttendance = (
    adminStudents.reduce((acc, s) => acc + (s.attendancePercentage || 85), 0) / (totalStudents || 1)
  ).toFixed(1);

  // Export Defaulters Report
  const handleExportShortageReport = () => {
    const headers = ['Roll Number', 'Student Name', 'Email', 'Department', 'Total Classes', 'Attended', 'Attendance %', 'Cutoff Requirement', 'Status'];
    const rows = shortageStudents.map((s) => [
      `"${s.rollNumber}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.department}"`,
      s.totalClasses || 112,
      s.attendedClasses || 80,
      `${s.attendancePercentage}%`,
      `${cutoffThreshold}%`,
      'ATTENDANCE SHORTAGE DEFAULTER',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentHub_Attendance_Shortage_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAdjust = (student) => {
    setSelectedStudent(student);
    setAdjustmentClasses(2);
    setAdjustmentReason('Official Duty / Medical Excuse Slip Approved');
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const newAttended = (selectedStudent.attendedClasses || 90) + parseInt(adjustmentClasses, 10);
    const total = selectedStudent.totalClasses || 112;
    const newPercentage = Math.min(100, Math.round((newAttended / total) * 100));

    updateAdminStudent(selectedStudent.id, {
      attendedClasses: newAttended,
      attendancePercentage: newPercentage,
    });

    addAuditLog(
      'Manual Attendance Credit',
      'Attendance',
      selectedStudent.rollNumber,
      `Granted +${adjustmentClasses} classes in ${adjustmentSubject} for ${selectedStudent.name}. Reason: ${adjustmentReason}`
    );

    setIsAdjustModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            College Attendance Audit & Shortage Detection
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Monitor institutional attendance metrics, detect non-compliant students below {cutoffThreshold}%, and grant approved duty leaves.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportShortageReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={15} /> Export Shortage Notice ({shortageStudents.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Aggregate College Attendance</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', marginTop: '6px' }}>{aggregateAttendance}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Across all 4 Engineering Departments</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Shortage Defaulters (&lt; {cutoffThreshold}%)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '6px' }}>{shortageStudents.length} Students</div>
          <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>Ineligible for Semester Hall Tickets</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Statutory Cutoff Threshold</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{cutoffThreshold}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Mandatory University Regulation</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Lectures Logged</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>112 Lectures</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Spring 2026 Academic Term</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Mechanical Engineering">Mechanical</option>
          </select>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onlyShortages}
            onChange={(e) => setOnlyShortages(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
          />
          Show Defaulters Only (&lt; {cutoffThreshold}%)
        </label>
      </div>

      {/* Audit Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Roll #</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Student Name</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Department</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Classes Attended</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Aggregate %</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Compliance Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const pct = student.attendancePercentage || 85;
                  const isDefaulter = pct < cutoffThreshold;

                  return (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isDefaulter ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {student.rollNumber}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {student.name}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                        {student.department}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        <strong>{student.attendedClasses || 99}</strong> / {student.totalClasses || 112} Classes
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            backgroundColor: isDefaulter ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            color: isDefaulter ? '#ef4444' : '#22c55e',
                          }}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {isDefaulter ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                            <AlertTriangle size={14} /> Shortage Notice
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Eligible
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenAdjust(student)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'transparent',
                            color: 'var(--primary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Apply Approved Leave / Duty Credit"
                        >
                          <Edit3 size={13} /> Grant Duty Credit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST ATTENDANCE MODAL */}
      {isAdjustModalOpen && selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--bg-overlay, rgba(0,0,0,0.7))',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Manual Attendance Adjustment
              </h2>
              <button onClick={() => setIsAdjustModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Adjust logged attendance for <strong>{selectedStudent.name}</strong> ({selectedStudent.rollNumber}). This administrative action will be recorded in the security audit trail.
            </p>

            <form onSubmit={handleSaveAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Target Subject
                </label>
                <select
                  value={adjustmentSubject}
                  onChange={(e) => setAdjustmentSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value="Computer Networks (CN)">Computer Networks (CN)</option>
                  <option value="Mathematical Foundations (MFEF)">Mathematical Foundations (MFEF)</option>
                  <option value="Machine Learning (ML)">Machine Learning (ML)</option>
                  <option value="Optimization Techniques (OT)">Optimization Techniques (OT)</option>
                  <option value="API Architecture (API)">API Architecture (API)</option>
                  <option value="Training & Internship (TRAINING)">Training & Internship (TRAINING)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Number of Attendance Credits to Add
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={adjustmentClasses}
                  onChange={(e) => setAdjustmentClasses(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Official Reason & Slip Details
                </label>
                <textarea
                  rows="3"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Apply & Record in Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
