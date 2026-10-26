import React, { useState } from 'react';
import ResumeList from './ResumeList';
import ResumeTemplateSelector from './ResumeTemplateSelector';
import CareerProfile from './CareerProfile';
import { calculateResumeCompleteness } from '../../utils/resumeValidation';
import {
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
  UserCheck,
  RotateCcw,
} from 'lucide-react';

const CareerDashboard = ({
  resumes = [],
  onCreateNew,
  onEditResume,
  onDuplicateResume,
  onDeleteResume,
  onRestoreDemo,
}) => {
  // Tabs: 'resumes' | 'templates' | 'profile'
  const [activeTab, setActiveTab] = useState('resumes');

  // Key metrics
  const totalResumes = resumes.length;
  const bestCompleteness = resumes.reduce((max, r) => {
    const { score } = calculateResumeCompleteness(r);
    return Math.max(max, score);
  }, 0);

  const topTemplate = resumes[0]?.template
    ? resumes[0].template.charAt(0).toUpperCase() + resumes[0].template.slice(1)
    : 'Professional';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="page-header-title">Resume Builder</h1>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Career Studio
            </span>
          </div>
          <p className="page-header-subtitle">
            Create a professional resume for your next opportunity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={onCreateNew}
            className="btn btn-primary"
            style={{ gap: '0.35rem' }}
          >
            <Plus size={16} /> Create New Resume
          </button>
          <button
            onClick={onRestoreDemo}
            className="btn btn-secondary"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
            title="Reload the Alex Morgan CS demo resume"
          >
            <RotateCcw size={14} /> Demo Resume
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid-4">
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Resumes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalResumes}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Stored in your browser</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(52, 211, 153, 0.14)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Best Completeness</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {bestCompleteness}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {bestCompleteness >= 80 ? 'Application Ready' : 'Add key sections'}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(103, 232, 249, 0.14)',
              color: '#67e8f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Template</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {topTemplate}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>3 ATS formats available</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(223, 214, 174, 0.14)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Export Format</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>A4 Print</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Selectable vector text</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
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
          onClick={() => setActiveTab('resumes')}
          className={`btn ${activeTab === 'resumes' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <FileText size={15} /> My Resumes ({totalResumes})
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <Layers size={15} /> Resume Templates (3)
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <UserCheck size={15} /> Career Profile & Checklist
        </button>
      </div>

      {/* Tab 1: My Resumes List */}
      {activeTab === 'resumes' && (
        <ResumeList
          resumes={resumes}
          onCreateNew={onCreateNew}
          onEditResume={onEditResume}
          onDuplicateResume={onDuplicateResume}
          onDeleteResume={onDeleteResume}
          onRestoreDemo={onRestoreDemo}
        />
      )}

      {/* Tab 2: Resume Templates Showcase */}
      {activeTab === 'templates' && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
              Resume Templates Catalog
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              All templates are engineered to comply with Applicant Tracking Systems (ATS) while presenting clean visual hierarchy.
            </p>
          </div>

          <ResumeTemplateSelector
            selectedTemplate="professional"
            onSelectTemplate={(tplId) => {
              onCreateNew(tplId);
            }}
          />
        </div>
      )}

      {/* Tab 3: Career Profile */}
      {activeTab === 'profile' && (
        <CareerProfile onGenerateResume={() => onCreateNew()} />
      )}
    </div>
  );
};

export default CareerDashboard;
