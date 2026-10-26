/**
 * High-fidelity A4 PDF export and print utilities for StudentHub Resumes
 * Ensures selectable text, crisp typography, and ATS parser readability.
 */

export const printResume = (resumeElementId, resumeTitle = 'Resume') => {
  const element = document.getElementById(resumeElementId);
  if (!element) {
    console.error(`Resume element with ID "${resumeElementId}" not found for export.`);
    window.print();
    return;
  }

  // Backup original document title for the default PDF filename
  const originalTitle = document.title;
  const cleanTitle = resumeTitle.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Resume';
  document.title = `${cleanTitle} - StudentHub`;

  // Apply print isolation class to body
  document.body.classList.add('printing-resume-active');

  const cleanup = () => {
    document.body.classList.remove('printing-resume-active');
    document.title = originalTitle;
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup, { once: true });

  // Small delay to allow CSS transitions / render to settle
  setTimeout(() => {
    window.print();
    // Safety fallback cleanup in case afterprint doesn't fire in certain browsers
    setTimeout(cleanup, 2000);
  }, 100);
};

/**
 * Alternative export: Opens an isolated print preview window containing strictly the resume document
 */
export const openResumePrintWindow = (resumeElementId, resumeTitle = 'Resume') => {
  const element = document.getElementById(resumeElementId);
  if (!element) {
    printResume(resumeElementId, resumeTitle);
    return;
  }

  const printWindow = window.open('', '_blank', 'width=840,height=1000');
  if (!printWindow) {
    // Popup blocked: fallback to in-page print
    printResume(resumeElementId, resumeTitle);
    return;
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${resumeTitle} - StudentHub</title>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html, body {
            background-color: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .resume-paper {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.print();
            }, 250);
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
