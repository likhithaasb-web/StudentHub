/**
 * Client-Side Document Reader & Text Extractor
 * Extracts readable coursework text from PDFs, Word docs, Markdown, text, and images
 */

export const extractTextFromDocument = async (file) => {
  if (!file) return { name: '', text: '', size: 0, type: '' };

  const name = file.name;
  const size = file.size;
  const type = file.type || '';
  const extension = name.split('.').pop().toLowerCase();

  // 1. Plaintext & Markdown Files
  if (type.includes('text') || ['txt', 'md', 'json', 'csv', 'py', 'java', 'cpp', 'c', 'js', 'html', 'css'].includes(extension)) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name,
          size,
          type,
          text: e.target.result || '',
        });
      };
      reader.onerror = () => resolve({ name, size, type, text: '' });
      reader.readAsText(file);
    });
  }

  // 2. Word Documents (.docx)
  if (extension === 'docx') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = new TextDecoder('utf-8').decode(e.target.result);
          // Extract text from <w:t> tags
          const matches = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
          if (matches && matches.length > 0) {
            const extracted = matches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ');
            return resolve({ name, size, type, text: extracted });
          }
        } catch (err) {
          // fallback
        }
        resolve({
          name,
          size,
          type,
          text: `[Word Document: ${name}] - Please ask any question or request a summary regarding this coursework file.`,
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // 3. PDF Files (.pdf)
  if (extension === 'pdf') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const latin = new TextDecoder('latin1').decode(e.target.result);
          // Look for text in BT ... ET blocks
          const blocks = latin.match(/BT[\s\S]*?ET/g);
          if (blocks && blocks.length > 0) {
            let extracted = '';
            for (const block of blocks) {
              const matches = block.match(/\((.*?)\)\s*Tj/g) || block.match(/\[(.*?)\]\s*TJ/g);
              if (matches) {
                extracted += matches.map((m) => m.replace(/[\(\)\[\]]|Tj|TJ/g, '').trim()).join(' ') + '\n';
              }
            }
            if (extracted.trim().length > 50) {
              return resolve({ name, size, type, text: extracted.slice(0, 20000) });
            }
          }

          // Fallback: search for printable ASCII sequences
          const clean = latin.replace(/[^ -~\n\r\t]/g, ' ').replace(/\s{2,}/g, ' ');
          if (clean.trim().length > 100) {
            return resolve({ name, size, type, text: clean.slice(0, 15000) });
          }
        } catch (err) {
          // fallback
        }

        resolve({
          name,
          size,
          type,
          text: `[PDF Coursework Document: ${name} (${Math.round(size / 1024)} KB)]`,
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // 4. Images (.png, .jpg, .jpeg)
  if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name,
          size,
          type,
          dataUrl: e.target.result,
          text: `[Uploaded Image / Handwritten Notes: ${name}]`,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Generic fallback
  return {
    name,
    size,
    type,
    text: `[Coursework File: ${name}]`,
  };
};