/**
 * Note Export & Conversion Utilities
 * Exports StudentHub notes to PDF (A4 print layout), Word (.doc), and Text (.txt),
 * plus handling downloads for WhatsApp documents & attachments.
 */

import { formatDate } from './dateUtils';

const sanitizeFilename = (name) => {
  return (name || 'Note').replace(/[/\\?%*:|"<>]/g, '_').trim().slice(0, 60);
};

/**
 * Export note as high-fidelity PDF via browser print window
 */
export const exportNoteToPdf = (note) => {
  if (!note) return;

  const title = sanitizeFilename(note.title);
  const subject = note.subject || 'General';
  const updatedDate = formatDate(note.updatedAt || note.createdAt || new Date());
  const tagsHtml =
    note.tags && note.tags.length
      ? note.tags
          .map(
            (t) =>
              `<span style="display:inline-block; font-size:11px; padding:2px 8px; border-radius:4px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; margin-right:4px;">#${t}</span>`
          )
          .join(' ')
      : '';

  const attachmentsHtml =
    note.attachments && note.attachments.length
      ? `<div style="margin-top:20px; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
          <div style="font-size:12px; font-weight:700; color:#334155; margin-bottom:6px;">📎 Attached Documents (${note.attachments.length}):</div>
          ${note.attachments
            .map(
              (att) =>
                `<div style="font-size:11px; color:#64748b; margin-bottom:3px;">• <strong>${att.name}</strong> (${Math.round((att.size || 0) / 1024)} KB)</div>`
            )
            .join('')}
         </div>`
      : '';

  // Format content paragraphs
  const safeContent = (note.content || 'No content written.')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert('Please allow popups for StudentHub to generate your PDF.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${subject} - ${title} - StudentHub Note</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 18mm 16mm 18mm 16mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 2px solid #17644D;
            margin-bottom: 18px;
          }
          .brand {
            font-size: 15px;
            font-weight: 800;
            color: #17644D;
            letter-spacing: -0.01em;
          }
          .meta-date {
            font-size: 11px;
            color: #64748b;
          }
          .badge {
            display: inline-block;
            background-color: #17644D;
            color: #F1EAD7;
            padding: 3px 10px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.03em;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.3;
            margin: 0 0 10px 0;
          }
          .content-box {
            margin-top: 18px;
            font-size: 13.5px;
            color: #334155;
            line-height: 1.7;
            word-break: break-word;
          }
          .footer-bar {
            margin-top: 36px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div class="brand">StudentHub • Academic Coursework & Notes</div>
          <div class="meta-date">Date: ${updatedDate}</div>
        </div>

        <span class="badge">${subject}</span>
        <h1 class="title">${note.title}</h1>

        ${tagsHtml ? `<div style="margin-bottom: 14px;">${tagsHtml}</div>` : ''}

        <div class="content-box">
          ${safeContent}
        </div>

        ${attachmentsHtml}

        <div class="footer-bar">
          <span>StudentHub Revision Workspace</span>
          <span>Shared peer coursework note</span>
        </div>

        <script>
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.print();
            }, 300);
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Export note as Microsoft Word document (.doc)
 * Word-compatible HTML format with XML namespace for styling
 */
export const exportNoteToWord = (note) => {
  if (!note) return;

  const title = sanitizeFilename(note.title);
  const subject = note.subject || 'General';
  const updatedDate = formatDate(note.updatedAt || note.createdAt || new Date());

  const safeContent = (note.content || 'No content written.')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  const tagsText = note.tags && note.tags.length ? note.tags.map((t) => '#' + t).join(' ') : 'None';

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${subject} - ${note.title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #1a202c;
          margin: 20mm;
        }
        h1 {
          font-size: 18pt;
          color: #17644D;
          border-bottom: 2pt solid #17644D;
          padding-bottom: 4pt;
          margin-bottom: 8pt;
        }
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16pt;
          background-color: #f8fafc;
        }
        .meta-table td {
          padding: 6pt 10pt;
          border: 1pt solid #cbd5e1;
          font-size: 10pt;
        }
        .meta-label {
          font-weight: bold;
          color: #17644D;
          width: 25%;
        }
        .content {
          font-size: 11pt;
          line-height: 1.6;
          color: #2d3748;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 30pt;
          border-top: 1pt solid #e2e8f0;
          padding-top: 8pt;
          font-size: 9pt;
          color: #718096;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>${note.title}</h1>

      <table class="meta-table">
        <tr>
          <td class="meta-label">Subject:</td>
          <td><strong>${subject}</strong></td>
        </tr>
        <tr>
          <td class="meta-label">Date:</td>
          <td>${updatedDate}</td>
        </tr>
        <tr>
          <td class="meta-label">Tags:</td>
          <td>${tagsText}</td>
        </tr>
      </table>

      <div class="content">
        ${safeContent}
      </div>

      <div class="footer">
        Generated with StudentHub • Academic Coursework & Peer Notes
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docHtml], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${subject}_${title}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export note as plain text (.txt)
 */
export const exportNoteToText = (note) => {
  if (!note) return;

  const title = sanitizeFilename(note.title);
  const subject = note.subject || 'General';
  const updatedDate = formatDate(note.updatedAt || note.createdAt || new Date());
  const tagsText = note.tags && note.tags.length ? note.tags.map((t) => '#' + t).join(' ') : 'None';

  const textContent = `========================================================
[StudentHub Note]: ${note.title}
Subject: ${subject}
Date: ${updatedDate}
Tags: ${tagsText}
========================================================

${note.content || 'No content written.'}

--------------------------------------------------------
Shared via StudentHub Academic Workspace
`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${subject}_${title}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Download a document attachment stored on a note
 */
export const downloadAttachment = (attachment) => {
  if (!attachment || !attachment.data) return;

  const a = document.createElement('a');
  a.href = attachment.data;
  a.download = attachment.name || 'document';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};