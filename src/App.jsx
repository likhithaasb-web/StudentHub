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
import Settings from './pages/Settings';
import Login from './pages/Login';

// Protects all dashboard routes: redirects unauthenticated users directly to /login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirects already authenticated users to the dashboard if they visit /login
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) {
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

      {/* Main Dashboard & Feature Pages (Protected) */}
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
        <Route path="attendance" element={<Attendance />} />
        <Route path="study-planner" element={<StudyPlanner />} />
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
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
