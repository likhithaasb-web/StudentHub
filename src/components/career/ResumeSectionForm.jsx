import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Languages,
  Sliders,
  ExternalLink,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { generateId } from '../../utils/storage';
import { isValidEmail, isValidUrl } from '../../utils/resumeValidation';

const DEFAULT_SKILL_CATEGORIES = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend & APIs',
  'Databases',
  'Tools & Platforms',
  'Soft Skills',
];

const ResumeSectionForm = ({ resume, onChange, activeSection, onSelectSection }) => {
  // Local state for skill tag inputs per category
  const [newSkillInputs, setNewSkillInputs] = useState({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Field change helpers
  const handlePersonalChange = (field, value) => {
    onChange({
      ...resume,
      personal: {
        ...resume.personal,
        [field]: value,
      },
    });
  };

  // Education helpers
  const handleAddEducation = () => {
    const newEdu = {
      id: generateId(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      relevantCoursework: '',
    };
    onChange({
      ...resume,
      education: [...(resume.education || []), newEdu],
    });
  };

  const handleUpdateEducation = (id, field, value) => {
    onChange({
      ...resume,
      education: (resume.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleDeleteEducation = (id) => {
    onChange({
      ...resume,
      education: (resume.education || []).filter((edu) => edu.id !== id),
    });
  };

  const handleMoveEducation = (index, direction) => {
    const list = [...(resume.education || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...resume, education: list });
  };

  // Skills helpers
  const handleAddSkill = (categoryId) => {
    const val = (newSkillInputs[categoryId] || '').trim();
    if (!val) return;

    onChange({
      ...resume,
      skills: (resume.skills || []).map((cat) => {
        if (cat.id === categoryId) {
          const items = cat.items || [];
          if (!items.includes(val)) {
            return { ...cat, items: [...items, val] };
          }
        }
        return cat;
      }),
    });

    setNewSkillInputs({ ...newSkillInputs, [categoryId]: '' });
  };

  const handleRemoveSkill = (categoryId, itemToRemove) => {
    onChange({
      ...resume,
      skills: (resume.skills || []).map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).filter((item) => item !== itemToRemove),
          };
        }
        return cat;
      }),
    });
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;

    const newCat = {
      id: generateId(),
      category: name,
      items: [],
    };

    onChange({
      ...resume,
      skills: [...(resume.skills || []), newCat],
    });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (categoryId) => {
    onChange({
      ...resume,
      skills: (resume.skills || []).filter((cat) => cat.id !== categoryId),
    });
  };

  // Projects helpers
  const handleAddProject = () => {
    const newProj = {
      id: generateId(),
      title: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      startDate: '',
      endDate: '',
    };
    onChange({
      ...resume,
      projects: [...(resume.projects || []), newProj],
    });
  };

  const handleUpdateProject = (id, field, value) => {
    onChange({
      ...resume,
      projects: (resume.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const handleDeleteProject = (id) => {
    onChange({
      ...resume,
      projects: (resume.projects || []).filter((proj) => proj.id !== id),
    });
  };

  const handleMoveProject = (index, direction) => {
    const list = [...(resume.projects || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...resume, projects: list });
  };

  // Experience helpers
  const handleAddExperience = () => {
    const newExp = {
      id: generateId(),
      jobTitle: '',
      company: '',
      location: '',
      employmentType: 'Internship',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange({
      ...resume,
      experience: [...(resume.experience || []), newExp],
    });
  };

  const handleUpdateExperience = (id, field, value) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleDeleteExperience = (id) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).filter((exp) => exp.id !== id),
    });
  };

  const handleMoveExperience = (index, direction) => {
    const list = [...(resume.experience || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...resume, experience: list });
  };

  const handleAddBullet = (expId) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).map((exp) => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...(exp.bullets || []), ''] };
        }
        return exp;
      }),
    });
  };

  const handleUpdateBullet = (expId, bulletIndex, value) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).map((exp) => {
        if (exp.id === expId) {
          const updated = [...(exp.bullets || [])];
          updated[bulletIndex] = value;
          return { ...exp, bullets: updated };
        }
        return exp;
      }),
    });
  };

  const handleDeleteBullet = (expId, bulletIndex) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).map((exp) => {
        if (exp.id === expId) {
          const updated = (exp.bullets || []).filter((_, idx) => idx !== bulletIndex);
          return { ...exp, bullets: updated.length > 0 ? updated : [''] };
        }
        return exp;
      }),
    });
  };

  // Certifications helpers
  const handleAddCertification = () => {
    const newCert = {
      id: generateId(),
      name: '',
      organization: '',
      date: '',
      credentialUrl: '',
      description: '',
    };
    onChange({
      ...resume,
      certifications: [...(resume.certifications || []), newCert],
    });
  };

  const handleUpdateCertification = (id, field, value) => {
    onChange({
      ...resume,
      certifications: (resume.certifications || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const handleDeleteCertification = (id) => {
    onChange({
      ...resume,
      certifications: (resume.certifications || []).filter((c) => c.id !== id),
    });
  };

  // Optional sections helpers
  const handleToggleOptionalSection = (sectionKey) => {
    onChange({
      ...resume,
      optionalSections: {
        ...(resume.optionalSections || {}),
        [sectionKey]: !resume.optionalSections?.[sectionKey],
      },
    });
  };

  // Languages helpers
  const handleAddLanguage = () => {
    const newLang = { id: generateId(), name: '', proficiency: 'Intermediate' };
    onChange({
      ...resume,
      languages: [...(resume.languages || []), newLang],
    });
  };

  const handleUpdateLanguage = (id, field, value) => {
    onChange({
      ...resume,
      languages: (resume.languages || []).map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    });
  };

  const handleDeleteLanguage = (id) => {
    onChange({
      ...resume,
      languages: (resume.languages || []).filter((l) => l.id !== id),
    });
  };

  // Awards helpers
  const handleAddAward = () => {
    const newAwd = { id: generateId(), name: '', issuer: '', date: '', description: '' };
    onChange({
      ...resume,
      awards: [...(resume.awards || []), newAwd],
    });
  };

  const handleUpdateAward = (id, field, value) => {
    onChange({
      ...resume,
      awards: (resume.awards || []).map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    });
  };

  const handleDeleteAward = (id) => {
    onChange({
      ...resume,
      awards: (resume.awards || []).filter((a) => a.id !== id),
    });
  };

  const sections = [
    { id: 'personal', name: 'Personal Information', icon: User },
    { id: 'education', name: 'Education', icon: GraduationCap, count: (resume.education || []).length },
    { id: 'skills', name: 'Technical Skills', icon: Wrench, count: (resume.skills || []).reduce((sum, c) => sum + (c.items?.length || 0), 0) },
    { id: 'projects', name: 'Key Projects', icon: FolderGit2, count: (resume.projects || []).length },
    { id: 'experience', name: 'Experience & Internships', icon: Briefcase, count: (resume.experience || []).length },
    { id: 'certifications', name: 'Certifications', icon: Award, count: (resume.certifications || []).length },
    { id: 'optional', name: 'Optional Sections & Awards', icon: Sliders },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Horizontal Nav Tabs for Editor */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSection(s.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.78rem',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <Icon size={14} />
              <span>{s.name}</span>
              {s.count !== undefined && s.count > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? 'var(--text-inverse)' : 'var(--bg-card)',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                  }}
                >
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          SECTION A: PERSONAL INFORMATION
          ===================================================================== */}
      {activeSection === 'personal' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
              Personal & Contact Information
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Recruiters and ATS parsers look for contact details and professional links at the top of your resume.
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={resume.personal?.fullName || ''}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Computer Science Undergrad | Aspiring Cloud Engineer"
                value={resume.personal?.headline || ''}
                onChange={(e) => handlePersonalChange('headline', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. alex.morgan@university.edu"
                value={resume.personal?.email || ''}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
              />
              {resume.personal?.email && !isValidEmail(resume.personal.email) && (
                <span style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: 2 }}>
                  Please enter a valid email address
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 234-5678"
                value={resume.personal?.phone || ''}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City, State / Country</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={resume.personal?.location || ''}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="text"
                placeholder="e.g. linkedin.com/in/alexmorgan"
                value={resume.personal?.linkedin || ''}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="text"
                placeholder="e.g. github.com/alexmorgan"
                value={resume.personal?.github || ''}
                onChange={(e) => handlePersonalChange('github', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio Website URL</label>
              <input
                type="text"
                placeholder="e.g. alexmorgan.dev"
                value={resume.personal?.portfolio || ''}
                onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Professional Summary</label>
            <textarea
              rows={4}
              placeholder="Write a concise 2-3 sentence overview of your background, technical interests, and the value you bring to an engineering team..."
              value={resume.personal?.summary || ''}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION B: EDUCATION
          ===================================================================== */}
      {activeSection === 'education' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Education Entries
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                List your university, degree, major, expected graduation, and academic honors.
              </p>
            </div>
            <button onClick={handleAddEducation} type="button" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
              <Plus size={14} /> Add Education
            </button>
          </div>

          {(resume.education || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <GraduationCap size={32} style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No education entries added yet.</p>
              <button onClick={handleAddEducation} type="button" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add University Degree
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(resume.education || []).map((edu, idx) => (
                <div
                  key={edu.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Education #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleMoveEducation(idx, -1)}
                        disabled={idx === 0}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Up"
                      >
                        <MoveUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveEducation(idx, 1)}
                        disabled={idx === (resume.education || []).length - 1}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Down"
                      >
                        <MoveDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--danger)' }}
                        title="Delete Entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Institution / University *</label>
                      <input
                        type="text"
                        placeholder="e.g. State Tech University"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Degree *</label>
                      <input
                        type="text"
                        placeholder="e.g. Bachelor of Technology"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Field of Study / Major</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science & Engineering"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">CGPA / Grade (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.85 / 4.0 or 8.9 / 10"
                        value={edu.gpa}
                        onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Aug 2023"
                        value={edu.startDate}
                        onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">End / Expected Graduation Date</label>
                      <input
                        type="text"
                        placeholder="e.g. May 2027"
                        value={edu.endDate}
                        onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Relevant Coursework (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Networks, Machine Learning, Data Structures, Operating Systems"
                      value={edu.relevantCoursework}
                      onChange={(e) => handleUpdateEducation(edu.id, 'relevantCoursework', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION C: TECHNICAL SKILLS (Categorized Tags)
          ===================================================================== */}
      {activeSection === 'skills' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Skills & Technologies
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Manage your technical competencies as removable tags organized by category.
              </p>
            </div>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                placeholder="Category name (e.g. Cloud & DevOps, Machine Learning)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                autoFocus
              />
              <button onClick={handleAddCategory} type="button" className="btn btn-primary btn-sm">
                Add
              </button>
              <button onClick={() => setShowAddCategory(false)} type="button" className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          )}

          {/* Category List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {(resume.skills || []).map((cat) => (
              <div
                key={cat.id || cat.category}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cat.category}</strong>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    type="button"
                    className="btn-icon"
                    style={{ width: 24, height: 24, color: 'var(--danger)' }}
                    title="Delete Category"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Skill Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                  {(cat.items || []).map((item) => (
                    <span
                      key={item}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        padding: '0.25rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(cat.id, item)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(cat.items || []).length === 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No skills added in this category yet.
                    </span>
                  )}
                </div>

                {/* Add Skill Tag Input */}
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <input
                    type="text"
                    placeholder={`Add a skill to ${cat.category} (press Enter)...`}
                    value={newSkillInputs[cat.id] || ''}
                    onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [cat.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(cat.id);
                      }
                    }}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(cat.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION D: PROJECTS
          ===================================================================== */}
      {activeSection === 'projects' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Academic & Personal Projects
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Highlight engineering projects with technologies used and links to live demos or GitHub.
              </p>
            </div>
            <button onClick={handleAddProject} type="button" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
              <Plus size={14} /> Add Project
            </button>
          </div>

          {(resume.projects || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <FolderGit2 size={32} style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No projects added yet.</p>
              <button onClick={handleAddProject} type="button" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add First Project
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(resume.projects || []).map((proj, idx) => (
                <div
                  key={proj.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Project #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Up"
                      >
                        <MoveUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === (resume.projects || []).length - 1}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Down"
                      >
                        <MoveDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--danger)' }}
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Project Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. StudentHub — Productivity Platform"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Technologies Used (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Node.js, PostgreSQL, Docker"
                        value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                        onChange={(e) =>
                          handleUpdateProject(
                            proj.id,
                            'technologies',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">GitHub Repository URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://github.com/username/project"
                        value={proj.githubUrl}
                        onChange={(e) => handleUpdateProject(proj.id, 'githubUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Live Demo / Deployment URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://myproject.app"
                        value={proj.liveUrl}
                        onChange={(e) => handleUpdateProject(proj.id, 'liveUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Aug 2026"
                        value={proj.startDate}
                        onChange={(e) => handleUpdateProject(proj.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Oct 2026"
                        value={proj.endDate}
                        onChange={(e) => handleUpdateProject(proj.id, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Project Description</label>
                    <textarea
                      rows={3}
                      placeholder="Explain what problem this solves, what architecture you designed, and quantifiable metrics or achievements..."
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION E: EXPERIENCE AND INTERNSHIPS
          ===================================================================== */}
      {activeSection === 'experience' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Experience & Internships
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Include past internships, teaching assistantships, open source contributions, or campus jobs.
              </p>
            </div>
            <button onClick={handleAddExperience} type="button" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
              <Plus size={14} /> Add Role
            </button>
          </div>

          {(resume.experience || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Briefcase size={32} style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No work experience added yet.</p>
              <button onClick={handleAddExperience} type="button" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Internship or Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {(resume.experience || []).map((exp, idx) => (
                <div
                  key={exp.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Position #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, -1)}
                        disabled={idx === 0}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Up"
                      >
                        <MoveUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, 1)}
                        disabled={idx === (resume.experience || []).length - 1}
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        title="Move Down"
                      >
                        <MoveDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--danger)' }}
                        title="Delete Role"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Job Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Engineering Intern"
                        value={exp.jobTitle}
                        onChange={(e) => handleUpdateExperience(exp.id, 'jobTitle', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Company / Organization *</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Cloud Solutions"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, CA (Remote)"
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Employment Type</label>
                      <select
                        value={exp.employmentType}
                        onChange={(e) => handleUpdateExperience(exp.id, 'employmentType', e.target.value)}
                      >
                        <option value="Internship">Internship</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Research">Research Assistant</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. May 2026"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Aug 2026"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Currently working checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(exp.current)}
                      onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <span>I am currently working in this role</span>
                  </label>

                  {/* Bullet points */}
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>
                        Key Responsibilities & Achievements (Bullet Points)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(exp.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', gap: '0.25rem' }}
                      >
                        <Plus size={12} /> Add Bullet
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {(exp.bullets || ['']).map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>•</span>
                          <input
                            type="text"
                            placeholder="e.g. Optimized client-side state handling, decreasing page load times by 24%..."
                            value={bullet}
                            onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                          {(exp.bullets || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteBullet(exp.id, bIdx)}
                              className="btn-icon"
                              style={{ width: 24, height: 24, color: 'var(--danger)' }}
                              title="Delete bullet"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION F: CERTIFICATIONS AND ACHIEVEMENTS
          ===================================================================== */}
      {activeSection === 'certifications' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Certifications & Badges
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Include verified credentials from AWS, Meta, Google, Microsoft, Coursera, or HackerRank.
              </p>
            </div>
            <button onClick={handleAddCertification} type="button" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {(resume.certifications || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Award size={32} style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No certifications added yet.</p>
              <button onClick={handleAddCertification} type="button" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add AWS / Meta / Coursera Cert
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(resume.certifications || []).map((c, idx) => (
                <div
                  key={c.id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Certification #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCertification(c.id)}
                      className="btn-icon"
                      style={{ width: 26, height: 26, color: 'var(--danger)' }}
                      title="Delete Certification"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Certification Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. AWS Certified Cloud Practitioner"
                        value={c.name}
                        onChange={(e) => handleUpdateCertification(c.id, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Issuing Organization *</label>
                      <input
                        type="text"
                        placeholder="e.g. Amazon Web Services"
                        value={c.organization}
                        onChange={(e) => handleUpdateCertification(c.id, 'organization', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Issue Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Apr 2026"
                        value={c.date}
                        onChange={(e) => handleUpdateCertification(c.id, 'date', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Verification Credential URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. https://aws.amazon.com/verify/..."
                        value={c.credentialUrl}
                        onChange={(e) => handleUpdateCertification(c.id, 'credentialUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECTION G: OPTIONAL SECTIONS (Awards, Languages, Coursework)
          ===================================================================== */}
      {activeSection === 'optional' && (
        <div className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
              Optional Sections & Additions
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Toggle additional sections to tailor your resume for specific application requirements.
            </p>
          </div>

          {/* Section Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { key: 'awards', label: 'Honors & Awards' },
              { key: 'languages', label: 'Spoken Languages' },
              { key: 'coursework', label: 'Detailed Coursework' },
              { key: 'volunteer', label: 'Volunteer Experience' },
              { key: 'publications', label: 'Publications & Papers' },
            ].map((opt) => {
              const isEnabled = Boolean(resume.optionalSections?.[opt.key]);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleToggleOptionalSection(opt.key)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isEnabled ? 'rgba(223, 214, 174, 0.12)' : 'var(--bg-secondary)',
                    border: isEnabled ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    color: isEnabled ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{opt.label}</span>
                  {isEnabled ? <Check size={16} /> : <Plus size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              );
            })}
          </div>

          {/* Languages Section Manager if enabled */}
          {resume.optionalSections?.languages && (
            <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Languages Spoken</strong>
                <button onClick={handleAddLanguage} type="button" className="btn btn-secondary btn-sm" style={{ gap: '0.25rem', fontSize: '0.75rem' }}>
                  <Plus size={12} /> Add Language
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(resume.languages || []).map((lang) => (
                  <div key={lang.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Language (e.g. English, Spanish)"
                      value={lang.name}
                      onChange={(e) => handleUpdateLanguage(lang.id, 'name', e.target.value)}
                      style={{ flex: 1, fontSize: '0.85rem' }}
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => handleUpdateLanguage(lang.id, 'proficiency', e.target.value)}
                      style={{ width: 160, fontSize: '0.85rem' }}
                    >
                      <option value="Native / Bilingual">Native / Bilingual</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Basic">Basic</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteLanguage(lang.id)}
                      className="btn-icon"
                      style={{ width: 28, height: 28, color: 'var(--danger)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards Section Manager if enabled */}
          {resume.optionalSections?.awards && (
            <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Honors & Awards</strong>
                <button onClick={handleAddAward} type="button" className="btn btn-secondary btn-sm" style={{ gap: '0.25rem', fontSize: '0.75rem' }}>
                  <Plus size={12} /> Add Award
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(resume.awards || []).map((awd) => (
                  <div
                    key={awd.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Award Name (e.g. 1st Place Hackathon)"
                        value={awd.name}
                        onChange={(e) => handleUpdateAward(awd.id, 'name', e.target.value)}
                        style={{ fontWeight: 600, fontSize: '0.88rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteAward(awd.id)}
                        className="btn-icon"
                        style={{ width: 26, height: 26, color: 'var(--danger)', marginLeft: 8 }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Issuer (e.g. University Tech Symposium)"
                        value={awd.issuer}
                        onChange={(e) => handleUpdateAward(awd.id, 'issuer', e.target.value)}
                        style={{ fontSize: '0.825rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Date (e.g. Mar 2026)"
                        value={awd.date}
                        onChange={(e) => handleUpdateAward(awd.id, 'date', e.target.value)}
                        style={{ fontSize: '0.825rem' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeSectionForm;
