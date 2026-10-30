import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * High-performance, dependency-free Markdown & Code block renderer
 * Parses headers, bold, italics, lists, blockquotes, inline code, and syntax-styled code blocks
 * with 1-click "Copy Code" functionality and KaTeX-styled math notation.
 */
const CodeBlock = ({ language = '', code = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '0.85rem 0',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Code Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 0.85rem',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          fontSize: '0.75rem',
          color: '#94a3b8',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopyCode}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? '#34d399' : '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            padding: '0.15rem 0.4rem',
            borderRadius: 3,
          }}
          title="Copy code to clipboard"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Code Content */}
      <pre
        style={{
          margin: 0,
          padding: '0.85rem 1rem',
          overflowX: 'auto',
          fontSize: '0.825rem',
          lineHeight: 1.6,
          color: '#e2e8f0',
          fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer = ({ content = '' }) => {
  if (!content) return null;

  // Split content by code blocks first
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'text', value: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.substring(lastIndex) });
  }

  // Helper to format inline bold, italic, code, and links
  const formatInlineText = (text) => {
    // Math block $$...$$
    let formatted = text.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-display">$1</div>');
    // Inline math $...$
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, '<span class="math-inline">$1</span>');

    // Inline code `...`
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code style="background-color:rgba(23, 100, 77,0.12); color:var(--primary); padding:0.15rem 0.4rem; border-radius:4px; font-size:0.85em; font-family:monospace; border:1px solid rgba(23, 100, 77,0.2); font-weight:600;">$1</code>'
    );

    // Bold **...**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--text-primary); font-weight:700;">$1</strong>');

    // Italic *...* or _..._
    formatted = formatted.replace(/(?:^|[^*])\*([^*]+)\*(?:[^*]|$)/g, ' <em>$1</em> ');
    formatted = formatted.replace(/(?:^|[^_])_([^_]+)_(?:[^_]|$)/g, ' <em>$1</em> ');

    return formatted;
  };

  // Render non-code text blocks (headers, lists, blockquotes, paragraphs)
  const renderTextBlock = (textValue, blockIdx) => {
    const lines = textValue.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null; // 'ul' | 'ol'

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ol') {
          elements.push(
            <ol key={`ol-${elements.length}`} style={{ margin: '0.45rem 0 0.75rem 1.25rem', paddingLeft: 0, lineHeight: 1.65 }}>
              {currentList.map((li, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }} dangerouslySetInnerHTML={{ __html: formatInlineText(li) }} />
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`} style={{ margin: '0.45rem 0 0.75rem 1.25rem', paddingLeft: 0, listStyleType: 'disc', lineHeight: 1.65 }}>
              {currentList.map((li, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }} dangerouslySetInnerHTML={{ __html: formatInlineText(li) }} />
              ))}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Horizontal Divider ---
      if (trimmed === '---' || trimmed === '***') {
        flushList();
        elements.push(
          <hr
            key={`hr-${idx}`}
            style={{
              margin: '1.25rem 0',
              border: 'none',
              borderTop: '1px solid var(--border-subtle)',
            }}
          />
        );
        return;
      }

      // Headers ### or #### or ##
      if (trimmed.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4
            key={`h4-${idx}`}
            style={{
              fontSize: '0.975rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '1rem 0 0.4rem 0',
            }}
            dangerouslySetInnerHTML={{ __html: formatInlineText(trimmed.replace(/^####\s+/, '')) }}
          />
        );
        return;
      }
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3
            key={`h3-${idx}`}
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '1.25rem 0 0.5rem 0',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.35rem',
            }}
            dangerouslySetInnerHTML={{ __html: formatInlineText(trimmed.replace(/^###\s+/, '')) }}
          />
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2
            key={`h2-${idx}`}
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: '1.4rem 0 0.6rem 0',
            }}
            dangerouslySetInnerHTML={{ __html: formatInlineText(trimmed.replace(/^##\s+/, '')) }}
          />
        );
        return;
      }

      // Blockquotes >
      if (trimmed.startsWith('>')) {
        flushList();
        elements.push(
          <blockquote
            key={`bq-${idx}`}
            style={{
              margin: '0.75rem 0',
              padding: '0.65rem 1rem',
              borderLeft: '3px solid var(--primary)',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontStyle: 'italic',
            }}
            dangerouslySetInnerHTML={{ __html: formatInlineText(trimmed.replace(/^>\s*/, '')) }}
          />
        );
        return;
      }

      // Unordered lists - or *
      if (/^[-*]\s+/.test(trimmed)) {
        if (listType !== 'ul') flushList();
        listType = 'ul';
        currentList.push(trimmed.replace(/^[-*]\s+/, ''));
        return;
      }

      // Ordered lists 1. 2.
      if (/^\d+\.\s+/.test(trimmed)) {
        if (listType !== 'ol') flushList();
        listType = 'ol';
        currentList.push(trimmed.replace(/^\d+\.\s+/, ''));
        return;
      }

      // Regular line / paragraph
      flushList();
      if (trimmed.length > 0) {
        elements.push(
          <p
            key={`p-${idx}`}
            style={{ margin: '0.45rem 0', lineHeight: 1.65, fontSize: '0.9rem' }}
            dangerouslySetInnerHTML={{ __html: formatInlineText(trimmed) }}
          />
        );
      }
    });

    flushList();
    return <div key={`text-block-${blockIdx}`}>{elements}</div>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={`code-${index}`} language={part.language} code={part.value} />;
        }
        return renderTextBlock(part.value, index);
      })}
    </div>
  );
};

export default MarkdownRenderer;