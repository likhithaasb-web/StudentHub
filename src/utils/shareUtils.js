/**
 * Utility functions for sharing StudentHub notes and coursework
 * Supports WhatsApp direct sharing, markdown formatting, and public link generation.
 */

export const getNoteShareUrl = (noteId) => {
  const origin = window.location.origin;
  return `${origin}/notes/share/${noteId}`;
};

export const formatNoteForWhatsApp = (note) => {
  const shareUrl = getNoteShareUrl(note.id || note._id);
  const tagsText = note.tags && note.tags.length ? `\n🏷️ *Tags:* ${note.tags.map((t) => '#' + t).join(' ')}` : '';

  let body = (note.content || 'No content written.').trim();
  // Keep message size reasonable for WhatsApp URL character limits
  if (body.length > 500) {
    body = body.slice(0, 500) + '...\n_(Full note available on the link below)_';
  }

  return `📝 *[StudentHub Note]*: *${note.title.trim()}*
📚 *Subject:* ${note.subject}${tagsText}

📖 *Content:*
${body}

🔗 *Read & revise full note online:*
${shareUrl}
✨ _Shared from StudentHub_`;
};

export const shareNoteToWhatsApp = (note) => {
  if (!note) return;
  const message = formatNoteForWhatsApp(note);
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

  try {
    const win = window.open(whatsappUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
  } catch (err) {
    window.location.href = whatsappUrl;
  }
};

export const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
