import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';
import { api, getAuthToken, setAuthToken } from '../utils/api';
import {
  INITIAL_SETTINGS,
  INITIAL_TASKS,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS,
  INITIAL_NOTES,
  INITIAL_ATTENDANCE,
  INITIAL_ATTENDANCE_SUBJECTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_STUDY_SESSIONS,
} from '../utils/initialData';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateAttendancePercentage } from '../utils/attendanceUtils';
import { resumeStorage } from '../utils/resumeStorage';
import {
  INITIAL_ADMIN_STUDENTS,
  INITIAL_ADMIN_DEPARTMENTS,
  INITIAL_ADMIN_ANNOUNCEMENTS,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_ADMIN_FACULTY,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_ADMIN_ASSIGNMENTS,
  INITIAL_ADMIN_EXAMS,
} from '../utils/initialAdminData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => storage.get('theme', 'dark'));

  useEffect(() => {
    const applyTheme = (current) => {
      let resolved = current;
      if (current === 'system') {
        const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolved = isDark ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
    };

    applyTheme(theme);
    storage.set('theme', theme);

    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Settings & Auth State
  const [settings, setSettings] = useState(() => storage.get('settings', INITIAL_SETTINGS));

  useEffect(() => {
    if (settings) {
      document.documentElement.setAttribute('data-density', settings.density || 'comfortable');
      document.documentElement.setAttribute('data-font-size', settings.fontSize || 'medium');
      document.documentElement.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');
    }
  }, [settings?.density, settings?.fontSize, settings?.reducedMotion]);
  const [isScreenLocked, setIsScreenLocked] = useState(() => storage.get('isScreenLocked', false));

  const lockScreen = useCallback(() => {
    setIsScreenLocked(true);
    storage.set('isScreenLocked', true);
  }, []);

  const unlockScreen = useCallback((pin) => {
    if (!settings.privacyPin || settings.privacyPin === pin) {
      setIsScreenLocked(false);
      storage.set('isScreenLocked', false);
      return true;
    }
    return false;
  }, [settings.privacyPin]);

  // 2b. MongoDB & Backend Connection Health State
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    checking: true,
    service: 'StudentHub API',
    database: 'studenthub',
    host: '127.0.0.1:27017',
    lastChecked: null,
  });

  const checkDbConnection = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      if (health && health.status === 'ok') {
        const isDbReady = health.database === 'connected';
        setDbStatus({
          connected: isDbReady,
          checking: false,
          service: health.service || 'StudentHub API',
          database: 'studenthub',
          host: '127.0.0.1:27017',
          lastChecked: new Date().toLocaleTimeString(),
        });
        return isDbReady;
      }
    } catch {}
    setDbStatus((prev) => ({
      ...prev,
      connected: false,
      checking: false,
      lastChecked: new Date().toLocaleTimeString(),
    }));
    return false;
  }, []);

  useEffect(() => {
    checkDbConnection();
    const interval = setInterval(checkDbConnection, 25000);
    return () => clearInterval(interval);
  }, [checkDbConnection]);

  // Authentication is session-scoped:
  // Fresh visits and new browser tabs ALWAYS open the Login page first.
  // We explicitly clean up any legacy persistent flag from localStorage.
  const [userRole, setUserRole] = useState(() => {
    try {
      return sessionStorage.getItem('studenthub_user_role') || storage.get('userRole', 'student');
    } catch {
      return 'student';
    }
  });

  const [adminStudents, setAdminStudents] = useState(() => storage.get('admin_students', INITIAL_ADMIN_STUDENTS));
  const [adminDepartments, setAdminDepartments] = useState(() => storage.get('admin_departments', INITIAL_ADMIN_DEPARTMENTS));
  const [adminAnnouncements, setAdminAnnouncements] = useState(() => storage.get('admin_announcements', INITIAL_ADMIN_ANNOUNCEMENTS));
  const [adminAuditLogs, setAdminAuditLogs] = useState(() => storage.get('admin_audit_logs', INITIAL_ADMIN_AUDIT_LOGS));
  const [adminFaculty, setAdminFaculty] = useState(() => storage.get('admin_faculty', INITIAL_ADMIN_FACULTY));
  const [adminSettings, setAdminSettingsState] = useState(() => storage.get('admin_settings', INITIAL_ADMIN_SETTINGS));
  const [adminAssignments, setAdminAssignments] = useState(() => storage.get('admin_assignments', INITIAL_ADMIN_ASSIGNMENTS));
  const [adminExams, setAdminExams] = useState(() => storage.get('admin_exams', INITIAL_ADMIN_EXAMS));

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      localStorage.removeItem('studenthub_auth_session_active');
    } catch {}

    try {
      return sessionStorage.getItem('studenthub_auth_session_active') === 'true';
    } catch {
      return false;
    }
  });

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storage.set('settings', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put('/auth/settings', {
        name: newSettings.studentName,
        collegeName: newSettings.collegeName,
        targetAttendance: newSettings.targetAttendance,
        dailyStudyGoalMinutes: newSettings.dailyStudyGoalMinutes,
        theme: newSettings.theme,
      }).catch(() => {});
    }
  };

  const login = (email, password) => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      localStorage.removeItem('studenthub_auth_session_active');
    } catch {}
    if (email) {
      setUserRole('student');
    try {
      sessionStorage.setItem('studenthub_user_role', 'student');
    } catch {}
    updateSettings({ email });
    }
    return true;
  };

  const signup = ({ name, email, college, password }) => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      localStorage.removeItem('studenthub_auth_session_active');
    } catch {}
    setUserRole('student');
    try {
      sessionStorage.setItem('studenthub_user_role', 'student');
    } catch {}
    updateSettings({
      studentName: name || 'Student',
      email: email || '',
      collegeName: college || '',
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('student');
    try {
      sessionStorage.removeItem('studenthub_user_role');
    } catch {}
    try {
      sessionStorage.removeItem('studenthub_auth_session_active');
      localStorage.removeItem('studenthub_auth_session_active');
      setAuthToken(null);
    } catch {}
  };

  const demoLogin = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      localStorage.removeItem('studenthub_auth_session_active');
    } catch {}
    setUserRole('student');
    try {
      sessionStorage.setItem('studenthub_user_role', 'student');
    } catch {}
    updateSettings({
      studentName: 'Alex Morgan',
      email: 'alex@university.edu',
      collegeName: 'State Tech University',
    });
    return true;
  };

  const demoAdminLogin = () => {
    setIsAuthenticated(true);
    setUserRole('superadmin');
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      sessionStorage.setItem('studenthub_user_role', 'superadmin');
      storage.set('userRole', 'superadmin');
    } catch {}
    return true;
  };

  const adminLogin = (email, password) => {
    setIsAuthenticated(true);
    setUserRole('admin');
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      sessionStorage.setItem('studenthub_user_role', 'admin');
      storage.set('userRole', 'admin');
    } catch {}
    return true;
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
    try {
      sessionStorage.setItem('studenthub_user_role', newRole);
      storage.set('userRole', newRole);
    } catch {}
  };

  const addAuditLog = (action, module, targetEntity, details, status = 'Success') => {
    const newLog = {
      id: generateId('log_'),
      action,
      module,
      performedBy: userRole === 'superadmin' ? 'Dr. Eleanor Vance' : 'Administrator',
      performerEmail: userRole === 'superadmin' ? 'dean.vance@studenthub.edu' : 'admin@studenthub.edu',
      performerRole: userRole,
      targetEntity: targetEntity || '',
      details: details || '',
      status,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.10',
    };
    setAdminAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      storage.set('admin_audit_logs', updated);
      return updated;
    });
  };

  const addAdminStudent = (studentData) => {
    const newStudent = {
      id: generateId('std_'),
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      attendancePercentage: studentData.attendancePercentage || 85,
      totalClasses: 112,
      attendedClasses: Math.round(112 * ((studentData.attendancePercentage || 85) / 100)),
      cgpa: studentData.cgpa ? Number(studentData.cgpa) : 8.5,
      degree: 'B.Tech / B.E.',
      academicYear: '3rd Year',
      semester: 'Semester 6',
      ...studentData,
    };
    setAdminStudents((prev) => {
      const updated = [newStudent, ...prev];
      storage.set('admin_students', updated);
      return updated;
    });
    addAuditLog('Create Student Account', 'Students', newStudent.email, `Created student account for ${newStudent.name} (${newStudent.rollNumber}).`);
    return newStudent;
  };

  const updateAdminStudent = (id, studentData) => {
    setAdminStudents((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...studentData } : s));
      storage.set('admin_students', updated);
      return updated;
    });
    addAuditLog('Update Student Profile', 'Students', studentData.email || id, `Updated student profile information.`);
  };

  const toggleStudentStatus = (id) => {
    setAdminStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'suspended' : 'active';
          addAuditLog(`Change Student Status to ${nextStatus}`, 'Students', s.rollNumber || s.email, `Account status changed to ${nextStatus} for ${s.name}.`);
          return { ...s, status: nextStatus };
        }
        return s;
      });
      storage.set('admin_students', updated);
      return updated;
    });
  };

  const deleteAdminStudent = (id) => {
    setAdminStudents((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) {
        addAuditLog('Delete Student Account', 'Students', target.email, `Removed student ${target.name} (${target.rollNumber}).`, 'Warning');
      }
      const updated = prev.filter((s) => s.id !== id);
      storage.set('admin_students', updated);
      return updated;
    });
  };

  const addDepartment = (dept) => {
    const newDept = {
      id: generateId('dept_'),
      activeStudents: 0,
      facultyCount: 0,
      subjects: [],
      ...dept,
    };
    setAdminDepartments((prev) => {
      const updated = [...prev, newDept];
      storage.set('admin_departments', updated);
      return updated;
    });
    addAuditLog('Create Department', 'Academics', newDept.code, `Created department ${newDept.name} (${newDept.code}).`);
    return newDept;
  };

  const updateDepartment = (id, deptData) => {
    setAdminDepartments((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, ...deptData } : d));
      storage.set('admin_departments', updated);
      return updated;
    });
    addAuditLog('Update Department', 'Academics', deptData.code || id, `Updated department curriculum/details.`);
  };

  const addAnnouncement = (annData) => {
    const newAnn = {
      id: generateId('ann_'),
      date: new Date().toISOString().split('T')[0],
      publishedBy: userRole === 'superadmin' ? 'Dr. Eleanor Vance (Academic Dean)' : 'College Administration',
      isPinned: false,
      ...annData,
    };
    setAdminAnnouncements((prev) => {
      const updated = [newAnn, ...prev];
      storage.set('admin_announcements', updated);
      return updated;
    });
    addAuditLog('Publish Circular', 'Announcements', newAnn.title, `Published institutional announcement for ${newAnn.targetAudience}.`);
    return newAnn;
  };

  const deleteAnnouncement = (id) => {
    setAdminAnnouncements((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) {
        addAuditLog('Delete Circular', 'Announcements', target.title, `Removed circular "${target.title}".`, 'Warning');
      }
      const updated = prev.filter((a) => a.id !== id);
      storage.set('admin_announcements', updated);
      return updated;
    });
  };

  const updateAdminSettings = (newSettings) => {
    setAdminSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      storage.set('admin_settings', updated);
      return updated;
    });
    addAuditLog('Update Platform Configuration', 'Settings', 'Global Configuration', `Updated platform thresholds and institution parameters.`);
  };

  const addAdminAssignment = (asgData) => {
    const newAsg = {
      id: generateId('asg_'),
      submissionsCount: 0,
      totalStudents: 120,
      status: 'active',
      publishedBy: userRole === 'superadmin' ? 'Dr. Eleanor Vance' : 'Course Faculty',
      ...asgData,
    };
    setAdminAssignments((prev) => {
      const updated = [newAsg, ...prev];
      storage.set('admin_assignments', updated);
      return updated;
    });
    addAuditLog('Broadcast Assignment', 'Assignments', newAsg.courseCode, `Published assignment "${newAsg.title}" for ${newAsg.department}.`);
    return newAsg;
  };

  const addAdminExam = (examData) => {
    const newExam = {
      id: generateId('adm_ex_'),
      status: 'Scheduled',
      totalCandidates: 120,
      maxMarks: 100,
      ...examData,
    };
    setAdminExams((prev) => {
      const updated = [newExam, ...prev];
      storage.set('admin_exams', updated);
      return updated;
    });
    addAuditLog('Schedule Examination', 'Exams', newExam.code, `Created exam schedule for ${newExam.subject} (${newExam.code}) at ${newExam.venue}.`);
    return newExam;
  };

  const deleteAdminExam = (id) => {
    setAdminExams((prev) => {
      const target = prev.find((e) => e.id === id);
      if (target) {
        addAuditLog('Cancel Examination', 'Exams', target.code, `Cancelled exam for ${target.subject}.`, 'Warning');
      }
      const updated = prev.filter((e) => e.id !== id);
      storage.set('admin_exams', updated);
      return updated;
    });
  };

  const addAdminFaculty = (facultyData) => {
    const newFaculty = {
      id: generateId('adm_'),
      status: 'active',
      lastLogin: 'Never',
      permissions: ['manage:academics', 'manage:attendance', 'manage:assignments'],
      ...facultyData,
    };
    setAdminFaculty((prev) => {
      const updated = [...prev, newFaculty];
      storage.set('admin_faculty', updated);
      return updated;
    });
    addAuditLog('Add Faculty / Administrator', 'Admins', newFaculty.email, `Granted ${newFaculty.role} access to ${newFaculty.name}.`);
    return newFaculty;
  };

  const updateAdminRole = (id, role, permissions) => {
    setAdminFaculty((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, role, permissions: permissions || f.permissions } : f));
      storage.set('admin_faculty', updated);
      return updated;
    });
    addAuditLog('Modify Admin Privileges', 'Admins', id, `Updated role to ${role}.`);
  };

  const loginWithGoogle = ({ name, email, avatar, college }) => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('studenthub_auth_session_active', 'true');
      localStorage.removeItem('studenthub_auth_session_active');
    } catch {}
    setUserRole('student');
    try {
      sessionStorage.setItem('studenthub_user_role', 'student');
    } catch {}
    updateSettings({
      studentName: name || 'Google User',
      email: email || '',
      avatar: avatar || '',
      collegeName: college || settings.collegeName || 'University Student',
      authProvider: 'google',
    });
    return true;
  };

  // 2c. Synchronize Data From MongoDB on Authentication
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getAuthToken();
    if (!token) return;

    let isMounted = true;
    const syncFromMongoDB = async () => {
      const isOnline = await checkDbConnection();
      if (!isOnline || !isMounted) return;

      try {
        const userRes = await api.get('/auth/me').catch(() => null);
        if (userRes?.user && isMounted) {
          setSettings((prev) => {
            const updated = {
              ...prev,
              studentName: userRes.user.name || prev.studentName,
              collegeName: userRes.user.collegeName || prev.collegeName,
              targetAttendance: userRes.user.targetAttendance || prev.targetAttendance,
              dailyStudyGoalMinutes: userRes.user.dailyStudyGoalMinutes || prev.dailyStudyGoalMinutes,
            };
            storage.set('settings', updated);
            return updated;
          });
        }

        if (Array.isArray(subRes) && subRes.length > 0 && isMounted) {
          setAttendanceSubjects(subRes);
          storage.set('attendance_subjects', subRes);
        }

        if (Array.isArray(recRes) && isMounted) {
          setAttendanceRecords(recRes);
          storage.set('attendance_records', recRes);
        }

        if (Array.isArray(taskRes) && isMounted) {
          setTasks(taskRes);
          storage.set('tasks', taskRes);
        }

        if (Array.isArray(ttRes) && isMounted) {
          setTimetable(ttRes);
          storage.set('timetable', ttRes);
        }

        if (Array.isArray(examRes) && isMounted) {
          setExams(examRes);
          storage.set('exams', examRes);
        }

        if (Array.isArray(noteRes) && isMounted) {
          setNotes(noteRes);
          storage.set('notes', noteRes);
        }

        if (Array.isArray(studyRes) && isMounted) {
          setStudySessions(studyRes);
          storage.set('studySessions', studyRes);
        }
      } catch (err) {
        console.warn('[MongoDB] Sync note:', err.message);
      }
    };

    syncFromMongoDB();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, checkDbConnection]);

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

    if (getAuthToken()) {
      api.post('/tasks', newTask)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setTasks((prev) => {
              const mapped = prev.map((t) => (t.id === newTask.id ? { ...t, id: dbId, _id: dbId } : t));
              storage.set('tasks', mapped);
              return mapped;
            });
          }
        })
        .catch(() => {});
    }

    return newTask;
  };

  const updateTask = (id, taskData) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id || t._id === id ? { ...t, ...taskData } : t));
      storage.set('tasks', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/tasks/${id}`, taskData).catch(() => {});
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id && t._id !== id);
      storage.set('tasks', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.delete(`/tasks/${id}`).catch(() => {});
    }
  };

  const toggleTaskStatus = (id) => {
    let nextStatus = 'Pending';
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id || t._id === id) {
          nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      });
      storage.set('tasks', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/tasks/${id}`, { status: nextStatus }).catch(() => {});
    }
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
      color: sessionData.color || '#17644D',
    };
    setTimetable((prev) => {
      const updated = [...prev, newSession];
      storage.set('timetable', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.post('/timetable', newSession)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setTimetable((prev) => prev.map((s) => (s.id === newSession.id ? { ...s, id: dbId, _id: dbId } : s)));
          }
        })
        .catch(() => {});
    }

    return newSession;
  };

  const updateClassSession = (id, sessionData) => {
    setTimetable((prev) => {
      const updated = prev.map((s) => (s.id === id || s._id === id ? { ...s, ...sessionData } : s));
      storage.set('timetable', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/timetable/${id}`, sessionData).catch(() => {});
    }
  };

  const deleteClassSession = (id) => {
    setTimetable((prev) => {
      const updated = prev.filter((s) => s.id !== id && s._id !== id);
      storage.set('timetable', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.delete(`/timetable/${id}`).catch(() => {});
    }
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

    if (getAuthToken()) {
      api.post('/exams', newExam)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setExams((prev) => prev.map((e) => (e.id === newExam.id ? { ...e, id: dbId, _id: dbId } : e)));
          }
        })
        .catch(() => {});
    }

    return newExam;
  };

  const updateExam = (id, examData) => {
    setExams((prev) => {
      const updated = prev.map((e) => (e.id === id || e._id === id ? { ...e, ...examData } : e));
      storage.set('exams', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/exams/${id}`, examData).catch(() => {});
    }
  };

  const deleteExam = (id) => {
    setExams((prev) => {
      const updated = prev.filter((e) => e.id !== id && e._id !== id);
      storage.set('exams', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.delete(`/exams/${id}`).catch(() => {});
    }
  };

  const toggleExamCompleted = (id) => {
    let nextVal = false;
    setExams((prev) => {
      const updated = prev.map((e) => {
        if (e.id === id || e._id === id) {
          nextVal = !e.completed;
          return { ...e, completed: nextVal };
        }
        return e;
      });
      storage.set('exams', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/exams/${id}`, { completed: nextVal }).catch(() => {});
    }
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

    if (getAuthToken()) {
      api.post('/notes', newNote)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setNotes((prev) => prev.map((n) => (n.id === newNote.id ? { ...n, id: dbId, _id: dbId } : n)));
          }
        })
        .catch(() => {});
    }

    return newNote;
  };

  const updateNote = (id, noteData) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id || n._id === id) {
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
    if (getAuthToken()) {
      api.put(`/notes/${id}`, noteData).catch(() => {});
    }
  };

  const deleteNote = (id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id && n._id !== id);
      storage.set('notes', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.delete(`/notes/${id}`).catch(() => {});
    }
  };

  const togglePinNote = (id) => {
    let nextPinned = false;
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id || n._id === id) {
          nextPinned = !n.pinned;
          return { ...n, pinned: nextPinned };
        }
        return n;
      });
      storage.set('notes', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.put(`/notes/${id}`, { pinned: nextPinned }).catch(() => {});
    }
  };

  // 7. Personal Attendance Tracker State (Subject & Class-Record Driven)
  const [attendanceSubjects, setAttendanceSubjects] = useState(() => {
    const stored = storage.get('attendance_subjects');
    if (Array.isArray(stored) && stored.length > 0) return stored;
    return INITIAL_ATTENDANCE_SUBJECTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const stored = storage.get('attendance_records');
    if (Array.isArray(stored)) return stored;
    return INITIAL_ATTENDANCE_RECORDS;
  });

  // Calculate subject-wise attendance automatically from individual class records
  const attendance = useMemo(() => {
    return attendanceSubjects.map((sub) => {
      const records = attendanceRecords.filter((r) => r.subject === sub.name);
      const attended = records.filter((r) => r.status === 'Present').length;
      const absent = records.filter((r) => r.status === 'Absent').length;
      const held = attended + absent;
      const percentage = calculateAttendancePercentage(attended, held);
      return {
        id: sub.id,
        subject: sub.name,
        fullName: sub.fullName || sub.name,
        color: sub.color || 'var(--primary)',
        held,
        attended,
        absent,
        percentage,
      };
    });
  }, [attendanceSubjects, attendanceRecords]);

  // Synchronize computed summary into storage for external listeners
  useEffect(() => {
    storage.set('attendance', attendance);
    storage.set('attendance_subjects', attendanceSubjects);
    storage.set('attendance_records', attendanceRecords);
  }, [attendance, attendanceSubjects, attendanceRecords]);

  // Subject Management (Add, Edit, Delete)
  const addAttendanceSubject = (subjectData) => {
    const name = (subjectData.name || subjectData.subject || '').trim().toUpperCase();
    if (!name) return null;

    // Check duplicate
    const exists = attendanceSubjects.some((s) => s.name.toUpperCase() === name);
    if (exists) return null;

    const newSubject = {
      id: `sub-${name.toLowerCase().replace(/[^a-z0-9]/g, '') || generateId()}`,
      name,
      fullName: (subjectData.fullName || subjectData.name || name).trim(),
      color: subjectData.color || '#17644D',
    };

    setAttendanceSubjects((prev) => {
      const updated = [...prev, newSubject];
      storage.set('attendance_subjects', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.post('/attendance/subjects', newSubject)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setAttendanceSubjects((prev) => prev.map((s) => (s.id === newSubject.id ? { ...s, id: dbId, _id: dbId } : s)));
          }
        })
        .catch(() => {});
    }

    return newSubject;
  };

  const updateAttendanceSubject = (id, subjectData) => {
    const newName = (subjectData.name || subjectData.subject || '').trim().toUpperCase();
    setAttendanceSubjects((prev) => {
      let oldName = null;
      const updated = prev.map((s) => {
        if (s.id === id || s._id === id) {
          oldName = s.name;
          return {
            ...s,
            name: newName || s.name,
            fullName: subjectData.fullName !== undefined ? subjectData.fullName.trim() : s.fullName,
            color: subjectData.color || s.color,
          };
        }
        return s;
      });
      storage.set('attendance_subjects', updated);

      // If subject name changed, cascade update to all attendance records
      if (oldName && newName && oldName !== newName) {
        setAttendanceRecords((prevRecs) => {
          const updatedRecs = prevRecs.map((r) =>
            r.subject === oldName ? { ...r, subject: newName } : r
          );
          storage.set('attendance_records', updatedRecs);
          return updatedRecs;
        });
      }

      return updated;
    });

    if (getAuthToken()) {
      api.put(`/attendance/subjects/${id}`, subjectData).catch(() => {});
    }
  };

  const deleteAttendanceSubject = (id) => {
    let deletedName = null;
    setAttendanceSubjects((prev) => {
      const target = prev.find((s) => s.id === id || s._id === id);
      if (target) deletedName = target.name;
      const updated = prev.filter((s) => s.id !== id && s._id !== id);
      storage.set('attendance_subjects', updated);
      return updated;
    });

    if (deletedName) {
      setAttendanceRecords((prev) => {
        const updated = prev.filter((r) => r.subject !== deletedName);
        storage.set('attendance_records', updated);
        return updated;
      });
    }

    if (getAuthToken()) {
      api.delete(`/attendance/subjects/${id}`).catch(() => {});
    }
  };

  // Class-by-Class Attendance Records (Add, Edit, Delete, Toggle Status)
  const addAttendanceRecord = (recordData) => {
    const newRecord = {
      id: generateId(),
      subject: (recordData.subject || '').trim(),
      date: recordData.date || new Date().toISOString().split('T')[0],
      status: recordData.status === 'Absent' ? 'Absent' : 'Present',
      notes: (recordData.notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    setAttendanceRecords((prev) => {
      const updated = [newRecord, ...prev];
      storage.set('attendance_records', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.post('/attendance/records', newRecord)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setAttendanceRecords((prev) => prev.map((r) => (r.id === newRecord.id ? { ...r, id: dbId, _id: dbId } : r)));
          }
        })
        .catch(() => {});
    }

    return newRecord;
  };

  const updateAttendanceRecord = (id, updatedData) => {
    setAttendanceRecords((prev) => {
      const updated = prev.map((rec) => {
        if (rec.id === id || rec._id === id) {
          return {
            ...rec,
            ...updatedData,
            status: updatedData.status === 'Absent' ? 'Absent' : 'Present',
            notes: updatedData.notes !== undefined ? updatedData.notes.trim() : rec.notes,
          };
        }
        return rec;
      });
      storage.set('attendance_records', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.put(`/attendance/records/${id}`, updatedData).catch(() => {});
    }
  };

  const deleteAttendanceRecord = (id) => {
    setAttendanceRecords((prev) => {
      const updated = prev.filter((rec) => rec.id !== id && rec._id !== id);
      storage.set('attendance_records', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.delete(`/attendance/records/${id}`).catch(() => {});
    }
  };

  const toggleAttendanceRecordStatus = (id) => {
    let nextStatus = 'Present';
    setAttendanceRecords((prev) => {
      const updated = prev.map((rec) => {
        if (rec.id === id || rec._id === id) {
          nextStatus = rec.status === 'Present' ? 'Absent' : 'Present';
          return {
            ...rec,
            status: nextStatus,
          };
        }
        return rec;
      });
      storage.set('attendance_records', updated);
      return updated;
    });

    if (getAuthToken()) {
      api.put(`/attendance/records/${id}`, { status: nextStatus }).catch(() => {});
    }
  };

  // Convenience helper to quickly record today's class
  const quickMarkAttendance = (subjectName, status = 'Present', notes = '') => {
    const todayStr = new Date().toISOString().split('T')[0];
    return addAttendanceRecord({
      subject: subjectName,
      date: todayStr,
      status,
      notes: notes || `Quick-logged ${status.toLowerCase()} on ${todayStr}`,
    });
  };

  // Legacy fallback compatibility
  const adjustAttendanceRecord = (id, attendedDelta, heldDelta) => {
    const targetSub = attendanceSubjects.find((s) => s.id === id || s.name === id);
    const subjectName = targetSub ? targetSub.name : id;
    if (attendedDelta > 0) {
      quickMarkAttendance(subjectName, 'Present');
    } else if (heldDelta > 0 && attendedDelta === 0) {
      quickMarkAttendance(subjectName, 'Absent');
    }
  };

  const resetAttendanceToSample = () => {
    setAttendanceSubjects(INITIAL_ATTENDANCE_SUBJECTS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    storage.set('attendance_subjects', INITIAL_ATTENDANCE_SUBJECTS);
    storage.set('attendance_records', INITIAL_ATTENDANCE_RECORDS);
  };

  const clearAttendanceData = () => {
    setAttendanceSubjects([]);
    setAttendanceRecords([]);
    storage.set('attendance_subjects', []);
    storage.set('attendance_records', []);
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

    if (getAuthToken()) {
      api.post('/study-sessions', newSession)
        .then((saved) => {
          if (saved && (saved._id || saved.id)) {
            const dbId = saved._id || saved.id;
            setStudySessions((prev) => prev.map((s) => (s.id === newSession.id ? { ...s, id: dbId, _id: dbId } : s)));
          }
        })
        .catch(() => {});
    }

    return newSession;
  };

  const deleteStudySession = (id) => {
    setStudySessions((prev) => {
      const updated = prev.filter((s) => s.id !== id && s._id !== id);
      storage.set('studySessions', updated);
      return updated;
    });
    if (getAuthToken()) {
      api.delete(`/study-sessions/${id}`).catch(() => {});
    }
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
    // Preserve currently logged-in student's identity (e.g. Sai likhitha Adda)
    const preservedSettings = {
      ...INITIAL_SETTINGS,
      studentName: settings.studentName || 'Student',
      email: settings.email || '',
      collegeName: settings.collegeName || 'University Student',
      theme: theme,
    };

    setSettings(preservedSettings);
    setTasks(INITIAL_TASKS);
    setTimetable(INITIAL_TIMETABLE);
    setExams(INITIAL_EXAMS);
    setNotes(INITIAL_NOTES);
    setAttendanceSubjects(INITIAL_ATTENDANCE_SUBJECTS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setDismissedNotifications([]);

    storage.set('settings', preservedSettings);
    storage.set('tasks', INITIAL_TASKS);
    storage.set('timetable', INITIAL_TIMETABLE);
    storage.set('exams', INITIAL_EXAMS);
    storage.set('notes', INITIAL_NOTES);
    storage.set('attendance_subjects', INITIAL_ATTENDANCE_SUBJECTS);
    storage.set('attendance_records', INITIAL_ATTENDANCE_RECORDS);
    storage.set('attendance', INITIAL_ATTENDANCE);
    storage.set('studySessions', INITIAL_STUDY_SESSIONS);
    resumeStorage.restoreDemoResumes();

    // Sync seed to MongoDB backend
    if (getAuthToken()) {
      api.post('/auth/seed-demo').catch(() => {});
    }
  };

  const clearUserData = () => {
    setTasks([]);
    setTimetable([]);
    setExams([]);
    setNotes([]);
    setAttendanceRecords([]);
    setStudySessions([]);
    setDismissedNotifications([]);

    storage.set('tasks', []);
    storage.set('timetable', []);
    storage.set('exams', []);
    storage.set('notes', []);
    storage.set('attendance_records', []);
    storage.set('studySessions', []);

    if (getAuthToken()) {
      api.post('/auth/clear-data').catch(() => {});
    }
  };

  const exportFullBackup = useCallback(() => {
    const backupData = {
      app: 'StudentHub',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      studentName: settings.studentName || 'Student',
      settings,
      tasks: storage.get('tasks', []),
      timetable: storage.get('timetable', []),
      exams: storage.get('exams', []),
      notes: storage.get('notes', []),
      attendance: storage.get('attendance', []),
      attendanceSubjects: storage.get('attendanceSubjects', []),
      attendanceRecords: storage.get('attendanceRecords', []),
      studySessions: storage.get('studySessions', []),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudentHub_Backup_${(settings.studentName || 'Student').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings]);

  const importFullBackup = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!data || typeof data !== 'object') throw new Error('Invalid backup file.');
      if (data.settings) {
        setSettings(data.settings);
        storage.set('settings', data.settings);
      }
      if (data.tasks) { setTasks(data.tasks); storage.set('tasks', data.tasks); }
      if (data.timetable) { setTimetable(data.timetable); storage.set('timetable', data.timetable); }
      if (data.exams) { setExams(data.exams); storage.set('exams', data.exams); }
      if (data.notes) { setNotes(data.notes); storage.set('notes', data.notes); }
      if (data.attendance) { setAttendance(data.attendance); storage.set('attendance', data.attendance); }
      if (data.attendanceSubjects) { setAttendanceSubjects(data.attendanceSubjects); storage.set('attendanceSubjects', data.attendanceSubjects); }
      if (data.attendanceRecords) { setAttendanceRecords(data.attendanceRecords); storage.set('attendanceRecords', data.attendanceRecords); }
      if (data.studySessions) { setStudySessions(data.studySessions); storage.set('studySessions', data.studySessions); }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  const clearAllData = () => {
    storage.clearAll();
    resumeStorage.clearAllResumes();
    setAuthToken(null);
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
    setAttendanceSubjects([]);
    setAttendanceRecords([]);
    setStudySessions([]);
    setDismissedNotifications([]);
    storage.set('settings', blankSettings);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        settings,
        updateSettings,
        isAuthenticated,
        login,
        logout,
        signup,
        demoLogin,
        loginWithGoogle,
        userRole,
        switchRole,
        demoAdminLogin,
        adminLogin,
        adminStudents,
        addAdminStudent,
        updateAdminStudent,
        toggleStudentStatus,
        deleteAdminStudent,
        adminDepartments,
        addDepartment,
        updateDepartment,
        adminAnnouncements,
        addAnnouncement,
        deleteAnnouncement,
        adminAuditLogs,
        addAuditLog,
        adminFaculty,
        addAdminFaculty,
        updateAdminRole,
        adminSettings,
        updateAdminSettings,
        adminAssignments,
        addAdminAssignment,
        adminExams,
        addAdminExam,
        deleteAdminExam,
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
        attendanceSubjects,
        attendanceRecords,
        attendance,
        addAttendanceSubject,
        updateAttendanceSubject,
        deleteAttendanceSubject,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        toggleAttendanceRecordStatus,
        quickMarkAttendance,
        adjustAttendanceRecord,
        resetAttendanceToSample,
        clearAttendanceData,
        studySessions,
        addStudySession,
        deleteStudySession,
        dbStatus,
        checkDbConnection,
        notifications,
        dismissNotification,
        clearAllNotifications,
        searchModalOpen,
        setSearchModalOpen,
        quickActionModal,
        openQuickAction,
        closeQuickAction,
        resetToDemoData,
        clearUserData,
        clearAllData,
        isScreenLocked,
        lockScreen,
        unlockScreen,
        exportFullBackup,
        importFullBackup,
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
