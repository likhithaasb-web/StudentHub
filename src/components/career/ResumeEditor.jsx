import React, { useState, useEffect } from 'react';
import ResumeSectionForm from './ResumeSectionForm';
import ResumePreview from './ResumePreview';
import ResumeCompleteness from './ResumeCompleteness';
import ResumeTemplateSelector from './ResumeTemplateSelector';
import ShareResumeModal from './ShareResumeModal';
import Modal from '../common/Modal';
import { printResume } from '../../utils/resumeExport';
import {
  ArrowLeft,
  Save,
  Download,
  Copy,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Eye,
  Edit3,
  Share2,
} from 'lucide-react';

const ResumeEditor = ({
  initialResume,
  onSave,
  onBack,
  onDuplicate,
}) => {
  const [resume, setResume] = useState(initialResume);
  const [activeSection, setActiveSection] = useState('personal');
  const [zoom, setZoom] = useState(0.85); // Default zoom fit for 2-column desktop view
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mobile active tab: 'editor' | 'preview' | 'meta'
  const [mobileTab, setMobileTab] = useState('editor');

  useEffect(() => {
    setResume(initialResume);
  }, [initialResume]);

  const handleResumeChange = (updatedResume) => {
    setResume(updatedResume);
    if (onSave) {
      onSave(updatedResume);
    }
  };

  const handleManualSave = () => {
    if (onSave) {
      onSave(resume);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleDownloadPDF = () => {
    // Automatically triggers high-fidelity A4 browser print/PDF
    printResume('printable-resume-container', resume.title || 'Student_Resume');
  };

  const handleTemplateChange = (templateId) => {
    handleResumeChange({
      ...resume,
      template: templateId,
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Editor Top Control Bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Left: Back button & Title editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 300px' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
            title="Return to My Resumes list"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div style={{ flex: 1, maxWidth: 360 }}>
            <input
              type="text"
              value={resume.title || ''}
              onChange={(e) => handleResumeChange({ ...resume, title: e.target.value })}
              placeholder="Resume Title (e.g. Software Engineering Intern)..."
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '0.35rem 0.65rem',
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={(e) => (e.target.style.borderColor = 'transparent')}
            />
          </div>
        </div>

        {/* Right: Actions (Template switcher, Save, Download PDF, Duplicate) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Template Button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
          >
            <Layers size={14} />
            <span style={{ textTransform: 'capitalize' }}>{resume.template || 'Professional'}</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() => onDuplicate && onDuplicate(resume.id)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
            title="Create an exact copy of this resume"
          >
            <Copy size={14} /> Duplicate
          </button>

          {/* Manual Save */}
          <button
            onClick={handleManualSave}
            className="btn btn-secondary btn-sm"
            style={{
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: saveSuccess ? 'var(--success)' : 'var(--text-secondary)',
              borderColor: saveSuccess ? 'var(--success-border)' : 'var(--border-subtle)',
            }}
          >
            {saveSuccess ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saveSuccess ? 'Saved' : 'Save'}
          </button>

          {/* Share Public Link */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'var(--accent-cream, #F1EAD7)',
              borderColor: 'rgba(241, 234, 215, 0.4)',
            }}
            title="Share live link with recruiters"
          >
            <Share2 size={14} /> Share Link
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem', fontSize: '0.825rem' }}
            title="Download clean A4 PDF or print"
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div
        style={{
          display: 'none',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
        }}
        className="mobile-editor-tabs"
      >
        <button
          onClick={() => setMobileTab('editor')}
          className={`btn btn-sm ${mobileTab === 'editor' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, gap: '0.35rem' }}
        >
          <Edit3 size={14} /> Edit Form
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`btn btn-sm ${mobileTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, gap: '0.35rem' }}
        >
          <Eye size={14} /> Live Preview
        </button>
        <button
          onClick={() => setMobileTab('meta')}
          className={`btn btn-sm ${mobileTab === 'meta' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, gap: '0.35rem' }}
        >
          <Sparkles size={14} /> Score & Tips
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 1.15fr) minmax(420px, 1.25fr)',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
        className="resume-editor-grid"
      >
        {/* Left Column: Form & Completeness Widget */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
          className={`editor-pane ${mobileTab !== 'editor' ? 'hide-on-mobile-tab' : ''}`}
        >
          {/* Form Sections */}
          <ResumeSectionForm
            resume={resume}
            onChange={handleResumeChange}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />

          {/* Completeness Feedback Card */}
          <ResumeCompleteness
            resume={resume}
            onSelectSection={(sec) => setActiveSection(sec)}
          />
        </div>

        {/* Right Column: Live Sticky A4 Preview */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            position: 'sticky',
            top: 'calc(var(--navbar-height) + 1rem)',
          }}
          className={`preview-pane ${mobileTab !== 'preview' ? 'hide-on-mobile-tab' : ''}`}
        >
          {/* Preview Controls Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
              <Eye size={14} style={{ color: 'var(--primary)' }} />
              <strong>A4 Document Preview</strong>
              <span style={{ color: 'var(--text-muted)' }}>
                ({resume.template === 'professional' ? 'ATS-Friendly' : resume.template === 'modern' ? 'Modern Accent' : 'Minimal Monochrome'})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                className="btn-icon"
                style={{ width: 26, height: 26 }}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ minWidth: 38, textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.3, Math.round((z + 0.1) * 10) / 10))}
                className="btn-icon"
                style={{ width: 26, height: 26 }}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(0.85)}
                className="btn-icon"
                style={{ width: 26, height: 26 }}
                title="Reset Zoom"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Scrollable A4 Canvas Container */}
          <div
            style={{
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
              overflowX: 'auto',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '1rem',
            }}
          >
            <ResumePreview resume={resume} zoom={zoom} />
          </div>
        </div>

        {/* Mobile Tab: Completeness and Tips Only */}
        {mobileTab === 'meta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="mobile-only-block">
            <ResumeCompleteness
              resume={resume}
              onSelectSection={(sec) => {
                setActiveSection(sec);
                setMobileTab('editor');
              }}
            />
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Switch Resume Template
              </h4>
              <ResumeTemplateSelector
                selectedTemplate={resume.template}
                onSelectTemplate={handleTemplateChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Template Chooser Modal */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Choose Resume Template"
        maxWidth="740px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Switching templates instantly restyles your resume while preserving 100% of your entered information.
          </p>

          <ResumeTemplateSelector
            selectedTemplate={resume.template}
            onSelectTemplate={(tpl) => {
              handleTemplateChange(tpl);
              setIsTemplateModalOpen(false);
            }}
          />
        </div>
      </Modal>

      {/* Share Resume Public Link Modal */}
      <ShareResumeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        resume={resume}
      />
    </div>
  );
};

export default ResumeEditor;
