/**
 * Dedicated LocalStorage persistence for Career Studio & Resume Builder
 */

import { storage, generateId } from './storage';

const RESUMES_STORAGE_KEY = 'resumes';

export const DEFAULT_DEMO_RESUME = {
  id: 'resume-demo-1',
  shareId: 'alex-morgan-preview',
  title: 'Software Engineering & Cloud Internship',
  targetRole: 'Full Stack / Cloud Intern',
  template: 'professional', // 'professional' | 'modern' | 'minimal'
  createdAt: '2026-10-15',
  updatedAt: new Date().toISOString(),

  personal: {
    fullName: 'Alex Morgan',
    headline: 'Computer Science Undergrad | Aspiring Full Stack & Cloud Engineer',
    email: 'alex.morgan@university.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan-cs',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.dev',
    summary:
      'Proactive Computer Science undergraduate with hands-on experience in full-stack web development, network protocols, and distributed systems. Built production-ready microservices and automated student productivity tools; eager to contribute solid algorithms problem-solving and clean code to a fast-moving engineering team.',
  },

  education: [
    {
      id: 'edu-1',
      institution: 'State Tech University',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2023-08',
      endDate: '2027-05',
      gpa: '3.86 / 4.0',
      relevantCoursework: 'Computer Networks, Machine Learning, Optimization Techniques, REST APIs, Database Systems',
    },
  ],

  skills: [
    {
      id: 'skill-cat-1',
      category: 'Programming Languages',
      items: ['JavaScript (ES6+)', 'Python', 'C++', 'Java', 'SQL', 'TypeScript'],
    },
    {
      id: 'skill-cat-2',
      category: 'Frontend Technologies',
      items: ['React.js', 'Vite', 'HTML5/CSS3', 'Tailwind CSS', 'Recharts'],
    },
    {
      id: 'skill-cat-3',
      category: 'Backend & APIs',
      items: ['Node.js', 'Express', 'FastAPI', 'RESTful APIs', 'JWT Auth'],
    },
    {
      id: 'skill-cat-4',
      category: 'Databases & Tools',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'Git / GitHub', 'Docker', 'Postman'],
    },
    {
      id: 'skill-cat-5',
      category: 'Core Competencies',
      items: ['Data Structures & Algorithms', 'System Architecture', 'Agile / Scrum', 'Technical Writing'],
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'StudentHub — All-in-One Academic Productivity Suite',
      description:
        'Architected and implemented a high-performance productivity platform for university students featuring automated attendance forecast calculators, interactive timetables, and local data persistence.',
      technologies: ['React 18', 'Vite', 'Recharts', 'CSS Modules', 'LocalStorage API'],
      githubUrl: 'https://github.com/alexmorgan/studenthub',
      liveUrl: 'https://studenthub-preview.app',
      startDate: '2026-08',
      endDate: '2026-10',
    },
    {
      id: 'proj-2',
      title: 'Real-Time Network Packet Flow Analyzer',
      description:
        'Engineered a lightweight packet capture daemon monitoring TCP stream handshakes, packet round-trip times, and sliding-window packet loss with Wireshark trace parsing.',
      technologies: ['Python', 'Scapy', 'FastAPI', 'Chart.js', 'WebSockets'],
      githubUrl: 'https://github.com/alexmorgan/packet-flow-analyzer',
      liveUrl: '',
      startDate: '2026-05',
      endDate: '2026-07',
    },
    {
      id: 'proj-3',
      title: 'Predictive Customer Churn Classifier',
      description:
        'Developed end-to-end Machine Learning pipeline comparing Logistic Regression and Random Forest models across 50,000+ records, achieving 91.4% ROC-AUC score after hyperparameter tuning.',
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
      githubUrl: 'https://github.com/alexmorgan/churn-ml-classifier',
      liveUrl: '',
      startDate: '2026-02',
      endDate: '2026-04',
    },
  ],

  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Software Engineering Intern',
      company: 'Apex Cloud Solutions',
      location: 'San Francisco, CA (Remote)',
      employmentType: 'Internship',
      startDate: '2026-05',
      endDate: '2026-08',
      current: false,
      bullets: [
        'Engineered 8+ reusable React UI components and optimized client-side state handling, decreasing page load times by 24%.',
        'Implemented secure REST endpoints in Node.js with token refresh rotation and sliding-window rate limiting.',
        'Collaborated with senior engineers in bi-weekly agile sprints, Git code reviews, and automated CI/CD validation tests.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Undergraduate Teaching Assistant — Computer Networks',
      company: 'State Tech University',
      location: 'Campus',
      employmentType: 'Part-time',
      startDate: '2026-01',
      endDate: '2026-05',
      current: false,
      bullets: [
        'Mentored 45+ students through socket programming and subnet CIDR lab exercises in weekly review sessions.',
        'Authored cheatsheets and review materials for midterm examinations, raising class lab pass rate to 93%.',
      ],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      organization: 'Amazon Web Services',
      date: '2026-04',
      credentialUrl: 'https://aws.amazon.com/verification',
      description: 'Cloud fundamentals, AWS core compute/storage architecture, and security compliance.',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      organization: 'Coursera / Meta',
      date: '2025-12',
      credentialUrl: 'https://coursera.org/verify',
      description: 'Comprehensive 9-course specialization covering advanced React, responsive UI design, and web APIs.',
    },
  ],

  optionalSections: {
    coursework: true,
    languages: true,
    awards: true,
    extracurricular: false,
    publications: false,
    volunteer: false,
  },

  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native / Fluent' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' },
  ],

  awards: [
    {
      id: 'awd-1',
      name: '1st Place Winner — Inter-Collegiate Hackathon 2026',
      issuer: 'Tech Consortium',
      date: '2026-03',
      description: 'Built a real-time collaborative code review web tool for student developer teams in 36 hours.',
    },
    {
      id: 'awd-2',
      name: 'Dean’s Academic Honors List',
      issuer: 'State Tech University',
      date: '2024 - 2026',
      description: 'Awarded for maintaining top 5% academic standing in Computer Science cohort across semesters.',
    },
  ],

  sectionOrder: [
    'personal',
    'summary',
    'education',
    'skills',
    'experience',
    'projects',
    'certifications',
    'awards',
    'languages',
  ],
};

export const createBlankResume = (title = 'Untitled Resume', template = 'professional') => {
  return {
    id: generateId(),
    shareId: 'r-' + Math.random().toString(36).substring(2, 9),
    title: title.trim() || 'Untitled Resume',
    targetRole: '',
    template,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
    personal: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: '',
    },
    education: [
      {
        id: generateId(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
        relevantCoursework: '',
      },
    ],
    skills: [
      {
        id: generateId(),
        category: 'Programming Languages',
        items: [],
      },
      {
        id: generateId(),
        category: 'Frameworks & Tools',
        items: [],
      },
    ],
    projects: [],
    experience: [],
    certifications: [],
    optionalSections: {
      coursework: false,
      languages: false,
      awards: false,
      extracurricular: false,
      publications: false,
      volunteer: false,
    },
    languages: [],
    awards: [],
    sectionOrder: [
      'personal',
      'summary',
      'education',
      'skills',
      'experience',
      'projects',
      'certifications',
      'awards',
      'languages',
    ],
  };
};

export const resumeStorage = {
  getResumes: () => {
    const list = storage.get(RESUMES_STORAGE_KEY, null);
    if (Array.isArray(list) && list.length > 0) {
      // Ensure all resumes have a valid shareId
      let modified = false;
      const normalized = list.map((r) => {
        if (!r.shareId) {
          modified = true;
          return { ...r, shareId: 'r-' + Math.random().toString(36).substring(2, 9) };
        }
        return r;
      });
      if (modified) {
        storage.set(RESUMES_STORAGE_KEY, normalized);
      }
      return normalized;
    }
    // Seed with initial demo resume
    const seeded = [DEFAULT_DEMO_RESUME];
    storage.set(RESUMES_STORAGE_KEY, seeded);
    return seeded;
  },

  getResumeById: (id) => {
    const list = resumeStorage.getResumes();
    return list.find((r) => r.id === id) || null;
  },

  saveResume: (resume) => {
    if (!resume || !resume.id) return null;
    const list = resumeStorage.getResumes();
    const existingIndex = list.findIndex((r) => r.id === resume.id);
    const updatedResume = {
      ...resume,
      shareId: resume.shareId || 'r-' + Math.random().toString(36).substring(2, 9),
      updatedAt: new Date().toISOString(),
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = updatedResume;
    } else {
      updatedList = [updatedResume, ...list];
    }

    storage.set(RESUMES_STORAGE_KEY, updatedList);
    return updatedResume;
  },

  deleteResume: (id) => {
    const list = resumeStorage.getResumes();
    const updatedList = list.filter((r) => r.id !== id);
    storage.set(RESUMES_STORAGE_KEY, updatedList);
    return updatedList;
  },

  duplicateResume: (id) => {
    const target = resumeStorage.getResumeById(id);
    if (!target) return null;

    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: generateId(),
      shareId: 'r-' + Math.random().toString(36).substring(2, 9),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    const list = resumeStorage.getResumes();
    const updatedList = [copy, ...list];
    storage.set(RESUMES_STORAGE_KEY, updatedList);
    return copy;
  },

  restoreDemoResumes: () => {
    const list = [DEFAULT_DEMO_RESUME];
    storage.set(RESUMES_STORAGE_KEY, list);
    return list;
  },

  clearAllResumes: () => {
    storage.set(RESUMES_STORAGE_KEY, []);
    return [];
  },
};
