import React, { useState, useMemo } from 'react';
import { calculateResumeCompleteness } from '../../utils/resumeValidation';
import { printResume } from '../../utils/resumeExport';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';
import ResumePreview from './ResumePreview';
import ShareResumeModal from './ShareResumeModal';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Edit3,
  Copy,
  Trash2,
  Download,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw,
  Share2,
} from 'lucide-react';

const ResumeList = ({
  resumes = [],
  onCreateNew,
  onEditResume,
  onDuplicateResume,
  onDeleteResume,
  onRestoreDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('ALL');
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [shareResume, setShareResume] = useState(null);

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      if (selectedTemplate !== 'ALL' && r.template !== selectedTemplate) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchName = (r.personal?.fullName || '').toLowerCase().includes(q);
        const matchRole = (r.targetRole || '').toLowerCase().includes(q);
        if (!matchTitle && !matchName && !matchRole) return false;
      }
      return true;
    });
  }, [resumes, searchQuery, selectedTemplate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search resumes by title or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filters & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="ALL">All Templates</option>
              <option value="professional">Professional (ATS)</option>
              <option value="modern">Modern Tech</option>
              <option value="minimal">Minimal Monochrome</option>
            </select>
          </div>

          <button
            onClick={onCreateNew}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.825rem' }}
          >
            <Plus size={16} /> Create New Resume
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileText size={48} style={{ color: 'var(--text-muted)', opacity: 0.6, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            {searchQuery || selectedTemplate !== 'ALL' ? 'No Matching Resumes' : 'No Resumes Created Yet'}
          </h3>
          <p style={{ maxWidth: 420, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {searchQuery || selectedTemplate !== 'ALL'
              ? 'Try clearing your search query or template filter.'
              : 'Create your first internship or placement resume with our ATS-friendly templates, live preview, and instant A4 PDF export.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={onCreateNew} className="btn btn-primary">
              <Plus size={16} /> Create First Resume
            </button>
            <button onClick={onRestoreDemo} className="btn btn-secondary" style={{ gap: '0.35rem' }}>
              <RotateCcw size={14} /> Load Demo Resume
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredResumes.map((resume) => {
            const { score, isComplete } = calculateResumeCompleteness(resume);
            const templateLabel =
              resume.template === 'professional'
                ? 'Professional ATS'
                : resume.template === 'modern'
                ? 'Modern Accent'
                : 'Minimal Monochrome';

            const formattedDate = resume.updatedAt
              ? new Date(resume.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <div
                key={resume.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.35rem',
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div>
                  {/* Top Bar: Template Badge & Menu */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem', gap: '0.3rem' }}>
                      <Layers size={11} /> {templateLabel}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Updated {formattedDate}
                    </span>
                  </div>

                  {/* Resume Title */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      margin: '0 0 0.35rem 0',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => onEditResume(resume.id)}
                    title="Click to edit resume"
                  >
                    {resume.title || 'Untitled Resume'}
                  </h3>

                  {/* Student Name & Target Headline */}
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <strong>{resume.personal?.fullName || 'Anonymous Candidate'}</strong>
                    {resume.personal?.headline && ` • ${resume.personal.headline}`}
                  </div>

                  {/* Completeness Bar */}
                  <div style={{ marginBottom: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>Completeness</span>
                      <strong style={{ color: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {score}%
                      </strong>
                    </div>
                    <div className="progress-container" style={{ height: 6 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${score}%`,
                          backgroundColor: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => onEditResume(resume.id)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem', gap: '0.3rem' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => setPreviewResume(resume)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', gap: '0.3rem' }}
                      title="Quick Preview"
                    >
                      <Eye size={13} /> Preview
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button
                      onClick={() => setShareResume(resume)}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--accent-cream, #f0eada)' }}
                      title="Share Public Link"
                    >
                      <Share2 size={13} />
                    </button>

                    <button
                      onClick={() => onDuplicateResume(resume.id)}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--text-secondary)' }}
                      title="Duplicate Resume"
                    >
                      <Copy size={13} />
                    </button>

                    <button
                      onClick={() => {
                        // Quick Print / Download PDF
                        setPreviewResume(resume);
                        setTimeout(() => {
                          printResume('preview-modal-resume-container', resume.title);
                        }, 200);
                      }}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--primary)' }}
                      title="Download PDF"
                    >
                      <Download size={13} />
                    </button>

                    <button
                      onClick={() => setResumeToDelete(resume)}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--danger)' }}
                      title="Delete Resume"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewResume && (
        <Modal
          isOpen={Boolean(previewResume)}
          onClose={() => setPreviewResume(null)}
          title={`Preview: ${previewResume.title}`}
          maxWidth="840px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setPreviewResume(null);
                  onEditResume(previewResume.id);
                }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.3rem' }}
              >
                <Edit3 size={14} /> Open Full Editor
              </button>
              <button
                onClick={() => printResume('printable-resume-container', previewResume.title)}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.3rem' }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>

            <div
              style={{
                maxHeight: '75vh',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <ResumePreview resume={previewResume} zoom={0.82} />
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(resumeToDelete)}
        onClose={() => setResumeToDelete(null)}
        onConfirm={() => {
          if (resumeToDelete) {
            onDeleteResume(resumeToDelete.id);
            setResumeToDelete(null);
          }
        }}
        title="Delete Resume"
        message={`Are you sure you want to permanently delete "${resumeToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Resume"
      />
      {/* Share Resume Public Link Modal */}
      <ShareResumeModal
        isOpen={Boolean(shareResume)}
        onClose={() => setShareResume(null)}
        resume={shareResume}
      />
    </div>
  );
};

export default ResumeList;
