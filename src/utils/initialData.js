/**
 * Realistic initial demo data for StudentHub
 * Updated for the core student subjects: CN, MFEF, TRAINING, OT, API, ML
 * Includes individual class attendance records, subjects, timetable, tasks, exams, and notes.
 */

import { getTodayDateString } from './dateUtils';

const today = new Date();

export const getRelativeDate = (offsetDays) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_SETTINGS = {
  studentName: 'Alex Morgan',
  email: 'alex@university.edu',
  collegeName: 'State Tech University',
  targetAttendance: 75,
  dailyStudyGoalMinutes: 120, // 2 hours
  theme: 'dark',
};

// 6 Core Academic Subjects requested by student
export const INITIAL_ATTENDANCE_SUBJECTS = [
  {
    id: 'sub-cn',
    name: 'CN',
    fullName: 'Computer Networks',
    color: '#85325c', // Yellow Sapling
  },
  {
    id: 'sub-mfef',
    name: 'MFEF',
    fullName: 'Mathematical Foundations of Economics & Finance',
    color: '#67e8f9', // Cyan
  },
  {
    id: 'sub-training',
    name: 'TRAINING',
    fullName: 'Technical & Placement Training',
    color: '#34d399', // Emerald
  },
  {
    id: 'sub-ot',
    name: 'OT',
    fullName: 'Optimization Techniques',
    color: '#f59e0b', // Amber
  },
  {
    id: 'sub-api',
    name: 'API',
    fullName: 'API Development & Web Services',
    color: '#a78bfa', // Purple
  },
  {
    id: 'sub-ml',
    name: 'ML',
    fullName: 'Machine Learning',
    color: '#f87171', // Coral / Red
  },
];

// Helper to build realistic class session logs
const buildSubjectRecords = (subject, dates, absentIndices, notesMap = {}) => {
  return dates.map((date, idx) => {
    const isAbsent = absentIndices.includes(idx);
    return {
      id: `rec-${subject.toLowerCase()}-${idx + 1}`,
      subject,
      date,
      status: isAbsent ? 'Absent' : 'Present',
      notes: notesMap[idx] || (isAbsent ? 'Missed due to health / travel' : 'Attended regular lecture'),
      createdAt: date,
    };
  });
};

// Dates for recent classes across the last 30 days
const makeDateList = (count, startOffset = -28) => {
  const dates = [];
  let dayOffset = startOffset;
  while (dates.length < count && dayOffset <= 0) {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    const dayOfWeek = d.getDay();
    // Monday (1) to Saturday (6)
    if (dayOfWeek >= 1 && dayOfWeek <= 6) {
      dates.push(getRelativeDate(dayOffset));
    }
    dayOffset++;
  }
  // Fill any remaining with recent days
  while (dates.length < count) {
    dates.push(getRelativeDate(-Math.floor(Math.random() * 25)));
  }
  return dates.sort();
};

const cnDates = makeDateList(24, -28);
const mfefDates = makeDateList(20, -26);
const trainingDates = makeDateList(18, -25);
const otDates = makeDateList(22, -27);
const apiDates = makeDateList(16, -24);
const mlDates = makeDateList(25, -29);

export const INITIAL_ATTENDANCE_RECORDS = [
  // CN: 24 held, 21 present, 3 absent (87.5% - Safe)
  ...buildSubjectRecords('CN', cnDates, [4, 11, 18], {
    0: 'OSI Reference Model & TCP/IP stack overview',
    3: 'Data Link Layer framing and error detection',
    4: 'Absent: Sick leave during HDLC protocol lecture',
    7: 'Subnet masking and CIDR notation exercises',
    11: 'Absent: Commute delay during Distance Vector routing lecture',
    14: 'Wireshark packet capture & TCP 3-way handshake analysis',
    18: 'Absent: Doctor appointment',
    21: 'DNS hierarchical architecture and lookup process',
    23: 'HTTP/2 multiplexing vs HTTP/3 QUIC protocol analysis',
  }),

  // MFEF: 20 held, 14 present, 6 absent (70.0% - Shortage: Needs 4 consecutive classes to reach 75%)
  ...buildSubjectRecords('MFEF', mfefDates, [2, 5, 9, 13, 16, 19], {
    0: 'Continuous compounding and time value of money',
    2: 'Absent: College sports tournament',
    5: 'Absent: Project review overlap',
    8: 'Utility theory and risk aversion functions',
    9: 'Absent: Family function',
    12: 'Black-Scholes option pricing partial differential equations',
    13: 'Absent: Late entry not permitted by professor',
    16: 'Absent: Fever',
    18: 'Capital Asset Pricing Model (CAPM) and Beta calculations',
    19: 'Absent: Placement prep conflict',
  }),

  // TRAINING: 18 held, 18 present, 0 absent (100.0% - Perfect)
  ...buildSubjectRecords('TRAINING', trainingDates, [], {
    0: 'Quantitative Aptitude: Permutations, Combinations & Probability',
    3: 'Data Structures practice: Binary Trees & Heaps on LeetCode',
    6: 'System Design 101: Load balancers and database caching',
    9: 'Mock Technical Interview: Live coding round & feedback',
    12: 'Aptitude: Time, Speed & Distance shortcut tricks',
    15: 'HR behavioral round questions using STAR methodology',
    17: 'Full-length company simulation test & score analysis',
  }),

  // OT: 22 held, 17 present, 5 absent (77.3% - On Margin)
  ...buildSubjectRecords('OT', otDates, [3, 8, 12, 17, 20], {
    0: 'Linear Programming problem formulation & graphical method',
    3: 'Absent: Transportation delay',
    6: 'Simplex algorithm: Pivot selection and tableau updates',
    8: 'Absent: Lab clash',
    11: 'Two-Phase simplex method and Big-M penalty formulation',
    12: 'Absent: Severe headache',
    15: 'Duality theory and economic interpretation of shadow prices',
    17: 'Absent: Attending college hackathon',
    20: 'Absent: Personal leave',
    21: 'Transportation problem: Vogel’s Approximation Method (VAM)',
  }),

  // API: 16 held, 14 present, 2 absent (87.5% - Safe)
  ...buildSubjectRecords('API', apiDates, [5, 12], {
    0: 'REST architectural constraints and HTTP verbs idempotency',
    3: 'Request validation and JSON schema definitions',
    5: 'Absent: Internet outage during online lab',
    8: 'JWT access token creation and refresh token rotation',
    11: 'OpenAPI 3.0 specification & Swagger UI documentation',
    12: 'Absent: Out of station',
    14: 'Rate limiting with Redis sliding-window algorithm',
    15: 'CORS policies, security headers, and API gateway routing',
  }),

  // ML: 25 held, 16 present, 9 absent (64.0% - Shortage: Needs 11 consecutive classes to reach 75%)
  ...buildSubjectRecords('ML', mlDates, [1, 4, 7, 10, 13, 16, 18, 21, 23], {
    0: 'Supervised vs Unsupervised learning taxonomy',
    1: 'Absent: Missed morning bus',
    3: 'Cost functions and Gradient Descent optimization convergence',
    4: 'Absent: Hackathon deadline crunch',
    7: 'Absent: Lab preparation',
    9: 'Decision Trees: Gini Impurity and Information Gain',
    10: 'Absent: Dental appointment',
    13: 'Absent: Overdue assignment completion',
    15: 'Support Vector Machines: Linear vs RBF Kernel trick',
    16: 'Absent: Family emergency',
    18: 'Absent: Heavy rain commute blockage',
    20: 'Ensemble Learning: Random Forest bagging and feature subsampling',
    21: 'Absent: Sick leave',
    23: 'Absent: Placement mock test',
    24: 'Model evaluation: Precision, Recall, F1 score and ROC-AUC curve',
  }),
];

// Computed initial subject summaries for backward compatibility and fast rendering
export const INITIAL_ATTENDANCE = [
  {
    id: 'sub-cn',
    subject: 'CN',
    fullName: 'Computer Networks',
    held: 24,
    attended: 21,
    absent: 3,
    color: '#85325c',
  },
  {
    id: 'sub-mfef',
    subject: 'MFEF',
    fullName: 'Mathematical Foundations of Economics & Finance',
    held: 20,
    attended: 14,
    absent: 6,
    color: '#67e8f9',
  },
  {
    id: 'sub-training',
    subject: 'TRAINING',
    fullName: 'Technical & Placement Training',
    held: 18,
    attended: 18,
    absent: 0,
    color: '#34d399',
  },
  {
    id: 'sub-ot',
    subject: 'OT',
    fullName: 'Optimization Techniques',
    held: 22,
    attended: 17,
    absent: 5,
    color: '#f59e0b',
  },
  {
    id: 'sub-api',
    subject: 'API',
    fullName: 'API Development & Web Services',
    held: 16,
    attended: 14,
    absent: 2,
    color: '#a78bfa',
  },
  {
    id: 'sub-ml',
    subject: 'ML',
    fullName: 'Machine Learning',
    held: 25,
    attended: 16,
    absent: 9,
    color: '#f87171',
  },
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Wireshark Packet Analysis Lab Report',
    description: 'Capture TCP 3-way handshakes, analyze sequence numbers, and submit report on packet loss.',
    subject: 'CN',
    dueDate: getRelativeDate(2),
    priority: 'High',
    status: 'In Progress',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-2',
    title: 'Continuous Compounding & Bond Pricing Models',
    description: 'Complete problem set 4 on term structure of interest rates and Black-Scholes equations.',
    subject: 'MFEF',
    dueDate: getRelativeDate(1), // Tomorrow
    priority: 'High',
    status: 'Pending',
    createdAt: getRelativeDate(-3),
  },
  {
    id: 'task-3',
    title: 'Solve 10 LeetCode Trees & Graphs Problems',
    description: 'Practice DFS, BFS, and Dijkstra for the upcoming on-campus recruitment test.',
    subject: 'TRAINING',
    dueDate: getRelativeDate(0), // Today
    priority: 'Medium',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-4',
    title: 'Simplex Dual Formulation & Sensitivity Analysis',
    description: 'Solve the 4-variable manufacturing optimization problem with dual simplex tableau.',
    subject: 'OT',
    dueDate: getRelativeDate(4),
    priority: 'Medium',
    status: 'Pending',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-5',
    title: 'JWT Auth & Rate Limiting Middleware Implementation',
    description: 'Implement token refresh rotation and sliding-window rate limiting in FastAPI/Express.',
    subject: 'API',
    dueDate: getRelativeDate(6),
    priority: 'Low',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-6',
    title: 'Hyperparameter Tuning for Random Forest Model',
    description: 'Run grid search on max_depth, n_estimators, and evaluate ROC-AUC on test dataset.',
    subject: 'ML',
    dueDate: getRelativeDate(-1), // Overdue to demo overdue styling!
    priority: 'High',
    status: 'Pending',
    createdAt: getRelativeDate(-4),
  },
];

export const INITIAL_TIMETABLE = [
  {
    id: 'tt-1',
    day: 'Monday',
    subject: 'CN',
    classroom: 'Room 302',
    startTime: '09:00',
    endTime: '10:30',
    color: '#85325c',
  },
  {
    id: 'tt-2',
    day: 'Monday',
    subject: 'MFEF',
    classroom: 'Hall 4',
    startTime: '11:00',
    endTime: '12:30',
    color: '#67e8f9',
  },
  {
    id: 'tt-3',
    day: 'Monday',
    subject: 'ML',
    classroom: 'AI Lab 2',
    startTime: '14:00',
    endTime: '15:30',
    color: '#f87171',
  },
  {
    id: 'tt-4',
    day: 'Tuesday',
    subject: 'OT',
    classroom: 'Room 205',
    startTime: '09:30',
    endTime: '11:00',
    color: '#f59e0b',
  },
  {
    id: 'tt-5',
    day: 'Tuesday',
    subject: 'API',
    classroom: 'Web Dev Lab',
    startTime: '11:30',
    endTime: '13:00',
    color: '#a78bfa',
  },
  {
    id: 'tt-6',
    day: 'Tuesday',
    subject: 'TRAINING',
    classroom: 'Auditorium',
    startTime: '14:00',
    endTime: '16:00',
    color: '#34d399',
  },
  {
    id: 'tt-7',
    day: 'Wednesday',
    subject: 'CN',
    classroom: 'Room 302',
    startTime: '09:00',
    endTime: '10:30',
    color: '#85325c',
  },
  {
    id: 'tt-8',
    day: 'Wednesday',
    subject: 'ML',
    classroom: 'AI Lab 2',
    startTime: '11:00',
    endTime: '12:30',
    color: '#f87171',
  },
  {
    id: 'tt-9',
    day: 'Wednesday',
    subject: 'MFEF',
    classroom: 'Hall 4',
    startTime: '13:30',
    endTime: '15:00',
    color: '#67e8f9',
  },
  {
    id: 'tt-10',
    day: 'Thursday',
    subject: 'API',
    classroom: 'Web Dev Lab',
    startTime: '10:00',
    endTime: '11:30',
    color: '#a78bfa',
  },
  {
    id: 'tt-11',
    day: 'Thursday',
    subject: 'OT',
    classroom: 'Room 205',
    startTime: '12:00',
    endTime: '13:30',
    color: '#f59e0b',
  },
  {
    id: 'tt-12',
    day: 'Thursday',
    subject: 'TRAINING',
    classroom: 'Placement Cell',
    startTime: '14:30',
    endTime: '16:30',
    color: '#34d399',
  },
  {
    id: 'tt-13',
    day: 'Friday',
    subject: 'CN',
    classroom: 'Room 302',
    startTime: '09:00',
    endTime: '10:30',
    color: '#85325c',
  },
  {
    id: 'tt-14',
    day: 'Friday',
    subject: 'ML',
    classroom: 'AI Lab 2',
    startTime: '11:00',
    endTime: '12:30',
    color: '#f87171',
  },
  {
    id: 'tt-15',
    day: 'Friday',
    subject: 'OT',
    classroom: 'Room 205',
    startTime: '14:00',
    endTime: '15:30',
    color: '#f59e0b',
  },
  {
    id: 'tt-16',
    day: 'Saturday',
    subject: 'TRAINING',
    classroom: 'Auditorium',
    startTime: '10:00',
    endTime: '13:00',
    color: '#34d399',
  },
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    subject: 'ML',
    date: getRelativeDate(4),
    time: '10:00',
    location: 'Auditorium Hall A',
    notes: 'Covers Gradient Descent, Decision Trees, SVM kernels, and Regularization.',
    completed: false,
  },
  {
    id: 'exam-2',
    subject: 'CN',
    date: getRelativeDate(10),
    time: '14:00',
    location: 'Room 302',
    notes: 'Subnetting CIDR calculations, OSPF/BGP routing, and TCP congestion control algorithms.',
    completed: false,
  },
  {
    id: 'exam-3',
    subject: 'MFEF',
    date: getRelativeDate(16),
    time: '09:30',
    location: 'Main Exam Hall',
    notes: 'Stochastic calculus, Black-Scholes formulation, and portfolio risk management.',
    completed: false,
  },
  {
    id: 'exam-4',
    subject: 'OT',
    date: getRelativeDate(22),
    time: '11:00',
    location: 'Room 205',
    notes: 'Simplex method, Duality theorems, and Transportation models.',
    completed: false,
  },
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'CN: TCP vs UDP & Handshake Protocol Summary',
    subject: 'CN',
    content: `1. Three-way Handshake:
   SYN (client -> server)
   SYN-ACK (server -> client)
   ACK (client -> server)
2. Four-way Teardown:
   FIN -> ACK -> FIN -> ACK
3. Flow Control: Sliding window advertised by receiver.
4. Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.`,
    tags: ['cn', 'networking', 'tcp'],
    pinned: true,
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'note-2',
    title: 'ML: Evaluation Metrics Cheatsheet',
    subject: 'ML',
    content: `- Accuracy: (TP + TN) / Total (Misleading for imbalanced datasets!)
- Precision: TP / (TP + FP) -> Cost of False Positive is high (e.g. spam detection)
- Recall (Sensitivity): TP / (TP + FN) -> Cost of False Negative is high (e.g. disease diagnosis)
- F1-Score: Harmonic mean = 2 * (P * R) / (P + R)
- ROC-AUC: True Positive Rate vs False Positive Rate across all thresholds.`,
    tags: ['ml', 'metrics', 'classification'],
    pinned: true,
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'note-3',
    title: 'API: RESTful Design Principles & HTTP Status Codes',
    subject: 'API',
    content: `- 200 OK: Successful GET/PUT/PATCH
- 201 Created: Successful POST creation
- 204 No Content: Successful DELETE
- 400 Bad Request: Malformed payload / validation error
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: Authenticated but insufficient permissions
- 404 Not Found: Resource does not exist
- 429 Too Many Requests: Rate limit exceeded`,
    tags: ['api', 'rest', 'http'],
    pinned: false,
    updatedAt: getRelativeDate(-3),
  },
  {
    id: 'note-4',
    title: 'OT: Simplex Method Quick Checklist',
    subject: 'OT',
    content: `1. Convert LP into standard form: all constraints as equalities with slack/surplus variables.
2. Determine initial Basic Feasible Solution (BFS).
3. Check optimality condition:
   - For maximization: all (Cj - Zj) <= 0.
4. Select entering variable (most positive Cj - Zj).
5. Select leaving variable using Minimum Ratio Test (Min theta = Xb / a_ik for a_ik > 0).
6. Perform Gauss-Jordan row operations to form next tableau.`,
    tags: ['ot', 'optimization', 'simplex'],
    pinned: false,
    updatedAt: getRelativeDate(-5),
  },
];

export const INITIAL_STUDY_SESSIONS = [
  {
    id: 'study-1',
    subject: 'CN',
    date: getRelativeDate(-3),
    startTime: '16:00',
    durationMinutes: 90,
    notes: 'Subnetting practice questions and CIDR calculations',
  },
  {
    id: 'study-2',
    subject: 'ML',
    date: getRelativeDate(-2),
    startTime: '14:30',
    durationMinutes: 75,
    notes: 'Practiced coding Logistic Regression from scratch with NumPy',
  },
  {
    id: 'study-3',
    subject: 'MFEF',
    date: getRelativeDate(-2),
    startTime: '10:00',
    durationMinutes: 60,
    notes: 'Reviewed Black-Scholes partial differential derivation',
  },
  {
    id: 'study-4',
    subject: 'TRAINING',
    date: getRelativeDate(-1),
    startTime: '15:00',
    durationMinutes: 90,
    notes: 'Solved 4 tree traversal problems on LeetCode',
  },
  {
    id: 'study-5',
    subject: 'API',
    date: getRelativeDate(0), // Today
    startTime: '11:00',
    durationMinutes: 60,
    notes: 'Tested JWT middleware and token expiry edge cases with Postman',
  },
];
