import React from 'react';
import { useApp } from '../context/AppContext';
import { getGreeting, getFormattedCurrentDate, getDaysRemaining } from '../utils/dateUtils';
import { calculateOverallAttendance } from '../utils/attendanceUtils';
import StatCard from '../components/dashboard/StatCard';
import WeeklyStudyChart from '../components/dashboard/WeeklyStudyChart';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import TodayScheduleCard from '../components/dashboard/TodayScheduleCard';
import UpcomingDeadlinesCard from '../components/dashboard/UpcomingDeadlinesCard';
import RecentNotesCard from '../components/dashboard/RecentNotesCard';
import {
  CheckSquare,
  CheckCircle2,
  GraduationCap,
  Percent,
  Plus,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const {
    tasks,
    timetable,
    exams,
    notes,
    attendance,
    studySessions,
    settings,
    openQuickAction,
  } = useApp();

  const greeting = getGreeting();
  const currentDate = getFormattedCurrentDate();

  // Dynamic calculations from actual saved data
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;

  const upcomingExamsCount = exams.filter((e) => {
    if (e.completed) return false;
    const days = getDaysRemaining(e.date);
    return days >= 0;
  }).length;

  const { percentage: overallAttendance } = calculateOverallAttendance(attendance);
  const target = settings.targetAttendance || 75;
  const isAttendanceSafe = overallAttendance >= target;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'var(--gradient-card)',
          borderColor: 'var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          padding: '1.75rem 2rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 300,
            height: '100%',
            background: 'var(--gradient-glow)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                <Sparkles size={12} /> Student Dashboard
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentDate}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {greeting}, {settings.studentName || 'Student'}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              {pendingTasksCount > 0
                ? `You have ${pendingTasksCount} pending ${pendingTasksCount === 1 ? 'task' : 'tasks'} and ${upcomingExamsCount} upcoming ${upcomingExamsCount === 1 ? 'exam' : 'exams'}. Let's make progress!`
                : 'All your tasks are up to date! Great job staying organized.'}
            </p>
          </div>

          {/* Quick-action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => openQuickAction('task')}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              <Plus size={16} /> Add Task
            </button>
            <button
              onClick={() => openQuickAction('note')}
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              <FileText size={16} /> Add Note
            </button>
            <button
              onClick={() => openQuickAction('exam')}
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              <Calendar size={16} /> Add Exam
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-4">
        <StatCard
          title="Pending Assignments"
          value={pendingTasksCount}
          subtitle={pendingTasksCount === 0 ? 'No pending tasks' : `${tasks.length} total assignments`}
          icon={CheckSquare}
          color="var(--primary)"
          bgColor="var(--primary-light)"
          linkTo="/tasks"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasksCount}
          subtitle={`${tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% completion rate`}
          icon={CheckCircle2}
          color="#38b289"
          bgColor="rgba(56, 178, 137, 0.16)"
          linkTo="/tasks"
        />
        <StatCard
          title="Upcoming Exams"
          value={upcomingExamsCount}
          subtitle={upcomingExamsCount > 0 ? 'Next exam coming up' : 'No upcoming exams'}
          icon={GraduationCap}
          color="#B76E79"
          bgColor="rgba(183, 110, 121, 0.16)"
          linkTo="/exams"
        />
        <StatCard
          title="Overall Attendance"
          value={`${overallAttendance}%`}
          subtitle={
            attendance.length === 0
              ? 'No classes added'
              : isAttendanceSafe
              ? `Above target (${target}%)`
              : `Below target (${target}%)`
          }
          icon={Percent}
          color={isAttendanceSafe ? '#38b289' : '#f87171'}
          bgColor={isAttendanceSafe ? 'rgba(56, 178, 137, 0.16)' : 'rgba(248, 113, 113, 0.16)'}
          linkTo="/attendance"
        />
      </div>

      {/* Charts Section */}
      <div className="grid-2">
        <WeeklyStudyChart studySessions={studySessions} />
        <TaskStatusChart tasks={tasks} />
      </div>

      {/* Triplet Section: Schedule, Deadlines, Notes */}
      <div className="grid-3">
        <TodayScheduleCard timetable={timetable} />
        <UpcomingDeadlinesCard tasks={tasks} />
        <RecentNotesCard notes={notes} />
      </div>
    </div>
  );
};

export default Dashboard;
