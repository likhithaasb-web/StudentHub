import React, { useState, useEffect } from 'react';
import CareerDashboard from '../components/career/CareerDashboard';
import ResumeEditor from '../components/career/ResumeEditor';
import { resumeStorage, createBlankResume } from '../utils/resumeStorage';
import { useApp } from '../context/AppContext';

const CareerStudio = () => {
  const { settings } = useApp();
  const [resumes, setResumes] = useState(() => resumeStorage.getResumes());
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'editor'

  // Refresh resumes from storage on mount
  useEffect(() => {
    const list = resumeStorage.getResumes();
    setResumes(list);
  }, []);

  const activeResume = resumes.find((r) => r.id === activeResumeId) || null;

  // Create new resume
  const handleCreateNew = (template = 'professional') => {
    const newResume = createBlankResume(
      `${settings.studentName || 'Student'} - Resume`,
      template
    );
    // Pre-fill student name and email from student profile if available
    if (settings.studentName) {
      newResume.personal.fullName = settings.studentName;
    }
    if (settings.email) {
      newResume.personal.email = settings.email;
    }
    if (settings.collegeName) {
      newResume.education[0].institution = settings.collegeName;
    }

    const saved = resumeStorage.saveResume(newResume);
    setResumes(resumeStorage.getResumes());
    setActiveResumeId(saved.id);
    setCurrentView('editor');
  };

  // Edit resume
  const handleEditResume = (id) => {
    setActiveResumeId(id);
    setCurrentView('editor');
  };

  // Save changes
  const handleSaveResume = (updated) => {
    const saved = resumeStorage.saveResume(updated);
    setResumes((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
  };

  // Duplicate resume
  const handleDuplicateResume = (id) => {
    const copy = resumeStorage.duplicateResume(id);
    if (copy) {
      setResumes(resumeStorage.getResumes());
    }
  };

  // Delete resume
  const handleDeleteResume = (id) => {
    const remaining = resumeStorage.deleteResume(id);
    setResumes(remaining);
    if (activeResumeId === id) {
      setActiveResumeId(null);
      setCurrentView('dashboard');
    }
  };

  // Restore demo resume
  const handleRestoreDemo = () => {
    const restored = resumeStorage.restoreDemoResumes();
    setResumes(restored);
  };

  // Back to list
  const handleBack = () => {
    setActiveResumeId(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="animate-fade-in">
      {currentView === 'editor' && activeResume ? (
        <ResumeEditor
          initialResume={activeResume}
          onSave={handleSaveResume}
          onBack={handleBack}
          onDuplicate={handleDuplicateResume}
        />
      ) : (
        <CareerDashboard
          resumes={resumes}
          onCreateNew={handleCreateNew}
          onEditResume={handleEditResume}
          onDuplicateResume={handleDuplicateResume}
          onDeleteResume={handleDeleteResume}
          onRestoreDemo={handleRestoreDemo}
        />
      )}
    </div>
  );
};

export default CareerStudio;
