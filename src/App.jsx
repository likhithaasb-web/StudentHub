import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Notes from './pages/Notes';
import Attendance from './pages/Attendance';
import StudyPlanner from './pages/StudyPlanner';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
