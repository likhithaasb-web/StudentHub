import React from 'react';
import { Check, FileText, Layers, Feather } from 'lucide-react';

export const TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    badge: 'ATS-Friendly',
    icon: FileText,
    description: 'Traditional single-column layout with standard headings and clear divider lines. Best for corporate & campus placements.',
    tags: ['Single Column', 'High ATS Parsing', 'Standard Serif/Sans'],
    previewColors: { header: '#111827', accent: '#374151', bg: '#ffffff' },
  },
  {
    id: 'modern',
    name: 'Modern',
    badge: 'Recommended',
    icon: Layers,
    description: 'Contemporary design featuring clean skill chips, prominent headers, and a subtle accent color. Perfect for tech & product roles.',
    tags: ['Tech & Startups', 'Skill Chips', 'Accent Highlights'],
    previewColors: { header: '#274245', accent: '#DFD6AE', bg: '#f9fafb' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    badge: 'Monochrome',
    icon: Feather,
    description: 'Clean black-and-white typography with generous whitespace and restrained formatting. Timeless and distraction-free.',
    tags: ['Monochrome', 'Maximum Whitespace', 'Elegant Sans'],
    previewColors: { header: '#000000', accent: '#4b5563', bg: '#ffffff' },
  },
];

const ResumeTemplateSelector = ({ selectedTemplate = 'professional', onSelectTemplate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          const Icon = tpl.icon;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              style={{
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'rgba(223, 214, 174, 0.12)' : 'var(--bg-card)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 16px rgba(223, 214, 174, 0.15)' : 'var(--shadow-sm)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header: Name, Badge, Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {tpl.name}
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        {tpl.badge}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--text-inverse)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                  {tpl.description}
                </p>

                {/* Visual Mini Preview Representation */}
                <div
                  style={{
                    height: 52,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: tpl.previewColors.bg,
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ width: '45%', height: 6, backgroundColor: tpl.previewColors.header, borderRadius: 2 }} />
                  <div style={{ width: '85%', height: 3, backgroundColor: tpl.previewColors.accent, borderRadius: 1 }} />
                  <div style={{ width: '100%', height: 1, backgroundColor: '#e5e7eb', margin: '2px 0' }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ width: '60%', height: 16, backgroundColor: '#f3f4f6', borderRadius: 2 }} />
                    <div style={{ width: '35%', height: 16, backgroundColor: '#f3f4f6', borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                {tpl.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;
