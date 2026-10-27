import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ResumePreview from '../components/career/ResumePreview';
import { resumeStorage } from '../utils/resumeStorage';
import { printResume } from '../utils/resumeExport';
import { api } from '../utils/api';
import {
  Sparkles,
  Download,
  Share2,
  Check,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const PublicResume = () => {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPublicResume = async () => {
      setLoading(true);
      setError('');

      // 1. Try fetching from backend API
      try {
        const res = await api.get(`/resumes/public/${shareId}`);
        if (res?.resume) {
          setResume(res.resume);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Backend not online or not found in cloud, fallback to local search
      }

      // 2. Fallback to local storage (for demo or offline preview)
      const localList = resumeStorage.getResumes();
      const localMatch = localList.find((r) => r.shareId === shareId || r.id === shareId);
      if (localMatch) {
        setResume(localMatch);
        setLoading(false);
        return;
      }

      setError('The requested resume link was not found or has been made private.');
      setLoading(false);
    };

    if (shareId) {
      fetchPublicResume();
    }
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (resume) {
      printResume('printable-resume-container', `${resume.personal?.fullName || 'Candidate'}_Resume`);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1b0a14',
          color: '#F7F5EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #f0eada', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#f0eada', fontSize: '0.95rem' }}>Loading live student resume...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1b0a14',
          color: '#F7F5EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <h2 style={{ fontSize: '1.5rem', color: '#f0eada', marginBottom: '0.5rem' }}>Resume Not Found</h2>
          <p style={{ color: '#dfc6d4', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {error || 'This live resume link does not exist or has been removed.'}
          </p>
          <Link to="/" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Return to StudentHub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1b0a14',
        color: '#F7F5EC',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Banner Navigation for Public View */}
      <header
        style={{
          height: 64,
          padding: '0 2rem',
          backgroundColor: '#270e1d',
          borderBottom: '1px solid rgba(240, 234, 218, 0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#85325c',
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#F7F5EC' }}>
              StudentHub Career Portfolio
            </div>
            <div style={{ fontSize: '0.72rem', color: '#f0eada', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} /> Verified Student Profile: {resume.personal?.fullName}
            </div>
          </div>
        </div>

        {/* Public Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Share2 size={14} />}
            {copied ? 'Link Copied!' : 'Share Link'}
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem' }}
          >
            <Download size={14} /> Download PDF
          </button>

          <Link
            to="/login"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', marginLeft: '0.5rem' }}
          >
            Build Yours <ExternalLink size={12} />
          </Link>
        </div>
      </header>

      {/* Main Resume Canvas */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 1rem 4rem 1rem',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '215mm', width: '100%' }}>
          <ResumePreview resume={resume} zoom={1} />
        </div>
      </main>
    </div>
  );
};

export default PublicResume;
