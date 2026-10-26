import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../utils/storage';
import {
  Briefcase,
  User,
  Globe,
  Github,
  Linkedin,
  Code2,
  CheckCircle2,
  ListTodo,
  Sparkles,
  Save,
} from 'lucide-react';

const CAREER_PROFILE_KEY = 'career_profile';

const DEFAULT_PROFILE = {
  targetRoles: 'Software Engineering Intern, Full Stack Developer, ML Engineer',
  preferredLocations: 'San Francisco, CA / Remote / New York',
  graduationDate: 'May 2027',
  portfolioUrl: 'https://alexmorgan.dev',
  githubUrl: 'https://github.com/alexmorgan',
  linkedinUrl: 'https://linkedin.com/in/alexmorgan-cs',
  leetcodeUrl: 'https://leetcode.com/alexmorgan',
  checklist: {
    resumeDone: true,
    githubClean: true,
    linkedinUpdated: true,
    dsaPractice: false,
    mockInterview: false,
  },
};

const CareerProfile = ({ onGenerateResume }) => {
  const { settings } = useApp();
  const [profile, setProfile] = useState(() => storage.get(CAREER_PROFILE_KEY, DEFAULT_PROFILE));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    storage.set(CAREER_PROFILE_KEY, profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleChecklist = (key) => {
    const updated = {
      ...profile,
      checklist: {
        ...profile.checklist,
        [key]: !profile.checklist?.[key],
      },
    };
    setProfile(updated);
    storage.set(CAREER_PROFILE_KEY, updated);
  };

  const checklistItems = [
    { key: 'resumeDone', label: 'Resume tailored with recent coursework (CN, ML, API, OT)' },
    { key: 'githubClean', label: 'GitHub projects equipped with clean READMEs & live demos' },
    { key: 'linkedinUpdated', label: 'LinkedIn profile headline and featured projects updated' },
    { key: 'dsaPractice', label: 'Solved 50+ DSA LeetCode/HackerRank placement problems' },
    { key: 'mockInterview', label: 'Completed at least 1 mock behavioral & technical interview' },
  ];

  const completedCount = Object.values(profile.checklist || {}).filter(Boolean).length;
  const readinessPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 860 }}>
      {/* Header Info Banner */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Briefcase size={26} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
              {settings.studentName || 'Student'}’s Career Profile
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Centralize your placement goals, target job descriptions, portfolio links, and recruitment readiness.
            </p>
          </div>
        </div>

        <button
          onClick={onGenerateResume}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.4rem', fontSize: '0.825rem' }}
        >
          <Sparkles size={15} /> Create Resume from Profile
        </button>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} /> Profile changes saved successfully to your browser storage!
        </div>
      )}

      {/* Target Roles & Portfolio Form */}
      <form onSubmit={handleSave} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Target Roles & Career Preferences
        </h4>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Target Positions / Job Titles</label>
          <input
            type="text"
            placeholder="e.g. Software Engineering Intern, Full Stack Developer, ML Engineer"
            value={profile.targetRoles}
            onChange={(e) => setProfile({ ...profile, targetRoles: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Preferred Locations / Work Mode</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA / Remote / Hybrid"
              value={profile.preferredLocations}
              onChange={(e) => setProfile({ ...profile, preferredLocations: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Graduation Date</label>
            <input
              type="text"
              placeholder="e.g. May 2027"
              value={profile.graduationDate}
              onChange={(e) => setProfile({ ...profile, graduationDate: e.target.value })}
            />
          </div>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>
          Portfolio & Code Profiles
        </h4>

        <div className="form-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Portfolio Website URL</label>
            <input
              type="text"
              placeholder="e.g. https://alexmorgan.dev"
              value={profile.portfolioUrl}
              onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">GitHub URL</label>
            <input
              type="text"
              placeholder="e.g. https://github.com/alexmorgan"
              value={profile.githubUrl}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">LinkedIn URL</label>
            <input
              type="text"
              placeholder="e.g. https://linkedin.com/in/alexmorgan-cs"
              value={profile.linkedinUrl}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">LeetCode / Coding Profile</label>
            <input
              type="text"
              placeholder="e.g. https://leetcode.com/alexmorgan"
              value={profile.leetcodeUrl}
              onChange={(e) => setProfile({ ...profile, leetcodeUrl: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ gap: '0.35rem' }}>
            <Save size={15} /> Save Career Profile
          </button>
        </div>
      </form>

      {/* Recruitment Readiness Checklist */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
              Internship & Placement Readiness Checklist
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Track your preparation milestones before attending recruitment drives.
            </p>
          </div>

          <span
            className={`badge ${readinessPercent >= 80 ? 'badge-success' : 'badge-purple'}`}
            style={{ fontWeight: 800, fontSize: '0.85rem' }}
          >
            {readinessPercent}% Ready ({completedCount}/{checklistItems.length})
          </span>
        </div>

        <div className="progress-container" style={{ height: 6 }}>
          <div
            className="progress-bar"
            style={{
              width: `${readinessPercent}%`,
              backgroundColor: readinessPercent >= 80 ? 'var(--success)' : 'var(--primary)',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
          {checklistItems.map((item) => {
            const isChecked = Boolean(profile.checklist?.[item.key]);
            return (
              <label
                key={item.key}
                onClick={() => toggleChecklist(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isChecked ? 'rgba(52, 211, 153, 0.08)' : 'var(--bg-secondary)',
                  border: isChecked ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by label onClick
                  style={{ width: 'auto', margin: 0 }}
                />
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.9 : 1,
                  }}
                >
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerProfile;
