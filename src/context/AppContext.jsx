import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storage, generateId } from '../utils/storage';
import {
  INITIAL_SETTINGS,
  INITIAL_TASKS,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS,
  INITIAL_NOTES,
  INITIAL_ATTENDANCE,
  INITIAL_STUDY_SESSIONS,
} from '../utils/initialData';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateAttendancePercentage } from '../utils/attendanceUtils';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => storage.get('theme', 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Settings & Auth State
  const [settings, setSettings] = useState(() => storage.get('settings', INITIAL_SETTINGS));
  const [isAuthenticated, setIsAuthenticated] = useState(() => storage.get('isAuthenticated', true));

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storage.set('settings', updated);
      return updated;
    });
  };

  const login = (email, password) => {
    setIsAuthenticated(true);
    storage.set('isAuthenticated', true);
    if (email) {
      updateSettings({ email });
    }
    return true;
  };

  const signup = ({ name, email, college, password }) => {
    setIsAuthenticated(true);
    storage.set('isAuthenticated', true);
    updateSettings({
      studentName: name || 'Student',
      email: email || '',
      collegeName: college || '',
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    storage.set('isAuthenticated', false);
  };

  const demoLogin = () => {
    setIsAuthenticated(true);
    storage.set('isAuthenticated', true);
    updateSettings({
      studentName: 'Alex Morgan',
      email: 'alex@university.edu',
      collegeName: 'State Tech University',
    });
    return true;
  };

  // 3. Tasks State
  const [tasks, setTasks] = useState(() => storage.get('tasks', INITIAL_TASKS));

  const addTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      subject: taskData.subject?.trim() || 'General',
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      storage.set('tasks', updated);
      return updated;
    });
    return newTask;
  };

  const updateTask = (id, taskData) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...taskData } : t));
      storage.set('tasks', updated);
      return updated;
    });
  };

  const deleteTask = (id) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      storage.set('tasks', updated);
      return updated;
    });
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      });
      storage.set('tasks', updated);
      return updated;
    });
  };

  // 4. Timetable State
  const [timetable, setTimetable] = useState(() => storage.get('timetable', INITIAL_TIMETABLE));

  const addClassSession = (sessionData) => {
    const newSession = {
      id: generateId(),
      day: sessionData.day,
      subject: sessionData.subject.trim(),
      classroom: sessionData.classroom?.trim() || '',
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      color: sessionData.color || '#6366f1',
    };
    setTimetable((prev) => {
      const updated = [...prev, newSession];
      storage.set('timetable', updated);
      return updated;
    });
    return newSession;
  };

  const updateClassSession = (id, sessionData) => {
    setTimetable((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...sessionData } : s));
      storage.set('timetable', updated);
      return updated;
    });
  };

  const deleteClassSession = (id) => {
    setTimetable((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      storage.set('timetable', updated);
      return updated;
    });
  };

  // 5. Exams State
  const [exams, setExams] = useState(() => storage.get('exams', INITIAL_EXAMS));

  const addExam = (examData) => {
    const newExam = {
      id: generateId(),
      subject: examData.subject.trim(),
      date: examData.date,
      time: examData.time || '09:00',
      location: examData.location?.trim() || '',
      notes: examData.notes?.trim() || '',
      completed: false,
    };
    setExams((prev) => {
      const updated = [...prev, newExam];
      storage.set('exams', updated);
      return updated;
    });
    return newExam;
  };

  const updateExam = (id, examData) => {
    setExams((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...examData } : e));
      storage.set('exams', updated);
      return updated;
    });
  };

  const deleteExam = (id) => {
    setExams((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      storage.set('exams', updated);
      return updated;
    });
  };

  const toggleExamCompleted = (id) => {
    setExams((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e));
      storage.set('exams', updated);
      return updated;
    });
  };

  // 6. Notes State
  const [notes, setNotes] = useState(() => storage.get('notes', INITIAL_NOTES));

  const addNote = (noteData) => {
    const newNote = {
      id: generateId(),
      title: noteData.title.trim(),
      subject: noteData.subject?.trim() || 'General',
      content: noteData.content || '',
      tags: Array.isArray(noteData.tags)
        ? noteData.tags
        : noteData.tags ? noteData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
      pinned: Boolean(noteData.pinned),
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      storage.set('notes', updated);
      return updated;
    });
    return newNote;
  };

  const updateNote = (id, noteData) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id) {
          const tags = Array.isArray(noteData.tags)
            ? noteData.tags
            : noteData.tags ? noteData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : n.tags;
          return {
            ...n,
            ...noteData,
            tags,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return n;
      });
      storage.set('notes', updated);
      return updated;
    });
  };

  const deleteNote = (id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      storage.set('notes', updated);
      return updated;
    });
  };

  const togglePinNote = (id) => {
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      storage.set('notes', updated);
      return updated;
    });
  };

  // 7. Attendance State
  const [attendance, setAttendance] = useState(() => storage.get('attendance', INITIAL_ATTENDANCE));

  const addAttendanceSubject = (subjectData) => {
    const newSubject = {
      id: generateId(),
      subject: subjectData.subject.trim(),
      held: Math.max(0, parseInt(subjectData.held, 10) || 0),
      attended: Math.max(0, parseInt(subjectData.attended, 10) || 0),
    };
    if (newSubject.attended > newSubject.held) {
      newSubject.held = newSubject.attended;
    }
    setAttendance((prev) => {
      const updated = [...prev, newSubject];
      storage.set('attendance', updated);
      return updated;
    });
    return newSubject;
  };

  const updateAttendanceSubject = (id, subjectData) => {
    setAttendance((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const held = Math.max(0, parseInt(subjectData.held, 10) || 0);
          const attended = Math.min(held, Math.max(0, parseInt(subjectData.attended, 10) || 0));
          return { ...item, ...subjectData, held, attended };
        }
        return item;
      });
      storage.set('attendance', updated);
      return updated;
    });
  };

  const adjustAttendanceRecord = (id, attendedDelta, heldDelta) => {
    setAttendance((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newHeld = Math.max(0, item.held + heldDelta);
          const newAttended = Math.min(newHeld, Math.max(0, item.attended + attendedDelta));
          return { ...item, held: newHeld, attended: newAttended };
        }
        return item;
      });
      storage.set('attendance', updated);
      return updated;
    });
  };

  const deleteAttendanceSubject = (id) => {
    setAttendance((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      storage.set('attendance', updated);
      return updated;
    });
  };

  // 8. Study Sessions State
  const [studySessions, setStudySessions] = useState(() =>
    storage.get('studySessions', INITIAL_STUDY_SESSIONS)
  );

  const addStudySession = (sessionData) => {
    const newSession = {
      id: generateId(),
      subject: sessionData.subject.trim() || 'General Study',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      startTime: sessionData.startTime || '12:00',
      durationMinutes: Math.max(1, parseInt(sessionData.durationMinutes, 10) || 25),
      notes: sessionData.notes?.trim() || '',
    };
    setStudySessions((prev) => {
      const updated = [newSession, ...prev];
      storage.set('studySessions', updated);
      return updated;
    });
    return newSession;
  };

  const deleteStudySession = (id) => {
    setStudySessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      storage.set('studySessions', updated);
      return updated;
    });
  };

  // 9. Notifications Engine
  const [dismissedNotifications, setDismissedNotifications] = useState(() =>
    storage.get('dismissedNotifications', [])
  );

  const notifications = useMemo(() => {
    const list = [];
    const target = settings.targetAttendance || 75;

    // Check overdue and urgent tasks
    tasks.forEach((task) => {
      if (task.status !== 'Completed') {
        const days = getDaysRemaining(task.dueDate);
        if (days < 0) {
          list.push({
            id: `task-overdue-${task.id}`,
            type: 'danger',
            title: 'Task Overdue',
            message: `"${task.title}" was due ${Math.abs(days)} day(s) ago.`,
            link: '/tasks',
            createdAt: task.dueDate,
          });
        } else if (days === 0) {
          list.push({
            id: `task-today-${task.id}`,
            type: 'warning',
            title: 'Task Due Today',
            message: `"${task.title}" is due today!`,
            link: '/tasks',
            createdAt: task.dueDate,
          });
        } else if (days === 1) {
          list.push({
            id: `task-tmrw-${task.id}`,
            type: 'info',
            title: 'Task Due Tomorrow',
            message: `"${task.title}" is due tomorrow.`,
            link: '/tasks',
            createdAt: task.dueDate,
          });
        }
      }
    });

    // Check upcoming exams (within 7 days)
    exams.forEach((exam) => {
      if (!exam.completed) {
        const days = getDaysRemaining(exam.date);
        if (days >= 0 && days <= 7) {
          list.push({
            id: `exam-upcoming-${exam.id}`,
            type: days <= 2 ? 'danger' : 'warning',
            title: 'Upcoming Exam',
            message: `${exam.subject} exam is ${days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}.`,
            link: '/exams',
            createdAt: exam.date,
          });
        }
      }
    });

    // Check low attendance
    attendance.forEach((att) => {
      if (att.held > 0) {
        const pct = calculateAttendancePercentage(att.attended, att.held);
        if (pct < target) {
          list.push({
            id: `att-low-${att.id}`,
            type: 'warning',
            title: 'Low Attendance Alert',
            message: `${att.subject} attendance is ${pct}% (below ${target}% target).`,
            link: '/attendance',
            createdAt: new Date().toISOString().split('T')[0],
          });
        }
      }
    });

    // Filter out dismissed notifications
    return list.filter((n) => !dismissedNotifications.includes(n.id));
  }, [tasks, exams, attendance, settings.targetAttendance, dismissedNotifications]);

  const dismissNotification = (id) => {
    setDismissedNotifications((prev) => {
      const updated = [...prev, id];
      storage.set('dismissedNotifications', updated);
      return updated;
    });
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedNotifications((prev) => {
      const updated = Array.from(new Set([...prev, ...allIds]));
      storage.set('dismissedNotifications', updated);
      return updated;
    });
  };

  // 10. Modals Control
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState({
    isOpen: false,
    tab: 'task', // 'task' | 'note' | 'exam'
  });

  const openQuickAction = (tab = 'task') => {
    setQuickActionModal({ isOpen: true, tab });
  };

  const closeQuickAction = () => {
    setQuickActionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 11. Reset and Clear Utilities
  const resetToDemoData = () => {
    storage.clearAll();
    setSettings(INITIAL_SETTINGS);
    setTasks(INITIAL_TASKS);
    setTimetable(INITIAL_TIMETABLE);
    setExams(INITIAL_EXAMS);
    setNotes(INITIAL_NOTES);
    setAttendance(INITIAL_ATTENDANCE);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setDismissedNotifications([]);
    storage.set('settings', INITIAL_SETTINGS);
    storage.set('tasks', INITIAL_TASKS);
    storage.set('timetable', INITIAL_TIMETABLE);
    storage.set('exams', INITIAL_EXAMS);
    storage.set('notes', INITIAL_NOTES);
    storage.set('attendance', INITIAL_ATTENDANCE);
    storage.set('studySessions', INITIAL_STUDY_SESSIONS);
  };

  const clearAllData = () => {
    storage.clearAll();
    const blankSettings = {
      studentName: 'Student',
      collegeName: '',
      targetAttendance: 75,
      dailyStudyGoalMinutes: 120,
      theme: theme,
    };
    setSettings(blankSettings);
    setTasks([]);
    setTimetable([]);
    setExams([]);
    setNotes([]);
    setAttendance([]);
    setStudySessions([]);
    setDismissedNotifications([]);
    storage.set('settings', blankSettings);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        settings,
        updateSettings,
        isAuthenticated,
        login,
        logout,
        signup,
        demoLogin,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        timetable,
        addClassSession,
        updateClassSession,
        deleteClassSession,
        exams,
        addExam,
        updateExam,
        deleteExam,
        toggleExamCompleted,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        attendance,
        addAttendanceSubject,
        updateAttendanceSubject,
        adjustAttendanceRecord,
        deleteAttendanceSubject,
        studySessions,
        addStudySession,
        deleteStudySession,
        notifications,
        dismissNotification,
        clearAllNotifications,
        searchModalOpen,
        setSearchModalOpen,
        quickActionModal,
        openQuickAction,
        closeQuickAction,
        resetToDemoData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
