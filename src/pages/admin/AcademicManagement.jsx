import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
} from 'lucide-react';

const AcademicManagement = () => {
  const { adminDepartments, addDepartment, updateDepartment } = useApp();

  const [expandedDeptId, setExpandedDeptId] = useState(adminDepartments[0]?.id || 'dept_01');
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState(null);

  // Form states
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    headOfDepartment: '',
    totalBatches: 4,
    description: '',
  });

  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    credits: 4,
    semester: 'Semester 6',
    facultyName: '',
    type: 'Theory',
    enrolled: 120,
  });

  const handleOpenAddDept = () => {
    setDeptForm({
      name: '',
      code: '',
      headOfDepartment: '',
      totalBatches: 4,
      description: '',
    });
    setIsAddDeptModalOpen(true);
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    addDepartment(deptForm);
    setIsAddDeptModalOpen(false);
  };

  const handleOpenAddSubject = (deptId) => {
    setTargetDeptId(deptId);
    setSubjectForm({
      code: '',
      name: '',
      credits: 4,
      semester: 'Semester 6',
      facultyName: '',
      type: 'Theory',
      enrolled: 120,
    });
    setIsAddSubjectModalOpen(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    const dept = adminDepartments.find((d) => d.id === targetDeptId);
    if (!dept) return;

    const updatedSubjects = [...(dept.subjects || []), subjectForm];
    updateDepartment(targetDeptId, { subjects: updatedSubjects });
    setIsAddSubjectModalOpen(false);
  };

  const handleDeleteSubject = (deptId, subjectCode) => {
    const dept = adminDepartments.find((d) => d.id === deptId);
    if (!dept) return;
    const updatedSubjects = (dept.subjects || []).filter((s) => s.code !== subjectCode);
    updateDepartment(deptId, { subjects: updatedSubjects });
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
            Academic Curriculum & Department Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Configure degree departments, semester subjects, faculty instructors, and credit allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAddDept}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(33, 166, 122, 0.3)',
          }}
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Department Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {adminDepartments.map((dept) => {
          const isExpanded = expandedDeptId === dept.id;
          const subjectsCount = dept.subjects?.length || 0;
          const totalCredits = (dept.subjects || []).reduce((acc, s) => acc + (s.credits || 0), 0);

          return (
            <div
              key={dept.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                overflow: 'hidden',
                transition: 'border-color 150ms ease',
              }}
            >
              {/* Card Header Accordion */}
              <div
                onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'rgba(33, 166, 122, 0.05)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(33, 166, 122, 0.15)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {dept.code}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {dept.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {dept.code}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      HoD: <strong>{dept.headOfDepartment || 'Not Appointed'}</strong> • {dept.totalBatches || 4} Batches • {subjectsCount} Subjects ({totalCredits} Credits)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAddSubject(dept.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} /> Add Subject
                  </button>

                  <div style={{ color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expanded Curriculum Subject List */}
              {isExpanded && (
                <div style={{ padding: '24px' }}>
                  {dept.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {dept.description}
                    </p>
                  )}

                  <div
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Code</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Subject Title</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Credits</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Assigned Faculty</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Enrolled</th>
                          <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!dept.subjects || dept.subjects.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              No courses assigned yet. Click "Add Subject" above to configure syllabus.
                            </td>
                          </tr>
                        ) : (
                          dept.subjects.map((sub, sIdx) => (
                            <tr
                              key={sIdx}
                              style={{ borderBottom: '1px solid var(--border-subtle)' }}
                            >
                              <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                                {sub.code}
                              </td>
                              <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {sub.name}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    backgroundColor: sub.type === 'Lab' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(33, 166, 122, 0.15)',
                                    color: sub.type === 'Lab' ? '#3b82f6' : 'var(--primary)',
                                    fontWeight: 600,
                                  }}
                                >
                                  {sub.type}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                                {sub.credits} Credits
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                                {sub.facultyName || 'Department Faculty'}
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                                {sub.enrolled || 120} Students
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                  onClick={() => handleDeleteSubject(dept.id, sub.code)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '4px',
                                  }}
                                  title="Remove Subject"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD DEPARTMENT MODAL */}
      {isAddDeptModalOpen && (
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
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Add New Department
              </h2>
              <button onClick={() => setIsAddDeptModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical & Electronics Engineering"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Department Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EEE"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
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
                    Head of Dept (HoD)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Smith"
                    value={deptForm.headOfDepartment}
                    onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Description & Specializations
                </label>
                <textarea
                  rows="3"
                  placeholder="Overview of curriculum..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
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
                  onClick={() => setIsAddDeptModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {isAddSubjectModalOpen && (
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
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Add Syllabus Course / Subject
              </h2>
              <button onClick={() => setIsAddSubjectModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CN"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
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
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Networks"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) || 3 })}
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
                    Type
                  </label>
                  <select
                    value={subjectForm.type}
                    onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
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
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                    <option value="Practical">Practical</option>
                    <option value="Project">Project</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Semester
                  </label>
                  <input
                    type="text"
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Faculty Instructor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. David Clark"
                  value={subjectForm.facultyName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, facultyName: e.target.value })}
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
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicManagement;
