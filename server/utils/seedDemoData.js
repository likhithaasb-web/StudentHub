import AttendanceSubject from '../models/AttendanceSubject.js';
import AttendanceRecord from '../models/AttendanceRecord.js';
import Task from '../models/Task.js';
import Timetable from '../models/Timetable.js';
import Exam from '../models/Exam.js';
import Note from '../models/Note.js';
import StudySession from '../models/StudySession.js';

const today = new Date();
const getRelativeDate = (offsetDays) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const makeDateList = (count, startOffset = -28) => {
  const dates = [];
  let dayOffset = startOffset;
  while (dates.length < count && dayOffset <= 0) {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    const dayOfWeek = d.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 6) {
      dates.push(getRelativeDate(dayOffset));
    }
    dayOffset++;
  }
  while (dates.length < count) {
    dates.push(getRelativeDate(-Math.floor(Math.random() * 25)));
  }
  return dates.sort();
};

const buildSubjectRecords = (subject, dates, absentIndices, notesMap = {}) => {
  return dates.map((date, idx) => {
    const isAbsent = absentIndices.includes(idx);
    return {
      subject,
      date,
      status: isAbsent ? 'Absent' : 'Present',
      notes: notesMap[idx] || (isAbsent ? 'Missed due to health / travel' : 'Attended regular lecture'),
    };
  });
};

export const seedDemoDataForUser = async (userId) => {
  try {
    // 1. Core Subjects
    await AttendanceSubject.deleteMany({ userId });
    const subjects = [
      { name: 'CN', fullName: 'Computer Networks', color: '#17644D' },
      { name: 'MFEF', fullName: 'Mathematical Foundations of Economics & Finance', color: '#67e8f9' },
      { name: 'TRAINING', fullName: 'Technical & Placement Training', color: '#34d399' },
      { name: 'OT', fullName: 'Optimization Techniques', color: '#f59e0b' },
      { name: 'API', fullName: 'API Development & Web Services', color: '#a78bfa' },
      { name: 'ML', fullName: 'Machine Learning', color: '#f87171' },
    ];
    await AttendanceSubject.insertMany(subjects.map((s) => ({ ...s, userId })));

    // 2. Attendance Records
    await AttendanceRecord.deleteMany({ userId });
    const cnDates = makeDateList(24, -28);
    const mfefDates = makeDateList(20, -26);
    const trainingDates = makeDateList(18, -25);
    const otDates = makeDateList(22, -27);
    const apiDates = makeDateList(16, -24);
    const mlDates = makeDateList(25, -29);

    const rawRecords = [
      ...buildSubjectRecords('CN', cnDates, [4, 11, 18], {
        0: 'OSI Reference Model & TCP/IP stack overview',
        3: 'Data Link Layer framing and error detection',
        7: 'Subnet masking and CIDR notation exercises',
        14: 'Wireshark packet capture & TCP 3-way handshake analysis',
        21: 'DNS hierarchical architecture and lookup process',
        23: 'HTTP/2 multiplexing vs HTTP/3 QUIC protocol analysis',
      }),
      ...buildSubjectRecords('MFEF', mfefDates, [2, 5, 9, 13, 16, 19], {
        0: 'Continuous compounding and time value of money',
        8: 'Utility theory and risk aversion functions',
        12: 'Black-Scholes option pricing partial differential equations',
        18: 'Capital Asset Pricing Model (CAPM) and Beta calculations',
      }),
      ...buildSubjectRecords('TRAINING', trainingDates, [], {
        0: 'Quantitative Aptitude: Permutations, Combinations & Probability',
        3: 'Data Structures practice: Binary Trees & Heaps on LeetCode',
        6: 'System Design 101: Load balancers and database caching',
        9: 'Mock Technical Interview: Live coding round & feedback',
        12: 'Aptitude: Time, Speed & Distance shortcut tricks',
        15: 'HR behavioral round questions using STAR methodology',
        17: 'Full-length company simulation test & score analysis',
      }),
      ...buildSubjectRecords('OT', otDates, [3, 8, 12, 17, 20], {
        0: 'Linear Programming problem formulation & graphical method',
        6: 'Simplex algorithm: Pivot selection and tableau updates',
        11: 'Two-Phase simplex method and Big-M penalty formulation',
        15: 'Duality theory and economic interpretation of shadow prices',
        21: 'Transportation problem: Vogel’s Approximation Method (VAM)',
      }),
      ...buildSubjectRecords('API', apiDates, [5, 12], {
        0: 'REST architectural constraints and HTTP verbs idempotency',
        3: 'Request validation and JSON schema definitions',
        8: 'JWT access token creation and refresh token rotation',
        11: 'OpenAPI 3.0 specification & Swagger UI documentation',
        14: 'Rate limiting with Redis sliding-window algorithm',
        15: 'CORS policies, security headers, and API gateway routing',
      }),
      ...buildSubjectRecords('ML', mlDates, [1, 4, 7, 10, 13, 16, 18, 21, 23], {
        0: 'Supervised vs Unsupervised learning taxonomy',
        3: 'Cost functions and Gradient Descent optimization convergence',
        9: 'Decision Trees: Gini Impurity and Information Gain',
        15: 'Support Vector Machines: Linear vs RBF Kernel trick',
        20: 'Ensemble Learning: Random Forest bagging and feature subsampling',
        24: 'Model evaluation: Precision, Recall, F1 score and ROC-AUC curve',
      }),
    ];
    await AttendanceRecord.insertMany(rawRecords.map((r) => ({ ...r, userId })));

    // 3. Tasks
    await Task.deleteMany({ userId });
    const tasks = [
      {
        title: 'Wireshark Packet Analysis Lab Report',
        description: 'Capture TCP 3-way handshakes, analyze sequence numbers, and submit report on packet loss.',
        subject: 'CN',
        dueDate: getRelativeDate(2),
        priority: 'High',
        status: 'In Progress',
      },
      {
        title: 'Continuous Compounding & Bond Pricing Models',
        description: 'Complete problem set 4 on term structure of interest rates and Black-Scholes equations.',
        subject: 'MFEF',
        dueDate: getRelativeDate(1),
        priority: 'High',
        status: 'Pending',
      },
      {
        title: 'Solve 10 LeetCode Trees & Graphs Problems',
        description: 'Practice DFS, BFS, and Dijkstra for the upcoming on-campus recruitment test.',
        subject: 'TRAINING',
        dueDate: getRelativeDate(0),
        priority: 'Medium',
        status: 'Pending',
      },
      {
        title: 'Simplex Dual Formulation & Sensitivity Analysis',
        description: 'Solve the 4-variable manufacturing optimization problem with dual simplex tableau.',
        subject: 'OT',
        dueDate: getRelativeDate(4),
        priority: 'Medium',
        status: 'Pending',
      },
      {
        title: 'JWT Auth & Rate Limiting Middleware Implementation',
        description: 'Implement token refresh rotation and sliding-window rate limiting in FastAPI/Express.',
        subject: 'API',
        dueDate: getRelativeDate(6),
        priority: 'Low',
        status: 'Pending',
      },
      {
        title: 'Hyperparameter Tuning for Random Forest Model',
        description: 'Run grid search on max_depth, n_estimators, and evaluate ROC-AUC on test dataset.',
        subject: 'ML',
        dueDate: getRelativeDate(-1),
        priority: 'High',
        status: 'Pending',
      },
    ];
    await Task.insertMany(tasks.map((t) => ({ ...t, userId })));

    // 4. Timetable
    await Timetable.deleteMany({ userId });
    const timetable = [
      { day: 'Monday', subject: 'CN', classroom: 'Room 302', startTime: '09:00', endTime: '10:30', color: '#17644D' },
      { day: 'Monday', subject: 'MFEF', classroom: 'Hall 4', startTime: '11:00', endTime: '12:30', color: '#67e8f9' },
      { day: 'Monday', subject: 'ML', classroom: 'AI Lab 2', startTime: '14:00', endTime: '15:30', color: '#f87171' },
      { day: 'Tuesday', subject: 'OT', classroom: 'Room 205', startTime: '09:30', endTime: '11:00', color: '#f59e0b' },
      { day: 'Tuesday', subject: 'API', classroom: 'Web Dev Lab', startTime: '11:30', endTime: '13:00', color: '#a78bfa' },
      { day: 'Tuesday', subject: 'TRAINING', classroom: 'Auditorium', startTime: '14:00', endTime: '16:00', color: '#34d399' },
      { day: 'Wednesday', subject: 'CN', classroom: 'Room 302', startTime: '09:00', endTime: '10:30', color: '#17644D' },
      { day: 'Wednesday', subject: 'ML', classroom: 'AI Lab 2', startTime: '11:00', endTime: '12:30', color: '#f87171' },
      { day: 'Wednesday', subject: 'MFEF', classroom: 'Hall 4', startTime: '13:30', endTime: '15:00', color: '#67e8f9' },
      { day: 'Thursday', subject: 'API', classroom: 'Web Dev Lab', startTime: '10:00', endTime: '11:30', color: '#a78bfa' },
      { day: 'Thursday', subject: 'OT', classroom: 'Room 205', startTime: '12:00', endTime: '13:30', color: '#f59e0b' },
      { day: 'Thursday', subject: 'TRAINING', classroom: 'Placement Cell', startTime: '14:30', endTime: '16:30', color: '#34d399' },
      { day: 'Friday', subject: 'CN', classroom: 'Room 302', startTime: '09:00', endTime: '10:30', color: '#17644D' },
      { day: 'Friday', subject: 'ML', classroom: 'AI Lab 2', startTime: '11:00', endTime: '12:30', color: '#f87171' },
      { day: 'Friday', subject: 'OT', classroom: 'Room 205', startTime: '14:00', endTime: '15:30', color: '#f59e0b' },
      { day: 'Saturday', subject: 'TRAINING', classroom: 'Auditorium', startTime: '10:00', endTime: '13:00', color: '#34d399' },
    ];
    await Timetable.insertMany(timetable.map((s) => ({ ...s, userId })));

    // 5. Exams
    await Exam.deleteMany({ userId });
    const exams = [
      { subject: 'ML', date: getRelativeDate(4), time: '10:00', location: 'Auditorium Hall A', notes: 'Covers Gradient Descent, Decision Trees, SVM kernels, and Regularization.', completed: false },
      { subject: 'CN', date: getRelativeDate(10), time: '14:00', location: 'Room 302', notes: 'Subnetting CIDR calculations, OSPF/BGP routing, and TCP congestion control algorithms.', completed: false },
      { subject: 'MFEF', date: getRelativeDate(16), time: '09:30', location: 'Main Exam Hall', notes: 'Stochastic calculus, Black-Scholes formulation, and portfolio risk management.', completed: false },
      { subject: 'OT', date: getRelativeDate(22), time: '11:00', location: 'Room 205', notes: 'Simplex method, Duality theorems, and Transportation models.', completed: false },
    ];
    await Exam.insertMany(exams.map((e) => ({ ...e, userId })));

    // 6. Notes
    await Note.deleteMany({ userId });
    const notes = [
      {
        title: 'CN: TCP vs UDP & Handshake Protocol Summary',
        subject: 'CN',
        content: `1. Three-way Handshake:\n   SYN (client -> server)\n   SYN-ACK (server -> client)\n   ACK (client -> server)\n2. Four-way Teardown:\n   FIN -> ACK -> FIN -> ACK\n3. Flow Control: Sliding window advertised by receiver.\n4. Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.`,
        tags: ['cn', 'networking', 'tcp'],
        pinned: true,
      },
      {
        title: 'ML: Evaluation Metrics Cheatsheet',
        subject: 'ML',
        content: `- Accuracy: (TP + TN) / Total (Misleading for imbalanced datasets!)\n- Precision: TP / (TP + FP) -> Cost of False Positive is high\n- Recall: TP / (TP + FN) -> Cost of False Negative is high\n- F1-Score: 2 * (P * R) / (P + R)\n- ROC-AUC: True Positive Rate vs False Positive Rate curve.`,
        tags: ['ml', 'metrics', 'classification'],
        pinned: true,
      },
      {
        title: 'API: RESTful Design Principles & HTTP Status Codes',
        subject: 'API',
        content: `- 200 OK: Successful GET/PUT/PATCH\n- 201 Created: Successful POST creation\n- 204 No Content: Successful DELETE\n- 400 Bad Request: Validation error\n- 401 Unauthorized: Missing or invalid JWT\n- 403 Forbidden: Insufficient permissions\n- 404 Not Found: Resource not found\n- 429 Too Many Requests: Rate limit reached`,
        tags: ['api', 'rest', 'http'],
        pinned: false,
      },
      {
        title: 'OT: Simplex Method Quick Checklist',
        subject: 'OT',
        content: `1. Convert LP into standard form with slack/surplus variables.\n2. Determine initial Basic Feasible Solution (BFS).\n3. Check optimality condition (Cj - Zj <= 0 for max).\n4. Select entering variable (most positive Cj - Zj).\n5. Select leaving variable using Minimum Ratio Test.\n6. Perform Gauss-Jordan row operations.`,
        tags: ['ot', 'optimization', 'simplex'],
        pinned: false,
      },
    ];
    await Note.insertMany(notes.map((n) => ({ ...n, userId })));

    // 7. Study Sessions
    await StudySession.deleteMany({ userId });
    const studySessions = [
      { subject: 'CN', date: getRelativeDate(-3), startTime: '16:00', durationMinutes: 90, notes: 'Subnetting practice questions and CIDR calculations' },
      { subject: 'ML', date: getRelativeDate(-2), startTime: '14:30', durationMinutes: 75, notes: 'Practiced coding Logistic Regression from scratch with NumPy' },
      { subject: 'MFEF', date: getRelativeDate(-2), startTime: '10:00', durationMinutes: 60, notes: 'Reviewed Black-Scholes partial differential derivation' },
      { subject: 'TRAINING', date: getRelativeDate(-1), startTime: '15:00', durationMinutes: 90, notes: 'Solved 4 tree traversal problems on LeetCode' },
      { subject: 'API', date: getRelativeDate(0), startTime: '11:00', durationMinutes: 60, notes: 'Tested JWT middleware and token expiry edge cases with Postman' },
    ];
    await StudySession.insertMany(studySessions.map((s) => ({ ...s, userId })));

    return { success: true };
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }
};
