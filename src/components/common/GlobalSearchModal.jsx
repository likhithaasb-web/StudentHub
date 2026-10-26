import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import { Search, CheckSquare, FileText, Calendar, Clock, ArrowRight, Briefcase } from 'lucide-react';
import { resumeStorage } from '../../utils/resumeStorage';

const GlobalSearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, tasks, notes, exams, timetable } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return { tasks: [], notes: [], exams: [], timetable: [] };

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );

    const matchedNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((tag) => tag.toLowerCase().includes(q)))
    );

    const matchedExams = exams.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );

    const matchedClasses = timetable.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.classroom.toLowerCase().includes(q) ||
        c.day.toLowerCase().includes(q)
    );

    const allResumes = resumeStorage.getResumes();
    const matchedResumes = allResumes.filter(
      (r) =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.personal?.fullName && r.personal.fullName.toLowerCase().includes(q)) ||
        (r.personal?.headline && r.personal.headline.toLowerCase().includes(q)) ||
        (r.targetRole && r.targetRole.toLowerCase().includes(q))
    );

    return {
      tasks: matchedTasks,
      notes: matchedNotes,
      exams: matchedExams,
      timetable: matchedClasses,
      resumes: matchedResumes,
    };
  }, [searchTerm, tasks, notes, exams, timetable]);

  const totalResults =
    results.tasks.length +
    results.notes.length +
    results.exams.length +
    results.timetable.length +
    (results.resumes?.length || 0);

  const handleSelect = (path) => {
    setSearchModalOpen(false);
    setSearchTerm('');
    navigate(path);
  };

  return (
    <Modal
      isOpen={searchModalOpen}
      onClose={() => {
        setSearchModalOpen(false);
        setSearchTerm('');
      }}
      title="Global Search"
      maxWidth="620px"
    >
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assignments, notes, exams, classes..."
          autoFocus
          style={{
            paddingLeft: '2.75rem',
            paddingRight: '1rem',
            paddingTop: '0.8rem',
            paddingBottom: '0.8rem',
            fontSize: '1rem',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </div>

      {!searchTerm.trim() ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.9rem' }}>Type keywords to search across your college dashboard.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <span className="badge badge-purple">Assignments</span>
            <span className="badge badge-info">Notes</span>
            <span className="badge badge-warning">Exams</span>
            <span className="badge badge-success">Schedule</span>
          </div>
        </div>
      ) : totalResults === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <p>No results found for "{searchTerm}".</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try searching by subject name, topic, or keyword.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '55vh', overflowY: 'auto' }}>
          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckSquare size={14} /> Tasks ({results.tasks.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleSelect('/tasks')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.subject} • Due {task.dueDate}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} /> Notes ({results.notes.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelect('/notes')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{note.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note.subject}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exams */}
          {results.exams.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> Exams ({results.exams.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.exams.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => handleSelect('/exams')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{exam.subject} Exam</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {exam.date} • {exam.location}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timetable */}
          {results.timetable.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> Classes ({results.timetable.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.timetable.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('/timetable')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.day} • {item.startTime} - {item.endTime} ({item.classroom})</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Resumes */}
          {results.resumes && results.resumes.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={14} /> Resumes ({results.resumes.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => handleSelect('/career')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{resume.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Template: {resume.template} • {resume.personal?.fullName}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default GlobalSearchModal;
