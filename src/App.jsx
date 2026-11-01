import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Notes from './pages/Notes';
import Attendance from './pages/Attendance';
import StudyPlanner from './pages/StudyPlanner';
import CareerStudio from './pages/CareerStudio';
import AiTutor from './pages/AiTutor';
import PublicResume from './pages/PublicResume';
import PublicNote from './pages/PublicNote';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ErrorBoundary from './components/common/ErrorBoundary';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import StudentManagement from './pages/admin/StudentManagement';
import AcademicManagement from './pages/admin/AcademicManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import AssignmentManagement from './pages/admin/AssignmentManagement';
import ExaminationManagement from './pages/admin/ExaminationManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminManagement from './pages/admin/AdminManagement';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// Protects all dashboard routes: redirects unauthenticated users directly to /login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protects admin routes: redirects unauthenticated users to /login?portal=admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login?portal=admin" replace />;
  }
  return children;
};

// Redirects already authenticated users to their corresponding dashboard if they visit /login
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useApp();
  if (isAuthenticated) {
    if (userRole === 'admin' || userRole === 'superadmin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Route: Opens by default when not logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Public Shareable Resume Route (Open to recruiters without login) */}
      <Route path="/r/:shareId" element={<PublicResume />} />

      {/* Public Shareable Note Route (Open to classmates without login) */}
      <Route path="/notes/share/:shareId" element={<PublicNote />} />

      {/* Completely Separate Admin Dashboard Portal */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="academics" element={<AcademicManagement />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="assignments" element={<AssignmentManagement />} />
        <Route path="exams" element={<ExaminationManagement />} />
        <Route path="announcements" element={<AnnouncementManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="management" element={<AdminManagement />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Main Student Dashboard & Feature Pages (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="exams" element={<Exams />} />
        <Route path="notes" element={<Notes />} />
        <Route path="ai" element={<AiTutor />} />
        <Route path="ai-tutor" element={<Navigate to="/ai" replace />} />
        <Route path="academic-copilot" element={<Navigate to="/ai" replace />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="study-planner" element={<StudyPlanner />} />
        <Route path="career" element={<CareerStudio />} />
        <Route path="career-studio" element={<Navigate to="/career" replace />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
