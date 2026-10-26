/**
 * Realistic initial demo data for StudentHub
 * Relative dates ensure that dashboard deadlines and timetables look active immediately.
 */

import { getTodayDateString } from './dateUtils';

const today = new Date();

const getRelativeDate = (offsetDays) => {
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

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Implement Dijkstra & Prim algorithms',
    description: 'Complete the graph traversal assignment and write unit tests for edge cases.',
    subject: 'Algorithms',
    dueDate: getRelativeDate(1), // Tomorrow
    priority: 'High',
    status: 'In Progress',
    createdAt: getRelativeDate(-3),
  },
  {
    id: 'task-2',
    title: 'Database Schema Normalization Paper',
    description: 'Write 4 pages on BCNF and 3NF normalization trade-offs in distributed systems.',
    subject: 'Database Systems',
    dueDate: getRelativeDate(3),
    priority: 'Medium',
    status: 'Pending',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-3',
    title: 'OS Process Scheduling Lab Report',
    description: 'Submit simulation logs for Round Robin and Multi-Level Queue schedulers.',
    subject: 'Operating Systems',
    dueDate: getRelativeDate(0), // Today
    priority: 'High',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'task-4',
    title: 'Read Computer Networks Chapter 4: Network Layer',
    description: 'Focus on IP addressing, CIDR subnetting, and NAT routing tables.',
    subject: 'Computer Networks',
    dueDate: getRelativeDate(5),
    priority: 'Low',
    status: 'Pending',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'task-5',
    title: 'Software Design Patterns Quiz Prep',
    description: 'Review Factory, Singleton, and Observer patterns with UML diagrams.',
    subject: 'Software Engineering',
    dueDate: getRelativeDate(-1), // Overdue
    priority: 'Medium',
    status: 'Completed',
    createdAt: getRelativeDate(-5),
  },
];

export const INITIAL_TIMETABLE = [
  {
    id: 'tt-1',
    day: 'Monday',
    subject: 'Data Structures & Algorithms',
    classroom: 'Room 302',
    startTime: '09:00',
    endTime: '10:30',
    color: '#8D4F4F',
  },
  {
    id: 'tt-2',
    day: 'Monday',
    subject: 'Database Systems',
    classroom: 'Lab 4',
    startTime: '11:00',
    endTime: '12:30',
    color: '#B76E79',
  },
  {
    id: 'tt-3',
    day: 'Tuesday',
    subject: 'Operating Systems',
    classroom: 'Room 205',
    startTime: '10:00',
    endTime: '11:30',
    color: '#FADADD',
  },
  {
    id: 'tt-4',
    day: 'Tuesday',
    subject: 'Computer Networks',
    classroom: 'Room 110',
    startTime: '13:30',
    endTime: '15:00',
    color: '#38b289',
  },
  {
    id: 'tt-5',
    day: 'Wednesday',
    subject: 'Software Engineering',
    classroom: 'Seminar Hall B',
    startTime: '09:30',
    endTime: '11:00',
    color: '#8D4F4F',
  },
  {
    id: 'tt-6',
    day: 'Wednesday',
    subject: 'Algorithms Lab',
    classroom: 'Comp Lab 2',
    startTime: '14:00',
    endTime: '16:00',
    color: '#B76E79',
  },
  {
    id: 'tt-7',
    day: 'Thursday',
    subject: 'Database Systems',
    classroom: 'Room 302',
    startTime: '10:00',
    endTime: '11:30',
    color: '#e5a866',
  },
  {
    id: 'tt-8',
    day: 'Thursday',
    subject: 'Operating Systems Lab',
    classroom: 'Lab 1',
    startTime: '13:00',
    endTime: '15:00',
    color: '#FADADD',
  },
  {
    id: 'tt-9',
    day: 'Friday',
    subject: 'Computer Networks',
    classroom: 'Room 110',
    startTime: '09:00',
    endTime: '10:30',
    color: '#38b289',
  },
  {
    id: 'tt-10',
    day: 'Friday',
    subject: 'Software Engineering',
    classroom: 'Room 205',
    startTime: '11:00',
    endTime: '12:30',
    color: '#8D4F4F',
  },
  {
    id: 'tt-11',
    day: 'Saturday',
    subject: 'Capstone Project Mentoring',
    classroom: 'Innovation Hub',
    startTime: '10:00',
    endTime: '12:00',
    color: '#B76E79',
  },
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    subject: 'Operating Systems',
    date: getRelativeDate(4),
    time: '10:00',
    location: 'Auditorium Hall A',
    notes: 'Covers Process Management, Memory Paging, and Deadlocks. Bring scientific calculator.',
    completed: false,
  },
  {
    id: 'exam-2',
    subject: 'Database Systems',
    date: getRelativeDate(11),
    time: '14:00',
    location: 'Room 401',
    notes: 'SQL Query optimization, B-Trees, ACID transactions, and Concurrency Control.',
    completed: false,
  },
  {
    id: 'exam-3',
    subject: 'Data Structures & Algorithms',
    date: getRelativeDate(18),
    time: '09:30',
    location: 'Main Exam Hall',
    notes: 'Comprehensive exam covering Arrays, Trees, Dynamic Programming, and Graph theory.',
    completed: false,
  },
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Dynamic Programming Patterns Cheatsheet',
    subject: 'Algorithms',
    content: `Key Patterns:
1. 0/1 Knapsack (Subset sum, equal partition)
2. Unbounded Knapsack (Coin change, rod cutting)
3. Fibonacci style (Climbing stairs, house robber)
4. Longest Common Subsequence (Edit distance, diff algorithms)
5. Interval DP (Matrix chain multiplication)

Tip: Always define the DP state clearly before writing the recurrence relation!`,
    tags: ['algorithms', 'cheatsheet', 'dp'],
    pinned: true,
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'note-2',
    title: 'ACID Properties in Relational Databases',
    subject: 'Database Systems',
    content: `Atomicity: All operations in a transaction succeed or all fail together.
Consistency: Database transitions from one valid state to another according to constraints.
Isolation: Concurrent transactions execute without interference (Read Committed, Repeatable Read, Serializable).
Durability: Once committed, changes survive system crashes (WAL - Write-Ahead Logging).`,
    tags: ['database', 'acid', 'theory'],
    pinned: true,
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'note-3',
    title: 'OS Page Replacement Algorithms Comparison',
    subject: 'Operating Systems',
    content: `- FIFO: Simple queue, suffers from Belady's Anomaly.
- LRU (Least Recently Used): High performance, implemented with doubly linked list + hash map.
- Optimal (Belady's Min): Theoretical benchmark, replaces page not needed for longest future time.
- Clock (Second Chance): Approximation of LRU using reference bits.`,
    tags: ['os', 'memory', 'paging'],
    pinned: false,
    updatedAt: getRelativeDate(-4),
  },
];

export const INITIAL_ATTENDANCE = [
  {
    id: 'att-1',
    subject: 'Data Structures & Algorithms',
    held: 32,
    attended: 28,
  },
  {
    id: 'att-2',
    subject: 'Database Systems',
    held: 28,
    attended: 24,
  },
  {
    id: 'att-3',
    subject: 'Operating Systems',
    held: 30,
    attended: 20, // 66.7% - Below 75% target to demonstrate the calculator and alert!
  },
  {
    id: 'att-4',
    subject: 'Computer Networks',
    held: 26,
    attended: 22,
  },
  {
    id: 'att-5',
    subject: 'Software Engineering',
    held: 24,
    attended: 21,
  },
];

export const INITIAL_STUDY_SESSIONS = [
  {
    id: 'study-1',
    subject: 'Algorithms',
    date: getRelativeDate(-4),
    startTime: '16:00',
    durationMinutes: 90,
    notes: 'Practiced graph traversal algorithms on LeetCode',
  },
  {
    id: 'study-2',
    subject: 'Database Systems',
    date: getRelativeDate(-3),
    startTime: '14:30',
    durationMinutes: 60,
    notes: 'Reviewed B-Tree index structures and query plans',
  },
  {
    id: 'study-3',
    subject: 'Operating Systems',
    date: getRelativeDate(-2),
    startTime: '10:00',
    durationMinutes: 120,
    notes: 'Read chapter on virtual memory and paging',
  },
  {
    id: 'study-4',
    subject: 'Computer Networks',
    date: getRelativeDate(-1),
    startTime: '15:00',
    durationMinutes: 75,
    notes: 'Subnetting practice problems and CIDR calculations',
  },
  {
    id: 'study-5',
    subject: 'Algorithms',
    date: getRelativeDate(0), // Today
    startTime: '11:00',
    durationMinutes: 80,
    notes: 'Dynamic programming memoization practice',
  },
];
