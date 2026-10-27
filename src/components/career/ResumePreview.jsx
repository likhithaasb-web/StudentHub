import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Calendar,
  Award,
} from 'lucide-react';

const ResumePreview = ({ resume, zoom = 1 }) => {
  if (!resume) return null;

  const {
    personal = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
    certifications = [],
    optionalSections = {},
    languages = [],
    awards = [],
    template = 'professional',
  } = resume;

  // Helper to format URLs for clickable display
  const formatUrl = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  };

  const getFullUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0.5rem',
        overflow: 'auto',
      }}
    >
      <div
        id="printable-resume-container"
        className={`resume-paper template-${template}`}
        style={{
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '18mm 16mm',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.28)',
          borderRadius: 4,
          fontFamily:
            template === 'professional'
              ? 'Georgia, Cambria, "Times New Roman", Times, serif'
              : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: 1.5,
          fontSize: '9.5pt',
          boxSizing: 'border-box',
          transform: zoom !== 1 ? `scale(${zoom})` : 'none',
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* ====================================================================
            TEMPLATE 1: PROFESSIONAL (Classic ATS-Friendly Single Column)
            ==================================================================== */}
        {template === 'professional' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14pt' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1.5pt solid #111827', paddingBottom: '10pt' }}>
              <h1 style={{ fontSize: '20pt', fontWeight: 700, margin: '0 0 3pt 0', letterSpacing: '0.02em', color: '#111827' }}>
                {personal.fullName || 'Your Full Name'}
              </h1>
              {personal.headline && (
                <div style={{ fontSize: '10.5pt', color: '#374151', fontStyle: 'italic', marginBottom: '6pt' }}>
                  {personal.headline}
                </div>
              )}

              {/* Contact Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '8pt',
                  fontSize: '8.5pt',
                  color: '#374151',
                }}
              >
                {personal.email && (
                  <a href={`mailto:${personal.email}`} style={{ color: '#111827', textDecoration: 'none' }}>
                    {personal.email}
                  </a>
                )}
                {personal.phone && <span>• {personal.phone}</span>}
                {personal.location && <span>• {personal.location}</span>}
                {personal.linkedin && (
                  <span>
                    •{' '}
                    <a href={getFullUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#111827', textDecoration: 'underline' }}>
                      {formatUrl(personal.linkedin)}
                    </a>
                  </span>
                )}
                {personal.github && (
                  <span>
                    •{' '}
                    <a href={getFullUrl(personal.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#111827', textDecoration: 'underline' }}>
                      {formatUrl(personal.github)}
                    </a>
                  </span>
                )}
                {personal.portfolio && (
                  <span>
                    •{' '}
                    <a href={getFullUrl(personal.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: '#111827', textDecoration: 'underline' }}>
                      {formatUrl(personal.portfolio)}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {personal.summary && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 5pt 0', color: '#111827' }}>
                  Professional Summary
                </h3>
                <p style={{ margin: 0, color: '#374151', textAlign: 'justify', lineHeight: 1.45 }}>
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 6pt 0', color: '#111827' }}>
                  Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '10pt', color: '#111827' }}>{edu.institution}</strong>
                        <span style={{ fontSize: '8.5pt', color: '#4b5563' }}>
                          {edu.startDate} – {edu.endDate || 'Present'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#374151', fontStyle: 'italic', fontSize: '9pt' }}>
                        <span>
                          {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                        </span>
                        {edu.gpa && <span>GPA / Grade: {edu.gpa}</span>}
                      </div>
                      {edu.relevantCoursework && (
                        <div style={{ fontSize: '8.5pt', color: '#4b5563', marginTop: '2pt' }}>
                          <strong>Relevant Coursework:</strong> {edu.relevantCoursework}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 5pt 0', color: '#111827' }}>
                  Technical Skills
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3pt', fontSize: '9pt' }}>
                  {skills.map((cat) => (
                    cat.items?.length > 0 && (
                      <div key={cat.id || cat.category} style={{ color: '#374151' }}>
                        <strong style={{ color: '#111827' }}>{cat.category}: </strong>
                        {cat.items.join(', ')}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 6pt 0', color: '#111827' }}>
                  Experience & Internships
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9pt' }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '10pt', color: '#111827' }}>{exp.jobTitle}</strong>
                        <span style={{ fontSize: '8.5pt', color: '#4b5563' }}>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div style={{ fontSize: '9pt', color: '#4b5563', fontStyle: 'italic', marginBottom: '3pt' }}>
                        {exp.company} {exp.location && `• ${exp.location}`} {exp.employmentType && `(${exp.employmentType})`}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ margin: '0 0 0 16pt', padding: 0, color: '#374151', fontSize: '9pt' }}>
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '2pt', lineHeight: 1.4 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 6pt 0', color: '#111827' }}>
                  Key Projects
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div>
                          <strong style={{ fontSize: '10pt', color: '#111827' }}>{proj.title}</strong>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span style={{ fontSize: '8.5pt', color: '#4b5563', fontStyle: 'italic' }}>
                              {' '}| {proj.technologies.join(', ')}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '8.5pt', color: '#4b5563' }}>
                          {proj.startDate} {proj.endDate && `– ${proj.endDate}`}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8pt', fontSize: '8pt', margin: '2pt 0 3pt 0' }}>
                        {proj.githubUrl && (
                          <a href={getFullUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            Code Repository
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={getFullUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            Live Demo
                          </a>
                        )}
                      </div>

                      <p style={{ margin: 0, color: '#374151', fontSize: '9pt', lineHeight: 1.4 }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 5pt 0', color: '#111827' }}>
                  Certifications & Credentials
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt', fontSize: '9pt' }}>
                  {certifications.map((cert) => (
                    <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <strong style={{ color: '#111827' }}>{cert.name}</strong> — {cert.organization}
                        {cert.credentialUrl && (
                          <a href={getFullUrl(cert.credentialUrl)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '6pt', fontSize: '8pt', color: '#2563eb' }}>
                            [Verify]
                          </a>
                        )}
                      </div>
                      <span style={{ fontSize: '8.5pt', color: '#4b5563' }}>{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Honors (Optional) */}
            {optionalSections.awards && awards.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 5pt 0', color: '#111827' }}>
                  Awards & Achievements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt', fontSize: '9pt' }}>
                  {awards.map((awd) => (
                    <div key={awd.id || awd.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#111827' }}>{awd.name}</strong>
                        <span style={{ fontSize: '8.5pt', color: '#4b5563' }}>{awd.date}</span>
                      </div>
                      <div style={{ fontSize: '8.5pt', color: '#4b5563' }}>
                        {awd.issuer && `${awd.issuer} • `}
                        {awd.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages (Optional) */}
            {optionalSections.languages && languages.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1pt solid #9ca3af', paddingBottom: '2pt', margin: '0 0 5pt 0', color: '#111827' }}>
                  Languages
                </h3>
                <div style={{ fontSize: '9pt', color: '#374151' }}>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TEMPLATE 2: MODERN (Two-Tone Tech Layout with Skill Chips & Accent)
            ==================================================================== */}
        {template === 'modern' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14pt' }}>
            {/* Top Accent Header */}
            <div
              style={{
                backgroundColor: '#85325c',
                color: '#ffffff',
                margin: '-18mm -16mm 10pt -16mm',
                padding: '16mm 16mm 14mm 16mm',
                display: 'flex',
                flexDirection: 'column',
                gap: '6pt',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8pt' }}>
                <div>
                  <h1 style={{ fontSize: '22pt', fontWeight: 800, margin: 0, color: '#F7F5EC', letterSpacing: '0.02em' }}>
                    {personal.fullName || 'Your Full Name'}
                  </h1>
                  <div style={{ fontSize: '11pt', color: '#f0eada', fontWeight: 600, marginTop: '3pt' }}>
                    {personal.headline || 'Software Engineering & Computer Science'}
                  </div>
                </div>

                <div style={{ fontSize: '8.5pt', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '2pt', textAlign: 'right' }}>
                  {personal.email && (
                    <a href={`mailto:${personal.email}`} style={{ color: '#f0eada', textDecoration: 'none' }}>
                      {personal.email}
                    </a>
                  )}
                  {personal.phone && <span>{personal.phone}</span>}
                  {personal.location && <span>{personal.location}</span>}
                </div>
              </div>

              {/* Links bar */}
              <div style={{ display: 'flex', gap: '12pt', fontSize: '8.5pt', marginTop: '4pt', borderTop: '1px solid rgba(223, 214, 174, 0.25)', paddingTop: '6pt' }}>
                {personal.linkedin && (
                  <a href={getFullUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#f0eada', textDecoration: 'none' }}>
                    LinkedIn: {formatUrl(personal.linkedin)}
                  </a>
                )}
                {personal.github && (
                  <a href={getFullUrl(personal.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#f0eada', textDecoration: 'none' }}>
                    GitHub: {formatUrl(personal.github)}
                  </a>
                )}
                {personal.portfolio && (
                  <a href={getFullUrl(personal.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: '#f0eada', textDecoration: 'none' }}>
                    Portfolio: {formatUrl(personal.portfolio)}
                  </a>
                )}
              </div>
            </div>

            {/* Summary */}
            {personal.summary && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '2pt solid #f0eada', paddingBottom: '2pt', margin: '0 0 5pt 0' }}>
                  Professional Profile
                </h3>
                <p style={{ margin: 0, color: '#374151', fontSize: '9pt', lineHeight: 1.5 }}>
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Skills with Chips */}
            {skills.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '2pt solid #f0eada', paddingBottom: '2pt', margin: '0 0 6pt 0' }}>
                  Core Competencies & Technologies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                  {skills.map((cat) => (
                    cat.items?.length > 0 && (
                      <div key={cat.id || cat.category}>
                        <span style={{ fontSize: '8.5pt', fontWeight: 700, color: '#1f2937', marginRight: '6pt' }}>
                          {cat.category}:
                        </span>
                        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4pt' }}>
                          {cat.items.map((item, i) => (
                            <span
                              key={i}
                              style={{
                                display: 'inline-block',
                                fontSize: '8pt',
                                padding: '1.5pt 6pt',
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                borderRadius: 3,
                                color: '#111827',
                                fontWeight: 500,
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '2pt solid #f0eada', paddingBottom: '2pt', margin: '0 0 6pt 0' }}>
                  Internships & Work Experience
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9pt' }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '10pt', fontWeight: 700, color: '#111827' }}>
                          {exp.jobTitle} <span style={{ color: '#85325c', fontWeight: 600 }}>@ {exp.company}</span>
                        </span>
                        <span style={{ fontSize: '8.5pt', color: '#4b5563', fontWeight: 600 }}>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <div style={{ fontSize: '8pt', color: '#6b7280', marginBottom: '3pt' }}>
                          {exp.location} • {exp.employmentType}
                        </div>
                      )}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ margin: '0 0 0 14pt', padding: 0, color: '#374151', fontSize: '9pt' }}>
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '2pt', lineHeight: 1.45 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '2pt solid #f0eada', paddingBottom: '2pt', margin: '0 0 6pt 0' }}>
                  Highlighted Projects
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                  {projects.map((proj) => (
                    <div key={proj.id} style={{ borderLeft: '2pt solid #85325c', paddingLeft: '8pt' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827' }}>
                          {proj.title}
                        </span>
                        <span style={{ fontSize: '8pt', color: '#6b7280' }}>
                          {proj.startDate} {proj.endDate && `– ${proj.endDate}`}
                        </span>
                      </div>

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div style={{ fontSize: '8pt', color: '#85325c', fontWeight: 600, margin: '1pt 0 2pt 0' }}>
                          Stack: {proj.technologies.join(' • ')}
                        </div>
                      )}

                      <p style={{ margin: '2pt 0 3pt 0', color: '#374151', fontSize: '8.8pt', lineHeight: 1.4 }}>
                        {proj.description}
                      </p>

                      <div style={{ display: 'flex', gap: '8pt', fontSize: '7.8pt' }}>
                        {proj.githubUrl && (
                          <a href={getFullUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#85325c', fontWeight: 600 }}>
                            GitHub Repo ↗
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={getFullUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#85325c', fontWeight: 600 }}>
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '2pt solid #f0eada', paddingBottom: '2pt', margin: '0 0 6pt 0' }}>
                  Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '9.5pt', color: '#111827' }}>{edu.institution}</strong>
                        <span style={{ fontSize: '8.5pt', color: '#6b7280' }}>
                          {edu.startDate} – {edu.endDate || 'Present'}
                        </span>
                      </div>
                      <div style={{ fontSize: '9pt', color: '#374151' }}>
                        {edu.degree} in {edu.fieldOfStudy} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </div>
                      {edu.relevantCoursework && (
                        <div style={{ fontSize: '8pt', color: '#6b7280', marginTop: '2pt' }}>
                          Coursework: {edu.relevantCoursework}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Awards */}
            {(certifications.length > 0 || (optionalSections.awards && awards.length > 0)) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12pt' }}>
                {certifications.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '9.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '1pt solid #e5e7eb', paddingBottom: '2pt', margin: '0 0 4pt 0' }}>
                      Certifications
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt', fontSize: '8.5pt' }}>
                      {certifications.map((c) => (
                        <div key={c.id}>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: '8pt', color: '#6b7280' }}>{c.organization} ({c.date})</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optionalSections.awards && awards.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '9.5pt', fontWeight: 800, textTransform: 'uppercase', color: '#85325c', borderBottom: '1pt solid #e5e7eb', paddingBottom: '2pt', margin: '0 0 4pt 0' }}>
                      Honors & Awards
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt', fontSize: '8.5pt' }}>
                      {awards.map((a) => (
                        <div key={a.id || a.name}>
                          <strong>{a.name}</strong>
                          <div style={{ fontSize: '8pt', color: '#6b7280' }}>{a.issuer} ({a.date})</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TEMPLATE 3: MINIMAL (Monochrome, Restrained Whitespace, Clean Sans)
            ==================================================================== */}
        {template === 'minimal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14pt', fontFamily: '"Inter", -apple-system, sans-serif' }}>
            {/* Header */}
            <div>
              <h1 style={{ fontSize: '24pt', fontWeight: 900, margin: '0 0 4pt 0', letterSpacing: '-0.03em', color: '#000000' }}>
                {personal.fullName || 'Your Full Name'}
              </h1>
              {personal.headline && (
                <div style={{ fontSize: '11pt', color: '#4b5563', fontWeight: 500, marginBottom: '6pt' }}>
                  {personal.headline}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8pt', fontSize: '8.5pt', color: '#6b7280' }}>
                {personal.email && (
                  <a href={`mailto:${personal.email}`} style={{ color: '#000000', textDecoration: 'none' }}>
                    {personal.email}
                  </a>
                )}
                {personal.phone && <span>/ {personal.phone}</span>}
                {personal.location && <span>/ {personal.location}</span>}
                {personal.linkedin && (
                  <span>
                    / <a href={getFullUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>LinkedIn</a>
                  </span>
                )}
                {personal.github && (
                  <span>
                    / <a href={getFullUrl(personal.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>GitHub</a>
                  </span>
                )}
                {personal.portfolio && (
                  <span>
                    / <a href={getFullUrl(personal.portfolio)} target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }}>Portfolio</a>
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {personal.summary && (
              <div style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.5, borderLeft: '1.5pt solid #000000', paddingLeft: '8pt' }}>
                {personal.summary}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <div style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '4pt' }}>
                  Skills
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2pt', fontSize: '8.8pt', color: '#374151' }}>
                  {skills.map((cat) => (
                    cat.items?.length > 0 && (
                      <div key={cat.id || cat.category}>
                        <span style={{ fontWeight: 600, color: '#000000' }}>{cat.category}: </span>
                        {cat.items.join(' · ')}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <div style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '6pt' }}>
                  Experience
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#000000' }}>
                          {exp.jobTitle}, {exp.company}
                        </span>
                        <span style={{ fontSize: '8.5pt', color: '#6b7280' }}>
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ margin: '3pt 0 0 14pt', padding: 0, color: '#374151', fontSize: '8.8pt' }}>
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '2pt', lineHeight: 1.4 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <div style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '6pt' }}>
                  Projects
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#000000' }}>
                          {proj.title}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '8.5pt' }}>
                              {' '}— {proj.technologies.join(', ')}
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: '8pt', color: '#6b7280' }}>
                          {proj.startDate} {proj.endDate && `— ${proj.endDate}`}
                        </span>
                      </div>

                      <p style={{ margin: '2pt 0 2pt 0', color: '#374151', fontSize: '8.8pt', lineHeight: 1.4 }}>
                        {proj.description}
                      </p>

                      <div style={{ display: 'flex', gap: '8pt', fontSize: '8pt' }}>
                        {proj.githubUrl && (
                          <a href={getFullUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', textDecoration: 'underline' }}>
                            Source
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={getFullUrl(proj.liveUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', textDecoration: 'underline' }}>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <div style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '6pt' }}>
                  Education
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#000000' }}>
                          {edu.institution}
                        </span>
                        <span style={{ fontSize: '8.5pt', color: '#6b7280' }}>
                          {edu.startDate} — {edu.endDate || 'Present'}
                        </span>
                      </div>
                      <div style={{ fontSize: '8.8pt', color: '#4b5563' }}>
                        {edu.degree} in {edu.fieldOfStudy} {edu.gpa && `· GPA: ${edu.gpa}`}
                      </div>
                      {edu.relevantCoursework && (
                        <div style={{ fontSize: '8pt', color: '#6b7280', marginTop: '1pt' }}>
                          Coursework: {edu.relevantCoursework}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Awards */}
            {(certifications.length > 0 || (optionalSections.awards && awards.length > 0)) && (
              <div>
                <div style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '4pt' }}>
                  Certifications & Honors
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3pt', fontSize: '8.5pt', color: '#374151' }}>
                  {certifications.map((c) => (
                    <div key={c.id}>
                      <strong>{c.name}</strong> — {c.organization} ({c.date})
                    </div>
                  ))}
                  {optionalSections.awards && awards.map((a) => (
                    <div key={a.id || a.name}>
                      <strong>{a.name}</strong> — {a.issuer} ({a.date})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
