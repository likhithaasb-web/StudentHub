/**
 * Resume validation and completeness analysis utilities
 */

export const isValidEmail = (email) => {
  if (!email) return true; // Optional unless required
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidUrl = (url) => {
  if (!url) return true;
  const clean = url.trim();
  // Support either full http(s):// or domain.tld formats
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(clean);
};

export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
};

/**
 * Calculates resume completeness score and identifies missing areas.
 * Note: Clearly labeled as a completion guide, NOT a guaranteed ATS score.
 */
export const calculateResumeCompleteness = (resume) => {
  if (!resume) return { score: 0, suggestions: [] };

  let score = 0;
  const suggestions = [];

  // 1. Personal Information (25 pts)
  const personal = resume.personal || {};
  if (personal.fullName?.trim()) {
    score += 8;
  } else {
    suggestions.push({ field: 'personal.fullName', text: 'Add your full name' });
  }

  if (personal.email?.trim() && isValidEmail(personal.email)) {
    score += 5;
  } else {
    suggestions.push({ field: 'personal.email', text: 'Add a valid contact email' });
  }

  if (personal.phone?.trim()) {
    score += 4;
  } else {
    suggestions.push({ field: 'personal.phone', text: 'Add your contact phone number' });
  }

  if (personal.headline?.trim()) {
    score += 4;
  } else {
    suggestions.push({ field: 'personal.headline', text: 'Add a professional headline (e.g. CS Undergrad)' });
  }

  if (personal.location?.trim()) {
    score += 2;
  }

  if (personal.linkedin?.trim() || personal.github?.trim() || personal.portfolio?.trim()) {
    score += 2;
  } else {
    suggestions.push({ field: 'personal.links', text: 'Add LinkedIn or GitHub profile link' });
  }

  // 2. Professional Summary (15 pts)
  if (personal.summary?.trim() && personal.summary.trim().length > 40) {
    score += 15;
  } else {
    suggestions.push({ field: 'personal.summary', text: 'Write a 2-3 sentence professional summary' });
  }

  // 3. Education (20 pts)
  const education = resume.education || [];
  if (education.length > 0 && education[0].institution?.trim() && education[0].degree?.trim()) {
    score += 20;
  } else {
    suggestions.push({ field: 'education', text: 'Add your university degree and institution' });
  }

  // 4. Skills (15 pts)
  const skills = resume.skills || [];
  const totalSkillsCount = skills.reduce((count, cat) => count + (cat.items?.length || 0), 0);
  if (totalSkillsCount >= 6) {
    score += 15;
  } else if (totalSkillsCount > 0) {
    score += 8;
    suggestions.push({ field: 'skills', text: 'Add at least 6 technical skills across categories' });
  } else {
    suggestions.push({ field: 'skills', text: 'Add programming languages, frameworks, or tools' });
  }

  // 5. Projects & Experience (20 pts)
  const projects = resume.projects || [];
  const experience = resume.experience || [];

  if (projects.length >= 2 || (projects.length >= 1 && experience.length >= 1)) {
    score += 20;
  } else if (projects.length === 1 || experience.length === 1) {
    score += 12;
    suggestions.push({ field: 'projects', text: 'Add a second key project or internship to highlight experience' });
  } else {
    suggestions.push({ field: 'projects', text: 'Add at least one academic or personal project' });
  }

  // 6. Certifications / Achievements (5 pts bonus up to 100)
  const certs = resume.certifications || [];
  if (certs.length > 0) {
    score += 5;
  }

  const normalizedScore = Math.min(100, Math.max(0, score));

  return {
    score: normalizedScore,
    suggestions,
    isComplete: normalizedScore >= 80,
  };
};
