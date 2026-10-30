import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { calculateOverallAttendance } from '../utils/attendanceUtils';
import { getTodayDateString } from '../utils/dateUtils';

// Modular Settings Subcomponents
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsSidebar, { SETTINGS_TABS } from '../components/settings/SettingsSidebar';
import SettingsOverview from '../components/settings/SettingsOverview';
import AcademicPreferences from '../components/settings/AcademicPreferences';
import NotificationSettings from '../components/settings/NotificationSettings';
import StudyPreferences from '../components/settings/StudyPreferences';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import PrivacySecurity from '../components/settings/PrivacySecurity';
import StudyStreak from '../components/settings/StudyStreak';
import AcademicGoals from '../components/settings/AcademicGoals';
import WeeklySummary from '../components/settings/WeeklySummary';
import DataStorage from '../components/settings/DataStorage';

const TAB_KEYWORDS = {
  overview: ['overview', 'profile', 'summary', 'stats', 'student', 'alex', 'status'],
  academic: ['academic', 'college', 'university', 'degree', 'major', 'branch', 'semester', 'courses', 'subjects', 'gpa', 'cgpa', 'scale', 'roll', 'attendance target'],
  notifications: ['notifications', 'alerts', 'sound', 'exam reminder', 'warning', 'toast', 'timetable alert', 'chime', 'bells'],
  study: ['study', 'pomodoro', 'timer', 'focus', 'break', 'schedule', 'goal', 'hours', 'windows', 'days'],
  appearance: ['appearance', 'theme', 'dark', 'light', 'emerald', 'cream', 'vanilla', 'system', 'font', 'size', 'density', 'motion', 'reduced'],
  security: ['security', 'privacy', 'password', 'pin', 'lock', 'stealth', 'session', 'danger', 'delete', 'reset'],
  streak: ['streak', 'flame', 'habits', 'heatmap', 'calendar', 'milestone', 'badges', 'longest', 'record'],
  goals: ['goals', 'target', 'milestones', 'objectives', 'progress', 'deadline', 'priority'],
  summary: ['summary', 'weekly', 'chart', 'analytics', 'report', 'distribution', 'productive', 'kpi'],
  data: ['data', 'storage', 'backup', 'export', 'import', 'csv', 'json', 'mongodb', 'database', 'cloud', 'cache'],
};

const Settings = () => {
  const {
    settings,
    updateSettings,
    theme,
    setTheme,
    toggleTheme,
    attendance,
    attendanceSubjects,
    addAttendanceSubject,
    updateAttendanceSubject,
    deleteAttendanceSubject,
    studySessions,
    tasks,
    exams,
    notes,
    dbStatus,
    checkDbConnection,
    lockScreen,
    exportFullBackup,
    importFullBackup,
    clearUserData,
    clearAllData,
    resetToDemoData,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [saveSuccessBanner, setSaveSuccessBanner] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Password Update State
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState({ type: '', text: '' });

  // Modals
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync tab with URL search parameter
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Form State initialized from settings
  const [formData, setFormData] = useState({
    studentName: settings?.studentName || 'Alex Morgan',
    email: settings?.email || 'alex@university.edu',
    collegeName: settings?.collegeName || 'State Tech University',
    semester: settings?.semester || 'Semester 5 (Fall 2026)',
    academicBranch: settings?.academicBranch || 'Computer Science & Engineering',
    cgpaTarget: settings?.cgpaTarget || '8.5',
    gpaScale: settings?.gpaScale || '10.0',
    rollNumber: settings?.rollNumber || '21CS042',
    academicYear: settings?.academicYear || '2026-2027',
    targetAttendance: settings?.targetAttendance || 75,
    dailyStudyGoalMinutes: settings?.dailyStudyGoalMinutes || 120,
    preferredStudyDays: settings?.preferredStudyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    preferredWindows: settings?.preferredWindows || ['evening', 'night'],
    pomodoroWorkMin: settings?.pomodoroWorkMin || 25,
    pomodoroShortBreakMin: settings?.pomodoroShortBreakMin || 5,
    pomodoroLongBreakMin: settings?.pomodoroLongBreakMin || 15,
    autoStartBreaks: settings?.autoStartBreaks !== false,
    soundAlerts: settings?.soundAlerts !== false,
    inAppToasts: settings?.inAppToasts !== false,
    examReminderDays: settings?.examReminderDays || 3,
    classReminder: settings?.classReminder !== false,
    classReminderTiming: settings?.classReminderTiming || '15',
    shortageNotification: settings?.shortageNotification !== false,
    dailyReminderToast: settings?.dailyReminderToast !== false,
    streakRiskAlert: settings?.streakRiskAlert !== false,
    weeklyDigest: settings?.weeklyDigest !== false,
    privacyPin: settings?.privacyPin || '',
    screenLockTimeout: settings?.screenLockTimeout || 0,
    stealthLibraryMode: !!settings?.stealthLibraryMode,
    fontSize: settings?.fontSize || 'medium',
    density: settings?.density || 'comfortable',
    reducedMotion: !!settings?.reducedMotion,
    academicGoals: settings?.academicGoals || [],
  });

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChangeField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);

    // Live sync for interface attributes so changes are immediate
    if (field === 'fontSize') {
      document.documentElement.setAttribute('data-font-size', value);
    } else if (field === 'density') {
      document.documentElement.setAttribute('data-density', value);
    } else if (field === 'reducedMotion') {
      document.documentElement.setAttribute('data-reduced-motion', value ? 'true' : 'false');
    }
  };

  // Compute Streak Stats from actual studySessions
  const streakStats = useMemo(() => {
    const sessionsByDate = {};
    studySessions.forEach((s) => {
      if (!s.date) return;
      sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + (Number(s.durationMinutes) || 0);
    });

    const uniqueDates = Object.keys(sessionsByDate).sort();
    if (uniqueDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
    }

    const parsedDates = uniqueDates.map((d) => new Date(d + 'T00:00:00'));
    let longest = 1;
    let temp = 1;

    for (let i = 1; i < parsedDates.length; i++) {
      const diffMs = parsedDates[i] - parsedDates[i - 1];
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        temp++;
        longest = Math.max(longest, temp);
      } else if (diffDays > 1) {
        temp = 1;
      }
    }

    const todayStr = getTodayDateString();
    let current = 0;
    let checkDate = new Date(todayStr + 'T00:00:00');

    if (!sessionsByDate[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      if (sessionsByDate[key]) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak: current,
      longestStreak: Math.max(longest, current),
      totalDays: uniqueDates.length,
    };
  }, [studySessions]);

  // Compute Weekly Study Hours
  const weeklyHours = useMemo(() => {
    const today = new Date(getTodayDateString() + 'T00:00:00');
    const past7Keys = new Set();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      past7Keys.add(`${y}-${m}-${day}`);
    }

    const minutes = studySessions
      .filter((s) => past7Keys.has(s.date))
      .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);

    return Math.round((minutes / 60) * 10) / 10;
  }, [studySessions]);

  // Overall attendance percent
  const { percentage: overallAttendancePercent } = calculateOverallAttendance(attendance);

  // Dynamic Navigation Badges
  const navigationBadges = useMemo(() => {
    return {
      overview: `${overallAttendancePercent}%`,
      academic: attendanceSubjects.length,
      notifications: formData.shortageNotification ? 'Active' : 'Muted',
      study: `${(formData.dailyStudyGoalMinutes / 60).toFixed(1)}h`,
      appearance: theme === 'dark' ? 'Emerald' : theme === 'light' ? 'Vanilla' : 'Auto',
      security: formData.privacyPin ? 'PIN Set' : 'Open',
      streak: `${streakStats.currentStreak}d`,
      goals: (formData.academicGoals && formData.academicGoals.length > 0 ? formData.academicGoals.length : 4),
      summary: '7d',
      data: 'Cloud',
    };
  }, [
    overallAttendancePercent,
    attendanceSubjects.length,
    formData.shortageNotification,
    formData.dailyStudyGoalMinutes,
    formData.privacyPin,
    formData.academicGoals,
    theme,
    streakStats.currentStreak,
  ]);

  // Search Filtering
  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_TABS;
    const q = searchQuery.toLowerCase().trim();

    return SETTINGS_TABS.filter((tab) => {
      if (tab.label.toLowerCase().includes(q)) return true;
      const keywords = TAB_KEYWORDS[tab.id] || [];
      return keywords.some((k) => k.includes(q) || q.includes(k));
    });
  }, [searchQuery]);

  // If search query produces matching tabs and activeTab is not in filtered list, auto-switch to first match
  useEffect(() => {
    if (searchQuery.trim() && filteredTabs.length > 0) {
      if (!filteredTabs.some((t) => t.id === activeTab)) {
        setActiveTab(filteredTabs[0].id);
      }
    }
  }, [searchQuery, filteredTabs, activeTab]);

  // Save Settings Handler with validation
  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    const errors = {};

    if (!formData.studentName.trim()) {
      errors.studentName = 'Student name cannot be empty.';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const att = Number(formData.targetAttendance);
    if (isNaN(att) || att < 1 || att > 100) {
      errors.targetAttendance = 'Attendance target must be between 1% and 100%.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setActiveTab('academic');
      return;
    }

    setValidationErrors({});
    setIsSaving(true);

    setTimeout(() => {
      updateSettings({
        studentName: formData.studentName.trim(),
        email: formData.email.trim(),
        collegeName: formData.collegeName.trim(),
        semester: formData.semester.trim(),
        academicBranch: formData.academicBranch.trim(),
        cgpaTarget: formData.cgpaTarget.trim(),
        gpaScale: formData.gpaScale,
        rollNumber: formData.rollNumber.trim(),
        academicYear: formData.academicYear.trim(),
        targetAttendance: Math.min(100, Math.max(1, parseInt(formData.targetAttendance, 10) || 75)),
        dailyStudyGoalMinutes: Math.min(720, Math.max(15, parseInt(formData.dailyStudyGoalMinutes, 10) || 120)),
        preferredStudyDays: formData.preferredStudyDays,
        preferredWindows: formData.preferredWindows,
        pomodoroWorkMin: parseInt(formData.pomodoroWorkMin, 10) || 25,
        pomodoroShortBreakMin: parseInt(formData.pomodoroShortBreakMin, 10) || 5,
        pomodoroLongBreakMin: parseInt(formData.pomodoroLongBreakMin, 10) || 15,
        autoStartBreaks: formData.autoStartBreaks,
        soundAlerts: formData.soundAlerts,
        inAppToasts: formData.inAppToasts,
        examReminderDays: parseInt(formData.examReminderDays, 10) || 3,
        classReminder: formData.classReminder,
        classReminderTiming: formData.classReminderTiming,
        shortageNotification: formData.shortageNotification,
        dailyReminderToast: formData.dailyReminderToast,
        streakRiskAlert: formData.streakRiskAlert,
        weeklyDigest: formData.weeklyDigest,
        privacyPin: formData.privacyPin.trim().slice(0, 4),
        screenLockTimeout: formData.screenLockTimeout,
        stealthLibraryMode: formData.stealthLibraryMode,
        fontSize: formData.fontSize,
        density: formData.density,
        reducedMotion: formData.reducedMotion,
        academicGoals: formData.academicGoals,
      });

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(nowTime);
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setSaveSuccessBanner('Settings & personalization saved successfully!');
      setTimeout(() => setSaveSuccessBanner(''), 3500);
    }, 450);
  };

  // Password Change Handler
  const handleChangePassword = async (passwords, onSuccess) => {
    setPasswordNotice({ type: '', text: '' });

    if (!passwords.currentPassword) {
      setPasswordNotice({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordNotice({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordNotice({ type: 'error', text: 'New passwords do not match. Please verify.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordNotice({ type: 'success', text: 'Password updated successfully! Your account credentials are secure.' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setPasswordNotice({
        type: 'error',
        text: err.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Goals Update Handler
  const handleUpdateGoals = (newGoals) => {
    handleChangeField('academicGoals', newGoals);
    updateSettings({ academicGoals: newGoals });
  };

  return (
    <div className="settings-workspace animate-fade-in">
      {/* ====================================================================
          Section 2: Settings Navigation Sidebar (230–250px, Sticky)
          ==================================================================== */}
      <SettingsSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        badges={navigationBadges}
      />

      {/* ====================================================================
          Section 3: Main Settings Workspace Content (Flexible, full remaining width)
          ==================================================================== */}
      <main className="settings-main-content">
        {/* A. Header: Title, Subtitle, Search bar, Save Changes, Last Saved */}
        <SettingsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          lastSavedTime={lastSavedTime}
          onSave={handleSaveAll}
        />

        {/* Global Success Banner */}
        {saveSuccessBanner && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            <span>✓ {saveSuccessBanner}</span>
          </div>
        )}

        {/* Dynamic Section Content based on activeTab */}
        {activeTab === 'overview' && (
          <SettingsOverview
            formData={formData}
            attendance={attendance}
            studySessions={studySessions}
            tasks={tasks}
            exams={exams}
            streakStats={streakStats}
            weeklyHours={weeklyHours}
            onNavigateTab={handleSelectTab}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicPreferences
            formData={formData}
            onChangeField={handleChangeField}
            attendanceSubjects={attendanceSubjects}
            onAddSubject={addAttendanceSubject}
            onDeleteSubject={deleteAttendanceSubject}
            errors={validationErrors}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings
            formData={formData}
            onChangeField={handleChangeField}
          />
        )}

        {activeTab === 'study' && (
          <StudyPreferences
            formData={formData}
            onChangeField={handleChangeField}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceSettings
            currentTheme={theme}
            onThemeSelect={(t) => {
              setTheme(t);
              handleChangeField('theme', t);
            }}
            formData={formData}
            onChangeField={handleChangeField}
          />
        )}

        {activeTab === 'security' && (
          <PrivacySecurity
            formData={formData}
            onChangeField={handleChangeField}
            onLockScreenNow={lockScreen}
            onChangePassword={handleChangePassword}
            passwordLoading={passwordLoading}
            passwordNotice={passwordNotice}
            onOpenClearConfirm={() => setShowClearConfirm(true)}
            onOpenResetConfirm={() => setShowResetConfirm(true)}
          />
        )}

        {activeTab === 'streak' && (
          <StudyStreak
            studySessions={studySessions}
          />
        )}

        {activeTab === 'goals' && (
          <AcademicGoals
            goals={formData.academicGoals}
            onUpdateGoals={handleUpdateGoals}
          />
        )}

        {activeTab === 'summary' && (
          <WeeklySummary
            studySessions={studySessions}
            tasks={tasks}
            attendance={attendance}
            dailyStudyGoalMinutes={formData.dailyStudyGoalMinutes}
          />
        )}

        {activeTab === 'data' && (
          <DataStorage
            dbStatus={dbStatus}
            onCheckDb={checkDbConnection}
            onExportFullBackup={exportFullBackup}
            onImportFullBackup={importFullBackup}
            tasks={tasks}
            notes={notes}
            attendance={attendance}
            studySessions={studySessions}
            onOpenClearConfirm={() => setShowClearConfirm(true)}
            onOpenResetConfirm={() => setShowResetConfirm(true)}
          />
        )}
      </main>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearUserData();
          setSaveSuccessBanner('All user academic records wiped.');
          setTimeout(() => setSaveSuccessBanner(''), 3000);
        }}
        title="Wipe All Academic Records?"
        message="This will permanently delete all your tasks, classes, attendance records, study logs, and notes. This action cannot be reversed."
        confirmText="Yes, Wipe All Data"
        danger={true}
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetToDemoData();
          setSaveSuccessBanner('Curriculum reset to default demo dataset.');
          setTimeout(() => setSaveSuccessBanner(''), 3000);
        }}
        title="Reset to Demo Data?"
        message="This will restore the default curriculum (CN, MFEF, TRAINING, OT, API, ML) with sample tasks, timetable, exams, and attendance logs."
        confirmText="Reset Demo Data"
        danger={false}
      />
    </div>
  );
};

export default Settings;
